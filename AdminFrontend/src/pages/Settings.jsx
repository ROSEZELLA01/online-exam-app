import { useState } from "react";
import Topbar from "../components/Topbar";

function Settings() {

  const [name, setName] = useState("Admin");

  const [email, setEmail] =
    useState("admin@example.com");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");


  const saveSettings = (event) => {

    event.preventDefault();

    setMessage(
      "Settings saved successfully."
    );


    setTimeout(() => {
      setMessage("");
    }, 3000);

  };


  return (
    <main className="main-content">

      <Topbar
        title="Settings"
        description="Manage your admin account"
      />


      <section className="dashboard-card">

        <div className="card-header">

          <h2>
            Admin Settings
          </h2>

        </div>


        {message && (

          <div className="success-message">
            {message}
          </div>

        )}


        <form
          className="settings-form"
          onSubmit={saveSettings}
        >

          <div className="form-group">

            <label>
              Admin Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label>
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
            />

          </div>


          <button
            className="primary-button"
            type="submit"
          >
            Save Changes
          </button>

        </form>

      </section>

    </main>
  );
}

export default Settings;