// Shared engine, part 4: the main loop and boot. Loaded last.
'use strict';

// =====================================================================
//  MAIN LOOP — fixed timestep
// =====================================================================
const STEP = 1000 / 60;
let last = performance.now(), acc = 0;
function advance(now) {
    acc += Math.min(250, now - last);
    last = now;
    let steps = 0;
    while (acc >= STEP && steps < 8) { tick(); acc -= STEP; steps++; }
    if (steps === 8) acc = 0;
}
// Browsers stop requestAnimationFrame in a hidden tab, which would freeze the
// host's simulation (and every guest with it). A Worker timer is not throttled
// the same way, so while hosting a room we keep stepping the match from it.
let bgWorker = null;
function bgKeepAlive(on) {
    try {
        if (on && !bgWorker) {
            const url = URL.createObjectURL(new Blob(['setInterval(()=>postMessage(0),16)'], { type: 'text/javascript' }));
            bgWorker = new Worker(url);
            bgWorker.onmessage = () => { if (document.hidden && net.active && net.isHost) advance(performance.now()); };
        } else if (!on && bgWorker) { bgWorker.terminate(); bgWorker = null; }
    } catch (e) { bgWorker = null; /* no worker support: falls back to rAF only */ }
}
setInterval(() => bgKeepAlive(net.active && net.isHost), 1000);
function frame(now) {
    if (!document.hidden) advance(now);
    else last = performance.now();
    render(now);
    if (state === 'MENU') drawPreviews(now);
    requestAnimationFrame(frame);
}

// The page is shared by all games: fill in this game's words
document.title = `Wobbly ${G.name} - Charge Jump Edition`;
$('g-name').textContent = G.name;
$('g-subtitle').textContent = G.subtitle;
$('start-btn').textContent = $('ol-start').textContent = G.startLabel;
$('g-hint').textContent = `Enter: start · P / Esc: pause · M: mute · ${G.hint}`;
$('g-action').textContent = ACT.name + (ACT.tip ? ` ${ACT.tip}` : '');
$('g-over').textContent = G.overLabel;
for (const id of ['field-setting', 'ol-field-setting']) $(id).classList.toggle('hide', FIELDS.length < 2);

fit();
buildBackground();
refreshMenu();
setScoreUI(0);
updateInfo();

// Opened from the hub: go straight into a room. Name and look come from the account (shared/account.js).
// A ranked match (?match=<id>) is hosted by the match's host in the room matchmaking already made.
const hub = HubLink.params;
if (hub) {
    HubLink.watch(() => ({ active: net.active, host: net.isHost, code: net.code, players: Object.keys(net.roster).length, seated: Object.keys(net.seats).length, max: settings.teams === 2 ? 4 : 2, inMatch: net.inMatch }));
    if (hub.join || hub.create) (async () => {
        openOnline();
        await Account.ready;
        const m = hub.match ? await Account.getMatch(hub.match).catch(() => null) : null;
        if (hub.match && !(m && m.room_code === hub.join && m.game === G.id && m.players.some(p => p.id === Account.id))) { olStatus('This match is not available.', true); return; }
        hub.join ? netOpen(hub.join, !!m && m.host_id === Account.id, m) : netOpen(randomCode(), true);
    })();
}
requestAnimationFrame(frame);
