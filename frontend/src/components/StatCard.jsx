export default function StatCard({ title, value, unit, icon, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">
            {value} <span className="text-sm font-medium">{unit}</span>
          </h3>
        </div>
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full ${color}`}
        >
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
