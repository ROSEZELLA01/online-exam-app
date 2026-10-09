import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        <h2>ExamAdmin</h2>
      </div>

      <nav className="sidebar-nav">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span>📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/students"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span>👨‍🎓</span>
          Students
        </NavLink>

        <NavLink
          to="/exams"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span>📝</span>
          Exams
        </NavLink>

        <NavLink
          to="/questions"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span>❓</span>
          Questions
        </NavLink>

        <NavLink
          to="/results"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span>📈</span>
          Results
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span>⚙️</span>
          Settings
        </NavLink>

      </nav>

      <button className="logout-button">
        🚪 Logout
      </button>

    </aside>
  );
}

export default Sidebar;