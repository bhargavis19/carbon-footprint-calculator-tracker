import { useState } from "react";
import api from "../api/axios";
import "../styles/Activity.css";

export default function AddActivity() {
  const [form, setForm] = useState({
    category: "transport",
    activityType: "car",
    value: "",
    date: new Date().toISOString().split("T")[0]
  });

  const submitActivity = async () => {
    try {
      await api.post("/activities", {
        ...form,
        value: Number(form.value)
      });
      alert("Activity added successfully");
      setForm({ ...form, value: "" });
    } catch {
      alert("Failed to add activity");
    }
  };

  const quickAdd = async (category, activityType, value) => {
    try {
      await api.post("/activities", {
        category,
        activityType,
        value,
        date: new Date().toISOString().split("T")[0]
      });
      alert("Quick activity added");
    } catch {
      alert("Quick add failed");
    }
  };

  return (
    <div className="activity-card">
      <h3>➕ Add Daily Activity</h3>
      <p>Log your activities to track carbon emissions</p>

      {/* QUICK ADD */}
      <div className="quick-buttons">
        <button onClick={() => quickAdd("transport", "car", 10)}>
          🚗 Car (10 km)
        </button>
        <button onClick={() => quickAdd("energy", "electricity", 5)}>
          ⚡ Electricity (5 kWh)
        </button>
        <button onClick={() => quickAdd("diet", "beef", 1)}>
          🍖 Beef Meal
        </button>
      </div>

      {/* FORM */}
      <div className="activity-form">
        <div>
          <label>Category</label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="transport">Transport</option>
            <option value="energy">Energy</option>
            <option value="diet">diet</option>
          </select>
        </div>

        <div>
          <label>Activity Type</label>
          <input
            placeholder="car / electricity / beef"
            value={form.activityType}
            onChange={(e) =>
              setForm({ ...form, activityType: e.target.value })
            }
          />
        </div>

        <div>
          <label>Value (km / kWh / meals)</label>
          <input
            type="number"
            value={form.value}
            onChange={(e) =>
              setForm({ ...form, value: e.target.value })
            }
          />
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />
        </div>

        <button onClick={submitActivity}>Add Activity</button>
      </div>
    </div>
  );
}
