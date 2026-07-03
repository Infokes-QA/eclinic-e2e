@authenticated @patient @journey @happy-flow
Feature: Alur Pasien

  Background:
    Given user sudah login sebagai "admin"

  @regression @patient @positive @full-case
  Scenario: User dapat membuat, mencari, melihat detail, dan mendaftarkan pasien baru
    Given pasien baru sudah dibuat
    When user membuka halaman pasien
    And user mencari pasien yang baru dibuat berdasarkan "nama"
    Then tabel Pasien menampilkan pasien yang baru dibuat
    When user mencari pasien yang baru dibuat berdasarkan "nik"
    Then tabel Pasien menampilkan pasien yang baru dibuat
    When user membuka detail pasien yang baru dibuat
    Then detail pasien menampilkan data pasien yang baru dibuat
    When user membuka halaman Pendaftaran melalui menu "pendaftaran" dan submenu "pendaftaranPasienV2"
    And user menekan tombol Tambah pada halaman Pendaftaran
    Then user berada di halaman pendaftaran create
    When user mencari pasien yang baru dibuat pada pendaftaran berdasarkan "nama"
    And user memilih pasien yang baru dibuat dari hasil pencarian pendaftaran
    Then panel Data Pasien menampilkan pasien yang baru dibuat
    And user memilih pelayanan kunjungan sakit
    And user melanjutkan pendaftaran pasien
    Then pendaftaran pasien berhasil
