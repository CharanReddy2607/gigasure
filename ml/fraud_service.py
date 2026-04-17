from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from sklearn.linear_model import LogisticRegression
import joblib
import os

app = FastAPI(title="GigaSure Fraud Intelligence Service")

# Model Persistence Path
MODEL_PATH = "fraud_model.joblib"

class FraudFeatures(BaseModel):
    claimFrequency: int
    distanceFromEvent: float
    workerRiskScore: float

def train_and_save_model():
    """Trains a dummy Logistic Regression model with synthetic data"""
    print("Training ML model with synthetic data...")
    # Features: [claimFrequency, distanceFromEvent, workerRiskScore]
    # Labels: 0 (Good), 1 (Fraud)
    X = np.array([
        [0, 5, 0.1],   # Low risk, close distance, clean history
        [1, 10, 0.5],
        [4, 60, 2.5],  # High frequency, far distance, high risk score
        [5, 80, 4.0],
        [0, 50, 0.2],  # Far but low frequency (suspicious but maybe okay)
        [3, 5, 2.0]    # High frequency but close (suspicious)
    ])
    y = np.array([0, 0, 1, 1, 0, 1])
    
    model = LogisticRegression()
    model.fit(X, y)
    joblib.dump(model, MODEL_PATH)
    print("Model saved to", MODEL_PATH)

# Initial Model Generation
if not os.path.exists(MODEL_PATH):
    train_and_save_model()

# Load the trained model
model = joblib.load(MODEL_PATH)

@app.post("/predictFraud")
async def predict_fraud(features: FraudFeatures):
    try:
        # Prepare input for inference
        input_data = np.array([[
            features.claimFrequency,
            features.distanceFromEvent,
            features.workerRiskScore
        ]])
        
        # Get probability of class 1 (Fraud)
        prob = model.predict_proba(input_data)[0][1]
        
        return {
            "fraudProbability": round(float(prob), 4),
            "status": "SUCCESS"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Use PORT from environment for cloud compatibility (Render)
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
