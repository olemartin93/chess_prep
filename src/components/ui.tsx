import type { Category, Side } from '../data/openings';
import { categoryLabel } from '../data/openings';

const categoryColors: Record<Category, string> = {
  opening: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  gambit: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  trap: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
};

export function CategoryBadge({ category }: { category: Category }): React.JSX.Element {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${categoryColors[category]}`}>
      {categoryLabel[category]}
    </span>
  );
}

export function SideBadge({ side }: { side: Side }): React.JSX.Element {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
        side === 'white' ? 'bg-stone-100 text-stone-900 ring-stone-300' : 'bg-stone-950 text-stone-100 ring-stone-600'
      }`}
    >
      {side === 'white' ? '♔ White' : '♚ Black'}
    </span>
  );
}

/** Shows mastery 0–4 as a row of 4 pips. */
export function Mastery({ level }: { level: number }): React.JSX.Element {
  const labels = ['New', 'Learned', 'Practised', 'Good', 'Mastered'];
  return (
    <span className="inline-flex items-center gap-1.5" title={labels[level] ?? ''}>
      {[1, 2, 3, 4].map((i) => (
        <span key={i} className={`h-2 w-2 rounded-full ${i <= level ? 'bg-emerald-400' : 'bg-slate-600'}`} />
      ))}
      <span className="ml-1 text-xs text-slate-400">{labels[level]}</span>
    </span>
  );
}
