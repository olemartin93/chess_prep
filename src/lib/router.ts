import { useEffect, useState } from 'react';

export type Mode = 'learn' | 'practice';

export type Route =
  | { name: 'home' }
  | { name: 'opening'; openingId: string }
  | { name: 'train'; openingId: string; lineId: string; mode: Mode };

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const [kind, a, b, c] = parts;
  if (kind === 'o' && a) return { name: 'opening', openingId: a };
  if (kind === 't' && a && b) return { name: 'train', openingId: a, lineId: b, mode: c === 'practice' ? 'practice' : 'learn' };
  return { name: 'home' };
}

export function href(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'opening':
      return `#/o/${route.openingId}`;
    case 'train':
      return `#/t/${route.openingId}/${route.lineId}/${route.mode}`;
  }
}

export function navigate(route: Route): void {
  window.location.hash = href(route);
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = (): void => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
