import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IssuesList } from "./IssuesList";
import type { AccessibilityIssue } from "../audit/types";

const sampleIssue: AccessibilityIssue = {
  id: "image-alt",
  impact: "critical",
  description: "Images must have alternate text",
  help: "Ensure <img> elements have alternate text",
  helpUrl: "https://dequeuniversity.com/rules/axe/image-alt",
  nodeCount: 1,
};

describe("IssuesList", () => {
  it("shows a clean-bill-of-health message when there are no issues", () => {
    render(<IssuesList issues={[]} />);
    expect(screen.getByText("No accessibility violations detected.")).toBeInTheDocument();
  });

  it("renders one entry per issue, with its severity and help link", () => {
    render(<IssuesList issues={[sampleIssue]} />);
    expect(screen.getByText("Critical")).toBeInTheDocument();
    expect(screen.getByText("Images must have alternate text")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", sampleIssue.helpUrl);
  });
});
