@authenticated @patient @journey @happy-flow
Feature: Alur Pasien

  Background:
    Given user sudah login sebagai "admin"

  @regression @patient @positive @full-case
  Scenario: User dapat membuat, mencari, dan melihat detail pasien baru
    Given pasien baru sudah dibuat
    When user membuka halaman pasien
    When user mencari pasien yang baru dibuat berdasarkan "nama"
    Then tabel Pasien menampilkan pasien yang baru dibuat
    When user mencari pasien yang baru dibuat berdasarkan "nik"
    Then tabel Pasien menampilkan pasien yang baru dibuat
    When user membuka detail pasien yang baru dibuat
    Then detail pasien menampilkan data pasien yang baru dibuat
