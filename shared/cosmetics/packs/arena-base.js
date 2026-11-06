// Base arenas (data only; the game paints them in buildBackground).
Cosmetics.define({ pack: 'arena-base', category: 'arena', author: 'core' }, () => [
    { id: 'night',  name: 'Night Stadium', sky: ['#1e272e', '#0f1418'],            ground: 'grass', grass: ['#27ae60', '#229954'], line: 'rgba(255,255,255,0.3)', net: 'rgba(255,255,255,0.16)', post: '#ecf0f1' },
    { id: 'sunset', name: 'Sunset Park',   sky: ['#2c1a4a', '#c0426b', '#ff9a5a'], ground: 'grass', grass: ['#3fa34d', '#37944a'], line: 'rgba(255,255,255,0.35)', net: 'rgba(255,255,255,0.2)', post: '#fff4e6' },
    { id: 'neon',   name: 'Neon Grid',     sky: ['#07011a', '#1a0638', '#3a0a5c'], ground: 'neon',  line: '#ff2bd6', net: 'rgba(0,240,255,0.25)', post: '#00f0ff' },
    { id: 'beach',  name: 'Beach',         sky: ['#5ec8f2', '#bfeaff'],            ground: 'sand',  line: 'rgba(255,255,255,0.55)', net: 'rgba(255,255,255,0.35)', post: '#ffffff' }
]);
