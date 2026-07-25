// Emiliana Parati — dynamic content loader (reads /content/data.json)
(async function(){
  let d;
  try{ d = await (await fetch('content/data.json')).json(); }
  catch(e){ console.warn('data.json not loaded', e); return; }
  const L = ['az','en','ru'];
  const t = window.translations; if(!t) return;

  // meta
  document.querySelectorAll('.logo-img').forEach(img=> img.src = d.meta.logo || img.src);
  document.querySelectorAll('.contact-side .info-block:nth-child(1) .val')[0].textContent = d.meta.address;
  document.querySelectorAll('.contact-side .info-block:nth-child(3) .val')[0].textContent = d.meta.phone;
  document.querySelectorAll('.contact-side .info-block:nth-child(4) .val')[0].textContent = d.meta.email;
  L.forEach(l=> t[l].contact_hours_value = d.meta.hours[l]);

  // hero
  document.querySelectorAll('.hero-slideshow .slide').forEach((s,i)=>{
    if(d.hero.images[i]) s.style.backgroundImage = `url('${d.hero.images[i]}')`;
  });
  L.forEach(l=>{
    t[l].hero_eyebrow = d.hero.eyebrow[l];
    t[l].hero_headline = d.hero.headline[l];
    t[l].hero_sub = d.hero.sub[l];
  });

  // about
  L.forEach(l=>{
    t[l].about_headline = d.about.headline[l];
    t[l].about_p1 = d.about.p1[l];
    t[l].about_p2 = d.about.p2[l];
    t[l].about_quote = d.about.quote[l];
  });
  document.querySelectorAll('.about-stats .stat .n').forEach((el,i)=>{ el.textContent = d.about.stats[i].n; });
  d.about.stats.forEach((s,i)=> L.forEach(l=> t[l][`about_stat${i+1}_label`] = s.label[l]));

  // products
  d.products.forEach(p=> L.forEach(l=>{
    t[l][`${p.key}_name`] = p.name[l];
    t[l][`${p.key}_desc`] = p.desc[l];
  }));

  // why
  d.why.forEach((w,i)=> L.forEach(l=>{
    t[l][`why${i+1}_title`] = w.title[l];
    t[l][`why${i+1}_desc`] = w.desc[l];
  }));

  // brands
  document.querySelectorAll('.brand-cell').forEach((cell,i)=>{
    const b = d.brands[i]; if(!b) return;
    const bn = cell.querySelector('.bn');
    bn.childNodes[0].nodeValue = b.name;
    bn.querySelector('small').setAttribute('data-i18n', `${b.category}_name`);
  });

  // gallery
  document.querySelectorAll('.g-tile').forEach((tile,i)=>{
    const g = d.gallery[i]; if(!g) return;
    tile.dataset.room = g.room;
    if(g.image) tile.querySelector('.g-tex').style.backgroundImage = `url('${g.image}')`;
    tile.querySelector('.room').setAttribute('data-i18n', `filter_${g.room}`);
    L.forEach(l=> t[l][`gallery${i+1}_caption`] = g.caption[l]);
  });

  // reviews
  d.reviews.forEach((r,i)=> L.forEach(l=>{
    t[l][`review${i+1}_text`] = r.text[l];
    t[l][`review${i+1}_author`] = r.author[l];
  }));

  // footer
  L.forEach(l=> t[l].footer_tagline = d.footer.tagline[l]);

  if(typeof applyLanguage === 'function') applyLanguage(currentLang || 'az');
})();
