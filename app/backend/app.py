from flask import Flask

from backend.routes.prediction_routes import prediction_blueprint

# Initialiser l'application Flask
app = Flask(__name__)

# Enregistrer le blueprint
app.register_blueprint(prediction_blueprint)

@app.route('/')
def home():
    """
    Gère la route principale '/'.

    Cette fonction sert de point d'entrée principal à l'API. Elle retourne un message de bienvenue indiquant que
    l'API est opérationnelle.

    :return: Une réponse HTTP contenant :
        - Un message de bienvenue (str).
        - Statut HTTP 200 (OK).
    """
    return "Bienvenue dans l'API de prédiction !"

if __name__ == '__main__':
    app.run(debug=True)
