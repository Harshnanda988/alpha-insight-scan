import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Pencil, Trash2, Play } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { SAVED_SCANNERS, type SavedScanner } from "@/mock/scanners";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved Scanners · AlphaX" }] }),
  component: SavedScannersPage,
});

function SavedScannersPage() {
  const [scanners, setScanners] = useState<SavedScanner[]>(SAVED_SCANNERS);

  const remove = (id: string) => {
    setScanners((s) => s.filter((x) => x.id !== id));
    toast.success("Scanner deleted");
  };
  const duplicate = (s: SavedScanner) => {
    setScanners((list) => [
      ...list,
      { ...s, id: crypto.randomUUID(), name: `${s.name} (copy)` },
    ]);
    toast.success("Scanner duplicated");
  };

  return (
    <div>
      <PageHeader
        title="Saved Scanners"
        description="Manage your saved scanner configurations."
      />
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scanner Name</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead className="text-right">Matches</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scanners.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                        {s.conditions}
                      </code>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{s.matches}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.created}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toast.success(`Running "${s.name}"…`)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => duplicate(s)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => remove(s.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {scanners.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                      No saved scanners yet.
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
