import { test, expect, APIRequestContext, request } from '@playwright/test';
import { MoviePageObject } from 'src/pageObjects/moviePageObject';

let apiContext: APIRequestContext;
let moviePage: MoviePageObject;
test.describe('API de Filmes', () => {
  test.beforeAll(async ({ baseURL }) => {
    apiContext = await request.newContext({
      baseURL, // Certifique-se de que o baseURL esteja configurado no playwright.config.ts
    });
    moviePage = new MoviePageObject(apiContext); // Passa o contexto criado manualmente
  });

  test.afterAll(async () => {
    await apiContext.dispose(); // Descarte o contexto de requisição
  });

  test('Deve criar um novo filme com sucesso', async () => {
    const response = await moviePage.criarFilme();

    expect(response.status()).toBe(201);
  });

  test.only('Deve atualizar um filme existente', async () => {
    const response = await moviePage.alterarFilme('rYC0RAs9yIofwdgh', {
      title: 'Alteração no título', // Novo título
    });

    console.log('Resposta', response);
    // expect(response.status()).toBe(201);
    // expect(response.responseBody).toHaveProperty('title', 'Inception 2');
  });

  test('Deve listar todos os filmes', async () => {
    const response = await moviePage.listarFilmes();

    console.log('Resposta:', response.responseBody);

    expect(response.status).toBe(200);
    expect(response.responseBody).toBeInstanceOf(Array);
  });

  test('Deve obter detalhes de um filme existente', async () => {
    const response = await moviePage.obterFilme('rYC0RAs9yIofwdgh'); // Assumindo ID 1

    expect(response.status).toBe(200);
    expect(response.responseBody).toHaveProperty('title');
    expect(response.responseBody).toHaveProperty('description');
    expect(response.responseBody).toHaveProperty('launchdate');
    expect(response.responseBody).toHaveProperty('showtimes');
    expect(response.responseBody).toHaveProperty('_id', 'rYC0RAs9yIofwdgh');
  });

  test('Deve deletar um filme existente', async () => {
    const response = await moviePage.deletarFilme('GhXyDLyO293fxQyT'); // Assumindo ID 1

    // expect(response.status()).toBe(204);
  });

  //   test('Deve retornar erro ao criar um filme com título duplicado', async ({
  //     request,
  //   }) => {
  //     const response = await request.post('/movies', {
  //       data: {
  //         title: 'Inception', // Duplicado
  //         genre: 'Sci-Fi',
  //         releaseYear: 2010,
  //       },
  //     });
  //     expect(response.status()).toBe(400);
  //     const body = await response.json();
  //     expect(body.message).toContain('Título já cadastrado');
  //   });

  //   test('Deve obter detalhes de um filme existente', async ({ request }) => {
  //     const response = await request.get('/movies/1'); // Assumindo ID 1
  //     expect(response.status()).toBe(200);
  //     const body = await response.json();
  //     expect(body).toHaveProperty('id', 1);
  //     expect(body.title).toBe('Inception');
  //   });

  //   test('Deve retornar erro ao buscar um filme inexistente', async ({
  //     request,
  //   }) => {
  //     const response = await request.get('/movies/9999'); // ID inexistente
  //     expect(response.status()).toBe(404);
  //   });
});
