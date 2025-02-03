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
    console.log('Showtimes: ', showtimes);
  });

  test.afterAll(async () => {
    // Deletar o filme para não impactar os outros testes
    if (movieId) {
      await moviesPage.deletarFilme(movieId);
    }

    await apiContext.dispose(); // Descarte o contexto de requisição
  });

  /* ===================================
  CORREÇÕES A FAZER
  -> Deletar um ticket para testar os tickets
  -> Fazer análise de valor limite para seatNumber e price
  -> Fazer teste parametrizado para seatNumber e price
  ===================================*/
  test.describe('POST /tickets', () => {
    test('Deve criar um novo ticket com sucesso com dados válidos', async () => {
      const ticketCriado = await ticketsPage.criarTicket(movieId, showtimes[0]);
      console.log('Ticket: ', ticketCriado);

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
      const ticketCriado = await ticketsPage.criarTicket(
        'movieIdInvalido',
        showtimes[0],
      );

      expect(ticketCriado.status).toBe(400);
    });

    test('Deve retornar erro ao criar um novo ticket com valor do showtime inválido', async () => {
      const dataInvalida = new Date('Data inválida');

      const ticketCriado = await ticketsPage.criarTicket(movieId, dataInvalida);

      expect(ticketCriado.status).toBe(400);
    });

    test('Deve retornar erro ao criar um novo ticket com valor do showtime inexistente no filme', async () => {
      const dataNaoCadastrada = new Date();

      const ticketCriado = await ticketsPage.criarTicket(
        movieId,
        dataNaoCadastrada,
      );

      expect(ticketCriado.status).toBe(400);
    });

    test('Deve retornar erro ao criar um novo ticket com seatNumber igual a -1', async () => {
      const ticketCriado = await ticketsPage.criarTicket(
        movieId,
        showtimes[0],
        {
          seatNumber: -1,
        },
      );

      expect(ticketCriado.status).toBe(400);
    });

    test('Deve criar um novo ticket com seatNumber igual a 0', async () => {
      const ticketCriado = await ticketsPage.criarTicket(
        movieId,
        showtimes[0],
        {
          seatNumber: 0,
        },
      );

      expect(ticketCriado.status).toBe(201);
      expect(ticketCriado.responseBody).toHaveProperty(
        '_id',
        ticketCriado.responseBody._id,
      );
    });

    test('Deve retornar erro ao criar um novo ticket com seatNumber igual a 100', async () => {
      const ticketCriado = await ticketsPage.criarTicket(
        movieId,
        showtimes[0],
        {
          seatNumber: 100,
        },
      );

      expect(ticketCriado.status).toBe(400);
    });

    test('Deve criar um novo ticket com seatNumber igual a 99', async () => {
      const ticketCriado = await ticketsPage.criarTicket(
        movieId,
        showtimes[0],
        {
          seatNumber: 99,
        },
      );

      expect(ticketCriado.status).toBe(201);
      expect(ticketCriado.responseBody).toHaveProperty(
        '_id',
        ticketCriado.responseBody._id,
      );
    });

    test('Deve retornar erro ao criar um novo ticket com seatNumber já cadastrado para o mesmo filme na mesma data', async () => {
      const ticketCriado = await ticketsPage.criarTicket(
        movieId,
        showtimes[0],
        {
          seatNumber: 1,
        },
      );

      expect(ticketCriado.status).toBe(201);
      expect(ticketCriado.responseBody).toHaveProperty(
        '_id',
        ticketCriado.responseBody._id,
      );

      //Segundo cadastro com o mesmo seatNumber
      const ticketDuplicado = await ticketsPage.criarTicket(
        movieId,
        showtimes[0],
        {
          seatNumber: 1,
        },
      );

      expect(ticketDuplicado.status).toBe(400);
    });

    test('Deve retornar erro ao criar um novo ticket com price igual a -1', async () => {
      const ticketCriado = await ticketsPage.criarTicket(
        movieId,
        showtimes[0],
        {
          price: -1,
        },
      );

      expect(ticketCriado.status).toBe(400);
    });

    test('Deve criar um novo ticket com price igual a 0', async () => {
      const ticketCriado = await ticketsPage.criarTicket(
        movieId,
        showtimes[0],
        {
          price: 0,
        },
      );

      expect(ticketCriado.status).toBe(201);
      expect(ticketCriado.responseBody).toHaveProperty(
        '_id',
        ticketCriado.responseBody._id,
      );
    });

    test('Deve retornar erro ao criar um novo ticket com price igual a 60.01', async () => {
      const ticketCriado = await ticketsPage.criarTicket(
        movieId,
        showtimes[0],
        {
          price: 60.01,
        },
      );

      expect(ticketCriado.status).toBe(400);
    });

    test('Deve criar um novo ticket com price igual a 60', async () => {
      const ticketCriado = await ticketsPage.criarTicket(
        movieId,
        showtimes[0],
        {
          price: 60,
        },
      );

      expect(ticketCriado.status).toBe(201);
      expect(ticketCriado.responseBody).toHaveProperty(
        '_id',
        ticketCriado.responseBody._id,
      );
    });
  });
});
