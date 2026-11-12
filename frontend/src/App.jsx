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
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        "Unable to connect to the prediction service. Please make sure the FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSize("");
    setRooms("");
    setAge("");
    setResult(null);
    setError("");
  };

  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">P</div>
          <div>
            <h2>PropValue</h2>
            <span>AI Property Valuation</span>
          </div>
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          Prediction Engine Online
        </div>
      </nav>

      {/* Hero */}
      <main className="main-content">

        <section className="hero">
          <div className="hero-text">
            <span className="eyebrow">SMART PROPERTY ANALYTICS</span>

            <h1>
              <span>Estimate your property's
               market value.</span>
            </h1>

            <p>
              Enter a few property details and our machine learning models
              will estimate both the selling price and rental value.
            </p>
          </div>
        </section>

        {/* Main Card */}
        <section className="prediction-layout">

          {/* Input panel */}
          <div className="card input-card">

            <div className="card-header">
              <div>
                <span className="section-label">PROPERTY DETAILS</span>
                <h2>Tell us about the property</h2>
              </div>

              <div className="step-number">01</div>
            </div>

            <form onSubmit={predictProperty}>

              <div className="form-group">
                <label>
                  Property Size
                  <span>Square meters</span>
                </label>

                <div className="input-wrapper">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="180"
                    required
                  />
                  <span>m²</span>
                </div>
              </div>

              <div className="form-group">
                <label>
                  Number of Rooms
                  <span>Total rooms</span>
                </label>

                <div className="input-wrapper">
                  <input
                    type="number"
                    min="1"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    placeholder="3"
                    required
                  />
                  <span>Rooms</span>
                </div>
              </div>

              <div className="form-group">
                <label>
                  Property Age
                  <span>Years since construction</span>
                </label>

                <div className="input-wrapper">
                  <input
                    type="number"
                    min="0"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="5"
                    required
                  />
                  <span>Years</span>
                </div>
              </div>

              <div className="button-group">
                <button
                  className="predict-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Calculating...
                    </>
                  ) : (
                    <>
                      Calculate Property Value
                      <span className="arrow">→</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="reset-button"
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </form>

            {error && (
              <div className="error-message">
                <strong>Prediction unavailable</strong>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Results panel */}
          <div className="card results-card">

            <div className="card-header">
              <div>
                <span className="section-label">VALUATION RESULTS</span>
                <h2>Estimated market value</h2>
              </div>

              <div className="step-number">02</div>
            </div>

            {!result ? (
              <div className="empty-state">
                <div className="empty-icon">⌂</div>

                <h3>Ready for a valuation?</h3>

                <p>
                  Enter the property information on the left and your
                  estimated values will appear here.
                </p>

                <div className="prediction-types">
                  <div>
                    <span>01</span>
                    <p>Estimated Selling Price</p>
                  </div>

                  <div>
                    <span>02</span>
                    <p>Estimated Rental Price</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="results">

                <div className="property-summary">
                  <div>
                    <span>PROPERTY</span>
                    <strong>
                      {result.size_sqm} m² · {result.num_rooms} rooms
                    </strong>
                  </div>

                  <div>
                    <span>AGE</span>
                    <strong>{result.house_age_years} years</strong>
                  </div>
                </div>

                <div className="price-card selling">
                  <div className="price-label">
                    <span className="price-icon">↗</span>
                    <div>
                      <span>ESTIMATED SELLING PRICE</span>
                      <small>Predicted market value</small>
                    </div>
                  </div>

                  <div className="price">
                    {result.predicted_selling_price.toLocaleString()}
                  </div>
                </div>

                <div className="price-card rental">
                  <div className="price-label">
                    <span className="price-icon">⌂</span>
                    <div>
                      <span>ESTIMATED RENTAL PRICE</span>
                      <small>Predicted rental value</small>
                    </div>
                  </div>

                  <div className="price">
                    {result.predicted_rental_price.toLocaleString()}
                  </div>
                </div>

                <div className="result-note">
                  <span>ⓘ</span>
                  These values are machine-learning estimates based on the
                  property characteristics provided.
                </div>

              </div>
            )}
          </div>

        </section>

        {/* Footer information */}
        <section className="features">

          <div>
            <strong>01</strong>
            <span>Machine Learning</span>
            <p>Predictions generated using trained regression models.</p>
          </div>

          <div>
            <strong>02</strong>
            <span>Instant Results</span>
            <p>Receive selling and rental estimates in seconds.</p>
          </div>

          <div>
            <strong>03</strong>
            <span>Data Driven</span>
            <p>Estimates are based on property characteristics.</p>
          </div>

        </section>

      </main>

      <footer>
        <span>PropValue</span>
        <span>Property Price Prediction System</span>
      </footer>

    </div>
  );
}

export default App;