import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Exams from "./pages/Exams";
import Instructions from "./pages/Instructions";
import Exam from "./pages/Exam";
import Profile from "./pages/Profile";
import Results from "./pages/Results";
import ProtectedRoute from "./pages/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LANDING PAGE */}
        <Route path="/" element={<Landing />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* EXAMS */}
        <Route
          path="/exams"
          element={
            <ProtectedRoute>
              <Exams />
            </ProtectedRoute>
          }
        />

        {/* EXAM INSTRUCTIONS */}
        <Route
          path="/instructions/:examId"
          element={
            <ProtectedRoute>
              <Instructions />
            </ProtectedRoute>
          }
        />

        {/* EXAM */}
        <Route
          path="/exam/:examId"
          element={
            <ProtectedRoute>
              <Exam />
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* RESULTS */}
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;