import { faker } from "@faker-js/faker";

describe("Register and login E2E", () => {
  it("Should register a new user then connect", () => {
    const username = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    cy.visit("/");

    // Login button (homepage) ==> click (login page)
    cy.get('[data-testid="cypress-login-button"]').should("exist");
    cy.get('[data-testid="cypress-login-button"]').click();
    cy.url().should("include", "/login");

    // The user doesn't have an account so login page ==> register page

    cy.contains("Doesn't have an account ?").should("exist");
    cy.contains("Doesn't have an account ?").click();
    cy.url().should("include", "/register");

    // Register form ==> Dashboard

    // Username input
    cy.get("input[name=username]").type(username);
    cy.get("input[name=username]").should("have.value", username);

    // Email input
    cy.get("input[name=email]").type(email);
    cy.get("input[name=email]").should("have.value", email);

    // Password input
    cy.get("input[name=password]").type(password);
    cy.get("input[name=password]").should("have.value", password);

    // Submit form ==> Login page
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/login");

    // =================================

    // Email input
    cy.get("input[name=email]").type(email);
    cy.get("input[name=email]").should("have.value", email);

    // Password input
    cy.get("input[name=password]").type(password);
    cy.get("input[name=password]").should("have.value", password);

    // Submit form ==> Dashboard
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/dashboard");

    // A cookie should have been created
    cy.getCookie("token").should("exist");
  });
});
