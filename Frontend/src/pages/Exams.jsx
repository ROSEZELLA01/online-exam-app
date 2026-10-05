import { Link } from "react-router-dom";

function Exams() {
  const exams = [
    {
      id: "biology",
      name: "Biology",
      icon: "🧬",
      questions: 20,
      duration: "30 Minutes",
    },
    {
      id: "chemistry",
      name: "Chemistry",
      icon: "⚗️",
      questions: 30,
      duration: "40 Minutes",
    },
    {
      id: "physics",
      name: "Physics",
      icon: "⚡",
      questions: 25,
      duration: "35 Minutes",
    },
  ];

  return (
    <div className="page">

      <header className="page-header">

        <div>
          <h1>Available Exams</h1>

          <p>
            Select an examination to continue.
          </p>
        </div>

        <Link to="/dashboard" className="back-link">
          ← Dashboard
        </Link>

      </header>


      <div className="exam-list">

        {exams.map((exam) => (

          <div
            className="exam-card"
            key={exam.id}
          >

            <div className="exam-icon">
              {exam.icon}
            </div>

            <h2>
              {exam.name}
            </h2>

            <p>
              {exam.questions} Questions
            </p>

            <p>
              {exam.duration}
            </p>

            <Link
              to={`/instructions/${exam.id}`}
              className="primary-button"
            >
              View Exam
            </Link>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Exams;