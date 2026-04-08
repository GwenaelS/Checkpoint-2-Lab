describe("Register E2E", () => {
  it("Should register a new user", () => {
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
    cy.get("input[name=username]").type("CypressUser");
    cy.get("input[name=username]").should("have.value", "CypressUser");

    // Email input
    cy.get("input[name=email]").type("cypressUser@gmail.com");
    cy.get("input[name=email]").should("have.value", "cypressUser@gmail.com");

    // Password input
    cy.get("input[name=password]").type("12345");
    cy.get("input[name=password]").should("have.value", "12345");

    // Submit form ==> Login page
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/login");
  });
});
