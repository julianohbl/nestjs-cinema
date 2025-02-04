import { test, expect, APIRequestContext, request } from '@playwright/test';
import { TicketPageObject } from 'test/pageObjects/ticketPageObject';
import { MoviePageObject } from 'test/pageObjects/moviePageObject';

let apiContext: APIRequestContext;
let ticketsPage: TicketPageObject;
let moviesPage: MoviePageObject;

test.describe('/tickets', () => {
  let movieId: string;
  let showtimes: Array<Date>;

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
  });

  test.afterAll(async () => {
    // Deletar o filme para não impactar os outros testes
    if (movieId) {
      await moviesPage.deletarFilme(movieId);
    }

    await apiContext.dispose(); // Descarte o contexto de requisição
  });

  test.describe('/tickets', () => {
    test('O tempo médio de resposta para a reserva de um ingresso não deve exceder 300 milissegundos', async () => {
      const ticketCriado = await ticketsPage.criarTicket(movieId, showtimes[0]);
      console.log('Tempo de execução: ', ticketCriado.tempoExecucao);
      expect(ticketCriado.tempoExecucao).toBeLessThan(300);
    });
  });
});
