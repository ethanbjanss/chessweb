// src/components/Charts/LichessProgressBars.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Perf = { prog?: number } | undefined;
type User = {
  perfs?: {
    bullet?: Perf;
    blitz?: Perf;
    rapid?: Perf;
    classical?: Perf;
  };
} | null;

export default function LichessProgressBars({ user }: { user: User }) {
  const p = user?.perfs;
  const data = [
    { tc: "Bullet", prog: p?.bullet?.prog ?? 0 },
    { tc: "Blitz", prog: p?.blitz?.prog ?? 0 },
    { tc: "Rapid", prog: p?.rapid?.prog ?? 0 },
    { tc: "Classical", prog: p?.classical?.prog ?? 0 },
  ];

  const any = data.some((d) => d.prog !== 0);

  return (
    <div className="w-full h-56 rounded-lg border border-stone-700 p-3 bg-[#2f2d2a]">
      <div className="text-sm font-medium mb-2 text-stone-100">
        Lichess — Recent Progress
      </div>
      {any ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tc" stroke="#cbd5e1" />
            <YAxis allowDecimals={false} stroke="#cbd5e1" />
            <Tooltip />
            <Bar dataKey="prog" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-stone-400 text-sm">
          No recent changes recorded.
        </div>
      )}
    </div>
  );
}
