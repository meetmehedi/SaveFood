SaveFood 🥗

Intelligent Food Waste Prevention System

Overview

SavePlate is a machine learning-powered smart system designed to help individuals and businesses reduce food waste. Globally, one-third of all food is wasted every year - a problem that has economic, social, and environmental consequences. SavePlate helps track, predict, and manage food to reduce waste and make consumption more sustainable.

Features
	•	AI-Powered Food Tracking
Automatically identifies stored food and monitors its freshness.


	•	Spoilage Prediction
Alerts users before food goes bad using trained ML models.


	•	Waste Analytics Dashboard
Visualizes how much food and money you’ve saved over time.


	•	Personalized Suggestions
Provides recipe suggestions to use ingredients before they spoil.


Datasets Used
	•	Food-101 - Images of 101 food categories used to train the recognition model.
	•	Open Food Facts - Metadata on packaging, expiry, and nutritional information.


Tech Stack
	•	Backend: Python, TensorFlow / PyTorch (for ML model)
	•	Frontend: Streamlit / React (for web/mobile interface)
	•	APIs: Open Food Facts API for real-time food metadata
	•	ML Model: MobileNetV2 / EfficientNet for fast and lightweight image classification


Installation
	1.	Clone the repository:

git clone https://github.com/yourusername/SavePlate.git
cd SavePlate

	2.	Create a virtual environment and activate it:

python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

	3.	Install dependencies:

pip install -r requirements.txt

	4.	Run the app:

streamlit run app.py



Usage
	1.	Upload a photo of your food.
	2.	The AI model identifies the food category.
	3.	Receive alerts on freshness and spoilage predictions.
	4.	Get personalized suggestions to reduce waste.


Future Work
	•	Integration with barcode scanning for packaged foods.
	•	Real-time inventory management for homes and restaurants.
	•	Community sharing and sustainability tips.


Contributing

We welcome contributions from developers, researchers, and data enthusiasts!
Please fork the repository and submit a pull request for improvements.


License

MIT License © Md. Mehedi Hasan
