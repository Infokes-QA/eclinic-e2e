@authenticated @patient @create-patient
Feature: Create Pasien

  Background:
    Given user sudah login sebagai "admin"

  @smoke @patient @positive
  Scenario Outline: User dapat membuka halaman Create Pasien melalui menu Pendaftaran
    When user membuka halaman Create Pasien melalui menu "<menu>" dan submenu "<submenu>"
    Then user berada di halaman "<halaman>"

    Examples:
      | menu        | submenu      | halaman       |
      | pendaftaran | createPasien | Create Pasien |

  @regression @patient @positive
  Scenario: Form Create Pasien menampilkan mode data ringkas
    When user membuka halaman Create Pasien melalui menu "pendaftaran" dan submenu "createPasien"
    And user membuka modal Buat Pasien Baru
    And user mengatur checkbox Diverifikasi Lengkap menjadi "tidak dicentang"
    Then form Create Pasien menampilkan mode data ringkas

  @regression @patient @positive
  Scenario: Form Create Pasien menampilkan mode data lengkap
    When user membuka halaman Create Pasien melalui menu "pendaftaran" dan submenu "createPasien"
    And user membuka modal Buat Pasien Baru
    And user mengatur checkbox Diverifikasi Lengkap menjadi "dicentang"
    Then form Create Pasien menampilkan mode data lengkap

  @regression @patient @positive
  Scenario: User dapat mengisi form Create Pasien ringkas melalui modal
    When user membuka halaman Create Pasien melalui menu "pendaftaran" dan submenu "pendaftaranPasienV2"
    And user membuka modal Buat Pasien Baru
    And user mengisi form Create Pasien dengan data ringkas
    Then form Create Pasien terisi dengan data pasien

  @regression @patient @positive
  Scenario: User dapat membuat pasien baru dengan data lengkap
    When user membuka halaman Create Pasien melalui menu "pendaftaran" dan submenu "pendaftaranPasienV2"
    And user membuka modal Buat Pasien Baru
    And user mengisi form Create Pasien dengan data lengkap
    And user menekan tombol Simpan Pasien
    Then alert simpan pasien menampilkan hasil sukses
    And user berada di halaman pendaftaran create
    And panel Data Pasien menampilkan data pasien yang dibuat
