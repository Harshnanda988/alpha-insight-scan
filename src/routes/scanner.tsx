import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Play, Save, RotateCcw, Sparkles, Trash2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { useScannerStore, type Field, type Operator } from "@/store/scanner";
import { scannerService } from "@/services/scanner.service";
import { ChangePill } from "@/components/shared/ChangePill";
import { formatCompact, formatPrice, type Coin } from "@/mock/coins";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/scanner")({
  head: () => ({ meta: [{ title: "Scanner Builder · AlphaX" }] }),
  component: ScannerBuilder,
});

const FIELDS: Field[] = [
  "RSI",
  "EMA20",
  "EMA50",
  "EMA200",
  "Volume",
  "Market Cap",
  "Price Change",
];
const OPERATORS: { value: Operator; label: string }[] = [
  { value: "<", label: "<" },
  { value: ">", label: ">" },
  { value: "<=", label: "<=" },
  { value: ">=", label: ">=" },
  { value: "=", label: "=" },
  { value: "crosses_above", label: "Crosses Above" },
  { value: "crosses_below", label: "Crosses Below" },
];

function ScannerBuilder() {
  const {
    conditions,
    name,
    setName,
    addCondition,
    updateCondition,
    removeCondition,
    setConditions,
    reset,
  } = useScannerStore();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Coin[] | null>(null);

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
    setRunning(true);
    try {
      const r = await scannerService.run(conditions);
      setResults(r);
      toast.success(`Scan complete · ${r.length} matches`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Scanner Builder"
        description="Compose conditions visually or describe them in natural language."
      />

      <Card className="mb-4 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" /> AI Scanner Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 md:flex-row">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g. "Coins above RSI 60", "Coins crossing EMA50", "Coins with volume spike"'
              rows={2}
              className="flex-1 resize-none"
            />
            <Button onClick={generate} disabled={generating} className="md:w-44">
              <Wand2 className="mr-2 h-4 w-4" />
              {generating ? "Generating…" : "Generate Rules"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Conditions</CardTitle>
          <Input
            placeholder="Scanner name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-xs"
          />
        </CardHeader>
        <CardContent className="space-y-2">
          {conditions.map((c, i) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-2.5"
            >
              {i > 0 ? (
                <Select
                  value={c.logic}
                  onValueChange={(v) =>
                    updateCondition(c.id, { logic: v as "AND" | "OR" })
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline" className="w-20 justify-center">
                  WHERE
                </Badge>
              )}
              <Select
                value={c.field}
                onValueChange={(v) => updateCondition(c.id, { field: v as Field })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELDS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={c.operator}
                onValueChange={(v) =>
                  updateCondition(c.id, { operator: v as Operator })
                }
              >
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPERATORS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={c.value}
                onChange={(e) => updateCondition(c.id, { value: e.target.value })}
                className="w-32 tabular-nums"
              />
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-muted-foreground hover:text-destructive"
                onClick={() => removeCondition(c.id)}
                disabled={conditions.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <Button variant="outline" onClick={addCondition}>
              <Plus className="mr-2 h-4 w-4" /> Add Condition
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success(`Scanner "${name || "Untitled"}" saved`)}
              >
                <Save className="mr-2 h-4 w-4" /> Save Scanner
              </Button>
              <Button onClick={run} disabled={running}>
                <Play className="mr-2 h-4 w-4" />
                {running ? "Running…" : "Run Scanner"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Results <span className="text-muted-foreground">· {results.length} matches</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {results.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                No coins matched. Try loosening your conditions.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Coin</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">24H</TableHead>
                      <TableHead className="text-right">RSI</TableHead>
                      <TableHead className="text-right">Volume</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((c) => (
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
                        <TableCell className="text-right tabular-nums">{c.rsi}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          ${formatCompact(c.volume)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
