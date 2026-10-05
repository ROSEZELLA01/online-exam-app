import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <header className="landing-header">

        <div className="landing-logo">
          🎓 Exovia
        </div>

        <Link to="/login" className="login-link">
          Student Login
        </Link>

      </header>


      {/* HERO SECTION */}
      <main className="landing-content">

        <div className="landing-text">

          <p className="landing-label">
            ONLINE EXAMINATION SYSTEM
          </p>

          <h1>
            Take your examinations
            <br />
            <span>with confidence.</span>
          </h1>

          <p className="landing-description">
            Exovia provides students with a simple and secure
            platform for taking online examinations and viewing
            their results.
          </p>

          <Link
            to="/login"
            className="primary-button landing-button"
          >
            Get Started →
          </Link>

        </div>


        {/* FEATURES */}
        <div className="landing-features">

          <div className="feature-card">
            <div className="feature-icon">📝</div>

            <h3>Online Exams</h3>

            <p>
              Take your examinations online
              from one convenient platform.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">⏱️</div>

            <h3>Timed Tests</h3>

            <p>
              Complete your examinations
              within the assigned time.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">📊</div>

            <h3>Instant Results</h3>

            <p>
              View your score immediately
              after submitting an exam.
            </p>
          </div>

        </div>

      </main>


      {/* FOOTER */}
      <footer className="landing-footer">
        <p>
          © 2026 Exovia Online Examination System
        </p>
      </footer>

    </div>
  );
}

export default Landing;