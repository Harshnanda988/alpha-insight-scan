export interface SavedScanner {
  id: string;
  name: string;
  conditions: string;
  createdAt: string;
  lastRun: string;
  favorite: boolean;
}

export const SAVED_SCANNERS: SavedScanner[] = [
  {
    id: "1",
    name: "RSI Oversold Largecaps",
    conditions: "RSI < 30 AND Market Cap > 5B",
    createdAt: "2025-04-12",
    lastRun: "2 hours ago",
    favorite: true,
  },
  {
    id: "2",
    name: "Golden Cross Hunter",
    conditions: "EMA50 crosses above EMA200",
    createdAt: "2025-04-18",
    lastRun: "12 minutes ago",
    favorite: true,
  },
  {
    id: "3",
    name: "Volume Spike Detector",
    conditions: "Volume > 3x Avg AND Price Change > 5%",
    createdAt: "2025-05-02",
    lastRun: "Yesterday",
    favorite: false,
  },
  {
    id: "4",
    name: "AI Narrative Breakouts",
    conditions: "Price > EMA50 AND RSI > 55",
    createdAt: "2025-05-21",
    lastRun: "3 days ago",
    favorite: false,
  },
  {
    id: "5",
    name: "Mean Reversion Setup",
    conditions: "RSI < 35 AND Price > EMA200",
    createdAt: "2025-05-30",
    lastRun: "5 hours ago",
    favorite: true,
  },
];

export const RECENT_ACTIVITY = [
  { name: "Golden Cross Hunter", matches: 7, time: "12m ago" },
  { name: "RSI Oversold Largecaps", matches: 3, time: "2h ago" },
  { name: "Volume Spike Detector", matches: 12, time: "Yesterday" },
  { name: "Mean Reversion Setup", matches: 5, time: "5h ago" },
];
