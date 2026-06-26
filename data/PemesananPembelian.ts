import { faker } from "@faker-js/faker/locale/id_ID";
import { PemesananPembelian } from "./interfaces/PemesananPembelian";

export function createPemesananPembelian(): PemesananPembelian {
    const namaPemasok = faker.company.name();
    const namaPenanggungJawab = "SALMA SANG APOTEKER";
    const jumlahItem = faker.number.int({ min: 1, max: 100 });

    return {
        namaPemasok,
        namaPenanggungJawab,
        jumlahItem
    };
};