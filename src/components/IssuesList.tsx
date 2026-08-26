import type { AccessibilityIssue, Severity } from "../audit/types";

const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  serious: "Serious",
  moderate: "Moderate",
  minor: "Minor",
};

export function IssuesList({ issues }: { issues: AccessibilityIssue[] }) {
  if (issues.length === 0) {
    return <p className="no-issues">No accessibility violations detected.</p>;
  }

  return (
    <ul className="issues">
      {issues.map((issue) => (
        <li key={issue.id} className={`issue severity-${issue.impact}`}>
          <span className="badge">{SEVERITY_LABEL[issue.impact]}</span>
          <div>
            <p className="issue-desc">{issue.description}</p>
            <a href={issue.helpUrl} target="_blank" rel="noreferrer">
              {issue.help} · {issue.nodeCount} element{issue.nodeCount === 1 ? "" : "s"}
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
