import { test, expect, APIRequestContext, request } from '@playwright/test';
import { MoviePageObject } from 'src/pageObjects/moviePageObject';

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
    test('Deve criar um novo filme com sucesso com dados válidos', async () => {
      const filmeCriado = await moviePage.criarFilme(null);
      movieId = filmeCriado.responseBody._id;

      console.log('Corpo da resposta', filmeCriado);
      console.log('ID do filme cadastrado:', movieId);

      expect(filmeCriado.status).toBe(201);
      expect(filmeCriado.responseBody).toHaveProperty('_id');
    });

    test('Deve retornar erro ao criar um filme com título duplicado', async () => {
      const filmeCriado = await moviePage.criarFilme(null);

      console.log('Corpo da resposta', filmeCriado);
      console.log('Status da resposta', filmeCriado.status);
      expect(filmeCriado.status).toBe(201);
      const cadastroRepetido = await moviePage.criarFilme(
        filmeCriado.dadosDoFilme,
      );

      console.log('Corpo da resposta', cadastroRepetido);
      console.log('Status da resposta', cadastroRepetido.status);
      expect(cadastroRepetido.status).toBe(400);
    });

    test('Deve retornar erro ao criar um filme com o título vazio', async () => {
      const filmeCriado = await moviePage.criarFilme({ title: '' });

      console.log('Corpo da resposta', filmeCriado);
      console.log('Status da resposta', filmeCriado.status);
      expect(filmeCriado.status).toBe(400);
    });

    test('Deve retornar erro ao criar um filme com a data de lançamento vazia', async () => {
      const filmeCriado = await moviePage.criarFilme({ launchdate: '' });

      console.log('Corpo da resposta', filmeCriado);
      console.log('Status da resposta', filmeCriado.status);
      expect(filmeCriado.status).toBe(400);
    });

    test('Deve retornar erro ao criar um filme com a descrição vazia', async () => {
      const filmeCriado = await moviePage.criarFilme({ description: '' });

      console.log('Corpo da resposta', filmeCriado);
      console.log('Status da resposta', filmeCriado.status);
      expect(filmeCriado.status).toBe(400);
    });

    test('Deve retornar erro ao criar um filme com a data de exibição vazia', async () => {
      const filmeCriado = await moviePage.criarFilme({ showtimes: '' });

      console.log('Corpo da resposta', filmeCriado);
      console.log('Status da resposta', filmeCriado.status);
      expect(filmeCriado.status).toBe(400);
    });
  });

  test.describe('PUT /movies', () => {
    test('Deve atualizar um filme existente com dados válidos', async () => {
      const response = await moviePage.alterarFilme('rYC0RAs9yIofwdgh', {
        title: 'Alteração no título', // Novo título
      });

      console.log('Resposta', response);
      expect(response.status).toBe(200);
      expect(response.responseBody).toHaveProperty(
        'title',
        'Alteração no título',
      );
    });

    test('Deve retornar erro ao atualizar um filme com o título vazio', async () => {
      const response = await moviePage.alterarFilme('rYC0RAs9yIofwdgh', {
        title: '', // Novo título
      });

      console.log('Resposta', response);
      expect(response.status).toBe(400);
    });

    test('Deve retornar erro ao atualizar um filme com a data de lançamento vazia', async () => {
      const response = await moviePage.alterarFilme('rYC0RAs9yIofwdgh', {
        launchdate: '', // Nova data de lançamento
      });

      console.log('Resposta', response);
      expect(response.status).toBe(400);
    });

    test('Deve retornar erro ao atualizar um filme com a descrição vazia', async () => {
      const response = await moviePage.alterarFilme('rYC0RAs9yIofwdgh', {
        description: '', // Nova descrição
      });

      console.log('Resposta', response);
      expect(response.status).toBe(400);
    });

    test('Deve retornar erro ao atualizar um filme com a data de exibição vazia', async () => {
      const response = await moviePage.alterarFilme('rYC0RAs9yIofwdgh', {
        showtimes: '', // Nova data de exibição
      });

      console.log('Resposta', response);
      expect(response.status).toBe(400);
    });
  });

  test.describe('GET /movies', () => {
    test('Deve listar todos os filmes', async () => {
      const response = await moviePage.listarFilmes();

      console.log('Resposta:', response.responseBody);

      expect(response.status).toBe(200);
      expect(response.responseBody).toBeInstanceOf(Array);
    });

    test('Deve obter detalhes de um filme existente', async () => {
      const response = await moviePage.obterFilme('rYC0RAs9yIofwdgh');

      expect(response.status).toBe(200);
      expect(response.responseBody).toHaveProperty('title');
      expect(response.responseBody).toHaveProperty('description');
      expect(response.responseBody).toHaveProperty('launchdate');
      expect(response.responseBody).toHaveProperty('showtimes');
      expect(response.responseBody).toHaveProperty('_id', 'rYC0RAs9yIofwdgh');
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

      const movieId = filmeCriado.responseBody._id;

      const response = await moviePage.deletarFilme(movieId);

      console.log('Resposta:', response);
      expect(response.status).toBe(204);
    });

    test('Deve retornar erro ao deletar um filme inexistente', async () => {
      const response = await moviePage.deletarFilme('filme inexistente'); // Assumindo ID 1

      console.log('Resposta:', response);
      expect(response.status).toBe(404);
    });
  });
});
