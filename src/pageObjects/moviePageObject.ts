// moviePageObject.ts
// import { request } from '@playwright/test'; // Caso precise do tipo request
import { gerarDadosFilme } from 'src/fixtures/faker.Data';

export class MoviePageObject {
  static criarFilme() {
    throw new Error('Method not implemented.');
  }
  constructor(private request) {}

  // Método para criar um filme com dados aleatórios usando Faker
  async criarFilme() {
    const filme = gerarDadosFilme(); // Gera os dados do filme
    console.log('Filme gerado:', filme); // Exibe o filme gerado no console

    const response = await this.request.post('/movies', {
      data: filme,
    });

    console.log('Resposta da criação:', response); // Exibe a resposta no console

    return response; // Retorna a resposta para o teste fazer as asserções
  }

  // Método para alterar um filme por ID
  async alterarFilme(id: string, dadosAtualizados: object) {
    const response = await this.request.put(`/movies/${id}`, {
      data: dadosAtualizados,
    });

    if (!response.ok()) {
      throw new Error(
        `Erro ao alterar filme: ${response.status()} - ${response.statusText()}`,
      );
    }

    try {
      const status = response.status();
      const responseBody = await response.json();
      console.log('Filme alterado:', responseBody);
      return { status, responseBody };
    } catch (error) {
      console.error('Erro ao converter resposta para JSON:', error);
      throw new Error('Resposta da API não é um JSON válido.');
    }
  }

  // Método para listar todos os filmes
  async listarFilmes() {
    const response = await this.request.get('/movies');

    const status = response.status();
    const responseBody = await response.json();
    return { status, responseBody }; // Retorna o corpo da resposta como JSON
  }

  // Método para obter um filme por ID
  async obterFilme(id) {
    const response = await this.request.get(`/movies/${id}`);

    const status = response.status();
    const responseBody = await response.json();
    return { status, responseBody };
  }

  // Método para deletar um filme por ID
  async deletarFilme(id) {
    const response = await this.request.delete(`/movies/${id}`);

    const status = response.status();
    const responseBody = await response.json();
    console.log('Resposta da deleção:', responseBody);
    console.log('Status:', status);
    return { status, responseBody };
  }
}
