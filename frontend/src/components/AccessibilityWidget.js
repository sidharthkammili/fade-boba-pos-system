import React, { useState } from 'react';
import AccessibilityToolbar from './AccessibilityToolbar';
import {
  getContrastAnnouncement,
  getTextSizeAnnouncement,
  readAccessibilitySettings,
  updateAccessibilitySettings,
} from '../utils/accessibility';

export default function AccessibilityWidget() {
  const [announcement, setAnnouncement] = useState('');
  const [accessibility, setAccessibility] = useState(() => readAccessibilitySettings());
  const [showAccessMenu, setShowAccessMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false); 

  const updateAccessibility = (updates) => {
    const next = updateAccessibilitySettings({ ...accessibility, ...updates });
    setAccessibility(next);

    if (updates.contrast) {
      setAnnouncement(getContrastAnnouncement(next.contrast));
    }
    if (updates.textSize) {
      setAnnouncement(getTextSizeAnnouncement(next.textSize));
    }
  };

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <div style={styles.floatingAccessContainer}>
        <button 
          style={{
            ...styles.accessToggleBtn,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            background: isHovered ? 'var(--surface-muted)' : 'var(--dark-card)',
          }}
          onClick={() => setShowAccessMenu(!showAccessMenu)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-expanded={showAccessMenu}
          aria-controls="accessibility-dropdown"
        >
          <span style={{ fontSize: '20px' }}>♿</span> Accessibility
        </button>

        {showAccessMenu && (
          <div id="accessibility-dropdown" style={styles.accessDropdown}>
            <AccessibilityToolbar
              settings={accessibility}
              onContrastChange={(value) => updateAccessibility({ contrast: value })}
              onTextSizeChange={(value) => updateAccessibility({ textSize: value })}
            />
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  floatingAccessContainer: {
    position: 'fixed', 
    bottom: '24px',
    left: '24px',
    zIndex: 9999, // Ensure it's above everything across all pages
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'flex-start',
    gap: '10px'
  },
  accessToggleBtn: {
    background: 'var(--dark-card)',
    border: '1px solid var(--border)',
    borderRadius: '25px', 
    padding: '10px 18px', 
    height: '50px',
    fontSize: '15px',     
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',           
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    color: 'var(--text)',
    transition: 'all 0.2s ease', 
  },
  accessDropdown: {
    background: 'var(--dark-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    boxShadow: '0 -8px 24px rgba(0,0,0,0.4)',
    transform: 'scale(0.95)', 
    transformOrigin: 'bottom left'
  },
};
