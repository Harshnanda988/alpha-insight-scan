import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { ChangePill } from "@/components/shared/ChangePill";
import { useWatchlistStore } from "@/store/watchlists";
import { marketService } from "@/services/market.service";
import { formatCompact, formatPrice } from "@/mock/coins";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/watchlists")({
  head: () => ({ meta: [{ title: "Watchlists · AlphaX" }] }),
  component: WatchlistsPage,
});

function WatchlistsPage() {
  const { lists, activeId, setActive, create, remove, addCoin, removeCoin } =
    useWatchlistStore();
  const active = lists.find((l) => l.id === activeId) ?? lists[0];
  const [name, setName] = useState("");
  const [coin, setCoin] = useState("");
  const { data: market = [] } = useQuery({
    queryKey: ["market"],
    queryFn: () => marketService.getAll(),
  });

  const coins = market.filter((c) => active?.coins.includes(c.symbol));
  const perf = coins.length
    ? coins.reduce((s, c) => s + c.change24h, 0) / coins.length
    : 0;

  return (
    <div>
      <PageHeader
        title="Watchlists"
        description="Curate baskets of coins and monitor performance in real time."
      />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Your Lists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="New list name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button
                size="icon"
                onClick={() => {
                  if (!name.trim()) return;
                  create(name);
                  setName("");
                  toast.success("Watchlist created");
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {lists.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActive(l.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-accent",
                    active?.id === l.id && "bg-accent",
                  )}
                >
                  <span className="font-medium">{l.name}</span>
                  <Badge variant="secondary">{l.coins.length}</Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">
                {active?.name ?? "No watchlist"}
              </CardTitle>
              {active && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Avg 24h:{" "}
                  <span
                    className={perf >= 0 ? "text-success" : "text-destructive"}
                  >
                    {perf.toFixed(2)}%
                  </span>
                </p>
              )}
            </div>
            {active && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => {
                  remove(active.id);
                  toast.success("Watchlist deleted");
                }}
              >
                <Trash2 className="mr-1 h-4 w-4" /> Delete
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {active && (
              <div className="mb-3 flex gap-2">
                <Select value={coin} onValueChange={setCoin}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Add a coin" />
                  </SelectTrigger>
                  <SelectContent>
                    {market
                      .filter((c) => !active.coins.includes(c.symbol))
                      .map((c) => (
                        <SelectItem key={c.symbol} value={c.symbol}>
                          {c.symbol} · {c.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => {
                    if (!coin) return;
                    addCoin(active.id, coin);
                    setCoin("");
                  }}
                >
                  Add
                </Button>
              </div>
            )}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coin</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">24H</TableHead>
                    <TableHead className="text-right">7D</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coins.map((c) => (
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
                      <TableCell className="text-right">
                        <ChangePill value={c.change7d} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        ${formatCompact(c.volume)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCoin(active!.id, c.symbol)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {coins.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                        No coins yet. Add some above.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
