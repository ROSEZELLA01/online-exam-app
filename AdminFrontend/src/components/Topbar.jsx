function Topbar({ title, description }) {
  return (
    <header className="topbar">

      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="admin-profile">

        <div className="profile-picture">
          A
        </div>

        <div>
          <strong>Admin</strong>
          <small>Administrator</small>
        </div>

      </div>

    </header>
  );
}

export default Topbar;