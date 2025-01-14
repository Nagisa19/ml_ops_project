from flask import Blueprint, request, jsonify
import pickle
import numpy as np

# Créer un blueprint pour les routes liées à Iris
iris_blueprint = Blueprint('iris', __name__)

# Chemin du modèle sauvegardé
MODEL_PATH = "./model/iris_model.pkl"

# Charger le modèle
with open(MODEL_PATH, "rb") as model_file:
    model = pickle.load(model_file)

@iris_blueprint.route('/predict', methods=['POST'])
def predict():
    try:
        # Vérifier que le Content-Type est bien 'application/json'
        if not request.is_json:
            return jsonify({"error": "Le type de contenu doit être 'application/json'."}), 400

        # Vérifier que les données sont envoyées au format JSON
        data = request.get_json()

        if not data or 'features' not in data:
            return jsonify({"error": "Les données doivent contenir une clé 'features' avec une liste de valeurs."}), 400

        # Vérifier que les données de 'features' sont valides
        features = data['features']
        if not isinstance(features, list) or not all(isinstance(x, (int, float)) for x in features):
            return jsonify({"error": "Les données de 'features' doivent être une liste de nombres."}), 400

        # Reshape pour le modèle
        features = np.array(features).reshape(1, -1)

        # Faire une prédiction avec le modèle
        prediction = model.predict(features)

        # Convertir la prédiction en type Python natif
        prediction_native = prediction[0].item()  # Convertir numpy.int64 en int

        # Retourner la prédiction
        return jsonify({"prediction": prediction_native})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
