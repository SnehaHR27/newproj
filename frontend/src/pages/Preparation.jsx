import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const qaBank = {
  "Frontend Developer": [
    { q: "What is the difference between Virtual DOM and Real DOM in React?", a: "The Virtual DOM is a lightweight JavaScript representation of the Real DOM. React uses it to optimize updates: when state changes, React updates the Virtual DOM first, compares it with the previous version (diffing), and then applies only the exact changes to the Real DOM (reconciliation). This minimizes expensive DOM manipulations." },
    { q: "Explain CSS Specificity.", a: "CSS Specificity is the set of rules applied by browsers to determine which CSS styles apply to an element when multiple conflicting styles exist. It's calculated using a point system: Inline styles > IDs > Classes/Attributes/Pseudo-classes > Elements/Pseudo-elements. The most specific rule wins." },
    { q: "What are closures in JavaScript?", a: "A closure is a feature in JavaScript where an inner function has access to the outer (enclosing) function's variables, even after the outer function has returned. This is often used for data privacy and creating factory functions." },
    { q: "How does Event Delegation work?", a: "Event delegation is a technique involving adding event listeners to a parent element instead of adding them to the descendant elements. The listener will fire whenever the event is triggered on the descendant elements due to event bubbling up the DOM." },
    { q: "Explain the difference between '==' and '===' in JavaScript.", a: "'==' checks for value equality with type coercion (e.g., 1 == '1' is true), while '===' checks for strict equality without type coercion (e.g., 1 === '1' is false). It's generally best practice to use '===' to avoid unexpected bugs." },
    { q: "What is the Box Model in CSS?", a: "The CSS box model is a box that wraps around every HTML element. It consists of: margins, borders, padding, and the actual content. Understanding it is crucial for layout and design." },
    { q: "How do you optimize a website's performance?", a: "Key strategies include: minimizing HTTP requests, using CDNs, compressing images, lazy loading assets, minifying CSS/JS files, using browser caching, and reducing DOM size." },
    { q: "What are React Hooks?", a: "Hooks are functions that let you 'hook into' React state and lifecycle features from function components. Common hooks include useState, useEffect, useContext, and useMemo." },
    { q: "Explain semantic HTML and why it's important.", a: "Semantic HTML introduces meaning to the web page rather than just presentation (e.g., using <article>, <nav>, <header> instead of <div>). It improves accessibility for screen readers, SEO, and code maintainability." },
    { q: "What is the difference between local storage, session storage, and cookies?", a: "Local Storage stores data with no expiration date (persistent). Session Storage stores data for one session (deleted when tab closes). Cookies store data that has to be sent back to the server with subsequent HTTP requests, and have a set expiration." }
  ],
  "Backend Developer": [
    { q: "What are the key differences between SQL and NoSQL?", a: "SQL databases (like PostgreSQL) are relational, use structured schemas, and scale vertically. They are great for complex queries and ACID transactions. NoSQL databases (like MongoDB) are non-relational, document-based, flexible in schema, and scale horizontally, making them ideal for unstructured data and rapid development." },
    { q: "How does JWT authentication work?", a: "JWT (JSON Web Token) is a stateless authentication mechanism. The server verifies user credentials and issues a signed JWT. The client stores it (usually in HttpOnly cookies or localStorage) and sends it in the Authorization header of subsequent requests. The server verifies the signature without needing to look up the session in a database." },
    { q: "Explain RESTful API principles.", a: "REST relies on stateless, client-server communication. It uses standard HTTP methods (GET, POST, PUT, DELETE, PATCH), utilizes URIs to identify resources, and expects responses in standard formats like JSON or XML." },
    { q: "What is a reverse proxy?", a: "A reverse proxy is a server that sits in front of web servers and forwards client requests to those web servers. It is used to increase security, performance (caching, load balancing), and reliability." },
    { q: "What is the event loop in Node.js?", a: "The event loop is what allows Node.js to perform non-blocking I/O operations despite being single-threaded. It offloads operations to the system kernel whenever possible and executes callbacks when the operations complete." },
    { q: "How do you prevent SQL Injection?", a: "SQL Injection is prevented by using parameterized statements or prepared statements instead of directly concatenating user input into SQL queries. ORMs (like Prisma or Sequelize) handle this automatically." },
    { q: "What is database normalization?", a: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller ones and defining relationships between them." },
    { q: "Explain CORS.", a: "Cross-Origin Resource Sharing (CORS) is a security feature implemented by browsers that restricts web pages from making requests to a different domain than the one that served the web page. Backend servers configure CORS headers to explicitly allow specific domains." },
    { q: "What is a message broker and why use one?", a: "A message broker (like RabbitMQ or Kafka) is software that enables applications to communicate with each other by exchanging messages. It is used to decouple services, handle asynchronous processing, and manage high loads." },
    { q: "How do you handle scaling a backend application?", a: "Scaling can be vertical (adding more CPU/RAM to a server) or horizontal (adding more servers). Horizontal scaling involves load balancers, stateless architectures, database read replicas, and caching layers like Redis." }
  ],
  "Full Stack Developer": [
    { q: "How do you decide what logic lives on the frontend vs the backend?", a: "Backend should handle data persistence, security, authentication, and complex business logic. Frontend should handle UI rendering, user interactions, local state, and form validation for UX purposes. Never trust frontend validation for security." },
    { q: "Explain the concept of SSR vs CSR.", a: "Server-Side Rendering (SSR) generates the full HTML on the server before sending it to the client, which is great for SEO and initial load time. Client-Side Rendering (CSR) sends a bare HTML file and JavaScript bundles, letting the browser render the content, which is great for rich, interactive apps." },
    { q: "How do you handle state across a full-stack application?", a: "State exists in multiple layers: DB (persistent state), Backend (session state/cache), and Frontend (UI state). You sync them using APIs (REST/GraphQL). Tools like React Query or Apollo help manage remote state on the frontend, while Redux handles local state." },
    { q: "What is a Webhook?", a: "A webhook is a way for an app to provide other applications with real-time information. Unlike an API where you poll for data, a webhook delivers data to a specific URL immediately as it happens (e.g., Stripe sending a payment success webhook)." },
    { q: "Explain the MVC pattern.", a: "Model-View-Controller (MVC) separates an application into three logical components: Model (data and logic), View (UI and presentation), and Controller (handles user input and updates Model and View)." },
    { q: "How do you debug an issue that spans from frontend to backend?", a: "I start by isolating the problem. Check the browser's network tab to see the exact request and response. Check frontend console for errors. Then look at backend server logs and database queries to trace the flow of data." },
    { q: "What is an ORM?", a: "Object-Relational Mapping (ORM) is a technique that lets you query and manipulate data from a database using an object-oriented paradigm. Examples include Prisma, Sequelize, and TypeORM. It abstracts raw SQL." },
    { q: "How do you ensure secure communication between client and server?", a: "Use HTTPS for encrypted transit. Implement robust authentication (like JWT or sessions), validate all inputs on the backend, prevent CSRF using tokens, and configure CORS correctly." },
    { q: "What is the purpose of Docker in a full-stack project?", a: "Docker containerizes applications, ensuring they run consistently across different environments (dev, staging, prod). It bundles the app, its dependencies, and environment variables into an isolated container." },
    { q: "Describe your deployment strategy for a MERN stack app.", a: "I typically deploy the React frontend on a CDN like Vercel or Netlify. The Express backend goes on a platform like Heroku, Render, or AWS EC2. The MongoDB database is hosted on MongoDB Atlas." }
  ],
  "Data Scientist": [
    { q: "Explain the difference between supervised and unsupervised learning.", a: "Supervised learning uses labeled data to train a model to map inputs to outputs (e.g., predicting house prices). Unsupervised learning uses unlabeled data to find hidden patterns or groupings (e.g., customer segmentation via clustering)." },
    { q: "What is the Bias-Variance tradeoff?", a: "Bias is error from overly simplistic models (underfitting). Variance is error from overly complex models that memorize noise (overfitting). The tradeoff is balancing the two to create a model that generalizes well to unseen data." },
    { q: "How do you handle missing values in a dataset?", a: "Depending on the context, you can: drop rows/columns with missing data, impute them with mean/median/mode, use predictive modeling to fill them, or flag them as a separate category if the missingness is informative." },
    { q: "What is a Confusion Matrix?", a: "It's a table used to evaluate classification models. It shows True Positives, True Negatives, False Positives (Type I error), and False Negatives (Type II error), allowing calculation of Precision, Recall, and F1-Score." },
    { q: "Explain cross-validation.", a: "Cross-validation is a technique to assess how a model will generalize to an independent dataset. K-Fold CV splits data into 'k' subsets, trains the model on k-1 subsets, and validates on the remaining one, repeating this 'k' times." },
    { q: "What is the difference between L1 and L2 regularization?", a: "L1 (Lasso) adds the absolute value of coefficients as a penalty term, which can shrink some coefficients to exactly zero (feature selection). L2 (Ridge) adds the squared magnitude of coefficients, shrinking them but rarely to zero." },
    { q: "What is p-value?", a: "In hypothesis testing, the p-value is the probability of obtaining test results at least as extreme as the results actually observed, assuming the null hypothesis is true. A smaller p-value (< 0.05) strongly rejects the null hypothesis." },
    { q: "How does a Random Forest work?", a: "It is an ensemble learning method that builds multiple decision trees during training and outputs the mode of the classes (classification) or mean prediction (regression) of the individual trees, reducing overfitting." },
    { q: "What is A/B testing?", a: "A randomized experiment with two variants, A and B. It is used to test changes to a web page or product to determine which variant performs better for a given conversion goal based on statistical significance." },
    { q: "Explain Principal Component Analysis (PCA).", a: "PCA is a dimensionality reduction technique that transforms a large set of variables into a smaller one that still contains most of the information. It does this by creating new, uncorrelated variables (principal components) that maximize variance." }
  ],
  "DevOps Engineer": [
    { q: "What is CI/CD?", a: "Continuous Integration (CI) automates the merging and testing of code. Continuous Deployment/Delivery (CD) automates the release of that code to production or staging environments. It ensures faster, safer releases." },
    { q: "Explain the concept of Infrastructure as Code (IaC).", a: "IaC manages and provisions computing infrastructure through machine-readable definition files (like Terraform or Ansible) rather than physical hardware configuration or interactive configuration tools." },
    { q: "What is the difference between a virtual machine and a container?", a: "A VM includes a full guest operating system and virtualized hardware, making it heavy. A container (like Docker) shares the host OS kernel and isolates processes, making it lightweight, fast to start, and portable." },
    { q: "Explain the architecture of Kubernetes.", a: "Kubernetes has a Control Plane (API server, scheduler, controller manager, etcd) that manages the cluster, and Worker Nodes (kubelet, kube-proxy, container runtime) that run the actual applications inside Pods." },
    { q: "How do you achieve Zero Downtime Deployment?", a: "Using strategies like Blue-Green deployments (switching traffic from old environment to identical new environment) or Canary releases (rolling out changes to a small percentage of users before full rollout)." },
    { q: "What is GitOps?", a: "GitOps is an operational framework that takes DevOps practices used for application development (like version control and CI/CD) and applies them to infrastructure automation, using Git as the single source of truth." },
    { q: "How do you handle secret management?", a: "Secrets (API keys, passwords) should never be hardcoded or stored in Git. Use tools like HashiCorp Vault, AWS Secrets Manager, or Kubernetes Secrets to inject them into applications securely at runtime." },
    { q: "What is Prometheus used for?", a: "Prometheus is an open-source systems monitoring and alerting toolkit. It records real-time metrics in a time series database built using a pull model, with flexible queries and real-time alerting." },
    { q: "Explain what a Load Balancer does.", a: "A load balancer distributes incoming network traffic across multiple servers to ensure no single server bears too much demand. This improves responsiveness and availability of applications." },
    { q: "What is the 'Shift Left' principle?", a: "Shift Left means integrating practices like testing, security, and quality assurance earlier in the software development lifecycle (moving them 'left' on the project timeline) to catch issues sooner when they are cheaper to fix." }
  ],
  "Mobile Developer": [
    { q: "What is the difference between Native, Hybrid, and Cross-Platform development?", a: "Native (Swift/Kotlin) uses platform-specific tools for highest performance. Hybrid (Ionic/Cordova) wraps web apps in a native shell. Cross-Platform (Flutter/React Native) uses one codebase to compile or render native UI components." },
    { q: "How does the widget tree work in Flutter?", a: "In Flutter, everything is a widget. The widget tree is a hierarchical structure of widgets. Flutter uses three trees: Widget tree (configuration), Element tree (lifecycle/state), and RenderObject tree (layout/painting)." },
    { q: "Explain state management in React Native.", a: "State can be managed locally within components using useState/useReducer. For global state across the app, tools like Redux, Zustand, or Context API are used to avoid prop drilling." },
    { q: "How do you handle memory management in mobile apps?", a: "Avoid memory leaks by properly removing event listeners, closing database connections, managing large image sizes/caches, and understanding the garbage collection behavior of the language used." },
    { q: "What are Push Notifications and how do they work?", a: "Push notifications alert users outside the app. The app registers with a service (APNs for iOS, FCM for Android) to get a token. The backend sends a payload to the service using this token, which delivers it to the device." },
    { q: "Explain deep linking.", a: "Deep linking allows a URL to open a specific screen inside a mobile app rather than a web browser. Universal Links (iOS) and App Links (Android) verify domain ownership for a seamless experience." },
    { q: "How do you handle offline functionality?", a: "Use local databases (SQLite, CoreData, Hive, WatermelonDB) to cache data. Implement a sync mechanism that saves user actions locally and pushes them to the server when the network is restored." },
    { q: "What is the app lifecycle?", a: "It's the series of states an app goes through: not running, foreground (active/inactive), background, and suspended. Developers must handle transitions, like pausing video when moving to the background." },
    { q: "How do you optimize mobile app performance?", a: "Optimize images, use FlatList/ListView for long lists (recycling views), minimize re-renders, reduce bundle size, and offload heavy computations to background threads." },
    { q: "What is the process of publishing an app?", a: "You must generate release builds, sign them with production certificates/keystores, prepare store assets (screenshots, descriptions), and submit them for review on the App Store Connect or Google Play Console." }
  ],
  "UI/UX Designer": [
    { q: "What is the difference between UI and UX?", a: "UX (User Experience) focuses on the overall feel, flow, and problem-solving aspect of the user journey. UI (User Interface) focuses on the visual design, layout, colors, typography, and interactive elements of the product." },
    { q: "What is Design Thinking?", a: "It is an iterative, user-centric process for solving problems. The five phases are: Empathize (understand users), Define (state the problem), Ideate (brainstorm solutions), Prototype (build models), and Test (gather feedback)." },
    { q: "Explain the concept of accessibility in design.", a: "Accessibility ensures products are usable by people with disabilities (visual, auditory, motor, cognitive). This involves using high contrast colors, readable fonts, alt text, and designing for screen readers (WCAG guidelines)." },
    { q: "What is a Wireframe vs a Prototype?", a: "A wireframe is a low-fidelity, static layout outlining structure and elements (like a blueprint). A prototype is a high-fidelity, interactive model that simulates the final user experience." },
    { q: "What is a Design System?", a: "A design system is a collection of reusable components, guidelines, and assets (colors, typography) that ensure consistency across a product and speed up the design-to-development workflow." },
    { q: "How do you conduct User Research?", a: "I use a mix of qualitative methods (interviews, usability testing, observation) and quantitative methods (surveys, A/B testing, analytics) to understand user needs, pain points, and behaviors." },
    { q: "What is a User Persona?", a: "A user persona is a fictional character created based on research to represent a specific user type. It helps the team empathize with users and make design decisions tailored to their goals and frustrations." },
    { q: "Explain the 80/20 rule (Pareto Principle) in design.", a: "It suggests that 80% of consequences come from 20% of causes. In UX, it means 80% of users will only use 20% of features. Designers should focus on optimizing the most critical 20%." },
    { q: "What is Information Architecture (IA)?", a: "IA is the structural design of shared information environments. It involves organizing, labeling, and navigating content so users can easily find what they are looking for." },
    { q: "How do you handle negative feedback on your designs?", a: "I detach my ego from the work. I treat feedback as data. I ask clarifying questions to understand the root of the feedback, check if it aligns with user goals, and iterate on the design accordingly." }
  ],
  "Product Manager": [
    { q: "How do you prioritize features for a product roadmap?", a: "I use frameworks like RICE (Reach, Impact, Confidence, Effort) or MoSCoW (Must have, Should have, Could have, Won't have) to balance user value against engineering effort and business goals." },
    { q: "What is an MVP?", a: "A Minimum Viable Product (MVP) is the simplest version of a product that can be released to gather maximum validated learning about customers with the least effort. It focuses on core functionality." },
    { q: "How do you say 'no' to a stakeholder requesting a feature?", a: "I acknowledge their request, then explain how it fits (or doesn't fit) into the current strategic goals or roadmap based on data, user impact, and engineering capacity. I offer to put it in the backlog for future review." },
    { q: "What is the difference between Agile and Waterfall?", a: "Waterfall is linear and sequential, where each phase must be completed before the next begins. Agile is iterative and flexible, delivering work in small increments (sprints) and adapting to feedback rapidly." },
    { q: "How do you measure product success?", a: "By tracking Key Performance Indicators (KPIs) aligned with business goals. These could be user acquisition, activation rate, daily active users (DAU), churn rate, Net Promoter Score (NPS), or revenue." },
    { q: "What makes a good user story?", a: "A good user story follows the INVEST criteria: Independent, Negotiable, Valuable, Estimable, Small, and Testable. It's usually formatted as: 'As a [user], I want [action] so that [benefit].'" },
    { q: "How do you balance technical debt with new features?", a: "I allocate a percentage of every sprint (e.g., 20%) specifically for addressing technical debt, refactoring, and bugs, ensuring the platform remains stable enough to support future feature velocity." },
    { q: "What is Product-Market Fit?", a: "It's the degree to which a product satisfies a strong market demand. It means you have built a product that creates significant value for a specific group of users, leading to organic growth and retention." },
    { q: "How do you conduct customer interviews?", a: "I focus on discovering problems, not validating solutions. I ask open-ended questions about their past behaviors (e.g., 'Tell me about the last time you tried to solve X') rather than hypothetical questions." },
    { q: "What is the role of a PM vs a Product Owner?", a: "A PM focuses externally on market research, strategy, product vision, and customer needs. A Product Owner (in Scrum) focuses internally on the development team, managing the backlog, and ensuring stories are executed." }
  ],
  "QA Engineer": [
    { q: "What is the difference between Manual Testing and Automation Testing?", a: "Manual testing requires human intervention to execute test cases and explore the app for visual/UX issues. Automation uses scripts/tools to execute repetitive, regression, and load tests quickly and reliably." },
    { q: "Explain the different levels of software testing.", a: "1. Unit Testing (testing individual components/functions). 2. Integration Testing (testing how components interact). 3. System Testing (testing the entire system). 4. Acceptance Testing (validating against business requirements)." },
    { q: "What is a Regression Test?", a: "Regression testing involves re-running functional and non-functional tests to ensure that previously developed and tested software still performs after a change, bug fix, or new feature addition." },
    { q: "What should be included in a good bug report?", a: "A clear title, environment details (OS, browser, app version), exact steps to reproduce, expected result, actual result, severity/priority, and attachments (screenshots, logs, or videos)." },
    { q: "What is the difference between Verification and Validation?", a: "Verification checks if the product is being built right (does it meet the specifications/requirements?). Validation checks if the right product is being built (does it meet the user's actual needs?)." },
    { q: "Explain the Test Pyramid.", a: "The Test Pyramid suggests that you should have a large number of fast, cheap Unit Tests at the bottom, fewer Integration/Service Tests in the middle, and a very small number of slow, brittle UI/End-to-End tests at the top." },
    { q: "What is API Testing?", a: "API testing involves testing the application programming interfaces directly for functionality, reliability, performance, and security. Tools like Postman or REST Assured are used to verify HTTP requests and JSON responses." },
    { q: "What is the difference between Severity and Priority?", a: "Severity is the impact of the bug on the system (e.g., app crash is high severity). Priority is the urgency to fix the bug (e.g., a typo on the homepage is low severity but high priority for business)." },
    { q: "How do you decide what to automate?", a: "Automate repetitive tasks, stable features, high-risk areas, and regression suites. Do not automate features that are constantly changing, exploratory tests, or tests that require visual confirmation." },
    { q: "What is Exploratory Testing?", a: "Exploratory testing is an approach where test design and execution happen simultaneously without predefined test scripts. The tester actively explores the application to find edge cases and unscripted bugs." }
  ],
  "Machine Learning Engineer": [
    { q: "What is the difference between a Data Scientist and an ML Engineer?", a: "Data Scientists focus on analyzing data, building prototypes, and extracting business insights. ML Engineers focus on the software engineering aspect: optimizing, scaling, and deploying those models into production environments." },
    { q: "What is Overfitting and how do you prevent it?", a: "Overfitting occurs when a model learns noise in the training data rather than the underlying pattern, performing poorly on new data. Prevent it using cross-validation, regularization (L1/L2), dropout (in neural nets), or getting more data." },
    { q: "Explain Gradient Descent.", a: "Gradient descent is an optimization algorithm used to minimize the cost function of a model. It calculates the gradient (slope) of the error with respect to the weights, and updates the weights in the opposite direction to reach the minimum error." },
    { q: "What is an Epoch, Batch, and Iteration?", a: "An Epoch is one complete pass through the entire training dataset. A Batch is a subset of the dataset processed simultaneously. Iterations are the number of batches needed to complete one Epoch." },
    { q: "How do you handle imbalanced datasets?", a: "Techniques include oversampling the minority class (e.g., SMOTE), undersampling the majority class, using class weights in the loss function, or using evaluation metrics like F1-score or AUROC instead of accuracy." },
    { q: "What is the vanishing gradient problem?", a: "In deep neural networks, gradients can become extremely small during backpropagation, causing earlier layers to learn very slowly or not at all. Solved by using ReLU activation functions, Batch Normalization, or ResNets." },
    { q: "Explain Transfer Learning.", a: "Transfer learning takes a pre-trained model on a large dataset (like ImageNet or BERT) and fine-tunes it on a smaller, specific dataset. It saves massive amounts of compute time and requires less training data." },
    { q: "What is MLOps?", a: "MLOps (Machine Learning Operations) is a set of practices combining ML, DevOps, and Data Engineering to deploy and maintain ML systems reliably and efficiently in production. It handles tracking, versioning, monitoring, and CI/CD for models." },
    { q: "How do you detect Model Drift?", a: "Model drift (or data drift) happens when the statistical properties of the target variable or input data change over time, reducing model accuracy. It's detected by continuously monitoring the model's predictions and performance metrics in production." },
    { q: "What are embeddings in NLP?", a: "Embeddings are dense vector representations of words or phrases in a continuous vector space where similar words have similar vectors. They capture semantic meaning (e.g., Word2Vec, GloVe, or BERT embeddings)." }
  ]
};

const Preparation = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState("Frontend Developer");

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans p-6 pb-20 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition group"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="PrepWise" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Interview Prep
            </h1>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Master Your Interview 📚</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Study these frequently asked questions and model answers to prepare for your AI mock interview and real-world job interviews. We've compiled the top 10 questions for every major tech role.
          </p>
        </div>

        {/* Roles Sidebar + Content Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-72 flex-shrink-0 flex flex-col gap-2 h-auto md:max-h-[70vh] md:overflow-y-auto pr-2 custom-scrollbar">
            {Object.keys(qaBank).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`text-left px-5 py-4 rounded-xl font-bold transition-all ${
                  activeRole === role
                    ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/10 text-yellow-400 border border-yellow-500/50 shadow-lg shadow-yellow-500/10"
                    : "bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800 hover:border-gray-700 hover:text-white"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Q&A Content */}
          <div className="flex-1 space-y-6 md:max-h-[75vh] md:overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-gray-900/40 border border-yellow-500/20 rounded-2xl p-6 mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{activeRole} Q&A</h3>
              <p className="text-gray-400 text-sm">Review these 10 core concepts before starting your mock interview.</p>
            </div>

            {qaBank[activeRole].map((qa, idx) => (
              <div key={idx} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur group hover:border-yellow-500/30 transition-all shadow-lg hover:shadow-yellow-500/5">
                <div className="flex gap-4">
                  <span className="text-2xl font-black text-gray-700 group-hover:text-yellow-500/50 transition-colors mt-1">
                    Q{idx + 1}.
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-4 leading-snug">{qa.q}</h3>
                    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50 rounded-l-xl"></div>
                      <p className="text-sm text-gray-300 leading-relaxed pl-2">
                        <strong className="text-yellow-400 mr-2 block mb-1">Ideal Answer:</strong> 
                        {qa.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-10 text-center p-8 border border-dashed border-gray-700 rounded-2xl bg-gray-900/30">
              <p className="text-gray-400 mb-5">Ready to test your knowledge in a simulated environment?</p>
              <button 
                onClick={() => navigate("/practice")}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/20 text-white hover:scale-105"
              >
                Start Mock Interview →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Preparation;
