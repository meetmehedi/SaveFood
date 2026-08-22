/**
 * SaveFood - Smart Food Inventory Manager
 * Author: Md. Mehedi Hasan (Roll: 04, Batch: D-90)
 */

const InventoryModule = {
  items: [],
  currentFilter: 'all',

  init() {
    this.bindEvents();
    this.loadInventory();
  },

  bindEvents() {
    // Filter pills
    document.querySelectorAll('.inv-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.inv-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.getAttribute('data-filter');
        this.renderTable();
      });
    });

    // Search bar
    const searchInput = document.getElementById('inv-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => this.renderTable());
    }

    // Modal triggers
    const addBtn = document.getElementById('btn-open-add-modal');
    const modal = document.getElementById('add-item-modal');
    const closeBtn = document.getElementById('add-item-modal-close');
    const form = document.getElementById('add-item-form');

    if (addBtn && modal) {
      addBtn.addEventListener('click', () => modal.classList.add('active'));
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleManualAdd();
      });
    }
  },

  async loadInventory() {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.success) {
        this.items = data.items;
        this.renderTable();
        this.updateHeaderStats();
      }
    } catch (e) {
      console.error('Failed to load inventory:', e);
    }
  },

  updateHeaderStats() {
    const totalCount = this.items.length;
    const warningCount = this.items.filter(it => it.status === 'warning' || it.status === 'danger').length;
    const badgeEl = document.getElementById('nav-inventory-badge');
    if (badgeEl) {
      badgeEl.textContent = warningCount > 0 ? `${warningCount} Expiring` : `${totalCount}`;
    }
  },

  renderTable() {
    const tbody = document.getElementById('inventory-table-body');
    const searchInput = document.getElementById('inv-search-input');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    if (!tbody) return;

    let filtered = this.items;

    // Filter by storage/status
    if (this.currentFilter !== 'all') {
      if (this.currentFilter === 'expiring') {
        filtered = filtered.filter(it => it.status === 'warning' || it.status === 'danger');
      } else {
        filtered = filtered.filter(it => it.storage.toLowerCase() === this.currentFilter.toLowerCase());
      }
    }

    // Filter by search query
    if (searchTerm) {
      filtered = filtered.filter(it => 
        it.name.toLowerCase().includes(searchTerm) || 
        it.category.toLowerCase().includes(searchTerm)
      );
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 3rem; color: #94a3b8;">
            <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; opacity: 0.5;"></i>
            No food items match the selected filter.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(item => {
      const risk = item.spoilage_risk || 20;
      let badgeClass = 'good';
      let statusText = 'Fresh';
      if (item.status === 'danger' || risk >= 75) {
        badgeClass = 'danger';
        statusText = 'Critical / Consume Today';
      } else if (item.status === 'warning' || risk >= 40) {
        badgeClass = 'warning';
        statusText = 'Expiring Soon';
      }

      return `
        <tr data-id="${item.id}">
          <td>
            <div class="food-item-cell">
              <img src="${item.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=60'}" class="food-thumb" alt="${item.name}">
              <div>
                <div style="font-weight: 600; color: #fff;">${item.name}</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Qty: ${item.quantity || '1 unit'} • Added: ${item.date_added || 'Recently'}</div>
              </div>
            </div>
          </td>
          <td><span class="badge" style="background: rgba(255,255,255,0.06); color: #e2e8f0;">${item.category}</span></td>
          <td>
            <span style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.85rem;">
              <i class="fas ${item.storage === 'Fridge' ? 'fa-snowflake' : (item.storage === 'Freezer' ? 'fa-icicles' : 'fa-box')}" style="color: ${item.storage === 'Fridge' ? '#06b6d4' : (item.storage === 'Freezer' ? '#a78bfa' : '#f59e0b')}"></i>
              ${item.storage}
            </span>
          </td>
          <td>
            <div style="font-family: monospace; font-size: 0.88rem; font-weight: 600;">${item.expiry_date || 'In 4 days'}</div>
            <div style="font-size: 0.72rem; color: #64748b;">${item.days_stored} days stored</div>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 9999px; overflow: hidden;">
                <div style="width: ${risk}%; height: 100%; background: ${risk >= 75 ? '#f43f5e' : (risk >= 40 ? '#f59e0b' : '#10b981')};"></div>
              </div>
              <span style="font-size: 0.75rem; font-family: monospace; font-weight: 600;">${risk}%</span>
            </div>
          </td>
          <td><span class="badge ${badgeClass}">${statusText}</span></td>
          <td style="text-align: right;">
            <button class="action-btn btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.78rem;" onclick="InventoryModule.markConsumed('${item.id}', '${item.name}')" title="Mark Consumed">
              <i class="fas fa-check" style="color: #10b981;"></i>
            </button>
            <button class="action-btn btn-danger" style="padding: 0.35rem 0.65rem; font-size: 0.78rem; margin-left: 4px;" onclick="InventoryModule.deleteItem('${item.id}')" title="Remove">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  async handleManualAdd() {
    const name = document.getElementById('add-name')?.value;
    const category = document.getElementById('add-category')?.value;
    const storage = document.getElementById('add-storage')?.value;
    const quantity = document.getElementById('add-quantity')?.value;
    const cost = parseFloat(document.getElementById('add-cost')?.value || 4.0);

    if (!name) {
      App.showToast('Please specify a food name.', 'warning');
      return;
    }

    const payload = {
      name,
      category,
      storage,
      quantity: quantity || '1 unit',
      cost_usd: cost,
      days_stored: 0.5
    };

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        App.showToast(`Saved ${name} to inventory!`, 'success');
        document.getElementById('add-item-modal')?.classList.remove('active');
        document.getElementById('add-item-form')?.reset();
        this.loadInventory();
      }
    } catch (e) {
      App.showToast('Failed to add item.', 'danger');
    }
  },

  async markConsumed(id, name) {
    try {
      await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      App.showToast(`Great job! Rescued & consumed: ${name} 🎉`, 'success');
      this.loadInventory();
      if (window.AnalyticsModule) window.AnalyticsModule.loadAnalytics();
    } catch (e) {
      App.showToast('Error updating item.', 'danger');
    }
  },

  async deleteItem(id) {
    if (!confirm('Are you sure you want to remove this item?')) return;
    try {
      await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      App.showToast('Item removed from inventory.', 'info');
      this.loadInventory();
      if (window.AnalyticsModule) window.AnalyticsModule.loadAnalytics();
    } catch (e) {
      App.showToast('Error removing item.', 'danger');
    }
  }
};

window.InventoryModule = InventoryModule;
