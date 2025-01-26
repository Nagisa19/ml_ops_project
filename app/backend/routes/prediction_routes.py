from flask import Blueprint, request, jsonify

import cloudpickle
import pandas as pd

# Créer un blueprint pour les routes liées à l'API
prediction_blueprint = Blueprint('prediction', __name__)

# Chemin du modèle sauvegardé
MODEL_PATH = "./model/gradient_boosting.pkl"

# Charger le modèle
try:
    with open(MODEL_PATH, "rb") as model_file:
        pipeline = cloudpickle.load(model_file)
except FileNotFoundError:
    raise FileNotFoundError(f"Le fichier du modèle '{MODEL_PATH}' est introuvable.")

@prediction_blueprint.route('/predict', methods=['POST'])
def predict():
    """
    Gère les requêtes POST à la route '/predict' pour effectuer une prédiction à partir des données fournies.

    Cette fonction :
    - Vérifie que le type de contenu de la requête est 'application/json'.
    - Extrait et valide les données de la requête JSON, en s'assurant que la clé 'features' est présente.
    - Convertit les données de 'features' en DataFrame pour le modèle.
    - Vérifie que toutes les colonnes nécessaires pour la prédiction sont présentes.
    - Utilise un pipeline de machine learning pour effectuer une prédiction.
    - Retourne le résultat de la prédiction sous forme de réponse JSON.

    :return: Une réponse JSON contenant :
        - 'prediction' (float) : La prédiction générée par le modèle.
        - Ou 'error' (str) : Un message d'erreur en cas de problème.
        - Statut HTTP correspondant :
            - 200 : Succès de la prédiction.
            - 400 : Erreur de validation des données.
            - 500 : Erreur interne du serveur.
    """
    try:
        # Vérifier que le Content-Type est bien 'application/json'
        if not request.is_json:
            return jsonify({"error": "Le type de contenu doit être 'application/json'."}), 400

        # Extraire les données JSON
        data = request.get_json()

        # Vérifier que les données contiennent une clé 'features'
        if not data or 'features' not in data:
            return jsonify({"error": "Les données doivent contenir une clé 'features' avec un dictionnaire de colonnes."}), 400

        features = data['features']

        # Convertir les features en DataFrame
        if not isinstance(features, dict):
            return jsonify({"error": "Les 'features' doivent être un dictionnaire de colonnes."}), 400

        features_df = pd.DataFrame([features])

        # Vérifier que toutes les colonnes nécessaires sont présentes
        expected_columns = pipeline.named_steps['preprocessor'].transformers_[0][2] + \
                           pipeline.named_steps['preprocessor'].transformers_[1][2] + \
                           pipeline.named_steps['preprocessor'].transformers_[2][2]
        missing_columns = [col for col in expected_columns if col not in features_df.columns]
        if missing_columns:
            return jsonify({"error": f"Colonnes manquantes dans les données: {missing_columns}"}), 400

        # Prédire avec le pipeline
        prediction = pipeline.predict(features_df)

        # Convertir la prédiction en type Python natif
        prediction_native = prediction[0].item()  # Convertir numpy.float64 en float

        # Retourner la prédiction
        return jsonify({"prediction": prediction_native})

    except Exception as e:
        return jsonify({"error": str(e)}), 500