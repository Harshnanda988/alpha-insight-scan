import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { useThemeStore } from "@/store/theme";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · AlphaX" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  return (
    <div>
      <PageHeader title="Settings" description="Workspace, notifications and integrations." />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="telegram">Telegram</TabsTrigger>
          <TabsTrigger value="data">Data Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>Basic profile and timezone settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1.5 max-w-sm">
                <Label>Display name</Label>
                <Input defaultValue="Trader" />
              </div>
              <div className="grid gap-1.5 max-w-sm">
                <Label>Email</Label>
                <Input type="email" defaultValue="trader@alphax.io" />
              </div>
              <Button onClick={() => toast.success("Saved")}>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Switch between dark and light terminals.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              {(["dark", "light"] as const).map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? "default" : "outline"}
                  onClick={() => setTheme(t)}
                  className="capitalize"
                >
                  {t}
                </Button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose how AlphaX reaches you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                ["Scanner matches", true],
                ["Alert triggers", true],
                ["Weekly summary", false],
                ["Product updates", false],
              ].map(([label, def]) => (
                <div
                  key={label as string}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <span className="text-sm">{label as string}</span>
                  <Switch defaultChecked={def as boolean} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="telegram" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Telegram Integration</CardTitle>
              <CardDescription>
                Connect a Telegram chat to receive instant alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1.5 max-w-sm">
                <Label>Bot token</Label>
                <Input placeholder="123456:ABC-DEF…" />
              </div>
              <div className="grid gap-1.5 max-w-sm">
                <Label>Chat ID</Label>
                <Input placeholder="@your_channel or 123456789" />
              </div>
              <Button onClick={() => toast.success("Telegram connected (mock)")}>
                Connect Telegram
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>Exchanges and data providers used by AlphaX.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {[
                ["Binance", "Spot + Futures market data"],
                ["CoinGecko", "Market caps and metadata"],
                ["Coinbase", "Spot prices"],
                ["Bybit", "Derivatives + perps"],
              ].map(([n, d]) => (
                <div key={n} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div>
                    <div className="text-sm font-medium">{n}</div>
                    <div className="text-xs text-muted-foreground">{d}</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
