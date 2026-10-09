import { Component, createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { unwrap, errMsg } from './api';

/* ---------- Toasts ---------- */
const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((type, text) => {
    const id = Math.random().toString(36).slice(2);
    setItems((a) => [...a, { id, type, text }]);
    setTimeout(() => setItems((a) => a.filter((t) => t.id !== id)), 5000);
  }, []);
  const [api_] = useState(() => ({}));
  api_.success = (t) => push('ok', t);
  api_.error = (t) => push('err', t);
  api_.info = (t) => push('info', t);
  return (
    <ToastCtx.Provider value={api_}>
      {children}
      <div className="toasts" aria-live="polite">
        {items.map((t) => <div key={t.id} className={`toast ${t.type}`}>{t.text}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- Modal ---------- */
export function Modal({ title, children, actions, onClose }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        <div className="row end">{actions}</div>
      </div>
    </div>
  );
}

/* ---------- Server wake-up banner (Render cold starts) ---------- */
export function ServerStatus() {
  const [state, setState] = useState('checking');
  useEffect(() => {
    const slow = setTimeout(() => setState((s) => (s === 'checking' ? 'slow' : s)), 2500);
    api.get('/health').then(() => setState('ok')).catch(() => setState('down')).finally(() => clearTimeout(slow));
    return () => clearTimeout(slow);
  }, []);
  if (state === 'slow') return <div className="banner">Waking up the server. This can take up to 50 seconds after a period of inactivity.</div>;
  if (state === 'down') return <div className="banner bad">Can't reach the server. Check your connection and refresh the page.</div>;
  return null;
}

/* ---------- Helpers ---------- */
export const useDebounced = (value, ms = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
};

export const Skeleton = ({ n = 6 }) => (
  <div className="grid">{Array.from({ length: n }, (_, i) => <div key={i} className="card skel" />)}</div>
);

export function Pagination({ p, onPage }) {
  if (!p || p.totalPages <= 1) return null;
  return (
    <nav className="pager" aria-label="Pagination">
      <button className="btn ghost" disabled={p.currentPage <= 1} onClick={() => onPage(p.currentPage - 1)}>Previous</button>
      <span>Page {p.currentPage} of {p.totalPages}</span>
      <button className="btn ghost" disabled={p.currentPage >= p.totalPages} onClick={() => onPage(p.currentPage + 1)}>Next</button>
    </nav>
  );
}

/* ---------- Paged + searchable exam list (shared by student and admin) ---------- */
export function useExams(limit = 9) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const dq = useDebounced(q);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let stale = false;
    setLoading(true); setError('');
    unwrap(api.get('/exams', { params: { search: dq || undefined, page, limit } }))
      .then((d) => !stale && setData(d))
      .catch((e) => !stale && setError(errMsg(e)))
      .finally(() => !stale && setLoading(false));
    return () => { stale = true; };
  }, [dq, page, tick, limit]);

  return {
    q, onSearch: (v) => { setQ(v); setPage(1); }, page, setPage,
    exams: data?.exams, pagination: data?.pagination, loading, error,
    reload: () => setTick((t) => t + 1),
    patch: (id, fields) => setData((d) => ({ ...d, exams: d.exams.map((x) => (x._id === id ? { ...x, ...fields } : x)) })),
  };
}

export const SearchBar = ({ value, onChange, count }) => (
  <div className="row searchbar">
    <input type="search" placeholder="Search by title or description" aria-label="Search exams" value={value} onChange={(e) => onChange(e.target.value)} />
    {count !== undefined && <span className="muted">{count} {count === 1 ? 'exam' : 'exams'}</span>}
  </div>
);

/* ---------- Error boundary: show the error instead of a blank screen ---------- */
export class ErrorBoundary extends Component {
  state = { err: null };
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err) { console.error(err); }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="panel narrow">
        <h1>Something went wrong</h1>
        <p className="error">{String(this.state.err.message || this.state.err)}</p>
        <a className="btn" href="/">Back to exams</a>
      </div>
    );
  }
}
