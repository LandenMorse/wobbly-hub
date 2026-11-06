// Game modes, defined once as data. A game lists the ones it supports in Games.define({ modes: [...] }):
// an id string takes the mode as written here, an object { id, ...fields } overrides fields of that mode or adds a mode of its own.
// kind: 'goals' first to the target score | 'time' most points when the clock ends, ties go to overtime
//       'none' one point wins | 'endless' no limit.  gravity: multiplies base gravity (absolute value).  balls: balls in play.  tag: HUD prefix.
// {point} / {points} in text become the game's word for a score (Games.define({ point: 'goal' })).
'use strict';
const Modes = {
    classic:  { id: 'classic',  name: 'Classic',     kind: 'goals',   desc: 'First to the target score wins.' },
    timed:    { id: 'timed',    name: 'Timed',       kind: 'time',    desc: 'Most {points} when the clock hits zero. Ties go to golden {point}.' },
    golden:   { id: 'golden',   name: 'Golden Goal', kind: 'none',    desc: 'One {point}. Winner takes all.' },
    multi:    { id: 'multi',    name: 'Multi-Ball',  kind: 'goals',   desc: 'Three balls in play at once. Pure chaos.', balls: 3, tag: 'MULTI-BALL' },
    moon:     { id: 'moon',     name: 'Moon Ball',   kind: 'goals',   desc: 'Low gravity. Huge, floaty jumps.', gravity: 0.3, tag: 'MOON BALL' },
    infinite: { id: 'infinite', name: 'Infinite',    kind: 'endless', desc: 'No score limit, no clock. Play forever.' }
};

// This game's modes in menu order: { [id]: mode } plus the ordered ids.
const MODES = {};
const MODE_ORDER = [];
for (const entry of Games.current.modes) {
    const o = typeof entry === 'string' ? { id: entry } : entry;
    const m = { ...Modes[o.id], ...o };
    if (!m.name || !m.kind) throw new Error(`mode "${o.id}" is not defined in shared/modes.js and has no name/kind`);
    const P = Games.current.point;
    m.desc = String(m.desc || '').replace('{points}', P + 's').replace('{point}', P);
    MODES[m.id] = m;
    MODE_ORDER.push(m.id);
}
