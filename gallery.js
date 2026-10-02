/* Home page: replaces placeholder tiles with photos uploaded from the admin panel. */
(async () => {
  if (typeof CONFIG === 'undefined' || CONFIG.url.startsWith('YOUR')) return;
  try {
    const r = await fetch(`${CONFIG.url}/rest/v1/photos?select=category,path&order=created_at.desc`,
      { headers: { apikey: CONFIG.key } });
    if (!r.ok) return;
    const by = {};
    (await r.json()).forEach((p) => (by[p.category] ||= []).push(p));
    CATEGORIES.forEach(([id, label]) => {
      const tiles = document.querySelector(`#${id} .tiles`);
      if (!tiles || !by[id]) return; // no photos yet: keep placeholders
      tiles.innerHTML = by[id].map((p) =>
        `<div class="tile"><div class="ph"><img src="${CONFIG.url}/storage/v1/object/public/photos/${p.path}" alt="${label} at Priya Garments" loading="lazy" width="400" height="500"></div></div>`
      ).join('');
    });
    window.dispatchEvent(new Event('resize')); // refresh the slider arrows
  } catch (e) { /* offline or not configured: placeholders stay */ }
})();
