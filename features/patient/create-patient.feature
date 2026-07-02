@authenticated @patient @create-patient
Feature: Pembuatan Pasien

  Background:
    Given user sudah login sebagai "admin"

  @smoke @patient @positive
  Scenario: User dapat membuka halaman pembuatan pasien
    When user membuka halaman pembuatan pasien
    Then user berada di halaman "Create Pasien"

  @regression @patient @positive
  Scenario: User dapat membuat pasien dengan data ringkas
    When user membuka halaman pembuatan pasien
    And user memilih membuat pasien baru
    And user memilih mode data pasien ringkas
    And user mengisi data pasien ringkas
    Then data pasien ringkas terisi dengan benar

  @regression @patient @positive
  Scenario: User dapat menyimpan pasien dengan data lengkap
    When user membuka halaman pembuatan pasien
    And user memilih membuat pasien baru
    And user memilih mode data pasien lengkap
    And user mengisi data pasien lengkap
    And user menyimpan data pasien
    Then data pasien berhasil tersimpan
    And halaman pendaftaran menampilkan data pasien yang dibuat
