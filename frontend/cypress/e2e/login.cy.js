describe("Login Page", () => {
    it("should allow admin to log in", () => {
      cy.visit("http://localhost:3000/users");
  
      // Vérifie que le formulaire est visible
      cy.contains("Connexion Admin requise").should("be.visible");
  
      // Cible les inputs par leur label
      cy.get("label")
        .contains("Nom d'utilisateur")
        .find("input")
        .type("testAdmin");
  
      cy.get("label")
        .contains("Mot de passe")
        .find("input")
        .type("testPass");
  
      // Clique sur le bouton
      cy.contains("Se connecter").click();
  
      // Vérifie que le composant admin est affiché
      cy.contains("Liste complète des utilisateurs", { timeout: 10000 }).should("be.visible");
    });
  });