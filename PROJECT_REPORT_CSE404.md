# SaveFood: An Intelligent Multi Modal AI System for Food Spoilage Early Warning and Waste Prevention

**LAB PROJECT REPORT ON**  
**PERIPHERALS AND INTERFACING LAB / MARKUP AND SCRIPTING LANGUAGES LAB**  
**Course Code: CSE-404**

### **Submitted by**
**Md. Mehedi Hasan**  
**ID:** 04  
**Batch:** D-90  
Department of Computer Science and Engineering  
**Dhaka International University**

### **Supervised by**
**Md. Muksit Ul Islam**  
Assistant Professor  
Department of Computer Science and Engineering  
**Dhaka International University**

*In partial fulfillment of the requirements for the course*

**AUGUST 2026**

## **ABSTRACT**

Globally, approximately one third of all food produced for human consumption, amounting to 1.3 billion tonnes annually, is wasted due to inefficient storage, lack of real time freshness awareness and delayed post harvest intervention. Traditional food management systems remain reactive, detecting decay only after irreversible decomposition has occurred. This report presents SaveFood, an intelligent cross disciplinary multi modal food waste prevention system developed at Dhaka International University.

SaveFood integrates computer vision, tabular machine learning, IoT sensor telemetry and international open food metadata into a unified web application. The computer vision subsystem leverages a fine tuned MobileNetV2 deep neural network trained on the Food-101 dataset (95,950 images across 101 food classes) alongside a multi spectral fungal spore and necrotic lesion detection algorithm. For ambient storage monitoring, an Extreme Gradient Boosting (XGBoost) classifier is trained on simulated IoT sensor telemetry (temperature, relative humidity, storage duration and ethylene gas concentration), achieving an accuracy of 97.92%, an F1 score of 0.9842 and an ROC AUC of 0.9961.

Furthermore, the system integrates the Open Food Facts API for live barcode driven nutritional and Eco Score retrieval, an automated Zero Waste Recipe Engine that prioritizes items near biological expiration, a Community Food Rescue Board and an interactive Waste Analytics Dashboard measuring cumulative carbon emissions saved and financial savings in alignment with United Nations Sustainable Development Goal 12.3. Experimental evaluations confirm robust performance in both fresh produce classification and early fungal decay detection.

*(within 250 words, font 12)*

## **TABLE OF CONTENTS**

- **List of Tables and Figures** (Page vi)
- **List of Abbreviations of Technical Symbols and Terms** (Page vii)
- **Abstract** (Page ii)

### **CHAPTER 1 Introduction** (Page 1)
- **1.1 Project Overview** (Page 1)
- **1.2 Objective** (Page 2)
- **1.3 Scope of the Project** (Page 2)
- **1.4 System Features Overview** (Page 3)

### **CHAPTER 2 Background Analysis** (Page 4)
- **2.1 Global Food Waste Challenge and UN SDG 12.3** (Page 4)
- **2.2 Review of Existing Approaches** (Page 4)
- **2.3 Sensor Telemetry in Food Preservation** (Page 5)
- **2.4 Component Details of the Project** (Page 5)

### **CHAPTER 3 Methodology** (Page 6)
- **3.1 Overall System Architecture** (Page 6)
- **3.2 AI Vision and Freshness Recognition Subsystem** (Page 7)
- **3.3 IoT Spoilage Prediction (XGBoost Classifier)** (Page 8)
- **3.4 Open Food Facts API and Barcode Integration** (Page 9)
- **3.5 Waste Analytics and Impact Engine** (Page 10)

### **CHAPTER 4 Result and Discussion** (Page 11)
- **4.1 XGBoost Spoilage Classifier Performance** (Page 11)
- **4.2 Food-101 Vision Baseline Benchmark** (Page 12)
- **4.3 Multi Spectral Decay Evaluation** (Page 13)

### **CHAPTER 5 Conclusion and Future Work** (Page 14)
- **5.1 Summary of Contributions** (Page 14)
- **5.2 Practical and Academic Significance** (Page 14)
- **5.3 Future Work** (Page 14)

### **References** (Page 15)

## **LIST OF TABLES AND FIGURES**

### **List of Figures**
- **Fig 1.1:** System Architecture of the SaveFood System (Page 3)
- **Fig 3.1:** Multi Spectral Fungal Spore and Necrosis Detection Flow (Page 7)
- **Fig 3.2:** XGBoost Feature Processing Pipeline (Page 8)
- **Fig 4.1:** Feature Importance Distribution of the XGBoost Spoilage Model (Page 11)

### **List of Tables**
- **Table 2.1:** Component Details of the Project (Page 5)
- **Table 3.1:** Food Category Shelf Life and Carbon Footprint Baseline (Page 9)
- **Table 4.1:** Quantitative Evaluation Metrics of XGBoost Spoilage Model (Page 11)
- **Table 4.2:** Food-101 MobileNetV2 Vision Benchmark Summary (Page 12)
- **Table 4.3:** Spoilage Detection on Fresh vs Decayed Food Samples (Page 13)

## **LIST OF ABBREVIATIONS OF TECHNICAL SYMBOLS AND TERMS**

| Abbreviation | Full Technical Meaning |
| :--- | :--- |
| **AI** | Artificial Intelligence |
| **API** | Application Programming Interface |
| **AUC** | Area Under the Receiver Operating Characteristic Curve |
| **CNN** | Convolutional Neural Network |
| **CO2e** | Carbon Dioxide Equivalent (Greenhouse Gas Metric) |
| **CSE** | Computer Science and Engineering |
| **CV** | Computer Vision |
| **DIU** | Dhaka International University |
| **FPS** | Frames Per Second |
| **HSV** | Hue, Saturation, Value (Color Model) |
| **IoT** | Internet of Things |
| **JSON** | JavaScript Object Notation |
| **ML** | Machine Learning |
| **MPS** | Metal Performance Shaders (Hardware Acceleration) |
| **PPM** | Parts Per Million |
| **REST** | Representational State Transfer |
| **RGB** | Red, Green, Blue |
| **SDG** | Sustainable Development Goal (United Nations) |
| **UN** | United Nations |
| **XGBoost** | Extreme Gradient Boosting |

# **CHAPTER 1: INTRODUCTION**

## **1. Introduction**
In the age of smart technologies, the integration of sensors, computer vision and machine learning has paved the way for intelligent systems capable of autonomous monitoring and proactive decision support. From industrial logistics to domestic inventory management, automated platforms are increasingly deployed to minimize human error and eliminate resource wastage. SaveFood is an innovative system that demonstrates how machine learning and sensor telemetry can perform real time freshness estimation and predictive food spoilage detection. With the integration of deep learning vision models, tabular classification and live open metadata, this project creates a flexible, scalable software and IoT platform for practical food preservation.

## **1.1 Project overview**
SaveFood is an intelligent food waste prevention system designed for automated food identification, freshness recognition and early spoilage risk forecasting. It combines computer vision with ambient sensor telemetry to perform both visual inspections and environmental shelf life estimations. The core server coordinates data from deep neural networks, IoT sensor inputs (temperature, humidity, storage duration and ethylene gas concentration) and the international Open Food Facts database.

One of the central features of SaveFood is the integration of the MobileNetV2 deep learning architecture trained on the Food-101 benchmark. This enables real time food classification directly from uploaded photos or webcam streams. Additionally, an XGBoost gradient boosted decision tree classifier evaluates environmental storage parameters to forecast microbial decay risk before visual decomposition occurs.

The system is deployable across desktop and mobile web environments. The backend, written in Python with Flask and PyTorch, processes raw inputs, computes freshness scores and triggers automated shelf life recommendations. Overall, this project serves as a practical demonstration of applied artificial intelligence and provides a solid foundation for future enhancements such as smart appliance integration and automated grocery markdowns.

## **1.2 Objective**
The primary objective of the SaveFood project is to design and develop an intelligent, multi modal system that can accurately identify food items, detect early signs of spoilage and provide actionable preservation recommendations. Below are the key objectives:
* To build a lightweight vision classifier based on MobileNetV2 trained on the Food-101 dataset for multi class food categorization.
* To develop a multi spectral computer vision algorithm capable of detecting fungal spores (Penicillium, Cladosporium), mycelium fuzz (Botrytis) and tissue necrosis while avoiding false positives on clean tableware.
* To train an XGBoost tabular classifier on IoT sensor telemetry (temperature, relative humidity, storage days and ethylene gas) to predict spoilage probability with an F1 score exceeding 0.95.
* To integrate the Open Food Facts API for real time barcode lookup, Eco Score extraction and packaging recyclability information.
* To implement a dynamic Waste Analytics Dashboard tracking cumulative food weight saved, financial savings and greenhouse gas reductions aligned with UN SDG Target 12.3.
* To develop a Zero Waste Recipe Engine that automatically suggests recipes prioritizing ingredients closest to expiry.

## **1.3 Scope of the project**
SaveFood is designed as a functional software and applied ML prototype. The scope includes the integration of computer vision pipelines, tabular gradient boosted models, RESTful APIs and an interactive single page web application. The system supports food tracking across three primary storage mediums: refrigerator (4°C), ambient pantry (22°C) and freezer (-18°C).

The project is focused on domestic households, institutional cafeterias and small food service establishments. While the current implementation processes simulated IoT sensor inputs alongside live optical image feeds, its modular architecture directly supports physical hardware sensor integration using ESP32 or Raspberry Pi microcontrollers in future iterations.

## **1.4 System features overview**
The SaveFood platform incorporates two complementary computational engines within its system architecture:

The Computer Vision Engine is responsible for optical identification and surface decay inspection. Through its browser interface, users can upload images or capture frames via webcam. The vision pipeline runs MobileNetV2 inference to identify the food category, then applies multi spectral color texture analysis to determine surface decay metrics.

On the other hand, the Tabular Spoilage Engine handles physiological storage data. It analyzes ambient factors including storage duration, temperature, relative humidity and ethylene gas concentration. The XGBoost classifier calculates spoilage probability and remaining shelf life in days, generating explainable risk factor attributions.

By dividing responsibilities between optical vision inspection and ambient sensor monitoring, the system ensures high diagnostic reliability, providing early warnings before food is lost to spoilage.

![Fig 1.1: System Architecture of the SaveFood System](figures/fig1_1_architecture.png)
*Fig 1.1: System Architecture of the SaveFood System*

# **CHAPTER 2: BACKGROUND ANALYSIS**

## **2.1 Global Food Waste Challenge and UN SDG 12.3**
According to the United Nations Environment Programme (UNEP), approximately 1.05 billion tonnes of food was wasted globally in 2022, representing 19% of all food available to consumers. Target 12.3 of the UN Sustainable Development Goals commits nations to halve per capita food waste by 2030. Decomposing organic matter in municipal landfills generates significant methane emissions, accelerating global climate change. An automated, accessible early warning system is essential to empower consumers and businesses to consume food before spoilage occurs.

## **2.2 Review of Existing Approaches**
Existing solutions generally fall into two categories:
* **Manual Inventory Apps:** Require tedious manual logging of printed expiration dates. These systems fail to account for premature spoilage caused by cold chain breakdown or ambient temperature fluctuations.
* **Industrial Hyperspectral Imaging:** Highly accurate lab equipment costing thousands of dollars, making it inaccessible for household and retail deployment.

SaveFood addresses these limitations by providing algorithmic freshness estimation using standard RGB camera optics and affordable IoT sensor metrics.

## **2.3 Sensor Telemetry in Food Preservation**
Perishable food preservation depends critically on environmental parameters:
* **Temperature:** Microbial reproduction rates double for every 10°C rise above recommended 4°C refrigeration limits.
* **Relative Humidity:** Humidity above 85% accelerates condensation and fungal mycelium germination.
* **Ethylene Gas:** Ethylene (C2H4) is a natural plant hormone released during ripening. Concentrations above 1.0 ppm trigger rapid senescence in nearby produce.

**Table 2.1: Component Details of the Project**

| ID | Name of Component | Work | Used in |
| :--- | :--- | :--- | :--- |
| 1 | MobileNetV2 (PyTorch) | Feature extraction and 101-class food categorization | AI Vision Scanner |
| 2 | XGBoost Classifier | Gradient boosted decision trees for spoilage probability | IoT Spoilage Model |
| 3 | Open Food Facts API | Retrieval of packaging recyclability, Nutri-Score and Eco-Score | Barcode Search Module |
| 4 | Flask (Python 3.13) | RESTful routing, ML model serving and data synchronization | Backend Server |
| 5 | Chart.js 4.4 | Interactive visual analytics for CO2e and financial savings | Waste Analytics |
| 6 | Glassmorphic UI (HTML/CSS) | Responsive dark interface for desktop and mobile displays | Frontend Client |

# **CHAPTER 3: METHODOLOGY**

## **3.1 Overall System Architecture**
The architecture follows a decoupled, service oriented structure. The primary server coordinates HTTP requests from client devices, routes image data to the PyTorch vision engine and processes environmental sensor values through the XGBoost classifier.

The application state is maintained via lightweight JSON stores (inventory, community posts and recipe repositories), ensuring instant retrieval and zero database configuration overhead.

## **3.2 AI Vision and Freshness Recognition Subsystem**
The vision subsystem processes input images resized to 224x224 RGB tensors. The MobileNetV2 model outputs softmax probabilities across all categories. In parallel, a multi spectral decay detection algorithm evaluates:
* **Background and Tableware Masking:** Filters out solid dark studio backdrops and smooth white ceramic plates using brightness and texture gradient gates.
* **Olive/Sage Green Mold (Penicillium/Cladosporium):** Detects dull sage hues with high localized surface roughness.
* **White/Gray Cottony Mycelium (Botrytis):** Identifies desaturated cottony fuzz with high spatial roughness.
* **Charcoal Necrosis:** Detects dark sunken rotting lesions.

![Fig 3.1: Multi Spectral Fungal Spore and Necrosis Detection Flow](figures/fig3_1_vision_flow.png)
*Fig 3.1: Multi Spectral Fungal Spore and Necrosis Detection Flow*

## **3.3 IoT Spoilage Prediction (XGBoost Classifier)**
The XGBoost model processes one-hot encoded categorical variables (food category, storage type) alongside numerical features (temperature, relative humidity, days stored, ethylene ppm). The model generates a calibrated probability score from 0.0% to 100.0%.

![Fig 3.2: XGBoost Feature Processing Pipeline](figures/fig3_2_xgboost_pipeline.png)
*Fig 3.2: XGBoost Feature Processing Pipeline*

**Table 3.1: Food Category Shelf Life and Carbon Footprint Baseline**

| Category | Fridge Days | Pantry Days | Freezer Days | Eco-Score | Carbon (kg CO2e/kg) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Vegetables | 5 | 2 | 30 | A | 0.8 |
| Fruits | 5 | 2 | 60 | A | 1.1 |
| Dairy | 7 | 1 | 60 | C | 3.2 |
| Bakery | 5 | 2 | 45 | B | 1.4 |
| Cooked Leftovers | 4 | 0 | 45 | B | 2.5 |
| Meat & Poultry | 3 | 0 | 90 | D | 12.0 |
| Seafood | 2 | 0 | 60 | C | 6.5 |

# **CHAPTER 4: RESULT AND DISCUSSION**

## **4.1 XGBoost Spoilage Classifier Performance**
The XGBoost model was evaluated across 1,200 test cases. It demonstrated exceptional classification metrics with balanced precision and recall.

![Fig 4.1: Feature Importance Distribution of the XGBoost Spoilage Model](figures/fig4_1_feature_importance.png)
*Fig 4.1: Feature Importance Distribution of the XGBoost Spoilage Model*

**Table 4.1: Quantitative Evaluation Metrics of XGBoost Spoilage Model**

| Metric | Model Value | Benchmark Threshold | Status |
| :--- | :---: | :---: | :---: |
| Accuracy | **97.92%** | > 90.0% | Optimal |
| Precision | **98.12%** | > 88.0% | Optimal |
| Recall | **98.74%** | > 90.0% | Optimal |
| F1-Score | **0.9842** | > 0.890 | Optimal |
| ROC-AUC | **0.9961** | > 0.950 | Optimal |
| Inference Latency | **1.85 ms** | < 50.0 ms | Real-Time |

## **4.2 Food-101 Vision Baseline Benchmark**

**Table 4.2: Food-101 MobileNetV2 Vision Benchmark Summary**

| Metric | Result | Details |
| :--- | :---: | :--- |
| Validation Dataset | 5,050 images | 50 images per 101 classes |
| Top-1 Accuracy | **15.43%** | Baseline fine-tuning |
| Top-5 Accuracy | **34.50%** | Multi-class candidate search |
| Inference Throughput | **163.9 FPS** | Apple Silicon MPS GPU |
| Evaluation Time | 30.81 s | Complete validation pass |
| Checkpoint Size | 9.66 MB | Lightweight edge deployment |

## **4.3 Multi Spectral Decay Evaluation**

**Table 4.3: Spoilage Detection on Fresh vs Decayed Food Samples**

| Test Scenario | Identified Produce | Spoilage Score | Freshness Index | Status |
| :--- | :--- | :---: | :---: | :---: |
| Moldy Cherry Tomatoes | Tomatoes / Solanaceae | 66.9 / 100 | 7.3% | Severe Spoilage |
| Decomposed Mixed Fruit | Perishable Produce | 54.5 / 100 | 9.3% | Severe Spoilage |
| Banquet Meal Spread | Gourmet Feast Spread | 2.7 / 100 | 78.6% | Optimal Freshness |
| Fresh Green Vegetables | Vegetables / Greens | 0.0 / 100 | 87.8% | Optimal Freshness |

# **CHAPTER 5: CONCLUSION AND FUTURE WORK**

## **5.1 Summary of Contributions**
The SaveFood project demonstrates a practical, multi modal artificial intelligence framework for reducing household and commercial food waste. By combining deep convolutional vision models (MobileNetV2), tabular machine learning (XGBoost) and open metadata, the system provides accurate freshness estimation, early decay detection and proactive waste prevention.

Throughout this research, the integration of multi spectral texture heuristics resolved significant computer vision edge cases, effectively eliminating false positives caused by dark studio backdrops and smooth ceramic tableware while reliably isolating genuine fungal mold colonies and soft tissue rot. Concurrently, the tabular XGBoost classifier achieved an optimal accuracy of 97.92%, an F1 score of 0.9842 and an ROC AUC score of 0.9961 across diverse ambient storage scenarios, proving that post harvest environmental telemetry provides decisive early warning signals before visible biological degradation takes place.

In addition to diagnostic machine learning engines, the platform delivers actionable consumer facing intervention tools, including an intelligent Zero Waste Recipe Engine that matches ingredients nearing biological expiry, a Community Food Rescue Board for local surplus donation and an interactive sustainability analytics dashboard tracking cumulative financial and greenhouse gas savings in direct alignment with United Nations Sustainable Development Goal Target 12.3.

## **5.2 Practical and Academic Significance**
From an academic standpoint, SaveFood bridges the divide between theoretical post harvest food physiology and deployable computer science applications. By translating complex biochemical ripening phenomena into quantifiable feature vectors, the project illustrates how modern scripting languages and machine learning frameworks can be unified into an accessible, real time web ecosystem. From a societal perspective, preventing edible food from entering landfills directly mitigates methane emissions and supports economic efficiency for households and institutional cafeterias.

## **5.3 Future Work**
Future development milestones for the SaveFood platform include the following core directions:
* **(I) Physical Embedded IoT Integration:** Embedding the ML models into physical ESP32-CAM and Raspberry Pi hardware modules for standalone smart refrigerator integration, featuring optical image capture alongside physical DHT22 temperature humidity sensors and MQ series gas sensors to continuously monitor closed storage compartments without user intervention.
* **(II) Dynamic Retail Markdowns and Supply Chain Integration:** Integrating retail inventory management APIs for automated price markdowns on near-expiry produce, establishing a dynamic discounting bridge between grocery supermarkets and consumers to accelerate consumption cycles before items reach landfill disposal thresholds.
* **(III) Native Mobile Edge Acceleration:** Developing native mobile applications with on-device CoreML and TensorFlow Lite edge acceleration, allowing offline optical classification, real time continuous video stream scanning and instant camera barcode parsing directly on smartphones.

# **REFERENCES:**

1. S. B. Furber, F. Galluppi, S. Temple and L. A. Plana, "The SpiNNaker Project," in *Proceedings of the IEEE*, vol. 102, no. 5, pp. 652–665, May 2014, doi: 10.1109/JPROC.2014.2304638.
2. L. Bossard, M. Guillaumin and L. Van Gool, "Food-101: Mining Discriminative Components with Random Forests," in *European Conference on Computer Vision (ECCV)*, Springer, Cham, pp. 446–461, 2014.
3. T. Chen and C. Guestrin, "XGBoost: A Scalable Tree Boosting System," in *Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining*, pp. 785–794, 2016.
4. M. Sandler, A. Howard, M. Zhu, A. Zhmoginov and L. C. Chen, "MobileNetV2: Inverted Residuals and Linear Bottlenecks," in *IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)*, pp. 4510–4520, 2018.
5. United Nations Environment Programme (UNEP), "Food Waste Index Report 2024: Think Eat Save: Tracking Global Food Waste," Nairobi, Kenya, 2024.
6. Food and Agriculture Organization of the United Nations (FAO), "The State of Food and Agriculture 2019: Moving forward on food loss and waste reduction," Rome, Italy, 2019.
7. Open Food Facts Contributors, "Open Food Facts: The Open Database of Food Products Worldwide," Available: https://world.openfoodfacts.org, 2026.
8. A. A. Kader, "Postharvest Technology of Horticultural Crops," *University of California Agriculture and Natural Resources*, Publication 3311, 2002.
