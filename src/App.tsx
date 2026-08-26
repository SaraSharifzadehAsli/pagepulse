import { useCallback, useState } from "react";
import { registry } from "./demos/registry";
import { ComponentPreview } from "./components/ComponentPreview";
import { ScoreCard } from "./components/ScoreCard";
import { IssuesList } from "./components/IssuesList";
import { scoreComponent } from "./audit/score";
import type { AccessibilityIssue, ComponentScore, PerformanceSample } from "./audit/types";

interface ResultState {
  issues: AccessibilityIssue[];
  performance: PerformanceSample;
  score: ComponentScore;
}

export default function App() {
  const [results, setResults] = useState<Record<string, ResultState>>({});

  const makeHandler = useCallback(
    (componentId: string, componentName: string) =>
      (issues: AccessibilityIssue[], performance: PerformanceSample) => {
        const score = scoreComponent({ componentId, componentName, accessibilityIssues: issues, performance });
        setResults((prev) => ({ ...prev, [componentId]: { issues, performance, score } }));
      },
    []
  );

  return (
    <main className="app">
      <header className="app-header">
        <h1>PagePulse</h1>
        <p>
          Live accessibility &amp; render-performance audit for a small component gallery. Everything below runs
          against real, mounted DOM in your browser — via <code>axe-core</code> and React's Profiler API — there is
          no external URL fetch and no mocked data.
        </p>
      </header>
      <section className="grid">
        {registry.map(({ id, name, Component }) => (
          <article key={id} className="component-slot">
            <h2>{name}</h2>
            <ComponentPreview componentId={id} Component={Component} onResult={makeHandler(id, name)} />
            {results[id] ? (
              <>
                <ScoreCard score={results[id].score} performance={results[id].performance} />
                <IssuesList issues={results[id].issues} />
              </>
            ) : (
              <p className="pending">auditing…</p>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
