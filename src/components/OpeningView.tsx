import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import type { Opening } from '../data/openings';
import { lineKey, masteryLevel, useProgress } from '../lib/progress';
import { href } from '../lib/router';
import { boardTheme } from './boardTheme';
import { CategoryBadge, Mastery, SideBadge } from './ui';

function previewFen(opening: Opening): string {
  const first = opening.lines[0];
  const game = new Chess();
  // Show the position after the first few moves of the main line.
  for (const s of first?.steps.slice(0, 6) ?? []) game.move(s.san);
  return game.fen();
}

function moveText(sans: string[]): string {
  return sans.map((san, i) => (i % 2 === 0 ? `${i / 2 + 1}.${san}` : san)).join(' ');
}

export function OpeningView({ opening }: { opening: Opening }): React.JSX.Element {
  const progress = useProgress();
  return (
    <div className="space-y-6">
      <a href={href({ name: 'home' })} className="text-sm text-emerald-400 hover:underline">
        ← All openings
      </a>
      <div className="grid gap-6 md:grid-cols-[minmax(0,320px)_1fr]">
        <div className="mx-auto aspect-square w-full max-w-[320px]">
          <Chessboard
            options={{
              id: `preview-${opening.id}`,
              position: previewFen(opening),
              boardOrientation: opening.side,
              allowDragging: false,
              ...boardTheme,
            }}
          />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <SideBadge side={opening.side} />
            <CategoryBadge category={opening.category} />
            <span className="text-xs text-slate-500">
              ECO {opening.eco} · {opening.level}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold">{opening.name}</h1>
          <p className="mt-2 text-slate-300">{opening.summary}</p>
          <h2 className="mt-4 font-semibold">Key ideas</h2>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-300">
            {opening.ideas.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
          </ul>
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Lines</h2>
        <ul className="space-y-3">
          {opening.lines.map((l) => {
            const p = progress.lines[lineKey(opening.id, l.id)];
            const level = masteryLevel(p);
            return (
              <li key={l.id} className="rounded-2xl bg-slate-800/70 p-4 ring-1 ring-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{l.name}</h3>
                  <Mastery level={level} />
                </div>
                <p className="mt-1 font-mono text-xs leading-relaxed text-slate-400">{moveText(l.steps.map((s) => s.san))}</p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={href({ name: 'train', openingId: opening.id, lineId: l.id, mode: 'learn' })}
                    className="flex-1 rounded-xl bg-slate-700 px-3 py-2 text-center text-sm font-semibold hover:bg-slate-600"
                  >
                    📖 Learn
                  </a>
                  <a
                    href={href({ name: 'train', openingId: opening.id, lineId: l.id, mode: 'practice' })}
                    className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-center text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                  >
                    🧠 Practise
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
