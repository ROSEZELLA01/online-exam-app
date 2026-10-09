import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import api, { unwrap, errMsg, readLS } from "../api";
import {
  Modal,
  Pagination,
  SearchBar,
  Skeleton,
  useExams,
  useToast,
} from "../ui.jsx";

// Saved per student, so a shared browser never shows one student's scores to another.
const resKey = (uid, examId) => `result:${uid}:${examId}`;

export function ExamList() {
  const { user } = useAuth();
  // The student's attempts from the server, keyed by exam id: works on any device.
  const [mine, setMine] = useState(null);
  useEffect(() => {
    unwrap(api.get("/submissions/mine"))
      .then((list) => {
        const done = {},
          pending = {};
        (Array.isArray(list) ? list : []).forEach((a) => {
          const id = a.examId?._id || a.examId;
          (a.status === "submitted" ? done : pending)[id] = a;
        });
        setMine({ done, pending });
      })
      .catch(() => setMine({ done: {}, pending: {} })); // fall back to the local cache
  }, []);
  const { q, onSearch, setPage, exams, pagination, loading, error, reload } =
    useExams();
  return (
    <>
      <h1>Available exams</h1>
      <SearchBar
        value={q}
        onChange={onSearch}
        count={pagination?.totalRecords}
      />
      {error && (
        <p className="error">
          {error}{" "}
          <button className="link" onClick={reload}>
            Try again
          </button>
        </p>
      )}
      {!exams && loading && <Skeleton />}
      {exams && !exams.length && (
        <p className="empty">
          {q
            ? `No exams match "${q}".`
            : "No exams are published yet. Check back soon."}
        </p>
      )}
      {exams && (
        <div className={`grid ${loading ? "dim" : ""}`} aria-busy={loading}>
          {exams.map((x) => {
            const inProgress = !!readLS(`exam:${x._id}`);
            const result = mine?.done[x._id] || readLS(resKey(user._id, x._id));
            return (
              <article className="card" key={x._id}>
                {result && (
                  <span className={`badge ${result.passed ? "pass" : "fail"}`}>
                    Taken
                  </span>
                )}
                <h2>{x.title}</h2>
                <p className="desc">{x.description}</p>
                <dl className="facts">
                  <div>
                    <dt>Time limit</dt>
                    <dd>{x.duration} min</dd>
                  </div>
                  <div>
                    <dt>Total marks</dt>
                    <dd>{x.totalMarks}</dd>
                  </div>
                  <div>
                    <dt>Pass mark</dt>
                    <dd>{x.passMarks}</dd>
                  </div>
                </dl>
                {result && (
                  <p>
                    <b>
                      Your score: {result.score}/{result.totalMarks}
                    </b>{" "}
                    · {result.passed ? "Passed" : "Did not pass"}
                  </p>
                )}
                {result ? (
                  <Link
                    className="btn ghost"
                    to={`/result/${result.submissionId}`}
                  >
                    View scorecard
                  </Link>
                ) : !x.totalMarks ? (
                  <button className="btn" disabled>
                    No questions yet
                  </button>
                ) : !mine ? (
                  <button className="btn" disabled>
                    Checking…
                  </button>
                ) : (
                  <Link className="btn" to={`/exam/${x._id}`}>
                    {inProgress || mine.pending[x._id]
                      ? "Resume exam"
                      : "Start exam"}
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      )}
      <Pagination p={pagination} onPage={setPage} />
    </>
  );
}

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export function TakeExam() {
  const { examId } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const key = `exam:${examId}`;
  // Questions can be fetched only once (POST /start), so cache them to survive a reload.
  const [session, setSession] = useState(() => {
    const c = readLS(key);
    if (c && Array.isArray(c.questions) && c.questions.length) return c;
    localStorage.removeItem(key); // drop stale or malformed cache
    return null;
  });
  const [answers, setAnswers] = useState(() => readLS(`${key}:answers`) || {});
  const [flags, setFlags] = useState(() => readLS(`${key}:flags`) || {});
  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [startError, setStartError] = useState("");
  const started = useRef(false),
    done = useRef(false),
    lastFail = useRef(0),
    warned = useRef({});
  const submitRef = useRef();

  useEffect(() => {
    if (session || started.current) return;
    started.current = true;
    api
      .post(`/submissions/${examId}/start`)
      .then((r) => {
        const d = r.data?.data ?? r.data; // accept the v2 envelope or a bare payload
        if (!d || !Array.isArray(d.questions))
          throw new Error(
            "The server returned an unexpected response for this exam.",
          );
        if (!d.questions.length)
          throw new Error(
            "This exam has no questions yet. Please contact your administrator.",
          );
        // remainingSeconds is set when resuming an attempt (possibly from another device)
        const secs =
          typeof d.remainingSeconds === "number"
            ? d.remainingSeconds
            : (d.durationMinutes || 0) * 60;
        const s = { ...d, endsAt: Date.now() + secs * 1000 };
        save(key, s);
        setSession(s);
      })
      .catch((e) => {
        console.error(
          "Start exam failed:",
          e.response?.status,
          e.response?.data || e,
        );
        setStartError(
          `${errMsg(e)}${e.response ? ` (HTTP ${e.response.status})` : ""}`,
        );
      });
  }, []);

  // Always points at the latest answers, so the timer effect never needs to re-run.
  submitRef.current = async (auto) => {
    if (done.current || !session) return;
    done.current = true;
    setBusy(true);
    setConfirm(false);
    try {
      const body = {
        answers: session.questions
          .filter((q) => answers[q._id] !== undefined)
          .map((q) => ({
            questionId: q._id,
            selectedOptionIndex: answers[q._id],
          })),
      };
      const d = await unwrap(api.post(`/submissions/${examId}/submit`, body));
      ["", ":answers", ":flags"].forEach((s) =>
        localStorage.removeItem(key + s),
      );
      const rec = {
        submissionId: d.submissionId,
        score: d.score,
        totalMarks: d.totalMarks,
        passMarks: d.passMarks,
        passed: d.passed,
      };
      localStorage.setItem(resKey(user._id, examId), JSON.stringify(rec));
      toast.success(
        auto ? "Time's up. Your answers were submitted." : "Exam submitted.",
      );
      nav(`/result/${d.submissionId}`, {
        replace: true,
        state: { summary: rec },
      }); // scorecard shows instantly
    } catch (e) {
      if (
        e.response?.status === 400 &&
        /already|submitted|expired/i.test(errMsg(e))
      ) {
        ["", ":answers", ":flags"].forEach((x) =>
          localStorage.removeItem(key + x),
        );
        toast.info(errMsg(e));
        return nav("/", { replace: true }); // the list will show the finalized score
      }
      done.current = false;
      lastFail.current = Date.now();
      setBusy(false);
      toast.error(errMsg(e));
    }
  };

  useEffect(() => {
    if (!session) return;
    const end =
      session.endsAt ||
      (session.clientStart ||
        new Date(session.startedAt).getTime() ||
        Date.now()) +
        (session.durationMinutes || 0) * 60000;
    const tick = () => {
      const s = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setLeft(s); // React skips the render when the value is unchanged
      if (s === 300 && !warned.current[300]) {
        warned.current[300] = 1;
        toast.info("5 minutes remaining.");
      }
      if (s === 60 && !warned.current[60]) {
        warned.current[60] = 1;
        toast.info("1 minute remaining.");
      }
      if (s === 0 && Date.now() - lastFail.current > 5000)
        submitRef.current(true);
    };
    tick();
    const id = setInterval(tick, 500);
    const leave = (e) => {
      if (!done.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", leave);
    return () => {
      clearInterval(id);
      window.removeEventListener("beforeunload", leave);
    };
  }, [session]);

  if (startError)
    return (
      <div className="panel narrow">
        <h1>
          {/expired/i.test(startError)
            ? "Attempt expired"
            : "Couldn't start the exam"}
        </h1>
        <p className="error" role="alert">
          {startError}
        </p>
        <Link className="btn" to="/">
          Back to exams
        </Link>
      </div>
    );
  if (!session) return <p className="center muted">Starting your exam…</p>;

  const qs = session.questions;
  const q = qs[Math.min(idx, qs.length - 1)];
  const answered = qs.filter((x) => answers[x._id] !== undefined).length;
  const pick = (i) => {
    const n = { ...answers, [q._id]: i };
    setAnswers(n);
    save(`${key}:answers`, n);
  };
  const flag = () => {
    const n = { ...flags, [q._id]: !flags[q._id] };
    setFlags(n);
    save(`${key}:flags`, n);
  };
  const flagged = qs.filter((x) => flags[x._id]).length;

  return (
    <>
      <div className="examhead">
        <div className="progress">
          <span>
            {answered} of {qs.length} answered
          </span>
          <i style={{ width: `${(answered / qs.length) * 100}%` }} />
        </div>
        <strong className="clock" data-low={left !== null && left <= 60}>
          {left === null ? "--:--" : fmt(left)}
        </strong>
      </div>
      <div className="exam-layout">
        <section className="panel qpanel">
          <p className="muted">
            Question {idx + 1} of {qs.length} · {q.points}{" "}
            {q.points === 1 ? "point" : "points"}
          </p>
          <p className="qtext">{q.questionText}</p>
          {q.options.map((o, i) => (
            <label
              className={`opt ${answers[q._id] === i ? "on" : ""}`}
              key={i}
            >
              <input
                type="radio"
                name={q._id}
                checked={answers[q._id] === i}
                onChange={() => pick(i)}
              />
              <span>{o}</span>
            </label>
          ))}
          <div className="row between">
            <button className="btn ghost" onClick={flag}>
              {flags[q._id] ? "Remove flag" : "Flag for review"}
            </button>
            <div className="row">
              <button
                className="btn ghost"
                disabled={idx === 0}
                onClick={() => setIdx(idx - 1)}
              >
                Previous
              </button>
              <button
                className="btn"
                disabled={idx === qs.length - 1}
                onClick={() => setIdx(idx + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </section>
        <aside className="panel palette">
          <h2>Questions</h2>
          <div className="pal">
            {qs.map((x, i) => (
              <button
                key={x._id}
                aria-label={`Question ${i + 1}`}
                aria-current={i === idx}
                className={`${answers[x._id] !== undefined ? "a" : ""} ${flags[x._id] ? "f" : ""}`}
                onClick={() => setIdx(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <p className="muted legend">
            Filled: answered. Outlined in amber: flagged.
          </p>
          <button
            className="btn"
            disabled={busy}
            onClick={() => setConfirm(true)}
          >
            {busy ? "Submitting…" : "Submit exam"}
          </button>
        </aside>
      </div>
      {confirm && (
        <Modal
          title="Submit your exam?"
          onClose={() => setConfirm(false)}
          actions={
            <>
              <button className="btn ghost" onClick={() => setConfirm(false)}>
                Keep working
              </button>
              <button className="btn" onClick={() => submitRef.current(false)}>
                Submit now
              </button>
            </>
          }
        >
          <p>
            You answered {answered} of {qs.length} questions
            {qs.length - answered
              ? `, so ${qs.length - answered} will score zero`
              : ""}
            .{flagged ? ` ${flagged} flagged for review.` : ""} You can't change
            answers after submitting.
          </p>
        </Modal>
      )}
    </>
  );
}

export function Result() {
  const { submissionId } = useParams();
  const { state } = useLocation();
  const { user } = useAuth();
  const nav = useNavigate();
  const [s, setS] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    unwrap(api.get(`/submissions/${submissionId}`))
      .then((d) => {
        setS(d);
        if (user.role === "student") {
          // also backfills the "Taken" tag on the exam list
          localStorage.setItem(
            resKey(user._id, d.examId._id),
            JSON.stringify({
              submissionId,
              score: d.score,
              totalMarks: d.totalMarks,
              passMarks: d.examId.passMarks,
              passed: d.passed,
            }),
          );
        }
      })
      .catch((e) => setError(errMsg(e)));
  }, [submissionId]);

  // Show the score from the submit response right away; the full breakdown fills in when it loads.
  const t = s
    ? {
        title: s.examId.title,
        score: s.score,
        totalMarks: s.totalMarks,
        passed: s.passed,
        passMarks: s.examId.passMarks,
      }
    : state?.summary && { title: "Exam submitted", ...state.summary };
  if (!t)
    return error ? (
      <p className="error">{error}</p>
    ) : (
      <p className="center muted">Loading result…</p>
    );

  const pct = t.totalMarks ? Math.round((t.score / t.totalMarks) * 100) : 0;
  const right = s ? s.answers.filter((a) => a.isCorrect).length : 0;
  return (
    <>
      <section className="panel narrow center">
        <h1>{t.title}</h1>
        <div className="ring" style={{ "--p": pct }}>
          <div>
            <b>{t.score}</b>
            <span>of {t.totalMarks}</span>
          </div>
        </div>
        <span className={`badge ${t.passed ? "pass" : "fail"}`}>
          {t.passed ? "Passed" : "Did not pass"}
        </span>
        <p className="muted">
          {pct}% · pass mark {t.passMarks}
          {s
            ? ` · ${right} correct, ${s.answers.length - right} incorrect`
            : ""}
        </p>
        <div className="row center-row">
          <button className="btn ghost" onClick={() => nav(-1)}>
            Back
          </button>
          <Link className="btn" to="/">
            All exams
          </Link>
        </div>
      </section>
      {error && !s && (
        <p className="error">Couldn't load the question breakdown: {error}</p>
      )}
      {s && (
        <>
          <h2>Question breakdown</h2>
          <ul className="list">
            {s.answers.map((a, i) => (
              <li key={a.questionId}>
                <span>
                  Question {i + 1}{" "}
                  <span className="muted">
                    · you chose option {a.selectedOptionIndex + 1}
                  </span>
                </span>
                <span>
                  <span className={`badge ${a.isCorrect ? "pass" : "fail"}`}>
                    {a.isCorrect ? "Correct" : "Incorrect"}
                  </span>{" "}
                  <b>{a.pointsAwarded}</b> pt
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
