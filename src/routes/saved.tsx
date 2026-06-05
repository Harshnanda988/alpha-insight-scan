import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Copy,
  Play,
  Search,
  Star,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
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
import { PageHeader } from "@/components/shared/PageHeader";
import { SAVED_SCANNERS } from "@/mock/scanners";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved Scanners · AlphaX" }] }),
  component: SavedScanners,
});

function SavedScanners() {
  const [q, setQ] = useState("");
  const [favs, setFavs] = useState<Record<string, boolean>>(
    Object.fromEntries(SAVED_SCANNERS.map((s) => [s.id, s.favorite])),
  );
  const filtered = SAVED_SCANNERS.filter(
    (s) =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.conditions.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Saved Scanners"
        description="Your library of custom market screeners."
        actions={
          <Button asChild>
            <Link to="/scanner">
              <Plus className="mr-2 h-4 w-4" /> New Scanner
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search scanners…"
                className="pl-8"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <button
                        onClick={() => setFavs((f) => ({ ...f, [s.id]: !f[s.id] }))}
                        className="text-muted-foreground hover:text-warning"
                      >
                        <Star
                          className={cn(
                            "h-4 w-4",
                            favs[s.id] && "fill-warning text-warning",
                          )}
                        />
                      </button>
                    </TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-[11px]">
                        {s.conditions}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.createdAt}</TableCell>
                    <TableCell className="text-muted-foreground">{s.lastRun}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toast.success(`Running ${s.name}…`)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to="/scanner">
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toast.success("Duplicated")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => toast.success("Deleted")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No scanners match your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
