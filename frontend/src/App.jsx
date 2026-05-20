import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { Toaster } from "react-hot-toast";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PracticeInterview from "./pages/PracticeInterview";
import ResumeBuilder from "./pages/ResumeBuilder";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import Roadmap from "./pages/Roadmap";
import Preparation from "./pages/Preparation";

// ── Protected Route Wrapper ─────────────────────────────────────
const ProtectedRoute = ({ user, loading, children }) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/sign-in" replace />;
};

// ── Public Route Wrapper (redirect to / if already signed in) ──
const PublicRoute = ({ user, loading, children }) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return user ? <Navigate to="/" replace /> : children;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: "12px",
          },
        }}
      />

      <Routes>
        {/* ── Public Auth Routes ──────────────────────────── */}
        <Route
          path="/sign-in"
          element={
            <PublicRoute user={user} loading={loading}>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <PublicRoute user={user} loading={loading}>
              <Signup />
            </PublicRoute>
          }
        />

        {/* ── Protected Routes ───────────────────────────── */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <PracticeInterview user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-builder"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <AnalyticsDashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmap"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Roadmap user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preparation"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Preparation user={user} />
            </ProtectedRoute>
          }
        />

        {/* ── Catch-all Redirect ─────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
