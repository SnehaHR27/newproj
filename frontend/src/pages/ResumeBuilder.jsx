import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] print:bg-white print:text-black text-white font-sans p-6 pb-20 print:p-0">
      <div className="max-w-5xl mx-auto print:max-w-none print:w-full print:m-0">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-6 group no-print"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-sm">Back to Dashboard</span>
        </button>

        <h1 className="text-3xl font-bold mb-8 no-print text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Resume Builder
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-4 no-print bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur">
            <h2 className="text-xl font-bold text-white mb-4">Enter Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 mt-1 outline-none focus:border-cyan-500 transition text-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 mt-1 outline-none focus:border-cyan-500 transition text-sm" placeholder="john@example.com" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 mt-1 outline-none focus:border-cyan-500 transition text-sm" placeholder="(123) 456-7890" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Professional Summary</label>
              <textarea name="summary" value={formData.summary} onChange={handleChange} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 mt-1 outline-none focus:border-cyan-500 transition text-sm" placeholder="Experienced developer with a passion for building scalable web apps..."></textarea>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Experience (One per line)</label>
              <textarea name="experience" value={formData.experience} onChange={handleChange} rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 mt-1 outline-none focus:border-cyan-500 transition text-sm" placeholder="- Software Engineer at Tech Corp (2020-Present)&#10;- Junior Developer at WebStudio (2018-2020)"></textarea>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Education</label>
              <textarea name="education" value={formData.education} onChange={handleChange} rows={2} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 mt-1 outline-none focus:border-cyan-500 transition text-sm" placeholder="B.S. in Computer Science, University Name (2018)"></textarea>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Skills (Comma separated)</label>
              <input name="skills" value={formData.skills} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 mt-1 outline-none focus:border-cyan-500 transition text-sm" placeholder="React, Node.js, TypeScript, MongoDB" />
            </div>

            <button onClick={handleDownload} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all mt-4 shadow-lg shadow-purple-500/20 hover:scale-[1.02]">
              Download as PDF
            </button>
            <p className="text-[10px] text-gray-500 text-center mt-2">When the print dialog opens, select "Save as PDF".</p>
          </div>

          {/* Resume Preview */}
          <div className="bg-white text-black p-10 rounded-2xl shadow-2xl print:shadow-none print:p-0 min-h-[800px] font-serif">
            <div className="border-b-[3px] border-gray-800 pb-6 mb-6">
              <h1 className="text-4xl font-extrabold text-gray-900 uppercase tracking-widest">{formData.name || "Your Name"}</h1>
              <div className="text-sm text-gray-600 mt-3 flex flex-wrap gap-x-6 gap-y-2 font-sans font-medium">
                <span>{formData.email || "email@example.com"}</span>
                <span>•</span>
                <span>{formData.phone || "(123) 456-7890"}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase text-sm tracking-widest font-sans">Summary</h3>
              <p className="text-sm leading-relaxed text-gray-800">{formData.summary || "A brief professional summary showcasing your skills, experiences, and career goals."}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase text-sm tracking-widest font-sans">Experience</h3>
              <ul className="list-outside pl-4 text-sm space-y-2 text-gray-800">
                {formData.experience ? formData.experience.split("\n").map((exp, i) => {
                  const cleaned = exp.replace(/^-/, "").trim();
                  return cleaned ? <li key={i} className="leading-relaxed list-disc">{cleaned}</li> : null;
                }) : <li className="list-disc leading-relaxed">Software Engineer at Tech Corp (2020-Present) - Developed scalable web applications...</li>}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase text-sm tracking-widest font-sans">Education</h3>
              <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">{formData.education || "B.S. in Computer Science, University Name (2018)"}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase text-sm tracking-widest font-sans">Skills</h3>
              <div className="flex flex-wrap gap-2 text-sm font-sans font-medium">
                {formData.skills ? formData.skills.split(",").map((s, i) => s.trim() && <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md border border-gray-200">{s.trim()}</span>) : (
                  <>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md border border-gray-200">React</span>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md border border-gray-200">Node.js</span>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md border border-gray-200">JavaScript</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page { margin: 1cm; }
          body, html { background: white !important; margin: 0; padding: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .bg-\\[\\#0d0d0d\\] { background-color: white !important; }
        }
      `}</style>
    </div>
  );
};

export default ResumeBuilder;
