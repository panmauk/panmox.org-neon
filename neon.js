/* NEON.PANMOX.ORG — shared interactions */
(function () {
  'use strict';

  // ─── Mouse spotlight (pinkish glow that follows cursor) ──────────────
  var spot = document.querySelector('.spotlight');
  if (spot) {
    document.addEventListener('mousemove', function (e) {
      spot.style.left = e.clientX + 'px';
      spot.style.top  = e.clientY + 'px';
      spot.style.opacity = '1';
    });
    document.addEventListener('mouseleave', function () { spot.style.opacity = '0'; });
  }

  // ─── Nav dropdown ────────────────────────────────────────────────────
  var ddBtn = document.getElementById('productsBtn');
  var dd    = document.getElementById('productsDropdown');
  var ddOv  = document.getElementById('dropdownOverlay');
  if (ddBtn && dd && ddOv) {
    var toggle = function () {
      var open = dd.classList.contains('show');
      dd.classList.toggle('show', !open);
      ddOv.classList.toggle('show', !open);
      ddBtn.classList.toggle('open', !open);
    };
    var close = function () {
      dd.classList.remove('show');
      ddOv.classList.remove('show');
      ddBtn.classList.remove('open');
    };
    ddBtn.addEventListener('click', toggle);
    ddOv.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // ─── Newsletter modal ────────────────────────────────────────────────
  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwpiLx3ns4NCbid78rKH4xSn4ST4BYJ4oK_xI44ogJXF6RIoFYr7nl1vR3rTajqngAf/exec';
  var nlBtn   = document.getElementById('navNlBtn');
  var nlOv    = document.getElementById('nlOverlay');
  var nlBox   = document.getElementById('nlContent');
  var subscribed = false;

  function showNl() {
    if (!nlOv) return;
    var html = '<h4>STAY TUNED</h4>' +
               '<p>One transmission when something ships. Nothing else.</p>' +
               '<div class="nl-form">' +
               '<input type="email" id="nlEmail" placeholder="your@email.com">' +
               '<button onclick="window._neonSub()">Subscribe</button>' +
               '</div>';
    if (subscribed) html = '<div class="nl-done">// ALREADY ON THE LIST //</div>';
    nlBox.innerHTML = html;
    nlOv.classList.add('show');
  }
  function hideNl() { if (nlOv) nlOv.classList.remove('show'); }
  if (nlBtn) nlBtn.addEventListener('click', function (e) { e.preventDefault(); showNl(); });
  if (nlOv) nlOv.addEventListener('click', function (e) { if (e.target === nlOv) hideNl(); });
  var nlCloseBtn = document.querySelector('.nl-close');
  if (nlCloseBtn) nlCloseBtn.addEventListener('click', hideNl);

  window._neonSub = function () {
    var emailEl = document.getElementById('nlEmail');
    var email = emailEl ? emailEl.value.trim() : '';
    if (!email || email.indexOf('@') === -1) {
      if (emailEl) {
        emailEl.style.borderColor = '#ff0033';
        emailEl.style.boxShadow = '0 0 12px #ff0033';
      }
      return;
    }
    fetch(SCRIPT_URL + '?email=' + encodeURIComponent(email))
      .then(function (r) { return r.text(); })
      .then(function (result) {
        if (result === 'exists') {
          nlBox.innerHTML = '<div class="nl-done">// ALREADY ON THE LIST //</div>';
        } else {
          subscribed = true;
          nlBox.innerHTML = '<div class="nl-done">// TRANSMISSION CONFIRMED //</div>';
        }
        setTimeout(hideNl, 1800);
      })
      .catch(function () {
        nlBox.innerHTML = '<div class="nl-done" style="color:#ff0033;text-shadow:0 0 8px #ff0033;">// LINK DOWN — RETRY //</div>';
      });
  };

  // ─── Click ripples on signs (small neon shock) ───────────────────────
  document.querySelectorAll('.sign, .btn').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var rect = el.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.style.cssText = [
        'position:absolute',
        'left:' + (e.clientX - rect.left) + 'px',
        'top:'  + (e.clientY - rect.top)  + 'px',
        'width:6px;height:6px',
        'border-radius:50%',
        'background:currentColor',
        'transform:translate(-50%,-50%)',
        'pointer-events:none',
        'animation:rippleShock .7s ease-out forwards',
        'opacity:.6',
        'z-index:10'
      ].join(';');
      var rippleHost = el;
      var pos = getComputedStyle(rippleHost).position;
      if (pos === 'static') rippleHost.style.position = 'relative';
      rippleHost.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 700);
    });
  });

  // inject ripple keyframes once
  if (!document.getElementById('neon-ripple-kf')) {
    var st = document.createElement('style');
    st.id = 'neon-ripple-kf';
    st.textContent = '@keyframes rippleShock { to { width:240px; height:240px; opacity:0; } }';
    document.head.appendChild(st);
  }

  // ─── Distant lightning flash (occasional, very subtle) ───────────────
  setInterval(function () {
    if (Math.random() < 0.18) {
      var fl = document.createElement('div');
      fl.style.cssText = [
        'position:fixed;inset:0;z-index:997;pointer-events:none',
        'background:rgba(255,255,255,.04);transition:opacity .12s'
      ].join(';');
      document.body.appendChild(fl);
      setTimeout(function () { fl.style.opacity = '0'; }, 80);
      setTimeout(function () { fl.remove(); }, 240);
    }
  }, 14000);
})();
