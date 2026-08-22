"""
SaveFood: Generate Publication-Quality Report Figures for CSE-404 Project Report
Author: Md. Mehedi Hasan (Roll: 04, DIU)
"""

import os
import json
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

os.makedirs("figures", exist_ok=True)

# Set high-quality styling
plt.rcParams['font.sans-serif'] = 'Helvetica, Arial, DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#333333'
plt.rcParams['axes.linewidth'] = 1.0

# -------------------------------------------------------------
# FIGURE 1.1: System Architecture Diagram
# -------------------------------------------------------------
def generate_fig1_1():
    fig, ax = plt.subplots(figsize=(10, 5.5), dpi=300)
    ax.axis('off')
    
    # Background card
    rect = patches.FancyBboxPatch((0.02, 0.02), 0.96, 0.96, boxstyle="round,pad=0.02",
                                  facecolor="#f8fafc", edgecolor="#cbd5e1", linewidth=1.5)
    ax.add_patch(rect)
    
    # Layer 1: Inputs
    ax.text(0.12, 0.90, "INPUT LAYER", fontsize=11, fontweight='bold', color="#0f172a", ha='center')
    box_camera = patches.FancyBboxPatch((0.04, 0.58), 0.16, 0.24, boxstyle="round,pad=0.01", facecolor="#e0f2fe", edgecolor="#0284c7", linewidth=1.5)
    ax.add_patch(box_camera)
    ax.text(0.12, 0.73, "Camera / Upload\nImage Input\n(224x224 RGB)", fontsize=9, ha='center', va='center', fontweight='bold', color="#0369a1")
    
    box_sensors = patches.FancyBboxPatch((0.04, 0.22), 0.16, 0.28, boxstyle="round,pad=0.01", facecolor="#fef3c7", edgecolor="#d97706", linewidth=1.5)
    ax.add_patch(box_sensors)
    ax.text(0.12, 0.36, "IoT Sensors\n• Temp & Humidity\n• Storage Days\n• Ethylene (ppm)", fontsize=9, ha='center', va='center', fontweight='bold', color="#92400e")
    
    # Layer 2: ML Engine
    ax.text(0.46, 0.90, "DUAL AI & ML ENGINE (ml_engine.py)", fontsize=11, fontweight='bold', color="#0f172a", ha='center')
    
    box_mobilenet = patches.FancyBboxPatch((0.28, 0.58), 0.36, 0.24, boxstyle="round,pad=0.01", facecolor="#ecfdf5", edgecolor="#059669", linewidth=1.5)
    ax.add_patch(box_mobilenet)
    ax.text(0.46, 0.70, "MobileNetV2 (Food-101)\n+ Multi-Spectral Spore & Necrosis Decay\n(Output: Freshness Index %)", fontsize=9, ha='center', va='center', fontweight='bold', color="#065f46")
    
    box_xgboost = patches.FancyBboxPatch((0.28, 0.22), 0.36, 0.28, boxstyle="round,pad=0.01", facecolor="#f5f3ff", edgecolor="#7c3aed", linewidth=1.5)
    ax.add_patch(box_xgboost)
    ax.text(0.46, 0.36, "XGBoost Tabular Spoilage Classifier\n(Acc: 97.92%, F1: 0.9842, ROC-AUC: 0.9961)\n(Output: Spoilage Probability & Remaining Days)", fontsize=9, ha='center', va='center', fontweight='bold', color="#5b21b6")
    
    # Layer 3: Application Server & User Modules
    ax.text(0.82, 0.90, "APPLICATION & DASHBOARD", fontsize=11, fontweight='bold', color="#0f172a", ha='center')
    
    modules = [
        ("Smart Inventory Expiry Tracking", 0.76),
        ("Open Food Facts Barcode & Nutri-Score", 0.60),
        ("Zero-Waste Rescue Recipe Engine", 0.44),
        ("UN SDG 12.3 Carbon & Cost Analytics", 0.28),
        ("Community Surplus Food Sharing", 0.12)
    ]
    for name, y_pos in modules:
        b = patches.FancyBboxPatch((0.68, y_pos - 0.04), 0.28, 0.10, boxstyle="round,pad=0.01", facecolor="#ffffff", edgecolor="#64748b", linewidth=1.2)
        ax.add_patch(b)
        ax.text(0.82, y_pos + 0.01, name, fontsize=8.5, ha='center', va='center', fontweight='bold', color="#1e293b")
        
    # Connective Arrows
    arrowprops = dict(arrowstyle="->,head_width=0.4,head_length=0.6", lw=1.8, color="#0f172a")
    ax.annotate("", xy=(0.28, 0.70), xytext=(0.20, 0.70), arrowprops=arrowprops)
    ax.annotate("", xy=(0.28, 0.36), xytext=(0.20, 0.36), arrowprops=arrowprops)
    
    ax.annotate("", xy=(0.68, 0.68), xytext=(0.64, 0.70), arrowprops=arrowprops)
    ax.annotate("", xy=(0.68, 0.36), xytext=(0.64, 0.36), arrowprops=arrowprops)
    
    plt.tight_layout()
    plt.savefig("figures/fig1_1_architecture.png", bbox_inches='tight', dpi=300)
    plt.close()
    print("✅ Generated figures/fig1_1_architecture.png")

# -------------------------------------------------------------
# FIGURE 3.1: Multi-Spectral Vision Pipeline
# -------------------------------------------------------------
def generate_fig3_1():
    fig, ax = plt.subplots(figsize=(10, 4.8), dpi=300)
    ax.axis('off')
    
    steps = [
        ("Raw Image\nCapture", "224x224 RGB\nOptical Feed", "#e0f2fe", "#0284c7"),
        ("Backdrop &\nTableware Masking", "Exclude Dark\n& White Ceramics", "#fef3c7", "#d97706"),
        ("Multi-Spectral\nDecay Channels", "Green Mold, Fuzz\n& Sunken Necrosis", "#fee2e2", "#dc2626"),
        ("Texture Gradient\nRoughness Gate", "Spatial Filter\n∇I >= 12.0", "#f3e8ff", "#9333ea"),
        ("Composite Score\n& Freshness Index", "0 - 100% Index\n& Shelf Life Days", "#ecfdf5", "#059669")
    ]
    
    for i, (title, desc, bg, edge) in enumerate(steps):
        x = 0.04 + i * 0.195
        box = patches.FancyBboxPatch((x, 0.25), 0.15, 0.55, boxstyle="round,pad=0.015", facecolor=bg, edgecolor=edge, linewidth=1.8)
        ax.add_patch(box)
        ax.text(x + 0.075, 0.62, f"STEP {i+1}", fontsize=8.5, ha='center', fontweight='bold', color=edge)
        ax.text(x + 0.075, 0.48, title, fontsize=9.5, ha='center', fontweight='bold', color="#0f172a")
        ax.text(x + 0.075, 0.35, desc, fontsize=8, ha='center', color="#475569")
        
        if i < len(steps) - 1:
            ax.annotate("", xy=(x + 0.19, 0.52), xytext=(x + 0.155, 0.52),
                        arrowprops=dict(arrowstyle="->,head_width=0.4,head_length=0.5", lw=2, color="#334155"))
            
    plt.tight_layout()
    plt.savefig("figures/fig3_1_vision_flow.png", bbox_inches='tight', dpi=300)
    plt.close()
    print("✅ Generated figures/fig3_1_vision_flow.png")

# -------------------------------------------------------------
# FIGURE 3.2: XGBoost Feature Processing Pipeline
# -------------------------------------------------------------
def generate_fig3_2():
    fig, ax = plt.subplots(figsize=(10, 4.8), dpi=300)
    ax.axis('off')
    
    stages = [
        ("Sensor Telemetry", "Temp (°C), Humidity (%)\nEthylene (ppm), Days", "#f8fafc", "#475569"),
        ("Category Encoding", "One-Hot Encoding\n(7 Categories, 3 Storage)", "#e0f2fe", "#0284c7"),
        ("Gradient Boosted\nTrees Ensemble", "100 Estimators\nMax Depth = 4", "#f5f3ff", "#7c3aed"),
        ("Calibrated Output", "Spoilage Probability %\nRemaining Days & Risk", "#ecfdf5", "#059669")
    ]
    
    for i, (title, desc, bg, edge) in enumerate(stages):
        x = 0.05 + i * 0.24
        box = patches.FancyBboxPatch((x, 0.25), 0.19, 0.55, boxstyle="round,pad=0.015", facecolor=bg, edgecolor=edge, linewidth=1.8)
        ax.add_patch(box)
        ax.text(x + 0.095, 0.62, f"STAGE {i+1}", fontsize=9, ha='center', fontweight='bold', color=edge)
        ax.text(x + 0.095, 0.48, title, fontsize=10, ha='center', fontweight='bold', color="#0f172a")
        ax.text(x + 0.095, 0.35, desc, fontsize=8.5, ha='center', color="#475569")
        
        if i < len(stages) - 1:
            ax.annotate("", xy=(x + 0.235, 0.52), xytext=(x + 0.195, 0.52),
                        arrowprops=dict(arrowstyle="->,head_width=0.4,head_length=0.5", lw=2, color="#334155"))
            
    plt.tight_layout()
    plt.savefig("figures/fig3_2_xgboost_pipeline.png", bbox_inches='tight', dpi=300)
    plt.close()
    print("✅ Generated figures/fig3_2_xgboost_pipeline.png")

# -------------------------------------------------------------
# FIGURE 4.1: Feature Importance Chart (From trained model)
# -------------------------------------------------------------
def generate_fig4_1():
    with open("models/spoilage_metadata.json", "r") as f:
        meta = json.load(f)
    
    imp = meta["feature_importance"]
    # Sort features
    sorted_features = sorted(imp.items(), key=lambda x: x[1], reverse=True)[:10]
    names = [f[0].replace("_", " ").title() for f in sorted_features]
    values = [f[1] * 100 for f in sorted_features]
    
    fig, ax = plt.subplots(figsize=(9, 5), dpi=300)
    y_pos = np.arange(len(names))
    
    bars = ax.barh(y_pos, values, align='center', color='#0284c7', edgecolor='#0369a1', height=0.65)
    
    ax.set_yticks(y_pos)
    ax.set_yticklabels(names, fontsize=9.5, fontweight='bold', color='#1e293b')
    ax.invert_yaxis()  # top-down
    ax.set_xlabel("Relative Feature Importance Weight (%)", fontsize=10.5, fontweight='bold', color='#0f172a', labelpad=8)
    ax.set_title("XGBoost Spoilage Classifier: Top Feature Importances", fontsize=12, fontweight='bold', color='#0f172a', pad=12)
    
    # Add data labels
    for bar in bars:
        width = bar.get_width()
        ax.text(width + 0.4, bar.get_y() + bar.get_height()/2, f"{width:.1f}%",
                va='center', ha='left', fontsize=9, fontweight='bold', color='#0f172a')
        
    ax.set_xlim(0, max(values) + 4)
    ax.grid(axis='x', linestyle='--', alpha=0.5)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    plt.tight_layout()
    plt.savefig("figures/fig4_1_feature_importance.png", bbox_inches='tight', dpi=300)
    plt.close()
    print("✅ Generated figures/fig4_1_feature_importance.png")

if __name__ == "__main__":
    generate_fig1_1()
    generate_fig3_1()
    generate_fig3_2()
    generate_fig4_1()
