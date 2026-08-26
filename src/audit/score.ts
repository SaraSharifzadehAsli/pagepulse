import type { AccessibilityIssue, ComponentAuditResult, ComponentScore, Severity } from "./types";

/**
 * Points deducted per accessibility violation, by axe-core impact level.
 * Weights are deliberately steep for "critical" — a single blocking issue
 * (e.g. a form control with no accessible name) should visibly tank the score,
 * not get averaged away by unrelated passing checks.
 */
const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 30,
  serious: 15,
  moderate: 6,
  minor: 2,
};

/** One 60fps frame budget (ms). Renders at or under this are "free". */
const PERFORMANCE_FLOOR_MS = 16;
/** Beyond this, the render is considered janky regardless of degree. */
const PERFORMANCE_CEILING_MS = 200;

/** Accessibility is weighted higher: it's the harder failure to notice by eye. */
const WEIGHTS = { accessibility: 0.6, performance: 0.4 } as const;

export function computeAccessibilityScore(issues: AccessibilityIssue[]): number {
  const deduction = issues.reduce((sum, issue) => sum + SEVERITY_WEIGHT[issue.impact], 0);
  return clamp(100 - deduction, 0, 100);
}

export function computePerformanceScore(renderMs: number): number {
  if (renderMs <= PERFORMANCE_FLOOR_MS) return 100;
  if (renderMs >= PERFORMANCE_CEILING_MS) return 0;
  const ratio = (renderMs - PERFORMANCE_FLOOR_MS) / (PERFORMANCE_CEILING_MS - PERFORMANCE_FLOOR_MS);
  return Math.round(clamp(100 - ratio * 100, 0, 100));
}

export function computeOverallScore(accessibilityScore: number, performanceScore: number): number {
  return Math.round(accessibilityScore * WEIGHTS.accessibility + performanceScore * WEIGHTS.performance);
}

export function gradeFromScore(score: number): ComponentScore["grade"] {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function scoreComponent(result: ComponentAuditResult): ComponentScore {
  const accessibilityScore = computeAccessibilityScore(result.accessibilityIssues);
  const performanceScore = computePerformanceScore(result.performance.renderMs);
  const overallScore = computeOverallScore(accessibilityScore, performanceScore);
  return {
    componentId: result.componentId,
    accessibilityScore,
    performanceScore,
    overallScore,
    grade: gradeFromScore(overallScore),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
