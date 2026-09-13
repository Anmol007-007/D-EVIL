import { 
  getTables, 
  updateTableStatus, 
  getOrders, 
  updateOrderStatus, 
  getMenuItems, 
  updateMenuItem, 
  addMenuItem, 
  deleteMenuItem, 
  getReservations,
  resetSystemData,
  restaurantConfig 
} from './storage.js';

let activeAdminTab = 'tables';
let timerInterval = null;

export function initAdminPortal() {
  setupAdminTabs();
  renderFloorMap();
  renderKDS();
  renderMenuManager();
  renderReservationsTable();
  renderAnalytics();
  startKDSTimers();
  setupAdminEventListeners();
}

export function setupAdminTabs() {
  const tabs = document.querySelectorAll('.admin-nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeAdminTab = tab.dataset.tab;

      document.querySelectorAll('.admin-view-panel').forEach(panel => {
        panel.classList.remove('active');
      });

      const activePanel = document.getElementById(`admin-panel-${activeAdminTab}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }

      if (activeAdminTab === 'tables') renderFloorMap();
      if (activeAdminTab === 'kds') renderKDS();
      if (activeAdminTab === 'menu') renderMenuManager();
      if (activeAdminTab === 'reservations') renderReservationsTable();
      if (activeAdminTab === 'analytics') renderAnalytics();
    });
  });
}

export function setupAdminEventListeners() {
  const addMenuForm = document.getElementById('add-menu-form');
  if (addMenuForm) {
    addMenuForm.addEventListener('submit', handleAddMenuItem);
  }

  const resetBtn = document.getElementById('admin-reset-data-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all data (menu, tables, orders, reservations) to demo defaults?')) {
        resetSystemData();
        window.showToast?.('System data reset to default demo state.', 'info');
        renderFloorMap();
        renderKDS();
        renderMenuManager();
        renderReservationsTable();
        renderAnalytics();
      }
    });
  }
}

export function renderFloorMap() {
  const container = document.getElementById('floor-map-grid');
  if (!container) return;

  const tables = getTables();
  const orders = getOrders();

  container.innerHTML = tables.map(table => {
    let statusClass = 'table-available';
    let statusLabel = 'Available';
    if (table.status === 'occupied') {
      statusClass = 'table-occupied';
      statusLabel = 'Occupied';
    } else if (table.status === 'reserved') {
      statusClass = 'table-reserved';
      statusLabel = 'Reserved';
    } else if (table.status === 'cleaning') {
      statusClass = 'table-cleaning';
      statusLabel = 'Cleaning';
    }

    const activeOrder = orders.find(o => o.tableNumber === table.number && o.status !== 'served' && o.status !== 'paid');

    return `
      <div class="table-card ${statusClass}" data-table-id="${table.id}" data-table-num="${table.number}">
        <div class="table-card-header">
          <div class="table-number-badge">Table ${table.number}</div>
          <span class="table-status-pill">${statusLabel}</span>
        </div>
        <div class="table-card-body">
          <div class="table-meta-row">
            <span>📍 ${table.section}</span>
            <span>👥 ${table.capacity} Seats</span>
          </div>
          ${table.guestName ? `<div class="table-guest-tag">👤 ${table.guestName}</div>` : ''}
          ${table.seatedAt ? `<div class="table-time-tag">⏱️ ${table.seatedAt}</div>` : ''}
          ${table.reservationTime ? `<div class="table-res-time">📅 Reserved: ${table.reservationTime}</div>` : ''}
          ${activeOrder ? `<div class="table-active-order">🔥 Ticket ${activeOrder.orderNumber} (${activeOrder.status.toUpperCase()})</div>` : ''}
        </div>
        <div class="table-card-actions">
          <button class="btn btn-sm btn-action-table" data-action="status" data-table-num="${table.number}">Update Status</button>
          ${table.status === 'occupied' ? `<button class="btn btn-sm btn-receipt-table" data-action="bill" data-table-num="${table.number}">🧾 Bill</button>` : ''}
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.btn-action-table').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const num = parseInt(btn.dataset.tableNum);
      openTableStatusModal(num);
    });
  });

  container.querySelectorAll('.btn-receipt-table').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const num = parseInt(btn.dataset.tableNum);
      openTableReceiptModal(num);
    });
  });
}

export function openTableStatusModal(tableNum) {
  const tables = getTables();
  const table = tables.find(t => t.number === tableNum);
  if (!table) return;

  const modal = document.getElementById('table-status-modal');
  if (!modal) return;

  document.getElementById('table-modal-title').textContent = `Manage Table #${table.number} (${table.section})`;
  document.getElementById('table-status-select').value = table.status;
  document.getElementById('table-guest-input').value = table.guestName || '';

  const saveBtn = document.getElementById('table-status-save-btn');
  saveBtn.onclick = () => {
    const newStatus = document.getElementById('table-status-select').value;
    const guest = document.getElementById('table-guest-input').value.trim();
    updateTableStatus(table.number, newStatus, { guestName: guest });
    modal.classList.remove('active');
    window.showToast?.(`Table #${table.number} updated to ${newStatus.toUpperCase()}`, 'success');
    renderFloorMap();
    renderAnalytics();
  };

  modal.classList.add('active');
}

export function renderKDS() {
  const container = document.getElementById('kds-tickets-container');
  if (!container) return;

  const orders = getOrders().filter(o => o.status !== 'served' && o.status !== 'paid');

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="kds-empty-state">
        <div class="kds-empty-icon">🔥</div>
        <h3>All Fire Tickets Cleared!</h3>
        <p>No active kitchen tickets in queue. New incoming orders will ignite here in real-time.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => {
    const elapsedMinutes = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
    const isUrgent = elapsedMinutes >= 20;

    let statusBadgeClass = 'kds-badge-pending';
    let nextActionLabel = 'Fire to Grill';
    let nextStatus = 'cooking';

    if (order.status === 'cooking') {
      statusBadgeClass = 'kds-badge-cooking';
      nextActionLabel = 'Mark Plated';
      nextStatus = 'ready';
    } else if (order.status === 'ready') {
      statusBadgeClass = 'kds-badge-ready';
      nextActionLabel = 'Mark Served';
      nextStatus = 'served';
    }

    return `
      <div class="kds-ticket-card ${isUrgent ? 'urgent' : ''}" data-order-id="${order.id}">
        <div class="kds-ticket-header">
          <div>
            <span class="kds-ticket-num">${order.orderNumber}</span>
            <span class="kds-ticket-type">${order.type === 'dine-in' ? `🥩 Table #${order.tableNumber}` : '🥡 Takeaway'}</span>
          </div>
          <div class="kds-timer-wrap">
            <span class="kds-timer ${isUrgent ? 'blink-urgent' : ''}">⏱️ ${elapsedMinutes}m ago</span>
          </div>
        </div>
        
        <div class="kds-guest-name">Guest: <strong>${order.customerName || 'Diner'}</strong></div>

        <div class="kds-items-list">
          ${order.items.map(item => `
            <div class="kds-item-row">
              <div class="kds-item-qty">${item.quantity}x</div>
              <div class="kds-item-details">
                <div class="kds-item-name">${item.name}</div>
                ${item.notes ? `<div class="kds-item-note">⚠️ Note: ${item.notes}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="kds-ticket-footer">
          <span class="badge ${statusBadgeClass}">${order.status.toUpperCase()}</span>
          <button class="btn btn-sm btn-kds-advance btn-crimson" data-order-id="${order.id}" data-next-status="${nextStatus}">
            ${nextActionLabel} ➔
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.btn-kds-advance').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.dataset.orderId;
      const next = btn.dataset.nextStatus;
      updateOrderStatus(orderId, next);
      window.showToast?.(`Order updated to ${next.toUpperCase()}`, 'info');
      renderKDS();
      renderFloorMap();
      renderAnalytics();
    });
  });
}

function startKDSTimers() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (activeAdminTab === 'kds') {
      renderKDS();
    }
  }, 30000);
}

export function renderMenuManager() {
  const container = document.getElementById('menu-manager-table-body');
  if (!container) return;

  const items = getMenuItems();

  container.innerHTML = items.map(item => `
    <tr data-id="${item.id}">
      <td class="menu-td-img">
        <img src="${item.image}" alt="${item.name}" class="menu-manager-thumb" />
      </td>
      <td>
        <strong>${item.name}</strong>
        <div class="menu-manager-desc-preview">${item.description}</div>
      </td>
      <td><span class="badge badge-outline">${item.category.toUpperCase()}</span></td>
      <td>
        <div class="price-edit-cell">
          $<input type="number" step="0.50" value="${item.price.toFixed(2)}" class="price-input" data-id="${item.id}" />
        </div>
      </td>
      <td>
        <label class="toggle-switch">
          <input type="checkbox" class="stock-toggle-checkbox" data-id="${item.id}" ${item.inStock ? 'checked' : ''} />
          <span class="toggle-slider"></span>
        </label>
        <span class="stock-label ${item.inStock ? 'text-green' : 'text-red'}">
          ${item.inStock ? 'In Stock' : '86\'d (Sold Out)'}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-danger btn-delete-item" data-id="${item.id}">🗑️</button>
      </td>
    </tr>
  `).join('');

  container.querySelectorAll('.price-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = input.dataset.id;
      const newPrice = parseFloat(e.target.value);
      if (!isNaN(newPrice) && newPrice > 0) {
        updateMenuItem(id, { price: newPrice });
        window.showToast?.('Price updated!', 'success');
      }
    });
  });

  container.querySelectorAll('.stock-toggle-checkbox').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const id = chk.dataset.id;
      const inStock = e.target.checked;
      updateMenuItem(id, { inStock });
      window.showToast?.(inStock ? 'Cut marked in stock' : 'Cut marked 86\'d (Sold out)', inStock ? 'success' : 'warning');
      renderMenuManager();
    });
  });

  container.querySelectorAll('.btn-delete-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('Delete this cut from the menu?')) {
        deleteMenuItem(id);
        window.showToast?.('Item removed from menu.', 'info');
        renderMenuManager();
      }
    });
  });
}

export function handleAddMenuItem(e) {
  e.preventDefault();
  const name = document.getElementById('new-item-name')?.value.trim();
  const category = document.getElementById('new-item-category')?.value;
  const price = parseFloat(document.getElementById('new-item-price')?.value);
  const prepTime = document.getElementById('new-item-prep')?.value.trim() || '15-20 min';
  const calories = document.getElementById('new-item-cal')?.value.trim() || '650 kcal';
  const description = document.getElementById('new-item-desc')?.value.trim();
  const image = document.getElementById('new-item-img')?.value.trim() || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80';
  
  const dietaryCheckboxes = document.querySelectorAll('input[name="new-dietary"]:checked');
  const dietary = Array.from(dietaryCheckboxes).map(cb => cb.value);

  if (!name || isNaN(price) || !description) {
    window.showToast?.('Please fill out dish title, price, and description.', 'warning');
    return;
  }

  addMenuItem({
    name,
    category,
    price,
    prepTime,
    calories,
    description,
    image,
    dietary,
    inStock: true
  });

  e.target.reset();
  document.getElementById('add-menu-modal')?.classList.remove('active');
  window.showToast?.(`Dish "${name}" added to menu!`, 'success');
  renderMenuManager();
}

export function renderReservationsTable() {
  const container = document.getElementById('admin-reservations-list');
  if (!container) return;

  const reservations = getReservations();

  if (reservations.length === 0) {
    container.innerHTML = `<tr><td colspan="7" class="text-center py-4">No reservations booked yet.</td></tr>`;
    return;
  }

  container.innerHTML = reservations.map(res => `
    <tr>
      <td><strong>${res.guestName}</strong><br><small class="text-muted">${res.phone}</small></td>
      <td>${res.date}</td>
      <td><span class="badge badge-crimson">${res.time}</span></td>
      <td>👥 ${res.guests} Guests</td>
      <td>${res.section} (Table #${res.tableAssigned || 'Auto'})</td>
      <td><small>${res.specialRequests || 'None'}</small></td>
      <td><span class="badge badge-green">${res.status.toUpperCase()}</span></td>
    </tr>
  `).join('');
}

export function renderAnalytics() {
  const orders = getOrders();
  const tables = getTables();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'served' && o.status !== 'paid').length;
  const occupiedTablesCount = tables.filter(t => t.status === 'occupied').length;
  const avgOrderValue = orders.length > 0 ? (totalRevenue / orders.length) : 0;

  if (document.getElementById('stat-revenue')) {
    document.getElementById('stat-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
  }
  if (document.getElementById('stat-active-orders')) {
    document.getElementById('stat-active-orders').textContent = activeOrdersCount;
  }
  if (document.getElementById('stat-occupied-tables')) {
    document.getElementById('stat-occupied-tables').textContent = `${occupiedTablesCount}/${tables.length}`;
  }
  if (document.getElementById('stat-avg-ticket')) {
    document.getElementById('stat-avg-ticket').textContent = `$${avgOrderValue.toFixed(2)}`;
  }

  const dishSales = {};
  orders.forEach(o => {
    (o.items || []).forEach(i => {
      dishSales[i.name] = (dishSales[i.name] || 0) + i.quantity;
    });
  });

  const sortedDishes = Object.entries(dishSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topDishesContainer = document.getElementById('analytics-top-dishes');
  if (topDishesContainer) {
    if (sortedDishes.length === 0) {
      topDishesContainer.innerHTML = `<p class="text-muted">No sales logged yet.</p>`;
    } else {
      topDishesContainer.innerHTML = sortedDishes.map(([name, qty], idx) => `
        <div class="top-dish-row">
          <div class="top-dish-rank">#${idx + 1}</div>
          <div class="top-dish-name">${name}</div>
          <div class="top-dish-qty">${qty} orders</div>
        </div>
      `).join('');
    }
  }
}

export function openTableReceiptModal(tableNum) {
  const orders = getOrders();
  const order = orders.find(o => o.tableNumber === tableNum && o.status !== 'paid');
  const modal = document.getElementById('receipt-modal');
  if (!modal) return;

  if (!order) {
    window.showToast?.(`No active unpaid order found for Table #${tableNum}.`, 'warning');
    return;
  }

  document.getElementById('receipt-restaurant-name').textContent = restaurantConfig.name;
  document.getElementById('receipt-restaurant-tagline').textContent = restaurantConfig.tagline;
  document.getElementById('receipt-restaurant-address').textContent = restaurantConfig.address;
  document.getElementById('receipt-restaurant-phone').textContent = `Tel: ${restaurantConfig.phone}`;
  document.getElementById('receipt-wifi').textContent = `Guest Wi-Fi: ${restaurantConfig.wifiPassword}`;

  document.getElementById('receipt-order-id').textContent = order.orderNumber;
  document.getElementById('receipt-table-num').textContent = `Table #${tableNum}`;
  document.getElementById('receipt-guest-name').textContent = order.customerName || 'Guest';
  document.getElementById('receipt-date').textContent = new Date(order.createdAt).toLocaleString();

  const itemsContainer = document.getElementById('receipt-items-tbody');
  if (itemsContainer) {
    itemsContainer.innerHTML = order.items.map(item => `
      <tr>
        <td>${item.quantity}x ${item.name}</td>
        <td class="text-right">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
  }

  document.getElementById('receipt-subtotal').textContent = `$${order.subtotal.toFixed(2)}`;
  document.getElementById('receipt-tax').textContent = `$${order.tax.toFixed(2)}`;
  document.getElementById('receipt-tip').textContent = `$${(order.tip || 0).toFixed(2)}`;
  document.getElementById('receipt-total').textContent = `$${order.total.toFixed(2)}`;

  const printBtn = document.getElementById('receipt-print-btn');
  printBtn.onclick = () => {
    window.print();
  };

  const markPaidBtn = document.getElementById('receipt-mark-paid-btn');
  markPaidBtn.onclick = () => {
    updateOrderStatus(order.id, 'paid');
    modal.classList.remove('active');
    window.showToast?.(`Bill for Table #${tableNum} marked PAID! Table is now cleaning.`, 'success');
    renderFloorMap();
    renderAnalytics();
  };

  modal.classList.add('active');
}
