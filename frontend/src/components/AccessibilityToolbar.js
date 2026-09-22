import React, { useState } from 'react';
import {
  CONTRAST_OPTIONS,
  TEXT_SIZE_OPTIONS,
} from '../utils/accessibility';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'zh-CN', label: '中文' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'ko', label: '한국어' },
];

export default function AccessibilityToolbar({
  settings,
  onContrastChange,
  onTextSizeChange,
  compact = false,
}) {
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (event) => {
    const nextLang = event.target.value;
    setLanguage(nextLang);
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = nextLang;
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };
  return (
    <section
      className="card accessibility-toolbar"
      aria-label="Accessibility settings"
      style={compact ? compactStyle : undefined}
    >
      <div style={headerRowStyle}>
        <div>
          <h2 style={titleStyle}>Accessibility</h2>
          <p style={subtitleStyle}>
            Adjust contrast and text size for easier viewing and keyboard use.
          </p>
        </div>
      </div>

      <div style={groupsWrapStyle}>
        <div style={groupStyle}>
          <span style={groupLabelStyle}>Contrast</span>
          <div style={buttonRowStyle} role="group" aria-label="Contrast mode">
            {CONTRAST_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className="accessibility-toolbar__button"
                aria-pressed={settings.contrast === option.value}
                onClick={() => onContrastChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div style={groupStyle}>
          <span style={groupLabelStyle}>Text size</span>
          <div style={buttonRowStyle} role="group" aria-label="Text size">
            {TEXT_SIZE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className="accessibility-toolbar__button"
                aria-pressed={settings.textSize === option.value}
                onClick={() => onTextSizeChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div style={groupStyle}>
          <span style={groupLabelStyle}>Language</span>
          <select 
            value={language} 
            onChange={handleLanguageChange}
            style={selectStyle}
            aria-label="Select Language"
          >
            {LANGUAGES.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={helpBoxStyle}>
        <p style={helpTitleStyle}>Keyboard and screen reader support</p>
        <p style={helpTextStyle}>
          Use Tab to move through controls. High contrast and large text 
          settings are automatically announced to screen readers.
        </p>
      </div>
    </section>
  );
}

const compactStyle = {
  padding: '16px',
};

const headerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '12px',
  marginBottom: '14px',
};

const titleStyle = {
  fontSize: '1.1rem',
  fontWeight: 700,
  marginBottom: '4px',
};

const subtitleStyle = {
  color: 'var(--text-muted)',
  fontSize: '0.95rem',
};

const groupsWrapStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
};

const groupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  minWidth: '260px',
  flex: 1,
};

const groupLabelStyle = {
  fontWeight: 700,
  color: 'var(--text)',
};

const buttonRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
};

const helpBoxStyle = {
  background: 'var(--surface-muted)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  padding: '12px 14px',
  marginTop: '20px',
};

const helpTitleStyle = {
  fontWeight: 700,
  marginBottom: '4px',
  fontSize: '0.95rem',
};

const helpTextStyle = {
  color: 'var(--text-muted)',
  fontSize: '0.85rem',
};

const selectStyle = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  background: 'var(--dark-card)',
  color: 'var(--text)',
  fontSize: '1rem',
  cursor: 'pointer',
  width: '100%',
  maxWidth: '200px'
};