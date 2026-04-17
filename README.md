# 🚀 GigaSure

### AI-Powered Parametric Insurance for Gig Delivery Workers

Protecting gig delivery workers from income loss caused by weather disruptions, pollution, and external events.

---

# 🌍 DEVTrails 2026 Submission

**Team:** HackStreet Boys
**Project:** GigaSure
**Phase:** Phase 3 – Soar 🚀

---

# 🧠 Overview

GigaSure is a **cloud-native, AI-powered parametric insurance platform** designed to protect gig delivery workers from income loss caused by environmental and external disruptions.

Delivery partners in India frequently face sudden income drops (20–30%) due to:

* Heavy rain 🌧️
* Heatwaves ☀️
* Air pollution 🌫️
* Zone shutdowns 🚫

Traditional insurance does not cover **short-term income disruptions**.

👉 GigaSure solves this using:

* AI-based risk modeling
* Real-time disruption detection
* Automated parametric payouts

---

# ⚡ Key Features

* 🤖 AI-driven risk assessment
* 📊 Dynamic premium calculation
* 🌦️ Real-time disruption detection
* 💸 Automated parametric payouts
* 🛡️ Fraud detection (anomaly detection)
* 🗺️ Risk heatmaps
* 🎯 Smart coverage recommendations
* 📢 Worker safety alerts

---

# 👤 Target Persona

### Food Delivery Worker

| Attribute     | Value      |
| ------------- | ---------- |
| Name          | Ravi Kumar |
| Age           | 26         |
| Platform      | Swiggy     |
| City          | Hyderabad  |
| Vehicle       | Bike       |
| Daily Income  | ₹900       |
| Weekly Income | ₹6300      |

---

# ⚠️ Problem Scenario

Heavy rain reduces delivery activity:

| Metric              | Value   |
| ------------------- | ------- |
| Normal Daily Income | ₹900    |
| Hours Lost          | 5 hours |
| Income Loss         | ₹450    |

✅ GigaSure automatically compensates this loss.

---

# 🧩 Problem Statement

India’s gig workforce lacks financial protection against **short-term environmental disruptions**.

GigaSure introduces:

> **AI-driven parametric insurance with automated claim triggering**

---

# 🌦️ Disruptions Covered

| Disruption    | Data Source      | Impact                 |
| ------------- | ---------------- | ---------------------- |
| Heavy Rain    | Weather API      | Delivery slowdown      |
| Heatwave      | Temperature API  | Reduced working hours  |
| Air Pollution | AQI API          | Unsafe work conditions |
| Flooding      | Weather alerts   | Delivery suspension    |
| Zone Closure  | Govt / mock data | Restricted movement    |

---

# ⚙️ Parametric Insurance Model

### Trigger Example

```
Rainfall > 35 mm
AND
Delivery activity drop > 50%
```

✔ Automatically triggers claim
✔ No manual verification

---

# 💸 Payout Calculation

```
Payout = (Hours Lost / Total Hours) × Daily Income
```

Example:

```
(5 / 10) × 900 = ₹450
```

---

# 💰 Weekly Premium Model

| Risk Level  | Premium |
| ----------- | ------- |
| Low Risk    | ₹25     |
| Medium Risk | ₹40     |
| High Risk   | ₹60     |

✔ AI dynamically adjusts pricing

---

# 🤖 AI / ML Integration

### 1. Risk Prediction

* Models: Random Forest, XGBoost
* Output: Risk score + premium

### 2. Fraud Detection

* Model: Isolation Forest
* Detects fake claims, GPS spoofing

### 3. Disruption Prediction

* Predicts probability of future disruptions
* Forecasts income loss

---

# 🏗️ System Architecture (Production)

```mermaid
flowchart TD

A[Frontend - React (Vercel)] --> B[Backend - Spring Boot (Render)]

B --> C[ML Service - FastAPI (Render)]
B --> D[(Neon PostgreSQL)]

C --> D

B --> E[Weather API]
B --> F[AQI API]
B --> G[External Data Sources]
```

---

# ☁️ Cloud Deployment Architecture

| Layer      | Platform                     |
| ---------- | ---------------------------- |
| Frontend   | Vercel                       |
| Backend    | Render (Docker)              |
| ML Service | Render (Docker)              |
| Database   | Neon (Serverless PostgreSQL) |
| CI/CD      | GitHub Actions               |

---

# 🧱 Tech Stack

**Frontend**
React, Vite, Tailwind CSS

**Backend**
Spring Boot, REST APIs

**AI/ML**
Python, FastAPI, Scikit-learn

**Database**
Neon PostgreSQL

**DevOps**
Docker, GitHub Actions, Vercel, Render

---

# 📂 Repository Structure

```
gigasur​e

frontend/
backend/
ml-service/
docs/

README.md
```

---

# 🔄 Data Flow

1. User submits insurance data
2. Backend processes request
3. ML service calculates risk score
4. Parametric engine checks triggers
5. Claim auto-generated
6. Payout calculated and returned

---

# 🚧 Challenges Faced

* 🔗 Microservice communication latency
* ☁️ Multi-cloud deployment (Vercel + Render + Neon)
* 🐳 Docker networking issues
* 🔐 Secure environment configuration
* ⚡ Real-time inference optimization

---

# 🌍 Impact

GigaSure creates a **financial safety net for gig workers**:

* Prevents sudden income shocks
* Enables instant insurance payouts
* Uses AI for fair pricing
* Scales across cities globally

---

# 🔗 Live Demo

👉 https://gigasure.vercel.app/auth

---

# 💻 GitHub Repository

👉 https://github.com/your-username/gigasure

---

# 🎥 Demo Video

👉 https://youtube.com/your-demo-video

---

# 🚀 Future Scope

* Mobile app (React Native)
* Blockchain-based claim transparency
* Integration with Swiggy/Zomato APIs
* Real payment gateway integration
* Advanced deep learning risk models
