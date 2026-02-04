import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    api.get("/users/me").then((res) => {
      setUser(res.data);
      setForm({
        name: res.data.name,
        email: res.data.email
      });
    });
  }, []);

  const saveProfile = async () => {
    const res = await api.put("/users/me", form);
    setUser(res.data);
    setEditing(false);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!user) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="icon">👤</div>
          <h2>My Profile</h2>
          <p>Manage your account information</p>
        </div>

        <div className="profile-info">
          <div className="profile-row">
            <label>Name</label>
            {editing ? (
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            ) : (
              <p>{user.name}</p>
            )}
          </div>

          <div className="profile-row">
            <label>Email</label>
            {editing ? (
              <input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            ) : (
              <p>{user.email}</p>
            )}
          </div>

          <div className="profile-row">
            <label>Joined On</label>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="profile-actions">
          {editing ? (
            <>
              <button className="btn-primary" onClick={saveProfile}>
                Save Changes
              </button>
              <button
                className="btn-secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn-primary"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}

          <button className="btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
