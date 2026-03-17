Feature: Login Eclinic

@login @smoke @sanity @eclinic
Scenario: User can login with valid credentials
    Given user navigates to eclinic login page
    When user selects klinik
    And user enters valid eclinic username and password
    And user clicks eclinic login button
    Then user will be directed to eclinic home page