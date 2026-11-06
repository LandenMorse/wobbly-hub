// The player's account, shared by the hub and every game page (classic script, defines window.Account).
// The one place that knows the Supabase project, creates the client and signs in (anonymously by default).
// Also: the profile (username + look), ratings, the matchmaking queue and match results (see supabase/README.md).
// ?nettest runs without Supabase: a tab-local id, a local profile and a BroadcastChannel stand-in for the queue.
// Needs Cosmetics (shared/cosmetics/load.js) first.
window.Account = (() => {
    const URL = 'https://arqtzivzpmouvkbavzzr.supabase.co';
    const KEY = 'sb_publishable_qRc5U079YTHeIEmd7ZbchQ_1QKpbki5';   // the public anon key
    const JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
    const SRI = 'sha384-0w2KAL2YHP6wKOkUDzkCDGgVvfmHnj02DHeQ6XcHOgTfFsGyonKOpShMH1x6nk9o';   // pinned: a tampered CDN file will not run
    const LOCAL = /[?&]nettest\b/.test(location.search);
    const NAME_MIN = 3, NAME_MAX = 16;   // the database is the authority (profiles.username)
    const USERNAME = new RegExp(`^[A-Za-z0-9_]{${NAME_MIN},${NAME_MAX}}$`);
    const COS = ['skin', 'hat', 'boots', 'acc'];

    // ---------- The look and name without an account (and as a cache of the profile): one key shared by the hub and the games ----------
    const LOOK_KEY = 'wobbly.look.v1';
    const read = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
    const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } };
    const store = read(LOOK_KEY) || (() => {   // first run: take over whatever the hub and the games saved before
        const hub = read('wobblyHub.settings.v1') || {};
        const game = read('wobblySoccer.settings.v2') || read('wobblyVolleyball.settings.v1') || {};
        const online = read('wobblySoccer.online.v1') || read('wobblyVolleyball.online.v1') || {};
        return { name: hub.name || online.name || '', skin: hub.skin ?? game.p1Skin, hat: hub.hat ?? game.p1Hat, boots: hub.boots ?? game.p1Boots, acc: hub.acc ?? game.p1Acc };
    })();
    const clean = (s) => String(s || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, NAME_MAX);
    const A = {
        LOCAL, USERNAME, NAME_MAX, clean, client: null, id: '', email: '', profile: null, ratings: {}, error: '',
        name: () => store.name = clean(store.name),
        look() { const o = {}; for (const c of COS) o[c] = Cosmetics.resolve(c, store[c]); return o; }
    };
    const persist = () => write(LOOK_KEY, store);

    // A look change goes to the cache at once and to the profile a moment later
    let lookTimer = 0;
    A.setLook = (cos) => {
        if (COS.every(c => store[c] === cos[c])) return;
        for (const c of COS) store[c] = cos[c];
        persist();
        clearTimeout(lookTimer);
        if (A.profile) lookTimer = setTimeout(() => A.client.from('profiles').update({ cosmetics: A.look() }).eq('id', A.id).then(() => {}, () => {}), 800);
    };
    // Save the username. Returns { error } with a message for the player, or {}.
    A.saveName = async (name) => {
        name = clean(name);
        if (!USERNAME.test(name)) return { error: `Use ${NAME_MIN} to ${NAME_MAX} letters, digits or _` };
        if (A.client && A.id && !(A.profile && A.profile.username === name)) {
            const row = { username: name, cosmetics: A.look() };
            const save = () => A.profile ? A.client.from('profiles').update(row).eq('id', A.id) : A.client.from('profiles').insert({ id: A.id, ...row });
            let { error } = await save();
            // The profile may exist after all (it failed to load): reload it and update instead
            if (error && error.code === '23505' && !A.profile && await A.refresh().then(() => A.profile, () => null)) ({ error } = A.profile.username === name ? {} : await save());
            if (error) return { error: error.code === '23505' ? 'Name taken, pick another' : 'Could not save your name' };
            A.profile = { ...A.profile, username: name };
        }
        store.name = name;
        persist();
        return {};
    };
    A.hasProfile = () => !!A.profile;

    // ---------- Sign in (anonymous unless the player linked an email) ----------
    function loadSupabase() {
        if (window.supabase && window.supabase.createClient) return Promise.resolve();
        return new Promise((res, rej) => {
            const s = document.createElement('script');
            s.src = JS; s.integrity = SRI; s.crossOrigin = 'anonymous';
            s.onload = res;
            s.onerror = () => rej(new Error('Could not load the Supabase library. Check your internet connection.'));
            document.head.appendChild(s);
        });
    }
    A.refresh = async () => {   // profile and ratings from the database; the profile becomes the look and name. Throws (keeping what we had) on failure
        if (!A.client || !A.id) return;
        const [p, r] = await Promise.all([
            A.client.from('profiles').select('username, cosmetics').eq('id', A.id).maybeSingle(),
            A.client.from('ratings').select('game, elo, wins, losses').eq('user_id', A.id)
        ]);
        if (p.error || r.error) throw new Error('Could not load your profile');
        A.profile = p.data || null;
        A.ratings = {};
        for (const x of r.data || []) A.ratings[x.game] = x;
        if (A.profile) {
            store.name = A.profile.username;
            for (const c of COS) store[c] = Cosmetics.resolve(c, A.profile.cosmetics && A.profile.cosmetics[c]);
            persist();
        }
    };
    // Resolves once signed in and the profile is loaded, within 8 s; A.id stays '' when offline (A.error says why).
    // A.retry() signs in again (it replaces A.ready); it also runs by itself when the browser comes back online.
    let client = null;   // one Supabase client per page
    const signIn = async () => {
        await loadSupabase();
        client = client || window.supabase.createClient(URL, KEY, { realtime: { params: { eventsPerSecond: 60 } } });
        let { data: { session } } = await client.auth.getSession();
        if (!session) {
            const r = await client.auth.signInAnonymously();
            if (r.error && (r.error.status === 429 || r.error.code === 'over_request_rate_limit')) throw new Error('Too many sign-in attempts right now. Wait a minute and try again.');
            if (r.error || !r.data || !r.data.session) throw new Error('Could not sign in. In Supabase, turn on Authentication → Sign In / Providers → Allow anonymous sign-ins.');
            session = r.data.session;
        }
        return session;
    };
    const within = (p, ms) => Promise.race([p, new Promise((res, rej) => setTimeout(() => rej(new Error('Connecting took too long. Check your internet connection.')), ms))]);
    const connect = async () => {
        if (LOCAL) {   // a tab keeps its id (also in the game iframe it opens): sessionStorage
            A.id = sessionStorage.getItem('wobbly.testId') || Math.random().toString(36).slice(2, 12);
            sessionStorage.setItem('wobbly.testId', A.id);
            return;
        }
        A.error = '';
        try {
            const session = await within(signIn(), 8000);
            A.client = client;
            A.id = session.user.id;
            A.email = session.user.email || '';
            try { client.realtime.setAuth(session.access_token); } catch (e) { /* the client keeps the token fresh itself */ }
            try { navigator.storage.persist().catch(() => {}); } catch (e) { /* asks the browser not to clear the guest account with its cache */ }
            await within(A.refresh(), 4000).catch(() => {});   // signed in even if the profile did not load; saveName copes
        } catch (e) { A.error = e.message || 'Could not sign in'; A.client = null; A.id = ''; }
    };
    A.ready = connect();
    A.retry = () => (A.ready = connect());
    window.addEventListener('online', () => { if (!A.id && !LOCAL) A.retry(); });
    // A guest account with rated games that only this browser knows: worth linking to an email
    A.needsBackup = () => !!A.client && !A.email && Object.values(A.ratings).some(x => x.wins + x.losses > 0);

    // "Save account" links an email to the anonymous user; "Sign in" on another device sends a magic link to an existing one.
    const back = () => location.origin + location.pathname;
    A.saveEmail = async (email) => (await A.client.auth.updateUser({ email }, { emailRedirectTo: back() })).error;
    A.signInEmail = async (email) => (await A.client.auth.signInWithOtp({ email, options: { emailRedirectTo: back(), shouldCreateUser: false } })).error;

    // ---------- Matchmaking and results ----------
    // Contract (supabase/migrations/*_accounts_queue_elo.sql, *_queue_vs_bots.sql, *_trust_queue_heartbeat.sql): join_queue(game, size, bots) -> match | null,
    // poll_queue() -> match | null (heartbeat while waiting), leave_queue(), report_result(match, winner) by every player; matches carry { id, game, size, bots, room_code, host_id, players: [{ id, team }] }. bots: 2 players on team 1 vs bots, unrated.
    // Retries a network failure, a server error or a rate limit (not a refusal, which is the answer)
    const rpc = async (fn, args) => {
        for (const wait of [400, 1200, 3000, 0]) {
            const { data, error, status } = await A.client.rpc(fn, args);
            if (!error) return data;
            if (!wait || (status && status < 500 && status !== 429)) throw new Error(error.message);
            await new Promise(r => setTimeout(r, wait));
        }
    };
    let stop = () => {}, poll = 0;
    // cb(match) for every match formed for me; replaces the previous listener
    A.watchMatches = (cb) => {   // no cb: stop listening
        stop(); stop = () => {}; clearInterval(poll);
        if (!cb) return;
        if (LOCAL) { onMatch = cb; stop = () => { onMatch = null; }; return; }
        onMatch = cb;
        const ch = A.client.channel('my-matches').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'matches' }, (p) => cb(p.new)).subscribe();
        stop = () => { onMatch = null; A.client.removeChannel(ch); };
    };
    A.joinQueue = async (game, size, bots = false) => {
        if (LOCAL) return localJoin(game, size, bots);
        const args = bots ? { p_game: game, p_size: size, p_bots: true } : { p_game: game, p_size: size };   // ranked calls work without the vs-bots migration
        const m = await rpc('join_queue', args);
        if (m && m.id) return m;
        // While waiting: poll_queue every 5 s keeps our place (the server skips waiters it has not heard from in 20 s)
        // and catches a match whose Realtime message we missed. Before the 20261109 migration there is no poll_queue: just stop.
        clearInterval(poll);
        poll = setInterval(async () => {
            try {
                const got = await rpc('poll_queue', {});
                if (got && got.id && onMatch) onMatch(got);
            } catch (e) {
                if (/not in queue/.test(e.message)) A.client.rpc('join_queue', args).then(({ data }) => { if (data && data.id && onMatch) onMatch(data); });
                else if (/does not exist|schema cache/.test(e.message)) clearInterval(poll);
            }
        }, 5000);
        return null;
    };
    A.leaveQueue = async () => { clearInterval(poll); if (LOCAL) localLeave(); else if (A.client) await rpc('leave_queue', {}); };
    A.getMatch = async (id) => {
        if (LOCAL) return (read('wobbly.test.matches') || {})[id] || null;
        const { data } = await A.client.from('matches').select('*').eq('id', id).maybeSingle();
        return data;
    };
    A.reportResult = async (id, winner) => {
        if (LOCAL) {   // stand-in: records the result once, no Elo
            const done = read('wobbly.test.results') || {};
            if (!(id in done)) { done[id] = winner; write('wobbly.test.results', done); }   // every player reports; the first one counts
            return;
        }
        await rpc('report_result', { p_match: id, p_winner: winner });
    };

    // ---------- ?nettest stand-in for the queue (shortcut: tabs of one browser agree through a BroadcastChannel, no server) ----------
    // Every waiting tab keeps the list of waiters. The last of the first `size` waiters forms the match, like join_queue would
    // when the size-th player arrives, and announces it; the others hear it through onMatch. Two tabs forming at the very same moment may disagree.
    let onMatch = null, waiting = null, bc = null;
    const entries = new Map();   // id -> { id, game, size, bots, at }
    const local = () => bc || (bc = Object.assign(new BroadcastChannel('wobbly-test-queue'), { onmessage: (e) => hear(e.data) }));
    function formMatch() {
        if (!waiting) return null;
        const q = [...entries.values()].filter(e => e.game === waiting.game && e.size === waiting.size && e.bots === waiting.bots).sort((a, b) => a.at - b.at || (a.id < b.id ? -1 : 1)).slice(0, waiting.size);
        if (q.length < waiting.size || q[q.length - 1].id !== A.id) return null;
        const code = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 24)]).join('');
        // 1v1: oldest vs newest. 2v2: with equal ratings the DB puts the 1st and 4th on one team.
        const m = { id: 'm' + Math.random().toString(36).slice(2, 10), game: waiting.game, size: waiting.size, bots: waiting.bots, room_code: code, host_id: q[0].id, status: 'live',
            players: q.map((e, i) => ({ id: e.id, team: waiting.bots ? 1 : waiting.size === 2 ? i + 1 : (i === 0 || i === 3 ? 1 : 2) })) };
        const all = read('wobbly.test.matches') || {}; all[m.id] = m; write('wobbly.test.matches', all);
        local().postMessage({ k: 'match', m });
        take(m);
        if (onMatch) onMatch(m);   // formed while hearing a waiter: nobody is awaiting joinQueue for it
        return m;
    }
    function take(m) { for (const p of m.players) entries.delete(p.id); if (m.players.some(p => p.id === A.id)) waiting = null; }
    function hear(d) {
        if (d.k === 'q') { entries.set(d.e.id, d.e); if (d.ask && waiting) local().postMessage({ k: 'q', e: entries.get(A.id) }); formMatch(); }
        else if (d.k === 'leave') entries.delete(d.id);
        else if (d.k === 'match') { const mine = waiting && d.m.players.some(p => p.id === A.id); take(d.m); if (mine && onMatch) onMatch(d.m); }
    }
    async function localJoin(game, size, bots) {
        const e = { id: A.id, game, size, bots, at: Date.now() };
        waiting = { game, size, bots }; entries.set(A.id, e);
        local().postMessage({ k: 'q', e, ask: true });   // ask: waiters answer with their own entry
        await new Promise(r => setTimeout(r, 250));
        return formMatch();
    }
    function localLeave() { waiting = null; entries.delete(A.id); local().postMessage({ k: 'leave', id: A.id }); }

    return A;
})();
