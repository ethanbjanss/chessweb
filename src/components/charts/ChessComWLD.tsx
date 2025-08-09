// src/components/Charts/ChessComWLD.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Record = { win?: number; loss?: number; draw?: number } | undefined;
type Stats = {
  chess_bullet?: { record?: Record };
  chess_blitz?: { record?: Record };
  chess_rapid?: { record?: Record };
  chess_daily?: { record?: Record };
};

const COLORS = ["#10b981", "#ef4444", "#94a3b8"]; // Win, Loss, Draw

export default function ChessComWLD({
  stats,
  control = "chess_blitz",
}: {
  stats: Stats | null;
  control?: keyof Stats;
}) {
  const r = stats?.[control]?.record;
  const data = [
    { name: "Wins", value: r?.win ?? 0 },
    { name: "Losses", value: r?.loss ?? 0 },
    { name: "Draws", value: r?.draw ?? 0 },
  ];
  const total = data.reduce((a, b) => a + b.value, 0);

  return (
    <div className="w-full h-64 rounded-lg border border-stone-200 dark:border-stone-700 p-3">
      <div className="text-sm font-medium mb-2">
        Chess.com — W/L/D ({control.replace("chess_", "")})
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
        <div className="text-sm text-stone-500">No games found.</div>
      )}
    </div>
  );
}
