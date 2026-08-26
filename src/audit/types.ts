export type Severity = "critical" | "serious" | "moderate" | "minor";

export interface AccessibilityIssue {
  id: string;
  impact: Severity;
  description: string;
  help: string;
  helpUrl: string;
  nodeCount: number;
}

export interface PerformanceSample {
  /** Duration (ms) of the initial mount, measured via React's Profiler API. */
  renderMs: number;
  /** Duration (ms) of a subsequent update commit, measured the same way. */
  rerenderMs: number;
}

export interface ComponentAuditResult {
  componentId: string;
  componentName: string;
  accessibilityIssues: AccessibilityIssue[];
  performance: PerformanceSample;
}

export interface ComponentScore {
  componentId: string;
  accessibilityScore: number;
  performanceScore: number;
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
}
