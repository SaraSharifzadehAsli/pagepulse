import axe from "axe-core";
import type { AccessibilityIssue } from "./types";

/**
 * Runs axe-core against a live, mounted DOM subtree and normalizes the
 * result into the shape the rest of the app (and score.ts) expects.
 *
 * This is a thin wrapper on purpose: axe-core is the industry-standard
 * accessibility rules engine (the same engine behind Chrome DevTools'
 * Lighthouse accessibility audit and the Storybook a11y addon) — the value
 * this project adds is turning its raw output into a scored, per-component
 * report, not reimplementing accessibility rules.
 */
export async function runAccessibilityAudit(root: HTMLElement): Promise<AccessibilityIssue[]> {
  const results = await axe.run(root);
  return results.violations.map((violation) => ({
    id: violation.id,
    impact: (violation.impact ?? "minor") as AccessibilityIssue["impact"],
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    nodeCount: violation.nodes.length,
  }));
}
