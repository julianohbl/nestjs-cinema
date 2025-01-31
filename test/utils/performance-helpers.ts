import { performance } from 'perf_hooks';

/**
 * Função genérica para executar testes de carga.
 * @param metodo - O método a ser executado (ex: criarFilme, alterarFilme, etc.).
 * @param quantidade - Número de vezes que o método deve ser executado.
 * @returns Um objeto contendo o tempo total de execução e o número de execuções bem-sucedidas.
 */
export async function executarTesteDeCarga(
  metodo: () => Promise<any>,
  quantidade: number,
) {
  const inicio = performance.now();

  let sucessos = 0; // Contador de execuções bem-sucedidas
  const listId = []; // Lista de IDs criados

  // Ajusta a quantidade de execuções para não exceder o limite máximo de 10000
  // Executa as solicitações em paralelo
  const promises = [];
  for (let i = 0; i < quantidade; i++) {
    promises.push(
      metodo()
        .then((response) => {
          if (
            response.status === 200 ||
            response.status === 201 ||
            response.status === 204
          ) {
            // Adapte conforme o status esperado
            sucessos++;
          }

          if (response.responseBody._id) {
            listId.push(response.responseBody._id);
          }
        })
        .catch((error) => {
          console.error(`Erro na execução ${i + 1}:`, error);
        }),
    );
  }

  // Aguarda todas as execuções serem concluídas
  await Promise.all(promises);

  const fim = performance.now();
  const tempoExecucao = fim - inicio;
  console.log(`Tempo de criação do filme: ${tempoExecucao} ms`);
  console.log(`Lista de IDs criados: ${listId}`);

  return { tempoExecucao, sucessos, listId };
}
