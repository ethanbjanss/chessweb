// src/components/Charts/LichessGamesChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Perf = { games?: number } | undefined;
type LichessUserData = {
  perfs?: {
    bullet?: Perf;
    blitz?: Perf;
    rapid?: Perf;
    classical?: Perf;
    puzzle?: Perf;
  };
};

function val(perf?: Perf) {
  return perf?.games ?? 0;
}

export default function LichessGamesChart({
  user,
}: {
  user: LichessUserData | null;
}) {
  const data = [
    { tc: "Bullet", games: val(user?.perfs?.bullet) },
    { tc: "Blitz", games: val(user?.perfs?.blitz) },
    { tc: "Rapid", games: val(user?.perfs?.rapid) },
    { tc: "Classical", games: val(user?.perfs?.classical) },
    // Puzzles aren’t “played games”, so we usually omit them here
  ];

  const anyGames = data.some((d) => d.games > 0);

  return (
    <div className="w-full h-64 rounded-lg border border-stone-700 bg-[#2f2d2a] p-3">
      <div className="text-sm font-medium mb-2 text-stone-100">
        Lichess — Games by Time Control
      </div>
      {anyGames ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tc" stroke="#cbd5e1" />
            <YAxis allowDecimals={false} stroke="#cbd5e1" />
            <Tooltip />
            <Bar dataKey="games" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-stone-400 text-sm">
          No games found for these time controls.
        </div>
      )}
    </div>
  );
}
