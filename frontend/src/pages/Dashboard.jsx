import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import AddActivity from "../components/AddActivity";
import AIRecommendations from "../components/AIRecommendations";
import ActivityList from "../components/ActivityList";
import ComparisonCards from "../components/ComparisonCards";

// Charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// API
import api from "../api/axios";

// Styles
import "../styles/Dashboard.css";

const COLORS = ["#22c55e", "#3b82f6", "#facc15"];

export default function Dashboard() {
  const navigate = useNavigate();

  // ✅ SINGLE SOURCE OF TRUTH
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ ONE refresh function
  const refreshAll = async () => {
    try {
      setLoading(true);

      const [a, s, t] = await Promise.all([
        api.get("/activities"),
        api.get("/analytics/summary?period=monthly"),
        api.get("/analytics/trend"),
      ]);

      setActivities(a.data);
      setSummary(s.data);
      setTrend(t.data);
    } catch (err) {
      console.error("Dashboard refresh failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // ---------------------------
  // 📊 DERIVED DATA FOR CHARTS
  // ---------------------------

  // KPI
  const monthlyCarbon = summary?.totalCarbon || 0;

  // Pie chart: category breakdown
  const pieData =
    summary?.breakdown?.map((item) => ({
      name: item._id,
      value: item.totalCarbon,
    })) || [];

  // Line chart: emission trend
  const lineData =
    trend?.map((item) => ({
      date: item._id, // YYYY-MM-DD
      value: item.totalCarbon,
    })) || [];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* Header */}
        <div className="dashboard-header flex justify-between items-center">
          <div>
            <h1>🌱 Carbon Footprint Dashboard</h1>
            <p>
              Track your emissions, understand your impact, and take steps
              towards a greener future.
            </p>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="text-sm text-emerald-700 font-medium hover:underline"
          >
            Profile
          </button>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <KpiCard title="Monthly CO₂" value={monthlyCarbon} icon="🌍" />
        </div>

        <ComparisonCards />

        <AIRecommendations />

        {/* Charts */}
        <div className="charts-grid">
          {/* Pie Chart */}
          <div className="chart-card">
            <h3>Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="chart-card">
            <h3>Emission Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={lineData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Add Activity */}
        <section style={{ marginTop: "2rem" }}>
          <AddActivity onActivityAdded={refreshAll} />
        </section>

        {/* Activity List */}
        <ActivityList
          activities={activities}
          onRefresh={refreshAll}
          loading={loading}
        />
      </div>
    </div>
  );
}

/* KPI Card */
function KpiCard({ title, value, icon }) {
  return (
    <div className="kpi-card">
      <div>
        <h4>{title}</h4>
        <p>{value} kg</p>
      </div>
      <div className="kpi-icon">{icon}</div>
    </div>
  );
}
