export interface BacktestResult {
  winRate: number;
  avgReturn: number;
  bestTrade: number;
  worstTrade: number;
  totalSignals: number;
  equity: { date: string; value: number }[];
  monthly: { month: string; pnl: number }[];
}

export const backtestService = {
  async run(_scannerId: string, _from: string, _to: string): Promise<BacktestResult> {
    await new Promise((r) => setTimeout(r, 700));
    const equity: { date: string; value: number }[] = [];
    let v = 10000;
    for (let i = 0; i < 60; i++) {
      v += v * ((Math.sin(i / 4) + Math.random() * 0.5 - 0.15) * 0.012);
      const d = new Date(Date.now() - (60 - i) * 86400000);
      equity.push({ date: d.toISOString().slice(5, 10), value: Math.round(v) });
    }
    return {
      winRate: 64.2,
      avgReturn: 3.8,
      bestTrade: 28.4,
      worstTrade: -9.1,
      totalSignals: 142,
      equity,
      monthly: [
        { month: "Jan", pnl: 4.2 },
        { month: "Feb", pnl: -1.8 },
        { month: "Mar", pnl: 7.1 },
        { month: "Apr", pnl: 2.9 },
        { month: "May", pnl: -0.4 },
        { month: "Jun", pnl: 5.3 },
      ],
    };
  },
};
