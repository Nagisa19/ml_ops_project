describe('Home Component E2E Tests', () => {
  beforeEach(() => {
    // Visiter la page d'accueil avant chaque test
    cy.visit('http://localhost');
  });

  it('should display predictions with detailed parameters when predictions are made', () => {
    // Simuler la réponse de l'API
    const mockPrediction = {
      prediction: 250000,
    };

    // Intercepter la requête POST et répondre avec le mock
    cy.intercept('POST', '/api/predict', {
      statusCode: 200,
      body: mockPrediction,
    }).as('fetchPrediction');

    // Remplir les champs requis (exemple)
    cy.get('#MSSubClass').select('20');
    cy.get('#MSZoning').select('RL');
    cy.get('#LotFrontage').type('80');
    cy.get('#LotArea').type('9600');
    cy.get('#OverallQual').type('7');
    cy.get('#OverallCond').type('5');
    cy.get('#YearBuilt').type('2003');
    cy.get('#YearRemodAdd').type('2003');
    cy.get('#GrLivArea').type('1710');
    cy.get('#FullBath').type('2');
    cy.get('#HalfBath').type('1');
    cy.get('#BedroomAbvGr').type('3');
    cy.get('#ExterQual').select('Gd');
    cy.get('#ExterCond').select('TA');
    cy.get('#HeatingQC').select('Ex');
    cy.get('#KitchenQual').select('Gd');
    cy.get('#Neighborhood').type('CollgCr');
    cy.get('#SaleType').select('WD');
    cy.get('#SaleCondition').select('Normal');
    cy.get('#HouseStyle').select('2Story');

    // Soumettre le formulaire
    cy.get('.submit-button').click();

    // Attendre la réponse du mock
    cy.wait('@fetchPrediction');

    // Vérifier qu'un nouvel élément apparaît dans l'historique
    cy.get('.history-list li')
      .should('have.length.at.least', 1);

    // Vérifier que l'élément contient la mention "Prediction"
    cy.get('.history-list li')
      .first() // le plus récent est en haut selon votre code ou en bas, à adapter
      .should('contain', 'Prediction');

    // Déplier le <details> pour voir le contenu
    cy.get('.history-list li')
      .first()
      .within(() => {
        cy.get('summary').click();

        // Vérifier la valeur de la prédiction
        cy.get('p').should('contain', 'Prediction: 250000');

        // Vérifier la présence de certaines features
        cy.get('ul li').should('contain', 'MSSubClass: 20');
        cy.get('ul li').should('contain', 'MSZoning: RL');
        cy.get('ul li').should('contain','LotFrontage: 80');
        cy.get('ul li').should('contain','LotArea: 9600');
        cy.get('ul li').should('contain','OverallQual: 7');
        cy.get('ul li').should('contain','OverallCond: 5');
        cy.get('ul li').should('contain','YearBuilt: 2003');
        cy.get('ul li').should('contain','YearRemodAdd: 2003');
        cy.get('ul li').should('contain','GrLivArea: 1710');
        cy.get('ul li').should('contain','FullBath: 2');
        cy.get('ul li').should('contain','HalfBath: 1');
        cy.get('ul li').should('contain','BedroomAbvGr: 3');
        cy.get('ul li').should('contain','ExterQual: Gd');
        cy.get('ul li').should('contain','ExterCond: TA');
        cy.get('ul li').should('contain','HeatingQC: Ex');
        cy.get('ul li').should('contain','KitchenQual: Gd');
        cy.get('ul li').should('contain','Neighborhood: CollgCr');
        cy.get('ul li').should('contain','SaleType: WD');
        cy.get('ul li').should('contain','SaleCondition: Normal');
        cy.get('ul li').should('contain','HouseStyle: 2Story');
      });

    // Vérifier que les champs du formulaire sont réinitialisés
    cy.get('#MSSubClass').should('have.value', '');
    cy.get('#MSSubClass').should('have.value', '');
    cy.get('#MSZoning').should('have.value', '');
    cy.get('#LotFrontage').should('have.value', '');
    cy.get('#LotArea').should('have.value', '');
    cy.get('#OverallQual').should('have.value', '');
    cy.get('#OverallCond').should('have.value', '');
    cy.get('#YearBuilt').should('have.value', '');
    cy.get('#YearRemodAdd').should('have.value', '');
    cy.get('#GrLivArea').should('have.value', '');
    cy.get('#FullBath').should('have.value', '');
    cy.get('#HalfBath').should('have.value', '');
    cy.get('#BedroomAbvGr').should('have.value', '');
    cy.get('#ExterQual').should('have.value', '');
    cy.get('#ExterCond').should('have.value', '');
    cy.get('#HeatingQC').should('have.value', '');
    cy.get('#KitchenQual').should('have.value', '');
    cy.get('#Neighborhood').should('have.value', '');
    cy.get('#SaleType').should('have.value', '');
    cy.get('#SaleCondition').should('have.value', '');
    cy.get('#HouseStyle').should('have.value', '');
  });

  it('should display an error if the API call fails (500)', () => {
    // Simuler une erreur 500 côté serveur
    cy.intercept('POST', '/api/predict', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('fetchPredictionError');

    // Remplir un champ au moins pour simuler une requête
    cy.get('#MSSubClass').select('20');

    // Soumettre le formulaire
    cy.get('.submit-button').click();

    // Attendre l’erreur
    cy.wait('@fetchPredictionError');

    // Vérifier que le message d'erreur s'affiche
    cy.get('.error-message')
      .should('contain', 'Error: Internal Server Error');
  });

  it('should display missing columns error if the API returns specific message', () => {
    // Exemple de message renvoyé par l'API quand il manque des colonnes
    // On suppose que l’API renvoie une liste de colonnes manquantes dans le message
    const missingColumnsError = {
      error: "Colonnes manquantes dans les données : ['OverallQual', 'Neighborhood']. Veuillez vérifier vos entrées."
    };

    cy.intercept('POST', '/api/predict', {
      statusCode: 400,
      body: missingColumnsError,
    }).as('fetchPredictionMissingCols');

    // Ne remplir volontairement pas tous les champs (pour simuler l'erreur)
    cy.get('#MSSubClass').select('20');

    // Soumettre le formulaire
    cy.get('.submit-button').click();
    cy.wait('@fetchPredictionMissingCols');

    // Vérifier l'affichage de l'erreur custom
    cy.get('.error-message').within(() => {
      // Vous transformez le message en liste <ul> + <li> dans votre code
      // On s'attend ici à voir la liste de colonnes manquantes
      cy.contains('Colonnes manquantes dans les données');
      cy.contains('OverallQual');
      cy.contains('Neighborhood');
    });
  });
});
