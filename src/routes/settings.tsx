import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sun, Send } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/PageHeader";
import { useThemeStore } from "@/store/theme";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · AlphaX" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="max-w-3xl">
      <PageHeader title="Settings" description="Customize AlphaX to fit your workflow." />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label>Theme</Label>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
              >
                <Sun className="mr-2 h-4 w-4" /> Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
              >
                <Moon className="mr-2 h-4 w-4" /> Dark
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["In-app notifications", "Show toast notifications on matches"],
              ["Email alerts", "Send a summary to your inbox"],
              ["Sound on match", "Play a sound when a scanner triggers"],
            ].map(([title, desc], i) => (
              <div key={title} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{title}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
                <Switch defaultChecked={i !== 2} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Send className="h-4 w-4" /> Telegram Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-1.5">
              <Label htmlFor="bot">Bot Token</Label>
              <Input id="bot" placeholder="123456:ABC-DEF…" type="password" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="chat">Chat ID</Label>
              <Input id="chat" placeholder="@username or 123456789" />
            </div>
            <Separator />
            <div className="flex justify-end gap-2">
              <Button variant="outline">Test Connection</Button>
              <Button onClick={() => toast.success("Telegram settings saved")}>
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
