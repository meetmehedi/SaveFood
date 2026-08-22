/**
 * SaveFood - Vision Scanner & Freshness Detection (MobileNetV2)
 * Dhaka International University (DIU) - Markup & Scripting Languages Lab
 */

const ScannerModule = {
  videoStream: null,
  lastPrediction: null,

  init() {
    this.bindEvents();
  },

  bindEvents() {
    const fileInput = document.getElementById('scanner-file-input');
    const dropzone = document.getElementById('scanner-dropzone');
    const startCamBtn = document.getElementById('btn-start-camera');
    const captureCamBtn = document.getElementById('btn-capture-camera');
    const addInvBtn = document.getElementById('btn-scan-add-inventory');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.processImageFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.processImageFile(e.target.files[0]);
        }
      });
    }

    if (startCamBtn) {
      startCamBtn.addEventListener('click', () => this.toggleCamera());
    }

    if (captureCamBtn) {
      captureCamBtn.addEventListener('click', () => this.captureCameraFrame());
    }

    if (addInvBtn) {
      addInvBtn.addEventListener('click', () => this.addScanToInventory());
    }
  },

  async toggleCamera() {
    const video = document.getElementById('scanner-video');
    const startBtn = document.getElementById('btn-start-camera');
    const captureBtn = document.getElementById('btn-capture-camera');
    const previewImg = document.getElementById('scanner-preview-img');

    if (this.videoStream) {
      // Stop camera
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
      video.style.display = 'none';
      startBtn.innerHTML = '<i class="fas fa-video"></i> Start Webcam';
      if (captureBtn) captureBtn.style.display = 'none';
      return;
    }

    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      video.srcObject = this.videoStream;
      video.style.display = 'block';
      if (previewImg) previewImg.style.display = 'none';
      video.play();
      startBtn.innerHTML = '<i class="fas fa-video-slash"></i> Stop Webcam';
      if (captureBtn) captureBtn.style.display = 'inline-flex';
    } catch (err) {
      console.warn('Camera access issue:', err);
      App.showToast('Webcam not available or permission denied. Please upload an image.', 'warning');
    }
  },

  captureCameraFrame() {
    const video = document.getElementById('scanner-video');
    if (!this.videoStream || !video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        this.processImageBlob(blob, canvas.toDataURL('image/jpeg'));
      }
    }, 'image/jpeg', 0.9);
  },

  processImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.processImageBlob(file, e.target.result);
    };
    reader.readAsDataURL(file);
  },

  async processImageBlob(blobOrFile, dataUrl) {
    const previewImg = document.getElementById('scanner-preview-img');
    const video = document.getElementById('scanner-video');
    const laser = document.getElementById('scan-laser');
    const placeholder = document.getElementById('scanner-placeholder');
    const resultBox = document.getElementById('scanner-results-container');
    const emptyState = document.getElementById('scanner-empty-state');
    const loadingState = document.getElementById('scanner-loading');

    if (video) video.style.display = 'none';
    if (placeholder) placeholder.style.display = 'none';
    if (previewImg) {
      previewImg.src = dataUrl;
      previewImg.style.display = 'block';
    }
    if (laser) laser.style.display = 'block';
    if (loadingState) loadingState.style.display = 'block';
    if (resultBox) resultBox.style.display = 'none';
    if (emptyState) emptyState.style.display = 'none';

    // Send to backend API
    const formData = new FormData();
    formData.append('image', blobOrFile, 'scan.jpg');

    try {
      const res = await fetch('/api/predict/image', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (laser) laser.style.display = 'none';
      if (loadingState) loadingState.style.display = 'none';

      if (data.success) {
        this.lastPrediction = { ...data, image_url: dataUrl };
        this.renderPredictionResults(data);
      } else {
        if (emptyState) emptyState.style.display = 'block';
        App.showToast(`Identification error: ${data.error || 'Failed to classify food.'}`, 'danger');
      }
    } catch (e) {
      if (laser) laser.style.display = 'none';
      if (loadingState) loadingState.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      console.error('Vision prediction error:', e);
      App.showToast('Network error during AI vision prediction.', 'danger');
    }
  },

  renderPredictionResults(data) {
    const resultBox = document.getElementById('scanner-results-container');
    const emptyState = document.getElementById('scanner-empty-state');
    if (!resultBox) return;

    if (emptyState) emptyState.style.display = 'none';

    document.getElementById('scan-food-name').textContent = data.food_name;
    document.getElementById('scan-category').textContent = data.food_category;
    document.getElementById('scan-confidence').textContent = `${data.confidence}% Confidence (MobileNetV2)`;
    
    // Freshness
    const freshnessFill = document.getElementById('scan-freshness-fill');
    const freshnessPct = document.getElementById('scan-freshness-val');
    const freshnessStatus = document.getElementById('scan-freshness-status');

    if (freshnessFill) {
      freshnessFill.style.width = `${data.freshness_index}%`;
      freshnessFill.style.background = data.status_color === 'danger'
        ? 'linear-gradient(90deg, #f43f5e, #9f1239)'
        : data.status_color === 'amber'
          ? 'linear-gradient(90deg, #f59e0b, #b45309)'
          : 'linear-gradient(90deg, #34d399, #059669)';
    }
    if (freshnessPct) {
      freshnessPct.textContent = `${data.freshness_index}%`;
      freshnessPct.style.color = data.status_color === 'danger' ? '#f43f5e' : (data.status_color === 'amber' ? '#f59e0b' : '#34d399');
    }
    if (freshnessStatus) {
      freshnessStatus.textContent = data.freshness_status;
      freshnessStatus.className = `badge ${data.status_color || 'good'}`; 
    }

    document.getElementById('scan-recommendation').textContent = data.recommendation;
    document.getElementById('scan-shelf-fridge').textContent = `${data.recommended_shelf_life.fridge_days} Days`;
    document.getElementById('scan-shelf-pantry').textContent = `${data.recommended_shelf_life.pantry_days} Days`;
    document.getElementById('scan-shelf-freezer').textContent = `${data.recommended_shelf_life.freezer_days} Days`;

    // Show spoilage score & decay breakdown if available
    let spoilageEl = document.getElementById('scan-spoilage-score');
    if (!spoilageEl) {
      const recEl = document.getElementById('scan-recommendation');
      if (recEl && recEl.parentNode) {
        spoilageEl = document.createElement('div');
        spoilageEl.id = 'scan-spoilage-score';
        spoilageEl.style.cssText = 'margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:0.82rem;';
        recEl.parentNode.appendChild(spoilageEl);
      }
    }
    if (spoilageEl && data.spoilage_score !== undefined) {
      const isDangerous = data.spoilage_score >= 18;
      let decayInfo = '';
      if (data.decay_metrics && (data.decay_metrics.mold_green_pct > 0 || data.decay_metrics.mold_white_pct > 0 || data.decay_metrics.dark_rot_pct > 0)) {
        decayInfo = `<div style="margin-top:4px;font-size:0.75rem;opacity:0.85;color:${isDangerous ? '#fca5a5' : '#94a3b8'};">
          ${data.decay_metrics.mold_green_pct > 0 ? `• Green Mold: <strong>${data.decay_metrics.mold_green_pct}%</strong> ` : ''}
          ${data.decay_metrics.mold_white_pct > 0 ? `• Mycelium Fuzz: <strong>${data.decay_metrics.mold_white_pct}%</strong> ` : ''}
          ${data.decay_metrics.dark_rot_pct > 0 ? `• Necrotic Rot: <strong>${data.decay_metrics.dark_rot_pct}%</strong>` : ''}
        </div>`;
      }
      spoilageEl.innerHTML = `
        <div style="font-weight:600;color:${isDangerous ? '#f43f5e' : '#34d399'};">
          🔬 Composite Spoilage Score: ${data.spoilage_score}/100 ${isDangerous ? '⚠️ (Hazard Detected)' : '✅ (Normal)'}
        </div>
        ${decayInfo}
      `;
    }

    // Dynamic button for spoiled items vs fresh items
    const addInvBtn = document.getElementById('btn-scan-add-inventory');
    if (addInvBtn) {
      if (data.status_color === 'danger') {
        addInvBtn.className = 'action-btn btn-danger';
        addInvBtn.innerHTML = '<i class="fas fa-trash-can"></i> Discard & Log Waste to Analytics';
      } else {
        addInvBtn.className = 'action-btn btn-primary';
        addInvBtn.innerHTML = '<i class="fas fa-plus"></i> Add Scanned Item to Smart Inventory';
      }
    }

    resultBox.style.display = 'block';
  },

  async addScanToInventory() {
    if (!this.lastPrediction) {
      App.showToast('No scanned food item to add.', 'warning');
      return;
    }

    const payload = {
      name: this.lastPrediction.food_name,
      category: this.lastPrediction.food_category,
      storage: 'Fridge',
      quantity: '1 portion',
      days_stored: 0.5,
      temperature: 4.0,
      humidity: 80.0,
      ethylene_ppm: 0.1,
      cost_usd: this.lastPrediction.estimated_cost_usd || 4.50,
      carbon_footprint_kg: 1.2,
      image: this.lastPrediction.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=60'
    };

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        App.showToast(`Added ${payload.name} to smart inventory!`, 'success');
        if (window.InventoryModule) window.InventoryModule.loadInventory();
        App.switchTab('inventory');
      }
    } catch (e) {
      App.showToast('Failed to save to inventory.', 'danger');
    }
  }
};

window.ScannerModule = ScannerModule;
