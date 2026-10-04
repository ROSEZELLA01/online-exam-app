const materials = [
  { title: 'Cell structure and function', course: 'BIO 201 · Introduction to Biology', kind: 'Reading notes', time: '8 min read' },
  { title: 'Supply, demand, and market equilibrium', course: 'ECO 104 · Principles of Economics', kind: 'Course reading', time: '12 min read' },
  { title: 'Logic and set notation', course: 'MTH 210 · Discrete Mathematics', kind: 'Study guide', time: '6 min read' },
];

export default function Reading() {
  return <><section className="page-heading"><p className="eyebrow">STUDENT LIBRARY</p><h1>Course readings</h1><p className="muted">Review study notes and materials shared by your lecturers.</p></section>
    <section className="panel table-panel"><div className="panel-heading"><div><h2>Available materials</h2><p className="muted">Reading materials for your enrolled courses.</p></div></div>
      <div className="exam-list">{materials.map((item) => <article className="exam-row exam-row-large" key={item.title}><span className="course-icon">▤</span><div className="exam-info"><strong>{item.title}</strong><span>{item.course} <i>·</i> {item.kind}</span></div><span className="reading-time">{item.time}</span><button className="button button-outline" type="button">Open reading</button></article>)}</div>
      <p className="demo-note">Sample library entries. Connect your course content service to load real readings.</p>
    </section>
  </>;
}
