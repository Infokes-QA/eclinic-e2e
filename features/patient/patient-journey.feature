@patient @journey
Feature: Alur Pasien

  @regression @patient @positive @login @journey @patient-journey-e2e
  Scenario Outline: Alur pasien end-to-end dari login hingga pelayanan
    Given user sukses login ke aplikasi eClinic dengan akun "<role>"
    And user berhasil membuat data pasien baru dengan jenis data "<jenisData>"
    And user mendaftarkan pasien umum ke instalasi rawat jalan melalui loket untuk kunjungan "<jenisKunjungan>" di "<ruangan>" dengan jadwal "<jadwal>"

    Examples:
      | role  | jenisData | jenisKunjungan | ruangan   | jadwal          |
      | admin | lengkap   | sakit          | Poli Umum | Dokter Hari Ini |
