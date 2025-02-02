import { test, expect, APIRequestContext, request } from '@playwright/test';
import { TicketPageObject } from 'test/pageObjects/ticketPageObject';
import { MoviePageObject } from 'test/pageObjects/moviePageObject';

let apiContext: APIRequestContext;
let ticketsPage: TicketPageObject;
let moviesPage: MoviePageObject;

test.describe('Testes e2e', () => {
  let movieId: string;
  let showtimes: Array<Date>;

  test.beforeAll(async ({ baseURL }) => {
    apiContext = await request.newContext({
      baseURL,
    });
    ticketsPage = new TicketPageObject(apiContext);
    moviesPage = new MoviePageObject(apiContext);
  });

  test.afterAll(async () => {
    await apiContext.dispose(); // Descarte o contexto de requisição
  });

  test('Fluxo de criação de ticket com dados válidos', async () => {
    // Cadastrar um filme para testar os tickets
    const filmeCriado = await moviesPage.criarFilme(null);
    if (filmeCriado.responseBody._id) {
      movieId = filmeCriado.responseBody._id;
      showtimes = filmeCriado.responseBody.showtimes;
    }

    expect(filmeCriado.status).toBe(201);
    expect(filmeCriado.responseBody).toHaveProperty('_id');

    // Cadastrar um ticket para o filme criado
    const ticketCriado = await ticketsPage.criarTicket(movieId, showtimes[0]);

    expect(ticketCriado.status).toBe(201);
    expect(ticketCriado.responseBody).toHaveProperty(
      '_id',
      ticketCriado.responseBody._id,
    );
    expect(ticketCriado.responseBody.seatNumber).toBeGreaterThanOrEqual(0);
    expect(ticketCriado.responseBody.seatNumber).toBeLessThanOrEqual(99);
    expect(ticketCriado.responseBody.price).toBeGreaterThanOrEqual(0);
    expect(ticketCriado.responseBody.price).toBeLessThanOrEqual(60);

    // Deletar o filme para não impactar os outros testes
    const filmeDeletado = await moviesPage.deletarFilme(movieId);
    console.log('Filme deletado', filmeDeletado);

    expect(filmeDeletado.status).toBe(204);

    // ====================================================================
    // Deletar ticket ainda não foi implementado
    // ====================================================================

    // Deletar o ticket para garantir que não haja referências desatadas
    // const ticketDeletado = await ticketsPage.deletarTicket(
    //   ticketCriado.responseBody._id,
    // );
    // console.log('Filme deletado', ticketDeletado);

    // expect(ticketDeletado.status).toBe(204);
  });
});
