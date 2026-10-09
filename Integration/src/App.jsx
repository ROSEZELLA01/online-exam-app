import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import { ServerStatus } from './ui.jsx';
import { Login, Register } from './pages/Auth.jsx';
import { ExamList, TakeExam, Result } from './pages/Student.jsx';
import { AdminExams, AddQuestions, ExamResults } from './pages/Admin.jsx';

function Guard({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center muted">Checking your session…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="bar">
      <Link to="/" className="brand">Examination Platform</Link>
      {user && (
        <div className="who">
          <span>{user.name} <small>({user.role})</small></span>
          <button className="btn ghost" onClick={logout}>Log out</button>
        </div>
      )}
    </header>
  );
}

const Home = () => (useAuth().user.role === 'admin' ? <AdminExams /> : <ExamList />);

export default function App() {
  return (
    <>
      <Header />
      <ServerStatus />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Guard><Home /></Guard>} />
          <Route path="/exam/:examId" element={<Guard role="student"><TakeExam /></Guard>} />
          <Route path="/result/:submissionId" element={<Guard><Result /></Guard>} />
          <Route path="/admin/exams/:examId/questions" element={<Guard role="admin"><AddQuestions /></Guard>} />
          <Route path="/admin/exams/:examId/results" element={<Guard role="admin"><ExamResults /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
