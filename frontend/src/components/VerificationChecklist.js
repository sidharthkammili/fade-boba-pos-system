import React from 'react';

export default function VerificationChecklist({
  plan,
  results,
  onStatusChange,
  onNotesChange,
  onOpenTarget,
  onExportMarkdown,
  onExportJson,
}) {
  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{plan.title}</h2>
          <p style={styles.subtitle}>
            Use this checklist while testing the real view at <code>{plan.route}</code>.
          </p>
        </div>

        <div style={styles.actions}>
          <button onClick={onOpenTarget}>Open View</button>
          <button onClick={onExportMarkdown}>Export Markdown</button>
          <button onClick={onExportJson}>Export JSON</button>
        </div>
      </div>

      <div style={styles.list}>
        {plan.items.map((item) => {
          const itemResult = results[item.id] || { status: 'not-tested', notes: '' };

          return (
            <div key={item.id} style={styles.item}>
              <div style={styles.itemTop}>
                <div>
                  <h3 style={styles.itemTitle}>{item.label}</h3>
                  <p style={styles.itemExpected}>{item.expected}</p>
                </div>

                <div style={styles.statusGroup}>
                  {['pass', 'fail', 'not-tested'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      aria-pressed={itemResult.status === status}
                      onClick={() => onStatusChange(item.id, status)}
                      style={{
                        ...styles.statusButton,
                        ...(itemResult.status === status ? styles.activeStatus : {}),
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={itemResult.notes}
                placeholder="Add evidence, notes, screenshots, bugs, or repro steps here..."
                onChange={(e) => onNotesChange(item.id, e.target.value)}
                style={styles.notes}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  card: { display: 'flex', flexDirection: 'column', gap: '16px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  title: { fontSize: '1.35rem', fontWeight: 700, marginBottom: '4px' },
  subtitle: { color: 'var(--text-muted)' },
  actions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  item: {
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px',
    background: 'var(--surface-muted)',
  },
  itemTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  itemTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '4px' },
  itemExpected: { color: 'var(--text-muted)' },
  statusGroup: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-start' },
  statusButton: {
    background: 'var(--dark)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
  },
  activeStatus: {
    background: 'var(--purple)',
    color: 'white',
  },
  notes: {
    minHeight: '90px',
    resize: 'vertical',
  },
};