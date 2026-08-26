import axe from "axe-core";
import type { AccessibilityIssue } from "./types";

/**
 * axe-core is not designed to run multiple scans at the same time — calling
 * axe.run() again before an earlier call has resolved can make the later
 * call hang forever (this is a documented axe-core limitation, not a bug in
 * how it's called here). This app audits three components at once on
 * mount, so every call is funneled through this tiny queue — a
 * promise-based mutex — so axe only ever scans one component at a time;
 * the others simply wait their turn.
 */
let queue: Promise<void> = Promise.resolve();

export async function runAccessibilityAudit(root: HTMLElement): Promise<AccessibilityIssue[]> {
  const previous = queue;
  let release!: () => void;
  queue = new Promise<void>((resolve) => {
    release = resolve;
  });

  await previous;
  try {
    const results = await axe.run(root);
    return results.violations.map((violation) => ({
      id: violation.id,
      impact: (violation.impact ?? "minor") as AccessibilityIssue["impact"],
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      nodeCount: violation.nodes.length,
    }));
  } finally {
    release();
  }
}
