/*
 * Ther: draws a ratha bandham poem as a chariot of boxes and lights each box
 * while the recital reaches it. Markup:
 *
 *   <div class="ther" data-ther="THER_TVK">
 *     <audio controls preload="metadata" src="..."></audio>
 *   </div>
 *
 * data-ther names a global holding { tiers, deck, timings }.
 * data-demo plays a timed preview when there is no recording yet.
 * ?mark in the URL opens the timing tool.
 */
(function () {
  'use strict';

  var COLS = 13;
  var NARROW = 860;   // below this width the boxes show numbers only
  var SIDE = '(min-width: 1240px)';   // wide enough to put the player beside the chariot (see ther.css)
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

  // Under the base: a slim axle and two wheels beside the point of the chariot.
  // One box is 30 units wide; the base's last tier spans x 150 to 240.
  var WHEELS =
    '<svg viewBox="0 0 390 86" aria-hidden="true">' +
    '<path d="M156 0 H234 L222 30 H168 Z" fill="#4a2e1c"/>' +
    '<rect x="160" y="5" width="70" height="2" fill="#c9962e"/>' +
    '<rect x="105" y="39" width="180" height="8" rx="4" fill="#4a2e1c"/>' +
    '<circle cx="195" cy="43" r="3" fill="#c9962e"/>' +
    wheel(105, 43, 39) + wheel(285, 43, 39) +
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
      tier.forEach(function (cell, p) {
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

    // Bar
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
    var controls = h('div', { class: 'ther-controls' });
    var view = h('div', { class: 'ther-view', role: 'group', 'aria-label': 'Show' });
    var wordsBtn = h('button', { type: 'button', 'aria-pressed': 'true' }, 'Words');
    var numsBtn = h('button', { type: 'button', 'aria-pressed': 'false' }, 'Numbers');
    view.appendChild(wordsBtn);
    view.appendChild(numsBtn);
    var followLabel = h('label', { class: 'ther-follow' });
    var followBox = h('input', { type: 'checkbox' });
    followBox.checked = store('ther-follow') !== false;
    followLabel.appendChild(followBox);
    followLabel.appendChild(document.createTextNode('Follow along'));
    controls.appendChild(view);
    controls.appendChild(followLabel);
    bar.appendChild(caption);
    bar.appendChild(controls);

    function setView(numbers) {
      root.classList.toggle('is-numbers', numbers);
      wordsBtn.setAttribute('aria-pressed', String(!numbers));
      numsBtn.setAttribute('aria-pressed', String(numbers));
    }
    wordsBtn.addEventListener('click', function () { setView(false); });
    numsBtn.addEventListener('click', function () { setView(true); });

    // Chariot
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
          node.appendChild(h('span', { class: 'ther-w' }, cell[1]));
          node.appendChild(h('span', { class: 'ther-n', 'aria-hidden': 'true' }, String(cell[0])));
          if (top) node.setAttribute('data-i', u.i);
          u.nodes.push(node);
          grid.appendChild(node);
        });
      });
      return grid;
    }

    var deck = h('div', { class: 'ther-deck' });
    var deckText = h('p', { class: 'ther-deck-text' });
    units.forEach(function (u) {
      if (u.kind !== 'deck') return;
      var span = h('span', { class: 'ther-deck-line', 'data-i': u.i }, u.text);
      if (deckText.firstChild) deckText.appendChild(document.createTextNode(' '));
      deckText.appendChild(span);
      u.nodes.push(span);
    });
    deck.appendChild(h('span', { class: 'ther-pillar', 'aria-hidden': 'true' }));
    deck.appendChild(deckText);
    deck.appendChild(h('span', { class: 'ther-pillar', 'aria-hidden': 'true' }));

    body.appendChild(kalasam);
    body.appendChild(half(true));
    body.appendChild(deck);
    body.appendChild(half(false));
    var wheels = h('div', { class: 'ther-wheels' });
    wheels.innerHTML = WHEELS;
    body.appendChild(wheels);

    root.textContent = '';
    root.appendChild(bar);
    root.appendChild(body);

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
      follow(i);
    }

    // Follow along: while the recital plays, keep the lit box in view. Back off
    // for a few seconds whenever the reader scrolls by hand.
    var handScrolled = 0;
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ['wheel', 'touchmove'].forEach(function (type) {
      window.addEventListener(type, function () { handScrolled = Date.now(); }, { passive: true });
    });
    window.addEventListener('keydown', function (e) {
      if (/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End| )$/.test(e.key)) handScrolled = Date.now();
    });
    function follow(i, now) {
      if (!followBox.checked || !units[i]) return;
      if (!now && (!player || player.paused || Date.now() - handScrolled < 4000)) return;
      var side = window.matchMedia && window.matchMedia(SIDE).matches;
      var inset = side ? 0 : bar.offsetHeight;
      var r = units[i].nodes[0].getBoundingClientRect();
      var room = window.innerHeight - inset;
      if (r.top >= inset + 24 && r.bottom <= inset + room * 0.75) return;
      window.scrollTo({
        top: Math.max(0, window.scrollY + r.top - inset - room * 0.3),
        behavior: calm ? 'auto' : 'smooth'
      });
    }
    followBox.addEventListener('change', function () {
      store('ther-follow', followBox.checked);
      var at = current && current.charAt(0) === 'p' ? +current.slice(1) : -1;
      if (followBox.checked && player && !player.paused) follow(at, true);
    });

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

    // Narrow screens get the numbers view; the caption carries the words.
    function fit() { root.classList.toggle('is-narrow', body.clientWidth < NARROW); }
    if (window.ResizeObserver) new ResizeObserver(fit).observe(body);
    fit();
    say(-1);

    // Timing tool
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
      bar.appendChild(box);
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
