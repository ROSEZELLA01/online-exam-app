import { Link } from "react-router-dom";

function Results() {
  const results =
    JSON.parse(localStorage.getItem("examResults")) || [];

  return (
    <div className="page">

      <header className="page-header">

        <div>
          <h1>Exam Results</h1>
          <p>
            View your completed examination results.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="back-link"
        >
          ← Dashboard
        </Link>

      </header>


      {results.length === 0 ? (

        <div className="result-card">

          <h2>No Results Yet</h2>

          <p>
            You have not completed any examinations yet.
          </p>

          <Link
            to="/exams"
            className="primary-button"
          >
            Take an Exam
          </Link>

        </div>

      ) : (

        <div className="results-list">

          {results.map((result, index) => (

            <div
              className="result-card"
              key={index}
            >

              <div className="result-subject">

                <div className="exam-icon">

                  {result.subject === "Biology"
                    ? "🧬"
                    : result.subject === "Chemistry"
                    ? "⚗️"
                    : "⚡"}

                </div>

                <div>

                  <h2>{result.subject}</h2>

                  <p>{result.date}</p>

                </div>

              </div>


              <div className="result-score">

                <strong>
                  {result.score} / {result.total}
                </strong>

                <span>
                  {result.percentage}%
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Results;