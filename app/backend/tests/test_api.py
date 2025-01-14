import pytest

from backend.app import app

@pytest.fixture
def client():
    """Fixture pour créer un client de tests Flask."""
    with app.test_client() as client:
        yield client

def test_home_route(client):
    """Tester la route principale '/'."""
    response = client.get('/')
    assert response.status_code == 200
    assert "Bienvenue dans l'API de prédiction pour le modèle Iris!".encode('utf-8') in response.data

def test_predict_good_data(client):
    """Tester la route /predict avec des données valides."""
    data = {
        "features": [5.1, 3.5, 1.4, 0.2]  # Exemple de données valides pour le modèle Iris
    }
    response = client.post('/predict', json=data)
    assert response.status_code == 200
    json_data = response.get_json()
    assert "prediction" in json_data
    assert isinstance(json_data["prediction"], int)  # La prédiction doit être un entier

def test_predict_missing_features(client):
    """Tester la route /predict avec des données manquantes."""
    data = {}  # Pas de clé "features"
    response = client.post('/predict', json=data)
    assert response.status_code == 400
    json_data = response.get_json()
    assert "error" in json_data
    assert "Les données doivent contenir une clé 'features'" in json_data["error"]

def test_predict_invalid_features(client):
    """Tester la route /predict avec des données invalides."""
    data = {
        "features": ["invalid", "data", "not", "numbers"]  # Données invalides
    }
    response = client.post('/predict', json=data)
    print(response.get_json())
    assert response.status_code == 400
    json_data = response.get_json()
    assert "error" in json_data
    assert "Les données de 'features' doivent être une liste de nombres." in json_data["error"]

def test_predict_no_json(client):
    """Tester la route /predict sans données JSON."""
    response = client.post('/predict', data="plain text")
    print(response.get_json())
    assert response.status_code == 400
    json_data = response.get_json()
    assert "error" in json_data
    assert "Le type de contenu doit être 'application/json'." in json_data["error"]

def test_404_route(client):
    """Tester une route inexistante."""
    response = client.get('/nonexistent-route')
    assert response.status_code == 404
