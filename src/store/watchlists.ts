import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Watchlist {
  id: string;
  name: string;
  coins: string[]; // symbols
  createdAt: string;
}

interface WatchlistState {
  lists: Watchlist[];
  activeId: string | null;
  setActive: (id: string | null) => void;
  create: (name: string) => void;
  remove: (id: string) => void;
  addCoin: (id: string, symbol: string) => void;
  removeCoin: (id: string, symbol: string) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      lists: [
        {
          id: "default",
          name: "My Top Picks",
          coins: ["BTC", "ETH", "SOL", "LINK", "ARB"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "ai",
          name: "AI Narrative",
          coins: ["FET", "RNDR", "TAO", "AGIX"],
          createdAt: new Date().toISOString(),
        },
      ],
      activeId: "default",
      setActive: (activeId) => set({ activeId }),
      create: (name) =>
        set((s) => {
          const id = crypto.randomUUID();
          return {
            lists: [
              ...s.lists,
              { id, name, coins: [], createdAt: new Date().toISOString() },
            ],
            activeId: id,
          };
        }),
      remove: (id) =>
        set((s) => ({
          lists: s.lists.filter((l) => l.id !== id),
          activeId: s.activeId === id ? null : s.activeId,
        })),
      addCoin: (id, symbol) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === id && !l.coins.includes(symbol)
              ? { ...l, coins: [...l.coins, symbol] }
              : l,
          ),
        })),
      removeCoin: (id, symbol) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === id ? { ...l, coins: l.coins.filter((c) => c !== symbol) } : l,
          ),
        })),
    }),
    { name: "alphax-watchlists" },
  ),
);
