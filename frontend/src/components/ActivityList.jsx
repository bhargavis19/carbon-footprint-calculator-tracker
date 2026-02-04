import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ActivityList({ activities, onRefresh, loading }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (activity) => {
    setEditingId(activity._id);
    setEditForm(activity);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    try {
      await api.put(`/activities/${editingId}`, editForm);
      toast.success("Activity updated successfully 🌱");
      cancelEdit();
      onRefresh();
    } catch (err) {
      toast.error("Failed to update activity");
    }
  };

  const deleteActivity = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/activities/${id}`);
      toast.success("Activity deleted");
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete activity");
    }
  };

  if (loading) {
    return <p className="text-gray-500 mt-10">Loading activities...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-10">
      <h3 className="text-lg font-semibold mb-4">
        🧾 Logged Activities
      </h3>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No activities logged yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2 text-left">Category</th>
                <th className="text-left">Type</th>
                <th className="text-left">Value</th>
                <th className="text-left">CO₂ (kg)</th>
                <th className="text-left">Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {activities.map((a) => (
                <tr key={a._id} className="border-b">
                  {editingId === a._id ? (
                    <>
                      <td>
                        <select
                          className="input"
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category: e.target.value,
                            })
                          }
                        >
                          <option value="transport">Transport</option>
                          <option value="energy">Energy</option>
                          <option value="diet">Diet</option>
                        </select>
                      </td>

                      <td>
                        <input
                          className="input"
                          value={editForm.activityType}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              activityType: e.target.value,
                            })
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          className="input"
                          value={editForm.value}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              value: e.target.value,
                            })
                          }
                        />
                      </td>

                      <td>{editForm.carbonKg.toFixed(2)}</td>

                      <td>
                        <input
                          type="date"
                          className="input"
                          value={editForm.date.split("T")[0]}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              date: e.target.value,
                            })
                          }
                        />
                      </td>

                      <td className="text-right space-x-2">
                        <button
                          onClick={saveEdit}
                          className="text-green-600 font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-500"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{a.category}</td>
                      <td>{a.activityType}</td>
                      <td>{a.value}</td>
                      <td>{a.carbonKg.toFixed(2)}</td>
                      <td>{new Date(a.date).toLocaleDateString()}</td>
                      <td className="text-right space-x-3">
                        <button
                          onClick={() => startEdit(a)}
                          className="text-blue-600"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteActivity(a._id)}
                          className="text-red-600"
                        >
                          🗑
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
