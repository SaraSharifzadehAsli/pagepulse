import { Profiler, useEffect, useRef, useState } from "react";
import type { ComponentType, ProfilerOnRenderCallback } from "react";
import { runAccessibilityAudit } from "../audit/accessibility";
import type { AccessibilityIssue, PerformanceSample } from "../audit/types";

interface Props {
  componentId: string;
  Component: ComponentType;
  onResult: (componentId: string, issues: AccessibilityIssue[], performance: PerformanceSample) => void;
}

/**
 * Mounts one demo component inside React's Profiler, captures the mount-phase
 * and update-phase commit durations it reports, then runs an axe-core audit
 * against the resulting DOM. The forced re-render (via `tick`) exists purely
 * to sample an "update" commit — the component itself takes no props that
 * would otherwise change.
 */
export function ComponentPreview({ componentId, Component, onResult }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const durations = useRef<{ mount?: number; update?: number }>({});
  const reported = useRef(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setTick((n) => n + 1), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (tick === 0 || reported.current) return;
    if (durations.current.mount === undefined || durations.current.update === undefined) return;
    if (!containerRef.current) return;

    reported.current = true;
    const { mount, update } = durations.current;
    runAccessibilityAudit(containerRef.current)
      .then((issues) => {
        onResult(componentId, issues, { renderMs: mount, rerenderMs: update });
      })
      .catch((error) => {
        // If this ever fires, it'll show up here instead of hanging the UI
        // forever on "auditing…" with no explanation.
        console.error(`Accessibility audit failed for "${componentId}":`, error);
      });
  }, [tick, componentId, onResult]);

  const handleRender: ProfilerOnRenderCallback = (_id, phase, actualDuration) => {
    if (phase === "mount") durations.current.mount = actualDuration;
    if (phase === "update") durations.current.update = actualDuration;
  };

  return (
    <div ref={containerRef} className="preview-surface">
      <Profiler id={componentId} onRender={handleRender}>
        <Component />
      </Profiler>
    </div>
  );
}
