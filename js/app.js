import { initCustomerPortal, openCartModal, setupModalListeners, renderMenu, renderCategories } from './customer.js';
import { initAdminPortal, renderFloorMap, renderKDS, renderMenuManager, renderReservationsTable, renderAnalytics } from './admin.js';

window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-slide-in`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '🔥';
  if (type === 'warning') icon = '⚠️';
  if (type === 'error') icon = '❌';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
};

document.addEventListener('DOMContentLoaded', () => {
  initCustomerPortal();
  initAdminPortal();
  setupModalListeners();
  setupGlobalNavigation();
  setupStorageListeners();
});

function setupGlobalNavigation() {
  const navCustomerBtn = document.getElementById('nav-to-customer');
  const navStaffBtn = document.getElementById('nav-to-staff');
  const customerView = document.getElementById('customer-view');
  const staffView = document.getElementById('staff-view');

  const cartHeaderBtn = document.getElementById('header-cart-btn');
  if (cartHeaderBtn) {
    cartHeaderBtn.addEventListener('click', () => {
      openCartModal();
    });
  }

  const bookTableNavBtn = document.getElementById('nav-book-table-btn');
  if (bookTableNavBtn) {
    bookTableNavBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (staffView && staffView.classList.contains('active')) {
        switchToCustomerView();
      }
      document.getElementById('reservation-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const viewMenuHeroBtn = document.getElementById('hero-view-menu-btn');
  if (viewMenuHeroBtn) {
    viewMenuHeroBtn.addEventListener('click', () => {
      document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const heroReserveBtn = document.getElementById('hero-reserve-btn');
  if (heroReserveBtn) {
    heroReserveBtn.addEventListener('click', () => {
      document.getElementById('reservation-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function switchToCustomerView() {
    navCustomerBtn?.classList.add('active');
    navStaffBtn?.classList.remove('active');
    customerView?.classList.add('active');
    staffView?.classList.remove('active');
  }

  function switchToStaffView() {
    navStaffBtn?.classList.add('active');
    navCustomerBtn?.classList.remove('active');
    staffView?.classList.add('active');
    customerView?.classList.remove('active');
    renderFloorMap();
    renderKDS();
    renderMenuManager();
    renderReservationsTable();
    renderAnalytics();
  }

  if (navCustomerBtn) navCustomerBtn.addEventListener('click', switchToCustomerView);
  if (navStaffBtn) navStaffBtn.addEventListener('click', switchToStaffView);

  const openAddDishBtn = document.getElementById('btn-open-add-dish-modal');
  const addDishModal = document.getElementById('add-menu-modal');
  if (openAddDishBtn && addDishModal) {
    openAddDishBtn.addEventListener('click', () => {
      addDishModal.classList.add('active');
    });
  }

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
}

function setupStorageListeners() {
  window.addEventListener('restaurant-data-changed', (e) => {
    const { dataType } = e.detail;
    if (dataType === 'menu' || dataType === 'all') {
      renderCategories();
      renderMenu();
      renderMenuManager();
    }
    if (dataType === 'tables' || dataType === 'all') {
      renderFloorMap();
      renderAnalytics();
    }
    if (dataType === 'orders' || dataType === 'all') {
      renderKDS();
      renderFloorMap();
      renderAnalytics();
    }
    if (dataType === 'reservations' || dataType === 'all') {
      renderReservationsTable();
    }
  });
}
