import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SAVED_SCANNERS } from "@/mock/scanners";
import { backtestService, type BacktestResult } from "@/services/backtest.service";

export const Route = createFileRoute("/backtesting")({
  head: () => ({ meta: [{ title: "Backtesting · AlphaX" }] }),
  component: Backtesting,
});

function Backtesting() {
  const [scanner, setScanner] = useState(SAVED_SCANNERS[0].id);
  const [from, setFrom] = useState("2025-01-01");
  const [to, setTo] = useState("2025-06-01");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<BacktestResult | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      setRes(await backtestService.run(scanner, from, to));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Backtesting"
        description="Replay your scanners against historical data to measure edge."
      />

      <Card className="mb-4">
        <CardContent className="grid gap-3 p-4 md:grid-cols-4">
          <div className="space-y-1">
            <Label>Scanner</Label>
            <Select value={scanner} onValueChange={setScanner}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SAVED_SCANNERS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>From</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>To</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button onClick={run} disabled={loading} className="w-full">
              <Play className="mr-2 h-4 w-4" />
              {loading ? "Running…" : "Run Backtest"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!res ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Configure a scanner and date range above, then run a backtest to see results.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <Stat label="Win Rate" value={`${res.winRate}%`} positive />
            <Stat label="Avg Return" value={`${res.avgReturn}%`} positive />
            <Stat label="Best Trade" value={`+${res.bestTrade}%`} positive />
            <Stat label="Worst Trade" value={`${res.worstTrade}%`} positive={false} />
            <Stat label="Total Signals" value={res.totalSignals.toString()} />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Equity Curve</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={res.equity}>
                    <defs>
                      <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-primary)"
                      fill="url(#eq)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Monthly P&L</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={res.monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                      {res.monthly.map((m, i) => (
                        <rect
                          key={i}
                          fill={m.pnl >= 0 ? "var(--color-success)" : "var(--color-destructive)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div
          className={`mt-1 text-2xl font-semibold tabular-nums ${
            positive === undefined
              ? ""
              : positive
                ? "text-success"
                : "text-destructive"
          }`}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
