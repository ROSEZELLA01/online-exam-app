import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Dashboard() {
  const [studentName] = useState(
    localStorage.getItem("studentName") || "Student"
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");

    navigate("/login");
  };

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <h2>🎓 Exovia</h2>

        <nav>

          <Link to="/dashboard" className="active">
           🏠 Dashboard
          </Link>

          <Link to="/exams">
            📝 Exams
          </Link>

          <Link to="/results">
            📊 Results
          </Link>

          <Link to="/profile">
            👤 Profile
          </Link>

        </nav>

        <button
          className="logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>


      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOP BAR */}
        <header className="topbar">

          <h3>Student Dashboard</h3>

          <div className="student">
            👤 {studentName}
          </div>

        </header>


        {/* WELCOME */}
        <section className="welcome">

          <h1>
            Welcome, {studentName} 👋
          </h1>

          <p>
            Here's what's happening with your examinations.
          </p>

        </section>


        {/* STATISTICS */}
        <section className="stats">

          <div className="stat-card">
            <span>Available Exams</span>
            <h2>3</h2>
          </div>

          <div className="stat-card">
            <span>Completed Exams</span>
            <h2>2</h2>
          </div>

          <div className="stat-card">
            <span>Average Score</span>
            <h2>85%</h2>
          </div>

        </section>


        {/* AVAILABLE EXAMS */}
        <section>

          <div className="section-header">

            <h2>Available Exams</h2>

            <Link to="/exams">
              View all →
            </Link>

          </div>


          <div className="exam-list">

            {/* BIOLOGY */}
            <div className="exam-card">

              <div className="exam-icon">
                🧬
              </div>

              <h3>Biology</h3>

              <p>
                20 Questions • 30 Minutes
              </p>

              <Link
                to="/instructions/biology"
                className="primary-button"
              >
                View Exam
              </Link>

            </div>


            {/* CHEMISTRY */}
            <div className="exam-card">

              <div className="exam-icon">
                ⚗️
              </div>

              <h3>Chemistry</h3>

              <p>
                30 Questions • 40 Minutes
              </p>

              <Link
                to="/instructions/chemistry"
                className="primary-button"
              >
                View Exam
              </Link>

            </div>


            {/* PHYSICS */}
            <div className="exam-card">

              <div className="exam-icon">
                ⚡
              </div>

              <h3>Physics</h3>

              <p>
                25 Questions • 35 Minutes
              </p>

              <Link
                to="/instructions/physics"
                className="primary-button"
              >
                View Exam
              </Link>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;
       