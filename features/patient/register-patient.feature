@authenticated @patient @register-patient
Feature: Registrasi Pasien

  Background:
    Given user sudah login sebagai "admin"

  @regression @patient @positive
  Scenario: User dapat mendaftarkan pasien dengan kunjungan sakit
    Given pasien baru sudah dibuat
    When user memilih pelayanan kunjungan sakit
    And user melanjutkan pendaftaran pasien
    Then pendaftaran pasien berhasil
