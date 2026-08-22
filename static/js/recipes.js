/**
 * SaveFood - Personalized Zero-Waste Recipe Engine & Community Hub
 * Research Objective 05: Recipe ideas to use ingredients before spoiling
 * Author: Md. Mehedi Hasan (Roll: 04, Batch: D-90)
 */

const RecipesModule = {
  recipes: [],
  communityPosts: [],

  init() {
    this.bindEvents();
    this.loadRecipes();
    this.loadCommunityPosts();
  },

  bindEvents() {
    // Community post modal
    const openPostBtn = document.getElementById('btn-open-community-modal');
    const modal = document.getElementById('community-post-modal');
    const closeBtn = document.getElementById('community-modal-close');
    const form = document.getElementById('community-post-form');

    if (openPostBtn && modal) {
      openPostBtn.addEventListener('click', () => modal.classList.add('active'));
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
        this.handleNewCommunityPost();
      });
    }
  },

  async loadRecipes() {
    try {
      const res = await fetch('/api/recipes');
      const data = await res.json();
      if (data.success) {
        this.recipes = data.recipes;
        this.renderRecipesGrid();
      }
    } catch (e) {
      console.error('Failed to load recipes:', e);
    }
  },

  renderRecipesGrid() {
    const grid = document.getElementById('recipes-grid');
    if (!grid) return;

    if (this.recipes.length === 0) {
      grid.innerHTML = '<div style="color: #94a3b8; text-align: center; grid-column: span 3;">No recipes found.</div>';
      return;
    }

    grid.innerHTML = this.recipes.map(recipe => `
      <div class="recipe-card">
        <div class="recipe-body">
          <div class="recipe-tags">
            <span class="badge ${recipe.match_score >= 50 ? 'danger' : 'good'}">${recipe.urgency_badge}</span>
            <span class="badge" style="background: rgba(255,255,255,0.06); color: #e2e8f0;">${recipe.category}</span>
          </div>
          <h3 style="font-size: 1.1rem; font-weight: 600; color: #fff; margin-bottom: 0.5rem;">${recipe.title}</h3>
          <p style="font-size: 0.82rem; color: #94a3b8; line-height: 1.4; margin-bottom: 0.75rem; flex: 1;">${recipe.description}</p>
          
          <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid #10b981; padding: 0.5rem 0.75rem; border-radius: 4px; font-size: 0.78rem; color: #d1fae5; margin-bottom: 0.75rem;">
            💡 <strong>Hack:</strong> ${recipe.preservation_tip}
          </div>

          <div class="recipe-meta">
            <span><i class="far fa-clock"></i> ${recipe.prep_time}</span>
            <span><i class="fas fa-fire-burner"></i> ${recipe.cook_time}</span>
            <span style="margin-left: auto; color: #34d399; font-weight: 600;">-${recipe.carbon_saved_kg}kg CO₂e</span>
          </div>

          <button class="action-btn btn-primary" style="margin-top: 1rem; width: 100%; justify-content: center;" onclick="RecipesModule.showRecipeModal(${recipe.id})">
            <i class="fas fa-utensils"></i> View Recipe Instructions
          </button>
        </div>
      </div>
    `).join('');
  },

  showRecipeModal(id) {
    const r = this.recipes.find(item => item.id === id);
    if (!r) return;

    const modal = document.getElementById('recipe-detail-modal');
    if (!modal) return;

    document.getElementById('recipe-modal-title').textContent = r.title;
    document.getElementById('recipe-modal-desc').textContent = r.description;
    
    // Ingredients
    const ingList = document.getElementById('recipe-modal-ingredients');
    if (ingList) {
      ingList.innerHTML = r.ingredients.map(ing => `<li style="padding: 0.35rem 0; color: #cbd5e1; border-bottom: 1px solid rgba(255,255,255,0.05);">${ing}</li>`).join('');
    }

    // Steps
    const stepList = document.getElementById('recipe-modal-steps');
    if (stepList) {
      stepList.innerHTML = r.instructions.map((st, idx) => `
        <li style="margin-bottom: 0.75rem; color: #e2e8f0; line-height: 1.4;">
          <strong style="color: #10b981;">Step ${idx + 1}:</strong> ${st}
        </li>
      `).join('');
    }

    modal.classList.add('active');

    const closeBtn = document.getElementById('recipe-detail-modal-close');
    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.remove('active');
    }
  },

  async loadCommunityPosts() {
    try {
      const res = await fetch('/api/community');
      const data = await res.json();
      if (data.success) {
        this.communityPosts = data.posts;
        this.renderCommunityList();
      }
    } catch (e) {
      console.error('Failed to load community posts:', e);
    }
  },

  renderCommunityList() {
    const container = document.getElementById('community-posts-list');
    if (!container) return;

    if (this.communityPosts.length === 0) {
      container.innerHTML = '<div style="color: #94a3b8; text-align: center; padding: 2rem;">No surplus food listings posted yet.</div>';
      return;
    }

    container.innerHTML = this.communityPosts.map(p => `
      <div class="community-card">
        <img src="${p.image}" class="community-img" alt="${p.title}">
        <div style="flex: 1; display: flex; flex-direction: column;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
            <span class="badge ${p.status === 'Urgent Claim' ? 'danger' : 'good'}">${p.status}</span>
            <span style="font-size: 0.75rem; color: #64748b;"><i class="fas fa-location-dot"></i> ${p.distance}</span>
          </div>
          <h4 style="font-size: 1.05rem; font-weight: 600; color: #fff;">${p.title}</h4>
          <div style="font-size: 0.8rem; color: #94a3b8; margin: 0.2rem 0;">Qty: <strong>${p.quantity}</strong> • Best before: <span style="color: #fbbf24;">${p.best_before}</span></div>
          <div style="font-size: 0.78rem; color: #64748b;">📍 ${p.location} • Donor: ${p.donor_name}</div>
          
          <div style="margin-top: auto; padding-top: 0.75rem; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.75rem; color: #34d399; font-family: monospace;">${p.contact}</span>
            <button class="action-btn btn-secondary" style="padding: 0.35rem 0.85rem; font-size: 0.78rem;" onclick="App.showToast('Claim request sent to ${p.donor_name}! Check email.', 'success')">
              <i class="fas fa-hand-holding-heart"></i> Claim & Rescue
            </button>
          </div>
        </div>
      </div>
    `).join('');
  },

  async handleNewCommunityPost() {
    const title = document.getElementById('post-title')?.value;
    const donor = document.getElementById('post-donor')?.value;
    const location = document.getElementById('post-location')?.value;
    const quantity = document.getElementById('post-quantity')?.value;
    const contact = document.getElementById('post-contact')?.value;

    if (!title || !quantity) {
      App.showToast('Please fill in title and quantity.', 'warning');
      return;
    }

    const payload = {
      title,
      donor_name: donor || 'Local Neighbor',
      location: location || 'Dhaka, Bangladesh',
      quantity,
      contact: contact || 'volunteer@savefood.org',
      best_before: 'Within 24 Hours'
    };

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        App.showToast('Surplus food listing published to community board!', 'success');
        document.getElementById('community-post-modal')?.classList.remove('active');
        document.getElementById('community-post-form')?.reset();
        this.loadCommunityPosts();
      }
    } catch (e) {
      App.showToast('Failed to post listing.', 'danger');
    }
  }
};

window.RecipesModule = RecipesModule;
