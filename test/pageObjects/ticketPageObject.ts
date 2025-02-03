// tests/pages/TicketsPage.ts
import { APIRequestContext } from '@playwright/test';
import { performance } from 'perf_hooks';
import { gerarDadosIngresso } from 'test/utils/ticketData';

export class TicketPageObject {
  readonly request: APIRequestContext;
  readonly endpoint: string = '/tickets';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async criarTicket(
    movieId: string,
    showtime: Date,
    overrideData: Partial<ReturnType<typeof gerarDadosIngresso>> = {},
  ) {
    const inicio = performance.now();

    const dadosDoIngresso = { ...gerarDadosIngresso(), ...overrideData }; // Permite sobrescrever valores específicos

    const response = await this.request.post(this.endpoint, {
      data: {
        ...dadosDoIngresso,
        movieId,
        showtime,
      },
    });

    const status = response.status();
    const responseBody = await response.json();

    const fim = performance.now();
    const tempoExecucao = fim - inicio;

    return { responseBody, status, tempoExecucao };
  }

  async deletarTicket(id) {
    const inicio = performance.now();

    const response = await this.request.delete(`${this.endpoint}/${id}`);
    console.log('Deletar ticket:', response);
    const status = response.status();

    const fim = performance.now();
    const tempoExecucao = fim - inicio;

    return { status, response, tempoExecucao };
  }
}
