const express = require("express");
const router = express.Router();
const interviewController = require("../controllers/interviewController");

router.post("/save", interviewController.saveInterview);
router.get("/user/:userId", interviewController.getUserInterviews);

module.exports = router;
