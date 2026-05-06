import React from "react";

const getRatingColor = (rating) => {
  switch (rating) {
    case "Excellent": return "text-green-400";
    case "Good": return "text-blue-400";
    case "Average": return "text-yellow-400";
    case "Needs Improvement": return "text-orange-500";
    case "Poor": return "text-red-500";
    default: return "text-gray-400";
  }
};

const getScoreBg = (score) => {
  if (score >= 8) return "bg-green-500/20 border-green-500/50 text-green-400";
  if (score >= 6) return "bg-blue-500/20 border-blue-500/50 text-blue-400";
  if (score >= 4) return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
  return "bg-red-500/20 border-red-500/50 text-red-400";
};

const FeedbackCard = ({ feedback, expanded = false }) => (
  <div className="rounded-2xl border border-gray-700 bg-gray-900 overflow-hidden w-full max-w-[85%] text-sm shadow-xl mt-2">
    <div className="flex items-center justify-between px-5 py-3 bg-gray-800 border-b border-gray-700">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">AI Feedback</span>
      <div className="flex items-center gap-3">
        <span className={`font-bold text-sm ${getRatingColor(feedback.rating)}`}>{feedback.rating}</span>
        <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${getScoreBg(feedback.score)}`}>
          {feedback.score}/10
        </span>
      </div>
    </div>

    <div className="p-5 space-y-5">
      {feedback.fillerWordsCount > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
          <p className="text-sm font-bold text-orange-400 mb-1.5 flex items-center gap-2">🗣️ Speaking Fluency</p>
          <p className="text-xs text-gray-300 mb-3">
            You used <strong className="text-orange-400">{feedback.fillerWordsCount}</strong> filler word{feedback.fillerWordsCount === 1 ? "" : "s"}. Try pausing instead of filling the silence!
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(feedback.fillerWordsUsed || {}).map(([word, count]) => (
              <span key={word} className="px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-400 font-medium">
                "{word}": <strong className="text-orange-400">{count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {feedback.behaviorTips?.length > 0 && (
        <div>
          <p className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">🎯 Behavior & Delivery Tips</p>
          <ul className="space-y-1.5">
            {feedback.behaviorTips.map((tip, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-blue-400 flex-shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.strengths?.length > 0 && (
        <div>
          <p className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">✅ What You Did Well</p>
          <ul className="space-y-1.5">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-green-400 flex-shrink-0 mt-0.5">+</span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.corrections?.length > 0 && (
        <div>
          <p className="text-sm font-bold text-orange-400 mb-2 flex items-center gap-2">✏️ Where to Correct</p>
          <ul className="space-y-1.5">
            {feedback.corrections.map((c, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-orange-400 flex-shrink-0 mt-0.5">→</span>
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(expanded || feedback.idealAnswer) && feedback.idealAnswer && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
          <p className="text-sm font-bold text-yellow-400 mb-1.5 flex items-center gap-2">💡 Model Answer</p>
          <p className="text-xs text-gray-300 leading-relaxed italic">"{feedback.idealAnswer}"</p>
        </div>
      )}

      {feedback.encouragement && (
        <p className="text-xs text-cyan-400 italic font-medium pt-2 border-t border-gray-800">
          {feedback.encouragement}
        </p>
      )}
    </div>
  </div>
);

export { getRatingColor, getScoreBg };
export default FeedbackCard;
