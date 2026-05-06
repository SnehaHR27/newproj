import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const AnalyticsDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchInterviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/interviews/user/${user.uid}`);
        const data = await res.json();
        if (data.success) {
          setInterviews(data.interviews);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInterviews();
  }, [user]);

  if (isLoading) {
    return <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white"><span className="w-8 h-8 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></span></div>;
  }

  // Calculate stats
  const totalInterviews = interviews.length;
  const avgScore = totalInterviews > 0 
    ? (interviews.reduce((acc, curr) => acc + curr.score, 0) / totalInterviews).toFixed(1) 
    : 0;
  
  // Format data for chart
  const chartData = interviews.map((inv, idx) => ({
    name: `Int ${idx + 1}`,
    score: inv.score,
    date: new Date(inv.createdAt).toLocaleDateString(),
    role: inv.role
  }));

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans p-6 pb-20 relative">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition group"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="PrepWise" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Analytics
            </h1>
          </div>
        </div>

        {totalInterviews === 0 ? (
          <div className="text-center bg-gray-900/50 border border-gray-800 rounded-2xl p-12">
            <h2 className="text-2xl font-bold mb-3">No Data Yet 📊</h2>
            <p className="text-gray-400 mb-6">Complete your first AI interview to see your performance analytics!</p>
            <button 
              onClick={() => navigate("/practice")}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
            >
              Start Practice Interview
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur">
                <p className="text-sm text-gray-400 font-bold tracking-wider uppercase mb-2">Total Interviews</p>
                <h3 className="text-4xl font-extrabold text-cyan-400">{totalInterviews}</h3>
              </div>
              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur">
                <p className="text-sm text-gray-400 font-bold tracking-wider uppercase mb-2">Average Score</p>
                <h3 className="text-4xl font-extrabold text-purple-400">{avgScore} <span className="text-xl text-gray-500">/10</span></h3>
              </div>
              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur">
                <p className="text-sm text-gray-400 font-bold tracking-wider uppercase mb-2">Latest Role</p>
                <h3 className="text-2xl font-extrabold text-green-400">{interviews[interviews.length - 1].role}</h3>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur">
              <h3 className="text-lg font-bold mb-6">Performance Progression</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                    <YAxis stroke="#9ca3af" domain={[0, 10]} tick={{ fill: '#9ca3af' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }}
                      itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* History Table */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur overflow-hidden">
              <h3 className="text-lg font-bold mb-4">Interview History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="text-xs uppercase bg-gray-800/50 text-gray-300">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Date</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Level</th>
                      <th className="px-4 py-3">Rating</th>
                      <th className="px-4 py-3 rounded-tr-lg text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviews.map((inv, idx) => (
                      <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                        <td className="px-4 py-3">{new Date(inv.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-semibold text-gray-200">{inv.role}</td>
                        <td className="px-4 py-3">{inv.level}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                            inv.score >= 8 ? "bg-green-500/10 text-green-400 border-green-500/20" :
                            inv.score >= 6 ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                            "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          }`}>
                            {inv.rating}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-right text-cyan-400">{inv.score} / 10</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
