import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AIRecommendations() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/ai/recommendations")
      .then((res) => setText(res.data.recommendations))
      .catch(() => setText("AI recommendations unavailable."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl shadow-lg p-6 mt-10">
      <h3 className="text-xl font-bold text-emerald-700 mb-2">
        🤖 AI Sustainability Insights
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        Personalized tips based on your carbon footprint
      </p>

      {loading ? (
        <p className="text-gray-500">Analyzing your activities...</p>
      ) : (
        <div className="bg-white rounded-xl p-4 text-gray-700 whitespace-pre-line">
          {text}
        </div>
      )}
    </div>
  );
}
