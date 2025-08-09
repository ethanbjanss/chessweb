// src/components/Charts/ChessComTacticsBar.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Tactics =
  | { highest?: { rating?: number }; lowest?: { rating?: number } }
  | undefined;
type RushBest = { score?: number; total_attempts?: number } | undefined;
type Stats = {
  tactics?: Tactics;
  puzzle_rush?: { best?: RushBest };
} | null;

export default function ChessComTacticsBar({ stats }: { stats: Stats }) {
  const high = stats?.tactics?.highest?.rating ?? 0;
  const low = stats?.tactics?.lowest?.rating ?? 0;
  const rush = stats?.puzzle_rush?.best?.score ?? 0;

  const data = [
    { name: "Tactics High", value: high },
    { name: "Tactics Low", value: low },
    { name: "Puzzle Rush Best", value: rush },
  ];

  return (
    <div className="w-full h-56 rounded-lg border border-stone-200 dark:border-stone-700 p-3">
      <div className="text-sm font-medium mb-2">
        Chess.com — Tactics & Puzzle Rush
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
