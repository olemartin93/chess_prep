# ♞ Chess Prep

A small installable web app (PWA) that teaches basic chess openings, gambits and traps for 400–1200 rated players.

**Live:** https://olemartin93.github.io/chess_prep/

## What's inside

| As White | As Black |
| --- | --- |
| Italian Game, Scotch, Ruy Lopez, London System, Queen's Gambit | Stopping Scholar's Mate, Two Knights, Caro-Kann, Scandinavian, Queen's Gambit Declined |
| Gambits: Fried Liver, King's Gambit, Danish, Evans | Gambits/traps: Stafford, Englund trap, Elephant trap |
| Trap: Légal's Trap | |

Every line has short explanations of *why* each move is played.

- **Learn mode** – arrows show the next move; your opponent replies automatically.
- **Practise mode** – play from memory. Wrong moves are rejected; hints appear after two misses.
- **Mastery pips** – learn a line, then finish it 3 times without mistakes to master it.
- **Random drill** – practises a random learned line, favouring your weakest ones.
- **Day streak**, offline support and "Install app" on phones.

Progress is stored in the browser (localStorage) on each device.

## Development

```bash
npm install
npm run dev        # local dev server
npm test           # checks every line is legal chess and the traps end in mate
npm run build      # type-check (strict) + production build
```

Stack: Vite, React 19, strict TypeScript, Tailwind CSS v4, chess.js, react-chessboard, vite-plugin-pwa.

### Adding an opening

Add an entry to `src/data/openings.ts`. Write moves in SAN separated by spaces, and add notes by ply index
(0 = White's first move). `npm test` fails if a move is illegal or not written exactly as chess.js would write it.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes to GitHub Pages.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
