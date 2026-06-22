Feature: Buat Pasien

  @pasien
  Scenario: Membuat pasien umum
    Given user berada di halaman tambah pasien
    When user membuat data pasien
    Then data pasien berhasil dibuat
