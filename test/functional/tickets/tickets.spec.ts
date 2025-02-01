import { test, expect, APIRequestContext, request } from '@playwright/test';
import { TicketPageObject } from 'test/pageObjects/ticketPageObject';

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

  /* ===================================
  CORREÇÕES A FAZER
  -> Colocar o pageObjects dentro de test
  -> Cadastrar um filme para testar os tickets
  -> Deletar um filme para testar os tickets
  -> Deletar um ticket para testar os tickets
  -> Fazer análise de valor limite para seatNumber e price
  -> Fazer teste parametrizado para seatNumber e price
  -> Cadastrar um ticket com showtimeId inválido
  ===================================*/
  test('Deve criar um novo ticket com sucesso com dados válidos', async () => {
    // Criar o ticket
    const ticketCriado = await ticketsPage.criarTicket(movieId);

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

  test('Deve retornar erro ao criar um novo ticket com movieId inválido', async () => {
    // Criar o ticket
    const ticketCriado = await ticketsPage.criarTicket('movieIdInvalido');

    expect(ticketCriado.status).toBe(400);
  });

  test('Deve retornar erro ao criar um novo ticket com seatNumber igual a -1', async () => {
    const ticketCriado = await ticketsPage.criarTicket(movieId, {
      seatNumber: -1,
    });

    expect(ticketCriado.status).toBe(400);
  });

  test('Deve criar um novo ticket com seatNumber igual a 0', async () => {
    const ticketCriado = await ticketsPage.criarTicket(movieId, {
      seatNumber: 0,
    });

    expect(ticketCriado.status).toBe(201);
    expect(ticketCriado.responseBody).toHaveProperty(
      '_id',
      ticketCriado.responseBody._id,
    );
  });

  test('Deve retornar erro ao criar um novo ticket com seatNumber igual a 100', async () => {
    const ticketCriado = await ticketsPage.criarTicket(movieId, {
      seatNumber: 100,
    });

    expect(ticketCriado.status).toBe(400);
  });

  test('Deve criar um novo ticket com seatNumber igual a 99', async () => {
    const ticketCriado = await ticketsPage.criarTicket(movieId, {
      seatNumber: 99,
    });

    expect(ticketCriado.status).toBe(201);
    expect(ticketCriado.responseBody).toHaveProperty(
      '_id',
      ticketCriado.responseBody._id,
    );
  });

  test('Deve retornar erro ao criar um novo ticket com seatNumber já cadastrado', async () => {
    const ticketCriado = await ticketsPage.criarTicket(movieId, {
      seatNumber: 1,
    });

    expect(ticketCriado.status).toBe(201);
    expect(ticketCriado.responseBody).toHaveProperty(
      '_id',
      ticketCriado.responseBody._id,
    );
    //Segundo cadastro com o mesmo seatNumber
    const ticketDuplicado = await ticketsPage.criarTicket(movieId, {
      seatNumber: 1,
    });

    expect(ticketDuplicado.status).toBe(400);
  });

  test('Deve retornar erro ao criar um novo ticket com price igual a -1', async () => {
    const ticketCriado = await ticketsPage.criarTicket(movieId, {
      price: -1,
    });

    expect(ticketCriado.status).toBe(400);
  });

  test('Deve criar um novo ticket com price igual a 0', async () => {
    const ticketCriado = await ticketsPage.criarTicket(movieId, {
      price: 0,
    });

    expect(ticketCriado.status).toBe(201);
    expect(ticketCriado.responseBody).toHaveProperty(
      '_id',
      ticketCriado.responseBody._id,
    );
  });

  test('Deve retornar erro ao criar um novo ticket com price igual a 60.01', async () => {
    const ticketCriado = await ticketsPage.criarTicket(movieId, {
      price: 60.01,
    });

    expect(ticketCriado.status).toBe(400);
  });

  test('Deve criar um novo ticket com price igual a 60', async () => {
    const ticketCriado = await ticketsPage.criarTicket(movieId, {
      price: 60,
    });

    expect(ticketCriado.status).toBe(201);
    expect(ticketCriado.responseBody).toHaveProperty(
      '_id',
      ticketCriado.responseBody._id,
    );
  });
});
