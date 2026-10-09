import { useState } from "react";
import Topbar from "../components/Topbar";

function Exams() {

  const [exams, setExams] = useState([
    {
      id: 1,
      name: "Biology Mock Exam",
      subject: "Biology",
      questions: 50,
      duration: 60,
      status: "Active"
    },
    {
      id: 2,
      name: "Chemistry Test",
      subject: "Chemistry",
      questions: 40,
      duration: 45,
      status: "Active"
    },
    {
      id: 3,
      name: "Physics Examination",
      subject: "Physics",
      questions: 60,
      duration: 90,
      status: "Completed"
    }
  ]);


  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("Draft");

  const [search, setSearch] = useState("");


  const addExam = (event) => {

    event.preventDefault();

    if (
      !name.trim() ||
      !subject.trim() ||
      !questions ||
      !duration
    ) {

      alert("Please fill in all exam fields.");
      return;

    }


    const newExam = {

      id: Date.now(),

      name,

      subject,

      questions: Number(questions),

      duration: Number(duration),

      status

    };


    setExams([
      ...exams,
      newExam
    ]);


    setName("");
    setSubject("");
    setQuestions("");
    setDuration("");
    setStatus("Draft");

    setShowForm(false);

  };


  const deleteExam = (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this exam?"
    );

    if (confirmed) {

      setExams(
        exams.filter(
          (exam) => exam.id !== id
        )
      );

    }

  };


  const filteredExams = exams.filter(
    (exam) =>
      exam.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      exam.subject
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  return (
    <main className="main-content">

      <Topbar
        title="Exams"
        description="Create and manage examinations"
      />


      <section className="dashboard-card">

        <div className="card-header">

          <h2>All Exams</h2>

          <button
            className="primary-button"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            {showForm
              ? "Cancel"
              : "+ Create Exam"}
          </button>

        </div>


        <input
          className="search-input"
          type="text"
          placeholder="Search exams..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />


        {showForm && (

          <form
            className="exam-form"
            onSubmit={addExam}
          >

            <div className="form-group">

              <label>
                Exam Name
              </label>

              <input
                type="text"
                placeholder="e.g. Biology Mock Exam"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />

            </div>


            <div className="form-group">

              <label>
                Subject
              </label>

              <input
                type="text"
                placeholder="e.g. Biology"
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
              />

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Number of Questions
                </label>

                <input
                  type="number"
                  min="1"
                  value={questions}
                  onChange={(event) =>
                    setQuestions(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Duration (minutes)
                </label>

                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(event) =>
                    setDuration(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>


            <div className="form-group">

              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
              >

                <option value="Draft">
                  Draft
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Completed">
                  Completed
                </option>

              </select>

            </div>


            <button
              type="submit"
              className="primary-button"
            >
              Save Exam
            </button>

          </form>

        )}


        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Exam</th>
                <th>Subject</th>
                <th>Questions</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {filteredExams.map(
                (exam) => (

                  <tr key={exam.id}>

                    <td>
                      {exam.name}
                    </td>

                    <td>
                      {exam.subject}
                    </td>

                    <td>
                      {exam.questions}
                    </td>

                    <td>
                      {exam.duration} mins
                    </td>

                    <td>

                      <span
                        className={
                          exam.status === "Active"
                            ? "status active-status"
                            : exam.status === "Completed"
                            ? "status completed-status"
                            : "status draft-status"
                        }
                      >
                        {exam.status}
                      </span>

                    </td>

                    <td>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteExam(
                            exam.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}

export default Exams;