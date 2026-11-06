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
$('g-action').textContent = ACT.name;
$('g-over').textContent = G.overLabel;
for (const id of ['field-setting', 'ol-field-setting']) $(id).classList.toggle('hide', FIELDS.length < 2);

fit();
buildBackground();
refreshMenu();
setScoreUI(0);
updateInfo();

// Opened from the hub: use its name and look (kept out of localStorage) and go straight into a room.
const hub = HubLink.params;
if (hub) {
    netStore.name = hub.name;
    settings.p1Skin = Cosmetics.resolve('skin', hub.skin); settings.p1Hat = Cosmetics.resolve('hat', hub.hat);
    settings.p1Boots = Cosmetics.resolve('boots', hub.boots); settings.p1Acc = Cosmetics.resolve('acc', hub.acc);
    HubLink.watch(() => ({ active: net.active, host: net.isHost, code: net.code, players: Object.keys(net.roster).length, seated: Object.keys(net.seats).length, max: settings.teams === 2 ? 4 : 2, inMatch: net.inMatch }));
    if (hub.join || hub.create) { openOnline(); hub.join ? netOpen(hub.join, false) : netOpen(randomCode(), true); }
}
requestAnimationFrame(frame);
