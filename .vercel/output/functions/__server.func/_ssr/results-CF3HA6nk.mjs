import { r as reactExports, W as jsxRuntimeExports } from "./server-DmgOPCm4.mjs";
import { u as useQuery } from "./useQuery-D8Q7X-Mg.mjs";
import { P as PageHeader, C as Card, c as CardContent } from "./PageHeader-DfRYcKFV.mjs";
import { g as Badge, B as Button, X, k as Search, I as Input, l as Skeleton, a as cn$1, c as createLucideIcon, m as marketService } from "./router-ov0HDanu.mjs";
import { u as useResultsStore, S as Sparkles, a as Select, b as SelectTrigger, c as SelectValue, d as SelectContent, e as SelectItem } from "./results-8ss-__-H.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-B4SMSDuX.mjs";
import { f as formatPrice, C as ChangePill, a as formatCompact } from "./coins-BogPyFvB.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-BznNxV-h.mjs";
const __iconNode = [
  ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
  ["path", { d: "M17 20V4", key: "1ejh1v" }],
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }]
];
const ArrowUpDown = createLucideIcon("arrow-up-down", __iconNode);
const PAGE = 10;
function ResultsPage() {
  const {
    results: scanResults,
    scannerName,
    conditions,
    ranAt,
    clear
  } = useResultsStore();
  const hasScan = scanResults !== null;
  const {
    data: market = [],
    isLoading
  } = useQuery({
    queryKey: ["market"],
    queryFn: () => marketService.getAll(),
    enabled: !hasScan,
    staleTime: 0
    // Force fresh data
  });
  const data = hasScan ? scanResults : market;
  const [q, setQ] = reactExports.useState("");
  const [exchange, setExchange] = reactExports.useState("all");
  const [sortKey, setSortKey] = reactExports.useState("marketCap");
  const [asc, setAsc] = reactExports.useState(false);
  const [page, setPage] = reactExports.useState(1);
  const filtered = reactExports.useMemo(() => {
    let r = data.filter((c) => c.symbol.toLowerCase().includes(q.toLowerCase()) || c.name.toLowerCase().includes(q.toLowerCase()));
    if (exchange !== "all") r = r.filter((c) => c.exchange === exchange);
    r = [...r].sort((a, b) => {
      const va = a[sortKey] ?? 0;
      const vb = b[sortKey] ?? 0;
      return asc ? va - vb : vb - va;
    });
    return r;
  }, [data, q, exchange, sortKey, asc]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const paged = filtered.slice((page - 1) * PAGE, page * PAGE);
  const sortBtn = (key, label) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
    if (sortKey === key) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(false);
    }
  }, className: "inline-flex items-center gap-1 hover:text-foreground", children: [
    label,
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-3 w-3" })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Scan Results", description: hasScan ? `Showing matches from your latest scan${ranAt ? ` · ${new Date(ranAt).toLocaleTimeString()}` : ""}.` : "Latest matches across all your active scanners." }),
    hasScan && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-4 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-wrap items-center gap-3 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-medium", children: scannerName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-xs text-muted-foreground", children: conditions.map((c, i) => `${i > 0 ? `${c.logic} ` : ""}${c.field} ${c.operator} ${c.value}`).join(" ") || "No conditions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
        scanResults.length,
        " matches"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: clear, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1 h-3.5 w-3.5" }),
        " Clear scan"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => {
            setQ(e.target.value);
            setPage(1);
          }, placeholder: "Search coins…", className: "pl-8" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: exchange, onValueChange: setExchange, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Exchange" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All exchanges" }),
            ["Binance", "Coinbase", "Bybit", "OKX", "Kraken"].map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: e, children: e }, e))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-auto", children: [
          filtered.length,
          " results"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Coin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Symbol" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: sortBtn("price", "Price") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: sortBtn("change24h", "24H") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: sortBtn("change7d", "7D") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: sortBtn("rsi", "RSI") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "EMA" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: sortBtn("volume", "Volume") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: sortBtn("marketCap", "Mkt Cap") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Pattern" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Exchange" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
          isLoading && Array.from({
            length: 6
          }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: Array.from({
            length: 11
          }).map((_2, j) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, j)) }, i)),
          !isLoading && paged.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: c.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: c.symbol }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right tabular-nums", children: [
              "$",
              formatPrice(c.price)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChangePill, { value: c.change24h }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChangePill, { value: c.change7d }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right tabular-nums", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn$1(c.rsi && c.rsi >= 70 && "text-destructive", c.rsi && c.rsi <= 30 && "text-success"), children: c.rsi !== null ? c.rsi.toFixed(2) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground animate-pulse text-[10px]", children: "N/A" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: cn$1("text-[10px] font-medium", c.emaStatus === "Bullish" && "bg-success/10 text-success border-success/20", c.emaStatus === "Bearish" && "bg-destructive/10 text-destructive border-destructive/20", c.emaStatus === "N/A" && "bg-muted text-muted-foreground"), children: c.emaStatus }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right tabular-nums text-muted-foreground", children: [
              "$",
              formatCompact(c.volume)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right tabular-nums text-muted-foreground", children: [
              "$",
              formatCompact(c.marketCap)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: c.pattern }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: c.exchange })
          ] }, c.symbol))
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Page ",
          page,
          " of ",
          pages
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", disabled: page === 1, onClick: () => setPage((p) => p - 1), children: "Previous" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", disabled: page >= pages, onClick: () => setPage((p) => p + 1), children: "Next" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ResultsPage as component
};
