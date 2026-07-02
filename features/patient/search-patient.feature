@authenticated @patient @search-patient
Feature: Search dan Filter Pasien

  Background:
    Given user sudah login sebagai "admin"

  @smoke @patient @positive
  Scenario: User dapat membuka halaman Pasien melalui menu Pasien
    When user membuka halaman Pasien melalui menu "pendaftaran" dan submenu "pasien"
    Then user berada di halaman "Pasien"
    And form filter Pasien ditampilkan

  @regression @patient @positive
  Scenario Outline: User dapat mencari pasien dengan kata kunci
    When user membuka halaman Pasien melalui menu "pendaftaran" dan submenu "pasien"
    And user mencari pasien dengan kata kunci "<keyword>"
    Then tabel Pasien menampilkan hasil yang mengandung "<expected>"

    Examples:
      | keyword           | expected |
      | RUSLANI           | RUSLANI  |
      | ANDRI             | ANDRI    |
      | 1311025512910261  | RUSLANI  |

  @regression @patient @positive
  Scenario Outline: User dapat memfilter data pasien
    When user membuka halaman Pasien melalui menu "pendaftaran" dan submenu "pasien"
    And user memfilter data pasien dengan tipe record "<tipeRecord>" verifikasi "<verifikasi>" dan general consent "<generalConsent>"
    And user menekan tombol Cari pada halaman Pasien
    Then tabel Pasien menampilkan data hasil filter

    Examples:
      | tipeRecord | verifikasi        | generalConsent |
      | Aktif      | Semua             | Semua          |
      | Aktif      | Verifikasi        | Belum          |
      | Aktif      | Belum Verifikasi  | Sudah          |

  @regression @patient @positive
  Scenario Outline: User dapat mengatur jumlah data per halaman
    When user membuka halaman Pasien melalui menu "pendaftaran" dan submenu "pasien"
    And user menampilkan "<limit>" data per halaman pada tabel Pasien
    Then tabel Pasien menampilkan maksimal "<limit>" baris data

    Examples:
      | limit |
      | 10    |
      | 25    |
