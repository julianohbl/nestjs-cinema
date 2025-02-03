// import { test, expect, request, APIRequestContext } from '@playwright/test';
// import { MoviePageObject } from 'test/pageObjects/moviePageObject';

// let apiContext: APIRequestContext;
// let moviePage: MoviePageObject;
// const filmesCriados: string[] = [];

// test.describe('Paginação da lista de filmes', () => {
//   test.beforeAll(async ({ baseURL }) => {
//     apiContext = await request.newContext({
//       baseURL,
//     });
//     moviePage = new MoviePageObject(apiContext);

//     // Cria 25 filmes para testar a paginação e armazena os IDs
//     for (let i = 0; i < 25; i++) {
//       const response = await moviePage.criarFilme({ title: `Filme ${i + 1}` });
//       if (response.status === 201) {
//         filmesCriados.push(response.responseBody._id); // Armazena o ID do filme criado
//       }
//     }
//   });

//   test.afterAll(async () => {
//     // Deleta apenas os filmes criados no beforeAll
//     for (const id of filmesCriados) {
//       await moviePage.deletarFilme(id);
//     }

//     await apiContext.dispose();
//   });

//   test('A lista de filmes deve ser paginada, com no máximo 20 filmes por página', async () => {
//     const filmesPorPagina = 20;
//     const pagina = 1; // Exemplo de página inicial (pode ser dinâmico conforme necessário)

//     // Chama a API para pegar os filmes com a página e o limite definidos
//     const response = await fetch(
//       `http://localhost:3000/movies?page=${pagina}&limit=${filmesPorPagina}`,
//     );
//     const data = await response.json();

//     const totalFilmes = data.totalFilmes; // Total de filmes que a API retornou
//     const totalPages = data.totalPages; // Número total de páginas, retornado pela API

//     console.log(`Total de filmes: ${totalFilmes}`);
//     console.log(`Total de páginas esperadas: ${totalPages}`);

//     expect(totalFilmes).toBeGreaterThan(0); // Garante que há filmes cadastrados
//     expect(totalPages).toBeGreaterThan(0); // Garante que há pelo menos uma página

//     // Itera pelas páginas
//     for (let page = 1; page <= totalPages; page++) {
//       const response = await fetch(
//         `http://localhost:3000/movies?page=${page}&limit=${filmesPorPagina}`,
//       );
//       const filmesData = await response.json();
//       const filmesNaPagina = filmesData.filmes.length;

//       console.log(`Página ${page}: ${filmesNaPagina} filmes`);

//       // Verifica se o número de filmes na página corresponde ao esperado
//       if (page < totalPages) {
//         expect(filmesNaPagina).toBe(filmesPorPagina); // Todas as páginas, exceto a última, devem ter 20 filmes
//       } else {
//         expect(filmesNaPagina).toBeLessThanOrEqual(filmesPorPagina); // A última página pode ter menos de 20 filmes
//       }
//     }
//   });
// });
