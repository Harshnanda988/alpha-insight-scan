import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Alert {
  id: string;
  name: string;
  scanner: string;
  channel: "telegram" | "email" | "webhook";
  enabled: boolean;
  lastTriggered: string | null;
}

interface AlertState {
  alerts: Alert[];
  add: (a: Omit<Alert, "id" | "lastTriggered">) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set) => ({
      alerts: [
        {
          id: "1",
          name: "RSI Oversold Hunter",
          scanner: "RSI < 30 Largecaps",
          channel: "telegram",
          enabled: true,
          lastTriggered: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
        },
        {
          id: "2",
          name: "Golden Cross Watch",
          scanner: "EMA50 crosses above EMA200",
          channel: "telegram",
          enabled: true,
          lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        },
        {
          id: "3",
          name: "Volume Spike Bot",
          scanner: "Volume > 3x Avg",
          channel: "telegram",
          enabled: false,
          lastTriggered: null,
        },
      ],
      add: (a) =>
        set((s) => ({
          alerts: [
            ...s.alerts,
            { ...a, id: crypto.randomUUID(), lastTriggered: null },
          ],
        })),
      toggle: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) =>
            a.id === id ? { ...a, enabled: !a.enabled } : a,
          ),
        })),
      remove: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
    }),
    { name: "alphax-alerts" },
  ),
);
