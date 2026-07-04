Feature: Authentication

  @smoke @login @positive @login-via-landing
  Scenario Outline: Login berhasil menggunakan akun Admin
    Given user berada di halaman Landing Page
    When user hover menu "<menu>"
    And user memilih submenu "<submenu>" pada menu "<menu>"
    Then user berada di halaman Login
    When user login menggunakan akun "admin"
    Then user berhasil masuk ke Halaman Dashboard

    Examples:
      | menu              | submenu |
      | patientManagement | pratama |

  @smoke @login @positive @login-direct
  Scenario: Login berhasil langsung dari halaman Login
    Given user berada di halaman Login
    When user login menggunakan akun "admin"
    Then user berhasil masuk ke Halaman Dashboard

  @login @negative
  Scenario Outline: Login gagal menggunakan data invalid
    Given user berada di halaman Landing Page
    When user hover menu "<menu>"
    And user memilih submenu "<submenu>" pada menu "<menu>"
    Then user berada di halaman Login
    When user memilih klinik "<clinic>"
    And user mengisi ID Pengguna "<username>"
    And user mengisi Kata Sandi "<password>"
    And user menekan tombol Login
    Then sistem menampilkan pesan error login

    Examples:
      | menu              | submenu | clinic         | username | password   |
      | patientManagement | pratama | Klinik A dev 4 | salah    | salah      |
      | patientManagement | pratama | Klinik A dev 4 | 123123   | salah      |
      | patientManagement | pratama | Klinik A dev 4 | salah    | invalid-password |
