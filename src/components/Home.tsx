import { useMemo, useState } from 'react';
import { openings, type Category, type Side } from '../data/openings';
import { lineKey, masteryLevel, streak, useProgress, type Progress } from '../lib/progress';
import { href, navigate } from '../lib/router';
import { CategoryBadge, Mastery, SideBadge } from './ui';

type SideFilter = Side | 'all';
type CategoryFilter = Category | 'all';

function pickDrill(progress: Progress): { openingId: string; lineId: string } | undefined {
  const all = openings.flatMap((o) => o.lines.map((l) => ({ openingId: o.id, lineId: l.id })));
  const learned = all.filter((x) => masteryLevel(progress.lines[lineKey(x.openingId, x.lineId)]) > 0);
  const pool = learned.length > 0 ? learned : all;
  // Prefer the weakest lines: weight = 5 - mastery.
  const weighted = pool.flatMap((x) => {
    const w = 5 - masteryLevel(progress.lines[lineKey(x.openingId, x.lineId)]);
    return Array.from({ length: w }, () => x);
  });
  return weighted[Math.floor(Math.random() * weighted.length)];
}

function Chip<T extends string>({ value, current, label, onClick }: { value: T; current: T; label: string; onClick: (v: T) => void }): React.JSX.Element {
  const active = value === current;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
        active ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
      }`}
    >
      {label}
    </button>
  );
}

export function Home(): React.JSX.Element {
  const progress = useProgress();
  const [side, setSide] = useState<SideFilter>('all');
  const [cat, setCat] = useState<CategoryFilter>('all');

  const list = useMemo(
    () => openings.filter((o) => (side === 'all' || o.side === side) && (cat === 'all' || o.category === cat)),
    [side, cat],
  );

  const totalLines = openings.reduce((n, o) => n + o.lines.length, 0);
  const learnedLines = openings.reduce(
    (n, o) => n + o.lines.filter((l) => masteryLevel(progress.lines[lineKey(o.id, l.id)]) > 0).length,
    0,
  );
  const days = streak(progress.activeDays);

  const startDrill = (): void => {
    const d = pickDrill(progress);
    if (d) navigate({ name: 'train', openingId: d.openingId, lineId: d.lineId, mode: 'practice' });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-emerald-600/30 to-slate-800 p-5 ring-1 ring-emerald-500/20">
        <h1 className="text-2xl font-bold">Learn your first openings</h1>
        <p className="mt-1 text-sm text-slate-300">
          Basic openings, gambits and traps for 400–1200 rated players. Learn a line with arrows and explanations, then
          practise it from memory.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-slate-900/60 p-2">
            <div className="text-xl font-bold">
              {learnedLines}/{totalLines}
            </div>
            <div className="text-xs text-slate-400">lines learned</div>
          </div>
          <div className="rounded-xl bg-slate-900/60 p-2">
            <div className="text-xl font-bold">{days}🔥</div>
            <div className="text-xs text-slate-400">day streak</div>
          </div>
          <button
            type="button"
            onClick={startDrill}
            className="rounded-xl bg-emerald-500 p-2 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            <div className="text-xl">🎯</div>
            <div className="text-xs">Random drill</div>
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Chip value="all" current={side} label="Both sides" onClick={setSide} />
          <Chip value="white" current={side} label="♔ As White" onClick={setSide} />
          <Chip value="black" current={side} label="♚ As Black" onClick={setSide} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip value="all" current={cat} label="All" onClick={setCat} />
          <Chip value="opening" current={cat} label="Openings" onClick={setCat} />
          <Chip value="gambit" current={cat} label="Gambits" onClick={setCat} />
          <Chip value="trap" current={cat} label="Traps" onClick={setCat} />
        </div>
      </section>

      <ul className="grid gap-3 sm:grid-cols-2">
        {list.map((o) => {
          const levels = o.lines.map((l) => masteryLevel(progress.lines[lineKey(o.id, l.id)]));
          const avg = Math.round(levels.reduce((a, b) => a + b, 0) / levels.length);
          return (
            <li key={o.id}>
              <a
                href={href({ name: 'opening', openingId: o.id })}
                className="block h-full rounded-2xl bg-slate-800/70 p-4 ring-1 ring-slate-700 transition hover:bg-slate-800 hover:ring-emerald-500/50"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <SideBadge side={o.side} />
                  <CategoryBadge category={o.category} />
                  <span className="ml-auto text-xs text-slate-500">{o.level}</span>
                </div>
                <h2 className="mt-2 text-lg font-semibold">{o.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-400">{o.summary}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Mastery level={avg} />
                  <span className="text-xs text-slate-500">
                    {o.lines.length} line{o.lines.length === 1 ? '' : 's'}
                  </span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
