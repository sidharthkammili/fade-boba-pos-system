import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificationPlans } from '../data/verificationPlans';
import VerificationChecklist from '../components/VerificationChecklist';

const STORAGE_KEY = 'fade_boba_acceptance_checks';

function downloadFile(filename, content, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function QAConsole() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('kiosk');
  const [results, setResults] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  });

  const plan = verificationPlans[selectedPlan];
  const planResults = results[selectedPlan] || {};

  const updateResults = (next) => {
    setResults(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleStatusChange = (itemId, status) => {
    const next = {
      ...results,
      [selectedPlan]: {
        ...planResults,
        [itemId]: {
          ...(planResults[itemId] || {}),
          status,
        },
      },
    };
    updateResults(next);
  };

  const handleNotesChange = (itemId, notes) => {
    const next = {
      ...results,
      [selectedPlan]: {
        ...planResults,
        [itemId]: {
          status: planResults[itemId]?.status || 'not-tested',
          notes,
        },
      },
    };
    updateResults(next);
  };

  const summary = useMemo(() => {
    const values = Object.values(planResults);
    return {
      pass: values.filter((item) => item.status === 'pass').length,
      fail: values.filter((item) => item.status === 'fail').length,
      notTested: plan.items.length - values.filter((item) => item.status).length,
    };
  }, [planResults, plan.items.length]);

  const exportMarkdown = () => {
    const lines = [
      `# ${plan.title}`,
      '',
      `Route tested: ${plan.route}`,
      '',
      ...plan.items.flatMap((item) => {
        const result = planResults[item.id] || { status: 'not-tested', notes: '' };
        return [
          `## ${item.label}`,
          `- Expected: ${item.expected}`,
          `- Status: ${result.status || 'not-tested'}`,
          `- Notes: ${result.notes || 'No notes provided.'}`,
          '',
        ];
      }),
    ];

    downloadFile(
      `${plan.id}-acceptance-checklist.md`,
      lines.join('\n'),
      'text/markdown'
    );
  };

  const exportJson = () => {
    downloadFile(
      `${plan.id}-acceptance-checklist.json`,
      JSON.stringify(planResults, null, 2),
      'application/json'
    );
  };

  return (
    <main className="page" id="main-content" style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 className="page-title">Sprint 3 QA Console</h1>
          <p style={styles.subtitle}>
            Use this internal page to complete acceptance verification for the customer kiosk.
          </p>
        </div>

        <div style={styles.headerActions}>
          <button onClick={() => navigate('/')}>Portal</button>
        </div>
      </header>

      <section className="card" style={styles.summaryCard}>
        <div style={styles.tabs}>
          {Object.entries(verificationPlans).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setSelectedPlan(key)}
              aria-pressed={selectedPlan === key}
              style={{
                ...styles.tab,
                ...(selectedPlan === key ? styles.activeTab : {}),
              }}
            >
              {value.title}
            </button>
          ))}
        </div>

        <div style={styles.summaryRow}>
          <span>Pass: {summary.pass}</span>
          <span>Fail: {summary.fail}</span>
          <span>Not tested: {summary.notTested}</span>
        </div>
      </section>

      <VerificationChecklist
        plan={plan}
        results={planResults}
        onStatusChange={handleStatusChange}
        onNotesChange={handleNotesChange}
        onOpenTarget={() => window.open(plan.route, '_blank', 'noopener,noreferrer')}
        onExportMarkdown={exportMarkdown}
        onExportJson={exportJson}
      />
    </main>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: '20px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  subtitle: { color: 'var(--text-muted)' },
  headerActions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  summaryCard: { display: 'flex', flexDirection: 'column', gap: '16px' },
  tabs: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  tab: {
    background: 'var(--dark)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
  },
  activeTab: {
    background: 'var(--purple)',
    color: 'white',
  },
  summaryRow: { display: 'flex', gap: '16px', flexWrap: 'wrap', fontWeight: 700 },
};