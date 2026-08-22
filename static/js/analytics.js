/**
 * SaveFood - Waste Analytics & Cost Savings Dashboard
 * Research Objective 04: Visualize food & money saved over time
 * Author: Md. Mehedi Hasan (Roll: 04, Batch: D-90)
 */

const AnalyticsModule = {
  trendChart: null,
  categoryChart: null,

  init() {
    this.loadAnalytics();
  },

  async loadAnalytics() {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (data.success) {
        this.renderKPIs(data.summary);
        this.renderCategoryChart(data.category_distribution);
        this.renderTrendChart(data.monthly_trend);
      }
    } catch (e) {
      console.error('Failed to load analytics:', e);
    }
  },

  renderKPIs(summary) {
    const kpiFoodSaved = document.getElementById('kpi-food-saved');
    const kpiMoneySaved = document.getElementById('kpi-money-saved');
    const kpiCO2Saved = document.getElementById('kpi-co2-saved');
    const kpiMealsRescued = document.getElementById('kpi-meals-rescued');

    if (kpiFoodSaved) kpiFoodSaved.textContent = `${summary.saved_food_kg} kg`;
    if (kpiMoneySaved) kpiMoneySaved.textContent = `$${summary.saved_money_usd}`;
    if (kpiCO2Saved) kpiCO2Saved.textContent = `${summary.saved_co2_kg} kg`;
    if (kpiMealsRescued) kpiMealsRescued.textContent = `${summary.meals_rescued} Portions`;

    // Overview banner KPIs
    const dashFoodSaved = document.getElementById('dash-kpi-saved');
    const dashMoneySaved = document.getElementById('dash-kpi-money');
    const dashTotalItems = document.getElementById('dash-kpi-items');
    const dashAtRisk = document.getElementById('dash-kpi-risk');

    if (dashFoodSaved) dashFoodSaved.textContent = `${summary.saved_food_kg} kg`;
    if (dashMoneySaved) dashMoneySaved.textContent = `$${summary.saved_money_usd}`;
    if (dashTotalItems) dashTotalItems.textContent = `${summary.total_items}`;
    if (dashAtRisk) dashAtRisk.textContent = `${summary.warning_count + summary.high_risk_count}`;
  },

  renderCategoryChart(distribution) {
    const canvas = document.getElementById('category-pie-chart');
    if (!canvas || !window.Chart) return;

    const labels = Object.keys(distribution || {});
    const values = Object.values(distribution || {});

    if (this.categoryChart) {
      this.categoryChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels.length ? labels : ['Vegetables', 'Fruits', 'Dairy', 'Bakery'],
        datasets: [{
          data: values.length ? values : [4, 3, 2, 2],
          backgroundColor: [
            '#10b981',
            '#06b6d4',
            '#f59e0b',
            '#84cc16',
            '#f43f5e',
            '#6366f1',
            '#ec4899'
          ],
          borderColor: '#0f172a',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', font: { family: 'Outfit', size: 11 }, padding: 12 }
          }
        },
        cutout: '68%'
      }
    });
  },

  renderTrendChart(trend) {
    const canvas = document.getElementById('waste-trend-chart');
    if (!canvas || !window.Chart || !trend) return;

    if (this.trendChart) {
      this.trendChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    this.trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trend.labels,
        datasets: [
          {
            label: 'Food Rescued & Saved (kg)',
            data: trend.saved_kg,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointBackgroundColor: '#10b981',
            pointRadius: 4
          },
          {
            label: 'Wasted Food (kg)',
            data: trend.wasted_kg,
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.05)',
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            borderDash: [5, 5],
            pointBackgroundColor: '#f43f5e',
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'Outfit' } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'Outfit' } },
            title: { display: true, text: 'Kilograms (kg)', color: '#64748b' }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#cbd5e1', font: { family: 'Outfit', size: 12 } }
          }
        }
      }
    });
  }
};

window.AnalyticsModule = AnalyticsModule;
