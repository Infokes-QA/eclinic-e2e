Feature: Authentication

  Background:
    Given user berada di halaman Landing Page

  @user-journey @login @positive
  Scenario: Login berhasil menggunakan akun Admin
    Given user sudah berada di halaman Login
    When user login menggunakan akun "admin"
    Then user berhasil masuk ke Halaman Dashboard

  @login-negative @negative
  Scenario Outline: Login gagal menggunakan data invalid
    Given user sudah berada di halaman Login
    When user login ke "<klinik>" menggunakan akun "<username>" dan "<password>" yang tidak valid
    Then sistem menampilkan pesan error login

    Examples:
      | klinik | username | password   |
      | old    | salah    | salah      |