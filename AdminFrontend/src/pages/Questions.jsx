import { useState } from "react";
import Topbar from "../components/Topbar";

function Questions() {

  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "What is photosynthesis?",
      subject: "Biology",
      optionA: "Production of food by plants",
      optionB: "Breathing in animals",
      optionC: "Movement of water",
      optionD: "Cell division",
      answer: "A",
      marks: 2
    },
    {
      id: 2,
      question: "What is the atomic number of Carbon?",
      subject: "Chemistry",
      optionA: "4",
      optionB: "6",
      optionC: "8",
      optionD: "12",
      answer: "B",
      marks: 2
    }
  ]);


  const [showForm, setShowForm] = useState(false);

  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("");

  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");

  const [answer, setAnswer] = useState("A");

  const [marks, setMarks] = useState(1);

  const [search, setSearch] = useState("");


  const addQuestion = (event) => {

    event.preventDefault();

    if (
      !question.trim() ||
      !subject.trim() ||
      !optionA.trim() ||
      !optionB.trim() ||
      !optionC.trim() ||
      !optionD.trim()
    ) {

      alert(
        "Please complete the question and all options."
      );

      return;

    }


    const newQuestion = {

      id: Date.now(),

      question,

      subject,

      optionA,

      optionB,

      optionC,

      optionD,

      answer,

      marks: Number(marks)

    };


    setQuestions([
      ...questions,
      newQuestion
    ]);


    setQuestion("");
    setSubject("");

    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");

    setAnswer("A");

    setMarks(1);

    setShowForm(false);

  };


  const deleteQuestion = (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (confirmed) {

      setQuestions(
        questions.filter(
          (item) => item.id !== id
        )
      );

    }

  };


  const filteredQuestions =
    questions.filter(
      (item) =>
        item.question
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        item.subject
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );


  return (
    <main className="main-content">

      <Topbar
        title="Questions"
        description="Create and manage exam questions"
      />


      <section className="dashboard-card">

        <div className="card-header">

          <h2>
            Question Bank
          </h2>

          <button
            className="primary-button"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            {showForm
              ? "Cancel"
              : "+ Add Question"}
          </button>

        </div>


        <input
          className="search-input"
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />


        {showForm && (

          <form
            className="question-form"
            onSubmit={addQuestion}
          >

            <div className="form-group">

              <label>
                Question
              </label>

              <textarea
                placeholder="Enter the question"
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value
                  )
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
                  setSubject(
                    event.target.value
                  )
                }
              />

            </div>


            <div className="options-grid">

              <div className="form-group">

                <label>
                  Option A
                </label>

                <input
                  type="text"
                  value={optionA}
                  onChange={(event) =>
                    setOptionA(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Option B
                </label>

                <input
                  type="text"
                  value={optionB}
                  onChange={(event) =>
                    setOptionB(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Option C
                </label>

                <input
                  type="text"
                  value={optionC}
                  onChange={(event) =>
                    setOptionC(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Option D
                </label>

                <input
                  type="text"
                  value={optionD}
                  onChange={(event) =>
                    setOptionD(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Correct Answer
                </label>

                <select
                  value={answer}
                  onChange={(event) =>
                    setAnswer(
                      event.target.value
                    )
                  }
                >

                  <option value="A">
                    Option A
                  </option>

                  <option value="B">
                    Option B
                  </option>

                  <option value="C">
                    Option C
                  </option>

                  <option value="D">
                    Option D
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Marks
                </label>

                <input
                  type="number"
                  min="1"
                  value={marks}
                  onChange={(event) =>
                    setMarks(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>


            <button
              type="submit"
              className="primary-button"
            >
              Save Question
            </button>

          </form>

        )}


        <div className="question-list">

          {filteredQuestions.map(
            (item, index) => (

              <div
                className="question-item"
                key={item.id}
              >

                <div className="question-header">

                  <strong>
                    {index + 1}.{" "}
                    {item.question}
                  </strong>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteQuestion(
                        item.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>


                <p>
                  Subject: {item.subject}
                </p>


                <div className="question-options">

                  <span>
                    A. {item.optionA}
                  </span>

                  <span>
                    B. {item.optionB}
                  </span>

                  <span>
                    C. {item.optionC}
                  </span>

                  <span>
                    D. {item.optionD}
                  </span>

                </div>


                <div className="question-footer">

                  <span>
                    Correct Answer:{" "}
                    {item.answer}
                  </span>

                  <span>
                    Marks: {item.marks}
                  </span>

                </div>

              </div>

            )
          )}

        </div>

      </section>

    </main>
  );
}

export default Questions;