import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/PageHeader";
import { ALERTS, type Alert } from "@/mock/scanners";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts · AlphaX" }] }),
  component: AlertsPage,
});

function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS);

  const toggle = (id: string) => {
    setAlerts((list) =>
      list.map((a) =>
        a.id === id ? { ...a, status: a.status === "Active" ? "Paused" : "Active" } : a,
      ),
    );
  };
  const remove = (id: string) => {
    setAlerts((list) => list.filter((a) => a.id !== id));
    toast.success("Alert removed");
  };

  return (
    <div>
      <PageHeader title="Alerts" description="Manage scanner alerts and delivery." />
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert Name</TableHead>
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
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell className="text-muted-foreground">{a.scanner}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{a.channel}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={a.status === "Active"}
                          onCheckedChange={() => toggle(a.id)}
                        />
                        <span
                          className={
                            a.status === "Active"
                              ? "text-xs text-success"
                              : "text-xs text-muted-foreground"
                          }
                        >
                          {a.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{a.lastTriggered}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => remove(a.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {alerts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                      No alerts configured.
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
