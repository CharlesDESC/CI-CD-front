describe("Register Page", () => {
    it("should register a new user", () => {
      // Visite la page d'inscription
      cy.visit("http://localhost:3000/register");
  
      // Remplit les champs
      cy.get("input[name='username']").type("alice");
      cy.get("input[name='email']").type("alice@example.com");
      cy.get("input[name='password']").type("secret");
  
      // Clique sur le bouton Register
      cy.contains("Register").click();
  
      // Vérifie qu'un message s'affiche ou qu'une redirection a eu lieu
      // (ajuste selon ton appli)
      cy.on("window:alert", (str) => {
        expect(str).to.contain("Inscription réussie");
      });
    });
  });