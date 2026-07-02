@authenticated @patient @register-patient
Feature: Registrasi Pasien

  Background:
    Given user sudah login sebagai "admin"

  @regression @patient @positive
  Scenario: User dapat mendaftarkan pasien dengan kunjungan sakit
    Given pasien baru sudah dibuat di halaman pendaftaran create
    When user mengisi form Data Pelayanan dengan kunjungan sakit
    And user menekan tombol Lanjutkan pendaftaran
    Then pendaftaran pasien berhasil
