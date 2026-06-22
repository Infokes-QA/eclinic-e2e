Feature: Pendaftaran Pasien

  @pendaftaran
  Scenario: Pendaftaran pasien umum
    Given pasien sudah terdaftar
    And user sudah berada di halaman pendaftaran
    When user melakukan pendaftaran pasien
    Then pendaftaran pasien berhasil dibuat