import { useState } from "react";
import Topbar from "../components/Topbar";

function Results() {

  const [results] = useState([
    {
      id: 1,
      student: "Daniel Eturoma",
      exam: "Biology Mock Exam",
      score: 45,
      total: 50
    },
    {
      id: 2,
      student: "John Smith",
      exam: "Chemistry Test",
      score: 32,
      total: 40
    },
    {
      id: 3,
      student: "Mary Johnson",
      exam: "Physics Examination",
      score: 25,
      total: 60
    }
  ]);


  const [search, setSearch] = useState("");


  const filteredResults =
    results.filter(
      (result) =>
        result.student
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        result.exam
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );


  return (
    <main className="main-content">

      <Topbar
        title="Results"
        description="View student examination results"
      />


      <section className="dashboard-card">

        <div className="card-header">

          <h2>
            Exam Results
          </h2>

        </div>


        <input
          className="search-input"
          type="text"
          placeholder="Search results..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />


        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Result</th>
              </tr>

            </thead>


            <tbody>

              {filteredResults.map(
                (result) => {

                  const percentage =
                    (result.score /
                      result.total) *
                    100;

                  const passed =
                    percentage >= 50;


                  return (
                    <tr
                      key={result.id}
                    >

                      <td>
                        {result.student}
                      </td>

                      <td>
                        {result.exam}
                      </td>

                      <td>
                        {result.score} /{" "}
                        {result.total}
                      </td>

                      <td>
                        {percentage.toFixed(0)}%
                      </td>

                      <td>

                        <span
                          className={
                            passed
                              ? "status active-status"
                              : "status draft-status"
                          }
                        >
                          {passed
                            ? "Passed"
                            : "Failed"}
                        </span>

                      </td>

                    </tr>
                  );

                }
              )}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}

export default Results;