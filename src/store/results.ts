import { create } from "zustand";
import type { Coin } from "@/mock/coins";
import type { Condition } from "@/store/scanner";

interface ResultsState {
  results: Coin[] | null;
  scannerName: string;
  conditions: Condition[];
  ranAt: number | null;
  setResults: (results: Coin[], conditions: Condition[], scannerName: string) => void;
  clear: () => void;
}

export const useResultsStore = create<ResultsState>((set) => ({
  results: null,
  scannerName: "",
  conditions: [],
  ranAt: null,
  setResults: (results, conditions, scannerName) =>
    set({ results, conditions, scannerName, ranAt: Date.now() }),
  clear: () => set({ results: null, conditions: [], scannerName: "", ranAt: null }),
}));
