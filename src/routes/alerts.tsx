import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BellRing, Pencil, Plus, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAlertStore } from "@/store/alerts";
import { SAVED_SCANNERS } from "@/mock/scanners";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts · AlphaX" }] }),
  component: AlertsPage,
});

function AlertsPage() {
  const { alerts, toggle, remove, add } = useAlertStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [scanner, setScanner] = useState(SAVED_SCANNERS[0].name);
  const [channel, setChannel] = useState<"telegram" | "email" | "webhook">("telegram");

  const create = () => {
    if (!name.trim()) return;
    add({ name, scanner, channel, enabled: true });
    toast.success(`Alert "${name}" created`);
    setOpen(false);
    setName("");
  };

  return (
    <div>
      <PageHeader
        title="Alerts"
        description="Get notified the moment your scanners find new matches."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Alert</DialogTitle>
                <DialogDescription>
                  Trigger a notification whenever your chosen scanner finds matches.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Alert name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Scanner</Label>
                  <Select value={scanner} onValueChange={setScanner}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SAVED_SCANNERS.map((s) => (
                        <SelectItem key={s.id} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Channel</Label>
                  <Select value={channel} onValueChange={(v) => setChannel(v as never)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="telegram">Telegram</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={create}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert</TableHead>
                <TableHead>Scanner</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Triggered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium">
                      <BellRing className="h-4 w-4 text-primary" />
                      {a.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{a.scanner}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      <Send className="mr-1 h-3 w-3" />
                      {a.channel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={a.enabled} onCheckedChange={() => toggle(a.id)} />
                      <span className="text-xs text-muted-foreground">
                        {a.enabled ? "Active" : "Paused"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {a.lastTriggered
                      ? new Date(a.lastTriggered).toLocaleString()
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          remove(a.id);
                          toast.success("Alert removed");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {alerts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    No alerts yet. Create one to be notified of new matches.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
