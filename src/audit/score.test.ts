import { describe, it, expect } from "vitest";
import {
  computeAccessibilityScore,
  computePerformanceScore,
  computeOverallScore,
  gradeFromScore,
  scoreComponent,
} from "./score";
import type { AccessibilityIssue } from "./types";

function issue(impact: AccessibilityIssue["impact"]): AccessibilityIssue {
  return {
    id: `mock-${impact}`,
    impact,
    description: "mock issue",
    help: "mock help",
    helpUrl: "https://example.com",
    nodeCount: 1,
  };
}

describe("computeAccessibilityScore", () => {
  it("returns 100 when there are no issues", () => {
    expect(computeAccessibilityScore([])).toBe(100);
  });

  it("deducts more for a critical issue than a minor one", () => {
    const critical = computeAccessibilityScore([issue("critical")]);
    const minor = computeAccessibilityScore([issue("minor")]);
    expect(critical).toBeLessThan(minor);
  });

  it("never goes below 0, even with many severe issues", () => {
    const issues = Array.from({ length: 10 }, () => issue("critical"));
    expect(computeAccessibilityScore(issues)).toBe(0);
  });
});

describe("computePerformanceScore", () => {
  it("gives a perfect score within the 60fps frame budget", () => {
    expect(computePerformanceScore(10)).toBe(100);
    expect(computePerformanceScore(16)).toBe(100);
  });

  it("gives zero at or beyond the ceiling", () => {
    expect(computePerformanceScore(200)).toBe(0);
    expect(computePerformanceScore(500)).toBe(0);
  });

  it("scores linearly between the floor and the ceiling", () => {
    const midpoint = (16 + 200) / 2;
    expect(computePerformanceScore(midpoint)).toBeCloseTo(50, 0);
  });
});

describe("computeOverallScore", () => {
  it("weights accessibility more heavily than performance", () => {
    const accessibilityHeavy = computeOverallScore(100, 0);
    const performanceHeavy = computeOverallScore(0, 100);
    expect(accessibilityHeavy).toBeGreaterThan(performanceHeavy);
  });
});

describe("gradeFromScore", () => {
  it.each([
    [95, "A"],
    [85, "B"],
    [75, "C"],
    [65, "D"],
    [40, "F"],
  ] as const)("maps %d to grade %s", (score, grade) => {
    expect(gradeFromScore(score)).toBe(grade);
  });
});

describe("scoreComponent", () => {
  it("combines accessibility and performance into one grade", () => {
    const result = scoreComponent({
      componentId: "demo",
      componentName: "Demo",
      accessibilityIssues: [issue("moderate")],
      performance: { renderMs: 12, rerenderMs: 4 },
    });
    expect(result.accessibilityScore).toBe(94);
    expect(result.performanceScore).toBe(100);
    expect(result.overallScore).toBe(96);
    expect(result.grade).toBe("A");
  });
});
