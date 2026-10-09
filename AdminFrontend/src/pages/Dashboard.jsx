import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";

function Dashboard() {
  return (
    <main className="main-content">

      <Topbar
        title="Dashboard"
        description="Welcome back, Admin 👋"
      />

      <section className="stats-grid">

        <StatCard
          icon="👨‍🎓"
          title="Total Students"
          value="1,250"
        />

        <StatCard
          icon="📝"
          title="Total Exams"
          value="48"
        />

        <StatCard
          icon="❓"
          title="Total Questions"
          value="2,450"
        />

        <StatCard
          icon="📈"
          title="Completed Exams"
          value="980"
        />

      </section>

      <section className="dashboard-grid">

        <div className="dashboard-card">

          <div className="card-header">
            <h2>Recent Exams</h2>

            <button className="view-button">
              View All
            </button>
          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Questions</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>Biology Mock Exam</td>
                  <td>50</td>
                  <td>60 mins</td>

                  <td>
                    <span className="status active-status">
                      Active
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>Chemistry Test</td>
                  <td>40</td>
                  <td>45 mins</td>

                  <td>
                    <span className="status active-status">
                      Active
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>Physics Examination</td>
                  <td>60</td>
                  <td>90 mins</td>

                  <td>
                    <span className="status completed-status">
                      Completed
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>English Assessment</td>
                  <td>30</td>
                  <td>30 mins</td>

                  <td>
                    <span className="status draft-status">
                      Draft
                    </span>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>


        <div className="dashboard-card">

          <div className="card-header">
            <h2>Recent Students</h2>
          </div>

          <div className="students-list">

            <div className="student">
              <div className="student-avatar">
                D
              </div>

              <div>
                <strong>Daniel Eturoma</strong>
                <small>daniel@example.com</small>
              </div>
            </div>

            <div className="student">
              <div className="student-avatar">
                J
              </div>

              <div>
                <strong>John Smith</strong>
                <small>john@example.com</small>
              </div>
            </div>

            <div className="student">
              <div className="student-avatar">
                M
              </div>

              <div>
                <strong>Mary Johnson</strong>
                <small>mary@example.com</small>
              </div>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Dashboard;