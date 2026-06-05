export interface SavedScanner {
  id: string;
  name: string;
  conditions: string;
  created: string;
  matches: number;
}

export const SAVED_SCANNERS: SavedScanner[] = [
  {
    id: "s1",
    name: "Golden Cross Hunter",
    conditions: "EMA50 > EMA200 AND Volume > 100M",
    created: "2026-05-12",
    matches: 7,
  },
  {
    id: "s2",
    name: "RSI Oversold Largecaps",
    conditions: "RSI < 30 AND Market Cap > 5B",
    created: "2026-05-20",
    matches: 3,
  },
  {
    id: "s3",
    name: "Volume Spike Detector",
    conditions: "Volume > 500M AND Price Change > 5",
    created: "2026-05-28",
    matches: 12,
  },
  {
    id: "s4",
    name: "Mean Reversion Setup",
    conditions: "RSI < 35 AND Price < EMA20",
    created: "2026-06-01",
    matches: 5,
  },
];

export interface Alert {
  id: string;
  name: string;
  scanner: string;
  status: "Active" | "Paused";
  channel: "Email" | "Telegram" | "In-app";
  lastTriggered: string;
}

export const ALERTS: Alert[] = [
  {
    id: "a1",
    name: "BTC RSI Oversold",
    scanner: "RSI Oversold Largecaps",
    status: "Active",
    channel: "Telegram",
    lastTriggered: "12m ago",
  },
  {
    id: "a2",
    name: "Altcoin Volume Spike",
    scanner: "Volume Spike Detector",
    status: "Active",
    channel: "Email",
    lastTriggered: "2h ago",
  },
  {
    id: "a3",
    name: "Golden Cross Daily",
    scanner: "Golden Cross Hunter",
    status: "Paused",
    channel: "In-app",
    lastTriggered: "Yesterday",
  },
];
