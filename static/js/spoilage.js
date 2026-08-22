/**
 * SaveFood - Spoilage Classifier & IoT Sensor Simulator (XGBoost)
 * Research Objective 02: Spoilage Prediction on sensor data (F1-score ~ 0.89)
 * Author: Md. Mehedi Hasan (Roll: 04, Batch: D-90)
 */

const SpoilageModule = {
  debounceTimer: null,

  init() {
    this.bindInputs();
    this.runPrediction(); // Initial run
  },

  bindInputs() {
    const inputs = [
      'spoil-food-category',
      'spoil-storage-type',
      'spoil-temp',
      'spoil-humidity',
      'spoil-days',
      'spoil-ethylene'
    ];

    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          this.updateValueDisplay(id, e.target.value);
          this.debouncedPrediction();
        });
      }
    });

    // Preset quick scenarios
    document.querySelectorAll('[data-spoil-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = btn.getAttribute('data-spoil-preset');
        this.applyPreset(preset);
      });
    });
  },

  updateValueDisplay(id, val) {
    const map = {
      'spoil-temp': { el: 'val-spoil-temp', suffix: ' °C' },
      'spoil-humidity': { el: 'val-spoil-humidity', suffix: ' %' },
      'spoil-days': { el: 'val-spoil-days', suffix: ' Days' },
      'spoil-ethylene': { el: 'val-spoil-ethylene', suffix: ' ppm' }
    };

    if (map[id]) {
      const target = document.getElementById(map[id].el);
      if (target) target.textContent = val + map[id].suffix;
    }
  },

  applyPreset(preset) {
    if (preset === 'fridge-fresh') {
      document.getElementById('spoil-food-category').value = 'Vegetables';
      document.getElementById('spoil-storage-type').value = 'Fridge';
      document.getElementById('spoil-temp').value = 3.5;
      document.getElementById('spoil-humidity').value = 80;
      document.getElementById('spoil-days').value = 1.0;
      document.getElementById('spoil-ethylene').value = 0.05;
    } else if (preset === 'pantry-danger') {
      document.getElementById('spoil-food-category').value = 'Dairy';
      document.getElementById('spoil-storage-type').value = 'Pantry';
      document.getElementById('spoil-temp').value = 28.0;
      document.getElementById('spoil-humidity').value = 75;
      document.getElementById('spoil-days').value = 2.0;
      document.getElementById('spoil-ethylene').value = 0.35;
    } else if (preset === 'freezer-safe') {
      document.getElementById('spoil-food-category').value = 'Meat & Poultry';
      document.getElementById('spoil-storage-type').value = 'Freezer';
      document.getElementById('spoil-temp').value = -18.0;
      document.getElementById('spoil-humidity').value = 45;
      document.getElementById('spoil-days').value = 25.0;
      document.getElementById('spoil-ethylene').value = 0.02;
    } else if (preset === 'fruit-senescence') {
      document.getElementById('spoil-food-category').value = 'Fruits';
      document.getElementById('spoil-storage-type').value = 'Pantry';
      document.getElementById('spoil-temp').value = 24.0;
      document.getElementById('spoil-humidity').value = 88;
      document.getElementById('spoil-days').value = 5.5;
      document.getElementById('spoil-ethylene').value = 1.85;
    }

    // Refresh displays
    ['spoil-temp', 'spoil-humidity', 'spoil-days', 'spoil-ethylene'].forEach(id => {
      const el = document.getElementById(id);
      if (el) this.updateValueDisplay(id, el.value);
    });

    this.runPrediction();
  },

  debouncedPrediction() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.runPrediction(), 150);
  },

  async runPrediction() {
    const category = document.getElementById('spoil-food-category')?.value || 'Vegetables';
    const storage = document.getElementById('spoil-storage-type')?.value || 'Fridge';
    const temp = parseFloat(document.getElementById('spoil-temp')?.value || 4.0);
    const humidity = parseFloat(document.getElementById('spoil-humidity')?.value || 80.0);
    const days = parseFloat(document.getElementById('spoil-days')?.value || 2.0);
    const ethylene = parseFloat(document.getElementById('spoil-ethylene')?.value || 0.1);

    const payload = {
      food_category: category,
      storage_type: storage,
      temperature: temp,
      humidity: humidity,
      days_stored: days,
      ethylene_ppm: ethylene
    };

    try {
      const res = await fetch('/api/predict/spoilage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        this.renderSpoilageResults(data);
      }
    } catch (e) {
      console.error('Spoilage prediction failed:', e);
    }
  },

  renderSpoilageResults(data) {
    const prob = data.spoilage_probability;
    const probEl = document.getElementById('gauge-spoil-pct');
    const circleEl = document.getElementById('gauge-circle');
    const riskLevelEl = document.getElementById('spoil-risk-level');
    const remainingDaysEl = document.getElementById('spoil-remaining-days');
    const adviceEl = document.getElementById('spoil-advice');
    const factorsListEl = document.getElementById('spoil-factors-list');

    if (probEl) probEl.textContent = `${prob}%`;

    // Visual gauge styling
    if (circleEl) {
      let color = '#10b981';
      if (prob >= 75) color = '#f43f5e';
      else if (prob >= 40) color = '#f59e0b';
      else if (prob >= 20) color = '#84cc16';

      circleEl.style.borderColor = color;
      circleEl.style.boxShadow = `0 0 25px ${color}55`;
      if (probEl) probEl.style.color = color;
    }

    if (riskLevelEl) {
      riskLevelEl.textContent = data.risk_level;
      riskLevelEl.className = `badge ${data.risk_badge === 'critical' || data.risk_badge === 'danger' ? 'danger' : (data.risk_badge === 'warning' ? 'warning' : 'good')}`;
    }

    if (remainingDaysEl) {
      remainingDaysEl.textContent = `${data.estimated_remaining_days} Days`;
    }

    if (adviceEl) {
      adviceEl.textContent = data.action_advice;
    }

    if (factorsListEl && data.risk_factors) {
      factorsListEl.innerHTML = data.risk_factors.map(f => `
        <li style="padding: 0.4rem 0; font-size: 0.85rem; color: #cbd5e1; border-bottom: 1px solid rgba(255,255,255,0.04); display: flex; align-items: center; gap: 0.5rem;">
          <span>${f}</span>
        </li>
      `).join('');
    }
  }
};

window.SpoilageModule = SpoilageModule;
