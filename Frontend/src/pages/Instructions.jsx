import { Link, useParams } from "react-router-dom";

const examData = {
  biology: {
    name: "Biology",
    questions: 20,
    minutes: 30,
  },

  chemistry: {
    name: "Chemistry",
    questions: 30,
    minutes: 40,
  },

  physics: {
    name: "Physics",
    questions: 25,
    minutes: 35,
  },
};

function Instructions() {
  const { examId } = useParams();

  const exam = examData[examId];

  if (!exam) {
    return (
      <div className="instructions-page">

        <div className="instructions-card">

          <h1>
            Exam Not Found
          </h1>

          <p>
            The examination you are looking for does not exist.
          </p>

          <Link
            to="/exams"
            className="primary-button"
          >
            Back to Exams
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="instructions-page">

      <div className="instructions-card">

        {/* BACK BUTTON */}
        <Link
          to="/exams"
          className="back-link"
        >
          ← Back to Exams
        </Link>


        {/* TITLE */}
        <h1>
          {exam.name} Examination
        </h1>

        <p className="instruction-subtitle">
          Please read the instructions carefully before
          starting your examination.
        </p>


        {/* EXAM INFORMATION */}
        <div className="exam-info">

          <div>
            <strong>
              {exam.questions}
            </strong>

            <span>
              Questions
            </span>
          </div>


          <div>
            <strong>
              {exam.minutes}
            </strong>

            <span>
              Minutes
            </span>
          </div>


          <div>
            <strong>
              {exam.questions}
            </strong>

            <span>
              Total Marks
            </span>
          </div>

        </div>


        {/* INSTRUCTIONS */}
        <h2>
          Instructions
        </h2>

        <ul className="instructions-list">

          <li>
            Answer all questions.
          </li>

          <li>
            You have {exam.minutes} minutes to complete
            the examination.
          </li>

          <li>
            Each question has only one correct answer.
          </li>

          <li>
            You can move between questions before
            submitting.
          </li>

          <li>
            Your answers are saved while you move
            between questions.
          </li>

          <li>
            Do not refresh the page during the
            examination.
          </li>

          <li>
            Make sure you submit your examination
            before the time expires.
          </li>

        </ul>


        {/* ACTION BUTTONS */}
        <div className="instruction-actions">

          <Link
            to="/exams"
            className="secondary-button"
          >
            Cancel
          </Link>


          <Link
            to={`/exam/${examId}`}
            className="primary-button"
          >
            Start {exam.name} →
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Instructions;