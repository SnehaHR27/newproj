const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Route to generate interview questions
router.post("/generate-questions", aiController.generateQuestions);

// Route to evaluate a single answer (multimodal + filler words)
router.post("/evaluate", aiController.evaluateAnswer);

module.exports = router;
