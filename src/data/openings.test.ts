import { Chess } from 'chess.js';
import { describe, expect, it } from 'vitest';
import { openings } from './openings';

describe('opening data', () => {
  it('has unique ids', () => {
    const ids = openings.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
    const lineIds = openings.flatMap((o) => o.lines.map((l) => `${o.id}/${l.id}`));
    expect(new Set(lineIds).size).toBe(lineIds.length);
  });

  for (const opening of openings) {
    for (const ln of opening.lines) {
      it(`${opening.name} – ${ln.name} is legal and in exact SAN`, () => {
        const game = new Chess();
        for (const step of ln.steps) {
          const move = game.move(step.san);
          expect(move.san).toBe(step.san);
        }
        // The line should end on the player's own move.
        const lastIsWhite = ln.steps.length % 2 === 1;
        expect(lastIsWhite).toBe(opening.side === 'white');
      });
    }
  }

  it('mating lines end in checkmate', () => {
    for (const id of ['legal-trap', 'englund']) {
      const o = openings.find((x) => x.id === id);
      const ln = o?.lines[0];
      expect(ln).toBeDefined();
      const game = new Chess();
      for (const s of ln?.steps ?? []) game.move(s.san);
      expect(game.isCheckmate()).toBe(true);
    }
  });
});
