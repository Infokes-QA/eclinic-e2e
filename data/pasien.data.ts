import { faker } from '@faker-js/faker/locale/id_ID';
import { Pasien } from './interfaces/pasien';

function generateNik(): string {
  return faker.string.numeric({ length: 16, allowLeadingZeros: true });
}

function generateNoHp(): string {
  return `08${faker.string.numeric({ length: 10, allowLeadingZeros: true })}`;
}

function generateTanggalLahir(): string {
  return faker.date
    .birthdate({ min: 18, max: 65, mode: 'age' })
    .toISOString()
    .split('T')[0];
}

export function createPasien(): Pasien {
  const gender = faker.helpers.arrayElement(['L', 'P'] as const);
  const sex = gender === 'L' ? 'male' : 'female';
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName(sex);

  return {
    nik: generateNik(),
    nama: `TEST UMUM ${firstName} ${lastName}`.toUpperCase(),
    gender,
    tanggalLahir: generateTanggalLahir(),
    alamat: faker.location.streetAddress(),
    noHp: generateNoHp()
  };
}
