const exams = [
  { title: 'Introduction to Biology', code: 'BIO 201', date: 'Oct 05, 2026 · 10:00 AM', duration: '90 minutes', state: 'Open now', tone: 'green' },
  { title: 'Principles of Economics', code: 'ECO 104', date: 'Oct 06, 2026 · 1:30 PM', duration: '60 minutes', state: 'Upcoming', tone: 'blue' },
  { title: 'Discrete Mathematics', code: 'MTH 210', date: 'Oct 08, 2026 · 9:00 AM', duration: '120 minutes', state: 'Upcoming', tone: 'blue' },
];

export default function Exams() {
  return <><section className="page-heading"><p className="eyebrow">STUDENT PORTAL</p><h1>Examinations</h1><p className="muted">Your scheduled and available assessments.</p></section>
    <section className="panel table-panel"><div className="panel-heading"><div><h2>My examinations</h2><p className="muted">Check the schedule and exam duration.</p></div><span className="count-pill">{exams.length} exams</span></div>
      <div className="exam-list">{exams.map((exam) => <article className="exam-row exam-row-large" key={exam.code}><span className="course-icon">▣</span><div className="exam-info"><strong>{exam.title}</strong><span>{exam.code} <i>·</i> {exam.date} <i>·</i> {exam.duration}</span></div><span className={`status status-${exam.tone}`}><span className="status-dot" />{exam.state}</span><button className="button button-outline" disabled={exam.state !== 'Open now'}>{exam.state === 'Open now' ? 'Start exam' : 'View details'}</button></article>)}</div>
      <p className="demo-note">Exam launch will connect to your secure examination flow.</p>
    </section>
  </>;
}
