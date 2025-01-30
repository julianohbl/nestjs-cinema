// fakerData.ts
import { faker } from '@faker-js/faker';

export const gerarDadosFilme = () => {
  return {
    title: faker.lorem.words(3), // Gera um título com 3 palavras
    description: faker.lorem.sentence(), // Gera uma descrição de 10 palavras
    launchdate: faker.date.past(), // Gera uma data de lançamento aleatória dos últimos 10 anos
    showtimes: [
      faker.date.future(), // Gera um horário futuro
      faker.date.future(), // Gera um segundo horário futuro
    ],
  };
};
