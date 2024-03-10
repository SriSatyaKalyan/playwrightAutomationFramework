Feature: ECommerce Validations

    Scenario: Placing the Order
        Given Login to eCommerce application with valid "liam.k@mail.com" and "MediP@ss"
        When Added item to cart
        Then Item is displayed in cart