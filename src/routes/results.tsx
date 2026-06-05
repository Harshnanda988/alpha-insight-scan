import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, Search, X, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { ChangePill } from "@/components/shared/ChangePill";
import { marketService } from "@/services/market.service";
import { formatCompact, formatPrice, type Coin } from "@/mock/coins";
import { useResultsStore } from "@/store/results";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Scan Results · AlphaX" }] }),
  component: ResultsPage,
});

type SortKey = keyof Pick<Coin, "price" | "change24h" | "change7d" | "rsi" | "volume" | "marketCap">;

const PAGE = 10;

function ResultsPage() {
  const { results: scanResults, scannerName, conditions, ranAt, clear } = useResultsStore();
  const hasScan = scanResults !== null;

  const { data: market = [], isLoading } = useQuery({
    queryKey: ["market"],
    queryFn: () => marketService.getAll(),
    enabled: !hasScan,
  });

  const data = hasScan ? scanResults! : market;

  const [q, setQ] = useState("");
  const [exchange, setExchange] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [asc, setAsc] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let r = data.filter(
      (c) =>
        c.symbol.toLowerCase().includes(q.toLowerCase()) ||
        c.name.toLowerCase().includes(q.toLowerCase()),
    );
    if (exchange !== "all") r = r.filter((c) => c.exchange === exchange);
    r = [...r].sort((a, b) => (asc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]));
    return r;
  }, [data, q, exchange, sortKey, asc]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const paged = filtered.slice((page - 1) * PAGE, page * PAGE);

  const sortBtn = (key: SortKey, label: string) => (
    <button
      onClick={() => {
        if (sortKey === key) setAsc(!asc);
        else {
          setSortKey(key);
          setAsc(false);
        }
      }}
      className="inline-flex items-center gap-1 hover:text-foreground"
    >
      {label} <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  return (
    <div>
      <PageHeader
        title="Scan Results"
        description="Latest matches across all your active scanners."
      />

      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Search coins…"
                className="pl-8"
              />
            </div>
            <Select value={exchange} onValueChange={setExchange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Exchange" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All exchanges</SelectItem>
                {["Binance", "Coinbase", "Bybit", "OKX", "Kraken"].map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="ml-auto">
              {filtered.length} results
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coin</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">{sortBtn("price", "Price")}</TableHead>
                  <TableHead className="text-right">{sortBtn("change24h", "24H")}</TableHead>
                  <TableHead className="text-right">{sortBtn("change7d", "7D")}</TableHead>
                  <TableHead className="text-right">{sortBtn("rsi", "RSI")}</TableHead>
                  <TableHead>EMA</TableHead>
                  <TableHead className="text-right">{sortBtn("volume", "Volume")}</TableHead>
                  <TableHead className="text-right">{sortBtn("marketCap", "Mkt Cap")}</TableHead>
                  <TableHead>Pattern</TableHead>
                  <TableHead>Exchange</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 11 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                {!isLoading &&
                  paged.map((c) => (
                    <TableRow key={c.symbol}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground">{c.symbol}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        ${formatPrice(c.price)}
                      </TableCell>
                      <TableCell className="text-right">
                        <ChangePill value={c.change24h} />
                      </TableCell>
                      <TableCell className="text-right">
                        <ChangePill value={c.change7d} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        <span
                          className={cn(
                            c.rsi >= 70 && "text-destructive",
                            c.rsi <= 30 && "text-success",
                          )}
                        >
                          {c.rsi}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            c.emaStatus === "Bullish" &&
                              "border-success/40 text-success",
                            c.emaStatus === "Bearish" &&
                              "border-destructive/40 text-destructive",
                          )}
                        >
                          {c.emaStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        ${formatCompact(c.volume)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        ${formatCompact(c.marketCap)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{c.pattern}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{c.exchange}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {page} of {pages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
