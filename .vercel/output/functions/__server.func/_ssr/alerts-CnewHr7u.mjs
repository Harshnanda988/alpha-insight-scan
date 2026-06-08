import { r as reactExports, W as jsxRuntimeExports } from "./server-DmgOPCm4.mjs";
import { g as Badge, B as Button, t as toast } from "./router-ov0HDanu.mjs";
import { P as PageHeader, C as Card, c as CardContent } from "./PageHeader-DfRYcKFV.mjs";
import { S as Switch } from "./switch-I_D9AFwv.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-B4SMSDuX.mjs";
import { A as ALERTS } from "./scanners-BBPJ4uZl.mjs";
import { T as Trash2 } from "./trash-2-CaariE3a.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-BznNxV-h.mjs";
function AlertsPage() {
  const [alerts, setAlerts] = reactExports.useState(ALERTS);
  const toggle = (id) => {
    setAlerts((list) => list.map((a) => a.id === id ? {
      ...a,
      status: a.status === "Active" ? "Paused" : "Active"
    } : a));
  };
  const remove = (id) => {
    setAlerts((list) => list.filter((a) => a.id !== id));
    toast.success("Alert removed");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Alerts", description: "Manage scanner alerts and delivery." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Alert Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Scanner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Channel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Last Triggered" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
        alerts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: a.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: a.scanner }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: a.channel }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: a.status === "Active", onCheckedChange: () => toggle(a.id) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: a.status === "Active" ? "text-xs text-success" : "text-xs text-muted-foreground", children: a.status })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: a.lastTriggered }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "text-muted-foreground hover:text-destructive", onClick: () => remove(a.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }) })
        ] }, a.id)),
        alerts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "py-12 text-center text-sm text-muted-foreground", children: "No alerts configured." }) })
      ] })
    ] }) }) }) })
  ] });
}
export {
  AlertsPage as component
};
