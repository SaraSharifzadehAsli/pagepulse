import type { ComponentScore, PerformanceSample } from "../audit/types";

interface Props {
  score: ComponentScore;
  performance: PerformanceSample;
}

export function ScoreCard({ score, performance }: Props) {
  return (
    <div className={`score-card grade-${score.grade}`}>
      <div className="grade" aria-label={`Overall grade ${score.grade}`}>
        {score.grade}
      </div>
      <dl>
        <div className="stat">
          <dt>Accessibility</dt>
          <dd>{score.accessibilityScore}/100</dd>
        </div>
        <div className="stat">
          <dt>Performance</dt>
          <dd>{score.performanceScore}/100</dd>
        </div>
        <div className="stat">
          <dt>Mount</dt>
          <dd>{performance.renderMs.toFixed(2)} ms</dd>
        </div>
        <div className="stat">
          <dt>Re-render</dt>
          <dd>{performance.rerenderMs.toFixed(2)} ms</dd>
        </div>
      </dl>
    </div>
  );
}
