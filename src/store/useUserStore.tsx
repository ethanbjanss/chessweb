// src/store/useUserStore.ts   // ⬅️ create this
import { create } from "zustand";

type UserState = {
  chessUser: string;
  lichessUser: string;
  setChessUser: (u: string) => void;
  setLichessUser: (u: string) => void;
  setBoth: (u: string) => void;
};

export const useUserStore = create<UserState>((set) => ({
  chessUser: "",
  lichessUser: "",
  setChessUser: (u) => set({ chessUser: u }),
  setLichessUser: (u) => set({ lichessUser: u }),
  setBoth: (u) => set({ chessUser: u, lichessUser: u }),
}));
