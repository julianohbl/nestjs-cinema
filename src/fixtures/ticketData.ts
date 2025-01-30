import { faker } from '@faker-js/faker';

export function gerarDadosIngresso() {
  return {
    userId: faker.string.uuid(),
    seatNumber: faker.number.int({ min: 1, max: 99 }),
    price: parseFloat(faker.number.float({ min: 0, max: 60 }).toFixed(2)),
    showtime: faker.date.future(),
  };
}
