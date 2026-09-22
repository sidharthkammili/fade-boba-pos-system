// src/pages/Cashier.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchDrinks,
  fetchAddons,
  placeOrder,
  fetchEmployeeOrders,
  fetchOrderDetails,
  refundOrder,
  fetchOrderQueue,
  updateOrderStatus,
  fetchRecipes,
} from '../api/api';
import ReceiptModal from '../components/ReceiptModal';

const CATEGORIES = [
  'All',
  'Milk Tea',
  'Fruit Tea',
  'Smoothie',
  'Slush',
  'Specialty Drinks',
  'Brewed Tea',
];

function getDrinkCategory(drink) {
  const name = (drink.item_name || '').toLowerCase();
  if (name.includes('milk tea')) return 'Milk Tea';
  if (name.includes('fruit tea')) return 'Fruit Tea';
  if (name.includes('smoothie')) return 'Smoothie';
  if (name.includes('slush')) return 'Slush';
  if (name.includes('brewed')) return 'Brewed Tea';
  return 'Specialty Drinks';
}

function canBeHot(drink) {
  const category = getDrinkCategory(drink);
  return category !== 'Slush' && category !== 'Smoothie';
}

function getSizeLabel(size) {
  if (size === 'small') return 'Small';
  if (size === 'large') return 'Large';
  return 'Medium';
}

function getSizePriceAdjustment(size) {
  if (size === 'small') return -1.0;
  if (size === 'large') return 1.0;
  return 0.0;
}

function getSizeAdjustmentLabel(size) {
  if (size === 'small') return '- $1.00';
  if (size === 'large') return '+ $1.00';
  return '';
}

function getTemperatureLabel(value) {
  return value === 'hot' ? 'Hot' : 'Iced';
}

const VIEWS = ['Order', 'Queue', 'History', 'Recipes'];

const STATUS_COLORS = {
  pending: { bg: '#3D2B10', border: '#F59E0B', text: '#F59E0B' },
  'in progress': { bg: '#10273D', border: '#3B82F6', text: '#3B82F6' },
  ready: { bg: '#0F3D1A', border: '#4ADE80', text: '#4ADE80' },
  completed: { bg: '#1A1025', border: '#6B3FA0', text: '#B09CC8' },
};

const NEXT_STATUS = {
  pending: 'in progress',
  'in progress': 'ready',
  ready: 'completed',
};

const STATUS_LABEL = {
  pending: '⏳ Pending',
  'in progress': '🔧 In Progress',
  ready: '✅ Ready',
  completed: '✔ Completed',
};

const PAYMENT_METHODS = [
  { label: 'Cash', icon: '💵' },
  { label: 'Credit / Debit', icon: '💳' },
  { label: 'Apple Pay', icon: '🍎' },
];

export default function Cashier() {
  const navigate = useNavigate();
  const employee = JSON.parse(sessionStorage.getItem('user') || 'null');

  const [view, setView] = useState('Order');
  const [drinks, setDrinks] = useState([]);
  const [addons, setAddons] = useState([]);
  const [cart, setCart] = useState([]);
  const [modal, setModal] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [iceLevel, setIceLevel] = useState('Regular Ice');
  const [sugarLevel, setSugarLevel] = useState('Regular Sugar');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [temperature, setTemperature] = useState('iced');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [receiptData, setReceiptData] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Payment state
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // History state
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [refundMsg, setRefundMsg] = useState('');

  // Queue state
  const [queue, setQueue] = useState([]);
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueMsg, setQueueMsg] = useState('');

  // Recipes state
  const [recipes, setRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(false);

  const displayedDrinks =
    selectedCategory === 'All'
      ? drinks
      : drinks.filter((d) => getDrinkCategory(d) === selectedCategory);

  const modalUnitPrice = useMemo(() => {
    if (!modal) return 0;
    const addonTotal = selectedAddons.reduce((sum, addon) => sum + parseFloat(addon.base_price), 0);
    const sizeAdjustment = getSizePriceAdjustment(selectedSize);
    return parseFloat(modal.base_price) + addonTotal + sizeAdjustment;
  }, [modal, selectedAddons, selectedSize]);

  const modalPreviewTotal = useMemo(
    () => modalUnitPrice * selectedQuantity,
    [modalUnitPrice, selectedQuantity]
  );

  useEffect(() => {
    if (!employee || employee.role !== 'Cashier') {
      navigate('/login');
      return;
    }
    fetchDrinks().then((d) => setDrinks(Array.isArray(d) ? d : []));
    fetchAddons().then((a) => setAddons(Array.isArray(a) ? a : []));
  }, [employee, navigate]);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await fetchEmployeeOrders(employee.employee_id);
      setHistory(Array.isArray(data) ? data : []);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadQueue = useCallback(async () => {
    setQueueLoading(true);
    try {
      const data = await fetchOrderQueue();
      setQueue(Array.isArray(data) ? data : []);
    } catch {
      setQueue([]);
    } finally {
      setQueueLoading(false);
    }
  }, []);

  const loadRecipes = useCallback(async () => {
    setRecipesLoading(true);
    try {
      const data = await fetchRecipes();
      setRecipes(Array.isArray(data) ? data : []);
    } catch {
      setRecipes([]);
    } finally {
      setRecipesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'History') loadHistory();
    if (view === 'Queue') {
      loadQueue();
      const interval = setInterval(loadQueue, 30000);
      return () => clearInterval(interval);
    }
    if (view === 'Recipes') loadRecipes();
  }, [view, loadQueue, loadRecipes]);

  const handleStatusUpdate = async (order_id, currentStatus) => {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    try {
      await updateOrderStatus(order_id, next);
      setQueueMsg(`Order #${order_id} marked as "${next}"`);
      loadQueue();
      setTimeout(() => setQueueMsg(''), 3000);
    } catch {
      setQueueMsg('Failed to update status.');
    }
  };

  const toggleOrderExpand = async (order_id) => {
    if (expandedOrder === order_id) {
      setExpandedOrder(null);
      return;
    }
    setExpandedOrder(order_id);
    if (!orderDetails[order_id]) {
      try {
        const details = await fetchOrderDetails(order_id);
        setOrderDetails((prev) => ({ ...prev, [order_id]: details }));
      } catch {
        console.error('Failed to load order details');
      }
    }
  };

  const handleRefund = async (order_id, amount) => {
    if (
      !window.confirm(
        `Refund order #${order_id} for $${parseFloat(amount).toFixed(2)}? This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      await refundOrder(order_id);
      setRefundMsg(`✅ Order #${order_id} refunded successfully.`);
      loadHistory();
      setOrderDetails((prev) => {
        const next = { ...prev };
        delete next[order_id];
        return next;
      });
    } catch (e) {
      setRefundMsg(`❌ Refund failed: ${e.message}`);
    }
  };

  const openCustomize = (drink) => {
    setModal(drink);
    setSelectedAddons([]);
    setIceLevel('Regular Ice');
    setSugarLevel('Regular Sugar');
    setSelectedSize('medium');
    setTemperature('iced');
    setSelectedQuantity(1);
  };

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.menu_item_id === addon.menu_item_id)
        ? prev.filter((a) => a.menu_item_id !== addon.menu_item_id)
        : [...prev, addon]
    );
  };

  const addToCart = () => {
    if (!modal) return;

    const quantity = selectedQuantity;
    const lineTotal = modalUnitPrice * quantity;

    setCart((prev) => [
      ...prev,
      {
        ...modal,
        unit_price: modalUnitPrice,
        sale_price: lineTotal,
        quantity,
        size: selectedSize,
        sizeAdjustment: getSizePriceAdjustment(selectedSize),
        temperature,
        addons: selectedAddons,
        ice: temperature === 'hot' ? 'N/A' : iceLevel,
        sugar: sugarLevel,
      },
    ]);

    setModal(null);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index, delta) => {
    setCart((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const nextQty = Math.max(1, (item.quantity || 1) + delta);
        return {
          ...item,
          quantity: nextQty,
          sale_price: parseFloat(item.unit_price || item.sale_price) * nextQty,
        };
      })
    );
  };

  const total = cart.reduce((sum, item) => sum + parseFloat(item.sale_price || 0), 0);

  const checkout = async () => {
    if (cart.length === 0) return;
    try {
      const items = cart.map((item) => ({
        menu_item_id: item.menu_item_id,
        sale_price: item.sale_price,
        quantity: item.quantity || 1,
        ice: item.ice,
        sugar: item.sugar,
        size: item.size,
        temperature: item.temperature,
        addons: item.addons.map((a) => ({
          add_on_menu_item_id: a.menu_item_id,
          quantity: item.quantity || 1,
        })),
      }));

      const res = await placeOrder(employee.employee_id, items);
      setMessage(`✅ Order #${res.order_id} placed!`);
      setReceiptData({
        orderId: res.order_id,
        items: [...cart],
        total,
        date: new Date().toLocaleString(),
        paymentMethod,
      });
      setShowReceiptModal(true);
      setCart([]);
      setPaymentMethod(null);
    } catch {
      setMessage('❌ Order failed. Please try again.');
    }
  };

  return (
    <div style={styles.layout}>
      <div style={styles.menu}>
        <div style={styles.header}>
          <span>🧋 Fade Boba — Cashier: {employee?.first_name}</span>
          <div style={styles.headerActions}>
            {VIEWS.map((v) => (
              <button
                key={v}
                style={{ ...styles.viewBtn, ...(view === v ? styles.viewBtnActive : {}) }}
                onClick={() => {
                  setView(v);
                  setRefundMsg('');
                  setQueueMsg('');
                }}
              >
                {v}
              </button>
            ))}
            <button style={styles.secondaryButton} onClick={() => navigate('/')}>
              Portal
            </button>
            <button
              style={styles.primaryButton}
              onClick={() => {
                sessionStorage.clear();
                navigate('/login');
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {view === 'Order' && (
          <>
            <div style={styles.tabsContainer}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  style={{ ...styles.tabButton, ...(selectedCategory === cat ? styles.activeTab : {}) }}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={styles.grid}>
              {displayedDrinks.map((d) => (
                <button key={d.menu_item_id} style={styles.drinkBtn} onClick={() => openCustomize(d)}>
                  <span style={styles.drinkName}>{d.item_name}</span>
                  <span style={styles.drinkPrice}>${parseFloat(d.base_price).toFixed(2)}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {view === 'Queue' && (
          <div style={styles.historyContainer}>
            <div style={styles.historyHeader}>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Order Queue</h2>
              <button style={styles.secondaryButton} onClick={loadQueue}>
                ↻ Refresh
              </button>
            </div>

            {queueMsg && (
              <p style={{ color: 'var(--green)', fontWeight: 600, marginBottom: '12px' }}>
                {queueMsg}
              </p>
            )}

            {queueLoading && <p style={{ color: 'var(--text-muted)' }}>Loading…</p>}

            {!queueLoading && queue.length === 0 && (
              <p style={{ color: 'var(--text-muted)' }}>No active orders in the queue.</p>
            )}

            {queue.map((order) => {
              const colors = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              const next = NEXT_STATUS[order.status];

              return (
                <div
                  key={order.order_id}
                  style={{
                    ...styles.historyCard,
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div style={styles.historyRow}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '16px' }}>Order #{order.order_id}</span>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {new Date(order.order_timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        — ${parseFloat(order.total_amount).toFixed(2)}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {Array.isArray(order.items) ? order.items.join(', ') : ''}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span
                        style={{
                          background: colors.border,
                          color: '#000',
                          borderRadius: '99px',
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '2px 10px',
                        }}
                      >
                        {STATUS_LABEL[order.status]}
                      </span>

                      {next && (
                        <button
                          style={{ ...styles.primaryButton, fontSize: '12px', padding: '5px 12px' }}
                          onClick={() => handleStatusUpdate(order.order_id, order.status)}
                        >
                          Mark {next.charAt(0).toUpperCase() + next.slice(1)} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === 'History' && (
          <div style={styles.historyContainer}>
            <div style={styles.historyHeader}>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>My Transaction History</h2>
              <button style={styles.secondaryButton} onClick={loadHistory}>
                ↻ Refresh
              </button>
            </div>

            {refundMsg && (
              <p
                style={{
                  color: refundMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)',
                  fontWeight: 600,
                  marginBottom: '12px',
                }}
              >
                {refundMsg}
              </p>
            )}

            {historyLoading && <p style={{ color: 'var(--text-muted)' }}>Loading…</p>}
            {!historyLoading && history.length === 0 && (
              <p style={{ color: 'var(--text-muted)' }}>No orders found.</p>
            )}

            {history.map((order) => {
              const isExpanded = expandedOrder === order.order_id;
              const details = orderDetails[order.order_id];
              const colors = STATUS_COLORS[order.status] || STATUS_COLORS.pending;

              return (
                <div key={order.order_id} style={styles.historyCard}>
                  <div style={styles.historyRow}>
                    <div>
                      <span style={{ fontWeight: 700 }}>Order #{order.order_id}</span>
                      {order.refunded && <span style={styles.refundedBadge}>REFUNDED</span>}
                      {order.status && (
                        <span
                          style={{
                            background: colors.border,
                            color: '#000',
                            borderRadius: '99px',
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '1px 8px',
                            marginLeft: '6px',
                          }}
                        >
                          {STATUS_LABEL[order.status]}
                        </span>
                      )}
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {new Date(order.order_timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: order.refunded ? 'var(--text-muted)' : 'var(--green)',
                          textDecoration: order.refunded ? 'line-through' : 'none',
                        }}
                      >
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </span>
                      <button style={styles.expandBtn} onClick={() => toggleOrderExpand(order.order_id)}>
                        {isExpanded ? '▲ Hide' : '▼ Details'}
                      </button>
                      {!order.refunded && (
                        <button
                          style={styles.refundBtn}
                          onClick={() => handleRefund(order.order_id, order.total_amount)}
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={styles.orderDetails}>
                      {!details && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading items…</p>
                      )}
                      {details?.items?.map((item, i) => (
                        <div key={i} style={styles.orderItem}>
                          <div style={{ fontWeight: 600 }}>{item.item_name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Qty: {item.quantity} | ${parseFloat(item.sale_price).toFixed(2)}
                          </div>
                          {item.addons?.map((a, j) => (
                            <div key={j} style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              + {a.item_name}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {view === 'Recipes' && (
          <div style={styles.historyContainer}>
            <div style={styles.historyHeader}>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Recipe Book</h2>
              <button style={styles.secondaryButton} onClick={loadRecipes}>
                ↻ Refresh
              </button>
            </div>

            {recipesLoading && <p style={{ color: 'var(--text-muted)' }}>Loading recipes…</p>}
            {!recipesLoading && recipes.length === 0 && (
              <p style={{ color: 'var(--text-muted)' }}>No recipes found.</p>
            )}

            {!recipesLoading && recipes.length > 0 && (
              <div style={styles.tableWrap}>
                <table aria-label="Recipe book">
                  <thead>
                    <tr>
                      <th scope="col">Menu Item</th>
                      <th scope="col">Ingredient</th>
                      <th scope="col">Quantity Used</th>
                      <th scope="col">Current Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipes.map((recipe) => (
                      <tr key={`${recipe.menu_item_id}-${recipe.inventory_id}`}>
                        <td style={{ fontWeight: 600 }}>{recipe.menu_item_name}</td>
                        <td>{recipe.inventory_item_name}</td>
                        <td>{parseFloat(recipe.quantity_used).toFixed(2)}</td>
                        <td style={{ color: recipe.quantity_in_stock < recipe.reorder_level ? 'var(--red)' : 'var(--text)' }}>
                          {parseFloat(recipe.quantity_in_stock).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {view === 'Order' && (
        <div style={styles.cart}>
          <h2 style={styles.cartTitle}>Current Order</h2>
          <div style={styles.cartItems}>
            {cart.length === 0 && <p style={styles.empty}>No items yet</p>}

            {cart.map((item, i) => (
              <div key={i} style={styles.cartItem}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>
                    {item.item_name} × {item.quantity || 1}
                  </div>
                  <div style={styles.addonLine}>
                    Size: {getSizeLabel(item.size || 'medium')}
                    {item.size && item.size !== 'medium' ? ` (${getSizeAdjustmentLabel(item.size)})` : ''} | Temp: {getTemperatureLabel(item.temperature || 'iced')}
                  </div>
                  <div style={styles.addonLine}>
                    Ice: {item.ice} | Sugar: {item.sugar}
                  </div>
                  {item.addons.map((a) => (
                    <div key={a.menu_item_id} style={styles.addonLine}>
                      + {a.item_name}
                    </div>
                  ))}

                  <div style={styles.quantityRow}>
                    <button style={styles.qtyBtn} onClick={() => updateCartQuantity(i, -1)}>
                      −
                    </button>
                    <span style={styles.qtyValue}>{item.quantity || 1}</span>
                    <button style={styles.qtyBtn} onClick={() => updateCartQuantity(i, 1)}>
                      +
                    </button>
                  </div>
                </div>

                <div style={styles.cartRight}>
                  <span>${parseFloat(item.sale_price || 0).toFixed(2)}</span>
                  <button style={styles.removeBtn} onClick={() => removeFromCart(i)}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.totalRow}>
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span>Tax (8.25%)</span>
            <span>${(total * 0.0825).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '4px' }}>
            <span>Total</span>
            <span style={{ color: 'var(--pink)' }}>${(total * 1.0825).toFixed(2)}</span>
          </div>

          {message && (
            <p style={{ fontSize: '13px', color: 'var(--green)', textAlign: 'center' }}>{message}</p>
          )}

          <button style={styles.checkoutBtn} onClick={() => { setPaymentMethod(null); setShowPayment(true); }} disabled={cart.length === 0}>
            Checkout
          </button>

          {receiptData && (
            <button
              style={{ ...styles.checkoutBtn, background: 'var(--border)', marginTop: '8px' }}
              onClick={() => setShowReceiptModal(true)}
            >
              View Last Receipt
            </button>
          )}
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div style={styles.overlay}>
          <div style={styles.modalBox}>
            <h3 style={{ marginBottom: '16px' }}>Select Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PAYMENT_METHODS.map(({ label, icon }) => (
                <button
                  key={label}
                  style={{
                    ...styles.checkoutBtn,
                    background: paymentMethod === label ? 'var(--green)' : 'var(--border)',
                    color: paymentMethod === label ? '#000' : 'var(--text)',
                  }}
                  onClick={() => setPaymentMethod(label)}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                style={{ ...styles.checkoutBtn, background: 'var(--border)' }}
                onClick={() => { setShowPayment(false); setPaymentMethod(null); }}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.checkoutBtn, opacity: paymentMethod ? 1 : 0.4 }}
                disabled={!paymentMethod}
                onClick={() => { setShowPayment(false); checkout(); }}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div style={styles.overlay}>
          <div style={styles.modalBox}>
            <h3 style={{ marginBottom: '4px' }}>{modal.item_name}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
              Total: ${modalPreviewTotal.toFixed(2)}
            </p>

            <p style={{ fontWeight: 600, marginBottom: '6px' }}>Size:</p>
            <div style={styles.levelGroup}>
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={`size-${size}`}
                  style={{
                    ...styles.levelBtn,
                    background: selectedSize === size ? 'var(--purple)' : 'var(--border)',
                  }}
                  onClick={() => setSelectedSize(size)}
                >
                  {getSizeLabel(size)}
                </button>
              ))}
            </div>
            {selectedSize !== 'medium' && (
              <p style={styles.sizeAdjustmentText}>
                Size adjustment: {getSizeAdjustmentLabel(selectedSize)}
              </p>
            )}

            {canBeHot(modal) && (
              <>
                <p style={{ fontWeight: 600, marginBottom: '6px', marginTop: '10px' }}>Temperature:</p>
                <div style={styles.levelGroup}>
                  {['iced', 'hot'].map((temp) => (
                    <button
                      key={`temp-${temp}`}
                      style={{
                        ...styles.levelBtn,
                        background: temperature === temp ? 'var(--purple)' : 'var(--border)',
                      }}
                      onClick={() => setTemperature(temp)}
                    >
                      {getTemperatureLabel(temp)}
                    </button>
                  ))}
                </div>
              </>
            )}

            <p style={{ fontWeight: 600, marginBottom: '6px', marginTop: '10px' }}>Quantity:</p>
            <div style={styles.modalQuantityRow}>
              <button
                style={styles.modalQtyBtn}
                onClick={() => setSelectedQuantity((prev) => Math.max(1, prev - 1))}
              >
                −
              </button>
              <span style={styles.modalQtyValue}>{selectedQuantity}</span>
              <button
                style={styles.modalQtyBtn}
                onClick={() => setSelectedQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>

            {temperature !== 'hot' && (
              <>
                <p style={{ fontWeight: 600, marginBottom: '6px', marginTop: '10px' }}>Ice Level:</p>
                <div style={styles.levelGroup}>
                  {['No Ice', 'Less Ice', 'Regular Ice', 'Extra Ice'].map((lvl) => (
                    <button
                      key={`ice-${lvl}`}
                      style={{
                        ...styles.levelBtn,
                        background: iceLevel === lvl ? '#3b82f6' : 'var(--border)',
                      }}
                      onClick={() => setIceLevel(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </>
            )}

            <p style={{ fontWeight: 600, marginBottom: '6px', marginTop: '10px' }}>Sugar Level:</p>
            <div style={styles.levelGroup}>
              {['No Sugar', 'Less Sugar', 'Regular Sugar', 'Extra Sugar'].map((lvl) => (
                <button
                  key={`sug-${lvl}`}
                  style={{
                    ...styles.levelBtn,
                    background: sugarLevel === lvl ? 'var(--pink)' : 'var(--border)',
                  }}
                  onClick={() => setSugarLevel(lvl)}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <p style={{ fontWeight: 600, marginBottom: '10px', marginTop: '10px' }}>Add-ons:</p>
            <div style={styles.addonList}>
              {addons.map((a) => {
                const selected = !!selectedAddons.find((s) => s.menu_item_id === a.menu_item_id);
                return (
                  <button
                    key={a.menu_item_id}
                    style={{
                      ...styles.addonBtn,
                      background: selected ? 'var(--purple)' : 'var(--border)',
                    }}
                    onClick={() => toggleAddon(a)}
                  >
                    {a.item_name} +${parseFloat(a.base_price).toFixed(2)}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                style={{ ...styles.checkoutBtn, background: 'var(--border)' }}
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button style={styles.checkoutBtn} onClick={addToCart}>
                Add to Order
              </button>
            </div>
          </div>
        </div>
      )}

      {showReceiptModal && receiptData && (
        <ReceiptModal order={receiptData} onClose={() => setShowReceiptModal(false)} />
      )}
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    height: '100vh',
    background: 'var(--dark)',
  },
  menu: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '16px 24px',
    background: 'var(--dark-card)',
    borderBottom: '1px solid var(--border)',
    fontWeight: 700,
    fontSize: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  viewBtn: {
    background: 'var(--dark)',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    borderRadius: '8px',
    padding: '6px 14px',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
  },
  viewBtnActive: {
    background: 'var(--purple)',
    color: 'white',
    border: '1px solid var(--purple)',
  },
  primaryButton: {
    background: 'var(--purple)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  secondaryButton: {
    background: 'var(--border)',
    color: 'var(--text)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  tabsContainer: {
    display: 'flex',
    gap: '12px',
    padding: '16px 20px 0 20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  tabButton: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    boxShadow: 'inset 0 0 0 2px var(--border)',
    background: 'var(--dark-card)',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  activeTab: {
    background: 'var(--purple)',
    color: 'white',
    boxShadow: 'inset 0 0 0 2px var(--purple)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    padding: '20px',
    overflowY: 'auto',
  },
  drinkBtn: {
    background: 'var(--dark-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  drinkName: {
    fontWeight: 600,
    color: 'var(--text)',
    fontSize: '14px',
  },
  drinkPrice: {
    color: 'var(--pink)',
    fontWeight: 700,
  },
  cart: {
    width: '300px',
    background: 'var(--dark-card)',
    borderLeft: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    gap: '8px',
  },
  cartTitle: {
    fontWeight: 700,
    fontSize: '18px',
  },
  cartItems: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  empty: {
    color: 'var(--text-muted)',
    fontSize: '13px',
  },
  cartItem: {
    background: 'var(--dark)',
    borderRadius: '8px',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
  },
  addonLine: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  sizeAdjustmentText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '8px',
    fontWeight: 600,
  },
  cartRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  removeBtn: {
    background: 'var(--red)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '11px',
    cursor: 'pointer',
  },
  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
  },
  qtyBtn: {
    background: 'var(--purple)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    width: '32px',
    height: '32px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  qtyValue: {
    minWidth: '22px',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '13px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: 'var(--text-muted)',
    borderTop: '1px solid var(--border)',
    paddingTop: '10px',
  },
  checkoutBtn: {
    background: 'var(--purple)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    fontWeight: 700,
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  modalBox: {
    background: 'var(--dark-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '28px',
    width: '380px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  levelGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  levelBtn: {
    flex: 1,
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 600,
    minWidth: '72px',
  },
  modalQuantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '4px',
  },
  modalQtyBtn: {
    background: 'var(--purple)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    width: '38px',
    height: '38px',
    fontSize: '20px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  modalQtyValue: {
    minWidth: '28px',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '16px',
  },
  addonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '150px',
    overflowY: 'auto',
  },
  addonBtn: {
    border: 'none',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'white',
    cursor: 'pointer',
    textAlign: 'left',
    fontWeight: 600,
  },
  historyContainer: {
    padding: '20px',
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  historyCard: {
    background: 'var(--dark-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  historyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },
  refundedBadge: {
    background: 'var(--red)',
    color: 'white',
    borderRadius: '99px',
    fontSize: '10px',
    fontWeight: 800,
    padding: '1px 8px',
    marginLeft: '8px',
  },
  expandBtn: {
    background: 'var(--border)',
    color: 'var(--text)',
    border: 'none',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  refundBtn: {
    background: 'var(--red)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  orderDetails: {
    marginTop: '12px',
    borderTop: '1px solid var(--border)',
    paddingTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  orderItem: {
    background: 'var(--dark)',
    borderRadius: '8px',
    padding: '8px 10px',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  emptyText: {
    color: 'var(--text-muted)',
  },
};