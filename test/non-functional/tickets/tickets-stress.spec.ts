import { test, expect, APIRequestContext, request } from '@playwright/test';
import { TicketPageObject } from 'test/pageObjects/ticketPageObject';
import { MoviePageObject } from 'test/pageObjects/moviePageObject';
import { executarTesteDeCarga } from 'test/utils/performance-helpers';

let apiContext: APIRequestContext;
let ticketsPage: TicketPageObject;
let moviesPage: MoviePageObject;

test.describe('/tickets', () => {
  let movieId: string;
  let showtimes: Array<Date>;
  let quantidade: number;

  test.beforeAll(async ({ baseURL }) => {
    apiContext = await request.newContext({
      baseURL,
    });
    ticketsPage = new TicketPageObject(apiContext);
    moviesPage = new MoviePageObject(apiContext);

    // Cadastrar um filme para testar os tickets
    const { responseBody } = await moviesPage.criarFilme(null);
    movieId = responseBody._id;
    showtimes = responseBody.showtimes;
    console.log('Showtimes: ', showtimes);
  });

  test.afterAll(async () => {
    // Deletar o filme para não impactar os outros testes
    if (movieId) {
      await moviesPage.deletarFilme(movieId);
    }

    await apiContext.dispose(); // Descarte o contexto de requisição
  });

  test.describe('/tickets', () => {
    test('A API deve ser capaz de processar pelo menos 50 solicitações de reserva de ingressos por segundo', async () => {
      quantidade = 50; // Número de solicitações
      const { tempoExecucao, sucessos } = await executarTesteDeCarga(
        () => ticketsPage.criarTicket(movieId, showtimes[0]),
        quantidade,
      );

      console.log(
        `Tempo total para ${quantidade} solicitações: ${tempoExecucao} ms`,
      );

      // Validações
      expect(sucessos).toBe(quantidade); // Todas as solicitações devem ser bem-sucedidas
      expect(tempoExecucao).toBeLessThan(1000); // O tempo total deve ser menor que 1 segundo (1000 ms)
      const ticketCriado = await ticketsPage.criarTicket(movieId, showtimes[0]);

      expect(ticketCriado.tempoExecucao).toBeLessThan(300);
    });
  });
});
