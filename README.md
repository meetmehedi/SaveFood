# SaveFood 🥗
### An Intelligent Food Waste Prevention System
**A Research-Based Project for Markup & Scripting Languages Lab (Lab 04)**  
**Dhaka International University (DIU)**

---

## 👨‍🎓 Project Credits & Attribution

| Role | Name | Details |
| :--- | :--- | :--- |
| **Student / Researcher** | **Md. Mehedi Hasan** | Batch: **D-90**, Roll: **04**, Dept. of CSE, Dhaka International University |
| **Project Supervisor** | **Md. Muksit Ul Islam** | Assistant Professor, Dept. of CSE, Dhaka International University |
| **Date** | 1st August, 2026 | Submission & Evaluation |

---

## 🎯 Research Objectives & Key Modules

Based on the official DIU lab project presentation (`04_Markup and Scripting Languages Lab.pdf`):

1. **01 Freshness Recognition**:
   - Image-based food identification via **MobileNetV2 / EfficientNet** on Food-101 categories.
   - Dynamic Freshness Index scoring based on visual color distribution and senescence heuristics.
2. **02 Spoilage Prediction (XGBoost)**:
   - Extreme Gradient Boosting classifier trained on IoT sensor telemetry: **Temperature (°C)**, **Relative Humidity (%)**, **Storage Duration (Days)**, **Ethylene Gas (ppm)**, and **Storage Type (Fridge / Pantry / Freezer)**.
   - **Calibrated F1-Score: 0.89** (Accuracy: ~98%, ROC-AUC: 0.99).
3. **03 Metadata Integration (Open Food Facts API)**:
   - Live barcode lookup & search query fetching packaging recyclability, Nutri-Score, Eco-Score, ingredients, and shelf-life recommendations.
4. **04 Waste Analytics Dashboard**:
   - Interactive Chart.js visualizations displaying:
     - Weight saved vs. wasted (kg)
     - Money saved ($ / ৳)
     - Carbon footprint / CO₂ reduction (kg CO₂e)
     - Category breakdown and monthly trends aligned with **UN SDG 12.3**.
5. **05 Personalized Suggestions**:
   - Zero-waste recipe recommendation engine automatically prioritizing ingredients nearing expiry.
   - Preservation hacks and shelf-life extension tips.
6. **Future Scope Modules**:
   - Barcode scanning & real-time inventory management.
   - Community Surplus Food Rescue Board for local sharing with shelters and neighbors.

---

## 🛠️ Technology Stack

- **ML Core**: Python 3.13, PyTorch (`torchvision` MobileNetV2), XGBoost (`xgboost.XGBClassifier`), Scikit-Learn, NumPy, Pillow
- **Backend API**: Flask (Python) with REST endpoints
- **Data Source**: Open Food Facts API v2 (with offline caching)
- **Frontend**: HTML5, Vanilla CSS3 (Modern Glassmorphic Dark UI), Vanilla JavaScript (ES6 Modules)
- **Visual Analytics**: Chart.js 4.4, FontAwesome 6

---

## 🚀 Installation & Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/meetmehedi/SaveFood.git
cd savefood
```

### 2. Install dependencies
```bash
pip install flask xgboost torch torchvision scikit-learn numpy pillow requests
```

### 3. (Optional) Re-train ML Models

**A. Train IoT Spoilage Classifier (XGBoost):**
```bash
python3 train_spoilage_model.py
```

**B. Fine-Tune Food Vision Model on Food-101 (MobileNetV2 with Apple Silicon MPS GPU):**
```bash
# Rapid test (5 images per class)
python3 train_food101_vision.py --subset_per_class 5 --epochs 3

# Full dataset training (101 classes, 95,950 images)
python3 train_food101_vision.py --epochs 10 --batch_size 64
```

**C. Evaluate Vision Model on Food-101 Validation Split:**
```bash
python3 evaluate_food101.py
```

### 4. Launch the Web Application
```bash
python3 app.py
```

Open your browser and visit: **`http://127.0.0.1:5050`**

---

## 📊 Model Evaluation Summary

| Metric | XGBoost Spoilage Model | Vision Model (Food-101) |
| :--- | :--- | :--- |
| **Algorithm** | XGBoost Classifier | MobileNetV2 (Pre-trained) |
| **F1-Score** | **0.89+ (Calibrated)** | Top-1 & Top-5 Confidence |
| **Accuracy** | **97.9%** | Multi-class Classification |
| **Features Used** | Temp, Humidity, Days, Ethylene, Storage, Category | RGB Pixel Tensors & Color Temperature |

---

## 📜 License

MIT License © Md. Mehedi Hasan — Dhaka International University (DIU)
