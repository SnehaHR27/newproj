const Interview = require("../models/Interview");

exports.saveInterview = async (req, res) => {
  try {
    const { userId, role, level, score, rating, feedbackSummary } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const interview = new Interview({
      userId,
      role,
      level,
      score,
      rating,
      feedbackSummary,
    });

    await interview.save();
    res.status(201).json({ success: true, interview });
  } catch (error) {
    console.error("Save interview error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserInterviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const interviews = await Interview.find({ userId }).sort({ createdAt: 1 });
    res.json({ success: true, interviews });
  } catch (error) {
    console.error("Get interviews error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
