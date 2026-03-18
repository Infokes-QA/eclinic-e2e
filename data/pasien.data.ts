import { Pasien } from './interfaces/pasien';

function generateNik(): string {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
}

export function createPasienLaki(): Pasien {
  return {
    nik: generateNik(),
    nama: 'TEST LAKI',
    gender: 'L',
    tanggalLahir: '1990-01-01',
    alamat: 'Jakarta',
    noHp: '081234567890'
  };
}

export function createPasienPerempuan(): Pasien {
  return {
    nik: generateNik(),
    nama: 'TEST PEREMPUAN',
    gender: 'P',
    tanggalLahir: '1995-05-05',
    alamat: 'Bandung',
    noHp: '089876543210'
  };
}