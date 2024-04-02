Feature: ECommerce Validations

    Scenario: Placing the Order
        Given User has navigated to the homepage
        # Given Login to eCommerce application with valid "liam.k@mail.com" and "MediP@ss"
        When User tries to perform invalid signin with "jai@mail.com" and "p@sswor!d"
        Then User sees appropriate error message