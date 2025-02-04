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

//   test.only('A lista de filmes deve ser paginada corretamente', async () => {
//     const filmesPorPagina = 20;

//     // ✅ Obtendo o total real de filmes no banco
//     const totalFilmesResponse = await fetch(
//       'http://localhost:3000/movies/count',
//     );
//     const { totalFilmes } = await totalFilmesResponse.json();

//     console.log(`Total de filmes cadastrados no sistema: ${totalFilmes}`);

//     // ✅ Calculando total de páginas dinamicamente
//     const totalPages = Math.ceil(totalFilmes / filmesPorPagina);
//     console.log(`Total de páginas esperadas: ${totalPages}`);

//     // ✅ Iterando pelas páginas usando a função `listarFilmesComPaginacao`
//     for (let page = 1; page <= totalPages; page++) {
//       const filmesData = await moviePage.listarFilmesComPaginacao(
//         page,
//         filmesPorPagina,
//       );

//       console.log(`Página ${page}: ${filmesData.length} filmes retornados`);

//       // ✅ Validando a quantidade de filmes por página
//       if (page < totalPages) {
//         expect(filmesData.length).toBe(filmesPorPagina);
//       } else {
//         expect(filmesData.length).toBeLessThanOrEqual(filmesPorPagina);
//       }
//     }
//   });
// });
