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
  "idealAnswer": "<A concise model answer in 3-4 sentences>",
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
    feedback = generateLocalFeedback(answer, !!imageBase64);
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
function generateLocalFeedback(answer, hasCamera = false) {
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
        "A strong answer should include a specific example from your experience, the actions you took, and the measurable result or outcome.",
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
        "Strengthen your answer by adding measurable results and linking your experience directly to the role requirements.",
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
        "A 60-90 second response that uses STAR and highlights your specific contributions and measurable outcomes.",
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
// LOCAL QUESTION BANKS (15 Technical + 12 Behavioral per role)
// ══════════════════════════════════════════════════════════════════
function generateLocalQuestions(role, type, level, techstack, amount) {
  const roleTechnicalQuestions = {
    "Frontend Developer": [
      "In your own words, explain what the virtual DOM is and why frameworks like React use it instead of updating the real DOM directly.",
      "Walk me through how you would build a responsive web page from scratch. What is your thought process for making it look good on phones, tablets, and desktops?",
      "If a React component is rendering slowly and the page feels laggy, how would you go about figuring out what is wrong and fixing it?",
      "How would you explain the difference between server-side rendering and client-side rendering to someone who is not a developer?",
      "Tell me about a time you had to manage complex state in a frontend application. What approach did you use and why?",
      "How do you make sure your website loads fast for users? Walk me through the performance techniques you have used.",
      "Imagine you join a project and the CSS is a mess with styles conflicting everywhere. How would you clean it up?",
      "How would you handle user authentication on the frontend? Walk me through the flow from Sign In to dashboard.",
      "What does accessibility mean to you in web development? Give me some examples of how you have made a website more accessible.",
      "If you had to choose between React, Vue, and Angular for a new project, how would you make that decision?",
      `How have you used ${techstack || "modern frontend tools"} in your work? Tell me about a specific problem they helped you solve.`,
      "Walk me through how you would add a search feature to a website.",
      "How do you approach testing your frontend code? What kinds of tests do you write?",
      "Explain what happens behind the scenes from the moment a user types a URL in the browser to when the page fully loads.",
      "How do you keep up with the fast-changing world of frontend development?",
    ],
    "Backend Developer": [
      "How would you explain what a REST API is to a non-technical person? What makes a well-designed API?",
      "Walk me through how you would design the backend for a simple e-commerce app.",
      "When would you choose a SQL database over a NoSQL database? Give me a real scenario for each.",
      "How do you handle security in your backend applications?",
      "Tell me about caching. When is it useful and what strategies have you used?",
      "What are microservices and when would you use them instead of a monolith?",
      "If your API is getting thousands of requests per second and slowing down, how would you fix it?",
      "How do you handle errors and logging in a production backend?",
      "Explain the difference between authentication and authorization.",
      "What is database indexing and why does it matter?",
      `Tell me about your experience with ${techstack || "backend technologies"}.`,
      "How would you design a notification system that sends emails, push notifications, and SMS?",
      "What is the N plus 1 query problem and how would you fix it?",
      "How do you approach database migrations when your app is already in production?",
      "Tell me about a time you had to integrate with a third-party API.",
    ],
    "Full Stack Developer": [
      "How do you decide what logic belongs on the frontend versus the backend?",
      "Describe a full-stack application you have built. What technologies did you choose and why?",
      "If a web application is loading slowly, how do you figure out where the problem is?",
      "Walk me through implementing a user login system end to end.",
      "How do you keep your frontend and backend in sync when building new features?",
      "Tell me about your approach to handling file uploads in a web application.",
      "How do you handle form validation? Frontend, backend, or both?",
      "What is your strategy for deploying a full-stack application?",
      "How would you set up real-time features like live chat in a web app?",
      "How do you approach testing when you are responsible for both frontend and backend?",
      `How have you used ${techstack || "your preferred tech stack"} to build a complete feature?`,
      "If you had to design a database schema for a social media app, walk me through it.",
      "How do you manage environment variables across development, staging, and production?",
      "Tell me about a challenging bug that involved both the frontend and backend.",
      "When would you choose SSR versus a single-page application?",
    ],
    "Data Scientist": [
      "How would you explain supervised vs unsupervised learning to a non-technical person?",
      "Walk me through your typical data science project process.",
      "You receive a dataset with many missing values. How do you handle it?",
      "What is overfitting and how do you prevent it?",
      "How do you choose which ML algorithm to use for a given problem?",
      "Tell me about a project where your analysis made a real business difference.",
      "How would you explain precision and recall to a product manager?",
      "What is feature engineering and why is it important?",
      "How do you handle imbalanced datasets?",
      "Walk me through setting up an A/B test.",
      `Tell me about your experience with ${techstack || "data science tools"}.`,
      "How do you present complex data findings to non-technical people?",
      "What is the bias-variance trade-off?",
      "If a model performs well in testing but poorly in production, what would you investigate?",
      "How do you make sure your models are fair and unbiased?",
    ],
    "DevOps Engineer": [
      "How would you explain CI/CD to a developer who has never used it?",
      "Walk me through setting up a deployment pipeline from scratch.",
      "What is the difference between a container and a virtual machine?",
      "Tell me about your experience with cloud services.",
      "How do you monitor a production system?",
      "Walk me through your incident response process.",
      "How would you explain Infrastructure as Code?",
      "What is your approach to managing secrets in production?",
      "Tell me about a time you automated something that was previously manual.",
      "How do you decide between scaling vertically vs horizontally?",
      `How have you used ${techstack || "DevOps tools like Docker or Kubernetes"}?`,
      "Explain blue-green and canary deployments.",
      "How do you handle disaster recovery planning?",
      "What does shifting left mean in DevOps?",
      "How do you balance fast deployments with stability?",
    ],
    "Mobile Developer": [
      "What are the differences between native, hybrid, and cross-platform mobile development?",
      "Walk me through planning and building a new mobile app.",
      "How do you handle poor internet or offline scenarios?",
      "Tell me about your approach to making a mobile app feel fast.",
      "How do you handle push notifications end to end?",
      "What is your process for testing a mobile app on different devices?",
      "How do you handle sensitive user data on mobile?",
      "Tell me about your app store submission experience.",
      "How would you implement biometric authentication?",
      "What is deep linking and why is it useful?",
      `Tell me about a project using ${techstack || "React Native or Flutter"}.`,
      "How do you keep your app size small?",
      "Walk me through adding a live camera feature to a mobile app.",
      "How do you approach accessibility in mobile apps?",
      "Tell me about a mobile bug that was very hard to track down.",
    ],
    "UI/UX Designer": [
      "Walk me through your complete design process.",
      "How do you conduct user research?",
      "What is the difference between UX and UI design?",
      "Tell me about a time user feedback changed your design direction.",
      "How do you build and maintain a design system?",
      "Walk me through designing a mobile checkout experience.",
      "How do you measure whether a design is working?",
      "What does accessibility mean to you as a designer?",
      "How do you handle disagreements with stakeholders about design?",
      "Tell me about your approach to creating prototypes.",
      `How have you used ${techstack || "Figma or Sketch"} in your workflow?`,
      "Do you start mobile-first or desktop-first, and why?",
      "How would you redesign a page with a high bounce rate?",
      "How do you work with developers to implement your designs?",
      "Tell me about a design you are really proud of.",
    ],
    "Product Manager": [
      "How do you decide which features to build first?",
      "Tell me about a product you managed from idea to launch.",
      "How do you gather user input to understand their needs?",
      "How do you measure product success?",
      "Tell me about a time you said no to a feature request.",
      "How do you work with engineering teams for sprint planning?",
      "Walk me through creating a product roadmap.",
      "How do you make sure everyone supports the product vision?",
      "Tell me about a data-driven product decision you made.",
      "What is an MVP in your own words?",
      "How do you resolve conflicts between teams wanting different features?",
      "Tell me about a product launch that did not go as planned.",
      "How do you stay informed about competitors?",
      "How do you balance new features with fixing bugs?",
      "How would you validate a new product idea before committing resources?",
    ],
    "QA Engineer": [
      "Explain unit testing, integration testing, and end-to-end testing.",
      "Walk me through creating a test plan for a new feature.",
      "How do you decide which tests to automate?",
      "Tell me about the most important bug you ever found.",
      "How do you test a feature with no documentation?",
      "What is regression testing and why is it important?",
      "Walk me through testing a login page.",
      "How do you ensure quality in a fast-paced agile team?",
      "Tell me about a time you pushed back on releasing a feature.",
      "How do you approach performance testing?",
      `Tell me about your experience with ${techstack || "testing tools like Selenium or Jest"}.`,
      "How do you write a good bug report?",
      "What is exploratory testing?",
      "How do you test an API?",
      "Tell me about a time you improved the testing process.",
    ],
    "Machine Learning Engineer": [
      "Walk me through the full ML project lifecycle.",
      "How do you choose which ML algorithm to use?",
      "What is transfer learning and when would you use it?",
      "Tell me about a model you deployed to production.",
      "How do you monitor a model in production?",
      "What is the difference between batch and real-time predictions?",
      "How would you explain a neural network to a business executive?",
      "What do you do when a model works in testing but fails in production?",
      "How do you manage model versioning and experiments?",
      "What is data drift and model drift?",
      `Tell me about your experience with ${techstack || "TensorFlow or PyTorch"}.`,
      "How do you ensure model fairness?",
      "Simple vs complex model — how do you decide?",
      "Tell me about a feature engineering technique that made a big difference.",
      "How do you handle very large datasets?",
    ],
  };

  const roleBehavioralQuestions = {
    "Frontend Developer": [
      "Tell me about yourself and what got you interested in frontend development.",
      "Walk me through a project you are most proud of.",
      "Describe a time you received critical feedback. How did you handle it?",
      "Tell me about a situation where you had to meet a tight deadline.",
      "How do you handle disagreements with designers or teammates?",
      "Describe a time you had to learn a new framework quickly.",
      "Tell me about a mistake in a project. What did you learn?",
      "How do you stay motivated with repetitive tasks?",
      "Describe explaining a technical concept to a non-technical person.",
      "Tell me about helping a struggling teammate.",
      "How do you handle working on multiple tasks at once?",
      "Where do you see yourself in 3-5 years?",
    ],
    "Backend Developer": [
      "Tell me about yourself and how you got into backend development.",
      "Walk me through your most challenging technical problem.",
      "Describe debugging a production issue under pressure.",
      "Tell me about a disagreement about architecture. How did you resolve it?",
      "How do you handle changing requirements mid-development?",
      "Describe working with a codebase you didn't write.",
      "Tell me about mentoring someone.",
      "How do you prioritize multiple urgent tasks?",
      "Describe improving a process or workflow.",
      "Tell me about a project that failed. What did you learn?",
      "How do you manage stress with production issues?",
      "What motivates you most in your work?",
    ],
    "Full Stack Developer": [
      "Tell me about yourself and what draws you to full-stack development.",
      "Describe your most complex project.",
      "Tell me about learning something new quickly for a project.",
      "How do you balance frontend and backend on a tight schedule?",
      "Describe making a difficult trade-off in a project.",
      "Tell me about a bug that took a long time to find.",
      "How do you communicate technical concepts to non-technical people?",
      "Describe taking initiative to improve something without being asked.",
      "Tell me about working closely with designers or product managers.",
      "How do you handle criticism in code reviews?",
      "Describe managing your time across multiple responsibilities.",
      "What are your long-term career goals?",
    ],
    "Data Scientist": [
      "Tell me about yourself and what attracted you to data science.",
      "Walk me through a data project you're proud of.",
      "Describe when your analysis led to a surprising result.",
      "Tell me about explaining complex findings to non-technical stakeholders.",
      "How do you handle messy or incomplete data?",
      "Describe making a recommendation based on limited data.",
      "Tell me about collaborating with engineers on a data project.",
      "How do you handle methodology disagreements?",
      "Describe balancing speed with thoroughness.",
      "Tell me about a mistake in a data project.",
      "How do you decide between ML vs simpler approaches?",
      "What excites you about the future of data science?",
    ],
    "DevOps Engineer": [
      "Tell me about yourself and what led you to DevOps.",
      "Walk me through the most critical production incident you handled.",
      "Describe automating something that saved significant time.",
      "Tell me about convincing developers to adopt a new tool.",
      "How do you handle on-call pressure?",
      "Describe a deployment that went wrong and how you recovered.",
      "Tell me about learning a new cloud service quickly.",
      "How do you balance speed with reliability?",
      "Describe improving infrastructure security.",
      "Tell me about working with a change-resistant team.",
      "How do you stay current with DevOps tools?",
      "What does your ideal DevOps culture look like?",
    ],
    "Mobile Developer": [
      "Tell me about yourself and how you got into mobile development.",
      "Walk me through a mobile app you're proud of.",
      "Describe fixing a critical app crash affecting many users.",
      "Tell me about an app store rejection.",
      "How do you test on different devices and screen sizes?",
      "Describe working closely with a designer on complex UI.",
      "Tell me about optimizing an app for performance.",
      "How do you gather and use user feedback?",
      "Describe integrating a third-party service into your app.",
      "Tell me about a hard-to-reproduce mobile bug.",
      "How do you keep up with platform changes?",
      "What mobile app would you love to build?",
    ],
    "UI/UX Designer": [
      "Tell me about yourself and why you chose design.",
      "Walk me through your proudest design project.",
      "Describe when user testing revealed something unexpected.",
      "Tell me about pushing back on a design direction from leadership.",
      "How do you design on a tight timeline?",
      "Describe balancing visual appeal with usability.",
      "Tell me about a great collaboration with developers.",
      "How do you design for users different from you?",
      "Describe when data influenced a design decision.",
      "Tell me about a design that didn't work out.",
      "How do you handle conflicting stakeholder feedback?",
      "What design principle do you feel most strongly about?",
    ],
    "Product Manager": [
      "Tell me about yourself and what attracted you to product management.",
      "Walk me through a product you launched.",
      "Describe cutting a feature. How did you justify it?",
      "Tell me about aligning different teams around a product vision.",
      "How do you handle data vs instinct conflicts?",
      "Describe when engineering said something was impossible.",
      "Tell me about identifying a new market opportunity.",
      "How do you communicate bad news to stakeholders?",
      "Describe a product failure. What did you learn?",
      "Tell me about incorporating customer feedback.",
      "How do you stay organized with multiple priorities?",
      "What product problems excite you most?",
    ],
    "QA Engineer": [
      "Tell me about yourself and what drew you to QA.",
      "Walk me through the most impactful bug you found.",
      "Describe pushing back on a release due to quality.",
      "Tell me about a developer disagreeing with your bug report.",
      "How do you test with minimal documentation?",
      "Describe improving the testing process.",
      "Tell me about exploratory testing finding something critical.",
      "How do you stay organized with many test cases?",
      "Describe balancing thoroughness with speed.",
      "Tell me about introducing automation to a team.",
      "How do you handle finding the same bugs repeatedly?",
      "What does quality mean beyond finding bugs?",
    ],
    "Machine Learning Engineer": [
      "Tell me about yourself and how you got into ML.",
      "Walk me through your most interesting ML project.",
      "Describe when a model didn't perform as expected in production.",
      "Tell me about explaining model results to non-technical people.",
      "How do you handle pressure to ship a model quickly?",
      "Describe working closely with data scientists.",
      "Tell me about choosing an ML framework or tool.",
      "How do you ensure ML systems are ethical?",
      "Describe debugging a complex ML pipeline.",
      "Tell me about re-training and re-deploying a model.",
      "How do you communicate the business value of ML?",
      "What area of ML excites you most right now?",
    ],
  };

  const levelQuestions = {
    Junior: [
      "Tell me about projects you worked on during your studies that are relevant to this role.",
      "How do you approach learning a new technology you have never used before?",
      "Describe a group project or team experience. What was your role?",
      "What motivated you to pursue this career path?",
      "How do you handle situations where you are stuck and don't know the answer?",
    ],
    "Mid-Level": [
      "How do you balance mentoring junior members with your own work?",
      "Tell me about leading a technical initiative.",
      "How do you approach technical debt?",
      "Describe pushing back on a senior's decision.",
      "How has your problem-solving approach changed with experience?",
    ],
    Senior: [
      "How do you influence technical direction across your organization?",
      "Walk me through designing a system that scales to millions of users.",
      "How do you balance coding with leadership responsibilities?",
      "Tell me about making a high-stakes decision with incomplete information.",
      "How do you build a culture of engineering excellence?",
    ],
  };

  const universalQuestions = [
    "What is your greatest professional strength?",
    "Tell me about a time you failed. What did you learn?",
    "How do you handle working under pressure?",
    "Describe your ideal work environment.",
    "How do you give and receive constructive feedback?",
  ];

  // Build the question pool
  const normalizedRole = role || "Full Stack Developer";
  const techQs =
    roleTechnicalQuestions[normalizedRole] ||
    roleTechnicalQuestions["Full Stack Developer"];
  const behQs =
    roleBehavioralQuestions[normalizedRole] ||
    roleBehavioralQuestions["Full Stack Developer"];
  const lvlQs = levelQuestions[level] || levelQuestions["Junior"];

  let pool;
  if (/technical/i.test(type)) {
    pool = [...techQs, ...lvlQs.slice(0, 2)];
  } else if (/behav/i.test(type)) {
    pool = [...behQs, ...universalQuestions.slice(0, 3), ...lvlQs];
  } else {
    // Mixed
    pool = [
      ...techQs.slice(0, 8),
      ...behQs.slice(0, 5),
      ...lvlQs.slice(0, 2),
      ...universalQuestions.slice(0, 2),
    ];
  }

  return pool
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(amount, pool.length));
}
