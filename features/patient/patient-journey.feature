@authenticated @patient @journey @happy-flow
Feature: Patient Journey Happy Flow

  Background:
    Given user sudah login sebagai "admin"

  @regression @patient @positive @full-case
  Scenario: User dapat membuat pasien dan menemukannya di halaman Pasien
    Given pasien baru sudah dibuat di halaman pendaftaran create
    When user membuka halaman Pasien melalui menu "pendaftaran" dan submenu "pasien"
    Then user berada di halaman "Pasien"
    When user mencari pasien yang baru dibuat berdasarkan "nama"
    Then tabel Pasien menampilkan pasien yang baru dibuat
    When user mencari pasien yang baru dibuat berdasarkan "nik"
    Then tabel Pasien menampilkan pasien yang baru dibuat
    When user membuka detail pasien yang baru dibuat dari tabel Pasien
    Then user berada di halaman "Detail Pasien"
    And halaman detail Pasien menampilkan data pasien yang baru dibuat
