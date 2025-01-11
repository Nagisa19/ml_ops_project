import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';

const Home = () => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);

  const exampleData = [
    { features: [6.7, 3.1, 4.4, 1.4] },
    { features: [5.1, 3.5, 1.4, 0.2] },
    { features: [6.0, 2.2, 5.0, 1.5] },
  ];

  const fetchPrediction = async (features) => {
    try {
      const response = await axios.post('/api/predict', {
        features,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const fetchAllPredictions = async () => {
    setError(null);
    const results = [];
    for (const example of exampleData) {
      const prediction = await fetchPrediction(example.features);
      if (prediction) {
        results.push(prediction);
      }
    }
    setPredictions(results);
  };

  return (
    <div className="home-container">
      <h1 className="header">ML OPS test</h1>
      <div className="home">
        <h2>Iris model test</h2>
        <div className="predictions-section">
          <button className="home-button" onClick={fetchAllPredictions}>Fetch Predictions</button>
          {error && <p className="error">Error: {error}</p>}
          <ul className="predictions-list">
            {predictions.map((prediction, index) => (
              <li key={index}>Prediction {index + 1}: {JSON.stringify(prediction)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;