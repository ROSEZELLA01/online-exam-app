export default function CreateQuestion() {
  return <><section className="page-heading"><p className="eyebrow">LECTURER WORKSPACE</p><h1>Question builder</h1><p className="muted">Draft an assessment question for one of your courses.</p></section>
    <form className="panel form-panel" onSubmit={(event) => event.preventDefault()}>
      <div className="panel-heading"><div><h2>New question</h2><p className="muted">Question drafts are a front-end demo for now.</p></div><span className="draft-pill">Draft</span></div>
      <label className="field-label" htmlFor="course">Course</label><select id="course" defaultValue=""><option value="" disabled>Select a course</option><option>BIO 201 · Introduction to Biology</option><option>ECO 104 · Principles of Economics</option><option>MTH 210 · Discrete Mathematics</option></select>
      <label className="field-label" htmlFor="prompt">Question</label><textarea id="prompt" rows="4" placeholder="Write your question here…" />
      <div className="form-two-col"><div><label className="field-label" htmlFor="type">Question type</label><select id="type"><option>Multiple choice</option><option>Short answer</option><option>Essay</option></select></div><div><label className="field-label" htmlFor="points">Points</label><input id="points" type="number" min="1" defaultValue="1" /></div></div>
      <fieldset className="answer-fieldset"><legend className="field-label">Answer options</legend>{['A', 'B', 'C', 'D'].map((option, index) => <div className="option-row" key={option}><span>{option}</span><input aria-label={`Answer option ${option}`} placeholder={`Enter option ${option}`} /><label className="correct-label"><input type="radio" name="correct" defaultChecked={index === 0} /> Correct</label></div>)}</fieldset>
      <div className="form-actions"><button className="button button-outline" type="button">Save draft</button><button className="button button-primary" type="submit">Add question <span aria-hidden="true">→</span></button></div>
    </form>
  </>;
}
