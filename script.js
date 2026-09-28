const header = document.getElementById('siteHeader');
  addEventListener('scroll', () => header.classList.toggle('solid', scrollY > 40), { passive:true });

  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  const toggleMenu = () => menu.classList.toggle('open');
  burger.addEventListener('click', toggleMenu);
  burger.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') toggleMenu(); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }