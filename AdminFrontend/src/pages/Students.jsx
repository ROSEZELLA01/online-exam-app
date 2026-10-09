import { useState } from "react";
import Topbar from "../components/Topbar";

function Students() {

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Daniel Eturoma",
      email: "daniel@example.com",
      examsTaken: 8,
      status: "Active"
    },
    {
      id: 2,
      name: "John Smith",
      email: "john@example.com",
      examsTaken: 5,
      status: "Active"
    },
    {
      id: 3,
      name: "Mary Johnson",
      email: "mary@example.com",
      examsTaken: 12,
      status: "Active"
    }
  ]);

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");

  const addStudent = (event) => {

    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Please enter the student's name and email.");
      return;
    }

    const newStudent = {
      id: Date.now(),
      name,
      email,
      examsTaken: 0,
      status: "Active"
    };

    setStudents([...students, newStudent]);

    setName("");
    setEmail("");
    setShowForm(false);
  };


  const deleteStudent = (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (confirmed) {

      setStudents(
        students.filter(
          (student) => student.id !== id
        )
      );

    }

  };


  const filteredStudents = students.filter(
    (student) =>
      student.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      student.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  return (
    <main className="main-content">

      <Topbar
        title="Students"
        description="Manage registered students"
      />


      <section className="dashboard-card">

        <div className="card-header">

          <h2>All Students</h2>

          <button
            className="primary-button"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            {showForm
              ? "Cancel"
              : "+ Add Student"}
          </button>

        </div>


        <input
          className="search-input"
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />


        {showForm && (

          <form
            className="student-form"
            onSubmit={addStudent}
          >

            <div className="form-group">

              <label>
                Student Name
              </label>

              <input
                type="text"
                placeholder="Enter student name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />

            </div>


            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="Enter student email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />

            </div>


            <button
              type="submit"
              className="primary-button"
            >
              Save Student
            </button>

          </form>

        )}


        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Exams Taken</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {filteredStudents.map(
                (student) => (

                  <tr key={student.id}>

                    <td>
                      {student.name}
                    </td>

                    <td>
                      {student.email}
                    </td>

                    <td>
                      {student.examsTaken}
                    </td>

                    <td>

                      <span className="status active-status">
                        {student.status}
                      </span>

                    </td>

                    <td>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteStudent(
                            student.id
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

export default Students;