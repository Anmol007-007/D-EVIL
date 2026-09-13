import { 
  getMenuItems, 
  getCategories, 
  getCart, 
  addToCart, 
  updateCartQuantity, 
  clearCart, 
  addOrder, 
  addReservation, 
  getTables 
} from './storage.js';

let activeCategory = 'all';
let activeDietaryFilter = 'all';
let activeSearchQuery = '';
let selectedItemForModal = null;

export function initCustomerPortal() {
  renderCategories();
  renderMenu();
  updateCartBadge();
  setupEventListeners();
}

export function setupEventListeners() {
  const searchInput = document.getElementById('menu-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value.toLowerCase().trim();
      renderMenu();
    });
  }

  const dietaryChips = document.querySelectorAll('.dietary-chip');
  dietaryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dietaryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeDietaryFilter = chip.dataset.filter || 'all';
      renderMenu();
    });
  });

  const resForm = document.getElementById('reservation-form');
  if (resForm) {
    resForm.addEventListener('submit', handleReservationSubmit);
  }

  const checkoutBtn = document.getElementById('checkout-submit-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckoutSubmit);
  }

  const orderTypeRadios = document.querySelectorAll('input[name="cart-order-type"]');
  orderTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const tableSelectGroup = document.getElementById('cart-table-group');
      const deliveryGroup = document.getElementById('cart-delivery-group');
      if (e.target.value === 'dine-in') {
        if (tableSelectGroup) tableSelectGroup.style.display = 'block';
        if (deliveryGroup) deliveryGroup.style.display = 'none';
      } else {
        if (tableSelectGroup) tableSelectGroup.style.display = 'none';
        if (deliveryGroup) deliveryGroup.style.display = 'block';
      }
      recalculateCartTotals();
    });
  });

  const tipButtons = document.querySelectorAll('.tip-btn');
  tipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tipButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      recalculateCartTotals();
    });
  });
}

export function renderCategories() {
  const container = document.getElementById('category-nav');
  if (!container) return;

  const categories = getCategories();
  container.innerHTML = categories.map(cat => `
    <button class="category-btn ${cat.id === activeCategory ? 'active' : ''}" data-category="${cat.id}">
      <span class="cat-icon">${cat.icon}</span>
      <span class="cat-name">${cat.name}</span>
    </button>
  `).join('');

  container.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      renderMenu();
    });
  });
}

export function renderMenu() {
  const container = document.getElementById('menu-grid');
  if (!container) return;

  const items = getMenuItems();

  const filtered = items.filter(item => {
    const catMatch = (activeCategory === 'all' || item.category === activeCategory);
    
    const searchMatch = !activeSearchQuery || 
      item.name.toLowerCase().includes(activeSearchQuery) || 
      item.description.toLowerCase().includes(activeSearchQuery);

    let dietaryMatch = true;
    if (activeDietaryFilter !== 'all') {
      dietaryMatch = item.dietary && item.dietary.some(d => d.toLowerCase().includes(activeDietaryFilter.toLowerCase()));
    }

    return catMatch && searchMatch && dietaryMatch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-menu-state">
        <div class="empty-icon">🔥</div>
        <h3>No Feasts Found</h3>
        <p>Try adjusting your search keywords or dietary filters.</p>
        <button class="btn btn-outline" id="reset-filter-btn">View All Cuts</button>
      </div>
    `;
    const resetBtn = document.getElementById('reset-filter-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        activeCategory = 'all';
        activeDietaryFilter = 'all';
        activeSearchQuery = '';
        const searchInput = document.getElementById('menu-search');
        if (searchInput) searchInput.value = '';
        renderCategories();
        renderMenu();
      });
    }
    return;
  }

  container.innerHTML = filtered.map(item => {
    const dietaryBadges = (item.dietary || []).map(d => {
      let badgeClass = 'badge-crimson';
      if (d.includes('Vegan') || d.includes('Vegetarian')) badgeClass = 'badge-green';
      if (d.includes('Spicy')) badgeClass = 'badge-red';
      if (d.includes('Gluten-Free')) badgeClass = 'badge-blue';
      if (d.includes('Signature Cut')) badgeClass = 'badge-ember';
      return `<span class="badge ${badgeClass}">${d}</span>`;
    }).join(' ');

    const stockStatus = item.inStock 
      ? `<button class="btn btn-crimson btn-sm add-quick-btn" data-id="${item.id}">+ Add</button>`
      : `<span class="badge badge-sold-out">Sold Out (86'd)</span>`;

    return `
      <div class="menu-card ${!item.inStock ? 'is-sold-out' : ''}" data-id="${item.id}">
        <div class="menu-img-wrap" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" loading="lazy" class="menu-img" />
          <div class="card-overlay-btn"><i class="icon-eye"></i> Quick View</div>
          <span class="prep-badge">⏱️ ${item.prepTime || '10 min'}</span>
        </div>
        <div class="menu-content">
          <div class="menu-tags">${dietaryBadges}</div>
          <div class="menu-title-row">
            <h3 class="menu-title" data-id="${item.id}">${item.name}</h3>
            <span class="menu-price">$${item.price.toFixed(2)}</span>
          </div>
          <p class="menu-desc">${item.description}</p>
          <div class="menu-footer">
            <div class="rating-box">
              <span class="star-icon">★</span>
              <span class="rating-num">${item.rating || '4.9'}</span>
              <span class="calorie-txt">(${item.calories || '450 kcal'})</span>
            </div>
            ${stockStatus}
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.add-quick-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemId = btn.dataset.id;
      const item = items.find(i => i.id === itemId);
      if (item) {
        addToCart(item, 1, '');
        window.showToast?.(`Added "${item.name}" to order`, 'success');
        updateCartBadge();
      }
    });
  });

  container.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.add-quick-btn')) return;
      const itemId = card.dataset.id;
      openItemModal(itemId);
    });
  });
}

export function openItemModal(itemId) {
  const items = getMenuItems();
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  selectedItemForModal = item;
  const modal = document.getElementById('item-detail-modal');
  if (!modal) return;

  document.getElementById('modal-item-img').src = item.image;
  document.getElementById('modal-item-title').textContent = item.name;
  document.getElementById('modal-item-price').textContent = `$${item.price.toFixed(2)}`;
  document.getElementById('modal-item-desc').textContent = item.description;
  document.getElementById('modal-item-prep').textContent = item.prepTime || '10-15 mins';
  document.getElementById('modal-item-cal').textContent = item.calories || '450 kcal';
  document.getElementById('modal-item-rating').textContent = `${item.rating || '4.9'} ★`;
  document.getElementById('modal-special-notes').value = '';
  document.getElementById('modal-quantity').value = '1';

  const tagsContainer = document.getElementById('modal-item-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = (item.dietary || []).map(d => `<span class="badge badge-crimson">${d}</span>`).join(' ');
  }

  const addModalBtn = document.getElementById('modal-add-to-cart-btn');
  if (addModalBtn) {
    addModalBtn.disabled = !item.inStock;
    addModalBtn.textContent = item.inStock ? `Add to Order • $${item.price.toFixed(2)}` : 'Cut Currently 86\'d';
  }

  modal.classList.add('active');
}

export function setupModalListeners() {
  const modal = document.getElementById('item-detail-modal');
  const addModalBtn = document.getElementById('modal-add-to-cart-btn');
  const qtyPlus = document.getElementById('modal-qty-plus');
  const qtyMinus = document.getElementById('modal-qty-minus');
  const qtyInput = document.getElementById('modal-quantity');
  const closeBtns = document.querySelectorAll('.close-modal-btn');

  if (qtyPlus && qtyInput) {
    qtyPlus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      qtyInput.value = val + 1;
      updateModalPrice();
    });
  }

  if (qtyMinus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val > 1) {
        qtyInput.value = val - 1;
        updateModalPrice();
      }
    });
  }

  function updateModalPrice() {
    if (selectedItemForModal && addModalBtn) {
      const qty = parseInt(qtyInput.value) || 1;
      const total = (selectedItemForModal.price * qty).toFixed(2);
      addModalBtn.textContent = `Add ${qty} to Order • $${total}`;
    }
  }

  if (addModalBtn) {
    addModalBtn.addEventListener('click', () => {
      if (!selectedItemForModal || !selectedItemForModal.inStock) return;
      const qty = parseInt(qtyInput.value) || 1;
      const notes = document.getElementById('modal-special-notes').value.trim();
      addToCart(selectedItemForModal, qty, notes);
      if (modal) modal.classList.remove('active');
      window.showToast?.(`Added ${qty}x "${selectedItemForModal.name}" to feast!`, 'success');
      updateCartBadge();
    });
  }

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });
}

export function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const badges = document.querySelectorAll('.cart-count-badge');
  badges.forEach(b => {
    b.textContent = totalCount;
    b.style.display = totalCount > 0 ? 'inline-flex' : 'none';
  });
}

export function openCartModal() {
  const cartModal = document.getElementById('cart-modal');
  if (!cartModal) return;
  renderCartItems();
  populateTableSelectDropdown();
  recalculateCartTotals();
  cartModal.classList.add('active');
}

export function renderCartItems() {
  const container = document.getElementById('cart-items-list');
  if (!container) return;

  const cart = getCart();
  if (cart.items.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-view">
        <span class="cart-empty-icon">🔥</span>
        <h4>Your Feast is Empty</h4>
        <p>Explore our primal cuts and wood-fired creations to ignite your appetite.</p>
      </div>
    `;
    const submitBtn = document.getElementById('checkout-submit-btn');
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  const submitBtn = document.getElementById('checkout-submit-btn');
  if (submitBtn) submitBtn.disabled = false;

  container.innerHTML = cart.items.map((item) => `
    <div class="cart-item-row" data-id="${item.id}" data-notes="${item.notes || ''}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" />
      <div class="cart-item-info">
        <h4 class="cart-item-name">${item.name}</h4>
        <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        ${item.notes ? `<p class="cart-item-notes">📝 <em>${item.notes}</em></p>` : ''}
      </div>
      <div class="cart-item-controls">
        <div class="cart-qty-spinner">
          <button class="cart-qty-btn decrease-qty" data-id="${item.id}" data-notes="${item.notes || ''}">-</button>
          <span class="cart-qty-val">${item.quantity}</span>
          <button class="cart-qty-btn increase-qty" data-id="${item.id}" data-notes="${item.notes || ''}">+</button>
        </div>
        <button class="cart-item-remove-btn" data-id="${item.id}" data-notes="${item.notes || ''}">✕</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.decrease-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const notes = btn.dataset.notes;
      const cart = getCart();
      const current = cart.items.find(i => i.id === id && (i.notes || '') === notes);
      if (current) {
        updateCartQuantity(id, notes, current.quantity - 1);
        renderCartItems();
        recalculateCartTotals();
        updateCartBadge();
      }
    });
  });

  container.querySelectorAll('.increase-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const notes = btn.dataset.notes;
      const cart = getCart();
      const current = cart.items.find(i => i.id === id && (i.notes || '') === notes);
      if (current) {
        updateCartQuantity(id, notes, current.quantity + 1);
        renderCartItems();
        recalculateCartTotals();
        updateCartBadge();
      }
    });
  });

  container.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const notes = btn.dataset.notes;
      updateCartQuantity(id, notes, 0);
      renderCartItems();
      recalculateCartTotals();
      updateCartBadge();
    });
  });
}

export function populateTableSelectDropdown() {
  const select = document.getElementById('cart-table-select');
  if (!select) return;
  const tables = getTables();
  select.innerHTML = tables.map(t => `
    <option value="${t.number}">Table #${t.number} (${t.section} - ${t.capacity} seats)</option>
  `).join('');
}

export function recalculateCartTotals() {
  const cart = getCart();
  const subtotal = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const taxRate = 0.09;
  const tax = subtotal * taxRate;

  const activeTipBtn = document.querySelector('.tip-btn.active');
  const tipPercent = activeTipBtn ? parseFloat(activeTipBtn.dataset.tip) : 0.15;
  const tip = subtotal > 0 ? (subtotal * tipPercent) : 0;

  const total = subtotal + tax + tip;

  if (document.getElementById('cart-subtotal')) {
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  }
  if (document.getElementById('cart-tax')) {
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
  }
  if (document.getElementById('cart-tip')) {
    document.getElementById('cart-tip').textContent = `$${tip.toFixed(2)}`;
  }
  if (document.getElementById('cart-total-price')) {
    document.getElementById('cart-total-price').textContent = `$${total.toFixed(2)}`;
  }
}

export function handleCheckoutSubmit() {
  const cart = getCart();
  if (cart.items.length === 0) {
    window.showToast?.('Your feast is empty!', 'warning');
    return;
  }

  const orderType = document.querySelector('input[name="cart-order-type"]:checked')?.value || 'dine-in';
  const tableNumber = orderType === 'dine-in' 
    ? parseInt(document.getElementById('cart-table-select')?.value || 1) 
    : null;
  const customerName = document.getElementById('cart-customer-name')?.value.trim() || 'Guest Diner';
  const customerPhone = document.getElementById('cart-customer-phone')?.value.trim() || '';
  const deliveryAddress = orderType === 'delivery' 
    ? document.getElementById('cart-delivery-address')?.value.trim() 
    : '';

  const subtotal = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const tax = subtotal * 0.09;
  const activeTipBtn = document.querySelector('.tip-btn.active');
  const tipPercent = activeTipBtn ? parseFloat(activeTipBtn.dataset.tip) : 0.15;
  const tip = subtotal * tipPercent;
  const total = subtotal + tax + tip;

  const newOrder = addOrder({
    type: orderType,
    tableNumber,
    customerName,
    customerPhone,
    deliveryAddress,
    items: cart.items,
    subtotal,
    tax,
    tip,
    total,
    paymentStatus: 'unpaid'
  });

  clearCart();
  document.getElementById('cart-modal')?.classList.remove('active');
  updateCartBadge();

  showOrderConfirmationModal(newOrder);
}

export function showOrderConfirmationModal(order) {
  const modal = document.getElementById('order-confirmation-modal');
  if (!modal) return;

  document.getElementById('conf-order-num').textContent = order.orderNumber;
  document.getElementById('conf-order-type').textContent = order.type === 'dine-in' ? `Dine-In (Table #${order.tableNumber})` : 'Takeaway / Delivery';
  document.getElementById('conf-order-total').textContent = `$${order.total.toFixed(2)}`;
  document.getElementById('conf-order-name').textContent = order.customerName;

  modal.classList.add('active');
  window.showToast?.(`Order ${order.orderNumber} sent to the grill!`, 'success');
}

export function handleReservationSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('res-name')?.value.trim();
  const phone = document.getElementById('res-phone')?.value.trim();
  const email = document.getElementById('res-email')?.value.trim();
  const guests = parseInt(document.getElementById('res-guests')?.value || 2);
  const date = document.getElementById('res-date')?.value;
  const time = document.getElementById('res-time')?.value;
  const section = document.getElementById('res-section')?.value;
  const specialRequests = document.getElementById('res-requests')?.value.trim();

  if (!name || !phone || !date || !time) {
    window.showToast?.('Please fill in all required booking details.', 'warning');
    return;
  }

  const tables = getTables();
  const availableTable = tables.find(t => t.section === section && t.capacity >= guests && t.status === 'available') 
    || tables.find(t => t.capacity >= guests && t.status === 'available')
    || tables[0];

  const reservation = addReservation({
    guestName: name,
    phone,
    email,
    guests,
    date,
    time,
    section,
    specialRequests,
    tableAssigned: availableTable ? availableTable.number : null
  });

  e.target.reset();

  const confModal = document.getElementById('reservation-conf-modal');
  if (confModal) {
    document.getElementById('res-conf-code').textContent = `#${reservation.id.slice(-6).toUpperCase()}`;
    document.getElementById('res-conf-name').textContent = reservation.guestName;
    document.getElementById('res-conf-details').textContent = `${reservation.guests} Guests • ${reservation.date} at ${reservation.time} (${reservation.section})`;
    confModal.classList.add('active');
  }

  window.showToast?.('Table reservation locked in!', 'success');
}
