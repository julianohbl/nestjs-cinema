import { test, expect, request, APIRequestContext } from '@playwright/test';
import { executarTesteDeCarga } from '../../utils/performance-helpers';
import { MoviePageObject } from 'test/pageObjects/moviePageObject';
import { performance } from 'perf_hooks';

let apiContext: APIRequestContext;
let moviePage: MoviePageObject;
let quantidade: number;
let listaDeIds = [];

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

  test('A API deve ser capaz de processar 100 solicitações de criação de filmes por segundo', async () => {
    quantidade = 100; // Número de solicitações
    const { tempoExecucao, sucessos, listId } = await executarTesteDeCarga(
      () => moviePage.criarFilme(null),
      quantidade,
    );

    listaDeIds = listId;

    console.log(
      `Tempo total para ${quantidade} solicitações: ${tempoExecucao} ms`,
    );

    // Validações
    expect(sucessos).toBe(quantidade); // Todas as solicitações devem ser bem-sucedidas
    expect(tempoExecucao).toBeLessThan(1000); // O tempo total deve ser menor que 1 segundo (1000 ms)
  });

  test('A API deve ser capaz de processar 50 solicitações de atualização de filmes por segundo', async () => {
    quantidade = 50; // Número de solicitações
    const { listId } = await executarTesteDeCarga(
      () => moviePage.criarFilme(null),
      quantidade,
    );

    listaDeIds = listId;

    const inicio = performance.now();
    for (let i = 0; i < quantidade; i++) {
      await moviePage.alterarFilme(listId[i], {
        title: `Título alterado ${i}`,
      });
    }
    const fim = performance.now();
    const tempoExecucao = fim - inicio;
    console.log(
      `Tempo total para ${quantidade} solicitações: ${tempoExecucao} ms`,
    );

    // Validações
    expect(tempoExecucao).toBeLessThan(1000); // O tempo total deve ser menor que 1 segundo (1000 ms)
  });

  test('A API deve ser capaz de processar 30 solicitações de exclusão de filmes por segundo', async () => {
    quantidade = 30; // Número de solicitações
    const { listId } = await executarTesteDeCarga(
      () => moviePage.criarFilme(null),
      quantidade,
    );

    listaDeIds = listId;

    const inicio = performance.now();
    for (let i = 0; i < quantidade; i++) {
      await moviePage.deletarFilme(listId[i]);
    }
    const fim = performance.now();
    const tempoExecucao = fim - inicio;
    console.log(
      `Tempo total para ${quantidade} solicitações: ${tempoExecucao} ms`,
    );

    // Validações
    expect(tempoExecucao).toBeLessThan(1000); // O tempo total deve ser menor que 1 segundo (1000 ms)
  });
});
