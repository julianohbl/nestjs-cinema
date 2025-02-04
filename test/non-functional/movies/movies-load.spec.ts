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
    test('O tempo médio de resposta para a criação de um novo filme não deve exceder 200 milissegundos', async () => {
      const filmeCriado = await moviePage.criarFilme(null);
      movieId = filmeCriado.responseBody._id;

      expect(filmeCriado.tempoExecucao).toBeLessThan(200);
    });
  });

  test.describe('PUT /movies', () => {
    test('O tempo médio de resposta para a atualização dos detalhes de um filme não deve exceder 300 milissegundos', async () => {
      const filmeCriado = await moviePage.criarFilme(null);
      movieId = filmeCriado.responseBody._id;

      const response = await moviePage.alterarFilme(movieId, {
        title: 'Alteração no título', // Novo título
      });

      expect(response.tempoExecucao).toBeLessThan(300);
    });
  });

  test.describe('GET /movies', () => {
    test('A API deve ser capaz de responder a solicitações GET de listagem de filmes em menos de 100 milissegundos', async () => {
      const response = await moviePage.listarFilmes();

      expect(response.tempoExecucao).toBeLessThan(100);
    });

    test('A API deve ser capaz de responder a solicitações GET de detalhes de um filme em menos de 50 milissegundos', async () => {
      const filmeCriado = await moviePage.criarFilme(null);
      movieId = filmeCriado.responseBody._id;

      const response = await moviePage.obterFilme(movieId);

      expect(response.tempoExecucao).toBeLessThan(50);
    });
  });

  test.describe('DELETE /movies', () => {
    test('O tempo médio de resposta para a exclusão de um filme não deve exceder 400 milissegundos', async () => {
      const filmeCriado = await moviePage.criarFilme(null);

      const movieId = filmeCriado.responseBody._id;

      const response = await moviePage.deletarFilme(movieId);

      expect(response.tempoExecucao).toBeLessThan(400);
    });
  });
});
