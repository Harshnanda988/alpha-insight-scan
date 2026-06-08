import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  BellRing,
  Coins,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { ChangePill } from "@/components/shared/ChangePill";
import { marketService } from "@/services/market.service";
import { formatCompact, formatPrice } from "@/mock/coins";
import { cn } from "@/lib/utils";

const RECENT_ACTIVITY: { name: string; matches: number; time: string }[] = [
  { name: "Golden Cross Hunter", matches: 7, time: "12m ago" },
  { name: "RSI Oversold Largecaps", matches: 3, time: "2h ago" },
  { name: "Volume Spike Detector", matches: 12, time: "Yesterday" },
  { name: "Mean Reversion Setup", matches: 5, time: "5h ago" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · AlphaX" },
      { name: "description", content: "Live crypto market overview & scanner activity." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data: market = [] } = useQuery({
    queryKey: ["market"],
    queryFn: () => marketService.getAll(),
    refetchInterval: 30000, // Refresh every 30 seconds for live feel
  });

  const stats = [
    { 
      label: "Total Coins Scanned", 
      value: market.length > 0 ? market.length.toLocaleString() : "2,148", 
      icon: Coins, 
      accent: "text-primary" 
    },
    { 
      label: "Bullish Trend (EMA)", 
      value: market.filter(c => c.emaStatus === "Bullish").length.toString(), 
      icon: TrendingUp, 
      accent: "text-success" 
    },
    { 
      label: "Oversold (RSI < 30)", 
      value: market.filter(c => c.rsi !== null && c.rsi < 30).length.toString(), 
      icon: Activity, 
      accent: "text-warning" 
    },
    { 
      label: "High Volatility", 
      value: market.filter(c => Math.abs(c.change24h) > 5).length.toString(), 
      icon: SlidersHorizontal, 
      accent: "text-primary" 
    },
  ];

  const gainers = [...market].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
  const losers = [...market].sort((a, b) => a.change24h - b.change24h).slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Live market signals and scanner activity at a glance."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{s.value}</div>
              </div>
              <s.icon className={`h-5 w-5 ${s.accent}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-success" /> Top Gainers (24h)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {gainers.map((c) => (
              <div key={c.symbol} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{c.symbol}</div>
                  <div className="text-xs text-muted-foreground">{c.name}</div>
                </div>
                <ChangePill value={c.change24h} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingDown className="h-4 w-4 text-destructive" /> Top Losers (24h)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {losers.map((c) => (
              <div key={c.symbol} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{c.symbol}</div>
                  <div className="text-xs text-muted-foreground">{c.name}</div>
                </div>
                <ChangePill value={c.change24h} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Scanner Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {RECENT_ACTIVITY.map((a) => (
              <div key={a.name} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.time}</div>
                </div>
                <Badge variant="secondary">{a.matches} matches</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Market Overview</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coin</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24H %</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead className="text-right">Market Cap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {market.slice(0, 12).map((c) => (
                  <TableRow key={c.symbol}>
                    <TableCell>
                      <div className="font-medium">{c.symbol}</div>
                      <div className="text-xs text-muted-foreground">{c.name}</div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      ${formatPrice(c.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ChangePill value={c.change24h} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      ${formatCompact(c.volume)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {c.rsi !== null ? (
                        <span className={cn(
                          "text-xs",
                          c.rsi >= 70 && "text-destructive",
                          c.rsi <= 30 && "text-success",
                        )}>
                          RSI: {c.rsi.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground animate-pulse">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      ${formatCompact(c.marketCap)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
