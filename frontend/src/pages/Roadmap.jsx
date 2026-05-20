import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const roadmaps = {
  "Frontend Developer": [
    { step: 1, title: "Internet & Web Basics", desc: "Understand how the internet works, HTTP/HTTPS, DNS, and hosting.", link: "https://www.geeksforgeeks.org/web-development/" },
    { step: 2, title: "HTML & CSS", desc: "Learn semantic HTML, CSS Flexbox, Grid, responsiveness, and accessibility.", link: "https://www.geeksforgeeks.org/html-tutorial/" },
    { step: 3, title: "JavaScript Core", desc: "Master ES6+, DOM manipulation, closures, promises, and async/await.", link: "https://www.geeksforgeeks.org/javascript/" },
    { step: 4, title: "Version Control", desc: "Learn Git and GitHub for tracking changes and collaborating.", link: "https://www.geeksforgeeks.org/git-tutorial/" },
    { step: 5, title: "React.js Ecosystem", desc: "Understand components, hooks (useState, useEffect), and routing.", link: "https://www.geeksforgeeks.org/react-tutorial/" },
    { step: 6, title: "State Management", desc: "Learn Redux, Zustand, or Context API for complex state logic.", link: "https://www.geeksforgeeks.org/redux/" },
    { step: 7, title: "CSS Frameworks", desc: "Use Tailwind CSS or Material UI to build modern interfaces quickly.", link: "https://www.geeksforgeeks.org/tailwind-css/" },
  ],
  "Backend Developer": [
    { step: 1, title: "Programming Language", desc: "Learn Node.js, Python, Java, or Go deeply.", link: "https://www.geeksforgeeks.org/nodejs/" },
    { step: 2, title: "APIs & Architectures", desc: "Build RESTful APIs, understand GraphQL, and gRPC basics.", link: "https://www.geeksforgeeks.org/rest-api-introduction/" },
    { step: 3, title: "Relational Databases", desc: "Learn SQL, PostgreSQL, indexing, and normalization.", link: "https://www.geeksforgeeks.org/sql-tutorial/" },
    { step: 4, title: "NoSQL Databases", desc: "Learn MongoDB, Redis, and when to use document vs key-value stores.", link: "https://www.geeksforgeeks.org/mongodb/" },
    { step: 5, title: "Authentication", desc: "Implement JWT, OAuth, and secure password hashing (Bcrypt).", link: "https://www.geeksforgeeks.org/json-web-token-jwt/" },
    { step: 6, title: "Message Brokers", desc: "Understand async processing with RabbitMQ or Kafka.", link: "https://www.geeksforgeeks.org/apache-kafka/" },
    { step: 7, title: "Deployment & Docker", desc: "Containerize apps and deploy to AWS, Vercel, or Heroku.", link: "https://www.geeksforgeeks.org/docker-tutorial/" },
  ],
  "Full Stack Developer": [
    { step: 1, title: "Frontend Foundation", desc: "Master HTML, CSS, JavaScript, and a framework like React.", link: "https://www.geeksforgeeks.org/react-tutorial/" },
    { step: 2, title: "Backend Foundation", desc: "Learn Node.js/Express or Python/Django for server-side logic.", link: "https://www.geeksforgeeks.org/nodejs/" },
    { step: 3, title: "Database Management", desc: "Learn to design schemas in SQL and NoSQL databases.", link: "https://www.geeksforgeeks.org/sql-tutorial/" },
    { step: 4, title: "API Integration", desc: "Connect frontend and backend using REST or GraphQL APIs.", link: "https://www.geeksforgeeks.org/rest-api-introduction/" },
    { step: 5, title: "Authentication & Security", desc: "Implement secure user login and protect API routes.", link: "https://www.geeksforgeeks.org/json-web-token-jwt/" },
    { step: 6, title: "Version Control & CI/CD", desc: "Use Git, GitHub Actions, and automate your deployments.", link: "https://www.geeksforgeeks.org/git-tutorial/" },
    { step: 7, title: "Cloud Deployment", desc: "Deploy full-stack apps on platforms like AWS, Vercel, or Render.", link: "https://www.geeksforgeeks.org/amazon-web-services-aws/" },
  ],
  "Data Scientist": [
    { step: 1, title: "Math & Statistics", desc: "Learn Probability, Linear Algebra, and Calculus basics.", link: "https://www.geeksforgeeks.org/mathematics-for-machine-learning/" },
    { step: 2, title: "Python Programming", desc: "Master Python syntax, data structures, and functions.", link: "https://www.geeksforgeeks.org/python-programming-language/" },
    { step: 3, title: "Data Manipulation", desc: "Learn Pandas and NumPy for cleaning and processing data.", link: "https://www.geeksforgeeks.org/pandas-tutorial/" },
    { step: 4, title: "Data Visualization", desc: "Use Matplotlib, Seaborn, or Plotly to visualize insights.", link: "https://www.geeksforgeeks.org/data-visualization-with-python/" },
    { step: 5, title: "Machine Learning", desc: "Understand supervised/unsupervised algorithms with Scikit-Learn.", link: "https://www.geeksforgeeks.org/machine-learning/" },
    { step: 6, title: "Deep Learning Basics", desc: "Explore neural networks using TensorFlow or PyTorch.", link: "https://www.geeksforgeeks.org/deep-learning-tutorial/" },
    { step: 7, title: "Deployment", desc: "Deploy models via Flask/FastAPI and monitor performance.", link: "https://www.geeksforgeeks.org/flask-tutorial/" },
  ],
  "DevOps Engineer": [
    { step: 1, title: "OS & Linux Basics", desc: "Master Linux commands, shell scripting, and file systems.", link: "https://www.geeksforgeeks.org/linux-tutorial/" },
    { step: 2, title: "Networking & Security", desc: "Understand TCP/IP, DNS, load balancing, and firewalls.", link: "https://www.geeksforgeeks.org/computer-network-tutorials/" },
    { step: 3, title: "Containers", desc: "Learn Docker to containerize applications efficiently.", link: "https://www.geeksforgeeks.org/docker-tutorial/" },
    { step: 4, title: "Container Orchestration", desc: "Master Kubernetes (K8s) for managing container clusters.", link: "https://www.geeksforgeeks.org/kubernetes-tutorial/" },
    { step: 5, title: "CI/CD Pipelines", desc: "Automate testing and deployment with Jenkins, GitLab CI, or GitHub Actions.", link: "https://www.geeksforgeeks.org/devops-tutorial/" },
    { step: 6, title: "Infrastructure as Code", desc: "Use Terraform or Ansible to provision infrastructure.", link: "https://www.geeksforgeeks.org/introduction-to-terraform/" },
    { step: 7, title: "Monitoring & Logging", desc: "Set up Prometheus, Grafana, and ELK stack for observability.", link: "https://www.geeksforgeeks.org/devops-tutorial/" },
  ],
  "Mobile Developer": [
    { step: 1, title: "Programming Basics", desc: "Learn Dart (for Flutter), Swift (for iOS), or Kotlin (for Android).", link: "https://www.geeksforgeeks.org/flutter-tutorial/" },
    { step: 2, title: "UI Components", desc: "Build responsive layouts and understand the widget/view lifecycle.", link: "https://www.geeksforgeeks.org/flutter-tutorial/" },
    { step: 3, title: "State Management", desc: "Learn Provider, Riverpod, or Redux for managing app state.", link: "https://www.geeksforgeeks.org/flutter-tutorial/" },
    { step: 4, title: "Local Storage", desc: "Use SQLite, Shared Preferences, or Hive for offline data.", link: "https://www.geeksforgeeks.org/android-sqlite-database-in-kotlin/" },
    { step: 5, title: "Networking & APIs", desc: "Fetch data from REST APIs and handle JSON parsing.", link: "https://www.geeksforgeeks.org/rest-api-introduction/" },
    { step: 6, title: "Device Features", desc: "Integrate camera, GPS, and push notifications.", link: "https://www.geeksforgeeks.org/android-tutorial/" },
    { step: 7, title: "App Store Deployment", desc: "Publish apps to Google Play Store and Apple App Store.", link: "https://www.geeksforgeeks.org/android-tutorial/" },
  ],
  "UI/UX Designer": [
    { step: 1, title: "Design Principles", desc: "Understand color theory, typography, spacing, and contrast.", link: "https://www.geeksforgeeks.org/web-designing/" },
    { step: 2, title: "User Research", desc: "Learn how to conduct user interviews, surveys, and create personas.", link: "https://www.geeksforgeeks.org/software-engineering-requirements-elicitation/" },
    { step: 3, title: "Wireframing", desc: "Create low-fidelity wireframes to map out page structure.", link: "https://www.geeksforgeeks.org/wireframing-in-web-design/" },
    { step: 4, title: "UI Design Tools", desc: "Master Figma or Adobe XD for high-fidelity designs.", link: "https://www.geeksforgeeks.org/web-designing/" },
    { step: 5, title: "Prototyping", desc: "Build interactive prototypes to simulate user flows.", link: "https://www.geeksforgeeks.org/web-designing/" },
    { step: 6, title: "Usability Testing", desc: "Test designs with real users and iterate based on feedback.", link: "https://www.geeksforgeeks.org/software-testing-usability-testing/" },
    { step: 7, title: "Developer Handoff", desc: "Prepare design systems and assets for developers.", link: "https://www.geeksforgeeks.org/web-designing/" },
  ],
  "Product Manager": [
    { step: 1, title: "Product Thinking", desc: "Understand market needs, user problems, and value propositions.", link: "https://www.geeksforgeeks.org/product-management/" },
    { step: 2, title: "Agile & Scrum", desc: "Learn agile methodologies, sprints, and backlog grooming.", link: "https://www.geeksforgeeks.org/agile-software-development-and-scrum/" },
    { step: 3, title: "Market Research", desc: "Conduct competitor analysis and define target audiences.", link: "https://www.geeksforgeeks.org/product-management/" },
    { step: 4, title: "Roadmapping", desc: "Prioritize features using frameworks like RICE or MoSCoW.", link: "https://www.geeksforgeeks.org/product-management/" },
    { step: 5, title: "Writing PRDs", desc: "Write clear Product Requirement Documents for engineering teams.", link: "https://www.geeksforgeeks.org/software-engineering-software-requirements-specification-srs/" },
    { step: 6, title: "Data & Metrics", desc: "Track KPIs, OKRs, and use tools like Google Analytics or Mixpanel.", link: "https://www.geeksforgeeks.org/product-management/" },
    { step: 7, title: "Stakeholder Management", desc: "Communicate effectively with engineering, design, and business teams.", link: "https://www.geeksforgeeks.org/product-management/" },
  ],
  "QA Engineer": [
    { step: 1, title: "Testing Fundamentals", desc: "Understand manual testing, test cases, and bug lifecycles.", link: "https://www.geeksforgeeks.org/software-testing-basics/" },
    { step: 2, title: "Agile Testing", desc: "Integrate QA into Agile sprints and CI/CD pipelines.", link: "https://www.geeksforgeeks.org/agile-testing-methodology/" },
    { step: 3, title: "Programming Basics", desc: "Learn Java, Python, or JavaScript for writing automation scripts.", link: "https://www.geeksforgeeks.org/python-programming-language/" },
    { step: 4, title: "UI Automation", desc: "Master Selenium, Cypress, or Playwright for end-to-end testing.", link: "https://www.geeksforgeeks.org/selenium/" },
    { step: 5, title: "API Testing", desc: "Test REST/GraphQL APIs using Postman or REST Assured.", link: "https://www.geeksforgeeks.org/postman-tutorial/" },
    { step: 6, title: "Performance Testing", desc: "Use JMeter or k6 to test application load and stress limits.", link: "https://www.geeksforgeeks.org/software-testing-performance-testing/" },
    { step: 7, title: "Test Management", desc: "Use Jira or TestRail to document and track software defects.", link: "https://www.geeksforgeeks.org/jira-tutorial/" },
  ],
  "Machine Learning Engineer": [
    { step: 1, title: "Math & Statistics", desc: "Master calculus, linear algebra, and statistical modeling.", link: "https://www.geeksforgeeks.org/mathematics-for-machine-learning/" },
    { step: 2, title: "Data Processing", desc: "Learn Pandas, NumPy, and feature engineering techniques.", link: "https://www.geeksforgeeks.org/data-preprocessing-machine-learning/" },
    { step: 3, title: "Machine Learning Algorithms", desc: "Understand Regression, Classification, and Clustering deeply.", link: "https://www.geeksforgeeks.org/machine-learning/" },
    { step: 4, title: "Deep Learning", desc: "Build neural networks using PyTorch or TensorFlow.", link: "https://www.geeksforgeeks.org/deep-learning-tutorial/" },
    { step: 5, title: "NLP or Computer Vision", desc: "Specialize in processing text (Transformers) or images (CNNs).", link: "https://www.geeksforgeeks.org/natural-language-processing-nlp-tutorial/" },
    { step: 6, title: "MLOps & Deployment", desc: "Use Docker, MLflow, and cloud platforms to deploy models.", link: "https://www.geeksforgeeks.org/mlops/" },
    { step: 7, title: "Model Optimization", desc: "Learn techniques like quantization and pruning for faster inference.", link: "https://www.geeksforgeeks.org/machine-learning/" },
  ]
};

const Roadmap = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Frontend Developer");

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans p-6 pb-20 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition group"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="PrepWise" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Roadmaps
            </h1>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Your Tech Career Map 🗺️</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose a domain below to see a step-by-step learning roadmap. Click on "Learn More" to access free resources on GeeksforGeeks to master these skills.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Object.keys(roadmaps).map((domain) => (
            <button
              key={domain}
              onClick={() => setActiveTab(domain)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === domain 
                  ? "bg-pink-500/20 text-pink-400 border border-pink-500/50 shadow-lg shadow-pink-500/20" 
                  : "bg-gray-900 border border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto bg-gray-900/60 border border-gray-800 rounded-3xl p-6 sm:p-10 backdrop-blur shadow-2xl relative">
          <div className="absolute left-10 sm:left-14 top-10 bottom-10 w-1 bg-gray-800 rounded-full hidden sm:block" />
          
          <div className="space-y-8 sm:space-y-12 relative z-10">
            {roadmaps[activeTab].map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start group">
                <div className="hidden sm:flex w-10 h-10 shrink-0 rounded-full bg-pink-500/20 border-2 border-pink-500 items-center justify-center font-bold text-pink-400 z-10 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                  {item.step}
                </div>
                <div className="flex-1 w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 group-hover:border-pink-500/30 transition-all hover:bg-gray-800/80">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="sm:hidden w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </span>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.desc}</p>
                  
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors bg-pink-500/10 px-3 py-1.5 rounded-lg border border-pink-500/20 hover:border-pink-500/50"
                  >
                    <span>Learn More on GeeksforGeeks</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
