const BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export async function fetchDrinks() {
  const res = await fetch(`${BASE}/menu/drinks`);
  return res.json();
}

export async function fetchAddons() {
  const res = await fetch(`${BASE}/menu/addons`);
  return res.json();
}

export async function fetchMenu() {
  const res = await fetch(`${BASE}/menu`);
  return res.json();
}

export async function loginEmployee(employee_id) {
  const res = await fetch(`${BASE}/employees/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employee_id }),
  });
  if (!res.ok) throw new Error('Employee not found');
  return res.json();
}

export async function placeOrder(employee_id, items) {
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employee_id, items }),
  });
  if (!res.ok) throw new Error('Order failed');
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(`${BASE}/orders`);
  return res.json();
}

export async function fetchOrderSummary() {
  const res = await fetch(`${BASE}/orders/summary`);
  return res.json();
}

export async function fetchInventory() {
  const res = await fetch(`${BASE}/inventory`);
  return res.json();
}

export async function fetchLowStock() {
  const res = await fetch(`${BASE}/inventory/low-stock`);
  return res.json();
}

export async function restockItem(inventory_id, amount) {
  const res = await fetch(`${BASE}/inventory/${inventory_id}/restock`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  return res.json();
}

export async function updatePrice(menu_item_id, base_price) {
  const res = await fetch(`${BASE}/menu/${menu_item_id}/price`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base_price }),
  });
  return res.json();
}

export async function translateTexts(texts, target) {
  const res = await fetch(`${BASE}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts, target }),
  });
  if (!res.ok) return texts;
  const data = await res.json();
  return data.translations || texts;
}

export async function sendChatbotMessage(message, history) {
  const res = await fetch(`${BASE}/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error('Failed to get chatbot response');
  return res.json();
}

export async function submitUsabilityFeedback(payload) {
  const res = await fetch(`${BASE}/usability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to save usability feedback');
  return res.json();
}

export async function fetchUsabilityFeedback(interfaceView = '', limit = 50) {
  const params = new URLSearchParams();
  if (interfaceView) params.append('interfaceView', interfaceView);
  params.append('limit', String(limit));
  const res = await fetch(`${BASE}/usability?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load usability feedback');
  return res.json();
}

export const verifyGoogleToken = async (token, intendedRole) => {
  try {
    const response = await fetch(`${BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, intendedRole }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};

// Employee management
export async function fetchEmployees() {
  const res = await fetch(`${BASE}/employees`);
  return res.json();
}

export async function addEmployee(first_name, last_name, role) {
  const res = await fetch(`${BASE}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ first_name, last_name, role }),
  });
  if (!res.ok) throw new Error('Failed to add employee');
  return res.json();
}

export async function updateEmployeeRole(employee_id, role) {
  const res = await fetch(`${BASE}/employees/${employee_id}/role`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error('Failed to update role');
  return res.json();
}

export async function deleteEmployee(employee_id) {
  const res = await fetch(`${BASE}/employees/${employee_id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete employee');
  return res.json();
}

// Transaction history & refunds
export async function fetchEmployeeOrders(employee_id) {
  const res = await fetch(`${BASE}/orders/employee/${employee_id}`);
  return res.json();
}

export async function fetchOrderDetails(order_id) {
  const res = await fetch(`${BASE}/orders/${order_id}`);
  return res.json();
}

export async function refundOrder(order_id) {
  const res = await fetch(`${BASE}/orders/${order_id}/refund`, { method: 'POST' });
  if (!res.ok) throw new Error('Refund failed');
  return res.json();
}

// Order queue
export async function fetchOrderQueue() {
  const res = await fetch(`${BASE}/orders/queue`);
  return res.json();
}
 
export async function updateOrderStatus(order_id, status) {
  const res = await fetch(`${BASE}/orders/${order_id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

// Reports
export async function fetchXReport() {
  const res = await fetch(`${BASE}/reports/x-report`);
  if (!res.ok) throw new Error('Failed to fetch X-Report');
  return res.json();
}

export async function fetchZReportPreview() {
  const res = await fetch(`${BASE}/reports/z-report/preview`);
  if (!res.ok) throw new Error('Failed to fetch Z-Report preview');
  return res.json();
}

export async function finalizeZReport(manager_id, employee_signature) {
  const res = await fetch(`${BASE}/reports/z-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ manager_id, employee_signature }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to finalize Z-Report');
  }
  return res.json();
}

export async function fetchZReports() {
  const res = await fetch(`${BASE}/reports/z-reports`);
  if (!res.ok) throw new Error('Failed to fetch Z-Reports history');
  return res.json();
}

// Recipes management
export async function fetchRecipes() {
  const res = await fetch(`${BASE}/recipes`);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return res.json();
}

export async function addRecipeIngredient(menu_item_id, inventory_id, quantity_used) {
  const res = await fetch(`${BASE}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ menu_item_id, inventory_id, quantity_used }),
  });
  if (!res.ok) throw new Error('Failed to add recipe ingredient');
  return res.json();
}

export async function updateRecipeIngredient(menu_item_id, inventory_id, quantity_used) {
  const res = await fetch(`${BASE}/recipes/${menu_item_id}/${inventory_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity_used }),
  });
  if (!res.ok) throw new Error('Failed to update recipe ingredient');
  return res.json();
}

export async function deleteRecipeIngredient(menu_item_id, inventory_id) {
  const res = await fetch(`${BASE}/recipes/${menu_item_id}/${inventory_id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete recipe ingredient');
  return res.json();
}
