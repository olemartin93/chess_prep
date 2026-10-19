export type Side = 'white' | 'black';
export type Category = 'opening' | 'gambit' | 'trap';

export interface Step {
  /** Move in SAN exactly as chess.js writes it (with + or #). */
  san: string;
  /** Short explanation shown after the move is played. */
  note?: string;
}

export interface Line {
  id: string;
  name: string;
  steps: Step[];
}

export interface Opening {
  id: string;
  name: string;
  side: Side;
  category: Category;
  eco: string;
  /** Rough rating range where this is most useful. */
  level: string;
  summary: string;
  ideas: string[];
  lines: Line[];
}

/** Helper to write lines compactly: "e4 e5 Nf3" plus notes keyed by ply index (0-based). */
function line(id: string, name: string, moves: string, notes: Record<number, string> = {}): Line {
  const steps = moves
    .trim()
    .split(/\s+/)
    .map((san, i): Step => {
      const note = notes[i];
      return note === undefined ? { san } : { san, note };
    });
  return { id, name, steps };
}

export const openings: Opening[] = [
  // ───────────── WHITE: OPENINGS ─────────────
  {
    id: 'italian',
    name: 'Italian Game',
    side: 'white',
    category: 'opening',
    eco: 'C50–C54',
    level: '400–1200',
    summary:
      'The classic beginner opening. Develop fast, put your bishop on c4 aiming at the weak f7 square, castle early and build a big pawn centre with c3 and d4.',
    ideas: [
      'Bishop on c4 points at f7 – the weakest square next to the black king.',
      'Play c3 to prepare d4 and grab the centre.',
      'Castle early, then bring a rook to e1.',
      'Do not move the same piece twice without a reason.',
    ],
    lines: [
      line('giuoco-piano', 'Giuoco Piano – centre attack', 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 d5 exd5 Nxd5 Qb3', {
        0: 'Take the centre and open lines for your queen and bishop.',
        2: 'Develop with tempo – the knight attacks e5.',
        4: 'The Italian bishop: it eyes f7.',
        6: 'Prepare d4. This is the key idea of the Giuoco Piano.',
        8: 'Strike in the centre.',
        10: 'Recapture: now you have two pawns in the centre.',
        11: 'Black checks to trade pieces.',
        12: 'Block with the bishop and offer a trade.',
        14: 'Recapture with the knight – it develops a piece.',
        15: 'Black hits back in the centre to free the position.',
        18: 'Qb3 attacks the pinned d5-knight and b7. White has easy, active play.',
      }),
      line('giuoco-pianissimo', 'Giuoco Pianissimo – slow build-up', 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O Re1 a6 Bb3', {
        8: 'A quieter move: protect e4 and keep a solid position.',
        10: 'King safety first.',
        12: 'The rook supports a later d4 push.',
        13: 'Black wants to play b5 and chase your bishop.',
        14: 'Tuck the bishop away on b3 where it still aims at f7.',
      }),
    ],
  },
  {
    id: 'scotch',
    name: 'Scotch Game',
    side: 'white',
    category: 'opening',
    eco: 'C45',
    level: '600–1200',
    summary:
      'Open the centre right away with 3.d4. Leads to open positions where active pieces matter more than deep theory.',
    ideas: [
      'Trade the e5 pawn early so your pieces get open lines.',
      'Your knight on d4 is strong – watch out for attacks on it.',
      'If Black plays …Nf6 you can play e5 to kick the knight.',
    ],
    lines: [
      line('scotch-nf6', 'Main line with 4…Nf6', 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 e5 Qe7 Qe2 Nd5 c4', {
        4: 'The Scotch: challenge the centre immediately.',
        6: 'Recapture and centralise the knight.',
        8: 'Trade knights to damage Black\'s pawns.',
        10: 'Kick the f6-knight with tempo.',
        11: 'Black pins your e5 pawn against the king.',
        12: 'Defend e5 and break the pin.',
        14: 'Chase the knight away from the centre.',
      }),
      line('scotch-bc5', 'Classical with 4…Bc5', 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Bc4', {
        7: 'Black attacks your d4-knight.',
        8: 'Defend the knight while developing.',
        9: 'Black piles up on d4.',
        10: 'One more defender. Your knight is safe.',
        12: 'Develop and castle next.',
      }),
    ],
  },
  {
    id: 'ruy-lopez',
    name: 'Ruy Lopez (Spanish)',
    side: 'white',
    category: 'opening',
    eco: 'C60–C99',
    level: '800–1200',
    summary:
      'Put pressure on the c6-knight that defends e5. One of the oldest and most respected openings – rich, but the basic ideas are simple.',
    ideas: [
      'Bb5 pressures the defender of e5.',
      'Castle quickly, then play Re1, c3 and d4.',
      'The bishop usually retreats to a4 and then b3 to aim at f7.',
    ],
    lines: [
      line('ruy-closed', 'Closed Ruy Lopez', 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3', {
        4: 'Attack the knight that defends e5.',
        5: 'The Morphy Defence: Black asks the bishop what it wants.',
        6: 'Keep the pin. (Bxc6 is the Exchange variation.)',
        8: 'Castle – e4 is not really hanging because of tactics.',
        10: 'Protect e4 with the rook.',
        12: 'Retreat to the best diagonal, aiming at f7.',
        14: 'Prepare d4.',
        16: 'Stop …Bg4 pinning your knight. Next you will play d4.',
      }),
      line('ruy-exchange', 'Exchange variation', 'e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4', {
        6: 'Give up the bishop to damage Black\'s pawns.',
        8: 'Nxe5? fails to …Qd4. Castle first.',
        9: 'Black defends e5.',
        10: 'Open the centre. In the long run your pawn majority is healthier.',
      }),
    ],
  },
  {
    id: 'london',
    name: 'London System',
    side: 'white',
    category: 'opening',
    eco: 'D02',
    level: '400–1200',
    summary:
      'A "system" opening: you set up the same solid structure almost no matter what Black does. Great when you do not want to learn lots of theory.',
    ideas: [
      'Setup: d4, Bf4, e3, Nf3, c3, Nbd2, Bd3, O-O.',
      'Develop the dark bishop to f4 BEFORE playing e3.',
      'If Black attacks the bishop with …Nh5 or …Bd6, retreat to g3.',
      'Later, a knight on e5 supported by f4 can start a kingside attack.',
    ],
    lines: [
      line('london-d5', 'vs …d5 and …c5', 'd4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3', {
        2: 'The London bishop – develop it before e3 locks it in.',
        4: 'Solid. Now the bishop is outside the pawn chain.',
        7: 'Black challenges your centre.',
        8: 'Support d4 with c3. Your pawns form a triangle.',
        10: 'Knight to d2 keeps c3 solid and supports e4 later.',
        11: 'Black offers to trade bishops.',
        12: 'Keep your bishop: retreat to g3.',
        14: 'Every piece developed. Castle next.',
      }),
      line('london-kid', 'vs King\'s Indian setup', 'd4 Nf6 Bf4 g6 e3 Bg7 Nf3 O-O Be2 d6 h3', {
        3: 'Black will fianchetto the bishop.',
        8: 'Modest but safe. Bd3 is also fine.',
        10: 'h3 makes a home for your bishop on h2 and stops …Nh5 / …Bg4 ideas.',
      }),
    ],
  },
  {
    id: 'queens-gambit',
    name: 'Queen\'s Gambit',
    side: 'white',
    category: 'opening',
    eco: 'D06–D69',
    level: '600–1200',
    summary:
      'Offer the c-pawn to pull Black\'s d5 pawn away from the centre. It is not a real gambit – you usually win the pawn back easily.',
    ideas: [
      'c4 attacks d5; if Black takes, play e3/e4 and Bxc4.',
      'Develop Nc3, Bg5 and Nf3 to put pressure on d5.',
      'Do not try too hard to keep material – development first.',
    ],
    lines: [
      line('qgd', 'Queen\'s Gambit Declined', 'd4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Rc1', {
        2: 'The Queen\'s Gambit.',
        3: 'Black declines and holds d5.',
        6: 'Pin the knight that defends d5.',
        8: 'Open the light-squared bishop.',
        12: 'The rook on the half-open c-file puts pressure on c7.',
      }),
      line('qga', 'Queen\'s Gambit Accepted', 'd4 d5 c4 dxc4 e4 e5 Nf3 exd4 Bxc4', {
        3: 'Black takes the pawn.',
        4: 'Grab the whole centre.',
        5: 'Black strikes back.',
        6: 'Develop – do not rush to take on e5.',
        8: 'You win the pawn back with a fast lead in development.',
      }),
      line('slav', 'vs the Slav (…c6)', 'd4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3', {
        3: 'The Slav: Black supports d5 with a pawn.',
        7: 'Black takes and hopes to keep the pawn with …b5.',
        8: 'a4 stops …b5. You will win the pawn back.',
        10: 'Next Bxc4 and you have a great position.',
      }),
    ],
  },

  // ───────────── WHITE: GAMBITS ─────────────
  {
    id: 'fried-liver',
    name: 'Fried Liver Attack',
    side: 'white',
    category: 'gambit',
    eco: 'C57',
    level: '400–1000',
    summary:
      'Against the Two Knights Defence, jump into f7 with Ng5. If Black recaptures on d5 with the knight, you can sacrifice on f7 and drag the king out.',
    ideas: [
      'Ng5 attacks f7 twice (knight + bishop).',
      'If Black plays 5…Nxd5? the Nxf7 sacrifice is very strong.',
      'Against the correct 5…Na5, play Bb5+ and keep the extra pawn.',
    ],
    lines: [
      line('fried-liver-main', 'The sacrifice on f7', 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+ Ke6 Nc3 Nb4 a3', {
        5: 'The Two Knights Defence.',
        6: 'Attack f7 twice!',
        7: 'Black blocks the bishop.',
        9: 'This natural move is a mistake.',
        10: 'Sacrifice! The Fried Liver.',
        12: 'Check – and attack the d5-knight.',
        13: 'The king must defend d5. It is now in the middle of the board.',
        14: 'Pile up on the pinned knight.',
        16: 'Kick the defender. Black\'s king is in real danger.',
      }),
      line('fried-liver-na5', 'Black plays the best move 5…Na5', 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3', {
        9: 'The best defence: attack your bishop.',
        10: 'Check first so the bishop stays active.',
        12: 'Take: you are a pawn up.',
        14: 'Retreat. Black has some activity for the pawn.',
        16: 'Back to safety. Keep calm and develop.',
      }),
    ],
  },
  {
    id: 'kings-gambit',
    name: 'King\'s Gambit',
    side: 'white',
    category: 'gambit',
    eco: 'C30–C39',
    level: '600–1200',
    summary:
      'The romantic gambit. Give up the f-pawn to open the f-file and build a big centre. Leads to wild attacking games.',
    ideas: [
      'f4 attacks e5; if Black takes, play Nf3 to stop …Qh4+.',
      'Play d4 and Bc4 – your pieces aim at f7.',
      'Castle and use the half-open f-file.',
    ],
    lines: [
      line('kg-accepted', 'Accepted – Kieseritzky', 'e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Nf6 Bc4 d5 exd5 Bd6 d4', {
        2: 'The King\'s Gambit!',
        4: 'Develop and stop …Qh4+.',
        5: 'Black protects the extra pawn.',
        6: 'Break up Black\'s pawn chain.',
        8: 'The knight jumps into a strong central square.',
        10: 'Aim at f7.',
        14: 'Grab the centre and support your knight.',
      }),
      line('kg-d6', 'Accepted with 3…d6', 'e4 e5 f4 exf4 Nf3 d6 d4 g5 h4 g4 Ng1', {
        5: 'A solid move that takes e5 away from your knight.',
        6: 'Grab the centre.',
        8: 'Challenge the pawns.',
        10: 'The knight goes back for now – you will win the f4 pawn later with Bxf4.',
      }),
      line('kg-declined', 'Declined with 2…Bc5', 'e4 e5 f4 Bc5 Nf3 d6 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2', {
        3: 'Black declines. The bishop stops you from castling.',
        6: 'Prepare d4 to kick the bishop.',
        8: 'Push in the centre.',
        12: 'Block the check. You have a big centre.',
      }),
    ],
  },
  {
    id: 'danish',
    name: 'Danish Gambit',
    side: 'white',
    category: 'gambit',
    eco: 'C21',
    level: '400–1000',
    summary:
      'Sacrifice two pawns for a huge lead in development and two bishops aimed at the black king. Very dangerous for unprepared opponents.',
    ideas: [
      'After 4…cxb2 5.Bxb2 both bishops rake the board.',
      'Your queen often comes to b3 to hit f7.',
      'Play fast: development is worth more than the pawns.',
    ],
    lines: [
      line('danish-main', 'Accepted', 'e4 e5 d4 exd4 c3 dxc3 Bc4 cxb2 Bxb2 Bb4+ Nc3 Nf6 Ne2 Nxe4 O-O Nxc3 Nxc3 Bxc3 Bxc3', {
        4: 'The Danish: offer a pawn.',
        6: 'Offer a second one! Development is everything.',
        8: 'Two bishops aim at the king.',
        10: 'Block the check.',
        12: 'Defend the knight and prepare castling.',
        14: 'Castle – your king is safe, Black\'s is not.',
        18: 'Two bishops and open lines – lots of attacking chances for the pawns.',
      }),
      line('danish-d5', 'Black returns material with 5…d5', 'e4 e5 d4 exd4 c3 dxc3 Bc4 cxb2 Bxb2 d5 Bxd5 Nf6 Bxf7+ Kxf7 Qxd8 Bb4+ Qd2 Bxd2+ Nxd2', {
        9: 'The best defence: give a pawn back to open lines for Black.',
        12: 'Take with check.',
        14: 'Grab the queen…',
        15: '…but Black wins it back with this check.',
        18: 'Queens are off and the game is about equal – no harm done.',
      }),
    ],
  },
  {
    id: 'evans',
    name: 'Evans Gambit',
    side: 'white',
    category: 'gambit',
    eco: 'C51–C52',
    level: '600–1200',
    summary:
      'An Italian Game with a pawn sacrifice. b4 deflects the c5-bishop so you can play c3 and d4 with tempo.',
    ideas: [
      'b4! gives a pawn to gain time for c3 and d4.',
      'Castle quickly, then open the centre.',
      'Ba3 can stop Black from castling.',
    ],
    lines: [
      line('evans-main', 'Accepted', 'e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O Nge7 cxd4 d5 exd5 Nxd5 Ba3', {
        6: 'The Evans Gambit.',
        8: 'Gain time on the bishop.',
        10: 'Build the centre.',
        12: 'Castle first – development over material.',
        14: 'Now take back the pawn.',
        18: 'The bishop stops Black from castling. Strong attack.',
      }),
    ],
  },

  // ───────────── WHITE: TRAPS ─────────────
  {
    id: 'legal-trap',
    name: 'Légal\'s Trap',
    side: 'white',
    category: 'trap',
    eco: 'C41',
    level: '400–800',
    summary:
      'A famous trap: you "blunder" your queen, but if Black takes it, you deliver mate with three minor pieces.',
    ideas: [
      'Works when Black pins your f3-knight with …Bg4 too early.',
      'Only go for it if the pin is not real (the bishop is undefended).',
    ],
    lines: [
      line('legal-main', 'The queen sacrifice', 'e4 e5 Nf3 d6 Bc4 Bg4 Nc3 g6 Nxe5 Bxd1 Bxf7+ Ke7 Nd5#', {
        3: 'Philidor Defence.',
        5: 'Black pins your knight to the queen.',
        7: 'A slow move. Now the trap works.',
        8: 'Ignore the pin! Your queen is "hanging".',
        9: 'Black grabs the queen…',
        10: 'Check!',
        12: 'Checkmate with three minor pieces.',
      }),
    ],
  },

  // ───────────── BLACK: OPENINGS ─────────────
  {
    id: 'scholars-defence',
    name: 'Stopping Scholar\'s Mate',
    side: 'black',
    category: 'opening',
    eco: 'C20',
    level: '400–800',
    summary:
      'At low ratings many players go for an early Qh5 and Bc4 to mate on f7. Learn the safe replies and punish the early queen.',
    ideas: [
      'Always ask: is f7 attacked twice?',
      'Defend e5 with …Nc6, then block the queen with …g6.',
      'Develop with tempo by attacking the queen.',
    ],
    lines: [
      line('scholar-qh5', 'vs 2.Qh5', 'e4 e5 Qh5 Nc6 Bc4 g6 Qf3 Nf6 Ne2 Bg7', {
        2: 'The queen attacks e5 and f7.',
        3: 'Defend e5 first.',
        4: 'Now f7 is attacked twice – mate is threatened!',
        5: 'Block and attack the queen.',
        6: 'The queen now threatens mate on f7 again.',
        7: 'Block the f-file with a developing move. f7 is safe.',
        9: 'Black is fully safe and ahead in development.',
      }),
      line('scholar-bc4', 'vs 2.Bc4 and 3.Qf3', 'e4 e5 Bc4 Nf6 Qf3 Bc5 Ne2 Nc6 c3 d6', {
        3: 'Develop and cover h5 and the f-file at once.',
        4: 'White still eyes f7, but your knight blocks the f-file.',
        5: 'Develop and aim at f2.',
        7: 'Defend e5.',
        9: 'Solid: support e5 and open your light bishop. Castle next.',
      }),
    ],
  },
  {
    id: 'two-knights',
    name: 'Two Knights Defence',
    side: 'black',
    category: 'opening',
    eco: 'C55–C59',
    level: '600–1200',
    summary:
      'Black\'s active answer to the Italian. Counter-attack e4 right away. You MUST know how to meet the Fried Liver.',
    ideas: [
      'Nf6 attacks e4 straight away.',
      'Against Ng5: play …d5 and after exd5, …Na5! (not …Nxd5).',
      'Against quiet d3: develop, castle, and play …d6.',
    ],
    lines: [
      line('two-knights-ng5', 'vs 4.Ng5 (avoiding the Fried Liver)', 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3 e4', {
        6: 'White attacks f7 twice.',
        7: 'Block the bishop.',
        9: 'The right move! Attack the bishop. (Nxd5? allows the Fried Liver.)',
        11: 'Block the check and open lines.',
        13: 'Recapture. You are a pawn down but very active.',
        15: 'Kick the knight.',
        17: 'Gain more time – White\'s pieces are pushed back.',
      }),
      line('two-knights-d3', 'vs quiet 4.d3', 'e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Be7 O-O O-O Re1 d6', {
        7: 'Simple and solid.',
        9: 'King safety.',
        11: 'Support e5. Next …Na5 or …Be6 to challenge the bishop.',
      }),
    ],
  },
  {
    id: 'caro-kann',
    name: 'Caro-Kann Defence',
    side: 'black',
    category: 'opening',
    eco: 'B10–B19',
    level: '600–1200',
    summary:
      'A rock-solid defence to 1.e4. Support …d5 with …c6 and develop your light bishop BEFORE playing …e6.',
    ideas: [
      '…c6 prepares …d5.',
      'Get the light-squared bishop out (…Bf5 or …Bg4) before …e6.',
      'Solid pawns, easy development, few early traps.',
    ],
    lines: [
      line('ck-classical', 'Classical', 'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3 e6', {
        1: 'The Caro-Kann.',
        3: 'Challenge the centre.',
        7: 'Develop the bishop with tempo.',
        9: 'Keep the bishop on the diagonal.',
        11: 'Make room so the bishop is not trapped.',
        15: 'Retreat; the bishop is still safe.',
        17: 'Trade off White\'s good bishop.',
        19: 'Now …e6. Solid and ready to castle.',
      }),
      line('ck-advance', 'Advance variation', 'e4 c6 d4 d5 e5 Bf5 Nf3 e6 Be2 c5 O-O Nc6', {
        4: 'White gains space.',
        5: 'Bishop out first!',
        7: 'Now …e6 is fine.',
        9: 'Hit the base of White\'s pawn chain.',
        11: 'Pile up on d4.',
      }),
      line('ck-exchange', 'Exchange variation', 'e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6 c3 Nf6 Bf4 Bg4', {
        5: 'Recapture towards the centre.',
        7: 'Develop and watch d4.',
        11: 'Active bishop – again outside the pawn chain.',
      }),
    ],
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian Defence',
    side: 'black',
    category: 'opening',
    eco: 'B01',
    level: '400–1200',
    summary:
      'Hit e4 with …d5 on move one. Simple to learn: the positions look the same nearly every game.',
    ideas: [
      'Recapture with the queen and move it to a5 (safe and active).',
      'Develop …Nf6, …Bf5, …e6, …c6.',
      '…c6 gives your queen a retreat square and covers b5/d5.',
    ],
    lines: [
      line('scandi-main', 'Main line with …Qa5', 'e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 Bf5 Bc4 e6 Bd2 c6', {
        1: 'Attack e4 immediately.',
        3: 'Take back with the queen.',
        4: 'White gains time on the queen.',
        5: 'The queen is safe on a5 and pins the c3-knight.',
        9: 'Bishop out before …e6.',
        11: 'Solid.',
        12: 'Watch out: the knight can jump with a discovered attack on your queen.',
        13: '…c6 covers d5 and b5 and gives your queen a retreat.',
      }),
    ],
  },
  {
    id: 'qgd-black',
    name: 'Queen\'s Gambit Declined',
    side: 'black',
    category: 'opening',
    eco: 'D30–D69',
    level: '600–1200',
    summary:
      'The classical answer to 1.d4 2.c4. Keep a pawn on d5, develop quietly and castle. Includes the Elephant Trap.',
    ideas: [
      'Hold d5 with …e6.',
      'Develop: …Nf6, …Be7, …O-O, …Nbd7.',
      'Elephant Trap: after …Nbd7, Nxd5?? loses a piece for White.',
    ],
    lines: [
      line('qgd-main', 'Main line', 'd4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Rc1 c6', {
        3: 'Decline and keep the centre.',
        7: 'Break the pin.',
        9: 'Castle early.',
        13: 'A solid structure. Later …dxc4 and …e5 or …c5 frees your game.',
      }),
      line('qgd-elephant', 'The Elephant Trap', 'd4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 cxd5 exd5 Nxd5 Nxd5 Bxd8 Bb4+ Qd2 Bxd2+ Kxd2 Kxd8', {
        7: 'Looks like it hangs d5…',
        10: 'White grabs the pawn, thinking your f6-knight is pinned.',
        11: 'But the pin is fake! Take the knight.',
        12: 'White takes your queen…',
        13: 'Check! White must give the queen back.',
        15: 'Take the queen.',
        17: 'You won a full piece (knight).',
      }),
    ],
  },

  // ───────────── BLACK: GAMBITS / TRAPS ─────────────
  {
    id: 'stafford',
    name: 'Stafford Gambit',
    side: 'black',
    category: 'gambit',
    eco: 'C42',
    level: '400–1000',
    summary:
      'A tricky gambit against 2.Nf3. Objectively dubious, but full of traps that catch many players under 1200. Use it as a surprise weapon.',
    ideas: [
      'Give the e5 pawn for fast development.',
      '…Bc5 aims at f2 – watch for …Bxf2+ tactics.',
      'Against a calm opponent (5.d3 Bc5 6.Be2) the gambit is just worse for Black – be honest with yourself.',
    ],
    lines: [
      line('stafford-bg5', 'The Bg5?? queen trap', 'e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6 d3 Bc5 Bg5 Nxe4 Bxd8 Bxf2+ Ke2 Bg4#', {
        5: 'The Stafford Gambit: offer the pawn.',
        7: 'Recapture towards the centre – open lines for the queen and bishop.',
        9: 'Aim at f2.',
        10: 'White pins your knight… or so they think.',
        11: 'Ignore the pin!',
        12: 'White takes the queen.',
        13: 'Check!',
        15: 'Checkmate!',
      }),
      line('stafford-e5', 'The 5.e5 trap', 'e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6 e5 Ne4 d3 Bc5 dxe4 Bxf2+ Ke2 Bg4+ Kxf2 Qxd1', {
        8: 'White kicks your knight.',
        9: 'Go forward, not back.',
        11: 'Leave the knight hanging! It is a trap.',
        12: 'White takes the knight.',
        13: 'Check!',
        15: 'Another check, and the d-file is open.',
        17: 'You win the queen.',
      }),
    ],
  },
  {
    id: 'englund',
    name: 'Englund Gambit Trap',
    side: 'black',
    category: 'trap',
    eco: 'A40',
    level: '400–800',
    summary:
      'A cheeky answer to 1.d4. Unsound against good play, but the famous trap ends in mate on c1 surprisingly often in fast games.',
    ideas: [
      'Use as a surprise in blitz – not for serious games.',
      '…Qe7 attacks the e5 pawn and prepares …Qb4+.',
      'If White plays carefully, just develop and accept you are a pawn down.',
    ],
    lines: [
      line('englund-main', 'The …Qc1# trap', 'd4 e5 dxe5 Nc6 Nf3 Qe7 Bf4 Qb4+ Bd2 Qxb2 Bc3 Bb4 Qd2 Bxc3 Qxc3 Qc1#', {
        1: 'The Englund Gambit.',
        3: 'Attack e5.',
        5: 'Attack e5 again and prepare the queen check.',
        7: 'Fork b2 and the bishop.',
        9: 'Grab the pawn; the rook is attacked.',
        10: 'White attacks your queen.',
        11: 'Pin the bishop!',
        14: 'White recaptures… but forgot about c1.',
        15: 'Checkmate!',
      }),
    ],
  },
];

export function getOpening(id: string): Opening | undefined {
  return openings.find((o) => o.id === id);
}

export const categoryLabel: Record<Category, string> = {
  opening: 'Opening',
  gambit: 'Gambit',
  trap: 'Trap',
};
