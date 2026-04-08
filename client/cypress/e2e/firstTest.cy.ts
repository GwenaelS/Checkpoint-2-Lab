describe("template spec", () => {
  it("passes", () => {
    cy.visit("/");

    cy.get('[data-testid="cypress-login-button"]')
      .should("exist")
      .should("have.text", "Connexion");

    cy.get('[data-testid="cypress-register-button"]')
      .should("exist")
      .should("have.text", "Inscription");
  });
});
