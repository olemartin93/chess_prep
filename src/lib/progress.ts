import { useSyncExternalStore } from 'react';

export interface LineProgress {
  learned: boolean;
  /** Practice runs finished with no mistakes and no hints. */
  cleanRuns: number;
  attempts: number;
  lastPracticed?: string;
}

export interface Progress {
  lines: Record<string, LineProgress>;
  /** Days (YYYY-MM-DD) with at least one finished line. */
  activeDays: string[];
}

const KEY = 'chessprep:progress:v1';
const empty: Progress = { lines: {}, activeDays: [] };

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { lines: parsed.lines ?? {}, activeDays: parsed.activeDays ?? [] };
  } catch {
    return empty;
  }
}

let state: Progress = load();
const listeners = new Set<() => void>();

function save(next: Progress): void {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage may be unavailable (private mode); progress then lives in memory only.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, () => state);
}

export function lineKey(openingId: string, lineId: string): string {
  return `${openingId}/${lineId}`;
}

export function today(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function update(key: string, fn: (p: LineProgress) => LineProgress): void {
  const prev = state.lines[key] ?? { learned: false, cleanRuns: 0, attempts: 0 };
  const day = today();
  const activeDays = state.activeDays.includes(day) ? state.activeDays : [...state.activeDays, day];
  save({ lines: { ...state.lines, [key]: fn(prev) }, activeDays });
}

export function markLearned(key: string): void {
  update(key, (p) => ({ ...p, learned: true }));
}

export function recordPractice(key: string, clean: boolean): void {
  update(key, (p) => ({
    ...p,
    learned: true,
    attempts: p.attempts + 1,
    cleanRuns: clean ? p.cleanRuns + 1 : p.cleanRuns,
    lastPracticed: new Date().toISOString(),
  }));
}

export function resetProgress(): void {
  save(empty);
}

/** 0 = new, 1 = learned, 2–4 = 1–3 clean practice runs. */
export function masteryLevel(p: LineProgress | undefined): number {
  if (!p) return 0;
  if (!p.learned && p.cleanRuns === 0) return 0;
  return 1 + Math.min(p.cleanRuns, 3);
}

export function streak(days: string[]): number {
  const set = new Set(days);
  let count = 0;
  const d = new Date();
  // Today not done yet still keeps yesterday's streak alive.
  if (!set.has(today())) d.setDate(d.getDate() - 1);
  for (;;) {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    if (!set.has(`${d.getFullYear()}-${m}-${day}`)) break;
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}
