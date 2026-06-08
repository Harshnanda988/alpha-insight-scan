import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as PageHeader, C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./PageHeader-C4TZFn8j.mjs";
import { B as Button, I as Input, c as cn, T as TooltipProvider, a as Badge, b as Tooltip, d as TooltipTrigger, e as TooltipContent, m as marketService } from "./router-CyAAXukc.mjs";
import { u as useResultsStore, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./results-Cf7hw7vM.mjs";
import { f as formatPrice, C as ChangePill, a as formatCompact } from "./coins-B5xWeNyP.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Hg751_cG.mjs";
import "../_libs/seroval.mjs";
import { j as Sparkles, W as WandSparkles, k as Clock, l as CircleAlert, T as Trash2, m as Plus, R as RotateCcw, n as Save, o as Play, p as ArrowRight } from "../_libs/lucide-react.mjs";
import { c as create } from "../_libs/zustand.mjs";
import { s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "./server-BecFIFJv.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const newCond = () => ({
  id: crypto.randomUUID(),
  field: "RSI",
  operator: ">",
  value: "60",
  logic: "AND",
  timeframe: "1d"
});
const useScannerStore = create((set) => ({
  conditions: [newCond()],
  name: "",
  setName: (name) => set({ name }),
  addCondition: () => set((s) => ({ conditions: [...s.conditions, newCond()] })),
  updateCondition: (id, patch) => set((s) => ({
    conditions: s.conditions.map((c) => c.id === id ? { ...c, ...patch } : c)
  })),
  removeCondition: (id) => set((s) => ({ conditions: s.conditions.filter((c) => c.id !== id) })),
  setConditions: (conditions) => set({ conditions }),
  reset: () => set({ conditions: [newCond()], name: "" })
}));
const scannerService = {
  async run(conditions) {
    const timeframes = Array.from(new Set(conditions.map((c) => c.timeframe)));
    const baseCoins = await marketService.getAll(timeframes);
    const candidateCoins = baseCoins.filter((c) => {
      return conditions.every((cond) => {
        if (["Volume", "Market Cap", "Price Change"].includes(cond.field)) {
          const value = parseFloat(cond.value);
          const fieldMap = {
            Volume: c.volume,
            "Market Cap": c.marketCap,
            "Price Change": c.change24h
          };
          const fv = fieldMap[cond.field] ?? 0;
          switch (cond.operator) {
            case "<":
              return fv < value;
            case ">":
              return fv > value;
            case "<=":
              return fv <= value;
            case ">=":
              return fv >= value;
            case "=":
              return Math.abs(fv - value) < 1e-4;
            default:
              return true;
          }
        }
        return true;
      });
    });
    const finalCandidates = candidateCoins.slice(0, 500);
    const symbols = finalCandidates.map((c) => c.symbol);
    if (symbols.length === 0) return [];
    const coinsWithTech = await marketService.getAll(timeframes, symbols);
    return coinsWithTech.filter((c) => {
      let matches = true;
      for (let i = 0; i < conditions.length; i++) {
        const cond = conditions[i];
        const value = parseFloat(cond.value);
        const tech = c.technicals?.[cond.timeframe] || {};
        const isTechnicalField = ["RSI", "EMA20", "EMA50", "EMA200", "SMA50", "SMA200"].includes(cond.field);
        const fv = isTechnicalField ? tech[cond.field.toLowerCase()] ?? null : cond.field === "Volume" ? c.volume : cond.field === "Market Cap" ? c.marketCap : c.change24h;
        let condMatch = false;
        if (isTechnicalField && fv === null) {
          condMatch = false;
        } else {
          const numFv = fv;
          switch (cond.operator) {
            case "<":
              condMatch = numFv < value;
              break;
            case ">":
              condMatch = numFv > value;
              break;
            case "<=":
              condMatch = numFv <= value;
              break;
            case ">=":
              condMatch = numFv >= value;
              break;
            case "=":
              condMatch = Math.abs(numFv - value) < 1e-4;
              break;
            case "crosses_above":
              condMatch = numFv > value && c.change24h > 0;
              break;
            case "crosses_below":
              condMatch = numFv < value && c.change24h < 0;
              break;
          }
        }
        if (i === 0) {
          matches = condMatch;
        } else {
          if (cond.logic === "AND") {
            matches = matches && condMatch;
          } else {
            matches = matches || condMatch;
          }
        }
      }
      return matches;
    });
  },
  async parseNaturalLanguage(prompt) {
    await new Promise((r) => setTimeout(r, 800));
    const p = prompt.toLowerCase();
    const out = [];
    const id = () => crypto.randomUUID();
    const getTimeframe = (s) => {
      if (s.includes("weekly") || s.includes("1w")) return "1w";
      if (s.includes("monthly") || s.includes("1m")) return "1M";
      if (s.includes("hourly") || s.includes("1h")) return "1h";
      if (s.includes("4h") || s.includes("4 hour")) return "4h";
      return "1d";
    };
    const timeframe = getTimeframe(p);
    const parts = p.split(/ and |,| plus /);
    for (const part of parts) {
      const partTf = getTimeframe(part) || timeframe;
      if (part.includes("rsi")) {
        const m = part.match(/rsi[^\d]*(\d+)/);
        const v = m ? m[1] : "60";
        out.push({
          id: id(),
          field: "RSI",
          operator: part.includes("below") || part.includes("oversold") || part.includes("<") ? "<" : ">",
          value: v,
          logic: out.length > 0 ? "AND" : "AND",
          timeframe: partTf
        });
      }
      if (part.includes("ema50") || part.includes("ema 50")) {
        out.push({
          id: id(),
          field: "EMA50",
          operator: part.includes("cross") ? "crosses_above" : part.includes("below") ? "<" : ">",
          value: part.includes("above") || part.includes("below") || part.includes("cross") ? "0" : "50",
          logic: out.length > 0 ? "AND" : "AND",
          timeframe: partTf
        });
      }
      if (part.includes("ema200") || part.includes("ema 200")) {
        out.push({
          id: id(),
          field: "EMA200",
          operator: part.includes("cross") ? "crosses_above" : part.includes("below") ? "<" : ">",
          value: "0",
          logic: out.length > 0 ? "AND" : "AND",
          timeframe: partTf
        });
      }
      if (part.includes("volume")) {
        out.push({
          id: id(),
          field: "Volume",
          operator: ">",
          value: "100000000",
          logic: out.length > 0 ? "AND" : "AND",
          timeframe: partTf
        });
      }
      if (part.includes("change") || part.includes("gain") || part.includes("up")) {
        const m = part.match(/(\d+)/);
        const v = m ? m[1] : "5";
        out.push({
          id: id(),
          field: "Price Change",
          operator: ">",
          value: v,
          logic: out.length > 0 ? "AND" : "AND",
          timeframe: partTf
        });
      }
    }
    if (out.length === 0) {
      out.push({ id: id(), field: "RSI", operator: ">", value: "50", logic: "AND", timeframe: "1d" });
    }
    return out;
  }
};
const FIELD_RULES = {
  RSI: { min: 0, max: 100, int: true, hint: "RSI must be an integer between 0 and 100" },
  EMA20: { min: 0, max: 1e7, hint: "EMA20 must be a positive number" },
  EMA50: { min: 0, max: 1e7, hint: "EMA50 must be a positive number" },
  EMA200: { min: 0, max: 1e7, hint: "EMA200 must be a positive number" },
  Volume: { min: 0, max: 1e12, hint: "Volume must be ≥ 0" },
  SMA50: { min: 0, max: 1e7, hint: "SMA50 must be a positive number" },
  SMA200: { min: 0, max: 1e7, hint: "SMA200 must be a positive number" },
  "Market Cap": { min: 0, max: 1e13, hint: "Market Cap must be ≥ 0" },
  "Price Change": { min: -100, max: 1e3, hint: "Price Change must be between -100 and 1000 (%)" }
};
function validateCondition(c) {
  if (!c.field) return "Select a field";
  if (!c.operator) return "Select an operator";
  const raw = (c.value ?? "").trim();
  if (raw === "") return "Value is required";
  const num = Number(raw);
  if (!Number.isFinite(num)) return "Value must be a valid number";
  const rule = FIELD_RULES[c.field];
  if (!rule) return null;
  if (rule.int && !Number.isInteger(num)) return rule.hint;
  if (num < rule.min || num > rule.max) return rule.hint;
  return null;
}
const scannerNameSchema = stringType().trim().max(60, { message: "Name must be 60 characters or less" });
function validateConditions(conditions) {
  const errors = {};
  if (conditions.length === 0) return errors;
  for (const c of conditions) {
    const err = validateCondition(c);
    if (err) errors[c.id] = err;
  }
  return errors;
}
const TIMEFRAMES = [{
  value: "1h",
  label: "Hourly (1h)"
}, {
  value: "4h",
  label: "4-Hour (4h)"
}, {
  value: "1d",
  label: "Daily (1d)"
}, {
  value: "1w",
  label: "Weekly (1w)"
}, {
  value: "1M",
  label: "Monthly (1M)"
}];
const FIELDS = ["RSI", "EMA20", "EMA50", "EMA200", "Volume", "Market Cap", "Price Change"];
const OPERATORS = [{
  value: "<",
  label: "<"
}, {
  value: ">",
  label: ">"
}, {
  value: "<=",
  label: "<="
}, {
  value: ">=",
  label: ">="
}, {
  value: "=",
  label: "="
}, {
  value: "crosses_above",
  label: "Crosses Above"
}, {
  value: "crosses_below",
  label: "Crosses Below"
}];
function ScannerBuilder() {
  const {
    conditions,
    name,
    setName,
    addCondition,
    updateCondition,
    removeCondition,
    setConditions,
    reset
  } = useScannerStore();
  const [prompt, setPrompt] = reactExports.useState("");
  const [generating, setGenerating] = reactExports.useState(false);
  const [running, setRunning] = reactExports.useState(false);
  const [results, setResults] = reactExports.useState(null);
  const publishResults = useResultsStore((s) => s.setResults);
  const navigate = useNavigate();
  const errors = reactExports.useMemo(() => validateConditions(conditions), [conditions]);
  const nameError = reactExports.useMemo(() => {
    const r = scannerNameSchema.safeParse(name);
    return r.success ? null : r.error.issues[0]?.message ?? "Invalid name";
  }, [name]);
  const errorCount = Object.keys(errors).length;
  const hasErrors = errorCount > 0 || conditions.length === 0;
  const generate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    try {
      const c = await scannerService.parseNaturalLanguage(prompt);
      setConditions(c);
      toast.success("Rules generated from your prompt");
    } finally {
      setGenerating(false);
    }
  };
  const run = async () => {
    if (hasErrors) {
      toast.error("Fix the highlighted conditions before running");
      return;
    }
    setRunning(true);
    setResults(null);
    try {
      const r = await scannerService.run(conditions);
      if (!r || r.length === 0) {
        toast.info("No coins matched your conditions");
        setResults([]);
        return;
      }
      setResults(r);
      publishResults(r, conditions, name || "Untitled Scanner");
      toast.success(`Scan complete · ${r.length} matches`, {
        action: {
          label: "View Results",
          onClick: () => navigate({
            to: "/results"
          })
        }
      });
    } catch (error) {
      console.error("Scanner Error:", error);
      toast.error("Failed to run scanner. Please try again.");
    } finally {
      setRunning(false);
    }
  };
  const save = () => {
    if (hasErrors) {
      toast.error("Fix the highlighted conditions before saving");
      return;
    }
    if (nameError) {
      toast.error(nameError);
      return;
    }
    toast.success(`Scanner "${name || "Untitled"}" saved`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Scanner Builder", description: "Compose conditions visually or describe them in natural language." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-4 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
        " AI Scanner Builder"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 md:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: prompt, onChange: (e) => setPrompt(e.target.value), placeholder: 'e.g. "Coins above RSI 60", "Coins crossing EMA50", "Coins with volume spike"', rows: 2, className: "flex-1 resize-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: generate, disabled: generating, className: "md:w-44", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "mr-2 h-4 w-4" }),
          generating ? "Generating…" : "Generate Rules"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between gap-3 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Conditions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Scanner name", value: name, onChange: (e) => setName(e.target.value), maxLength: 60, "aria-invalid": nameError ? true : void 0, className: cn("max-w-xs", nameError && "border-destructive focus-visible:ring-destructive/50") }),
          nameError && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive", children: nameError })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { delayDuration: 150, children: conditions.map((c, i) => {
          const err = errors[c.id];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-2.5", err ? "border-destructive/60" : "border-border"), children: [
            i > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: c.logic, onValueChange: (v) => updateCondition(c.id, {
              logic: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AND", children: "AND" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "OR", children: "OR" })
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "w-20 justify-center", children: "WHERE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: c.timeframe, onValueChange: (v) => updateCondition(c.id, {
              timeframe: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-32", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "mr-2 h-3.5 w-3.5 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: TIMEFRAMES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.value, children: t.label }, t.value)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: c.field, onValueChange: (v) => updateCondition(c.id, {
              field: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: FIELDS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: f, children: f }, f)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: c.operator, onValueChange: (v) => updateCondition(c.id, {
              operator: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-44", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: OPERATORS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { open: err ? void 0 : false, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { inputMode: "decimal", value: c.value, onChange: (e) => updateCondition(c.id, {
                  value: e.target.value
                }), "aria-invalid": err ? true : void 0, className: cn("w-32 tabular-nums", err && "border-destructive pr-8 focus-visible:ring-destructive/50") }),
                err && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" })
              ] }) }),
              err && /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "top", className: "bg-destructive text-destructive-foreground", children: err })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "ml-auto text-muted-foreground hover:text-destructive", onClick: () => removeCondition(c.id), disabled: conditions.length === 1, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] }, c.id);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: addCondition, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
            " Add Condition"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            errorCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-destructive", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5" }),
              errorCount,
              " invalid condition",
              errorCount > 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", onClick: reset, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "mr-2 h-4 w-4" }),
              " Reset"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipProvider, { delayDuration: 150, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: save, disabled: hasErrors || !!nameError, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
                  " Save Scanner"
                ] }) }) }),
                (hasErrors || nameError) && /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Fix validation errors to save" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: run, disabled: running || hasErrors, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "mr-2 h-4 w-4" }),
                  running ? "Running…" : "Run Scanner"
                ] }) }) }),
                hasErrors && /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Fix validation errors to run" })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    results && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base", children: [
          "Results ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "· ",
            results.length,
            " matches"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate({
          to: "/results"
        }), children: [
          "Open in Scan Results ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-3.5 w-3.5" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0", children: results.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-10 text-center text-sm text-muted-foreground", children: "No coins matched. Try loosening your conditions." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Coin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Price" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "24H" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "RSI" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Volume" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: results.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: c.symbol }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right tabular-nums", children: [
            "$",
            formatPrice(c.price)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChangePill, { value: c.change24h }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right tabular-nums", children: c.rsi !== null ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(c.rsi >= 70 && "text-destructive", c.rsi <= 30 && "text-success"), children: c.rsi.toFixed(2) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground animate-pulse", children: "N/A" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right tabular-nums text-muted-foreground", children: [
            "$",
            formatCompact(c.volume)
          ] })
        ] }, c.symbol)) })
      ] }) }) })
    ] })
  ] });
}
export {
  ScannerBuilder as component
};
