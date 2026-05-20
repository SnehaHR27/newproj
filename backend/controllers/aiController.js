const { GoogleGenerativeAI } = require("@google/generative-ai");

// ══════════════════════════════════════════════════════════════════
// CONTROLLER: Generate Interview Questions
// ══════════════════════════════════════════════════════════════════
exports.generateQuestions = async (req, res) => {
  try {
    const { role, level, type, techstack, amount } = req.body;
    const questions = generateLocalQuestions(
      role || "Full Stack Developer",
      type || "Mixed",
      level || "Junior",
      techstack || "General",
      5 // Force exactly 5 questions as requested
    );
    res.json({ success: true, questions });
  } catch (error) {
    console.error("Generate Questions Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ══════════════════════════════════════════════════════════════════
// CONTROLLER: Evaluate Answer (Multimodal AI + Filler Words)
// ══════════════════════════════════════════════════════════════════
exports.evaluateAnswer = async (req, res) => {
  const { role, level, question, answer, imageBase64 } = req.body;
  let feedback;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const promptText = `You are an expert ${role} interviewer and interview coach evaluating a ${level || "Junior"} candidate.

Question asked: "${question}"
Candidate's answer: "${answer}"

Analyze both the CONTENT (what they said) and BEHAVIOR (how they communicated — clarity, structure, confidence based on text${imageBase64 ? " AND visual body language from the provided camera snapshot" : ""}).
If the answer is incorrect, incomplete, or too simple, provide the correct technical answer and a concrete example of how to answer it properly. Be dynamic, highly interactive, and detailed.

Return ONLY valid JSON in this exact format with no extra text:
{
  "score": <integer 0-10>,
  "rating": "<Excellent|Good|Average|Needs Improvement|Poor>",
  "behaviorTips": [
    "<Tip about communication style, answer structure, or delivery>",
    "<Another behavioral tip>"
  ],
  "strengths": [
    "<Something they did well in content or structure>",
    "<Another strength>"
  ],
  "corrections": [
    "<Factual or conceptual mistake to correct>",
    "<Another correction or missing key point>"
  ],
  "idealAnswer": "<Provide a complete, correct technical answer for the question asked and an example of how the candidate should have answered properly. Be very detailed and informative.>",
  "encouragement": "<One short encouraging sentence>"
}`;

    const parts = [{ text: promptText }];

    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      });
    }

    const result = await model.generateContent(parts);
    const text = result.response.text();

    // Strip markdown code block if present
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    feedback = JSON.parse(cleaned);
  } catch (aiError) {
    console.log("AI evaluation failed, using fallback:", aiError.message || aiError);
    feedback = generateLocalFeedback(question, answer, !!imageBase64);
  }

  // ── Analyze filler words ──
  const fillers = ["um", "uh", "like", "basically", "actually", "literally"];
  const words = (answer || "").toLowerCase().split(/[\s,.-]+/);
  let count = 0;
  const used = {};

  for (const w of words) {
    if (fillers.includes(w)) {
      count++;
      used[w] = (used[w] || 0) + 1;
    }
  }

  const youKnowMatches = (answer || "").toLowerCase().match(/you know/g);
  if (youKnowMatches) {
    count += youKnowMatches.length;
    used["you know"] = (used["you know"] || 0) + youKnowMatches.length;
  }

  feedback.fillerWordsCount = count;
  feedback.fillerWordsUsed = used;

  res.json({ success: true, feedback });
};

// ══════════════════════════════════════════════════════════════════
// LOCAL FALLBACK: When AI rate limit is exceeded
// ══════════════════════════════════════════════════════════════════
function generateLocalFeedback(question, answer, hasCamera = false) {
  const wordCount = (answer || "").split(/\s+/).filter(Boolean).length;
  let fb;

  if (wordCount < 10) {
    fb = {
      score: 3,
      rating: "Needs Improvement",
      behaviorTips: [
        "Your response was too short — interviewers expect detailed answers",
        "Take a breath and gather your thoughts before answering",
      ],
      strengths: ["You attempted to answer the question"],
      corrections: [
        "Provide at least 3-4 sentences with specific examples",
        "Include context about the situation and your specific role",
      ],
      idealAnswer:
        `For the question "${question}", a correct and ideal answer would deeply explain the concepts requested. Since this is a fallback, make sure you study the core topic of the question and practice answering it using the STAR method (Situation, Task, Action, Result). Provide specific examples from your past experience.`,
      encouragement:
        "Don't worry — practice makes perfect! Try again with more detail.",
    };
  } else if (wordCount < 30) {
    fb = {
      score: 5,
      rating: "Average",
      behaviorTips: [
        "Good start! Structure your answer using STAR: Situation, Task, Action, Result",
        "Be more specific — say 'I' instead of 'we' to highlight YOUR contribution",
      ],
      strengths: [
        "Provided a relevant response to the question",
        "Showed some understanding of the topic",
      ],
      corrections: [
        "Add a concrete example from your past experience",
        "Quantify your impact where possible (e.g. 'reduced load time by 30%')",
      ],
      idealAnswer:
        `For the question "${question}", you are on the right track but missing depth. The right answer involves explicitly mentioning the technologies, steps taken, or the specific methodology required. An example answer structure: "In my previous role, I faced [Situation]. I decided to [Action] which resulted in [Result]."`,
      encouragement:
        "You're on the right track — just go deeper with specifics next time!",
    };
  } else {
    fb = {
      score: 7,
      rating: "Good",
      behaviorTips: [
        "Keep your answer to 60-90 seconds in a real interview",
        "Great detail — end with a clear takeaway or result for maximum impact",
      ],
      strengths: [
        "Detailed and well-structured response",
        "Showed strong understanding of the topic",
      ],
      corrections: [
        "Include hard numbers or percentages to quantify your impact",
        "Explain WHY you chose a specific approach, not just WHAT you did",
      ],
      idealAnswer:
        `A complete answer for "${question}" should directly address the technical requirements while maintaining a clear narrative. Example: "I utilized [Technology] to solve the problem by implementing [Solution]. This improved performance by X%." Always anchor your technical explanations with real-world business value.`,
      encouragement:
        "Strong answer! Keep polishing the structure to make it even more compelling.",
    };
  }

  if (hasCamera) {
    fb.behaviorTips.push(
      "Camera feedback: You maintained decent eye contact, but try to sit up straighter to project more visual confidence."
    );
  }

  return fb;
}

// ══════════════════════════════════════════════════════════════════
// LOCAL QUESTION BANKS (5 Tailored Questions per role)
// ══════════════════════════════════════════════════════════════════
function generateLocalQuestions(role, type, level, techstack, amount) {
  const tailoredQuestions = {
    "Frontend Developer": [
      `Walk me through your process of building a responsive and accessible web interface using ${techstack || "modern frontend frameworks"}.`,
      "How do you handle state management in a complex single-page application?",
      "Can you describe a time when you had to optimize the performance or load time of a web application?",
      "How do you ensure cross-browser compatibility and handle CSS specificity issues?",
      "Tell me about a challenging UI bug you fixed. How did you debug and resolve it?"
    ],
    "Backend Developer": [
      `How would you design a scalable REST API using ${techstack || "modern backend technologies"}?`,
      "Explain your approach to database schema design and when you would choose SQL vs NoSQL.",
      "Tell me about a time you had to identify and resolve a performance bottleneck in a backend system.",
      "How do you secure a backend application against common vulnerabilities like SQL injection and cross-site scripting?",
      "Describe a situation where you had to integrate a complex third-party API. How did you handle errors and rate limits?"
    ],
    "Full Stack Developer": [
      `Walk me through the architecture of a full-stack application you've built using ${techstack || "your preferred stack"}.`,
      "How do you decide which logic belongs on the frontend versus the backend?",
      "Tell me about a time you had to debug an issue that spanned across the frontend and backend.",
      "What strategies do you use for secure user authentication and authorization?",
      "Describe your process for deploying a full-stack application and managing environment variables."
    ],
    "Data Scientist": [
      `How do you approach cleaning and preparing a messy dataset for analysis using ${techstack || "Python and Pandas"}?`,
      "Explain the trade-off between bias and variance. How do you decide if a model is overfitting?",
      "Tell me about a project where your data analysis directly influenced a business decision.",
      "How do you evaluate the performance of a machine learning model, and which metrics do you prioritize?",
      "Describe a time you had to communicate complex technical findings to a non-technical audience."
    ],
    "DevOps Engineer": [
      `Walk me through how you would set up a CI/CD pipeline from scratch using ${techstack || "modern DevOps tools"}.`,
      "Explain your approach to infrastructure as code (IaC) and its benefits.",
      "Tell me about the most critical production incident you've handled. How did you resolve it?",
      "How do you ensure high availability and implement disaster recovery strategies?",
      "Describe your process for monitoring application performance and setting up alerting."
    ],
    "Mobile Developer": [
      `How do you handle state management and offline capabilities in a mobile app using ${techstack || "modern mobile frameworks"}?`,
      "Explain the differences between native, hybrid, and cross-platform mobile development. When would you choose each?",
      "Tell me about a time you had to optimize a mobile app for battery consumption or memory usage.",
      "How do you handle push notifications and deep linking in a mobile application?",
      "Describe a challenging mobile UI bug you encountered and how you fixed it."
    ],
    "UI/UX Designer": [
      "Walk me through your end-to-end design process, from user research to the final high-fidelity prototype.",
      "How do you balance aesthetic design with usability and accessibility requirements?",
      "Tell me about a time when user testing results contradicted your initial design assumptions. What did you do?",
      "How do you collaborate with developers to ensure your designs are implemented accurately?",
      "Describe a complex user interface you designed. How did you simplify the user experience?"
    ],
    "Product Manager": [
      "How do you prioritize features for a product roadmap when dealing with competing stakeholder requests?",
      "Walk me through your process of validating a new product idea before committing development resources.",
      "Tell me about a time a product launch didn't go as planned. What did you learn from it?",
      "How do you balance delivering new features with addressing technical debt and bugs?",
      "Describe a situation where you had to say 'no' to a major customer request. How did you handle it?"
    ],
    "QA Engineer": [
      `How do you determine the scope of test coverage and decide which tests to automate using ${techstack || "modern testing tools"}?`,
      "Explain your approach to writing clear, reproducible, and effective bug reports.",
      "Tell me about the most critical bug you've found right before a release. How did you handle the situation?",
      "How do you incorporate performance and security testing into your QA process?",
      "Describe a time you had to advocate for quality standards when the team was rushing to meet a deadline."
    ],
    "Machine Learning Engineer": [
      `Walk me through the lifecycle of deploying a machine learning model to production using ${techstack || "modern ML frameworks"}.`,
      "How do you handle data drift and model degradation over time in a production environment?",
      "Tell me about a time you had to optimize a model's inference speed without significantly sacrificing accuracy.",
      "Explain your approach to model versioning, reproducibility, and experiment tracking.",
      "Describe a situation where a model performed well in testing but failed in production. How did you resolve it?"
    ]
  };

  const roleQuestions = tailoredQuestions[role] || tailoredQuestions["Full Stack Developer"];
  
  // Return exactly 5 questions based on requested amount
  return roleQuestions.slice(0, Math.min(amount, 5));
}
