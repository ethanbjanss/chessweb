// src/components/Charts/LichessWLD.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Counts = { win?: number; loss?: number; draw?: number } | undefined;
type User = { count?: Counts } | null;

const COLORS = ["#10b981", "#ef4444", "#94a3b8"];

export default function LichessWLD({ user }: { user: User }) {
  const c = user?.count;
  const data = [
    { name: "Wins", value: c?.win ?? 0 },
    { name: "Losses", value: c?.loss ?? 0 },
    { name: "Draws", value: c?.draw ?? 0 },
  ];
  const total = data.reduce((a, b) => a + b.value, 0);

  return (
    <div className="w-full h-64 rounded-lg border border-stone-700 p-3 bg-[#2f2d2a]">
      <div className="text-sm font-medium mb-2 text-stone-100">
        Lichess — W/L/D
      </div>
      {total ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-sm text-stone-400">No games found.</div>
      )}
    </div>
  );
}
