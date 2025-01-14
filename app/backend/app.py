from flask import Flask
from backend.routes.iris_routes import iris_blueprint

# Initialiser l'application Flask
app = Flask(__name__)

# Enregistrer le blueprint
app.register_blueprint(iris_blueprint)

@app.route('/')
def home():
    return "Bienvenue dans l'API de prédiction pour le modèle Iris!"

if __name__ == '__main__':
    app.run(debug=True)
