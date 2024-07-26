# Software Engineer Candidate Homework

We need you to develop a small part of an e-commerce application.

## Requirements

- Create Product
    - only admins can create products.
    - product has a category, all categories are fixed they don't change, the categories are: furniture, electronics, beauty, garden.

- Update Product
    - only admins can update the products.

- List Products
    - admins and normal users can list the products.
    - normal users (also known as customer) should not be able to know the exact available quantity.
    - for customers, if the quantity is less than 5 then they should see "low", if the quantity less than 10 then they should see "limited", else they should see "available".
    - admins on the other hand can see the exact quantity value.
    - the user can filter by name, category.
    - keep in mind these products can be thousands or even more.

- General Product Requirements:
    - we want to keep track of who created or last updated the products, and when these actions happened.
    - two products cannot have the same name.

- Place an Order
    - only customers can place an order.
    - an order can have multiple products.
    - the customer can use a discount code to make discount on the total price of the order.
    - only non-expired discount codes can be used.
    - the discount can be activated only when the total price start at a specific value.
        - for example, let say there is a discount code "ABC123", and this discount code start be activated/used when the total price is 25,000 IQD , but another discount code "ZYX123" can be activated/used when the total price is 50,000 IQD.
    - the discount is fixed value, for example 5,000 IQD.
    - the discount code can be used only once.
    - the user have to select the payment method, we need to support two methods: XyzWallet and CreditCard
        - XyzWallet is an imaginary payment method that require the user to enter his phone number and wallet password
        - you don't need to worry about the implementation of the payments methods, just use fake implementation.

- List Orders
    - only admins can list orders.
    - show the total profit of each order.
    - the user can filter by customer, payment method.

- List My Orders
    - this feature will be used by customers to list the order that belongs to them.
    - we want the customer to see: the total price, payment method used, purchase date, discount value if available.

- Login
    - a simple login by username and password.

## Implementation Details

- Implement only the backend side.
- Use RESTful principles for API design.
- Stick to the requirements.
- Choose any language/technology that you most know.
- We prefer using a relational database for this app.
- Write the code as if it were production-ready, with considerations for maintainability and scalability.
- Ensure the code follows best practices.
- Choose the tech-stack that you most comfortable with

## Bonus Points

- write automated tests.
- build the database using migrations.
- documentation for the API.

## Submission Instructions

- Submit your solution via a GitHub repository.
- Include a SUBMISSION.md with setup instructions, explanations of your approach, and any assumptions made.

## Timebox

we expect you to submit your solution within 7 days.
