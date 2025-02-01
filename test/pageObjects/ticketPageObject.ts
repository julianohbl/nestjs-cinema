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
    overrideData: Partial<ReturnType<typeof gerarDadosIngresso>> = {},
  ) {
    const inicio = performance.now();

    const dadosDoIngresso = { ...gerarDadosIngresso(), ...overrideData }; // Permite sobrescrever valores específicos
    console.log('Dados gerados: ', dadosDoIngresso);

    const response = await this.request.post(this.endpoint, {
      data: {
        ...dadosDoIngresso,
        movieId,
      },
    });

    const status = response.status();
    const responseBody = await response.json();

    const fim = performance.now();
    const tempoExecucao = fim - inicio;
    console.log(`Tempo de criação do filme: ${tempoExecucao} ms`);

    return { responseBody, status };
  }
}
