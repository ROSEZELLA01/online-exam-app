import { Link } from "react-router-dom";

function Profile() {
  const studentName =
    localStorage.getItem("studentName") || "Student";

  const studentId =
    localStorage.getItem("studentId") || "Not available";

  return (
    <div className="page">

      <header className="page-header">

        <div>
          <h1>Student Profile</h1>
          <p>
            View your student information.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="back-link"
        >
          ← Dashboard
        </Link>

      </header>


      <main className="profile-card">

        <div className="profile-avatar">
          👤
        </div>

        <h2>{studentName}</h2>

        <p className="profile-role">
          Student
        </p>


        <div className="profile-details">

          <div className="profile-item">
            <span>Full Name</span>
            <strong>{studentName}</strong>
          </div>


          <div className="profile-item">
            <span>Student ID</span>
            <strong>{studentId}</strong>
          </div>


          <div className="profile-item">
            <span>Email</span>
            <strong>
              {studentId}@student.edu
            </strong>
          </div>


          <div className="profile-item">
            <span>Programme</span>
            <strong>
              Student Programme
            </strong>
          </div>


          <div className="profile-item">
            <span>Institution</span>
            <strong>
              Your University
            </strong>
          </div>

        </div>

      </main>

    </div>
  );
}

export default Profile;