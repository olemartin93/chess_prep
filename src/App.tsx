import { useEffect, useState } from 'react';
import { getOpening } from './data/openings';
import { useRoute, href } from './lib/router';
import { resetProgress } from './lib/progress';
import { Home } from './components/Home';
import { OpeningView } from './components/OpeningView';
import { Trainer } from './components/Trainer';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function useInstallPrompt(): (() => void) | null {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  useEffect(() => {
    const onPrompt = (e: Event): void => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = (): void => setEvt(null);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);
  if (!evt) return null;
  return () => {
    void evt.prompt();
    setEvt(null);
  };
}

function NotFound(): React.JSX.Element {
  return (
    <div className="py-20 text-center">
      <p className="text-slate-400">That page does not exist.</p>
      <a href={href({ name: 'home' })} className="mt-2 inline-block text-emerald-400 hover:underline">
        Go home
      </a>
    </div>
  );
}

function Page(): React.JSX.Element {
  const route = useRoute();
  if (route.name === 'home') return <Home />;
  const opening = getOpening(route.openingId);
  if (!opening) return <NotFound />;
  if (route.name === 'opening') return <OpeningView opening={opening} />;
  const line = opening.lines.find((l) => l.id === route.lineId);
  if (!line) return <NotFound />;
  // Keyed so switching line or mode starts fresh.
  return <Trainer key={`${opening.id}/${line.id}/${route.mode}`} opening={opening} line={line} mode={route.mode} />;
}

export function App(): React.JSX.Element {
  const install = useInstallPrompt();
  return (
    <div className="min-h-dvh bg-slate-900 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href={href({ name: 'home' })} className="flex items-center gap-2 font-bold">
            <span className="text-2xl">♞</span> Chess Prep
          </a>
          {install && (
            <button type="button" onClick={install} className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-slate-950">
              Install app
            </button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Page />
      </main>
      <footer className="mx-auto max-w-5xl px-4 pb-8 text-center text-xs text-slate-500">
        Works offline · progress is saved on this device ·{' '}
        <button
          type="button"
          className="underline hover:text-slate-300"
          onClick={() => {
            if (window.confirm('Reset all progress?')) resetProgress();
          }}
        >
          reset progress
        </button>
      </footer>
    </div>
  );
}
