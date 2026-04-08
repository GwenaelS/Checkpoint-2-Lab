describe("Login E2E", () => {
  it("Should connect an user that already exist", () => {
    cy.visit("/");

    // Login button (homepage) ==> click (login page)
    cy.get('[data-testid="cypress-login-button"]').should("exist");
    cy.get('[data-testid="cypress-login-button"]').click();
    cy.url().should("include", "/login");

    // Login form ==> Dashboard

    // Email input
    cy.get("input[name=email]").type("samyngwenaelpro@gmail.com");
    cy.get("input[name=email]").should(
      "have.value",
      "samyngwenaelpro@gmail.com",
    );

    // Password input
    cy.get("input[name=password]").type("12345");
    cy.get("input[name=password]").should("have.value", "12345");

    // Submit form ==> Dashboard
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/dashboard");
  });
});
