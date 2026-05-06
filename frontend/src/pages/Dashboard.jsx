import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import toast from "react-hot-toast";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully.");
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out.");
    }
  };

  const features = [
    {
      icon: "🎙️",
      title: "AI Interview Practice",
      description: "Practice with 10+ job roles, multimodal evaluation, and real-time feedback.",
      color: "cyan",
    },
    {
      icon: "📷",
      title: "Webcam Analysis",
      description: "Get behavior & body language tips from live camera snapshots.",
      color: "purple",
    },
    {
      icon: "📊",
      title: "Detailed Feedback",
      description: "Score breakdowns, filler word tracking, strengths, and corrections.",
      color: "green",
    },
    {
      icon: "🧠",
      title: "Smart Questions",
      description: "Role-specific technical + behavioral questions tailored to your level.",
      color: "blue",
    },
  ];

  const colorMap = {
    cyan: {
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      glow: "group-hover:shadow-cyan-500/20",
    },
    purple: {
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      glow: "group-hover:shadow-purple-500/20",
    },
    green: {
      border: "border-green-500/30",
      bg: "bg-green-500/10",
      text: "text-green-400",
      glow: "group-hover:shadow-green-500/20",
    },
    blue: {
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      glow: "group-hover:shadow-blue-500/20",
    },
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-[-15%] w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-30%] right-[-15%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-gray-800/50 bg-gray-900/30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="PrepWise" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              PrepWise
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-400 hidden sm:block">
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-red-400 transition border border-gray-700 hover:border-red-500/30 px-4 py-2 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full text-cyan-400 text-xs font-semibold mb-6 tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Powered by Gemini AI
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Ace Your Next
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Interview
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Practice with an AI interviewer that evaluates your answers, analyzes body language,
            and provides instant, actionable feedback.
          </p>

          <button
            onClick={() => navigate("/practice")}
            className="relative group inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-105"
          >
            <span className="text-2xl">🎙️</span>
            <span>Start an Interview</span>
            <span className="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => navigate("/practice")}
            className="group p-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:scale-[1.02] cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl mb-4">
              🎙️
            </div>
            <h3 className="font-bold text-lg mb-2 text-cyan-400">AI Interview Practice</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Practice with 10+ job roles, multimodal evaluation, and real-time feedback.</p>
          </div>

          <div
            onClick={() => navigate("/resume-builder")}
            className="group p-6 rounded-2xl border border-purple-500/30 bg-purple-500/10 backdrop-blur transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02] cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl mb-4">
              📄
            </div>
            <h3 className="font-bold text-lg mb-2 text-purple-400">Resume Builder</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Create a professional resume instantly. Fill out your details and download as a PDF.</p>
          </div>

          <div
            onClick={() => navigate("/analytics")}
            className="group p-6 rounded-2xl border border-green-500/30 bg-green-500/10 backdrop-blur transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 hover:scale-[1.02] cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl mb-4">
              📊
            </div>
            <h3 className="font-bold text-lg mb-2 text-green-400">Performance Analytics</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Track your interview scores over time, identify strengths, and view historical feedback.</p>
          </div>

          <div
            onClick={() => navigate("/practice")}
            className="group p-6 rounded-2xl border border-blue-500/30 bg-gray-900/50 backdrop-blur transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02] cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl mb-4">
              🧠
            </div>
            <h3 className="font-bold text-lg mb-2 text-blue-400">Smart Questions</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Role-specific technical + behavioral questions tailored to your experience level.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 text-gray-600 text-xs">
          PrepWise MERN • Built with React, Node.js, Express, MongoDB & Gemini AI
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
