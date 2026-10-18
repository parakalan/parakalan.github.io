/*
 * Ther: draws a ratha bandham poem as a chariot of boxes and lights each box
 * while the recital reaches it. Markup:
 *
 *   <div class="ther" data-ther="THER_TVK">
 *     <audio controls preload="metadata" src="..."></audio>
 *   </div>
 *
 * data-ther names a global holding { tiers, deck, timings, end }.
 * data-demo plays a timed preview when there is no recording yet.
 * ?mark in the URL opens a tool to re-time the boxes by tapping.
 *
 * The chariot is laid out at a fixed width and scaled to fit the window, so
 * the whole of it is in view while the recital plays.
 */
(function () {
  'use strict';

  var COLS = 13;
  var WIDTH = 2000;   // layout width of the chariot before scaling
  var LEAD = 0.12;    // light a box this many seconds early

  function h(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    }
    if (text != null) e.textContent = text;
    return e;
  }

  function store(key, value) {
    try {
      if (value === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) { return null; }
  }

  var KALASAM =
    '<svg viewBox="0 0 90 78" aria-hidden="true">' +
    '<defs><pattern id="ther-rib" width="6" height="8" patternUnits="userSpaceOnUse">' +
    '<rect width="3.2" height="8" fill="#2e4a8b"/><rect x="3.2" width="2.8" height="8" fill="#a9badf"/>' +
    '</pattern></defs>' +
    '<path d="M4 78 A41 40 0 0 1 86 78 Z" fill="url(#ther-rib)" stroke="#2e4a8b"/>' +
    '<rect x="30" y="34" width="30" height="5" rx="1" fill="#c9962e"/>' +
    '<path d="M36 34 C30 25 36 15 45 15 C54 15 60 25 54 34 Z" fill="#e9b23b" stroke="#c9962e"/>' +
    '<rect x="40" y="10" width="10" height="5" fill="#c9962e"/>' +
    '<path d="M45 0 C49 4 50 8 45 10 C40 8 41 4 45 0 Z" fill="#b0281f"/>' +
    '</svg>';

  // A ther wheel after the Konark pattern: iron tyre with studs, wooden rim,
  // eight broad spokes with medallions, eight thin ones, and a lotus hub.
  function wheel(cx, cy, r) {
    var k = r / 50;
    function f(n) { return (Math.round(n * 100) / 100).toString(); }
    function at(rad, deg) {
      var a = (deg - 90) * Math.PI / 180;
      return [cx + Math.cos(a) * rad * k, cy + Math.sin(a) * rad * k];
    }
    function ring(rad, stroke, width, fill) {
      return '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(rad * k) + '" fill="' + (fill || 'none') +
        '" stroke="' + stroke + '" stroke-width="' + f(width * k) + '"/>';
    }
    var g = '<g class="ther-wheel" style="transform-origin:' + f(cx) + 'px ' + f(cy) + 'px">';
    g += ring(41, '#4a2e1c', 10);                     // wooden rim
    for (var j = 0; j < 8; j++) {                      // rim joints
      var p1 = at(36, 22.5 + j * 45), p2 = at(46, 22.5 + j * 45);
      g += '<line x1="' + f(p1[0]) + '" y1="' + f(p1[1]) + '" x2="' + f(p2[0]) + '" y2="' + f(p2[1]) +
        '" stroke="#2b1d14" stroke-width="' + f(1.2 * k) + '"/>';
    }
    g += ring(48, '#2b1d14', 4);                      // iron tyre
    for (j = 0; j < 24; j++) {                         // studs
      var d = at(48, j * 15);
      g += '<circle cx="' + f(d[0]) + '" cy="' + f(d[1]) + '" r="' + f(1 * k) + '" fill="#c9962e"/>';
    }
    g += ring(35.4, '#c9962e', 1.4);                  // gilt inner edge
    for (j = 0; j < 8; j++) {                          // thin spokes
      var t1 = at(12, 22.5 + j * 45), t2 = at(35, 22.5 + j * 45);
      g += '<line x1="' + f(t1[0]) + '" y1="' + f(t1[1]) + '" x2="' + f(t2[0]) + '" y2="' + f(t2[1]) +
        '" stroke="#4a2e1c" stroke-width="' + f(1.8 * k) + '"/>';
    }
    for (j = 0; j < 8; j++) {                          // broad spokes, tapering outwards
      var deg = j * 45;
      var pts = [at(11, deg - 16), at(35, deg - 3.6), at(35, deg + 3.6), at(11, deg + 16)];
      g += '<polygon points="' + pts.map(function (q) { return f(q[0]) + ',' + f(q[1]); }).join(' ') +
        '" fill="#4a2e1c"/>';
      var m = at(24, deg);
      g += '<circle cx="' + f(m[0]) + '" cy="' + f(m[1]) + '" r="' + f(3.4 * k) +
        '" fill="#c9962e" stroke="#2b1d14" stroke-width="' + f(0.8 * k) + '"/>';
    }
    g += ring(12, '#4a2e1c', 1.6, '#e9b23b');         // hub
    for (j = 0; j < 8; j++) {                          // lotus petals
      var c = at(7, j * 45);
      g += '<ellipse cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" rx="' + f(2.1 * k) + '" ry="' + f(4 * k) +
        '" fill="#b0281f" transform="rotate(' + (j * 45) + ' ' + f(c[0]) + ' ' + f(c[1]) + ')"/>';
    }
    g += ring(2.8, '#2b1d14', 1.2, '#4a2e1c');
    return g + '</g>';
  }

  // Under the base: a slim axle and two wheels either side of the point of the chariot.
  // One box is 30 units wide; the base's last tier spans x 150 to 240.
  var WHEELS =
    '<svg viewBox="0 0 390 24" aria-hidden="true">' +
    '<path d="M158 0 H232 L225 6 H165 Z" fill="#4a2e1c"/>' +
    '<rect x="162" y="1.6" width="66" height="1" fill="#c9962e"/>' +
    '<rect x="105" y="10.6" width="180" height="2.8" rx="1.4" fill="#4a2e1c"/>' +
    '<circle cx="195" cy="12" r="1.2" fill="#c9962e"/>' +
    wheel(105, 12, 11) + wheel(285, 12, 11) +
    '</svg>';

  // A stand-in for <audio> so the preview can run before there is a recording.
  function Clock(duration) {
    var bus = document.createElement('span');
    var self = { paused: true, duration: duration };
    var base = 0, since = 0;
    function fire(type) { bus.dispatchEvent(new Event(type)); }
    function now() { return self.paused ? base : Math.min(duration, base + (performance.now() - since) / 1000); }
    function tick() {
      if (self.paused) return;
      if (now() >= duration) { base = duration; self.paused = true; fire('pause'); fire('ended'); return; }
      requestAnimationFrame(tick);
    }
    Object.defineProperty(self, 'currentTime', {
      get: now,
      set: function (v) { base = v; since = performance.now(); fire('seeked'); }
    });
    self.play = function () {
      if (!self.paused) return Promise.resolve();
      if (base >= duration) base = 0;
      since = performance.now();
      self.paused = false;
      fire('play');
      tick();
      return Promise.resolve();
    };
    self.pause = function () {
      if (self.paused) return;
      base = now();
      self.paused = true;
      fire('pause');
    };
    self.addEventListener = bus.addEventListener.bind(bus);
    return self;
  }

  function previewTimings(units) {
    var t = 0.6, out = [];
    units.forEach(function (u) {
      out.push(Math.round(t * 100) / 100);
      t += 0.5 + u.text.replace(/\s/g, '').length * 0.07;
    });
    return { timings: out, duration: t + 0.6 };
  }

  function Ther(root, data) {
    var audio = root.querySelector('audio');
    var hasAudio = !!(audio && (audio.getAttribute('src') || audio.querySelector('source[src]')));
    var marking = /[?&]mark\b/.test(location.search);
    var demo = !hasAudio && !marking && root.hasAttribute('data-demo');
    var markKey = 'ther-marks:' + location.pathname + ':' + root.getAttribute('data-ther');

    // Recital order: every box tier by tier, then the deck.
    var units = [];
    data.tiers.forEach(function (tier, t) {
      tier.forEach(function (cell) {
        units.push({ kind: 'cell', tier: t, n: cell[0], text: cell[1], nodes: [] });
      });
    });
    data.deck.forEach(function (line) { units.push({ kind: 'deck', text: line, nodes: [] }); });
    units.forEach(function (u, i) { u.i = i; });

    var timings = data.timings && data.timings.length === units.length ? data.timings.slice() : null;
    var endAt = typeof data.end === 'number' && !marking ? data.end : null;
    var player = hasAudio ? audio : null;
    var marks = [];

    if (demo) {
      var pv = previewTimings(units);
      timings = pv.timings;
      player = Clock(pv.duration);
    }

    // Bar: the player and the line being recited.
    var bar = h('div', { class: 'ther-bar' });
    if (audio) {
      bar.appendChild(audio);
      if (!hasAudio) audio.hidden = true;
    }
    var demoBtn = null;
    if (demo) {
      demoBtn = h('button', { type: 'button', class: 'ther-demo' }, 'Play preview');
      demoBtn.addEventListener('click', function () {
        if (player.paused) player.play(); else player.pause();
      });
      bar.appendChild(demoBtn);
    }
    var caption = h('p', { class: 'ther-caption', 'aria-live': 'polite' });
    bar.appendChild(caption);

    // Chariot: kalasam, the canopy in words, the deck, the base in numbers, wheels.
    var stage = h('div', { class: 'ther-stage' });
    var body = h('div', { class: 'ther-body' });
    var kalasam = h('div', { class: 'ther-kalasam' });
    kalasam.innerHTML = KALASAM;

    function half(top) {
      var grid = h('div', { class: 'ther-half ' + (top ? 'ther-top' : 'ther-bottom') });
      if (!top) grid.setAttribute('aria-hidden', 'true');
      var i = 0;
      data.tiers.forEach(function (tier, t) {
        var w = tier.length;
        var start = (COLS - w) / 2 + 1;
        var row = top ? t + 1 : data.tiers.length - t;
        if (w < COLS) {
          [start - 1, start + w].forEach(function (col) {
            grid.appendChild(h('span', {
              class: top ? 'ther-dome' : 'ther-bell',
              style: 'grid-column:' + col + ';grid-row:' + row
            }));
          });
        }
        tier.forEach(function (cell, p) {
          var u = units[i++];
          var node = h('div', {
            class: 'ther-cell',
            style: 'grid-column:' + (start + p) + ';grid-row:' + row + ';--n:' + cell[0]
          });
          if (top) {
            node.appendChild(h('span', { class: 'ther-w' }, cell[1]));
            node.setAttribute('data-i', u.i);
          } else {
            node.appendChild(h('span', { class: 'ther-n' }, String(cell[0])));
          }
          u.nodes.push(node);
          grid.appendChild(node);
        });
      });
      return grid;
    }

    var deck = h('div', { class: 'ther-deck' });
    var deckText = h('div', { class: 'ther-deck-text' });
    units.forEach(function (u) {
      if (u.kind !== 'deck') return;
      var line = h('span', { class: 'ther-deck-line', 'data-i': u.i }, u.text);
      deckText.appendChild(line);
      u.nodes.push(line);
    });
    deck.appendChild(h('span', { class: 'ther-pillar', 'aria-hidden': 'true' }));
    deck.appendChild(deckText);
    deck.appendChild(h('span', { class: 'ther-pillar', 'aria-hidden': 'true' }));

    var wheels = h('div', { class: 'ther-wheels' });
    wheels.innerHTML = WHEELS;

    body.appendChild(kalasam);
    body.appendChild(half(true));
    body.appendChild(deck);
    body.appendChild(half(false));
    body.appendChild(wheels);
    stage.appendChild(body);

    root.textContent = '';
    root.appendChild(bar);
    root.appendChild(stage);

    // Fit the whole chariot in the window, under the bar.
    function fit() {
      var natural = body.offsetHeight;
      if (!natural) return;
      var room = window.innerHeight - bar.offsetHeight - 16;
      var s = Math.min(stage.clientWidth / WIDTH, room / natural, 1.15);
      s = Math.max(s, 0.1);
      body.style.transform = 'translateX(' + ((stage.clientWidth - WIDTH * s) / 2) + 'px) scale(' + s + ')';
      stage.style.height = Math.ceil(natural * s) + 'px';
    }
    window.addEventListener('resize', fit);
    if (window.ResizeObserver) new ResizeObserver(fit).observe(stage);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    fit();

    // Highlighting
    var current = null;
    var hint = marking
      ? (player ? 'Timing mode.' : 'Load the recording to start timing.')
      : (player ? 'Play the recital to follow along.' : '');

    function paint(active, trail) {
      units.forEach(function (u, i) {
        var done = trail && i < active;
        var on = i === active;
        u.nodes.forEach(function (n) {
          n.classList.toggle('is-done', done);
          n.classList.toggle('is-active', on);
        });
      });
    }

    function say(i) {
      var u = units[i];
      caption.classList.toggle('is-hint', !u);
      caption.textContent = u ? u.text : (player && !player.paused ? '' : hint);
    }

    function indexAt(t) {
      var list = timings || [];
      var lo = 0, hi = list.length - 1, found = -1;
      while (lo <= hi) {
        var mid = (lo + hi) >> 1;
        if (list[mid] <= t) { found = mid; lo = mid + 1; } else { hi = mid - 1; }
      }
      return found;
    }

    function sync() {
      if (!player || !timings) return;
      var t = player.currentTime + LEAD;
      var i = endAt != null && t >= endAt ? units.length : indexAt(t);
      var key = 'p' + i;
      if (key === current) return;
      current = key;
      paint(i, true);
      say(i);
    }

    var raf = 0;
    function loop() {
      sync();
      if (player && !player.paused) raf = requestAnimationFrame(loop);
    }

    function attach(p) {
      p.addEventListener('play', function () {
        root.classList.add('is-playing');
        if (demoBtn) demoBtn.textContent = 'Pause preview';
        cancelAnimationFrame(raf);
        loop();
      });
      p.addEventListener('pause', function () {
        root.classList.remove('is-playing');
        if (demoBtn) demoBtn.textContent = 'Play preview';
        sync();
      });
      p.addEventListener('seeked', sync);
      p.addEventListener('timeupdate', function () { if (p.paused) sync(); });
      p.addEventListener('ended', function () {
        root.classList.remove('is-playing');
        current = 'end';
        paint(units.length, true);
        say(-1);
      });
    }
    if (player) attach(player);
    say(-1);

    // Timing tool (?mark)
    var markUI = null;
    function jumpBack(i) {
      if (!player || i > marks.length) return;
      marks.length = i;
      store(markKey, marks);
      player.currentTime = i > 0 ? marks[i - 1] : 0;
      current = null;
      refreshMarks();
    }
    function mark() {
      if (!player || marks.length >= units.length) return;
      marks.push(Math.round(player.currentTime * 100) / 100);
      store(markKey, marks);
      current = null;
      refreshMarks();
    }
    function refreshMarks() {
      timings = marks.slice();
      markUI.count.textContent = marks.length + ' of ' + units.length + ' marked';
      var next = units[marks.length];
      markUI.next.textContent = next ? 'Next: ' + next.text : 'All marked. Copy the timings and send them over.';
      sync();
      if (!marks.length) { paint(-1, false); say(-1); }
    }
    if (marking) {
      root.classList.add('is-marking');
      body.addEventListener('click', function (e) {
        var cell = e.target.closest('[data-i]');
        if (cell) jumpBack(+cell.getAttribute('data-i'));
      });
      marks = store(markKey) || [];
      var box = h('div', { class: 'ther-mark' });
      box.appendChild(h('p', null,
        'Press Mark (or the M key) as each box begins. Click an earlier box to go back and redo from there.'));
      if (!hasAudio) {
        var file = h('input', { type: 'file', accept: 'audio/*', 'aria-label': 'Recording' });
        file.addEventListener('change', function () {
          if (!file.files[0]) return;
          audio.src = URL.createObjectURL(file.files[0]);
          audio.hidden = false;
          if (!player) { player = audio; attach(audio); }
          hint = 'Timing mode.';
          say(-1);
        });
        box.appendChild(file);
      }
      var row = h('div', { class: 'ther-mark-row' });
      var markBtn = h('button', { type: 'button' }, 'Mark');
      var undoBtn = h('button', { type: 'button' }, 'Undo');
      var copyBtn = h('button', { type: 'button' }, 'Copy timings');
      var count = h('span');
      [markBtn, undoBtn, copyBtn, count].forEach(function (n) { row.appendChild(n); });
      var next = h('p', { class: 'ther-mark-next' });
      var out = h('textarea', { readonly: '', hidden: '', 'aria-label': 'Timings' });
      box.appendChild(row);
      box.appendChild(next);
      box.appendChild(out);
      root.insertBefore(box, stage);
      markUI = { count: count, next: next };

      markBtn.addEventListener('click', mark);
      undoBtn.addEventListener('click', function () {
        marks.pop();
        store(markKey, marks);
        current = null;
        refreshMarks();
      });
      copyBtn.addEventListener('click', function () {
        var text = JSON.stringify(marks);
        out.value = text;
        out.hidden = false;
        out.select();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function () { copyBtn.textContent = 'Copied'; }, function () {});
        }
      });
      document.addEventListener('keydown', function (e) {
        var tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        if (e.key === 'm' || e.key === 'M') { e.preventDefault(); mark(); }
      });
      refreshMarks();
    }
  }

  function init() {
    document.querySelectorAll('[data-ther]').forEach(function (root) {
      var data = window[root.getAttribute('data-ther')];
      if (data) Ther(root, data);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
