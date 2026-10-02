(() => {
  const db = supabase.createClient(CONFIG.url, CONFIG.key);
  const $ = (s) => document.querySelector(s);
  const cat = $('#cat'), grid = $('#grid'), msg = $('#msg');
  const say = (t, bad) => { msg.textContent = t; msg.className = bad ? 'err' : ''; };
  const url = (p) => `${CONFIG.url}/storage/v1/object/public/photos/${p}`;

  cat.innerHTML = CATEGORIES.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');

  const show = (signedIn) => {
    $('#loginform').hidden = signedIn;
    $('#panel').hidden = !signedIn;
    if (signedIn) load();
  };

  /* Shrink big phone photos to 1000px wide JPEG before upload */
  const shrink = (file) => new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 1000 / img.width), c = document.createElement('canvas');
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      c.toBlob((b) => (b ? res(b) : rej(new Error('compress'))), 'image/jpeg', 0.82);
    };
    img.onerror = () => rej(new Error('read'));
    img.src = URL.createObjectURL(file);
  });

  async function load() {
    const { data, error } = await db.from('photos').select('*')
      .eq('category', cat.value).order('created_at', { ascending: false });
    if (error) return say('Could not load photos. Check config.js and setup.sql.', true);
    grid.innerHTML = data.length
      ? data.map((p) => `<figure><img src="${url(p.path)}" alt=""><button data-id="${p.id}" data-path="${p.path}">Delete</button></figure>`).join('')
      : '<p class="empty">No photos here yet. Upload some above.</p>';
  }

  $('#loginform').onsubmit = async (e) => {
    e.preventDefault();
    const { error } = await db.auth.signInWithPassword({ email: $('#email').value, password: $('#pass').value });
    if (error) return say('Email or password is wrong.', true);
    say(''); show(true);
  };

    $('#upform').onsubmit = async (e) => {
    e.preventDefault();
    const files = [...$('#files').files];
    if (!files.length) return say('Choose at least one photo.', true);
    const btn = $('#upbtn'); btn.disabled = true;
    let done = 0, why = '';
    for (const [i, f] of files.entries()) {
      say(`Uploading photo ${i + 1} of ${files.length}...`);
      try {
        const path = `${cat.value}/${Date.now()}-${i}.jpg`;
        let r = await db.storage.from('photos').upload(path, await shrink(f), { contentType: 'image/jpeg' });
        if (r.error) throw r.error;
        r = await db.from('photos').insert({ category: cat.value, path });
        if (r.error) throw r.error;
        done++;
      } catch (err) { console.error(err); why = err.message || String(err); }
    }
    btn.disabled = false; $('#files').value = '';
    say(done === files.length
      ? `${done} photo(s) uploaded. They are now live on the home page.`
      : `${done} of ${files.length} uploaded. Error: ${why}`, done < files.length);
    load();
  };

  grid.onclick = async (e) => {
    const b = e.target.closest('button[data-id]');
    if (!b || !confirm('Delete this photo from the website?')) return;
    await db.storage.from('photos').remove([b.dataset.path]);
    const { error } = await db.from('photos').delete().eq('id', b.dataset.id);
    say(error ? 'Could not delete. Try again.' : 'Photo deleted.', !!error);
    load();
  };

  cat.onchange = load;
  $('#logout').onclick = async () => { await db.auth.signOut(); say(''); show(false); };
  db.auth.getSession().then(({ data }) => show(!!data.session));
})();