import { test, expect, request, APIRequestContext } from '@playwright/test';
import { executarTesteDeCarga } from '../../utils/performance-helpers';
import { MoviePageObject } from 'test/pageObjects/moviePageObject';

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

    const { tempoExecucaoTotal, sucessos, listId } = await executarTesteDeCarga(
      async () => {
        const response = await moviePage.criarFilme(null);

        console.log(
          `Tempo de execução: ${response.tempoExecucao.toFixed(2)} ms`,
        );
        return response;
      },
      quantidade,
    );

    listaDeIds = listId;

    // Exibir tempo total
    console.log(
      `⏱ Tempo total para ${quantidade} solicitações: ${tempoExecucaoTotal.toFixed(
        2,
      )} ms`,
    );

    // Validações
    expect(sucessos).toBe(quantidade); // Todas as solicitações devem ser bem-sucedidas
    expect(tempoExecucaoTotal).toBeLessThan(1000); // O tempo total deve ser menor que 1 segundo (1000 ms)
  });

  test('A API deve ser capaz de processar 50 solicitações de atualização de filmes por segundo', async () => {
    quantidade = 50; // Número de solicitações
    const { listId } = await executarTesteDeCarga(
      () => moviePage.criarFilme(null),
      quantidade,
    );

    listaDeIds = listId;

    console.log(`🚀 Iniciando teste de atualização de ${quantidade} filmes...`);
    const { tempoExecucaoTotal, sucessos } = await executarTesteDeCarga(
      async () => {
        const filmeId = listId[Math.floor(Math.random() * listId.length)]; // Seleciona aleatoriamente um ID
        const response = await moviePage.alterarFilme(filmeId, {
          title: `Título alterado ${Math.random()}`,
        });
        console.log(
          `Tempo de execução: ${response.tempoExecucao.toFixed(2)} ms`,
        );
        return response;
      },
      quantidade, // Número de solicitações de alteração
    );

    // Exibir tempo total
    console.log(
      `⏱ Tempo total para ${quantidade} solicitações de alteração: ${tempoExecucaoTotal.toFixed(
        2,
      )} ms`,
    );

    // Validações
    expect(sucessos).toBe(quantidade); // Todas as solicitações devem ser bem-sucedidas
    expect(tempoExecucaoTotal).toBeLessThan(1000); // O tempo total deve ser menor que 1 segundo (1000 ms)
  });

  test.only('A API deve ser capaz de processar 30 solicitações de exclusão de filmes por segundo', async () => {
    quantidade = 30; // Número de solicitações
    const { listId } = await executarTesteDeCarga(
      () => moviePage.criarFilme(null),
      quantidade,
    );

    listaDeIds = listId;

    console.log(`🚀 Iniciando teste de exclusão de ${quantidade} filmes...`);
    const { tempoExecucaoTotal, sucessos } = await executarTesteDeCarga(
      async () => {
        if (listId.length === 0) return; // Garantir que há IDs para excluir

        const filmeId = listId.pop(); // Pega e remove o último ID do array
        const response = await moviePage.deletarFilme(filmeId);

        console.log(
          `Requisição de exclusão do filme com ID ${filmeId} concluída em ${response.tempoExecucao.toFixed(
            2,
          )} ms`,
        );
        return response;
      },
      quantidade, // Número de solicitações de alteração
    );

    // Exibir tempo total
    console.log(
      `⏱ Tempo total para ${quantidade} solicitações de exclusão: ${tempoExecucaoTotal.toFixed(
        2,
      )} ms`,
    );

    // Validações
    expect(sucessos).toBe(quantidade); // Todas as solicitações devem ser bem-sucedidas
    expect(tempoExecucaoTotal).toBeLessThan(1000); // O tempo total deve ser menor que 1 segundo (1000 ms)
  });
});
