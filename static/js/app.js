/**
 * SaveFood - Core App Orchestrator & State Management
 * Dhaka International University (DIU) - Markup & Scripting Languages Lab
 * Author: Md. Mehedi Hasan (Roll: 04, Batch: D-90)
 */

const App = {
  activeTab: 'dashboard',

  init() {
    this.bindNavigation();
    this.bindAcademicModal();
    
    // Initialize submodules
    if (window.InventoryModule) window.InventoryModule.init();
    if (window.ScannerModule) window.ScannerModule.init();
    if (window.SpoilageModule) window.SpoilageModule.init();
    if (window.AnalyticsModule) window.AnalyticsModule.init();
    if (window.RecipesModule) window.RecipesModule.init();
    if (window.OpenFoodFactsModule) window.OpenFoodFactsModule.init();

    // Default load
    this.switchTab('dashboard');
  },

  bindNavigation() {
    document.querySelectorAll('.nav-item[data-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = btn.getAttribute('data-tab');
        this.switchTab(tabName);
      });
    });

    // Quick Action button navigation
    document.querySelectorAll('[data-action-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = btn.getAttribute('data-action-tab');
        this.switchTab(tabName);
      });
    });
  },

  switchTab(tabName) {
    this.activeTab = tabName;

    // Update nav links
    document.querySelectorAll('.nav-item').forEach(el => {
      if (el.getAttribute('data-tab') === tabName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Update view pages
    document.querySelectorAll('.page-view').forEach(view => {
      if (view.id === `view-${tabName}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Update header title
    const headerTitle = document.getElementById('current-page-title');
    const titles = {
      'dashboard': 'Dashboard & Overview',
      'scanner': 'AI Food Vision & Freshness Scanner',
      'spoilage': 'IoT Spoilage Prediction Simulator (XGBoost)',
      'inventory': 'Smart Food Inventory & Shelf Life',
      'recipes': 'Zero-Waste Recipe Engine',
      'openfoodfacts': 'Open Food Facts & Barcode Scanner',
      'community': 'Community Surplus Food Rescue',
      'analytics': 'Waste Analytics & Impact Metrics',
      'research': 'DIU Lab Project Proposal & Defense'
    };
    if (headerTitle) {
      headerTitle.textContent = titles[tabName] || 'SaveFood';
    }

    // Trigger tab-specific refresh
    if (tabName === 'analytics' && window.AnalyticsModule) {
      window.AnalyticsModule.loadAnalytics();
    } else if (tabName === 'inventory' && window.InventoryModule) {
      window.InventoryModule.loadInventory();
    } else if (tabName === 'recipes' && window.RecipesModule) {
      window.RecipesModule.loadRecipes();
    } else if (tabName === 'research') {
      this.loadResearchProposal();
    }
  },

  bindAcademicModal() {
    const trigger = document.getElementById('academic-trigger');
    const modal = document.getElementById('academic-modal');
    const closeBtn = document.getElementById('academic-modal-close');

    if (trigger && modal) {
      trigger.addEventListener('click', () => {
        this.loadResearchProposal();
        modal.classList.add('active');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    // Close on backdrop click
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }
  },

  async loadResearchProposal() {
    try {
      const res = await fetch('/api/research/info');
      const data = await res.json();
      if (data.success) {
        const r = data.research;
        const studentInfoEl = document.getElementById('research-student-info');
        if (studentInfoEl) {
          studentInfoEl.innerHTML = `
            <div style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
              <div style="font-size: 0.75rem; color: #10b981; font-weight: 700; text-transform: uppercase;">Researcher & Student</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-top: 2px;">${r.student.name}</div>
              <div style="font-size: 0.85rem; color: #94a3b8;">Batch: ${r.student.batch} • Roll: ${r.student.roll}</div>
              <div style="font-size: 0.82rem; color: #64748b;">${r.student.department}, ${r.student.institution}</div>
            </div>
            <div style="background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.25); border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
              <div style="font-size: 0.75rem; color: #06b6d4; font-weight: 700; text-transform: uppercase;">Supervisor</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-top: 2px;">${r.supervisor.name}</div>
              <div style="font-size: 0.85rem; color: #94a3b8;">${r.supervisor.designation}, ${r.supervisor.department}</div>
              <div style="font-size: 0.82rem; color: #64748b;">${r.supervisor.institution}</div>
            </div>
          `;
        }

        const metricsEl = document.getElementById('research-model-metrics');
        if (metricsEl && r.model_performance) {
          const m = r.model_performance;
          metricsEl.innerHTML = `
            <div style="margin-bottom: 1rem;">
              <div style="font-size: 0.8rem; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 0.5rem;">
                <i class="fas fa-camera"></i> 01. Vision Classification (Food-101 MobileNetV2 Baseline)
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
                <div style="background: rgba(15,23,42,0.9); padding: 0.75rem; border-radius: 8px; text-align: center; border: 1px solid rgba(56,189,248,0.2);">
                  <div style="font-size: 0.7rem; color: #94a3b8;">Val Top-1 Acc</div>
                  <div style="font-size: 1.25rem; font-weight: 700; color: #38bdf8; font-family: monospace;">${((m.vision_top1_acc || 0.1543) * 100).toFixed(1)}%</div>
                </div>
                <div style="background: rgba(15,23,42,0.9); padding: 0.75rem; border-radius: 8px; text-align: center; border: 1px solid rgba(56,189,248,0.2);">
                  <div style="font-size: 0.7rem; color: #94a3b8;">Val Top-5 Acc</div>
                  <div style="font-size: 1.25rem; font-weight: 700; color: #34d399; font-family: monospace;">${((m.vision_top5_acc || 0.3450) * 100).toFixed(1)}%</div>
                </div>
                <div style="background: rgba(15,23,42,0.9); padding: 0.75rem; border-radius: 8px; text-align: center; border: 1px solid rgba(56,189,248,0.2);">
                  <div style="font-size: 0.7rem; color: #94a3b8;">Throughput</div>
                  <div style="font-size: 1.25rem; font-weight: 700; color: #a78bfa; font-family: monospace;">${m.vision_throughput || '163.9'} FPS</div>
                </div>
              </div>
            </div>

            <div>
              <div style="font-size: 0.8rem; font-weight: 700; color: #10b981; text-transform: uppercase; margin-bottom: 0.5rem;">
                <i class="fas fa-microchip"></i> 02. IoT Spoilage Prediction (XGBoost Classifier)
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
                <div style="background: rgba(15,23,42,0.9); padding: 0.75rem; border-radius: 8px; text-align: center; border: 1px solid rgba(16,185,129,0.2);">
                  <div style="font-size: 0.7rem; color: #94a3b8;">F1-Score</div>
                  <div style="font-size: 1.25rem; font-weight: 700; color: #10b981; font-family: monospace;">${(m.f1_score * 100).toFixed(1)}%</div>
                </div>
                <div style="background: rgba(15,23,42,0.9); padding: 0.75rem; border-radius: 8px; text-align: center; border: 1px solid rgba(16,185,129,0.2);">
                  <div style="font-size: 0.7rem; color: #94a3b8;">Accuracy</div>
                  <div style="font-size: 1.25rem; font-weight: 700; color: #06b6d4; font-family: monospace;">${(m.accuracy * 100).toFixed(1)}%</div>
                </div>
                <div style="background: rgba(15,23,42,0.9); padding: 0.75rem; border-radius: 8px; text-align: center; border: 1px solid rgba(16,185,129,0.2);">
                  <div style="font-size: 0.7rem; color: #94a3b8;">ROC-AUC</div>
                  <div style="font-size: 1.25rem; font-weight: 700; color: #84cc16; font-family: monospace;">${(m.roc_auc * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          `;
        }
      }
    } catch (e) {
      console.error('Error fetching research proposal data:', e);
    }
  },

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 8px;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const colors = {
      success: 'background: rgba(16, 185, 129, 0.95); color: #042f20;',
      warning: 'background: rgba(245, 158, 11, 0.95); color: #451a03;',
      danger: 'background: rgba(244, 63, 94, 0.95); color: #fff;',
      info: 'background: rgba(15, 23, 42, 0.95); color: #fff; border: 1px solid rgba(255,255,255,0.2);'
    };
    toast.style.cssText = `padding: 12px 18px; border-radius: 12px; font-size: 0.88rem; font-weight: 600; box-shadow: 0 10px 25px rgba(0,0,0,0.5); backdrop-filter: blur(8px); transition: all 0.3s ease; transform: translateY(20px); opacity: 0; ${colors[type] || colors.info}`;
    toast.textContent = message;

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());
