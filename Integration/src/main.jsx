import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth.jsx';
import { ErrorBoundary, ToastProvider } from './ui.jsx';
import App from './App.jsx';
import './styles.css';

// No StrictMode on purpose: its dev double-effect would call POST /start twice.
createRoot(document.getElementById('root')).render(
  <BrowserRouter><ToastProvider><AuthProvider><ErrorBoundary><App /></ErrorBoundary></AuthProvider></ToastProvider></BrowserRouter>
);
