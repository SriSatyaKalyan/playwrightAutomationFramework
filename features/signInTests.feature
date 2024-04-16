@SignInTests
Feature: ECommerce Validations

    @Regression
    Scenario: Invalid Login
        Given User has navigated to the homepage
        When User tries to perform invalid signin with "jai@mail.com" and "p@sswor!d"
        Then User sees appropriate error message

    @Regression
    Scenario: Valid Login
        Given User has navigated to the homepage
        When User tries to perform invalid signin with "liam.k@mail.com" and "MediP@ss"
        Then User sees appropriate welcome message

    Scenario Outline: Account Creation with Password Strength: "<strength>"
        Given User wants to create a new account
        Given User enters credentials "<firstName>", "<lastName>", "<emailAddress>", "<password>"
        When User re-enters the passwordConfirmation with "<password>"
        Then User sees appropriate data "<strength>" message
        Examples:
            | firstName | lastName | emailAddress    | password | strength |
            | Liam      | Konisegg | liam.k@mail.com | MediP@ss | Medium   |
            | Natalie   | Konisegg | nate.k@mail.com | WeakPass | Weak     |
