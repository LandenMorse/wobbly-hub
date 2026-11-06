// The one list of games. The hub builds its areas from it and play.html opens games by id.
//   id      ?game=<id> on play.html, and the name of the rules file games/<id>.js
//   name    shown in the game's title and page title
//   file    the page the hub opens (play.html reads ?game= itself, so the hub adds it)
//   accent  the game's colour in the hub; ground: the hub's ground under its area ('grass' | 'sand')
// Games.define(...) is how a rules file registers itself, see docs/GAMES.md.
window.Games = {
    list: [
        { id: 'soccer', name: 'Soccer', file: 'play.html', accent: '#2ecc71', ground: 'grass' },
        { id: 'volleyball', name: 'Volleyball', file: 'play.html', accent: '#ff9f43', ground: 'sand' }
    ],
    current: null,
    define(def) {
        const entry = this.list.find(g => g.id === def.id);
        if (!entry) throw new Error(`game "${def.id}" is not listed in games/index.js`);
        this.current = { ...entry, ...def };
    }
};
