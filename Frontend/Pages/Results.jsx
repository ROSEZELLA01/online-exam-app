const results = [
  { course: 'Introduction to Biology', code: 'BIO 201', score: '92%', grade: 'A', date: 'Sep 28, 2026' },
  { course: 'Principles of Economics', code: 'ECO 104', score: '84%', grade: 'B+', date: 'Sep 24, 2026' },
  { course: 'Academic Writing', code: 'ENG 110', score: '88%', grade: 'A', date: 'Sep 18, 2026' },
];

export default function Results() {
  return <><section className="page-heading"><p className="eyebrow">ASSESSMENT RECORD</p><h1>Results</h1><p className="muted">Review published examination results and your progress.</p></section>
    <section className="stats-grid result-stats"><article className="stat-card"><span className="stat-label">Published results</span><strong className="stat-value">12</strong><span className="stat-note">This academic year</span></article><article className="stat-card"><span className="stat-label">Average score</span><strong className="stat-value">86%</strong><span className="stat-note">Across completed exams</span></article><article className="stat-card"><span className="stat-label">Highest score</span><strong className="stat-value">96%</strong><span className="stat-note">Computer Science</span></article></section>
    <section className="panel table-panel"><div className="panel-heading"><div><h2>Recent results</h2><p className="muted">Latest marks released by your lecturers.</p></div></div><div className="result-table"><div className="table-head"><span>COURSE</span><span>DATE</span><span>SCORE</span><span>GRADE</span></div>{results.map((result) => <div className="table-row" key={result.code}><span><strong>{result.course}</strong><small>{result.code}</small></span><span>{result.date}</span><strong>{result.score}</strong><span className="grade-badge">{result.grade}</span></div>)}</div><p className="demo-note">Sample results shown. Connect an API to load published marks.</p></section>
  </>;
}
