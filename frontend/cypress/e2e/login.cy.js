describe("Login Page", () => {
    it("should allow admin to log in", () => {
      cy.visit("http://localhost:3000/login"); // Ajuste l'URL selon ton routing
  
      // Vérifie que la page s'affiche
      cy.contains("Connexion Admin requise").should("be.visible");
  
      // Vérifie les champs
      cy.contains("Nom d'utilisateur").should("exist");
      cy.contains("Mot de passe").should("exist");
  
      // Remplit le formulaire
      cy.get("input[type='text']").type("adminuser");
      cy.get("input[type='password']").type("password");
  
      // Clique sur le bouton
      cy.contains("Se connecter").click();
  
      // Si tu veux attendre la requête et voir l'affichage admin :
      cy.contains("Liste complète des utilisateurs", { timeout: 10000 }).should("be.visible");
    });
  });