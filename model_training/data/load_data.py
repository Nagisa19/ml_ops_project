import pandas as pd
from sklearn.datasets import load_iris


def load_iris_data():
    # Charger le dataset Iris
    data = load_iris()

    # Créer un DataFrame à partir des données
    iris_df = pd.DataFrame(data.data, columns=data.feature_names)
    iris_df['target'] = data.target

    # Sauvegarder le DataFrame dans un fichier CSV
    csv_filename = "iris.csv"
    iris_df.to_csv(csv_filename, index=False)

    print(f"Dataset Iris sauvegardé dans le fichier: {csv_filename}")

if __name__ == '__main__':
    load_iris_data()
