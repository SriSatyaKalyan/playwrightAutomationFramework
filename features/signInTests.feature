Feature: ECommerce Validations

    Scenario: Placing the Order
        Given User has navigated to the homepage
        When User tries to perform invalid signin with "jai@mail.com" and "p@sswor!d"
        Then User sees appropriate error message