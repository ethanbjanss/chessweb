import { useState } from "react";
import ChessComComponent from "./components/ChessComComponent";
import LichessComponent from "./components/LichessComponent";

type PanelType = "chesscom" | "lichess";
type Panel = { id: string; type: PanelType };

function PanelChrome({
  onRemove,
  children,
  title,
}: {
  onRemove: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-2xl border border-stone-700 bg-stone-900/60 shadow-lg w-full">
      <div className="flex items-center justify-between gap-2 border-b border-stone-700/60 px-3 py-2">
        <div className="text-stone-200 text-sm font-medium">{title}</div>
        <button
          onClick={onRemove}
          className="rounded-md border border-stone-700 px-2 py-1 text-xs text-stone-300 hover:bg-stone-800"
          aria-label="Remove panel"
        >
          Remove
        </button>
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [panels, setPanels] = useState<Panel[]>([
    { id: crypto.randomUUID(), type: "chesscom" },
    { id: crypto.randomUUID(), type: "lichess" },
  ]);

  const [forcedUser, setForcedUser] = useState<string | null>(null);

  const addPanel = (type: PanelType) =>
    setPanels((p) => [...p, { id: crypto.randomUUID(), type }]);

  const removePanel = (id: string) =>
    setPanels((p) => p.filter((x) => x.id !== id));

  const AddPanelPicker = () => (
    <div className="flex items-center gap-2">
      <button
        className="rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-stone-100 hover:bg-stone-700"
        onClick={() => addPanel("chesscom")}
      >
        + Chess.com
      </button>
      <button
        className="rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-stone-100 hover:bg-stone-700"
        onClick={() => addPanel("lichess")}
      >
        + Lichess
      </button>
      <button
        className="rounded-lg border border-blue-600 bg-blue-700 px-3 py-2 text-white hover:bg-blue-600"
        onClick={() => setForcedUser("Jean_Valjean1967")}
      >
        Father
      </button>
    </div>
  );

  return (
    <div className="min-h-dvh w-screen bg-stone-950 text-stone-100">
      {/* Full-width header */}
      <header className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950/80 backdrop-blur px-4 py-3 w-full">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold tracking-tight">Chess Panels</h1>
          <AddPanelPicker />
        </div>
      </header>

      {/* FULL-WIDTH content */}
      <main className="px-4 py-6 w-full">
        <div className="grid [grid-template-columns:repeat(auto-fill,minmax(600px,1fr))] gap-6 w-full">
          {panels.map((panel) => (
            <PanelChrome
              key={panel.id}
              title={
                panel.type === "chesscom" ? "Chess.com Panel" : "Lichess Panel"
              }
              onRemove={() => removePanel(panel.id)}
            >
              {panel.type === "chesscom" ? (
                <ChessComComponent forcedUser={forcedUser} />
              ) : (
                <LichessComponent forcedUser={forcedUser} />
              )}
            </PanelChrome>
          ))}
        </div>
      </main>
    </div>
  );
}
