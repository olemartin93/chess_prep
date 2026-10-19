import { useEffect, useMemo, useRef, useState } from 'react';
import { Chess, type Move, type Square } from 'chess.js';
import { Chessboard, type Arrow } from 'react-chessboard';
import type { Line, Opening } from '../data/openings';
import { lineKey, markLearned, masteryLevel, recordPractice, useProgress } from '../lib/progress';
import { href, type Mode } from '../lib/router';
import { boardTheme } from './boardTheme';
import { Mastery } from './ui';

interface Props {
  opening: Opening;
  line: Line;
  mode: Mode;
}

interface Feedback {
  kind: 'good' | 'bad';
  text: string;
}

const SQUARE_RE = /^[a-h][1-8]$/;
function asSquare(s: string): Square | null {
  return SQUARE_RE.test(s) ? (s as Square) : null;
}

/** Plays `san` on a copy of `fen`; returns null if illegal. */
function tryMoveOn(fen: string, move: string | { from: string; to: string; promotion: string }): Move | null {
  try {
    return new Chess(fen).move(move);
  } catch {
    return null;
  }
}

const OPPONENT_DELAY_MS = 650;
const AUTO_HINT_AFTER = 2;

export function Trainer({ opening, line, mode }: Props): React.JSX.Element {
  const key = lineKey(opening.id, line.id);
  const progress = useProgress();
  const myColor = opening.side === 'white' ? 'w' : 'b';

  const [history, setHistory] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [wrongThisMove, setWrongThisMove] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [selected, setSelected] = useState<Square | null>(null);
  const [orientation, setOrientation] = useState(opening.side);
  const recorded = useRef(false);

  const game = useMemo(() => {
    const g = new Chess();
    for (const san of history) g.move(san);
    return g;
  }, [history]);
  const fen = game.fen();
  const ply = history.length;
  const done = ply >= line.steps.length;
  const userTurn = !done && game.turn() === myColor;
  const expected = line.steps[ply];
  const expectedMove = useMemo(() => (expected ? tryMoveOn(fen, expected.san) : null), [fen, expected]);
  const lastMove = game.history({ verbose: true }).at(-1);
  const lastStep = ply > 0 ? line.steps[ply - 1] : undefined;

  // Opponent replies automatically.
  useEffect(() => {
    if (done || userTurn || !expected) return;
    const san = expected.san;
    const t = window.setTimeout(() => setHistory((h) => (h.length === ply ? [...h, san] : h)), OPPONENT_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [done, userTurn, expected, ply]);

  // Save progress once the line is finished.
  useEffect(() => {
    if (!done || recorded.current) return;
    recorded.current = true;
    if (mode === 'learn') markLearned(key);
    else recordPractice(key, mistakes === 0 && !hintUsed);
  }, [done, mode, key, mistakes, hintUsed]);

  const restart = (): void => {
    recorded.current = false;
    setHistory([]);
    setMistakes(0);
    setWrongThisMove(0);
    setHintUsed(false);
    setShowHint(false);
    setFeedback(null);
    setSelected(null);
  };

  const revealHint = (): void => {
    setShowHint(true);
    if (mode === 'practice') setHintUsed(true);
  };

  const attempt = (from: Square, to: Square): boolean => {
    if (!userTurn || !expected) return false;
    const mv = tryMoveOn(fen, { from, to, promotion: 'q' });
    setSelected(null);
    if (!mv) return false;
    if (mv.san === expected.san) {
      setHistory((h) => [...h, mv.san]);
      setFeedback({ kind: 'good', text: `${mv.san} ✓` });
      setShowHint(false);
      setWrongThisMove(0);
      return true;
    }
    const wrong = wrongThisMove + 1;
    setWrongThisMove(wrong);
    setMistakes((m) => m + 1);
    setFeedback({ kind: 'bad', text: `${mv.san} is not the move in this line. Try again.` });
    if (mode === 'practice' && wrong >= AUTO_HINT_AFTER) revealHint();
    return false;
  };

  const targets = useMemo<Square[]>(() => {
    if (!selected) return [];
    return new Chess(fen).moves({ square: selected, verbose: true }).map((m) => m.to);
  }, [selected, fen]);

  const squareStyles: Record<string, React.CSSProperties> = {};
  if (lastMove) {
    squareStyles[lastMove.from] = { backgroundColor: 'rgb(250 204 21 / 0.45)' };
    squareStyles[lastMove.to] = { backgroundColor: 'rgb(250 204 21 / 0.45)' };
  }
  if (selected) squareStyles[selected] = { backgroundColor: 'rgb(16 185 129 / 0.55)' };
  for (const t of targets) {
    squareStyles[t] = {
      ...squareStyles[t],
      background: 'radial-gradient(circle, rgb(15 23 42 / 0.35) 22%, transparent 24%)',
    };
  }

  const arrows: Arrow[] =
    userTurn && expectedMove && (mode === 'learn' || showHint)
      ? [{ startSquare: expectedMove.from, endSquare: expectedMove.to, color: 'rgb(16 185 129 / 0.85)' }]
      : [];

  const lineIndex = opening.lines.findIndex((l) => l.id === line.id);
  const nextLine = opening.lines[lineIndex + 1];
  const level = masteryLevel(progress.lines[key]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <a href={href({ name: 'opening', openingId: opening.id })} className="text-sm text-emerald-400 hover:underline">
          ← {opening.name}
        </a>
        <div className="flex rounded-full bg-slate-800 p-1 text-xs font-semibold">
          {(['learn', 'practice'] as const).map((m) => (
            <a
              key={m}
              href={href({ name: 'train', openingId: opening.id, lineId: line.id, mode: m })}
              className={`whitespace-nowrap rounded-full px-3 py-1 ${m === mode ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'}`}
            >
              {m === 'learn' ? '📖 Learn' : '🧠 Practise'}
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="mx-auto w-full max-w-[min(100%,70vh,600px)]">
          <div className="aspect-square w-full">
          <Chessboard
            options={{
              id: 'trainer',
              position: fen,
              boardOrientation: orientation,
              arrows,
              squareStyles,
              allowDrawingArrows: true,
              animationDurationInMs: 250,
              canDragPiece: ({ piece }) => userTurn && piece.pieceType.startsWith(myColor),
              onPieceDrop: ({ sourceSquare, targetSquare }) => {
                const from = asSquare(sourceSquare);
                const to = targetSquare ? asSquare(targetSquare) : null;
                return from && to ? attempt(from, to) : false;
              },
              onSquareClick: ({ square, piece }) => {
                const sq = asSquare(square);
                if (!sq || !userTurn) return;
                if (selected && targets.includes(sq)) {
                  attempt(selected, sq);
                  return;
                }
                if (piece?.pieceType.startsWith(myColor) && sq !== selected) setSelected(sq);
                else setSelected(null);
              },
              ...boardTheme,
            }}
          />
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>
              Move {Math.min(ply + 1, line.steps.length)} of {line.steps.length}
            </span>
            <button
              type="button"
              onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}
              className="hover:text-slate-200"
            >
              ⇅ Flip board
            </button>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl bg-slate-800/70 p-4 ring-1 ring-slate-700">
            <h1 className="font-semibold">{line.name}</h1>
            <p className="text-xs text-slate-400">
              You play {opening.side} · {mode === 'learn' ? 'Follow the arrows' : 'Play from memory'}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-700">
              <div className="h-full bg-emerald-400 transition-all" style={{ width: `${(ply / line.steps.length) * 100}%` }} />
            </div>
          </div>

          {done ? (
            <div className="rounded-2xl bg-emerald-500/15 p-4 ring-1 ring-emerald-500/40">
              <p className="text-lg font-bold">
                {mode === 'learn' ? '🎉 Line complete!' : mistakes === 0 && !hintUsed ? '🏆 Perfect run!' : '✅ Finished'}
              </p>
              {mode === 'practice' && (
                <p className="text-sm text-slate-300">
                  {mistakes} mistake{mistakes === 1 ? '' : 's'}
                  {hintUsed ? ' · hint used' : ''}
                </p>
              )}
              {lastStep?.note && <p className="mt-2 text-sm text-slate-200">{lastStep.note}</p>}
              <div className="mt-3">
                <Mastery level={level} />
              </div>
              <div className="mt-4 grid gap-2">
                {mode === 'learn' && (
                  <a
                    href={href({ name: 'train', openingId: opening.id, lineId: line.id, mode: 'practice' })}
                    className="rounded-xl bg-emerald-500 px-3 py-2 text-center text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                  >
                    🧠 Practise from memory
                  </a>
                )}
                <button type="button" onClick={restart} className="rounded-xl bg-slate-700 px-3 py-2 text-sm font-semibold hover:bg-slate-600">
                  ↻ Try again
                </button>
                {nextLine && (
                  <a
                    href={href({ name: 'train', openingId: opening.id, lineId: nextLine.id, mode: 'learn' })}
                    className="rounded-xl bg-slate-700 px-3 py-2 text-center text-sm font-semibold hover:bg-slate-600"
                  >
                    Next line: {nextLine.name} →
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-800/70 p-4 ring-1 ring-slate-700">
              {userTurn ? (
                <p className="font-semibold">
                  {mode === 'learn' && expected ? (
                    <>
                      Your move: play <span className="text-emerald-400">{expected.san}</span>
                    </>
                  ) : showHint && expected ? (
                    <>
                      Hint: <span className="text-emerald-400">{expected.san}</span>
                    </>
                  ) : (
                    'Your move – what is the book move?'
                  )}
                </p>
              ) : (
                <p className="font-semibold text-slate-400">{ply === 0 ? 'Opponent starts…' : 'Opponent is thinking…'}</p>
              )}
              {feedback && (
                <p className={`mt-1 text-sm ${feedback.kind === 'good' ? 'text-emerald-400' : 'text-rose-400'}`}>{feedback.text}</p>
              )}
              {lastStep?.note && (
                <p className="mt-3 rounded-xl bg-slate-900/60 p-3 text-sm text-slate-200">
                  <span className="font-mono font-semibold text-amber-300">{lastStep.san}</span> {lastStep.note}
                </p>
              )}
              <div className="mt-3 flex gap-2">
                {mode === 'practice' && userTurn && !showHint && (
                  <button type="button" onClick={revealHint} className="flex-1 rounded-xl bg-slate-700 px-3 py-2 text-sm font-semibold hover:bg-slate-600">
                    💡 Hint
                  </button>
                )}
                <button type="button" onClick={restart} className="flex-1 rounded-xl bg-slate-700 px-3 py-2 text-sm font-semibold hover:bg-slate-600">
                  ↻ Restart
                </button>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-slate-800/70 p-4 ring-1 ring-slate-700">
            <h2 className="mb-2 text-sm font-semibold text-slate-400">Moves</h2>
            <ol className="grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1 font-mono text-sm">
              {Array.from({ length: Math.ceil(line.steps.length / 2) }, (_, i) => {
                const cells = [2 * i, 2 * i + 1].map((idx) => {
                  const step = line.steps[idx];
                  if (!step) return <span key={idx} />;
                  const played = idx < ply;
                  return (
                    <span key={idx} className={idx === ply - 1 ? 'rounded bg-amber-400/20 px-1 text-amber-200' : played ? 'px-1' : 'px-1 text-slate-600'}>
                      {played || mode === 'learn' ? step.san : '…'}
                    </span>
                  );
                });
                return (
                  <li key={i} className="contents">
                    <span className="text-slate-500">{i + 1}.</span>
                    {cells}
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
