import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def generate_synthetic_data(n_samples=1000):
    np.random.seed(42)
    
    # Features
    distance_from_base = np.random.uniform(0, 100, n_samples)
    claim_amount = np.random.uniform(100, 5000, n_samples)
    historical_claims_count = np.random.randint(0, 10, n_samples)
    worker_safety_score = np.random.uniform(1, 5, n_samples)
    delivery_frequency = np.random.uniform(0.1, 1.0, n_samples)
    ip_anomaly_score = np.random.uniform(0, 1, n_samples)
    
    # Label logic (simulated fraud patterns)
    # High risk if: distance is very high AND (ip_anomaly is high OR safety score is low)
    fraud_prob = (
        (distance_from_base > 60) * 0.4 +
        (ip_anomaly_score > 0.8) * 0.3 +
        (historical_claims_count > 5) * 0.2 +
        (worker_safety_score < 2) * 0.1
    )
    
    is_fraud = (fraud_prob + np.random.normal(0, 0.1, n_samples) > 0.6).astype(int)
    
    df = pd.DataFrame({
        'distance_from_base': distance_from_base,
        'claim_amount': claim_amount,
        'historical_claims_count': historical_claims_count,
        'worker_safety_score': worker_safety_score,
        'delivery_frequency': delivery_frequency,
        'ip_anomaly_score': ip_anomaly_score,
        'is_fraud': is_fraud
    })
    return df

if __name__ == "__main__":
    print("Generating synthetic insurance data...")
    df = generate_synthetic_data()
    
    X = df.drop('is_fraud', axis=1)
    y = df['is_fraud']
    
    print("Training Random Forest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    model_path = os.path.join('gigasure-backend', 'ml', 'fraud_model.joblib')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")
    
    # Save feature names for reference
    with open(os.path.join('gigasure-backend', 'ml', 'features.txt'), 'w') as f:
        f.write('\n'.join(X.columns.tolist()))
