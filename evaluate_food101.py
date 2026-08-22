"""
SaveFood - Food-101 Model Evaluation & Benchmark
Evaluates fine-tuned or baseline MobileNetV2 on the Food-101 validation split
Author: Md. Mehedi Hasan (Roll: 04, DIU)
"""

import os
import sys
import json
import argparse
import time
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
from torchvision.models import mobilenet_v2, MobileNet_V2_Weights

def main():
    parser = argparse.ArgumentParser(description="Evaluate MobileNetV2 on Food-101 Validation Dataset")
    parser.add_argument("--val_dir", type=str, default="data/food-101/validation", help="Path to validation directory")
    parser.add_argument("--model_path", type=str, default="models/food101_mobilenetv2.pth", help="Trained checkpoint path")
    parser.add_argument("--batch_size", type=int, default=64, help="Batch size for evaluation")
    args = parser.parse_args()

    if not os.path.exists(args.val_dir):
        print(f"❌ Error: Validation directory not found at {args.val_dir}")
        sys.exit(1)

    device = torch.device("mps" if torch.backends.mps.is_available() else ("cuda" if torch.cuda.is_available() else "cpu"))
    print(f"🚀 Using device: {device}")

    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    val_dataset = ImageFolder(args.val_dir, transform=val_transform)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=0)
    num_classes = len(val_dataset.classes)

    print(f"📂 Validation Dataset: {len(val_dataset):,} samples across {num_classes} classes.")

    model = mobilenet_v2(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.2),
        nn.Linear(in_features, num_classes)
    )

    if os.path.exists(args.model_path):
        print(f"📥 Loading custom fine-tuned weights from: {args.model_path}")
        checkpoint = torch.load(args.model_path, map_location=device)
        if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
            model.load_state_dict(checkpoint["model_state_dict"])
            print(f"   Checkpoint metadata: Val Top-1 = {checkpoint.get('val_top1_acc', 'N/A')}% (Epoch {checkpoint.get('epochs_trained', 'N/A')})")
        else:
            model.load_state_dict(checkpoint)
    else:
        print(f"⚠️ Checkpoint '{args.model_path}' not found. Using randomly initialized head for test.")

    model = model.to(device)
    model.eval()

    correct_top1 = 0
    correct_top5 = 0
    total = 0
    start_time = time.time()

    print("\n🔍 Running Evaluation...")
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            total += labels.size(0)

            _, pred_top1 = outputs.topk(1, 1, True, True)
            correct_top1 += pred_top1.eq(labels.view(-1, 1)).sum().item()

            _, pred_top5 = outputs.topk(min(5, outputs.size(1)), 1, True, True)
            correct_top5 += pred_top5.eq(labels.view(-1, 1).expand_as(pred_top5)).sum().item()

    elapsed = time.time() - start_time
    top1_acc = (correct_top1 / total) * 100.0
    top5_acc = (correct_top5 / total) * 100.0

    print("\n" + "="*50)
    print("📊 FOOD-101 EVALUATION RESULTS")
    print("="*50)
    print(f"  Total Images Evaluated : {total:,}")
    print(f"  Top-1 Accuracy         : {top1_acc:.2f}%")
    print(f"  Top-5 Accuracy         : {top5_acc:.2f}%")
    print(f"  Evaluation Time        : {elapsed:.2f}s ({total/elapsed:.1f} imgs/sec)")
    print("="*50)

if __name__ == "__main__":
    main()
