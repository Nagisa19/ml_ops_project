from flask import Flask

from backend.routes.prediction_routes import prediction_blueprint

# Initialiser l'application Flask
app = Flask(__name__)

# Enregistrer le blueprint
app.register_blueprint(prediction_blueprint)

@app.route('/')
def home():
    return "Bienvenue dans l'API de prédiction !"

if __name__ == '__main__':
    app.run(debug=True)
