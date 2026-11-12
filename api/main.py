from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib


# Create the FastAPI application
app = FastAPI(
    title="Property Price Prediction API",
    description="API for predicting property selling and rental prices",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://housing-price-prediction-phi.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load the trained ML models
selling_model = joblib.load("selling_price_model.pkl")
rental_model = joblib.load("rental_price_model.pkl")


# Define the data that the API will receive
class PropertyInput(BaseModel):
    size_sqm: float = Field(gt=0)
    num_rooms: int = Field(gt=0)
    house_age_years: int = Field(ge=0)
    
# Prediction endpointdone
@app.post("/predict")
def predict_property(property: PropertyInput):

    # Convert the incoming data into a DataFrame
    new_property = pd.DataFrame({
        "size_sqm": [property.size_sqm],
        "num_rooms": [property.num_rooms],
        "house_age_years": [property.house_age_years]
    })

    # Predict selling price
    selling_price = selling_model.predict(new_property)[0]

    # Predict rental price
    rental_price = rental_model.predict(new_property)[0]

    # Return both predictions
    return {
        "size_sqm": property.size_sqm,
        "num_rooms": property.num_rooms,
        "house_age_years": property.house_age_years,
        "predicted_selling_price": round(float(selling_price), 2),
        "predicted_rental_price": round(float(rental_price), 2)
    }