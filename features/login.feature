Feature: Eclinic Login

  As a user
  I want to login to Eclinic
  So that I can access the dashboard

  @login @smoke @sanity @eclinic
  Scenario: User logs in with valid credentials
    Given user is on the eclinic login page
    When user logs in with valid credentials
    Then user should be redirected to the eclinic home page