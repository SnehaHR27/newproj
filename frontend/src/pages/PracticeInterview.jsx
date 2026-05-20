import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackCard from "../components/FeedbackCard";
import { auth } from "../firebase/config";
import * as faceapi from "face-api.js";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile Developer",
  "UI/UX Designer",
  "Product Manager",
  "QA Engineer",
  "Machine Learning Engineer",
];

const LEVELS = ["Junior", "Mid-Level", "Senior"];

const PracticeInterview = ({ user }) => {
  const navigate = useNavigate();

  // ── Interview State ──────────────────────────────────────────────
  const [phase, setPhase] = useState("setup"); // setup | interview | results
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [allFeedback, setAllFeedback] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [questions, setQuestions] = useState([]);

  // ── Voice & Speech State ─────────────────────────────────────────
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiVoiceOn, setAiVoiceOn] = useState(true);
  const [isSpeakingTTS, setIsSpeakingTTS] = useState(false);
  const recognitionRef = useRef(null);
  
  const userInputRef = useRef(userInput);
  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setVoiceSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
      if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }, []);

  // ── Speech Methods ───────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!voiceSupported) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    const currentText = userInputRef.current || "";
    const initialText = currentText ? currentText + (currentText.endsWith(" ") ? "" : " ") : "";
    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result && result[0]) {
          const transcript = result[0].transcript;
          if (result.isFinal) finalTranscript += transcript + " ";
          else interim += transcript;
        }
      }
      setUserInput(initialText + finalTranscript + interim);
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error !== "no-speech") setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [voiceSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  const speakText = useCallback((text) => {
    if (!aiVoiceOn || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const cleaned = text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\n/g, ". ").replace(/[#*_~`]/g, "").trim();
    if (!cleaned) return;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = "en-US";

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("male")) ||
                      voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Daniel") || v.name.includes("David") || v.name.includes("Mark"))) ||
                      voices.find((v) => v.lang.startsWith("en"));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeakingTTS(true);
    utterance.onend = () => setIsSpeakingTTS(false);
    utterance.onerror = () => setIsSpeakingTTS(false);

    window.speechSynthesis.speak(utterance);
  }, [aiVoiceOn]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingTTS(false);
  }, []);

  const toggleListeningWithTTSStop = useCallback(() => {
    if (!isListening) stopSpeaking();
    toggleListening();
  }, [isListening, stopSpeaking, toggleListening]);

  // ── Settings ─────────────────────────────────────────────────────
  const [role, setRole] = useState("Frontend Developer");
  const [level, setLevel] = useState("Junior");

  // ── Dynamic Tips ─────────────────────────────────────────────────
  const INTERVIEW_TIPS = [
    "Maintain eye contact with the camera to build trust.",
    "Speak clearly and avoid rushing your answers.",
    "Use the STAR method (Situation, Task, Action, Result) for behavioral questions.",
    "Take a deep breath and pause before answering complex questions.",
    "If you don't know the exact answer, explain your thought process instead.",
    "Sit up straight and use hand gestures naturally to convey confidence."
  ];
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    if (phase === "interview") {
      const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % INTERVIEW_TIPS.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [phase, INTERVIEW_TIPS.length]);

  // ── Media & ML ───────────────────────────────────────────────────
  const [webcamOn, setWebcamOn] = useState(false);
  const [emotion, setEmotion] = useState("Loading ML Models...");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const chatEndRef = useRef(null);

  // Load Face API models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights');
        await faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights');
        setEmotion("Models Ready");
      } catch (e) {
        console.error("Face API models failed to load", e);
        setEmotion("ML Tracking Unavailable");
      }
    };
    loadModels();
  }, []);

  // Track Emotion during interview
  useEffect(() => {
    if (phase === "interview" && webcamOn && videoRef.current) {
      const interval = setInterval(async () => {
        if (videoRef.current && !videoRef.current.paused) {
          const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
          if (detections) {
            const exp = detections.expressions;
            const maxExp = Object.keys(exp).reduce((a, b) => exp[a] > exp[b] ? a : b);
            if (maxExp === "neutral") setEmotion("Focused & Neutral");
            else if (maxExp === "happy") setEmotion("Positive & Smiling");
            else setEmotion(maxExp.charAt(0).toUpperCase() + maxExp.slice(1));
          } else {
            setEmotion("Face Not Found (Look at camera!)");
          }
        }
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [phase, webcamOn]);

  // Ensure video stream connects to video element when it renders
  useEffect(() => {
    if (phase === "interview" && webcamOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [phase, webcamOn]);

  // ── Start Interview ──────────────────────────────────────────────
  const handleStart = async () => {
    setPhase("interview");
    setMessages([]);
    setAllFeedback([]);
    setCurrentQ(0);

    try {
      const res = await fetch("http://localhost:5000/api/ai/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, level, type: focusType, techstack: techStack, amount: 5 }),
      });
      const data = await res.json();
      setQuestions(data.questions);

      setMessages([
        {
          id: 1,
          sender: "tutor",
          text: `Welcome to your ${role} interview (${level}). I'll ask you ${data.questions.length} questions. Let's begin!`,
        },
        { id: 2, sender: "tutor", text: data.questions[0] },
      ]);

      speakText(`Welcome to your ${role} interview (${level}). I'll ask you ${data.questions.length} questions. Let's begin! ${data.questions[0]}`);

      // Auto-start webcam
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = stream;
        // The element might not be rendered yet, so the useEffect above will handle assignment
        if (videoRef.current) videoRef.current.srcObject = stream;
        setWebcamOn(true);
      } catch {
        console.log("Webcam not available — continuing without camera.");
      }
    } catch (e) {
      console.error(e);
      alert("Backend must be running on port 5000!");
      setPhase("setup");
    }
  };

  // ── Toggle Webcam ────────────────────────────────────────────────
  const handleToggleWebcam = async () => {
    if (webcamOn) {
      const stream = streamRef.current;
      if (stream) stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setWebcamOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setWebcamOn(true);
      } catch (err) {
        console.error("Webcam error:", err);
      }
    }
  };

  // ── Submit Answer ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isEvaluating) return;

    const answer = userInput.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: answer },
    ]);
    setUserInput("");
    setIsEvaluating(true);

    // Capture webcam frame if camera is on
    let imageBase64 = null;
    if (webcamOn && videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx && canvas.width > 0 && canvas.height > 0) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        imageBase64 = dataUrl.split(",")[1];
      }
    }

    try {
      const res = await fetch("http://localhost:5000/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          level,
          question: questions[currentQ],
          answer,
          imageBase64,
        }),
      });
      const data = await res.json();

      const newFeedback = data.feedback;
      setAllFeedback((prev) => [...prev, newFeedback]);

      // Add feedback message
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "tutor", text: "", feedback: newFeedback },
      ]);

      const spoken = [];
      spoken.push(`You scored ${newFeedback.score} out of 10. That's rated ${newFeedback.rating}.`);
      if (newFeedback.strengths?.length) spoken.push(`Here's what you did well: ${newFeedback.strengths.slice(0, 2).join(". ")}.`);
      if (newFeedback.corrections?.length) spoken.push(`To improve: ${newFeedback.corrections.slice(0, 2).join(". ")}.`);
      if (newFeedback.behaviorTips?.length) spoken.push(`A tip for you: ${newFeedback.behaviorTips[0]}.`);
      if (newFeedback.encouragement) spoken.push(newFeedback.encouragement);
      
      const fullFeedbackSpeech = spoken.join(" ");

      // Move to next question or finish
      const nextQ = currentQ + 1;
      if (nextQ < questions.length) {
        const speakFeedbackAndNext = () => {
          if (!aiVoiceOn || !window.speechSynthesis) {
            setTimeout(() => {
              setCurrentQ(nextQ);
              setMessages((prev) => [
                ...prev,
                { id: Date.now() + 2, sender: "tutor", text: questions[nextQ] },
              ]);
            }, 1000); // Reduced time to 1 second
            return;
          }
          
          window.speechSynthesis.cancel();
          const cleaned = fullFeedbackSpeech.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\n/g, ". ").replace(/[#*_~`]/g, "").trim();
          const utterance = new SpeechSynthesisUtterance(cleaned);
          utterance.rate = 0.95;
          utterance.pitch = 1.0;
          utterance.lang = "en-US";
          const voices = window.speechSynthesis.getVoices();
          const preferred = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female")) || voices.find(v => v.lang.startsWith("en"));
          if (preferred) utterance.voice = preferred;
          
          utterance.onstart = () => setIsSpeakingTTS(true);
          utterance.onend = () => {
            setIsSpeakingTTS(false);
            setTimeout(() => {
              setCurrentQ(nextQ);
              setMessages((prev) => [
                ...prev,
                { id: Date.now() + 2, sender: "tutor", text: questions[nextQ] },
              ]);
              speakText(`Next Question: ${questions[nextQ]}`);
            }, 500);
          };
          utterance.onerror = () => {
            setIsSpeakingTTS(false);
            setCurrentQ(nextQ);
            setMessages((prev) => [
              ...prev,
              { id: Date.now() + 2, sender: "tutor", text: questions[nextQ] },
            ]);
          };
          window.speechSynthesis.speak(utterance);
        };
        
        speakFeedbackAndNext();
      } else {
        speakText(fullFeedbackSpeech + ". That was the last question! Let me show your summary.");
        
        // Save Interview to Database
        try {
          const finalFeedback = [...allFeedback, newFeedback];
          const finalScore = finalFeedback.reduce((sum, f) => sum + (f.score || 0), 0) / finalFeedback.length;
          
          let overallRating = "Needs Improvement";
          if (finalScore >= 8) overallRating = "Excellent";
          else if (finalScore >= 6) overallRating = "Good";
          else if (finalScore >= 4) overallRating = "Average";

          fetch("http://localhost:5000/api/interviews/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user?.uid || auth.currentUser?.uid,
              role,
              level,
              score: Number(finalScore.toFixed(1)),
              rating: overallRating,
              feedbackSummary: finalFeedback
            })
          }).catch(e => console.error("Failed to save DB analytics", e));
        } catch(e) {
          console.error("Save logic error", e);
        }

        setTimeout(() => {
          // Stop webcam before leaving interview phase
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
          }
          setWebcamOn(false);
          setPhase("results");
        }, 1500); // Reduced to 1.5 seconds from 6 seconds
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "tutor",
          text: "⚠️ Something went wrong evaluating your answer. Please try again.",
        },
      ]);
    } finally {
      setIsEvaluating(false);
    }
  };

  // ── Skip Question ────────────────────────────────────────────────
  const handleSkip = () => {
    if (isEvaluating) return;
    
    const nextQ = currentQ + 1;
    if (nextQ < questions.length) {
      setCurrentQ(nextQ);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "user", text: "[Skipped question]" },
        { id: Date.now() + 1, sender: "tutor", text: `Skipped. Next Question: ${questions[nextQ]}` },
      ]);
      speakText(`Skipped. Next Question: ${questions[nextQ]}`);
    } else {
      // It's the last question
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "user", text: "[Skipped question]" },
      ]);
      speakText("Skipped the last question! Let me show your summary.");
      
      // Save Interview to Database
      try {
        const finalFeedback = [...allFeedback];
        const finalScore = finalFeedback.length > 0 ? finalFeedback.reduce((sum, f) => sum + (f.score || 0), 0) / finalFeedback.length : 0;
        
        let overallRating = "Needs Improvement";
        if (finalScore >= 8) overallRating = "Excellent";
        else if (finalScore >= 6) overallRating = "Good";
        else if (finalScore >= 4) overallRating = "Average";

        fetch("http://localhost:5000/api/interviews/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.uid || auth.currentUser?.uid,
            role,
            level,
            score: Number(finalScore.toFixed(1)),
            rating: overallRating,
            feedbackSummary: finalFeedback
          })
        }).catch(e => console.error("Failed to save DB analytics", e));
      } catch(e) {
        console.error("Save logic error", e);
      }

      setTimeout(() => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        setWebcamOn(false);
        setPhase("results");
      }, 1500);
    }
  };

  // ── Auto-scroll chat ────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Cleanup webcam & voice on unmount ────────────────────────────────────
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      stopListening();
      stopSpeaking();
    };
  }, [stopListening, stopSpeaking]);

  // ── Compute overall score ────────────────────────────────────────
  const avgScore =
    allFeedback.length > 0
      ? (allFeedback.reduce((sum, f) => sum + (f.score || 0), 0) / allFeedback.length).toFixed(1)
      : 0;

  const getOverallGrade = (score) => {
    if (score >= 8) return { label: "Excellent", color: "text-green-400", bg: "bg-green-500/20" };
    if (score >= 6) return { label: "Good", color: "text-blue-400", bg: "bg-blue-500/20" };
    if (score >= 4) return { label: "Average", color: "text-yellow-400", bg: "bg-yellow-500/20" };
    return { label: "Needs Improvement", color: "text-red-400", bg: "bg-red-500/20" };
  };

  const grade = getOverallGrade(avgScore);

  // ═════════════════════════════════════════════════════════════════
  //  SETUP PHASE — Role & Level Selection
  // ═════════════════════════════════════════════════════════════════
  const [focusType, setFocusType] = useState("Mixed");
  const [techStack, setTechStack] = useState("");

  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col items-center justify-center p-6 relative">
        {/* Header */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="PrepWise" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl">PrepWise</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/")} className="px-4 py-2 border border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-800 transition">Back</button>
          </div>
        </div>

        <div className="text-center mb-8 mt-12 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gray-900/80 border border-gray-800 px-4 py-1.5 rounded-full text-gray-300 text-xs font-bold mb-5 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            AI TUTOR MODE
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">AI Interview Tutor</h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
            Your AI tutor will ask questions, listen to your answers, and coach you with instant feedback
          </p>
        </div>

        <div className="w-full max-w-md bg-[#121212] border border-gray-800/80 rounded-2xl p-6 relative z-10 shadow-2xl">
          {/* Job Role Dropdown */}
          <div className="mb-5">
            <label className="block text-[13px] font-bold text-gray-200 mb-2">Job Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-purple-500 transition-colors appearance-none"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Experience Level */}
          <div className="mb-5">
            <label className="block text-[13px] font-bold text-gray-200 mb-2">Experience Level</label>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`flex-1 min-w-[100px] py-2.5 rounded-xl text-sm font-bold transition-all ${
                    level === l
                      ? "bg-purple-200 text-black shadow-lg shadow-purple-500/20"
                      : "bg-[#1c1c1c] text-gray-400 border border-gray-700 hover:border-gray-500"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Interview Focus */}
          <div className="mb-5">
            <label className="block text-[13px] font-bold text-gray-200 mb-2">Interview Focus</label>
            <div className="flex flex-wrap gap-2">
              {["Technical", "Behavioral", "Mixed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFocusType(f)}
                  className={`flex-1 min-w-[100px] py-2.5 rounded-xl text-sm font-bold transition-all ${
                    focusType === f
                      ? "bg-purple-200 text-black shadow-lg shadow-purple-500/20"
                      : "bg-[#1c1c1c] text-gray-400 border border-gray-700 hover:border-gray-500"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-5">
            <label className="block text-[13px] font-bold text-gray-200 mb-2">Tech Stack <span className="text-gray-600 font-normal">(optional)</span></label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="e.g. React, Node.js, TypeScript"
              className="w-full bg-[#1c1c1c] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Camera Preview */}
          <div className="mb-6">
            <label className="block text-[13px] font-bold text-gray-200 mb-2">Camera Preview</label>
            <div className="w-full h-32 bg-[#1c1c1c] border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-gray-500 transition-colors">
              <span className="text-2xl text-gray-500 mb-1">📷</span>
              <span className="text-sm font-medium text-purple-400">Enable Camera</span>
              <span className="text-[10px] text-gray-500">Click to see yourself</span>
            </div>
          </div>

          <button
            onClick={() => {
              // Note: Ideally we pass focusType and techStack down to the API, handled in handleStart
              handleStart();
            }}
            className="w-full bg-purple-200 hover:bg-white text-black font-extrabold py-3.5 rounded-full text-[15px] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10"
          >
            Start Interview with AI Tutor →
          </button>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  //  INTERVIEW PHASE — Chat + Webcam
  // ═════════════════════════════════════════════════════════════════
  if (phase === "interview") {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white font-sans p-4 sm:p-6 flex flex-col">
        {/* Top Navigation */}
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center mb-6">
          <button
            onClick={() => {
              try {
                if (streamRef.current && typeof streamRef.current.getTracks === 'function') {
                  streamRef.current.getTracks().forEach((track) => track.stop());
                }
              } catch (e) {
                console.error("Error stopping stream", e);
              }
              stopSpeaking();
              navigate("/");
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition group"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm font-semibold">End Interview & Go Back</span>
          </button>
          
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            PrepWise Interview
          </div>
        </div>

        {/* Header Bar */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="/logo.png" alt="PrepWise" className="w-8 h-8 object-contain" />
              {isSpeakingTTS && <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse border-2 border-[#0d0d0d]" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {role} Interview {isSpeakingTTS && <span className="text-xs text-green-400 ml-2 animate-pulse font-normal">🔊 Speaking...</span>}
              </h2>
              <p className="text-xs text-gray-400">
                Question {currentQ + 1} of {questions.length} • {level}
              </p>
            </div>
          </div>

          {/* Progress Bar & Voice Toggle */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => { setAiVoiceOn(!aiVoiceOn); if (aiVoiceOn) stopSpeaking(); }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all border ${
                aiVoiceOn
                  ? "bg-green-500/20 border-green-500/30 text-green-400"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
              title={aiVoiceOn ? "AI voice ON — click to mute" : "AI voice OFF — click to unmute"}
            >
              {aiVoiceOn ? (
                isSpeakingTTS ? (
                  <div className="flex items-center gap-0.5 h-4 justify-center">
                    <span className="w-1 bg-green-400 h-[60%] animate-[bounce_1s_infinite] rounded-full" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1 bg-green-400 h-full animate-[bounce_1s_infinite] rounded-full" style={{ animationDelay: '200ms' }}></span>
                    <span className="w-1 bg-green-400 h-[80%] animate-[bounce_1s_infinite] rounded-full" style={{ animationDelay: '400ms' }}></span>
                  </div>
                ) : "🔊"
              ) : "🔇"}
            </button>
            <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{
                  width: `${questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-xs text-gray-400 font-mono">
              {questions.length > 0 ? Math.round(((currentQ + 1) / questions.length) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Main Grid: Chat + Sidebar */}
        <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:h-[calc(100vh-140px)] h-auto">
          {/* Chat Area — 3 columns */}
          <div className="lg:col-span-3 flex flex-col border border-gray-800 rounded-2xl bg-gray-900/80 backdrop-blur overflow-hidden h-[60vh] lg:h-auto">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.feedback ? (
                    <FeedbackCard feedback={m.feedback} />
                  ) : (
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        m.sender === "user"
                          ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-br-sm"
                          : "bg-gray-800 text-gray-100 border border-gray-700 rounded-bl-sm"
                      }`}
                    >
                      {m.sender === "tutor" && (
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                          AI Interviewer
                        </span>
                      )}
                      <p>{m.text}</p>
                    </div>
                  )}
                </div>
              ))}

              {isEvaluating && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-xs text-gray-400">AI is evaluating your answer...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-gray-800 p-4 bg-gray-900">
              {isListening && (
                <div className="flex items-center gap-2 mb-2 px-2">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs text-red-400 font-semibold">🎤 Listening — speak your answer...</span>
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  stopListening();
                  handleSubmit(e);
                }}
                className="flex gap-3"
              >
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={toggleListeningWithTTSStop}
                    disabled={isEvaluating}
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all border ${
                      isListening
                        ? "bg-red-500/20 border-red-500/50 text-red-400 shadow-lg shadow-red-500/20 animate-pulse"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-cyan-500 hover:text-cyan-400"
                    } ${isEvaluating ? "opacity-40 cursor-not-allowed" : ""}`}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? "⏹️" : "🎤"}
                  </button>
                )}
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isEvaluating}
                  className={`flex-1 bg-gray-800 border rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition disabled:opacity-50 ${isListening ? "border-red-500/50 focus:border-red-500/50" : "border-gray-700 focus:border-cyan-500"}`}
                  placeholder={isEvaluating ? "Waiting for evaluation..." : voiceSupported ? "Type or click 🎤 to speak..." : "Type your answer..."}
                />
                <button
                  type="submit"
                  disabled={isEvaluating || !userInput.trim()}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Send
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isEvaluating}
                  className="bg-gray-700 hover:bg-gray-600 border border-gray-600 px-4 py-3 rounded-xl font-bold text-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Skip this question"
                >
                  Skip
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar — Webcam + Controls */}
          <div className="w-full lg:w-64 flex-shrink-0 flex flex-col items-center gap-4 pt-0 lg:pt-2">
            {/* Webcam */}
            <div className="relative">
              {webcamOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-52 h-52 rounded-2xl object-cover -scale-x-100 border-2 border-cyan-500/50 shadow-xl shadow-cyan-500/10"
                />
              ) : (
                <div className="w-52 h-52 rounded-2xl bg-gray-900 border-2 border-dashed border-gray-700 flex flex-col items-center justify-center text-gray-400 gap-2">
                  <span className="text-4xl opacity-50">📷</span>
                  <span className="text-xs">Camera Off</span>
                </div>
              )}
            </div>

            <button
              onClick={handleToggleWebcam}
              className={`w-52 py-2.5 rounded-xl font-semibold text-sm transition-all border flex items-center justify-center gap-2 ${
                webcamOn
                  ? "bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20"
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {webcamOn ? <><span>🚫</span> Turn Off Camera</> : <><span>📷</span> Turn On Camera</>}
            </button>

            {/* INTERVIEW STATUS */}
            <div className="w-52 bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                INTERVIEW STATUS
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Question</span>
                  <span className="text-white font-semibold">{currentQ + 1} / {questions.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Camera</span>
                  <span className={`font-semibold ${webcamOn ? "text-green-400" : "text-gray-500"}`}>
                    {webcamOn ? "✓ Active" : "Off"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">AI Voice</span>
                  <span className={`font-semibold ${aiVoiceOn ? "text-green-400" : "text-gray-500"}`}>
                    {aiVoiceOn ? "✓ On" : "Off"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Mic</span>
                  <span className={`font-semibold ${isListening ? "text-red-400 flex items-center gap-1.5" : "text-gray-500"}`}>
                    {isListening ? (
                      <div className="flex items-center gap-1">
                        <div className="flex items-end gap-[2px] h-3">
                          <span className="w-1 bg-red-400 h-full animate-[bounce_0.8s_infinite] rounded-full" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1 bg-red-400 h-[60%] animate-[bounce_0.8s_infinite] rounded-full" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1 bg-red-400 h-[80%] animate-[bounce_0.8s_infinite] rounded-full" style={{ animationDelay: '300ms' }}></span>
                        </div>
                        <span className="text-xs">Listening</span>
                      </div>
                    ) : "Off"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800">
                  <span className="text-gray-400">Face ML Tracking</span>
                  <span className={`font-semibold text-right max-w-[100px] leading-tight ${emotion.includes("Not Found") || emotion.includes("Failed") ? "text-red-400" : "text-cyan-400"}`}>
                    {emotion}
                  </span>
                </div>
              </div>
            </div>

            {/* Tip Card */}
            <div className="w-52 bg-gray-900/50 border border-gray-800/50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 leading-relaxed min-h-[48px] transition-opacity duration-500">
                💡 <strong className="text-cyan-400">Tip:</strong> {INTERVIEW_TIPS[currentTipIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  //  RESULTS PHASE — Summary & Feedback Review
  // ═════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Interview Complete!
          </h1>
          <p className="text-gray-400 text-lg">
            Here's how you performed across {allFeedback.length} questions.
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div>
              <p className="text-gray-400 text-sm mb-1">Overall Score</p>
              <p className="text-5xl font-bold text-white">{avgScore}<span className="text-2xl text-gray-500">/10</span></p>
            </div>
            <div className={`px-6 py-3 rounded-xl border ${grade.bg} ${grade.color} border-current/20`}>
              <p className="text-sm font-bold">{grade.label}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Role</p>
              <p className="text-lg font-bold text-cyan-400">{role}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Level</p>
              <p className="text-lg font-bold text-purple-400">{level}</p>
            </div>
          </div>
        </div>

        {/* Individual Feedback */}
        <div className="space-y-6 mb-10">
          <h2 className="text-xl font-bold text-white">Question-by-Question Breakdown</h2>
          {allFeedback.map((fb, index) => (
            <div key={index} className="space-y-2">
              <p className="text-sm text-gray-400 font-semibold">
                Q{index + 1}: <span className="text-gray-300 font-normal">{questions[index]}</span>
              </p>
              <FeedbackCard feedback={fb} expanded={true} />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
          <button
            onClick={() => window.print()}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-8 py-3 rounded-xl font-bold transition-all text-white flex items-center justify-center gap-2"
          >
            📄 Download PDF Report
          </button>
          <button
            onClick={() => {
              setPhase("setup");
              setMessages([]);
              setAllFeedback([]);
              setCurrentQ(0);
              setQuestions([]);
            }}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-cyan-500/20"
          >
            🔄 Practice Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-8 py-3 rounded-xl font-bold transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          @page { margin: 1.5cm; }
          body, html { background: white !important; color: black !important; margin: 0; padding: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .bg-\\[\\#0d0d0d\\] { background-color: white !important; }
          .bg-gray-900 { background-color: #f3f4f6 !important; border-color: #d1d5db !important; }
          .text-white, .text-gray-400, .text-gray-300 { color: black !important; }
          .text-cyan-400, .text-purple-400, .text-green-400 { color: #111827 !important; font-weight: bold; }
          .border-gray-800 { border-color: #e5e7eb !important; }
          .shadow-lg, .shadow-2xl { box-shadow: none !important; }
          h1, h2, p { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
};

export default PracticeInterview;
