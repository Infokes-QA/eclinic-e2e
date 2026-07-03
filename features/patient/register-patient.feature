@authenticated @patient @register-patient
Feature: Registrasi Pasien

  Background:
    Given user sudah login sebagai "admin"

  @regression @patient @positive
  Scenario: User dapat membuka halaman pendaftaran create dari menu Pendaftaran
    When user membuka halaman Pendaftaran melalui menu "pendaftaran" dan submenu "pendaftaranPasienV2"
    And user menekan tombol Tambah pada halaman Pendaftaran
    Then user berada di halaman pendaftaran create

  @regression @patient @positive @existing-patient
  Scenario Outline: User dapat memilih pasien existing melalui pencarian pendaftaran
    When user membuka halaman Pendaftaran melalui menu "pendaftaran" dan submenu "pendaftaranPasienV2"
    And user menekan tombol Tambah pada halaman Pendaftaran
    Then user berada di halaman pendaftaran create
    When user mencari pasien existing pada pendaftaran dengan kata kunci "<keyword>"
    And user memilih pasien "<expectedName>" dari hasil pencarian pendaftaran
    Then panel Data Pasien menampilkan pasien "<expectedName>"

    Examples:
      | keyword | expectedName          |
      | Fakhri  | FAKHRI ARIA FADHILLAH |

  @regression @patient @positive @existing-patient
  Scenario Outline: User dapat mendaftarkan pasien existing dengan kunjungan sakit
    When user membuka halaman Pendaftaran melalui menu "pendaftaran" dan submenu "pendaftaranPasienV2"
    And user menekan tombol Tambah pada halaman Pendaftaran
    Then user berada di halaman pendaftaran create
    When user mencari pasien existing pada pendaftaran dengan kata kunci "<keyword>"
    And user memilih pasien "<expectedName>" dari hasil pencarian pendaftaran
    And user memilih pelayanan kunjungan sakit
    And user melanjutkan pendaftaran pasien
    Then pendaftaran pasien berhasil

    Examples:
      | keyword | expectedName          |
      | Fakhri  | FAKHRI ARIA FADHILLAH |


  @regression @patient @positive
  Scenario: User dapat mendaftarkan pasien baru dengan kunjungan sakit
    Given pasien baru sudah dibuat
    When user memilih pelayanan kunjungan sakit
    And user melanjutkan pendaftaran pasien
    Then pendaftaran pasien berhasil

  @regression @patient @positive @register-lengkap-form @register-lengkap-list @register-lengkap-pelayanan
  Scenario Outline: Pendaftaran pasien lengkap ke kunjungan sakit
    Given pasien dengan data "<jenisData>" sudah terdaftar
    And user berada di halaman pendaftaran pasien
    When user mendaftarkan pasien ke kunjungan "<jenisKunjungan>"
    And user memilih tujuan pelayanan "<pelayanan>"
    And user memilih unit pelayanan "<ruangan>"
    And user memilih jadwal "<jadwal>"
    And user menyimpan data pendaftaran
    Then sistem berhasil menyimpan data pendaftaran pasien
    And data pendaftaran tersedia pada daftar pendaftaran pasien
    And data pelayanan tersedia pada daftar pelayanan "<pelayanan>"

    Examples:
      | jenisData | jenisKunjungan | pelayanan   | ruangan   | jadwal          |
      | lengkap   | sakit          | Rawat Jalan | Poli Umum | Dokter Hari Ini |
