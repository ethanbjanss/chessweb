import { useEffect, useState, useRef } from "react";
import axios from "axios";

// ⬇️ Charts
import LichessGamesChart from "./charts/LichessGamesChart";
import LichessWLD from "./charts/LichessWLD";
import LichessRatingTrend from "./charts/LichessRatingTrend";
import LichessPuzzleBar from "./charts/LichessPuzzleBar";
import LichessProgressBars from "./charts/LichessProgressBars";
import WeeklyActivity from "./charts/WeeklyActivity";

interface LichessPerf {
  games: number;
  rating: number;
  rd: number;
  prog: number;
}
interface LichessProfile {
  location?: string;
  cfcRating?: number;
  rcfRating?: number;
  flag?: string;
  dsbRating?: number;
  fideRating?: number;
  ecfRating?: number;
  uscfRating?: number;
  bio?: string;
  links?: string;
}
interface LichessPlayTime {
  total: number;
  tv: number;
}
interface LichessCount {
  all: number;
  rated: number;
  ai: number;
  draw: number;
  drawH: number;
  loss: number;
  lossH: number;
  win: number;
  winH: number;
  bookmark: number;
  playing: number;
  import: number;
  me: number;
}
interface LichessStreamer {
  twitch?: { channel: string };
}
interface LichessUserData {
  id: string;
  username: string;
  disabled?: boolean;
  perfs: {
    bullet?: LichessPerf;
    blitz?: LichessPerf;
    rapid?: LichessPerf;
    classical?: LichessPerf;
    correspondence?: LichessPerf;
    chess960?: LichessPerf;
    kingOfTheHill?: LichessPerf;
    threeCheck?: LichessPerf;
    antichess?: LichessPerf;
    atomic?: LichessPerf;
    horde?: LichessPerf;
    crazyhouse?: LichessPerf;
    puzzle?: LichessPerf;
  };
  flair?: string;
  createdAt: number;
  profile?: LichessProfile;
  seenAt: number;
  playTime?: LichessPlayTime;
  url: string;
  count?: LichessCount;
  streamer?: LichessStreamer;
  followable: boolean;
  following: boolean;
  blocking: boolean;
}

export default function LichessComponent({
  defaultUser = "",
  forcedUser = "",
}: {
  defaultUser?: string;
  forcedUser?: string | null;
}) {
  const [userData, setUserData] = useState<LichessUserData | null>(null);
  const [error, setError] = useState<boolean>(true);
  const [lichessUserName, setLichessUser] = useState<string>(defaultUser);
  const userInputRef = useRef<HTMLInputElement>(null);

  // Optional: timestamps for WeeklyActivity chart
  const [gameTimestamps, setGameTimestamps] = useState<number[]>([]);

  useEffect(() => {
    if (forcedUser) {
      setLichessUser(forcedUser);
    }
  }, [forcedUser]);

  useEffect(() => {
    if (!lichessUserName) return;
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://lichess.org/api/user/${lichessUserName}`
        );
        setUserData(response.data);
        setError(false);
      } catch (err) {
        console.error("Error fetching Lichess user data:", err);
        setUserData(null);
        setError(true);
      }
    };
    fetchUserData();
  }, [lichessUserName]);

  // Optional: pull a small recent slice of games for the WeeklyActivity chart
  useEffect(() => {
    if (!lichessUserName) return;

    // Grab last ~100 games as NDJSON (lightweight)
    fetch(
      `https://lichess.org/api/games/user/${lichessUserName}?max=100&moves=false&clocks=false&evals=false&opening=false`,
      { headers: { Accept: "application/x-ndjson" } }
    )
      .then((res) => res.text())
      .then((text) => {
        if (!text) return setGameTimestamps([]);
        const stamps: number[] = [];
        for (const line of text.trim().split("\n")) {
          try {
            const game = JSON.parse(line);
            if (typeof game.createdAt === "number") {
              stamps.push(game.createdAt);
            }
          } catch {
            // ignore bad lines
          }
        }
        setGameTimestamps(stamps);
      })
      .catch(() => setGameTimestamps([]));
  }, [lichessUserName]);

  const renderPerf = (title: string, perf?: LichessPerf) => (
    <section className="rounded-lg border border-stone-700 bg-[#2f2d2a] p-4 shadow-md">
      <h3 className="mb-2 text-center text-base font-semibold text-stone-100">
        {title}
      </h3>
      <dl className="space-y-1">
        <div className="flex items-center justify-between">
          <dt className="text-stone-400">Rating</dt>
          <dd className="font-medium text-stone-100">
            {perf?.rating ?? "N/A"}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-stone-400">Games Played</dt>
          <dd className="font-medium text-stone-100">{perf?.games ?? "N/A"}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-stone-400">Rating Deviation</dt>
          <dd className="font-medium text-stone-100">{perf?.rd ?? "N/A"}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-stone-400">Progress</dt>
          <dd className="font-medium text-stone-100">
            {perf?.prog !== undefined
              ? `${perf.prog >= 0 ? "+" : ""}${perf.prog}`
              : "N/A"}
          </dd>
        </div>
      </dl>
    </section>
  );

  return (
    <div className="min-h-full w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <input
            className="w-full max-w-md rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-stone-100 shadow-sm outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-400/50"
            ref={userInputRef}
            type="text"
            placeholder="Enter username"
            onKeyDown={(e) => {
              if (e.key === "Enter" && userInputRef.current) {
                const name = userInputRef.current.value.trim();
                if (!name) return;
                setLichessUser(name);
                userInputRef.current.value = "";
              }
            }}
          />

          <h2 className="text-3xl font-semibold tracking-tight text-stone-100">
            Lichess
          </h2>

          <div
            className={[
              "w-full max-w-md rounded-lg border px-3 py-2 text-center text-sm font-medium shadow-md",
              error
                ? "border-red-400/60 bg-red-50/10 text-red-400"
                : userData?.disabled
                ? "border-amber-400/60 bg-amber-50/10 text-amber-400"
                : "border-emerald-400/60 bg-emerald-50/10 text-emerald-400",
            ].join(" ")}
          >
            {error
              ? "Please enter a valid Lichess username"
              : userData?.disabled
              ? `${lichessUserName} - Account Disabled`
              : userData
              ? `${lichessUserName}'s Profile`
              : "Please enter a valid Lichess username"}
          </div>

          <div className="w-full rounded-xl border border-stone-700 bg-[#3d3b38] shadow-md">
            <div className="max-h-[700px] overflow-y-auto p-6">
              {userData && !userData.disabled && (
                <>
                  <div className="grid gap-4">
                    {/* User Info */}
                    <section className="rounded-lg border border-stone-700 bg-[#2f2d2a] p-4 shadow-md">
                      <h3 className="mb-2 text-center text-base font-semibold text-stone-100">
                        User Info
                      </h3>
                      <dl className="divide-y divide-stone-700">
                        <div className="flex items-center justify-between py-2">
                          <dt className="text-stone-400">Username</dt>
                          <dd className="font-medium text-stone-100">
                            {userData.username || "N/A"}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <dt className="text-stone-400">Joined</dt>
                          <dd className="font-medium text-stone-100">
                            {userData.createdAt
                              ? new Date(
                                  userData.createdAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <dt className="text-stone-400">Last Seen</dt>
                          <dd className="font-medium text-stone-100">
                            {userData.seenAt
                              ? new Date(userData.seenAt).toLocaleString()
                              : "N/A"}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <dt className="text-stone-400">Location</dt>
                          <dd className="font-medium text-stone-100">
                            {userData.profile?.location || "N/A"}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <dt className="text-stone-400">Play Time</dt>
                          <dd className="font-medium text-stone-100">
                            {userData.playTime
                              ? `${Math.round(
                                  userData.playTime.total / 3600
                                )} hours`
                              : "N/A"}
                          </dd>
                        </div>
                      </dl>
                    </section>

                    {/* Overall Stats */}
                    <section className="rounded-lg border border-stone-700 bg-[#2f2d2a] p-4 shadow-md">
                      <h3 className="mb-2 text-center text-base font-semibold text-stone-100">
                        Overall Stats
                      </h3>
                      <dl className="space-y-1">
                        <div className="flex items-center justify-between">
                          <dt className="text-stone-400">Total Games</dt>
                          <dd className="font-medium text-stone-100">
                            {userData.count?.all ?? "N/A"}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-stone-400">Rated Games</dt>
                          <dd className="font-medium text-stone-100">
                            {userData.count?.rated ?? "N/A"}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-stone-400">Record (W/L/D)</dt>
                          <dd className="font-medium text-stone-100">
                            {userData.count
                              ? `${userData.count.win}/${userData.count.loss}/${userData.count.draw}`
                              : "N/A"}
                          </dd>
                        </div>
                      </dl>
                    </section>

                    {/* Perf cards */}
                    {renderPerf("Bullet Chess", userData.perfs?.bullet)}
                    {renderPerf("Blitz Chess", userData.perfs?.blitz)}
                    {renderPerf("Rapid Chess", userData.perfs?.rapid)}
                    {renderPerf("Classical Chess", userData.perfs?.classical)}
                    {renderPerf("Puzzles", userData.perfs?.puzzle)}
                  </div>

                  {/* ⬇️ NEW: Charts */}
                  <div className="mt-6 grid gap-4">
                    {/* Games per time control */}
                    <LichessGamesChart user={userData} />

                    {/* W/L/D Pie */}
                    <LichessWLD user={userData} />

                    {/* Rating trend (uses rating-history endpoint) */}
                    {lichessUserName && (
                      <LichessRatingTrend username={lichessUserName} />
                    )}

                    {/* Puzzle rating */}
                    <LichessPuzzleBar user={userData} />

                    {/* Recent progress (prog) */}
                    <LichessProgressBars user={userData} />

                    {/* Weekly activity (optional; depends on NDJSON fetch above) */}
                    {gameTimestamps.length > 0 && (
                      <WeeklyActivity timestamps={gameTimestamps} />
                    )}
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
