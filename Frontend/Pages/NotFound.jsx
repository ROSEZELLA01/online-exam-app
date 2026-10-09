import { Link } from 'react-router-dom';

export default function NotFound() {
  return <section className="empty-state"><span className="empty-icon">?</span><h1>Page not found</h1><p className="muted">That page doesn’t exist or may have moved.</p><Link className="button button-primary" to="/">Back to overview</Link></section>;
}
