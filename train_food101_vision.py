"""
SaveFood - Food-101 Vision Model Training Pipeline
Fine-tunes MobileNetV2 on the Food-101 Dataset (101 food categories)
Author: Md. Mehedi Hasan (Roll: 04, DIU)
"""

import os
import sys
import time
import json
import argparse
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Subset
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
from torchvision.models import mobilenet_v2, MobileNet_V2_Weights

def get_device():
    if torch.cuda.is_available():
        device = torch.device("cuda")
        print("🚀 Using NVIDIA CUDA GPU acceleration.")
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
        print("🚀 Using Apple Silicon Metal Performance Shaders (MPS) GPU acceleration.")
    else:
        device = torch.device("cpu")
        print("ℹ️ Using CPU.")
    return device

def get_transforms(img_size=224):
    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(img_size, scale=(0.8, 1.0)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    
    return train_transform, val_transform

def create_model(num_classes=101, pretrained=True, freeze_backbone=False):
    weights = MobileNet_V2_Weights.DEFAULT if pretrained else None
    model = mobilenet_v2(weights=weights)
    
    if freeze_backbone:
        for param in model.features.parameters():
            param.requires_grad = False
            
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.2),
        nn.Linear(in_features, num_classes)
    )
    return model

def train_epoch(model, dataloader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    correct_top1 = 0
    correct_top5 = 0
    total = 0
    num_batches = len(dataloader)
    
    for batch_idx, (images, labels) in enumerate(dataloader, 1):
        images, labels = images.to(device), labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item() * images.size(0)
        
        total += labels.size(0)
        _, pred_top1 = outputs.topk(1, 1, True, True)
        correct_top1 += pred_top1.eq(labels.view(-1, 1)).sum().item()
        
        _, pred_top5 = outputs.topk(min(5, outputs.size(1)), 1, True, True)
        correct_top5 += pred_top5.eq(labels.view(-1, 1).expand_as(pred_top5)).sum().item()
        
        if batch_idx % max(1, num_batches // 5) == 0 or batch_idx == num_batches:
            cur_loss = running_loss / total
            cur_acc = (correct_top1 / total) * 100.0
            print(f"   [Train] Batch [{batch_idx:03d}/{num_batches:03d}] Loss: {cur_loss:.4f} Acc: {cur_acc:.1f}%", flush=True)
        
    epoch_loss = running_loss / total
    top1_acc = (correct_top1 / total) * 100.0
    top5_acc = (correct_top5 / total) * 100.0
    return epoch_loss, top1_acc, top5_acc

def evaluate(model, dataloader, criterion, device):
    model.eval()
    running_loss = 0.0
    correct_top1 = 0
    correct_top5 = 0
    total = 0
    
    with torch.no_grad():
        for images, labels in dataloader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            running_loss += loss.item() * images.size(0)
            total += labels.size(0)
            
            _, pred_top1 = outputs.topk(1, 1, True, True)
            correct_top1 += pred_top1.eq(labels.view(-1, 1)).sum().item()
            
            _, pred_top5 = outputs.topk(min(5, outputs.size(1)), 1, True, True)
            correct_top5 += pred_top5.eq(labels.view(-1, 1).expand_as(pred_top5)).sum().item()
            
    epoch_loss = running_loss / total
    top1_acc = (correct_top1 / total) * 100.0
    top5_acc = (correct_top5 / total) * 100.0
    return epoch_loss, top1_acc, top5_acc

def main():
    parser = argparse.ArgumentParser(description="Train MobileNetV2 on Food-101 Dataset")
    parser.add_argument("--data_dir", type=str, default="data/food-101", help="Path to Food-101 dataset directory")
    parser.add_argument("--epochs", type=int, default=5, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=64, help="Batch size")
    parser.add_argument("--lr", type=float, default=1e-3, help="Learning rate")
    parser.add_argument("--output_model", type=str, default="models/food101_mobilenetv2.pth", help="Output model weights path")
    parser.add_argument("--subset_per_class", type=int, default=0, help="If > 0, train on a subset of N images per class for rapid prototyping")
    parser.add_argument("--freeze_backbone", action="store_true", help="Freeze MobileNetV2 feature extractor and only train classifier head")
    args = parser.parse_args()

    train_dir = os.path.join(args.data_dir, "train")
    val_dir = os.path.join(args.data_dir, "validation")
    
    if not os.path.exists(train_dir) or not os.path.exists(val_dir):
        print(f"❌ Error: Dataset directories not found at '{train_dir}' or '{val_dir}'", flush=True)
        sys.exit(1)
        
    device = get_device()
    train_transform, val_transform = get_transforms()
    
    print(f"📂 Loading Food-101 Dataset from: {args.data_dir}", flush=True)
    train_dataset = ImageFolder(train_dir, transform=train_transform)
    val_dataset = ImageFolder(val_dir, transform=val_transform)
    
    class_names = train_dataset.classes
    num_classes = len(class_names)
    print(f"✅ Found {num_classes} food classes.", flush=True)
    print(f"   Train samples: {len(train_dataset):,}", flush=True)
    print(f"   Validation samples: {len(val_dataset):,}", flush=True)
    
    # Save class names mapping
    os.makedirs("models", exist_ok=True)
    classes_json_path = "models/food101_classes.json"
    with open(classes_json_path, "w") as f:
        json.dump(class_names, f, indent=2)
    print(f"💾 Class index saved to '{classes_json_path}'", flush=True)

    # Optional subset for fast training
    if args.subset_per_class > 0:
        print(f"⚡ Creating subset with {args.subset_per_class} images per class...", flush=True)
        train_indices = []
        counts = {i: 0 for i in range(num_classes)}
        for idx, (_, label) in enumerate(train_dataset.samples):
            if counts[label] < args.subset_per_class:
                train_indices.append(idx)
                counts[label] += 1
        train_dataset = Subset(train_dataset, train_indices)
        print(f"   Subsampled train set: {len(train_dataset):,} images", flush=True)

        val_indices = []
        val_counts = {i: 0 for i in range(num_classes)}
        val_sub_limit = max(2, args.subset_per_class // 2)
        for idx, (_, label) in enumerate(val_dataset.samples):
            if val_counts[label] < val_sub_limit:
                val_indices.append(idx)
                val_counts[label] += 1
        val_dataset = Subset(val_dataset, val_indices)
        print(f"   Subsampled val set: {len(val_dataset):,} images", flush=True)

    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=0)

    print(f"\n🧠 Initializing MobileNetV2 with {num_classes}-class classifier head...")
    model = create_model(num_classes=num_classes, pretrained=True, freeze_backbone=args.freeze_backbone)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs)

    best_val_acc = 0.0
    start_time = time.time()
    
    print("\n" + "="*70)
    print(f"🚀 STARTING FOOD-101 FINE-TUNING ({args.epochs} EPOCHS)")
    print("="*70)
    
    for epoch in range(1, args.epochs + 1):
        epoch_start = time.time()
        train_loss, train_top1, train_top5 = train_epoch(model, train_loader, criterion, optimizer, device)
        val_loss, val_top1, val_top5 = evaluate(model, val_loader, criterion, device)
        scheduler.step()
        
        epoch_time = time.time() - epoch_start
        print(f"Epoch [{epoch:02d}/{args.epochs:02d}] ({epoch_time:.1f}s) | "
              f"Train Loss: {train_loss:.4f} Acc: {train_top1:.2f}% (Top-5: {train_top5:.2f}%) | "
              f"Val Loss: {val_loss:.4f} Acc: {val_top1:.2f}% (Top-5: {val_top5:.2f}%)")
              
        if val_top1 > best_val_acc:
            best_val_acc = val_top1
            torch.save({
                "model_state_dict": model.state_dict(),
                "classes": class_names,
                "val_top1_acc": val_top1,
                "val_top5_acc": val_top5,
                "epochs_trained": epoch,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
            }, args.output_model)
            print(f"   ⭐ Best validation model checkpoint saved! (Val Top-1: {val_top1:.2f}%)")

    total_time = (time.time() - start_time) / 60.0
    print("\n" + "="*70)
    print(f"🎉 Training Completed in {total_time:.1f} minutes! Best Val Top-1: {best_val_acc:.2f}%")
    print(f"💾 Checkpoint saved at: {args.output_model}")
    print("="*70)

if __name__ == "__main__":
    main()
