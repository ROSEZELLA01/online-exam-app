import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const upcoming = [
  { course: 'Introduction to Biology', code: 'BIO 201', date: 'Today, 10:00 AM', status: 'Open now', tone: 'green' },
  { course: 'Principles of Economics', code: 'ECO 104', date: 'Tomorrow, 1:30 PM', status: 'Scheduled', tone: 'blue' },
  { course: 'Discrete Mathematics', code: 'MTH 210', date: 'Oct 08, 9:00 AM', status: 'Scheduled', tone: 'blue' },
];

export default function Dashboard() {
  const { role } = useAuth();
  if (!role) return <section className="empty-state"><span className="empty-icon">E</span><h1>Welcome to Examwise</h1><p className="muted">Sign in as a student or lecturer to open your workspace.</p><Link className="button button-primary" to="/login">Login <span aria-hidden="true">→</span></Link></section>;
  if (role === 'lecturer') return <><section className="welcome-row"><div><p className="eyebrow">LECTURER WORKSPACE</p><h1>Welcome back, Lecturer <span aria-hidden="true">✦</span></h1><p className="muted">Create assessments and review your students’ performance.</p></div><Link className="button button-primary" to="/questions/new">Create a question <span aria-hidden="true">→</span></Link></section><section className="stats-grid result-stats"><StatCard label="Active courses" value="5" note="Courses you teach" icon="▤"/><StatCard label="Questions drafted" value="18" note="Across your question bank" icon="＋"/><StatCard label="Results to review" value="3" note="Recent exam sessions" icon="◷"/></section><section className="panel quick-panel"><div className="panel-heading"><div><h2>Lecturer tools</h2><p className="muted">Manage assessment content and outcomes.</p></div></div><Link className="quick-link" to="/questions/new"><span className="quick-icon peach">＋</span><span><strong>Create questions</strong><small>Build assessment questions for a course</small></span><span className="chevron">→</span></Link><Link className="quick-link" to="/results"><span className="quick-icon mint">▥</span><span><strong>View results</strong><small>Review published marks and performance</small></span><span className="chevron">→</span></Link></section></>;
  return (
    <>
      <section className="welcome-row">
        <div><p className="eyebrow">MONDAY, OCTOBER 5, 2026</p><h1>Good morning, Jordan <span aria-hidden="true">✦</span></h1><p className="muted">Here’s what’s happening with your learning today.</p></div>
        <Link className="button button-primary" to="/exams">View examinations <span aria-hidden="true">→</span></Link>
      </section>

      <section className="stats-grid" aria-label="Portal summary">
        <StatCard label="Upcoming exams" value="4" note="Next one starts today" icon="◷" />
        <StatCard label="Completed" value="12" note="Across 5 courses" icon="✓" />
        <StatCard label="Average score" value="86%" note="Up 4% this semester" icon="↗" />
        <StatCard label="Available courses" value="6" note="2 with new materials" icon="▤" />
      </section>

      <section className="content-grid">
        <div className="panel exam-panel">
          <div className="panel-heading"><div><h2>Upcoming examinations</h2><p className="muted">Stay ready for what’s next.</p></div><Link className="text-link" to="/exams">See all <span aria-hidden="true">→</span></Link></div>
          <div className="exam-list">
            {upcoming.map((exam) => <article className="exam-row" key={exam.code}>
              <span className="course-icon" aria-hidden="true">{exam.code.startsWith('BIO') ? '⚛' : exam.code.startsWith('ECO') ? '◈' : '⌘'}</span>
              <div className="exam-info"><strong>{exam.course}</strong><span>{exam.code} <i>·</i> {exam.date}</span></div>
              <span className={`status status-${exam.tone}`}><span className="status-dot" />{exam.status}</span>
            </article>)}
          </div>
        </div>

        <aside className="panel quick-panel">
          <div className="panel-heading"><div><h2>Quick access</h2><p className="muted">Pick up where you left off.</p></div></div>
          <Link className="quick-link" to="/exams"><span className="quick-icon lilac">▣</span><span><strong>Take an examination</strong><small>See exams ready for you</small></span><span className="chevron">→</span></Link>
          <Link className="quick-link" to="/questions/new"><span className="quick-icon peach">＋</span><span><strong>Create questions</strong><small>Lecturer question builder</small></span><span className="chevron">→</span></Link>
          <Link className="quick-link" to="/results"><span className="quick-icon mint">▥</span><span><strong>View results</strong><small>Review marks and progress</small></span><span className="chevron">→</span></Link>
        </aside>
      </section>

      <section className="announcement"><span className="announcement-icon">✦</span><div><strong>Exam day tip</strong><p>Make sure your internet connection is stable and keep your student ID nearby before you begin.</p></div><button className="icon-button" aria-label="Dismiss tip">×</button></section>
    </>
  );
}
