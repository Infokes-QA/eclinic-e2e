Feature: Create Pasien

  @pasien
  Scenario: Create pasien umum laki-laki
    Given user is on create pasien page
    When user creates pasien with data "laki"
    Then pasien should be successfully created

  @pasien
  Scenario: Create pasien umum perempuan
    Given user is on create pasien page
    When user creates pasien with data "perempuan"
    Then pasien should be successfully created