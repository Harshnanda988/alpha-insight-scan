import { z } from "zod";
import type { Condition, Field } from "@/store/scanner";

// Per-field numeric constraints (min, max, integer)
const FIELD_RULES: Record<Field, { min: number; max: number; int?: boolean; hint: string }> = {
  RSI: { min: 0, max: 100, int: true, hint: "RSI must be an integer between 0 and 100" },
  EMA: { min: 0, max: 10_000_000, hint: "EMA value must be a positive number" },
  SMA: { min: 0, max: 10_000_000, hint: "SMA value must be a positive number" },
  Volume: { min: 0, max: 1_000_000_000_000, hint: "Volume must be ≥ 0" },
  "Market Cap": { min: 0, max: 10_000_000_000_000, hint: "Market Cap must be ≥ 0" },
  "Price Change": { min: -100, max: 1000, hint: "Price Change must be between -100 and 1000 (%)" },
};

export function validateCondition(c: Condition): string | null {
  if (!c.field) return "Select a field";
  if (!c.operator) return "Select an operator";
  
  // For EMA/SMA, validate period
  if (["EMA", "SMA"].includes(c.field)) {
    const periodRaw = (c.indicatorPeriod ?? "").trim();
    if (periodRaw === "") return "Indicator period is required";
    const period = Number(periodRaw);
    if (!Number.isFinite(period) || !Number.isInteger(period) || period < 1) return "Indicator period must be a positive integer (e.g., 15, 50)";
  }
  
  // Only require value only if comparison type is "value"
  const comparisonType = c.comparisonType || "value";
  if (comparisonType === "value") {
    const raw = (c.value ?? "").trim();
    if (raw === "") return "Value is required";
    const num = Number(raw);
    if (!Number.isFinite(num)) return "Value must be a valid number";
    const rule = FIELD_RULES[c.field];
    if (rule) {
      if (rule.int && !Number.isInteger(num)) return rule.hint;
      if (num < rule.min || num > rule.max) return rule.hint;
    }
  } else if (comparisonType === "indicator") {
    if (!c.comparisonIndicator) return "Select comparison indicator";
    const comparePeriodRaw = (c.comparisonIndicatorPeriod ?? "").trim();
    if (["EMA", "SMA"].includes(c.comparisonIndicator)) {
      if (comparePeriodRaw === "") return "Comparison indicator period is required";
      const comparePeriod = Number(comparePeriodRaw);
      if (!Number.isFinite(comparePeriod) || !Number.isInteger(comparePeriod) || comparePeriod < 1) {
        return "Comparison indicator period must be a positive integer";
      }
    }
  }

  return null;
}

export const scannerNameSchema = z
  .string()
  .trim()
  .max(60, { message: "Name must be 60 characters or less" });

export function validateConditions(conditions: Condition[]): Record<string, string> {
  const errors: Record<string, string> = {};
  if (conditions.length === 0) return errors;
  for (const c of conditions) {
    const err = validateCondition(c);
    if (err) errors[c.id] = err;
  }
  return errors;
}
