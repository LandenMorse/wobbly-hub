// Link between a game and the Wobbly Hub that embeds it in an iframe (?hub=1&create=1 | join=CODE[&match=ID]).
// Name and look come from the account (shared/account.js), not from the URL.
// Classic script: defines window.HubLink. The URL is untrusted input, so everything is validated here.
window.HubLink = (() => {
    const q = new URLSearchParams(location.search);
    const join = q.get('join') || '';
    const params = q.get('hub') !== '1' ? null : {
        match: (q.get('match') || '').replace(/[^\w-]/g, '').slice(0, 40),   // a ranked match: the room was made by matchmaking
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
