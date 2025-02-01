import { test, expect, APIRequestContext, request } from '@playwright/test';
import { MoviePageObject } from 'test/pageObjects/moviePageObject';

let apiContext: APIRequestContext;
let moviePage: MoviePageObject;

let movieId: string;

test.describe('/movies', () => {
  test.beforeAll(async ({ baseURL }) => {
    apiContext = await request.newContext({
      baseURL,
    });
    moviePage = new MoviePageObject(apiContext); // Passa o contexto criado manualmente
  });

  test.afterAll(async () => {
    await apiContext.dispose(); // Descarte o contexto de requisição
  });

  test.afterEach(async () => {
    if (movieId) {
      await moviePage.deletarFilme(movieId);
    }
  });

  test.describe('POST /movies', () => {
    test.only('Deve criar um novo filme com sucesso com dados válidos', async () => {
      const filmeCriado = await moviePage.criarFilme(null);
      if (filmeCriado.responseBody._id) {
        movieId = filmeCriado.responseBody._id;
      }

      expect(filmeCriado.status).toBe(201);
      expect(filmeCriado.responseBody).toHaveProperty('_id');
    });

    test('Deve retornar erro ao criar um filme com título duplicado', async () => {
      const filmeCriado = await moviePage.criarFilme(null);
      if (filmeCriado.responseBody._id) {
        movieId = filmeCriado.responseBody._id;
      }

      expect(filmeCriado.status).toBe(201);

      const cadastroRepetido = await moviePage.criarFilme(
        filmeCriado.dadosDoFilme,
      );

      expect(cadastroRepetido.status).toBe(400);
    });

    test('Deve retornar erro ao criar um filme com o título vazio', async () => {
      const filmeCriado = await moviePage.criarFilme({ title: '' });
      if (filmeCriado.responseBody._id) {
        movieId = filmeCriado.responseBody._id;
      }

      expect(filmeCriado.status).toBe(400);
    });

    test('Deve retornar erro ao criar um filme com a data de lançamento vazia', async () => {
      const filmeCriado = await moviePage.criarFilme({ launchdate: '' });
      if (filmeCriado.responseBody._id) {
        movieId = filmeCriado.responseBody._id;
      }

      expect(filmeCriado.status).toBe(400);
    });

    test('Deve retornar erro ao criar um filme com a descrição vazia', async () => {
      const filmeCriado = await moviePage.criarFilme({ description: '' });
      if (filmeCriado.responseBody._id) {
        movieId = filmeCriado.responseBody._id;
      }

      expect(filmeCriado.status).toBe(400);
    });

    test('Deve retornar erro ao criar um filme com a data de exibição vazia', async () => {
      const filmeCriado = await moviePage.criarFilme({ showtimes: '' });
      if (filmeCriado.responseBody._id) {
        movieId = filmeCriado.responseBody._id;
      }

      expect(filmeCriado.status).toBe(400);
    });
  });

  test.describe('PUT /movies', () => {
    test('Deve atualizar um filme existente com dados válidos', async () => {
      const filmeCriado = await moviePage.criarFilme(null);
      if (filmeCriado.responseBody._id) {
        movieId = filmeCriado.responseBody._id;
      }

      const response = await moviePage.alterarFilme(movieId, {
        title: 'Alteração no título', // Novo título
      });

      expect(response.status).toBe(200);
      expect(response.responseBody).toHaveProperty(
        'title',
        'Alteração no título',
      );
    });

    test('Deve retornar erro ao atualizar um filme com o título vazio', async () => {
      const filmeCriado = await moviePage.criarFilme(null);
      if (filmeCriado.responseBody._id) {
        movieId = filmeCriado.responseBody._id;
      }

      const response = await moviePage.alterarFilme(movieId, {
        title: '', // Novo título
      });

      expect(response.status).toBe(400);
    });

    test('Deve retornar erro ao atualizar um filme com a data de lançamento vazia', async () => {
      const filmeCriado = await moviePage.criarFilme(null);
      if (filmeCriado.responseBody._id) {
        movieId = filmeCriado.responseBody._id;
      }

      const response = await moviePage.alterarFilme(movieId, {
        launchdate: '', // Nova data de lançamento
      });

      expect(response.status).toBe(400);
    });

    test('Deve retornar erro ao atualizar um filme com a descrição vazia', async () => {
      const filmeCriado = await moviePage.criarFilme(null);
      if (filmeCriado.responseBody._id) {
        movieId = filmeCriado.responseBody._id;
      }

      const response = await moviePage.alterarFilme(movieId, {
        description: '', // Nova descrição
      });

      expect(response.status).toBe(400);
    });

    test('Deve retornar erro ao atualizar um filme com a data de exibição vazia', async () => {
      const filmeCriado = await moviePage.criarFilme(null);
      if (filmeCriado.responseBody._id) {
        movieId = filmeCriado.responseBody._id;
      }

      const response = await moviePage.alterarFilme(movieId, {
        showtimes: '', // Nova data de exibição
      });

      expect(response.status).toBe(400);
    });
  });

  test.describe('GET /movies', () => {
    test('Deve listar todos os filmes', async () => {
      const listaDeFilmes = await moviePage.listarFilmes();

      expect(listaDeFilmes.status).toBe(200);
      expect(listaDeFilmes.responseBody).toBeInstanceOf(Array);
    });

    test('Deve obter detalhes de um filme existente', async () => {
      const filmeCriado = await moviePage.criarFilme(null);
      if (filmeCriado.responseBody._id) {
        movieId = filmeCriado.responseBody._id;
      }

      const filme = await moviePage.obterFilme(movieId);

      expect(filme.status).toBe(200);
      expect(filme.responseBody).toHaveProperty(
        'title',
        filmeCriado.responseBody.title,
      );
      expect(filme.responseBody).toHaveProperty(
        'description',
        filmeCriado.responseBody.description,
      );
      expect(filme.responseBody).toHaveProperty(
        'launchdate',
        filmeCriado.responseBody.launchdate,
      );
      expect(filme.responseBody).toHaveProperty(
        'showtimes',
        filmeCriado.responseBody.showtimes,
      );
      expect(filme.responseBody).toHaveProperty('_id', movieId);
    });

    test('Deve retornar erro ao obter detalhes de um filme inexistente', async () => {
      const response = await moviePage.obterFilme('filme inexistente');

      console.log('Resposta:', response);

      expect(response.status).toBe(404);
      expect(response.responseBody).toHaveProperty('error', 'Not Found');
    });
  });

  test.describe('DELETE /movies', () => {
    test('Deve deletar um filme existente', async () => {
      const filmeCriado = await moviePage.criarFilme(null);
      if (filmeCriado.responseBody._id) {
        movieId = filmeCriado.responseBody._id;
      }

      const response = await moviePage.deletarFilme(movieId);

      expect(response.status).toBe(204);
    });

    test('Deve retornar erro ao deletar um filme inexistente', async () => {
      const response = await moviePage.deletarFilme('filme inexistente');

      expect(response.status).toBe(404);
    });
  });
});
