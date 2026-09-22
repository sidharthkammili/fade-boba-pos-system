import React, { useState } from 'react';

export default function ReceiptModal({ order, onClose }) {
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = () => {
    // Mockup sending email
    setTimeout(() => {
      setEmailSent(true);
    }, 800);
  };

  if (!order) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.receiptBox}>
        <div style={styles.receiptHeader}>
          <h2>Fade Boba</h2>
          <p style={styles.dateText}>{order.date || new Date().toLocaleString()}</p>
          <h3>Order #{order.orderId}</h3>
        </div>

        <div style={styles.receiptBody}>
          <div style={styles.divider}></div>
          {order.items.map((item, idx) => (
            <div key={idx} style={styles.itemRow}>
              <div style={styles.itemMain}>
                <span style={styles.itemName}>{item.item_name}</span>
                <span>${parseFloat(item.sale_price).toFixed(2)}</span>
              </div>
              <div style={styles.itemDetails}>Ice: {item.ice} | Sugar: {item.sugar}</div>
              {item.addons && item.addons.map((a, aidx) => (
                <div key={aidx} style={styles.itemDetails}>+ {a.item_name}</div>
              ))}
            </div>
          ))}
          <div style={styles.divider}></div>
          <div style={styles.totalRow}>
            <span>SUBTOTAL</span>
            <span>${parseFloat(order.total).toFixed(2)}</span>
          </div>
          <div style={styles.taxRow}>
            <span>TAX (8.25%)</span>
            <span>${(parseFloat(order.total) * 0.0825).toFixed(2)}</span>
          </div>
          <div style={styles.grandTotalRow}>
            <span>TOTAL</span>
            <span>${(parseFloat(order.total) * 1.0825).toFixed(2)}</span>
          </div>
          {order.paymentMethod && (
            <div style={styles.paymentRow}>
              <span>Payment</span>
              <span>{order.paymentMethod}</span>
            </div>
          )}
        </div>

        <div style={styles.receiptFooter}>
          {emailSent ? (
            <div style={styles.successMsg}>✅ Digital Receipt Sent!</div>
          ) : (
            <button style={styles.emailBtn} onClick={handleSendEmail}>
              Send Digital Receipt (Email)
            </button>
          )}
          <button style={styles.closeBtn} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  receiptBox: {
    background: '#fff', // traditional paper receipt look
    color: '#000',
    width: '380px',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'monospace', // Gives it a receipt feel
  },
  receiptHeader: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  dateText: {
    fontSize: '12px',
    color: '#555',
    marginBottom: '8px',
  },
  divider: {
    borderBottom: '1px dashed #ccc',
    margin: '12px 0',
  },
  receiptBody: {
    marginBottom: '20px',
  },
  itemRow: {
    marginBottom: '12px',
  },
  itemMain: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  itemDetails: {
    fontSize: '12px',
    color: '#666',
    marginLeft: '8px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '18px',
    marginTop: '8px',
  },
  receiptFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  emailBtn: {
    background: 'var(--purple)',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: 'inherit',
    fontSize: '14px',
  },
  closeBtn: {
    background: '#eee',
    color: '#333',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: 'inherit',
    fontSize: '14px',
  },
  successMsg: {
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
    padding: '12px',
    border: '1px solid green',
    borderRadius: '8px',
    background: '#e8f5e9',
  },
  taxRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#555',
    marginTop: '4px',
  },
  grandTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '18px',
    marginTop: '8px',
    borderTop: '1px solid #000',
    paddingTop: '8px',
  },
  paymentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#555',
    marginTop: '8px',
  }
};
