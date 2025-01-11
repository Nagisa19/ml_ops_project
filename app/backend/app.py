from flask import Flask, request, jsonify
import pickle
import numpy as np

# Chemin du modèle sauvegardé
MODEL_PATH = "./model/iris_model.pkl"

# Charger le modèle
with open(MODEL_PATH, "rb") as model_file:
    model = pickle.load(model_file)

# Initialiser l'application Flask
app = Flask(__name__)

@app.route('/')
def home():
    return "Bienvenue dans l'API de prédiction pour le modèle Iris!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Vérifier que les données sont envoyées au format JSON
        data = request.get_json()

        if not data or 'features' not in data:
            return jsonify({"error": "Les données doivent contenir une clé 'features' avec une liste de valeurs."}), 400

        # Extraire les caractéristiques depuis les données JSON
        features = np.array(data['features']).reshape(1, -1)

        # Faire une prédiction avec le modèle
        prediction = model.predict(features)

        # Convertir la prédiction en type Python natif
        prediction_native = prediction[0].item()  # Convertir numpy.int64 en int

        print(prediction[0])

        # Retourner la prédiction
        return jsonify({"prediction": prediction_native})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
