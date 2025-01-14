describe('Home Component E2E Tests', () => {
  beforeEach(() => {
    // Visiter la page d'accueil avant chaque test
    cy.visit('http://localhost');
  });

  it('should display predictions when "Fetch Predictions" is clicked', () => {
    // Simuler les réponses de l'API pour chaque requête POST à `/api/predict`
    const mockPredictions = [
      { prediction: 1 },
      { prediction: 0 },
      { prediction: 2 },
    ];

    // Simuler les réponses de l'API dans l'ordre des prédictions
    let requestCounter = 0; // Compteur pour suivre l'ordre des requêtes

    cy.intercept('POST', '/api/predict', (req) => {
      req.reply(mockPredictions[requestCounter % mockPredictions.length]);
      requestCounter++; // Incrémenter le compteur après chaque requête
    }).as('fetchPrediction');


    // Cliquez sur le bouton "Fetch Predictions"
    cy.get('.home-button').click();

    // Attendre que toutes les requêtes soient exécutées
    cy.wait('@fetchPrediction');

    // Vérifier que trois prédictions sont affichées
    cy.get('.predictions-list li').should('have.length', 3);

    // Vérifier que le contenu brut des prédictions s'affiche
    cy.contains('Prediction 1: {"prediction":1}').should('exist');
    cy.contains('Prediction 2: {"prediction":0}').should('exist');
    cy.contains('Prediction 3: {"prediction":2}').should('exist');
  });

  it('should display an error if the API call fails', () => {
    // Simuler une erreur pour l'API
    cy.intercept('POST', '/api/predict', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('fetchPredictionError');

    // Cliquez sur le bouton "Fetch Predictions"
    cy.get('.home-button').click();

    // Attendre que l'erreur soit capturée
    cy.wait('@fetchPredictionError');

    // Vérifier que le message d'erreur s'affiche
    cy.get('.error').should('contain', 'Error: Request failed with status code 500');
  });
});
