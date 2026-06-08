import { W as jsxRuntimeExports, r as reactExports } from "./server-DmgOPCm4.mjs";
import { u as useThemeStore, B as Button, S as Sun, M as Moon, I as Input, d as Separator$1, t as toast, a as cn$1, c as createLucideIcon, P as Primitive, b as cva } from "./router-ov0HDanu.mjs";
import { P as PageHeader, C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./PageHeader-DfRYcKFV.mjs";
import { S as Switch } from "./switch-I_D9AFwv.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./index-BznNxV-h.mjs";
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        props.onMouseDown?.(event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ref, className: cn$1(labelVariants(), className), ...props }));
Label.displayName = Root.displayName;
function SettingsPage() {
  const {
    theme,
    setTheme
  } = useThemeStore();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Settings", description: "Customize AlphaX to fit your workflow." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Appearance" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Theme" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: theme === "light" ? "default" : "outline", onClick: () => setTheme("light"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "mr-2 h-4 w-4" }),
              " Light"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: theme === "dark" ? "default" : "outline", onClick: () => setTheme("dark"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "mr-2 h-4 w-4" }),
              " Dark"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Notifications" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: [["In-app notifications", "Show toast notifications on matches"], ["Email alerts", "Send a summary to your inbox"], ["Sound on match", "Play a sound when a scanner triggers"]].map(([title, desc], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { defaultChecked: i !== 2 })
        ] }, title)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
          " Telegram Settings"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bot", children: "Bot Token" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "bot", placeholder: "123456:ABC-DEF…", type: "password" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "chat", children: "Chat ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "chat", placeholder: "@username or 123456789" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator$1, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Test Connection" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => toast.success("Telegram settings saved"), children: "Save Settings" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  SettingsPage as component
};
