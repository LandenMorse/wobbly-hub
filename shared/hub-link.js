// Link between a game and the Wobbly Hub that embeds it in an iframe (?hub=1&name=..&skin=..&create=1|join=CODE).
// Classic script: defines window.HubLink. The URL is untrusted input, so everything is validated here.
// Cosmetic ids are returned raw; the game validates them with Cosmetics.resolve.
window.HubLink = (() => {
    const q = new URLSearchParams(location.search);
    const join = q.get('join') || '';
    const params = q.get('hub') !== '1' ? null : {
        name: (q.get('name') || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 12) || 'Player',
        skin: q.get('skin'), hat: q.get('hat'), boots: q.get('boots'), acc: q.get('acc'),
        join: /^[A-Z]{4}$/.test(join) ? join : '',
        create: q.get('create') === '1'
    };
    const post = (m) => {
        if (window.parent === window) return;
        window.parent.postMessage({ wobbly: 1, ...m }, location.protocol === 'file:' ? '*' : location.origin);
    };
    let last = '';
    return {
        params,
        // Tell the hub when the player leaves the room or the game.
        left(msg) { if (params) post({ type: 'left', msg: String(msg || '') }); },
        // Poll the room state and post it whenever it changes.
        // shortcut: polling (2 per second) instead of hooking every state change, replace if the room code gets an event bus.
        watch(get) {
            if (params) setInterval(() => {
                const s = JSON.stringify(get());
                if (s !== last) { last = s; post({ type: 'room', ...JSON.parse(s) }); }
            }, 500);
        }
    };
})();
