import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './Components/AppLayout.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Exams from './Pages/Exams.jsx';
import CreateQuestion from './Pages/CreateQuestion.jsx';
import Results from './Pages/Results.jsx';
import NotFound from './Pages/NotFound.jsx';
import Login from './Pages/Login.jsx';
import Reading from './Pages/Reading.jsx';
import { useAuth } from './Context/AuthContext.jsx';

function RoleRoute({ allowed, children }) {
  const { role } = useAuth();
  if (!role) return <Navigate to="/login" replace />;
  if (!allowed.includes(role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="exams" element={<RoleRoute allowed={['student']}><Exams /></RoleRoute>} />
        <Route path="reading" element={<RoleRoute allowed={['student']}><Reading /></RoleRoute>} />
        <Route path="questions/new" element={<RoleRoute allowed={['lecturer']}><CreateQuestion /></RoleRoute>} />
        <Route path="results" element={<RoleRoute allowed={['lecturer']}><Results /></RoleRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
