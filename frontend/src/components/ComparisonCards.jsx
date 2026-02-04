import { useEffect, useState } from "react";
import api from "../api/axios";

function ComparisonCard({ label, current, previous }) {
  const diff = current - previous;
  const isImproved = diff <= 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold">{current.toFixed(2)} kg</p>
        <p className="text-xs text-gray-400">
          Prev: {previous.toFixed(2)} kg
        </p>
      </div>

      <div
        className={`text-lg font-bold ${
          isImproved ? "text-green-600" : "text-red-600"
        }`}
      >
        {isImproved ? "↓" : "↑"} {Math.abs(diff).toFixed(2)}
      </div>
    </div>
  );
}

export default function ComparisonCards() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/activities/comparison").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
      <ComparisonCard
        label="Daily Comparison"
        current={data.daily.current}
        previous={data.daily.previous}
      />
      <ComparisonCard
        label="Weekly Comparison"
        current={data.weekly.current}
        previous={data.weekly.previous}
      />
      <ComparisonCard
        label="Monthly Comparison"
        current={data.monthly.current}
        previous={data.monthly.previous}
      />
    </div>
  );
}
