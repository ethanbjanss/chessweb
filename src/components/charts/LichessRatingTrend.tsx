// src/components/Charts/LichessRatingTrend.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type SeriesPoint = { date: string; rating: number; perf: string };

export default function LichessRatingTrend({ username }: { username: string }) {
  const [data, setData] = useState<SeriesPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    axios
      .get(`https://lichess.org/api/user/${username}/rating-history`)
      .then((res) => {
        // res.data: [{ name: "Blitz", points: [{x: 2019, y: 1800, ...}] }, ...]
        const rows: SeriesPoint[] = [];
        for (const perf of res.data as any[]) {
          const perfName: string = perf.name; // "Bullet","Blitz","Rapid","Classical","Chess960"
          for (const p of perf.points as any[]) {
            // x: year offset? Actually x = month index since epoch: [year, month, day?] Lichess docs: points: [year, month, day, rating]
            // API returns [year, month, day, rating], see mapping below:
            const [year, month, day, rating] = p;
            const d = new Date(year, month, day);
            rows.push({
              date: d.toISOString().slice(0, 10),
              rating,
              perf: perfName,
            });
          }
        }
        setData(rows);
      })
      .finally(() => setLoading(false));
  }, [username]);

  // Grouped by perf: draw separate lines
  const perfs = Array.from(new Set(data.map((d) => d.perf)));

  return (
    <div className="w-full h-72 rounded-lg border border-stone-700 p-3 bg-[#2f2d2a]">
      <div className="text-sm font-medium mb-2 text-stone-100">
        Lichess — Rating Trend
      </div>
      {loading ? (
        <div className="text-stone-400 text-sm">Loading…</div>
      ) : data.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "#cbd5e1" }} />
            <YAxis allowDecimals={false} tick={{ fill: "#cbd5e1" }} />
            <Tooltip />
            <Legend />
            {perfs.map((p) => (
              <Line
                key={p}
                type="monotone"
                dataKey="rating"
                data={data.filter((d) => d.perf === p)}
                name={p}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-stone-400 text-sm">No rating history.</div>
      )}
    </div>
  );
}
