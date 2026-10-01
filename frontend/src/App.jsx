import { useState } from "react";
import "./App.css";

function App() {
  const [size, setSize] = useState("");
  const [rooms, setRooms] = useState("");
  const [age, setAge] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const predictProperty = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          size_sqm: Number(size),
          num_rooms: Number(rooms),
          house_age_years: Number(age),
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }

      const data = await response.json();

      setResult(data);
    } catch (err) {
      setError(
        "Could not connect to the prediction server. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Property Price Predictor</h1>

      <p className="description">
        Enter the property details to predict its selling and rental prices.
      </p>

      <form onSubmit={predictProperty}>
        <div className="form-group">
          <label>Property Size (sqm)</label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. 180"
            required
          />
        </div>

        <div className="form-group">
          <label>Number of Rooms</label>

          <input
            type="number"
            min="1"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            placeholder="e.g. 3"
            required
          />
        </div>

        <div className="form-group">
          <label>House Age (years)</label>

          <input
            type="number"
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 5"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Price"}
        </button>
      </form>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {result && (
        <div className="results">
          <h2>Prediction Results</h2>

          <div className="result-card">
            <h3>Predicted Selling Price</h3>

            <p>
              {result.predicted_selling_price.toLocaleString()}
            </p>
          </div>

          <div className="result-card">
            <h3>Predicted Rental Price</h3>

            <p>
              {result.predicted_rental_price.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;