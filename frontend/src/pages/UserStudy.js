import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchUsabilityFeedback,
  submitUsabilityFeedback,
} from '../api/api';
import { verificationPlans } from '../data/verificationPlans';

const INTERFACE_OPTIONS = [
  'Customer Kiosk',
  'Cashier POS',
  'Manager Dashboard',
];

export default function UserStudy() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    participantName: '',
    interfaceView: 'Customer Kiosk',
    taskLabel: '',
    taskSuccess: true,
    easeRating: 4,
    completionSeconds: '',
    notes: '',
  });

  const [feedback, setFeedback] = useState([]);
  const [message, setMessage] = useState('');

  const loadFeedback = async () => {
    const data = await fetchUsabilityFeedback();
    setFeedback(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const taskOptions =
    form.interfaceView === 'Customer Kiosk'
      ? verificationPlans.kiosk.items
      : form.interfaceView === 'Cashier POS'
      ? verificationPlans.cashier.items
      : verificationPlans.manager.items;

  const handleSubmit = async (e) => {
    e.preventDefault();

    await submitUsabilityFeedback({
      ...form,
      completionSeconds: form.completionSeconds ? Number(form.completionSeconds) : null,
    });

    setMessage('Feedback saved.');
    setForm((prev) => ({
      ...prev,
      participantName: '',
      taskLabel: '',
      taskSuccess: true,
      easeRating: 4,
      completionSeconds: '',
      notes: '',
    }));

    loadFeedback();
  };

  return (
    <main className="page" id="main-content" style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 className="page-title">Usability Testing Setup & Feedback Collection</h1>
          <p style={styles.subtitle}>
            Use this page during Sprint 3 user testing sessions.
          </p>
        </div>

        <div style={styles.headerActions}>
          <button onClick={() => navigate('/')}>Portal</button>
          <button onClick={() => navigate('/qa')}>QA Console</button>
        </div>
      </header>

      <section className="card">
        <h2 style={styles.sectionTitle}>Participant feedback form</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Participant name or code"
            value={form.participantName}
            onChange={(e) => setForm({ ...form, participantName: e.target.value })}
            required
          />

          <select
            value={form.interfaceView}
            onChange={(e) => setForm({ ...form, interfaceView: e.target.value, taskLabel: '' })}
          >
            {INTERFACE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={form.taskLabel}
            onChange={(e) => setForm({ ...form, taskLabel: e.target.value })}
            required
          >
            <option value="">Select tested task</option>
            {taskOptions.map((task) => (
              <option key={task.id} value={task.label}>
                {task.label}
              </option>
            ))}
          </select>

          <select
            value={String(form.taskSuccess)}
            onChange={(e) =>
              setForm({ ...form, taskSuccess: e.target.value === 'true' })
            }
          >
            <option value="true">Task succeeded</option>
            <option value="false">Task failed</option>
          </select>

          <input
            type="number"
            min="1"
            max="5"
            placeholder="Ease rating (1-5)"
            value={form.easeRating}
            onChange={(e) => setForm({ ...form, easeRating: Number(e.target.value) })}
            required
          />

          <input
            type="number"
            min="0"
            placeholder="Completion time (seconds)"
            value={form.completionSeconds}
            onChange={(e) => setForm({ ...form, completionSeconds: e.target.value })}
          />

          <textarea
            placeholder="Notes, quotes, confusion points, suggested improvements..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button type="submit">Save feedback</button>
        </form>

        {message && <p style={styles.success}>{message}</p>}
      </section>

      <section className="card">
        <h2 style={styles.sectionTitle}>Recent feedback</h2>

        <div style={styles.tableWrap}>
          <table aria-label="Recent usability feedback">
            <thead>
              <tr>
                <th scope="col">Participant</th>
                <th scope="col">Interface</th>
                <th scope="col">Task</th>
                <th scope="col">Success</th>
                <th scope="col">Ease</th>
                <th scope="col">Time</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((row) => (
                <tr key={row.feedback_id}>
                  <td>{row.participant_name}</td>
                  <td>{row.interface_view}</td>
                  <td>{row.task_label}</td>
                  <td>{row.task_success ? 'Yes' : 'No'}</td>
                  <td>{row.ease_rating}</td>
                  <td>{row.completion_seconds ?? '—'}</td>
                  <td>{row.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
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
  sectionTitle: { marginBottom: '16px', fontSize: '1.2rem', fontWeight: 700 },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '12px',
  },
  success: { marginTop: '12px', color: 'var(--green)', fontWeight: 700 },
  tableWrap: { overflowX: 'auto' },
};