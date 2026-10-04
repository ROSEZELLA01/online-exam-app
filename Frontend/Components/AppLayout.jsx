import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container"><Outlet /></main>
      <footer className="site-footer">Examwise <span>·</span> Learning starts with a fair assessment.</footer>
    </div>
  );
}
