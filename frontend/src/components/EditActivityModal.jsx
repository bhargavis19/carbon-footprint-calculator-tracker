import { useState } from "react";
import api from "../api/axios";

export default function EditActivityModal({ activity, onClose, onUpdated }) {
  const [form, setForm] = useState({
    category: activity.category,
    activityType: activity.activityType,
    value: activity.value,
    date: activity.date.split("T")[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.put(`/activities/${activity._id}`, form);
    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
        <h3 className="text-xl font-semibold mb-4">✏️ Edit Activity</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="input"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="transport">Transport</option>
            <option value="energy">Energy</option>
            <option value="diet">diet</option>
          </select>

          <input
            className="input"
            value={form.activityType}
            onChange={(e) =>
              setForm({ ...form, activityType: e.target.value })
            }
          />

          <input
            type="number"
            className="input"
            value={form.value}
            onChange={(e) =>
              setForm({ ...form, value: e.target.value })
            }
          />

          <input
            type="date"
            className="input"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
