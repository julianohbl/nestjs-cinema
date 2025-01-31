import { test, expect, request, APIRequestContext } from '@playwright/test';
import { executarTesteDeCarga } from '../../utils/performance-helpers';
import { MoviePageObject } from 'src/pageObjects/moviePageObject';

let apiContext: APIRequestContext;
let moviePage: MoviePageObject;
let quantidade: number;
let listaDeIds: string[];

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
    if (listaDeIds) {
      for (const id of listaDeIds) {
        await moviePage.deletarFilme(id);
      }
    }
  });

  test.only('A API deve ser capaz de processar 100 solicitações de criação de filmes por segundo', async () => {
    quantidade = 100; // Número de solicitações
    const { tempoExecucao, sucessos, listId } = await executarTesteDeCarga(
      () => moviePage.criarFilme(null),
      quantidade,
    );

    listaDeIds = listId;

    console.log(
      `Tempo total para ${quantidade} solicitações: ${tempoExecucao} ms`,
    );
    console.log(`Solicitações bem-sucedidas: ${sucessos}`);

    // Validações
    expect(sucessos).toBe(quantidade); // Todas as solicitações devem ser bem-sucedidas
    expect(tempoExecucao).toBeLessThan(1000); // O tempo total deve ser menor que 1 segundo (1000 ms)
  });
});
