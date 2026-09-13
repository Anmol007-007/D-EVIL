import { 
  initialCategories, 
  initialMenuItems, 
  initialTables, 
  initialOrders, 
  initialReservations, 
  restaurantConfig 
} from './data.js';

export { 
  initialCategories, 
  initialMenuItems, 
  initialTables, 
  initialOrders, 
  initialReservations, 
  restaurantConfig 
};

const STORAGE_KEYS = {
  MENU_ITEMS: 'devil_menu_items_v2',
  CATEGORIES: 'devil_categories_v2',
  TABLES: 'devil_tables_v2',
  ORDERS: 'devil_orders_v2',
  RESERVATIONS: 'devil_reservations_v2',
  CART: 'devil_cart_v2',
  CONFIG: 'devil_config_v2'
};

export function notifyDataChange(dataType, payload = null) {
  const event = new CustomEvent('restaurant-data-changed', {
    detail: { dataType, payload, timestamp: Date.now() }
  });
  window.dispatchEvent(event);
}

function getOrSeed(key, initialData) {
  const existing = localStorage.getItem(key);
  if (!existing) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  try {
    return JSON.parse(existing);
  } catch (e) {
    return initialData;
  }
}

export function getMenuItems() {
  return getOrSeed(STORAGE_KEYS.MENU_ITEMS, initialMenuItems);
}

export function saveMenuItems(items) {
  localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
  notifyDataChange('menu', items);
}

export function updateMenuItem(id, updates) {
  const items = getMenuItems();
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    saveMenuItems(items);
    return items[index];
  }
  return null;
}

export function addMenuItem(item) {
  const items = getMenuItems();
  const newItem = {
    ...item,
    id: 'm_' + Date.now(),
    rating: item.rating || 5.0,
    inStock: item.inStock !== false
  };
  items.unshift(newItem);
  saveMenuItems(items);
  return newItem;
}

export function deleteMenuItem(id) {
  let items = getMenuItems();
  items = items.filter(item => item.id !== id);
  saveMenuItems(items);
}

export function getCategories() {
  return getOrSeed(STORAGE_KEYS.CATEGORIES, initialCategories);
}

export function getTables() {
  return getOrSeed(STORAGE_KEYS.TABLES, initialTables);
}

export function saveTables(tables) {
  localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  notifyDataChange('tables', tables);
}

export function updateTableStatus(tableId, status, extra = {}) {
  const tables = getTables();
  const index = tables.findIndex(t => t.id === tableId || t.number === tableId);
  if (index !== -1) {
    tables[index] = {
      ...tables[index],
      status,
      guestName: extra.guestName || (status === 'available' ? null : tables[index].guestName),
      currentOrderId: extra.currentOrderId || (status === 'available' ? null : tables[index].currentOrderId),
      seatedAt: extra.seatedAt || (status === 'occupied' ? 'Just seated' : null),
      ...extra
    };
    saveTables(tables);
    return tables[index];
  }
  return null;
}

export function getOrders() {
  return getOrSeed(STORAGE_KEYS.ORDERS, initialOrders);
}

export function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  notifyDataChange('orders', orders);
}

export function addOrder(orderData) {
  const orders = getOrders();
  const orderNum = orders.length > 0 
    ? Math.max(...orders.map(o => parseInt(o.orderNumber?.replace('#', '') || 100))) + 1 
    : 101;

  const newOrder = {
    id: 'ord-' + Date.now(),
    orderNumber: `#${orderNum}`,
    status: 'pending',
    paymentStatus: orderData.paymentStatus || 'unpaid',
    createdAt: new Date().toISOString(),
    ...orderData
  };

  orders.unshift(newOrder);
  saveOrders(orders);

  if (newOrder.type === 'dine-in' && newOrder.tableNumber) {
    updateTableStatus(parseInt(newOrder.tableNumber), 'occupied', {
      currentOrderId: newOrder.id,
      guestName: newOrder.customerName || 'Guest'
    });
  }

  return newOrder;
}

export function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    if (status === 'served') {
      orders[index].servedAt = new Date().toISOString();
    }
    saveOrders(orders);

    if (status === 'paid' && orders[index].tableNumber) {
      updateTableStatus(parseInt(orders[index].tableNumber), 'cleaning');
    }
    return orders[index];
  }
  return null;
}

export function getReservations() {
  return getOrSeed(STORAGE_KEYS.RESERVATIONS, initialReservations);
}

export function saveReservations(reservations) {
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  notifyDataChange('reservations', reservations);
}

export function addReservation(resData) {
  const reservations = getReservations();
  const newRes = {
    id: 'res-' + Date.now(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    ...resData
  };
  reservations.unshift(newRes);
  saveReservations(reservations);

  if (newRes.tableAssigned) {
    updateTableStatus(parseInt(newRes.tableAssigned), 'reserved', {
      guestName: newRes.guestName,
      reservationTime: newRes.time
    });
  }
  return newRes;
}

export function getCart() {
  const existing = localStorage.getItem(STORAGE_KEYS.CART);
  if (!existing) return { items: [], type: 'dine-in', tableNumber: 1, promoCode: null, discount: 0 };
  try {
    return JSON.parse(existing);
  } catch (e) {
    return { items: [], type: 'dine-in', tableNumber: 1, promoCode: null, discount: 0 };
  }
}

export function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  notifyDataChange('cart', cart);
}

export function addToCart(menuItem, quantity = 1, notes = '', options = {}) {
  const cart = getCart();
  const existingIdx = cart.items.findIndex(i => i.id === menuItem.id && i.notes === notes);
  if (existingIdx > -1) {
    cart.items[existingIdx].quantity += quantity;
  } else {
    cart.items.push({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image,
      quantity,
      notes,
      options
    });
  }
  saveCart(cart);
}

export function updateCartQuantity(itemId, notes, quantity) {
  const cart = getCart();
  const idx = cart.items.findIndex(i => i.id === itemId && (i.notes || '') === (notes || ''));
  if (idx > -1) {
    if (quantity <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = quantity;
    }
    saveCart(cart);
  }
}

export function clearCart() {
  const cart = getCart();
  cart.items = [];
  saveCart(cart);
}

export function resetSystemData() {
  localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(initialMenuItems));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
  localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(initialTables));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(initialReservations));
  clearCart();
  notifyDataChange('all');
}
