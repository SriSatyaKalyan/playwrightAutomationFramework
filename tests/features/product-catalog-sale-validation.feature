@Regression @ProductCatalog
Feature: Product Catalog Sale Validation
    As a shopper
    I want to see discounted products and accurate prices
    So that I can trust catalog pricing

    Scenario: Validate all sale items and their prices in the catalog
        Given I open the Bellatrix shop home page
        Then I should see 5 products in the catalog result count
        And the following products should be marked as sale with correct prices:
            | product       | originalPrice | salePrice     |
            | Falcon 9      | 600.00€       | 50.00€        |
            | Proton Rocket | 6,500,000.00€ | 4,500,000.00€ |
            | Saturn V      | 143.00€       | 120.00€       |
            | Falcon Heavy  | 1,500.00€     | 1,200.00€     |