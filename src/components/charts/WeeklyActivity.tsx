// src/components/Charts/WeeklyActivity.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeeklyActivity({
  timestamps,
}: {
  timestamps: number[];
}) {
  const counts = Array(7).fill(0);
  for (const t of timestamps) counts[new Date(t).getDay()]++;

  const data = DAYS.map((d, i) => ({ day: d, games: counts[i] }));

  return (
    <div className="w-full h-56 rounded-lg border border-stone-700 p-3 bg-[#2f2d2a]">
      <div className="text-sm font-medium mb-2 text-stone-100">
        Games by Weekday
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="#cbd5e1" />
          <YAxis allowDecimals={false} stroke="#cbd5e1" />
          <Tooltip />
          <Bar dataKey="games" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
