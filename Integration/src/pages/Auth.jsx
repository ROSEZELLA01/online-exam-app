import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { errMsg } from '../api';
import { useToast } from '../ui.jsx';

function AuthForm({ register: isReg }) {
  const { user, login, register } = useAuth();
  const toast = useToast();
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'student' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (isReg && f.password.length < 6) return setError('Use a password with at least 6 characters.');
    setBusy(true);
    try {
      await (isReg ? register(f) : login({ email: f.email, password: f.password }));
      toast.success(isReg ? 'Account created.' : 'Welcome back.');
    } catch (err) { setError(errMsg(err)); setBusy(false); }
  };

  return (
    <form className="panel narrow" onSubmit={submit}>
      <h1>{isReg ? 'Create your account' : 'Log in'}</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {isReg && <label>Full name<input required autoComplete="name" value={f.name} onChange={set('name')} /></label>}
      <label>Email<input required type="email" autoComplete="email" value={f.email} onChange={set('email')} /></label>
      <label>Password
        <input required type={show ? 'text' : 'password'} autoComplete={isReg ? 'new-password' : 'current-password'} value={f.password} onChange={set('password')} />
      </label>
      <label className="check"><input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Show password</label>
      {isReg && (
        <label>I am a
          <select value={f.role} onChange={set('role')}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      )}
      <button className="btn" disabled={busy}>{busy ? 'Please wait…' : isReg ? 'Create account' : 'Log in'}</button>
      <p className="muted">{isReg ? <>Have an account? <Link to="/login">Log in</Link></> : <>New here? <Link to="/register">Create an account</Link></>}</p>
    </form>
  );
}
export const Login = () => <AuthForm />;
export const Register = () => <AuthForm register />;
