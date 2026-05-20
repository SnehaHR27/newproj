import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TipsTricks = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("star");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingText, setBreathingText] = useState("Ready");
  const [breathingPhase, setBreathingPhase] = useState("idle"); // idle, inhale, hold, exhale

  // Quotes Array
  const motivationalQuotes = [
    {
      text: "You don't have to be perfect to be amazing. Believe in your preparation, trust your skills, and let your passion shine through.",
      author: "PrepWise Coach",
    },
    {
      text: "An interview is not a test of your worth, but a mutual exploration of alignment. Go in as an equal partner in the conversation.",
      author: "Tech Industry Mentor",
    },
    {
      text: "Preparation is the mother of confidence. You have practiced, you have refined your answers, and you are ready for this.",
      author: "Career Advisor",
    },
    {
      text: "Your unique blend of experiences, skills, and perspectives is your superpower. Nobody else can tell your story but you.",
      author: "Leadership Expert",
    },
    {
      text: "Confidence comes not from always being right, but from not fearing to be wrong. Show them how you think, how you learn, and how you grow.",
      author: "Senior Software Engineer",
    },
    {
      text: "Focus on your strengths, own your growth areas, and speak with authenticity. The right company will value your honesty.",
      author: "Tech Recruiter",
    },
  ];

  // Breathing Exercise Cycle
  useEffect(() => {
    let timer;
    if (isBreathing) {
      const cycle = () => {
        // Inhale for 4 seconds
        setBreathingText("Inhale Deeply...");
        setBreathingPhase("inhale");
        
        timer = setTimeout(() => {
          // Hold for 4 seconds
          setBreathingText("Hold...");
          setBreathingPhase("hold");
          
          timer = setTimeout(() => {
            // Exhale for 4 seconds
            setBreathingText("Exhale Slowly...");
            setBreathingPhase("exhale");
            
            timer = setTimeout(() => {
              // Repeat
              cycle();
            }, 4000);
          }, 4000);
        }, 4000);
      };
      
      cycle();
    } else {
      setBreathingText("Ready to Start");
      setBreathingPhase("idle");
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [isBreathing]);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
  };

  const checklistItems = {
    twentyFourHours: [
      { id: "c1", text: "Research the company's latest achievements, products, and culture." },
      { id: "c2", text: "Review the job description and map 3 of your key projects to their core requirements." },
      { id: "c3", text: "Prepare 3 thoughtful questions to ask the interviewer about team culture, roadmap, or engineering challenges." },
      { id: "c4", text: "Double-check your interview time, timezone, and calendar link." },
    ],
    threeHours: [
      { id: "c5", text: "Test your internet connection, webcam, and microphone." },
      { id: "c6", text: "Ensure your interview environment has clear lighting and is free from background noise." },
      { id: "c7", text: "Have a digital and physical copy of your resume within arms reach." },
      { id: "c8", text: "Dress professionally (at least from the waist up for virtual interviews!)." },
    ],
    fifteenMinutes: [
      { id: "c9", text: "Close all unrelated tabs on your browser and silence your phone." },
      { id: "c10", text: "Pour a glass of water to keep nearby during the interview." },
      { id: "c11", text: "Do a 2-minute breathing exercise (use the tool below!) to calm your nervous system." },
      { id: "c12", text: "Smile, roll your shoulders back, and remind yourself: 'I am fully capable.'" },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans p-6 pb-20 relative overflow-x-hidden">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition group"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="PrepWise" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Tips & Tricks
            </h1>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full text-orange-400 text-xs font-semibold mb-4 tracking-wider uppercase">
            💡 Crack Any Interview
          </span>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Your Ultimate Pre-Interview Guidebook 🎯
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Equip yourself with proven communication frameworks, high-impact prep lists, golden guidelines, and tools to calm your mind before you step into the interview.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10 bg-gray-900/40 p-2 rounded-2xl border border-gray-800/80 max-w-3xl mx-auto backdrop-blur-md">
          <button
            onClick={() => setActiveTab("star")}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === "star"
                ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/20"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            ⭐ STAR Method
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === "rules"
                ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/20"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            🔑 Golden Rules
          </button>
          <button
            onClick={() => setActiveTab("checklist")}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === "checklist"
                ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/20"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            📋 Countdown List
          </button>
          <button
            onClick={() => setActiveTab("calm")}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === "calm"
                ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/20"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            🧘 Motivation & Calm
          </button>
        </div>

        {/* Tab Content Section */}
        <div className="w-full">
          {/* TAB 1: STAR METHODOLOGY */}
          {activeTab === "star" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Method Description */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-8 backdrop-blur shadow-2xl">
                  <h3 className="text-2xl font-bold mb-4 text-orange-400 flex items-center gap-2">
                    <span>⭐</span> The STAR Methodology
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    When interviewers ask behavioral questions like <em>"Tell me about a time you..."</em>, they want to hear a structured narrative. The **STAR method** is the Gold Standard for delivering clear, high-impact behavioral answers that keep interviewers engaged.
                  </p>

                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 rounded-2xl bg-gray-800/30 border border-gray-700/30">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 font-extrabold text-lg flex items-center justify-center shrink-0 border border-orange-500/20">
                        S
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">Situation</h4>
                        <p className="text-gray-400 text-xs">Set the scene. Outline the context, background, and the project or problem you faced. Keep it concise (15% of your answer).</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-2xl bg-gray-800/30 border border-gray-700/30">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 font-extrabold text-lg flex items-center justify-center shrink-0 border border-amber-500/20">
                        T
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">Task</h4>
                        <p className="text-gray-400 text-xs">Describe the objective or responsibility. What needed to be solved, and what were your specific expectations? (15% of your answer).</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-2xl bg-gray-800/30 border border-gray-700/30">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 font-extrabold text-lg flex items-center justify-center shrink-0 border border-yellow-500/20">
                        A
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">Action</h4>
                        <p className="text-gray-400 text-xs">Describe what <strong>you</strong> did. How did you tackle the problem, delegate, or code? Highlight your specific technical/leadership contribution. (50% of your answer).</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-2xl bg-gray-800/30 border border-gray-700/30">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-extrabold text-lg flex items-center justify-center shrink-0 border border-emerald-500/20">
                        R
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">Result</h4>
                        <p className="text-gray-400 text-xs">The climax. What was the outcome? Use data and metrics (e.g., "boosted speed by 30%", "saved $5k"). Explain what you learned. (20% of your answer).</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Practical Example */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-8 backdrop-blur shadow-2xl relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-2">Real-World Case Study</span>
                  <h3 className="text-xl font-bold mb-4 text-white">How to Answer: "Tell me about a time you handled a critical system bug."</h3>
                  
                  <div className="space-y-4 text-sm">
                    <div className="border-l-2 border-orange-500/30 pl-4 py-1">
                      <span className="text-xs font-bold text-orange-400 block mb-1">SITUATION</span>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        "During Black Friday last year, our e-commerce platform experienced a sudden 400% traffic surge. Ten minutes in, checkout page latency spiked, causing 35% of cart completions to timeout."
                      </p>
                    </div>

                    <div className="border-l-2 border-amber-500/30 pl-4 py-1">
                      <span className="text-xs font-bold text-amber-400 block mb-1">TASK</span>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        "As the Lead Engineer on call, my task was to isolate the bottleneck, patch the system without taking the site offline, and recover the lost checkouts as quickly as possible."
                      </p>
                    </div>

                    <div className="border-l-2 border-yellow-500/30 pl-4 py-1">
                      <span className="text-xs font-bold text-yellow-400 block mb-1">ACTION</span>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        "I analyzed our Datadog logs and discovered our database connection pool was saturated because a newly added promo code API wasn't caching queries. I quickly wrote a Redis cache layer configuration middleware, ran a fast test in staging, and deployed the patch. Then, I wrote a script to extract failed cart IDs and automatically emailed users a personalized recovery checkout link."
                      </p>
                    </div>

                    <div className="border-l-2 border-emerald-500/30 pl-4 py-1">
                      <span className="text-xs font-bold text-emerald-400 block mb-1">RESULT</span>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        "Latency dropped back to 200ms within 5 minutes. The Redis caching solved the DB saturation completely. Through the cart recovery scripts, we successfully reclaimed $42,000 in sales, resulting in our team receiving a company-wide commendation."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOLDEN RULES */}
          {activeTab === "rules" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              {/* Virtual Setup Rules */}
              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur hover:border-orange-500/30 transition-all duration-300 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mb-4">
                  💻
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Virtual Setup Rules</h3>
                <ul className="text-gray-400 text-xs space-y-3 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span><strong>Eye-Level Camera:</strong> Elevate your laptop so your camera is level with your eyes. This creates a natural feel and mimics physical eye contact.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span><strong>Front-Facing Light:</strong> Always have lighting in front of you. Avoid bright windows or lightbulbs behind you to prevent being silhouetted.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span><strong>Clean Audio:</strong> Use a dedicated headset/mic over laptop mics if possible. Mute notifications and disable local device alerts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span><strong>Tab Sanitization:</strong> Close private messages, email windows, and distracting browser tabs to prevent accidental notifications when screen-sharing.</span>
                  </li>
                </ul>
              </div>

              {/* Technical / Coding Rules */}
              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur hover:border-amber-500/30 transition-all duration-300 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mb-4">
                  🚀
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Technical Interview Rules</h3>
                <ul className="text-gray-400 text-xs space-y-3 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong>Think Aloud:</strong> Talk through your design, logic, and assumptions. Interviewers care 80% about your problem-solving process, and only 20% about pure syntax.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong>Clarify Requirements First:</strong> Never write code immediately. Ask clarifying questions (e.g., "Are inputs positive numbers?", "Can we assume unique characters?").</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong>Discuss Tradeoffs:</strong> Propose a brute force solution first, discuss its time/space complexity, and then transition to optimizing it.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong>Dry-Run Your Code:</strong> Before saying you're finished, manually trace your code with a simple edge case input (like empty arrays or nulls).</span>
                  </li>
                </ul>
              </div>

              {/* Communication Rules */}
              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur hover:border-yellow-500/30 transition-all duration-300 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center text-2xl mb-4">
                  🗣️
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Communication Rules</h3>
                <ul className="text-gray-400 text-xs space-y-3 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span><strong>Active Listening:</strong> Jot down the interviewer's name and keywords as they ask questions. Never interrupt them mid-sentence.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span><strong>Avoid the 'Rambling' Trap:</strong> Answer directly, then give context. If you feel yourself spinning in circles, stop, smile, and say: "To summarize that point..."</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span><strong>Embrace the Pause:</strong> It's okay to stay silent for 5-10 seconds. Say: "That's an excellent question. Let me take a brief moment to structure my thoughts."</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span><strong>The 'We' vs 'I' Balance:</strong> Use "I" to detail your personal efforts, and "We" to detail the collaborative, team achievement.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: COUNTDOWN CHECKLIST */}
          {activeTab === "checklist" && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
              {/* 24 Hours Before */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur">
                <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-800">
                  <span className="text-xl">📅</span>
                  <h3 className="font-extrabold text-orange-400 text-sm tracking-wider uppercase">24 Hours Before the Interview</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {checklistItems.twentyFourHours.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-gray-800/20 border border-gray-700/10 p-3 rounded-xl">
                      <input type="checkbox" id={item.id} className="w-5 h-5 rounded-lg border-gray-700 text-orange-500 bg-gray-900 focus:ring-0 focus:ring-offset-0 cursor-pointer mt-0.5" />
                      <label htmlFor={item.id} className="text-gray-300 text-xs leading-relaxed cursor-pointer select-none">{item.text}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Hours Before */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur">
                <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-800">
                  <span className="text-xl">⚡</span>
                  <h3 className="font-extrabold text-amber-400 text-sm tracking-wider uppercase">3 Hours Before the Interview</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {checklistItems.threeHours.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-gray-800/20 border border-gray-700/10 p-3 rounded-xl">
                      <input type="checkbox" id={item.id} className="w-5 h-5 rounded-lg border-gray-700 text-amber-500 bg-gray-900 focus:ring-0 focus:ring-offset-0 cursor-pointer mt-0.5" />
                      <label htmlFor={item.id} className="text-gray-300 text-xs leading-relaxed cursor-pointer select-none">{item.text}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 15 Minutes Before */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur">
                <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-800">
                  <span className="text-xl">🧘</span>
                  <h3 className="font-extrabold text-yellow-400 text-sm tracking-wider uppercase">15 Minutes Before the Interview</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {checklistItems.fifteenMinutes.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-gray-800/20 border border-gray-700/10 p-3 rounded-xl">
                      <input type="checkbox" id={item.id} className="w-5 h-5 rounded-lg border-gray-700 text-yellow-500 bg-gray-900 focus:ring-0 focus:ring-offset-0 cursor-pointer mt-0.5" />
                      <label htmlFor={item.id} className="text-gray-300 text-xs leading-relaxed cursor-pointer select-none">{item.text}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MOTIVATION & CALM */}
          {activeTab === "calm" && (
            <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Calmness Breathing Box */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-8 backdrop-blur shadow-2xl flex flex-col items-center justify-between text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">🧘 Pre-Interview Calmer</h3>
                    <p className="text-gray-400 text-xs mb-6 px-4">
                      Anxiety activates your fight-or-flight response. Slow down your heart rate and settle your nerves with this interactive 4-4-4 breathing visualizer.
                    </p>
                  </div>

                  {/* Pulsating Breathing Circle */}
                  <div className="relative w-44 h-44 flex items-center justify-center mb-8">
                    {/* Background glow circle */}
                    <div
                      className={`absolute inset-0 rounded-full transition-all duration-[4000ms] ease-in-out bg-cyan-500/10 ${
                        breathingPhase === "inhale" ? "scale-[1.2] bg-cyan-500/20" :
                        breathingPhase === "hold" ? "scale-[1.2] bg-amber-500/20" :
                        breathingPhase === "exhale" ? "scale-[0.8] bg-cyan-500/5" : "scale-100"
                      }`}
                    />
                    {/* Ring border */}
                    <div
                      className={`absolute inset-2 rounded-full border-2 transition-all duration-[4000ms] ease-in-out ${
                        breathingPhase === "inhale" ? "border-cyan-400 scale-[1.15]" :
                        breathingPhase === "hold" ? "border-amber-400 scale-[1.15]" :
                        breathingPhase === "exhale" ? "border-cyan-500 scale-[0.85] opacity-50" : "border-gray-800 scale-100"
                      }`}
                    />
                    {/* Center Core */}
                    <div
                      className={`w-28 h-28 rounded-full bg-gradient-to-tr from-gray-900 to-gray-800 border border-gray-700/50 flex flex-col items-center justify-center shadow-lg transition-transform duration-[4000ms] ${
                        breathingPhase === "inhale" || breathingPhase === "hold" ? "scale-110" : "scale-95"
                      }`}
                    >
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                        {breathingPhase === "idle" ? "Breathing" : breathingPhase}
                      </span>
                      <p className="text-xs font-extrabold text-white px-2 leading-tight">
                        {breathingText}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsBreathing(!isBreathing)}
                    className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 w-full ${
                      isBreathing
                        ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 shadow-lg"
                        : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02]"
                    }`}
                  >
                    {isBreathing ? "Stop Exercise" : "Start Calming Exercise"}
                  </button>
                </div>

                {/* 2. Affirmations / Quote Card */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-8 backdrop-blur shadow-2xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">🔥 Daily Confidence Booster</h3>
                      <span className="text-2xl">⚡</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-6">
                      Read, absorb, and repeat these reminders to combat imposter syndrome. You are here because of your dedication.
                    </p>
                  </div>

                  {/* Quote Display Area */}
                  <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl p-6 mb-6 min-h-[140px] flex flex-col justify-center relative">
                    <span className="absolute top-2 left-4 text-gray-700 text-6xl font-serif pointer-events-none">“</span>
                    <p className="text-gray-200 text-sm font-semibold italic leading-relaxed relative z-10 text-center mb-3">
                      {motivationalQuotes[quoteIndex].text}
                    </p>
                    <p className="text-orange-400 text-xs font-bold text-right z-10">
                      — {motivationalQuotes[quoteIndex].author}
                    </p>
                  </div>

                  <button
                    onClick={handleNextQuote}
                    className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-[1.02] w-full flex items-center justify-center gap-2"
                  >
                    <span>🔄</span> Generate Next Affirmation
                  </button>
                </div>
              </div>

              {/* Confidence Golden Rules */}
              <div className="bg-gradient-to-r from-orange-950/20 to-amber-950/15 border border-orange-500/20 rounded-3xl p-8 backdrop-blur shadow-2xl relative">
                <h3 className="text-xl font-bold mb-4 text-orange-400 flex items-center gap-2">
                  🏆 The Golden Rules of Unshakeable Confidence
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">1. Realize they want you to succeed</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Interviewers hate bad interviews; they are searching for their new teammate. They are rooting for you to be the solution to their hiring search from the first second.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">2. Own what you do not know</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Pretending to know an answer creates immediate distrust. Say: "I haven't worked with that specific tool yet, but based on my experience with X, I imagine it works similarly by..." This demonstrates maturity and adaptability.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">3. You are evaluating them too</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Remind yourself that interviews are a two-way street. You are assessing if they deserve your talent, code quality standards, and daily working hours.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">4. Focus on values, not validation</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Do not treat the interview as a plea for validation. Treat it as a collaboration where you discuss building things, solving errors, and growing together.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TipsTricks;
