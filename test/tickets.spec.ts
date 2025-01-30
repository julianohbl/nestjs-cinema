import { test, expect, APIRequestContext, request } from '@playwright/test';
import { TicketPageObject } from '../src/pageObjects/ticketPageObject';

let apiContext: APIRequestContext;
let ticketsPage: TicketPageObject;

test.describe('API de Tickets', () => {
  const movieId = 'm4nC1vENI36l9H5U'; // Simulando um ID válido de filme
  test.beforeAll(async ({ baseURL }) => {
    apiContext = await request.newContext({
      baseURL,
    });
    ticketsPage = new TicketPageObject(apiContext);
  });

  test.afterAll(async () => {
    await apiContext.dispose(); // Descarte o contexto de requisição
  });

  test('Deve criar um novo ticket com sucesso', async () => {
    // Criar o ticket
    const ticketCriado = await ticketsPage.criarTicket(movieId);
    console.log('Status:', ticketCriado.status);
    console.log('Ticket criado:', ticketCriado);
    console.log('Ticket criado com ID:', ticketCriado.responseBody._id);

    expect(ticketCriado.status).toBe(201);
    expect(ticketCriado.responseBody).toHaveProperty(
      '_id',
      ticketCriado.responseBody._id,
    );
    expect(ticketCriado.responseBody.seatNumber).toBeGreaterThanOrEqual(0);
    expect(ticketCriado.responseBody.seatNumber).toBeLessThanOrEqual(99);
    expect(ticketCriado.responseBody.price).toBeGreaterThanOrEqual(0);
    expect(ticketCriado.responseBody.price).toBeLessThanOrEqual(60);
  });
});
