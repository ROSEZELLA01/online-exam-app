import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Exams from "./pages/Exams";
import Questions from "./pages/Questions";
import Results from "./pages/Results";
import Settings from "./pages/Settings";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="admin-container">

        <Sidebar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/results" element={<Results />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
