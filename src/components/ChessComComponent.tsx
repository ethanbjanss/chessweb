// import { useEffect, useState, useRef } from "react";
// import axios from "axios";

// interface ChessUserInfo {
//   username: string;
//   followers: number;
//   joined: number;
//   last_online: number;
//   status: string;
// }
// interface RatingRecord {
//   rating: number;
//   date: number;
// }
// interface LastRating {
//   rating: number;
//   date: number;
//   rd: number;
// }
// interface BestRating {
//   rating: number;
//   date: number;
//   game: string;
// }
// interface GameRecord {
//   win: number;
//   loss: number;
//   draw: number;
//   time_per_move?: number;
//   timeout_percent?: number;
// }
// interface GameStats {
//   last: LastRating;
//   best: BestRating;
//   record: GameRecord;
// }
// interface TacticsStats {
//   highest: RatingRecord;
//   lowest: RatingRecord;
// }
// interface PuzzleRushStats {
//   best: { total_attempts: number; score: number };
//   daily?: { total_attempts: number; score: number };
// }
// interface ChessStats {
//   chess_daily?: GameStats;
//   chess_rapid?: GameStats;
//   chess_bullet?: GameStats;
//   chess_blitz?: GameStats;
//   chess960_daily?: GameStats;
//   tactics?: TacticsStats;
//   lessons?: TacticsStats;
//   puzzle_rush?: PuzzleRushStats;
// }

// type ValueField = { label: string; value: string };
// type RecordField = { label: string; record: true };
// type Field = ValueField | RecordField;

// export default function ChessComComponent({
//   defaultUser = "",
//   forcedUser = "",
// }: {
//   defaultUser?: string;
//   forcedUser?: string;
// }) {
//   const [userInfo, setUserInfo] = useState<ChessUserInfo | null>(null);
//   const [userStats, setUserStats] = useState<ChessStats | null>(null);
//   const [error, setError] = useState<boolean>(true);
//   const [chessUserName, setChessUser] = useState<string>(defaultUser);
//   const userInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (forcedUser) {
//       setChessUser(forcedUser);
//     }
//   }, [forcedUser]);

//   const hasRecord = (s: unknown): s is { record: GameRecord } =>
//     !!s && typeof s === "object" && "record" in (s as any);

//   const getPath = (obj: unknown, path?: string) => {
//     if (!obj || !path) return undefined;
//     return path
//       .split(".")
//       .reduce<any>((acc, key) => (acc ? acc[key] : undefined), obj as any);
//   };

//   useEffect(() => {
//     if (!chessUserName) return;
//     const fetchUserData = async () => {
//       try {
//         const [userRes, statsRes] = await Promise.all([
//           axios.get(`https://api.chess.com/pub/player/${chessUserName}`),
//           axios.get(`https://api.chess.com/pub/player/${chessUserName}/stats`),
//         ]);
//         setUserInfo(userRes.data);
//         setUserStats(statsRes.data);
//         setError(false);
//       } catch (err) {
//         console.error("Error fetching Chess.com user data:", err);
//         setUserInfo(null);
//         setUserStats(null);
//         setError(true);
//       }
//     };
//     fetchUserData();
//   }, [chessUserName]);

//   return (
//     <div className="min-h-full w-full flex justify-center px-4 py-6">
//       <div className="w-full max-w-2xl">
//         <div className="flex flex-col items-center gap-4">
//           <input
//             ref={userInputRef}
//             type="text"
//             placeholder="Enter username"
//             className="w-full max-w-md rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-stone-100 shadow-sm outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-400/50"
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && userInputRef.current) {
//                 const name = userInputRef.current.value.trim();
//                 if (!name) return;
//                 setChessUser(name);
//                 userInputRef.current.value = "";
//               }
//             }}
//           />

//           <h2 className="text-3xl font-semibold tracking-tight text-stone-100">
//             Chess.com
//           </h2>

//           <div
//             className={[
//               "w-full max-w-md rounded-lg border px-3 py-2 text-center text-sm font-medium shadow-md",
//               error || !userInfo
//                 ? "border-red-400/60 bg-red-50/10 text-red-400"
//                 : "border-emerald-400/60 bg-emerald-50/10 text-emerald-400",
//             ].join(" ")}
//           >
//             {error || !userInfo
//               ? "Please enter a valid Chess.com username"
//               : `${chessUserName}'s Profile`}
//           </div>

//           <div className="w-full rounded-xl border border-stone-700 bg-[#3d3b38] shadow-md">
//             <div className="max-h-[700px] overflow-y-auto p-6">
//               {userInfo && (
//                 <section className="rounded-lg border border-stone-700 bg-[#2f2d2a] p-4 shadow-md">
//                   <h3 className="mb-2 text-center text-base font-semibold text-stone-100">
//                     User Info
//                   </h3>
//                   <dl className="divide-y divide-stone-700">
//                     <div className="flex items-center justify-between py-2">
//                       <dt className="text-stone-400">Followers</dt>
//                       <dd className="font-medium text-stone-100">
//                         {userInfo.followers}
//                       </dd>
//                     </div>
//                     <div className="flex items-center justify-between py-2">
//                       <dt className="text-stone-400">Joined</dt>
//                       <dd className="font-medium text-stone-100">
//                         {new Date(userInfo.joined * 1000).toLocaleDateString()}
//                       </dd>
//                     </div>
//                     <div className="flex items-center justify-between py-2">
//                       <dt className="text-stone-400">Last Online</dt>
//                       <dd className="font-medium text-stone-100">
//                         {new Date(userInfo.last_online * 1000).toLocaleString()}
//                       </dd>
//                     </div>
//                     <div className="flex items-center justify-between py-2">
//                       <dt className="text-stone-400">Status</dt>
//                       <dd className="font-medium text-stone-100">
//                         {userInfo.status}
//                       </dd>
//                     </div>
//                   </dl>
//                 </section>
//               )}

//               {userStats && (
//                 <div className="mt-6 grid gap-4">
//                   {[
//                     {
//                       title: "Daily Chess",
//                       stats: userStats.chess_daily,
//                       fields: [
//                         { label: "Current Rating", value: "last.rating" },
//                         { label: "Best Rating", value: "best.rating" },
//                         { label: "Record (W/L/D)", record: true as const },
//                       ],
//                     },
//                     {
//                       title: "Rapid Chess",
//                       stats: userStats.chess_rapid,
//                       fields: [
//                         { label: "Current Rating", value: "last.rating" },
//                         { label: "Best Rating", value: "best.rating" },
//                         { label: "Record (W/L/D)", record: true as const },
//                       ],
//                     },
//                     {
//                       title: "Blitz Chess",
//                       stats: userStats.chess_blitz,
//                       fields: [
//                         { label: "Current Rating", value: "last.rating" },
//                         { label: "Best Rating", value: "best.rating" },
//                         { label: "Record (W/L/D)", record: true as const },
//                       ],
//                     },
//                     {
//                       title: "Bullet Chess",
//                       stats: userStats.chess_bullet,
//                       fields: [
//                         { label: "Current Rating", value: "last.rating" },
//                         { label: "Best Rating", value: "best.rating" },
//                         { label: "Record (W/L/D)", record: true as const },
//                       ],
//                     },
//                     {
//                       title: "Tactics",
//                       stats: userStats.tactics,
//                       fields: [
//                         { label: "Highest Rating", value: "highest.rating" },
//                         { label: "Lowest Rating", value: "lowest.rating" },
//                       ],
//                     },
//                     {
//                       title: "Puzzle Rush",
//                       stats: userStats.puzzle_rush,
//                       fields: [
//                         { label: "Best Score", value: "best.score" },
//                         {
//                           label: "Best Attempts",
//                           value: "best.total_attempts",
//                         },
//                       ],
//                     },
//                   ].map((section, idx) => (
//                     <section
//                       key={idx}
//                       className="rounded-lg border border-stone-700 bg-[#2f2d2a] p-4 shadow-md"
//                     >
//                       <h3 className="mb-2 text-center text-base font-semibold text-stone-100">
//                         {section.title}
//                       </h3>
//                       <dl className="space-y-1">
//                         {section.fields.map((f, i) => {
//                           let val: string | number = "N/A";
//                           if ("record" in f) {
//                             if (hasRecord(section.stats)) {
//                               const r = section.stats.record;
//                               val = `${r.win}/${r.loss}/${r.draw}`;
//                             }
//                           } else if ("value" in f) {
//                             const maybeVal = getPath(section.stats, f.value);
//                             val = (maybeVal ?? "N/A") as any;
//                           }
//                           return (
//                             <div
//                               key={i}
//                               className="flex items-center justify-between"
//                             >
//                               <dt className="text-stone-400">{f.label}</dt>
//                               <dd className="font-medium text-stone-100">
//                                 {val}
//                               </dd>
//                             </div>
//                           );
//                         })}
//                       </dl>
//                     </section>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import axios from "axios";

// ⬇️ add these imports
import ChessComGamesChart from "./charts/ChessComGamesChart";
import ChessComWLD from "./charts/ChessComWLD";
import ChessComTacticsBar from "./charts/ChessComTacticsBar";

interface ChessUserInfo {
  username: string;
  followers: number;
  joined: number;
  last_online: number;
  status: string;
}
interface RatingRecord {
  rating: number;
  date: number;
}
interface LastRating {
  rating: number;
  date: number;
  rd: number;
}
interface BestRating {
  rating: number;
  date: number;
  game: string;
}
interface GameRecord {
  win: number;
  loss: number;
  draw: number;
  time_per_move?: number;
  timeout_percent?: number;
}
interface GameStats {
  last: LastRating;
  best: BestRating;
  record: GameRecord;
}
interface TacticsStats {
  highest: RatingRecord;
  lowest: RatingRecord;
}
interface PuzzleRushStats {
  best: { total_attempts: number; score: number };
  daily?: { total_attempts: number; score: number };
}
interface ChessStats {
  chess_daily?: GameStats;
  chess_rapid?: GameStats;
  chess_bullet?: GameStats;
  chess_blitz?: GameStats;
  chess960_daily?: GameStats;
  tactics?: TacticsStats;
  lessons?: TacticsStats;
  puzzle_rush?: PuzzleRushStats;
}

// type ValueField = { label: string; value: string };
// type RecordField = { label: string; record: true };
// type Field = ValueField | RecordField;

export default function ChessComComponent({
  defaultUser = "",
  forcedUser = "",
}: {
  defaultUser?: string;
  forcedUser?: string | null;
}) {
  const [userInfo, setUserInfo] = useState<ChessUserInfo | null>(null);
  const [userStats, setUserStats] = useState<ChessStats | null>(null);
  const [error, setError] = useState<boolean>(true);
  const [chessUserName, setChessUser] = useState<string>(defaultUser);
  const userInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (forcedUser) {
      setChessUser(forcedUser);
    }
  }, [forcedUser]);

  const hasRecord = (s: unknown): s is { record: GameRecord } =>
    !!s && typeof s === "object" && "record" in (s as any);

  const getPath = (obj: unknown, path?: string) => {
    if (!obj || !path) return undefined;
    return path
      .split(".")
      .reduce<any>((acc, key) => (acc ? acc[key] : undefined), obj as any);
  };

  useEffect(() => {
    if (!chessUserName) return;
    const fetchUserData = async () => {
      try {
        const [userRes, statsRes] = await Promise.all([
          axios.get(`https://api.chess.com/pub/player/${chessUserName}`),
          axios.get(`https://api.chess.com/pub/player/${chessUserName}/stats`),
        ]);
        setUserInfo(userRes.data);
        setUserStats(statsRes.data);
        setError(false);
      } catch (err) {
        console.error("Error fetching Chess.com user data:", err);
        setUserInfo(null);
        setUserStats(null);
        setError(true);
      }
    };
    fetchUserData();
  }, [chessUserName]);

  return (
    <div className="min-h-full w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <input
            ref={userInputRef}
            type="text"
            placeholder="Enter username"
            className="w-full max-w-md rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-stone-100 shadow-sm outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-400/50"
            onKeyDown={(e) => {
              if (e.key === "Enter" && userInputRef.current) {
                const name = userInputRef.current.value.trim();
                if (!name) return;
                setChessUser(name);
                userInputRef.current.value = "";
              }
            }}
          />

          <h2 className="text-3xl font-semibold tracking-tight text-stone-100">
            Chess.com
          </h2>

          <div
            className={[
              "w-full max-w-md rounded-lg border px-3 py-2 text-center text-sm font-medium shadow-md",
              error || !userInfo
                ? "border-red-400/60 bg-red-50/10 text-red-400"
                : "border-emerald-400/60 bg-emerald-50/10 text-emerald-400",
            ].join(" ")}
          >
            {error || !userInfo
              ? "Please enter a valid Chess.com username"
              : `${chessUserName}'s Profile`}
          </div>

          <div className="w-full rounded-xl border border-stone-700 bg-[#3d3b38] shadow-md">
            <div className="max-h-[700px] overflow-y-auto p-6">
              {userInfo && (
                <section className="rounded-lg border border-stone-700 bg-[#2f2d2a] p-4 shadow-md">
                  <h3 className="mb-2 text-center text-base font-semibold text-stone-100">
                    User Info
                  </h3>
                  <dl className="divide-y divide-stone-700">
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-stone-400">Followers</dt>
                      <dd className="font-medium text-stone-100">
                        {userInfo.followers}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-stone-400">Joined</dt>
                      <dd className="font-medium text-stone-100">
                        {new Date(userInfo.joined * 1000).toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-stone-400">Last Online</dt>
                      <dd className="font-medium text-stone-100">
                        {new Date(userInfo.last_online * 1000).toLocaleString()}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-stone-400">Status</dt>
                      <dd className="font-medium text-stone-100">
                        {userInfo.status}
                      </dd>
                    </div>
                  </dl>
                </section>
              )}

              {userStats && (
                <>
                  {/* Existing stat cards */}
                  <div className="mt-6 grid gap-4">
                    {[
                      {
                        title: "Daily Chess",
                        stats: userStats.chess_daily,
                        fields: [
                          { label: "Current Rating", value: "last.rating" },
                          { label: "Best Rating", value: "best.rating" },
                          { label: "Record (W/L/D)", record: true as const },
                        ],
                      },
                      {
                        title: "Rapid Chess",
                        stats: userStats.chess_rapid,
                        fields: [
                          { label: "Current Rating", value: "last.rating" },
                          { label: "Best Rating", value: "best.rating" },
                          { label: "Record (W/L/D)", record: true as const },
                        ],
                      },
                      {
                        title: "Blitz Chess",
                        stats: userStats.chess_blitz,
                        fields: [
                          { label: "Current Rating", value: "last.rating" },
                          { label: "Best Rating", value: "best.rating" },
                          { label: "Record (W/L/D)", record: true as const },
                        ],
                      },
                      {
                        title: "Bullet Chess",
                        stats: userStats.chess_bullet,
                        fields: [
                          { label: "Current Rating", value: "last.rating" },
                          { label: "Best Rating", value: "best.rating" },
                          { label: "Record (W/L/D)", record: true as const },
                        ],
                      },
                      {
                        title: "Tactics",
                        stats: userStats.tactics,
                        fields: [
                          { label: "Highest Rating", value: "highest.rating" },
                          { label: "Lowest Rating", value: "lowest.rating" },
                        ],
                      },
                      {
                        title: "Puzzle Rush",
                        stats: userStats.puzzle_rush,
                        fields: [
                          { label: "Best Score", value: "best.score" },
                          {
                            label: "Best Attempts",
                            value: "best.total_attempts",
                          },
                        ],
                      },
                    ].map((section, idx) => (
                      <section
                        key={idx}
                        className="rounded-lg border border-stone-700 bg-[#2f2d2a] p-4 shadow-md"
                      >
                        <h3 className="mb-2 text-center text-base font-semibold text-stone-100">
                          {section.title}
                        </h3>
                        <dl className="space-y-1">
                          {section.fields.map((f, i) => {
                            let val: string | number = "N/A";
                            if ("record" in f) {
                              if (hasRecord(section.stats)) {
                                const r = section.stats.record;
                                val = `${r.win}/${r.loss}/${r.draw}`;
                              }
                            } else if ("value" in f) {
                              const maybeVal = getPath(section.stats, f.value);
                              val = (maybeVal ?? "N/A") as any;
                            }
                            return (
                              <div
                                key={i}
                                className="flex items-center justify-between"
                              >
                                <dt className="text-stone-400">{f.label}</dt>
                                <dd className="font-medium text-stone-100">
                                  {val}
                                </dd>
                              </div>
                            );
                          })}
                        </dl>
                      </section>
                    ))}
                  </div>

                  {/* ⬇️ NEW: Charts */}
                  <div className="mt-6 grid gap-4">
                    {/* Games per time control */}
                    <ChessComGamesChart stats={userStats} />

                    {/* W/L/D pies for two popular controls (adjust as you like) */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <ChessComWLD stats={userStats} control="chess_blitz" />
                      <ChessComWLD stats={userStats} control="chess_rapid" />
                    </div>

                    {/* Tactics & Puzzle Rush */}
                    <ChessComTacticsBar stats={userStats} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
