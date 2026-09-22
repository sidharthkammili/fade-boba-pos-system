// src/pages/Portal.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const views = [
  { label: 'Manager',        path: '/login?role=manager', emoji: '📊', desc: 'Reports, inventory, settings' },
  { label: 'Cashier',        path: '/login?role=cashier', emoji: '🧋', desc: 'Take customer orders' },
  { label: 'Customer Kiosk', path: '/kiosk',              emoji: '🛒', desc: 'Self-service ordering' },
  { label: 'Menu Board',     path: '/menuboard',          emoji: '📋', desc: 'Display menu (non-interactive)' },
];

export default function Portal() {
  const navigate = useNavigate();

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <h1 style={styles.logo}>Fade Boba</h1>
        <p style={styles.sub}>Select a view to continue</p>

        <div style={styles.grid}>
          {views.map((v) => (
            <button key={v.label} style={styles.card} onClick={() => navigate(v.path)}>
              <span style={styles.emoji}>{v.emoji}</span>
              <span style={styles.label}>{v.label}</span>
              <span style={styles.desc}>{v.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'var(--dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: { textAlign: 'center', padding: '40px 20px' },
  logo: { fontSize: '48px', fontWeight: 800, color: 'var(--pink)', marginBottom: '8px' },
  sub:  { color: 'var(--text-muted)', marginBottom: '40px', fontSize: '18px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 280px)',
    gap: '20px',
    justifyContent: 'center',
  },
  card: {
    background: 'var(--dark-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '32px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  emoji: { fontSize: '40px' },
  label: { fontSize: '20px', fontWeight: 700, color: 'var(--text)' },
  desc:  { fontSize: '13px', color: 'var(--text-muted)' },
};
