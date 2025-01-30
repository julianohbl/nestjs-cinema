// tests/pages/TicketsPage.ts
import { APIRequestContext } from '@playwright/test';
import { gerarDadosIngresso } from 'src/fixtures/ticketData';

export class TicketPageObject {
  readonly request: APIRequestContext;
  readonly endpoint: string = '/tickets';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async criarTicket(movieId: string) {
    const dadosDoIngresso = gerarDadosIngresso();
    console.log('Dados gerados: ', dadosDoIngresso);

    const response = await this.request.post(this.endpoint, {
      data: {
        ...dadosDoIngresso,
        movieId,
      },
    });

    const status = response.status();
    const responseBody = await response.json();

    return { responseBody, status };
  }
}
