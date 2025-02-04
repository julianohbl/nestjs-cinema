import { performance } from 'perf_hooks';
import { gerarDadosFilme } from 'test/utils/movie.Data';

export class MoviePageObject {
  static criarFilme() {
    throw new Error('Method not implemented.');
  }
  constructor(private request) {}

  // Método para criar um filme com dados aleatórios usando Faker
  async criarFilme(dadosDoFilme?: Partial<object>) {
    const inicio = performance.now();

    if (!dadosDoFilme || Object.keys(dadosDoFilme).length === 0) {
      dadosDoFilme = gerarDadosFilme(); // Gera os dados completos
    } else {
      // Garante que campos ausentes sejam preenchidos
      dadosDoFilme = Object.assign(gerarDadosFilme(), dadosDoFilme);
    }

    const response = await this.request.post('/movies', {
      data: dadosDoFilme,
    });

    const responseBody = await response.json();
    const status = response.status();

    const fim = performance.now();
    const tempoExecucao = fim - inicio;

    return { status, response, dadosDoFilme, responseBody, tempoExecucao }; // Retorna o corpo da resposta como JSON
  }

  // Método para alterar um filme por ID
  async alterarFilme(id: string, dadosAtualizados: object) {
    const inicio = performance.now();

    const response = await this.request.put(`/movies/${id}`, {
      data: dadosAtualizados,
    });

    try {
      const status = response.status();
      const responseBody = await response.json();

      const fim = performance.now();
      const tempoExecucao = fim - inicio;

      return { status, responseBody, tempoExecucao };
    } catch (error) {
      console.error('Erro ao converter resposta para JSON:', error);
      throw new Error('Resposta da API não é um JSON válido.');
    }
  }

  // Método para listar todos os filmes
  async listarFilmes() {
    const inicio = performance.now();

    const response = await this.request.get(`/movies`);

    const status = response.status();
    const responseBody = await response.json();

    const fim = performance.now();
    const tempoExecucao = fim - inicio;

    return { status, responseBody, tempoExecucao }; // Retorna o corpo da resposta como JSON
  }

  // listarFilmesComPaginacao = async (pagina: number, limite: number = 20) => {
  //   const url = `http://localhost:3000/movies?page=${pagina}&limit=${limite}`;

  //   try {
  //     const resposta = await fetch(url);

  //     if (!resposta.ok) {
  //       throw new Error(`Erro na requisição: ${resposta.statusText}`);
  //     }

  //     const dados = await resposta.json();

  //     console.log(`Página ${pagina} carregada com ${dados.length} filmes.`);

  //     return dados;
  //   } catch (erro) {
  //     console.error(`Erro ao buscar filmes na página ${pagina}:`, erro);
  //     return []; // Retorna um array vazio caso ocorra um erro
  //   }
  // };

  // Método para obter um filme por ID
  async obterFilme(id) {
    const inicio = performance.now();

    const response = await this.request.get(`/movies/${id}`);

    const status = response.status();
    const responseBody = await response.json();

    const fim = performance.now();
    const tempoExecucao = fim - inicio;

    return { status, responseBody, tempoExecucao };
  }

  // Método para deletar um filme por ID
  async deletarFilme(id) {
    const inicio = performance.now();

    const response = await this.request.delete(`/movies/${id}`);
    const status = response.status();

    const fim = performance.now();
    const tempoExecucao = fim - inicio;

    return { status, response, tempoExecucao };
  }
}
