// src/components/Charts/LichessPuzzleBar.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Perf = { rating?: number } | undefined;
type User = { perfs?: { puzzle?: Perf } } | null;

export default function LichessPuzzleBar({ user }: { user: User }) {
  const rating = user?.perfs?.puzzle?.rating ?? 0;
  const data = [{ name: "Lichess Puzzle", rating }];

  return (
    <div className="w-full h-56 rounded-lg border border-stone-700 p-3 bg-[#2f2d2a]">
      <div className="text-sm font-medium mb-2 text-stone-100">
        Lichess — Puzzle Rating
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#cbd5e1" />
          <YAxis allowDecimals={false} stroke="#cbd5e1" />
          <Tooltip />
          <Bar dataKey="rating" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
