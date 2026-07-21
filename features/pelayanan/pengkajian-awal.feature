@authenticated @pelayanan @pengkajian-awal
Feature: Pengkajian Awal Pasien

  Background:
    Given user sudah login sebagai "admin"

  @regression @positive @pengkajian-awal-lengkap
  Scenario Outline: Pengkajian awal pasien pada pelayanan rawat jalan
    Given user berada di halaman "<pelayanan>"
    And pasien dengan data "<jenisData>" telah terdaftar pada pelayanan "<pelayanan>"
    When user melakukan pengkajian awal menggunakan data "<jenisPengkajian>"
    And user menyimpan data pengkajian awal
    Then sistem berhasil menyimpan data pengkajian awal
    And status pelayanan pasien berubah menjadi "<statusPelayanan>"
    And data pengkajian awal tersedia pada rekam pelayanan pasien
    And user menyelesaikan pelayanan pengkajian awal
    Then status pelayanan pasien berubah menjadi "Sudah diperiksa perawat"

    Examples:
      | pelayanan   | jenisData | jenisPengkajian | statusPelayanan         |
      | Rawat Jalan | lengkap   | lengkap         | Sudah diperiksa perawat |

  @regression @positive @pengkajian-awal-dokter
  Scenario Outline: Selesaikan pelayanan setelah pengkajian awal
    Given user membuka halaman pelayanan "<pelayanan>"
    And pasien dengan data "<jenisData>" telah terdaftar pada pelayanan "<pelayanan>"
    And pengkajian awal pasien sudah disimpan menggunakan data "<jenisPengkajian>"
    When user menyelesaikan pelayanan pengkajian awal
    Then status pelayanan pasien berubah menjadi "<statusPelayanan>"

    Examples:
      | pelayanan   | jenisData | jenisPengkajian | statusPelayanan         |
      | Rawat Jalan | lengkap   | lengkap         | Sudah diperiksa perawat |
