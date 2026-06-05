import { create } from "zustand";

export type Operator = "<" | ">" | "<=" | ">=" | "=" | "crosses_above" | "crosses_below";
export type Field =
  | "RSI"
  | "EMA20"
  | "EMA50"
  | "EMA200"
  | "Volume"
  | "Market Cap"
  | "Price Change";

export interface Condition {
  id: string;
  field: Field;
  operator: Operator;
  value: string;
  logic: "AND" | "OR";
}

interface ScannerState {
  conditions: Condition[];
  name: string;
  setName: (s: string) => void;
  addCondition: () => void;
  updateCondition: (id: string, patch: Partial<Condition>) => void;
  removeCondition: (id: string) => void;
  setConditions: (c: Condition[]) => void;
  reset: () => void;
}

const newCond = (): Condition => ({
  id: crypto.randomUUID(),
  field: "RSI",
  operator: ">",
  value: "60",
  logic: "AND",
});

export const useScannerStore = create<ScannerState>((set) => ({
  conditions: [newCond()],
  name: "",
  setName: (name) => set({ name }),
  addCondition: () => set((s) => ({ conditions: [...s.conditions, newCond()] })),
  updateCondition: (id, patch) =>
    set((s) => ({
      conditions: s.conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),
  removeCondition: (id) =>
    set((s) => ({ conditions: s.conditions.filter((c) => c.id !== id) })),
  setConditions: (conditions) => set({ conditions }),
  reset: () => set({ conditions: [newCond()], name: "" }),
}));
