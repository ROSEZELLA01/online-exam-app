import { NavLink } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';

export default function Navbar() {
  const { role, signOut } = useAuth();
  const links = [
    { to: '/', label: 'Overview', end: true },
    ...(role === 'student' ? [{ to: '/exams', label: 'Examinations' }, { to: '/reading', label: 'Read' }] : []),
    ...(role === 'lecturer' ? [{ to: '/questions/new', label: 'Question builder' }, { to: '/results', label: 'Results' }] : []),
  ];

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <NavLink className="brand" to="/" aria-label="Examwise home">
          <span className="brand-mark">E</span><span>examwise</span>
        </NavLink>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        {role ? <div className="profile-chip"><span className="avatar">{role === 'student' ? 'ST' : 'LE'}</span><span className="profile-name">{role === 'student' ? 'Student' : 'Lecturer'}</span><button className="logout-link" onClick={signOut}>Log out</button></div> : <NavLink className="login-nav" to="/login">Login</NavLink>}
      </div>
    </header>
  );
}
