import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { role, signIn } = useAuth();
  const [selectedRole, setSelectedRole] = useState('student');
  const navigate = useNavigate();
  if (role) return <Navigate to="/" replace />;

  function handleSubmit(event) {
    event.preventDefault();
    signIn(selectedRole);
    navigate('/');
  }

  return <section className="login-wrap"><form className="panel login-panel" onSubmit={handleSubmit}>
    <span className="brand-mark login-mark">E</span><p className="eyebrow">WELCOME TO EXAMWISE</p><h1>Sign in to continue</h1>
    <p className="muted login-intro">Choose your account type to open the right workspace.</p>
    <div className="role-picker" aria-label="Account type">
      <button className={`role-option${selectedRole === 'student' ? ' selected' : ''}`} type="button" onClick={() => setSelectedRole('student')}><strong>Student</strong><small>Take exams and read materials</small></button>
      <button className={`role-option${selectedRole === 'lecturer' ? ' selected' : ''}`} type="button" onClick={() => setSelectedRole('lecturer')}><strong>Lecturer</strong><small>Create questions and view results</small></button>
    </div>
    <label className="field-label" htmlFor="email">Email address</label><input className="login-input" id="email" type="email" autoComplete="email" placeholder="you@university.edu" required />
    <label className="field-label" htmlFor="password">Password</label><input className="login-input" id="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
    <button className="button button-primary login-submit" type="submit">Sign in as {selectedRole} <span aria-hidden="true">→</span></button>
    <p className="demo-note login-demo-note">Demo setup: sign-in records the selected role in this browser. Add a backend to verify credentials securely.</p>
  </form></section>;
}
