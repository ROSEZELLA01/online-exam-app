import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { unwrap, errMsg } from '../api';
import { Pagination, SearchBar, Skeleton, useExams, useToast } from '../ui.jsx';

export function AdminExams() {
  const { q, onSearch, setPage, exams, pagination, loading, error, reload, patch } = useExams();
  const toast = useToast();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: '', description: '', duration: 30, passMarks: 1 });
  const [busy, setBusy] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const create = async (e) => {
    e.preventDefault(); setBusy('create');
    try {
      const d = await unwrap(api.post('/exams', { ...f, duration: +f.duration, passMarks: +f.passMarks }));
      toast.success('Draft created. Now add its questions.');
      nav(`/admin/exams/${d._id}/questions`);
    } catch (err) { toast.error(errMsg(err)); setBusy(''); }
  };
  const toggle = async (x) => {
    if (!x.isPublished && !x.totalMarks) return toast.error('Add questions before publishing this exam.');
    setBusy(x._id);
    try {
      const d = await unwrap(api.patch(`/exams/${x._id}/publish`));
      patch(x._id, { isPublished: d.isPublished });
      toast.success(d.isPublished ? 'Exam published.' : 'Exam unpublished.');
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(''); }
  };

  return (
    <>
      <div className="row between"><h1>Manage exams</h1>
        <button className="btn" onClick={() => setOpen(!open)}>{open ? 'Close form' : 'New exam'}</button></div>
      {open && (
        <form className="panel" onSubmit={create}>
          <h2>New exam draft</h2>
          <label>Title<input required value={f.title} onChange={set('title')} /></label>
          <label>Description<textarea required value={f.description} onChange={set('description')} /></label>
          <div className="row">
            <label>Duration (minutes)<input required type="number" min="1" value={f.duration} onChange={set('duration')} /></label>
            <label>Pass marks<input required type="number" min="0" value={f.passMarks} onChange={set('passMarks')} /></label>
          </div>
          <p className="muted">Total marks are calculated from the questions you add next. Students can't see the exam until you publish it.</p>
          <button className="btn" disabled={busy === 'create'}>{busy === 'create' ? 'Creating…' : 'Create draft'}</button>
        </form>
      )}
      <SearchBar value={q} onChange={onSearch} count={pagination?.totalRecords} />
      {error && <p className="error">{error} <button className="link" onClick={reload}>Try again</button></p>}
      {!exams && loading && <Skeleton />}
      {exams && !exams.length && <p className="empty">{q ? `No exams match "${q}".` : 'No exams yet. Create your first draft with "New exam".'}</p>}
      {exams && (
        <div className={`grid ${loading ? 'dim' : ''}`}>
          {exams.map((x) => (
            <article className="card" key={x._id}>
              <span className={`badge ${x.isPublished ? 'pass' : 'draft'}`}>{x.isPublished ? 'Published' : 'Draft'}</span>
              <h2>{x.title}</h2>
              <p className="desc">{x.description}</p>
              <p className="muted">{x.duration} min · {x.totalMarks} marks · pass at {x.passMarks}</p>
              <div className="row">
                <Link className="btn ghost" to={`/admin/exams/${x._id}/questions`}>Add questions</Link>
                <Link className="btn ghost" to={`/admin/exams/${x._id}/results`}>Results</Link>
                <button className="btn" disabled={busy === x._id} onClick={() => toggle(x)}>{x.isPublished ? 'Unpublish' : 'Publish'}</button>
              </div>
            </article>
          ))}
        </div>
      )}
      <Pagination p={pagination} onPage={setPage} />
    </>
  );
}

const blank = () => ({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, points: 1 });

export function AddQuestions() {
  const { examId } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const [qs, setQs] = useState([blank()]);
  const [busy, setBusy] = useState(false);
  const upd = (i, patch) => setQs((a) => a.map((q, n) => (n === i ? { ...q, ...patch } : q)));
  const setOpt = (i, j, v) => upd(i, { options: qs[i].options.map((o, k) => (k === j ? v : o)) });
  const removeOpt = (i, j) => upd(i, {
    options: qs[i].options.filter((_, k) => k !== j),
    correctOptionIndex: Math.max(0, qs[i].correctOptionIndex - (j <= qs[i].correctOptionIndex && qs[i].correctOptionIndex > 0 ? 1 : 0)),
  });
  const points = qs.reduce((n, q) => n + (+q.points || 1), 0);

  const save = async (e) => {
    e.preventDefault();
    const bad = qs.findIndex((q) => q.options.length < 2 || q.options.some((o) => !o.trim()));
    if (bad >= 0) return toast.error(`Question ${bad + 1} needs at least two options, and none can be empty.`);
    setBusy(true);
    try {
      const d = await unwrap(api.post(`/exams/${examId}/questions`, {
        questions: qs.map((q) => ({ ...q, points: +q.points || 1 })),
      }));
      toast.success(`Added ${d.count} questions. Exam total is now ${d.totalMarks} marks.`);
      nav('/');
    } catch (err) { toast.error(errMsg(err)); setBusy(false); }
  };

  return (
    <form onSubmit={save}>
      <h1>Add questions</h1>
      {qs.map((q, i) => (
        <fieldset className="panel" key={i}>
          <legend>Question {i + 1}</legend>
          <label>Question text<textarea required value={q.questionText} onChange={(e) => upd(i, { questionText: e.target.value })} /></label>
          <p className="muted">Choose the radio button beside the correct answer.</p>
          {q.options.map((o, j) => (
            <div className="row opt-edit" key={j}>
              <input type="radio" aria-label={`Option ${j + 1} is correct`} name={`c${i}`} checked={q.correctOptionIndex === j} onChange={() => upd(i, { correctOptionIndex: j })} />
              <input required placeholder={`Option ${j + 1}`} value={o} onChange={(e) => setOpt(i, j, e.target.value)} />
              {q.options.length > 2 && <button type="button" className="link" onClick={() => removeOpt(i, j)}>Remove</button>}
            </div>
          ))}
          <div className="row">
            <label className="short">Points<input type="number" min="1" value={q.points} onChange={(e) => upd(i, { points: e.target.value })} /></label>
            <button type="button" className="btn ghost" disabled={q.options.length >= 6} onClick={() => upd(i, { options: [...q.options, ''] })}>Add option</button>
            {qs.length > 1 && <button type="button" className="btn ghost" onClick={() => setQs(qs.filter((_, n) => n !== i))}>Remove question</button>}
          </div>
        </fieldset>
      ))}
      <div className="row between sticky-actions">
        <span>{qs.length} {qs.length === 1 ? 'question' : 'questions'} · {points} marks</span>
        <div className="row">
          <button type="button" className="btn ghost" onClick={() => setQs([...qs, blank()])}>Add another question</button>
          <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save questions'}</button>
        </div>
      </div>
    </form>
  );
}

export function ExamResults() {
  const { examId } = useParams();
  const [d, setD] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [text, setText] = useState('');
  const [desc, setDesc] = useState(true);
  useEffect(() => { unwrap(api.get(`/exams/${examId}/results`)).then(setD).catch((e) => setError(errMsg(e))); }, [examId]);

  const rows = useMemo(() => {
    if (!d) return [];
    const t = text.toLowerCase();
    return d.submissions
      .filter((s) => (filter === 'all' || (filter === 'pass') === s.passed) &&
        (!t || s.student.name.toLowerCase().includes(t) || s.student.email.toLowerCase().includes(t)))
      .sort((a, b) => (desc ? b.score - a.score : a.score - b.score));
  }, [d, filter, text, desc]);

  if (error) return <p className="error">{error}</p>;
  if (!d) return <p className="center muted">Loading results…</p>;
  const { exam, analytics: a } = d;

  const exportCsv = () => {
    const lines = [['Name', 'Email', 'Score', 'Total', 'Status', 'Started', 'Submitted']]
      .concat(rows.map((s) => [s.student.name, s.student.email, s.score, s.totalMarks, s.passed ? 'Pass' : 'Fail', s.startedAt, s.submittedAt || '']))
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([lines], { type: 'text/csv' }));
    Object.assign(document.createElement('a'), { href: url, download: `${exam.title}-results.csv` }).click();
    URL.revokeObjectURL(url);
  };
  const when = (s) => new Date(s).toLocaleString();

  return (
    <>
      <Link to="/">Back to exams</Link>
      <h1>{exam.title}</h1>
      <div className="grid stats">
        <div className="card"><p className="muted">Total attempts</p><p className="score">{a.totalAttempts}</p></div>
        <div className="card"><p className="muted">Pass rate</p><p className="score">{a.passRate}</p><p className="muted">{a.passedCount} passed, {a.failedCount} failed</p></div>
        <div className="card"><p className="muted">Average score</p><p className="score">{a.averageScore}<span> / {exam.totalMarks}</span></p><p className="muted">Pass mark {exam.passMarks}</p></div>
      </div>
      <div className="row between">
        <div className="row">
          <input type="search" placeholder="Search student" aria-label="Search student" value={text} onChange={(e) => setText(e.target.value)} />
          <select aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All results</option><option value="pass">Passed</option><option value="fail">Failed</option>
          </select>
        </div>
        <button className="btn ghost" disabled={!rows.length} onClick={exportCsv}>Export CSV</button>
      </div>
      <div className="scroll">
        <table>
          <thead><tr><th>Student</th><th>Email</th>
            <th><button className="link" onClick={() => setDesc(!desc)}>Score {desc ? '▼' : '▲'}</button></th>
            <th>Status</th><th>Started</th><th>Submitted</th><th /></tr></thead>
          <tbody>
            {!rows.length && <tr><td colSpan="7" className="muted">{d.submissions.length ? 'No students match these filters.' : 'No attempts yet.'}</td></tr>}
            {rows.map((s) => (
              <tr key={s.submissionId}>
                <td>{s.student.name}</td><td>{s.student.email}</td><td>{s.score}/{s.totalMarks}</td>
                <td><span className={`badge ${s.passed ? 'pass' : 'fail'}`}>{s.passed ? 'Pass' : 'Fail'}</span></td>
                <td>{when(s.startedAt)}</td><td>{s.submittedAt ? when(s.submittedAt) : 'In progress'}</td>
                <td><Link to={`/result/${s.submissionId}`}>Scorecard</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
