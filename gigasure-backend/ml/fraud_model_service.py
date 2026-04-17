from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os

app = Flask(__name__)

# Load the model
model_path = os.path.join(os.path.dirname(__file__), 'fraud_model.joblib')
model = joblib.load(model_path)

@app.route('/evaluate', methods=['POST'])
def evaluate():
    try:
        data = request.json
        # Expected features: distance_from_base, claim_amount, historical_claims_count, 
        # worker_safety_score, delivery_frequency, ip_anomaly_score
        
        df = pd.DataFrame([data])
        
        # Get probability
        probs = model.predict_proba(df)[0]
        fraud_prob = probs[1] # Probability of class 1 (Fraud)
        
        # Determine reasoning (simple feature importance for this sample)
        reasoning = []
        if data['distance_from_base'] > 60:
            reasoning.append(f"High distance from base ({data['distance_from_base']:.1f} km)")
        if data['ip_anomaly_score'] > 0.8:
            reasoning.append("High IP anomaly score detected")
        if data['worker_safety_score'] < 2.5:
            reasoning.append(f"Low worker safety rating ({data['worker_safety_score']:.1f}/5)")
        
        if not reasoning:
            reasoning.append("No specific anomalies detected, general risk assessment applied.")

        return jsonify({
            "fraud_probability": float(fraud_prob),
            "is_suspicious": bool(fraud_prob > 0.6),
            "reasoning": "; ".join(reasoning),
            "model_type": "RandomForestClassifier",
            "confidence": float(max(probs))
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model_loaded": True})

if __name__ == "__main__":
    print("Starting Fraud Detection ML Service on port 5000...")
    app.run(port=5000)
