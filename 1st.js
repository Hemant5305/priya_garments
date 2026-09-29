(function () {
  var burger = document.getElementById('burger'), menu = document.getElementById('mobileMenu');
  burger.addEventListener('click', function () {
    var on = menu.classList.toggle('on'); burger.classList.toggle('on', on); burger.setAttribute('aria-expanded', on);
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('on'); burger.classList.remove('on'); burger.setAttribute('aria-expanded', 'false'); }); });

  var sec = document.getElementById('collections'), toggle = document.getElementById('toggle');
  function setOpen(o) { sec.classList.toggle('open', o); toggle.setAttribute('aria-expanded', o); }
  toggle.addEventListener('click', function () { setOpen(!sec.classList.contains('open')); });
  document.querySelectorAll('[data-open]').forEach(function (a) { a.addEventListener('click', function () { setOpen(true); }); });

  var track = document.getElementById('track'), dots = document.querySelectorAll('#dots button');
  track.addEventListener('scroll', function () {
    var i = Math.round(track.scrollLeft / (track.scrollWidth / dots.length));
    dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
  }, { passive: true });
  dots.forEach(function (d, k) {
    d.addEventListener('click', function () {
      track.scrollTo({ left: k * (track.scrollWidth / dots.length), behavior: 'smooth' });
    });
  });
})();