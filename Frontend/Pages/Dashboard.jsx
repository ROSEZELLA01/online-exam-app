import { Link } from 'react-router-dom';
import StatCard from '../Components/StatCard.jsx';
import { useAuth } from '../Context/AuthContext.jsx';

const upcoming = [
  { course: 'Introduction to Biology', code: 'BIO 201', date: 'Today, 10:00 AM', status: 'Open now', tone: 'green' },
  { course: 'Principles of Economics', code: 'ECO 104', date: 'Tomorrow, 1:30 PM', status: 'Scheduled', tone: 'blue' },
  { course: 'Discrete Mathematics', code: 'MTH 210', date: 'Oct 08, 9:00 AM', status: 'Scheduled', tone: 'blue' },
];

export default function Dashboard() {
  const { role } = useAuth();
  if (!role) return <section className="empty-state"><span className="empty-icon">E</span><h1>Welcome to Examwise</h1><p className="muted">Sign in as a student or lecturer to open your workspace.</p><Link className="button button-primary" to="/login">Login <span aria-hidden="true">â†’</span></Link></section>;
  if (role === 'lecturer') return <><section className="welcome-row"><div><p className="eyebrow">LECTURER WORKSPACE</p><h1>Welcome back, Lecturer <span aria-hidden="true">âœ¦</span></h1><p className="muted">Create assessments and review your studentsâ€™ performance.</p></div><Link className="button button-primary" to="/questions/new">Create a question <span aria-hidden="true">â†’</span></Link></section><section className="stats-grid result-stats"><StatCard label="Active courses" value="5" note="Courses you teach" icon="â–¤"/><StatCard label="Questions drafted" value="18" note="Across your question bank" icon="ï¼‹"/><StatCard label="Results to review" value="3" note="Recent exam sessions" icon="â—·"/></section><section className="panel quick-panel"><div className="panel-heading"><div><h2>Lecturer tools</h2><p className="muted">Manage assessment content and outcomes.</p></div></div><Link className="quick-link" to="/questions/new"><span className="quick-icon peach">ï¼‹</span><span><strong>Create questions</strong><small>Build assessment questions for a course</small></span><span className="chevron">â†’</span></Link><Link className="quick-link" to="/results"><span className="quick-icon mint">â–¥</span><span><strong>View results</strong><small>Review published marks and performance</small></span><span className="chevron">â†’</span></Link></section></>;
  return (
    <>
      <section className="welcome-row">
        <div><p className="eyebrow">MONDAY, OCTOBER 5, 2026</p><h1>Good morning, Jordan <span aria-hidden="true">âœ¦</span></h1><p className="muted">Hereâ€™s whatâ€™s happening with your learning today.</p></div>
        <Link className="button button-primary" to="/exams">View examinations <span aria-hidden="true">â†’</span></Link>
      </section>

      <section className="stats-grid" aria-label="Portal summary">
        <StatCard label="Upcoming exams" value="4" note="Next one starts today" icon="â—·" />
        <StatCard label="Completed" value="12" note="Across 5 courses" icon="âœ“" />
        <StatCard label="Average score" value="86%" note="Up 4% this semester" icon="â†—" />
        <StatCard label="Available courses" value="6" note="2 with new materials" icon="â–¤" />
      </section>

      <section className="content-grid">
        <div className="panel exam-panel">
          <div className="panel-heading"><div><h2>Upcoming examinations</h2><p className="muted">Stay ready for whatâ€™s next.</p></div><Link className="text-link" to="/exams">See all <span aria-hidden="true">â†’</span></Link></div>
          <div className="exam-list">
            {upcoming.map((exam) => <article className="exam-row" key={exam.code}>
              <span className="course-icon" aria-hidden="true">{exam.code.startsWith('BIO') ? 'âš›' : exam.code.startsWith('ECO') ? 'â—ˆ' : 'âŒ˜'}</span>
              <div className="exam-info"><strong>{exam.course}</strong><span>{exam.code} <i>Â·</i> {exam.date}</span></div>
              <span className={`status status-${exam.tone}`}><span className="status-dot" />{exam.status}</span>
            </article>)}
          </div>
        </div>

        <aside className="panel quick-panel">
          <div className="panel-heading"><div><h2>Quick access</h2><p className="muted">Pick up where you left off.</p></div></div>
          <Link className="quick-link" to="/exams"><span className="quick-icon lilac">â–£</span><span><strong>Take an examination</strong><small>See exams ready for you</small></span><span className="chevron">â†’</span></Link>
          <Link className="quick-link" to="/questions/new"><span className="quick-icon peach">ï¼‹</span><span><strong>Create questions</strong><small>Lecturer question builder</small></span><span className="chevron">â†’</span></Link>
          <Link className="quick-link" to="/results"><span className="quick-icon mint">â–¥</span><span><strong>View results</strong><small>Review marks and progress</small></span><span className="chevron">â†’</span></Link>
        </aside>
      </section>

      <section className="announcement"><span className="announcement-icon">âœ¦</span><div><strong>Exam day tip</strong><p>Make sure your internet connection is stable and keep your student ID nearby before you begin.</p></div><button className="icon-button" aria-label="Dismiss tip">Ã—</button></section>
    </>
  );
}
