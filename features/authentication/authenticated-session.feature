@authenticated @smoke
Feature: Authenticated Session

  Background:
    Given user sudah login sebagai "admin"

  Scenario Outline: User dapat mengakses aplikasi dengan session tersimpan
    Then user berada di halaman "<halaman>"

    Examples:
      | halaman |
      | Home    |
