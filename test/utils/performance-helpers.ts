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
  const temposExecucao = []; // Array para armazenar tempos de execução individuais

  // Ajusta a quantidade de execuções para não exceder o limite máximo de 10000
  // Executa as solicitações em paralelo
  const promises = Array.from({ length: quantidade }, async (_, i) => {
    try {
      const response = await metodo();

      if ([200, 201, 204].includes(response.status)) {
        sucessos++;
      }

      if (response.responseBody?._id) {
        listId.push(response.responseBody._id);
      }
    } catch (error) {
      console.error(`❌ Erro na execução ${i + 1}:`, error);
    }
  });
  // Aguarda todas as execuções serem concluídas
  await Promise.all(promises);

  const fim = performance.now();
  const tempoExecucaoTotal = fim - inicio;

  return { tempoExecucaoTotal, temposExecucao, sucessos, listId };
}
