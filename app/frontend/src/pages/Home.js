import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';

const Home = () => {
  const [features, setFeatures] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeatures({
      ...features,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('/api/predict', {
        features,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setPredictions((prev) => [
        { features, prediction: response.data.prediction },
        ...prev,
      ]);
      setFeatures({});
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage.split('. ').map((sentence, index) => {
        if (sentence.startsWith("Colonnes manquantes dans les données")) {
          // Extract missing columns and format them
          const columns = sentence.match(/\[(.*?)]/)?.[0] || "[]";
          const formattedColumns = JSON.parse(columns.replace(/'/g, '"'));
          return (
            <span key={index}>
              Colonnes manquantes dans les données:
              <ul>
                {formattedColumns.map((col, idx) => (
                  <li key={idx}>{col}</li>
                ))}
              </ul>
            </span>
          );
        } else {
          return <span key={index}>{sentence}.<br /></span>;
        }
      }));
    }
  };

  return (
    <div className="home-container">
      <h1 className="header">Prediction Interface</h1>

      <div className="form-section">
        <h2>Enter Features for Prediction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="MSSubClass">MSSubClass:</label>
            <select id="MSSubClass" name="MSSubClass" value={features.MSSubClass || ''} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="20">1-STORY 1946 & NEWER ALL STYLES</option>
              <option value="30">1-STORY 1945 & OLDER</option>
              <option value="40">1-STORY W/FINISHED ATTIC ALL AGES</option>
              <option value="45">1-1/2 STORY - UNFINISHED ALL AGES</option>
              <option value="50">1-1/2 STORY FINISHED ALL AGES</option>
              <option value="60">2-STORY 1946 & NEWER</option>
              <option value="70">2-STORY 1945 & OLDER</option>
              <option value="75">2-1/2 STORY ALL AGES</option>
              <option value="80">SPLIT OR MULTI-LEVEL</option>
              <option value="85">SPLIT FOYER</option>
              <option value="90">DUPLEX - ALL STYLES AND AGES</option>
              <option value="120">1-STORY PUD (Planned Unit Development) - 1946 & NEWER</option>
              <option value="150">1-1/2 STORY PUD - ALL AGES</option>
              <option value="160">2-STORY PUD - 1946 & NEWER</option>
              <option value="180">PUD - MULTILEVEL - INCL SPLIT LEV/FOYER</option>
              <option value="190">2 FAMILY CONVERSION - ALL STYLES AND AGES</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="MSZoning">MSZoning:</label>
            <select id="MSZoning" name="MSZoning" value={features.MSZoning || ''} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="A">Agriculture</option>
              <option value="C">Commercial</option>
              <option value="FV">Floating Village Residential</option>
              <option value="I">Industrial</option>
              <option value="RH">Residential High Density</option>
              <option value="RL">Residential Low Density</option>
              <option value="RP">Residential Low Density Park</option>
              <option value="RM">Residential Medium Density</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="LotFrontage">LotFrontage:</label>
            <input
              type="number"
              id="LotFrontage"
              name="LotFrontage"
              value={features.LotFrontage || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="LotArea">LotArea:</label>
            <input
              type="number"
              id="LotArea"
              name="LotArea"
              value={features.LotArea || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="OverallQual">OverallQual:</label>
            <input
              type="number"
              id="OverallQual"
              name="OverallQual"
              value={features.OverallQual || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="OverallCond">OverallCond:</label>
            <input
              type="number"
              id="OverallCond"
              name="OverallCond"
              value={features.OverallCond || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="YearBuilt">YearBuilt:</label>
            <input
              type="number"
              id="YearBuilt"
              name="YearBuilt"
              value={features.YearBuilt || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="YearRemodAdd">YearRemodAdd:</label>
            <input
              type="number"
              id="YearRemodAdd"
              name="YearRemodAdd"
              value={features.YearRemodAdd || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="GrLivArea">GrLivArea:</label>
            <input
              type="number"
              id="GrLivArea"
              name="GrLivArea"
              value={features.GrLivArea || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="FullBath">FullBath:</label>
            <input
              type="number"
              id="FullBath"
              name="FullBath"
              value={features.FullBath || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="HalfBath">HalfBath:</label>
            <input
              type="number"
              id="HalfBath"
              name="HalfBath"
              value={features.HalfBath || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="BedroomAbvGr">BedroomAbvGr:</label>
            <input
              type="number"
              id="BedroomAbvGr"
              name="BedroomAbvGr"
              value={features.BedroomAbvGr || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ExterQual">ExterQual:</label>
            <select id="ExterQual" name="ExterQual" value={features.ExterQual || ''} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Ex">Excellent</option>
              <option value="Gd">Good</option>
              <option value="TA">Average/Typical</option>
              <option value="Fa">Fair</option>
              <option value="Po">Poor</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ExterCond">ExterCond:</label>
            <select id="ExterCond" name="ExterCond" value={features.ExterCond || ''} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Ex">Excellent</option>
              <option value="Gd">Good</option>
              <option value="TA">Average/Typical</option>
              <option value="Fa">Fair</option>
              <option value="Po">Poor</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="HeatingQC">HeatingQC:</label>
            <select id="HeatingQC" name="HeatingQC" value={features.HeatingQC || ''} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Ex">Excellent</option>
              <option value="Gd">Good</option>
              <option value="TA">Average/Typical</option>
              <option value="Fa">Fair</option>
              <option value="Po">Poor</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="KitchenQual">KitchenQual:</label>
            <select id="KitchenQual" name="KitchenQual" value={features.KitchenQual || ''} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Ex">Excellent</option>
              <option value="Gd">Good</option>
              <option value="TA">Average/Typical</option>
              <option value="Fa">Fair</option>
              <option value="Po">Poor</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="Neighborhood">Neighborhood:</label>
            <input
              type="text"
              id="Neighborhood"
              name="Neighborhood"
              value={features.Neighborhood || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="SaleType">SaleType:</label>
            <select id="SaleType" name="SaleType" value={features.SaleType || ''} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="WD">Warranty Deed - Conventional</option>
              <option value="CWD">Warranty Deed - Cash</option>
              <option value="VWD">Warranty Deed - VA Loan</option>
              <option value="New">Home just constructed and sold</option>
              <option value="COD">Court Officer Deed/Estate</option>
              <option value="Con">Contract 15% Down payment regular terms</option>
              <option value="ConLw">Contract Low Down payment and low interest</option>
              <option value="ConLI">Contract Low Interest</option>
              <option value="ConLD">Contract Low Down</option>
              <option value="Oth">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="SaleCondition">SaleCondition:</label>
            <select id="SaleCondition" name="SaleCondition" value={features.SaleCondition || ''} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Normal">Normal Sale</option>
              <option value="Abnorml">Abnormal Sale</option>
              <option value="AdjLand">Adjoining Land Purchase</option>
              <option value="Alloca">Allocation</option>
              <option value="Family">Sale between family members</option>
              <option value="Partial">Partial Sale</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="HouseStyle">HouseStyle:</label>
            <select id="HouseStyle" name="HouseStyle" value={features.HouseStyle || ''} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="1Story">One story</option>
              <option value="1.5Fin">One and one-half story: 2nd level finished</option>
              <option value="1.5Unf">One and one-half story: 2nd level unfinished</option>
              <option value="2Story">Two story</option>
              <option value="2.5Fin">Two and one-half story: 2nd level finished</option>
              <option value="2.5Unf">Two and one-half story: 2nd level unfinished</option>
              <option value="SFoyer">Split Foyer</option>
              <option value="SLvl">Split Level</option>
            </select>
          </div>

   <button type="submit" className="submit-button">Get Prediction</button>
        </form>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}
      </div>

      <div className="history-section">
        <h2>Prediction History</h2>
        <ul className="history-list">
          {predictions.map((entry, index) => (
            <li key={index}>
              <details>
                <summary>Prediction {index + 1}</summary>
                <div>
                  <p><strong>Prediction:</strong> {entry.prediction}</p>
                  <p><strong>Parameters:</strong></p>
                  <ul>
                    {Object.entries(entry.features).map(([key, value]) => (
                      <li key={key}>{key}: {value}</li>
                    ))}
                  </ul>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
