/**
 * SaveFood - Open Food Facts API & Barcode Integration
 * Research Objective 03: Real-time expiry, packaging & Eco-Score metadata
 * Author: Md. Mehedi Hasan (Roll: 04, Batch: D-90)
 */

const OpenFoodFactsModule = {
  currentProduct: null,

  init() {
    this.bindEvents();
  },

  bindEvents() {
    const searchBtn = document.getElementById('btn-off-search');
    const searchInput = document.getElementById('off-search-input');
    const barcodeBtn = document.getElementById('btn-off-barcode-lookup');
    const barcodeInput = document.getElementById('off-barcode-input');
    const addInvBtn = document.getElementById('btn-off-add-inventory');

    if (searchBtn && searchInput) {
      searchBtn.addEventListener('click', () => this.searchFood(searchInput.value));
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.searchFood(searchInput.value);
      });
    }

    if (barcodeBtn && barcodeInput) {
      barcodeBtn.addEventListener('click', () => this.lookupBarcode(barcodeInput.value));
      barcodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.lookupBarcode(barcodeInput.value);
      });
    }

    if (addInvBtn) {
      addInvBtn.addEventListener('click', () => this.addCurrentToInventory());
    }

    // Quick barcode chips
    document.querySelectorAll('[data-sample-barcode]').forEach(chip => {
      chip.addEventListener('click', () => {
        const code = chip.getAttribute('data-sample-barcode');
        if (barcodeInput) barcodeInput.value = code;
        this.lookupBarcode(code);
      });
    });
  },

  async lookupBarcode(barcode) {
    if (!barcode || !barcode.trim()) {
      App.showToast('Please enter a barcode.', 'warning');
      return;
    }

    const loader = document.getElementById('off-loading');
    const detailsBox = document.getElementById('off-product-details');

    if (loader) loader.style.display = 'block';
    if (detailsBox) detailsBox.style.display = 'none';

    try {
      const res = await fetch(`/api/food/barcode/${encodeURIComponent(barcode.trim())}`);
      const data = await res.json();
      if (loader) loader.style.display = 'none';

      if (data.success && data.product) {
        this.currentProduct = data.product;
        this.renderProductDetails(data.product, data.source);
      } else {
        App.showToast(data.message || 'Product barcode not found on Open Food Facts.', 'warning');
      }
    } catch (e) {
      if (loader) loader.style.display = 'none';
      App.showToast('Failed to fetch Open Food Facts barcode data.', 'danger');
    }
  },

  async searchFood(query) {
    if (!query || !query.trim()) {
      App.showToast('Please enter a search keyword.', 'warning');
      return;
    }

    const loader = document.getElementById('off-loading');
    const resultsList = document.getElementById('off-search-results-list');

    if (loader) loader.style.display = 'block';
    if (resultsList) resultsList.innerHTML = '';

    try {
      const res = await fetch(`/api/food/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (loader) loader.style.display = 'none';

      if (data.success && data.results && data.results.length > 0) {
        this.renderSearchResults(data.results);
      } else {
        if (resultsList) resultsList.innerHTML = '<div style="color: #94a3b8; text-align: center; padding: 1.5rem;">No products found matching your search.</div>';
      }
    } catch (e) {
      if (loader) loader.style.display = 'none';
      App.showToast('Error searching Open Food Facts.', 'danger');
    }
  },

  renderSearchResults(results) {
    const list = document.getElementById('off-search-results-list');
    if (!list) return;

    list.innerHTML = results.map(item => `
      <div class="glass-panel" style="padding: 1rem; margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer;" onclick="OpenFoodFactsModule.selectSearchedItem('${item.code}')">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${item.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=60'}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;" alt="${item.product_name}">
          <div>
            <div style="font-weight: 600; color: #fff;">${item.product_name}</div>
            <div style="font-size: 0.78rem; color: #94a3b8;">${item.brands || 'Generic'} • ${item.categories || 'Food'}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="badge ${item.nutriscore_grade === 'A' || item.nutriscore_grade === 'B' ? 'good' : 'warning'}">Nutri: ${item.nutriscore_grade}</span>
          <span class="badge ${item.ecoscore_grade === 'A' || item.ecoscore_grade === 'B' ? 'good' : 'warning'}">Eco: ${item.ecoscore_grade}</span>
          <button class="action-btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">Select</button>
        </div>
      </div>
    `).join('');
  },

  selectSearchedItem(code) {
    this.lookupBarcode(code);
  },

  renderProductDetails(prod, source) {
    const box = document.getElementById('off-product-details');
    if (!box) return;

    document.getElementById('off-prod-name').textContent = prod.product_name;
    document.getElementById('off-prod-brand').textContent = `${prod.brands} • ${prod.categories}`;
    document.getElementById('off-prod-code').textContent = `Barcode: ${prod.code} (${source === 'open_food_facts_api' ? 'Live API' : 'Cached DB'})`;
    
    if (prod.image_url) {
      const img = document.getElementById('off-prod-img');
      if (img) img.src = prod.image_url;
    }

    document.getElementById('off-prod-nutriscore').textContent = prod.nutriscore_grade;
    document.getElementById('off-prod-ecoscore').textContent = prod.ecoscore_grade;
    document.getElementById('off-prod-packaging').textContent = prod.packaging;
    document.getElementById('off-prod-storage').textContent = prod.storage_conditions;
    document.getElementById('off-prod-shelflife').textContent = `${prod.shelf_life_opened_days || 7} Days once opened`;
    document.getElementById('off-prod-ingredients').textContent = prod.ingredients_text;
    document.getElementById('off-prod-calories').textContent = `${prod.calories_100g} kcal / 100g`;

    box.style.display = 'block';
  },

  async addCurrentToInventory() {
    if (!this.currentProduct) return;

    const payload = {
      name: this.currentProduct.product_name,
      category: this.currentProduct.categories.split('&')[0].trim() || 'Pantry & Grains',
      storage: this.currentProduct.storage_conditions.toLowerCase().includes('refrigerat') ? 'Fridge' : 'Pantry',
      quantity: '1 pack',
      cost_usd: 3.50,
      image: this.currentProduct.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=60',
      days_stored: 0.2
    };

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        App.showToast(`Imported ${payload.name} from Open Food Facts to inventory!`, 'success');
        if (window.InventoryModule) window.InventoryModule.loadInventory();
        App.switchTab('inventory');
      }
    } catch (e) {
      App.showToast('Error importing product.', 'danger');
    }
  }
};

window.OpenFoodFactsModule = OpenFoodFactsModule;
