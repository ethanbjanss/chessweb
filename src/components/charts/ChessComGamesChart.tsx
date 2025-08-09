// src/components/Charts/ChessComGamesChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type GameRecord = { win: number; loss: number; draw: number };
type MaybeGameStats = { record?: GameRecord } | undefined;
type ChessStats = {
  chess_bullet?: MaybeGameStats;
  chess_blitz?: MaybeGameStats;
  chess_rapid?: MaybeGameStats;
  chess_daily?: MaybeGameStats;
  classical?: MaybeGameStats; // if you have it
};

function total(record?: GameRecord) {
  if (!record) return 0;
  return (record.win ?? 0) + (record.loss ?? 0) + (record.draw ?? 0);
}

export default function ChessComGamesChart({
  stats,
}: {
  stats: ChessStats | null;
}) {
  const data = [
    { tc: "Bullet", games: total(stats?.chess_bullet?.record) },
    { tc: "Blitz", games: total(stats?.chess_blitz?.record) },
    { tc: "Rapid", games: total(stats?.chess_rapid?.record) },
    { tc: "Daily", games: total(stats?.chess_daily?.record) },
  ];

  const anyGames = data.some((d) => d.games > 0);

  return (
    <div className="w-full h-64 rounded-lg border border-stone-200 bg-white dark:bg-[#3a3835] dark:border-stone-700 p-3">
      <div className="text-sm font-medium mb-2">
        Chess.com — Games by Time Control
      </div>
      {anyGames ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tc" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="games" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-stone-500 text-sm">
          No games found for these time controls.
        </div>
      )}
    </div>
  );
}
