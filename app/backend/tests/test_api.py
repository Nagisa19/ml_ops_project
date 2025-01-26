import pytest

from backend.app import app

@pytest.fixture
def client():
    """
    Fixture pour configurer un client Flask pour les tests.
    Cette fixture est utilisée pour effectuer des requêtes HTTP
    sur l'application Flask sans lancer un serveur réel.
    :return: Instance de client de test Flask
    """
    with app.test_client() as client:
        yield client

def test_home_route(client):
    """
    Teste la route principale '/' pour vérifier qu'elle répond correctement.
    Vérifie que la réponse a un statut HTTP 200 et contient un message de bienvenue.
    :param client: Client Flask pour envoyer des requêtes HTTP.
    """
    response = client.get('/')
    assert response.status_code == 200
    assert "Bienvenue dans l'API de prédiction !".encode('utf-8') in response.data

def test_predict_good_data(client):
    """
    Teste la route '/predict' avec des données valides.
    Vérifie que l'API retourne une prédiction avec un statut HTTP 200.
    :param client: Client Flask pour envoyer des requêtes HTTP.
    """
    data = {
        "features": {
            "MSSubClass": 60,
            "LotFrontage": 80.0,
            "LotArea": 9600,
            "OverallQual": 7,
            "OverallCond": 5,
            "YearBuilt": 2003,
            "YearRemodAdd": 2003,
            "GrLivArea": 1710,
            "FullBath": 2,
            "HalfBath": 1,
            "BedroomAbvGr": 3,
            "ExterQual": "Gd",
            "ExterCond": "TA",
            "HeatingQC": "Ex",
            "KitchenQual": "Gd",
            "Neighborhood": "CollgCr",
            "SaleType": "WD",
            "SaleCondition": "Normal",
            "HouseStyle": "2Story"
        }
    }
    response = client.post('/predict', json=data)
    assert response.status_code == 200
    json_data = response.get_json()
    assert "prediction" in json_data
    assert isinstance(json_data["prediction"], (int, float))  # La prédiction doit être un entier ou un float

def test_predict_missing_features(client):
    """
    Teste la route '/predict' avec des données JSON manquantes.
    Vérifie que l'API retourne une erreur 400 avec un message approprié.
    :param client: Client Flask pour envoyer des requêtes HTTP.
    """
    data = {}  # Pas de clé "features"
    response = client.post('/predict', json=data)
    assert response.status_code == 400
    json_data = response.get_json()
    assert "error" in json_data
    assert "Les données doivent contenir une clé 'features'" in json_data["error"]

def test_predict_invalid_features_format(client):
    """
    Teste la route '/predict' avec un format incorrect pour 'features'.
    Vérifie que l'API retourne une erreur 400 avec un message approprié.
    :param client: Client Flask pour envoyer des requêtes HTTP.
    """
    data = {
        "features": ["invalid", "data", "not", "dictionary"]  # Format invalide
    }
    response = client.post('/predict', json=data)
    assert response.status_code == 400
    json_data = response.get_json()
    assert "error" in json_data
    assert "Les 'features' doivent être un dictionnaire de colonnes." in json_data["error"]

def test_predict_missing_columns(client):
    """
    Teste la route '/predict' avec des colonnes essentielles manquantes dans 'features'.
    Vérifie que l'API retourne une erreur 400 avec une liste des colonnes manquantes.
    :param client: Client Flask pour envoyer des requêtes HTTP.
    """
    data = {
        "features": {
            "MSSubClass": 60,
            "LotFrontage": 80.0,
            # Certaines colonnes essentielles sont absentes
            "GrLivArea": 1710
        }
    }
    response = client.post('/predict', json=data)
    assert response.status_code == 400
    json_data = response.get_json()
    assert "error" in json_data
    assert "Colonnes manquantes" in json_data["error"]

def test_predict_no_json(client):
    """
    Teste la route '/predict' avec un type de contenu incorrect (pas de JSON).
    Vérifie que l'API retourne une erreur 400 avec un message approprié.
    :param client: Client Flask pour envoyer des requêtes HTTP.
    """
    response = client.post('/predict', data="plain text")
    assert response.status_code == 400
    json_data = response.get_json()
    assert "error" in json_data
    assert "Le type de contenu doit être 'application/json'." in json_data["error"]

def test_404_route(client):
    """
    Teste une route inexistante pour vérifier la gestion des erreurs 404.
    Vérifie que le serveur retourne un statut HTTP 404.
    :param client: Client Flask pour envoyer des requêtes HTTP.
    """
    response = client.get('/nonexistent-route')
    assert response.status_code == 404
