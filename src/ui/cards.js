import { profile, projects, experience, certificates, achievements } from '../data/portfolio.js';

export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const sampleTag = (item) => (item.placeholder ? '<span class="sample" title="Sample content: edit src/data/portfolio.js">sample</span>' : '');

const ext = (href, label, primary = false) =>
  href ? `<a class="btn${primary ? ' btn-primary' : ''}" href="${esc(href)}" target="_blank" rel="noopener">${label}</a>` : '';

/** Resolve an image path from portfolio.js ('media/x.jpg' -> served from /public). */
export const mediaUrl = (src) => (!src ? '' : /^(https?:|data:|\/)/.test(src) ? src : import.meta.env.BASE_URL + src);

/** An <img> that quietly removes its wrapper if the file is missing. */
export const shot = (src, alt, cls = 'card-shot') =>
  src ? `<div class="${cls}"><img src="${esc(mediaUrl(src))}" alt="${esc(alt)}" loading="lazy" decoding="async" onerror="this.parentNode.remove()"></div>` : '';

/** Round avatar: photo if set, initials otherwise (and if the photo fails to load). */
export const avatarHtml = (initials) =>
  profile.photo
    ? `<img src="${esc(mediaUrl(profile.photo))}" alt="${esc(profile.name)}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${esc(initials)}'}))">`
    : `<span>${esc(initials)}</span>`;

export const KIND_LABEL = { certificate: 'Certificate', license: 'License', award: 'Award' };
export const ACH_LABEL = { hackathon: 'Hackathon', event: 'Event', award: 'Award', leadership: 'Leadership' };
export const TYPE_LABEL = { work: 'Experience', education: 'Education', volunteer: 'Volunteering' };
export const TYPE_COLOR = { work: '#ffb547', education: '#7cf5ff', volunteer: '#3ddc84' };

/** Each section: list of items + a renderer that returns { color, html }. */
export const sections = {
  project: {
    list: projects,
    render: (p) => ({
      color: p.color,
      html: `
        ${shot(p.image, p.title)}
        <div class="eyebrow">Project${p.year ? ' · ' + esc(p.year) : ''}</div>
        <h2>${esc(p.title)}${sampleTag(p)}</h2>
        <p class="sub">${esc(p.tagline)}</p>
        <p>${esc(p.description)}</p>
        ${p.highlights?.length ? `<ul>${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
        <div class="chips">${(p.tech || []).map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
        <div class="card-actions">${ext(p.links?.demo, 'Live demo ↗', true)}${ext(p.links?.code, 'View code ↗', !p.links?.demo)}</div>`,
    }),
  },
  experience: {
    list: experience,
    render: (e) => ({
      color: TYPE_COLOR[e.type] || '#7cf5ff',
      html: `
        <div class="eyebrow">${esc(TYPE_LABEL[e.type] || 'Experience')} · ${esc(e.start)} – ${esc(e.end)}</div>
        <h2>${esc(e.role)}${sampleTag(e)}</h2>
        <p class="sub">${esc(e.org)}${e.location ? ' · ' + esc(e.location) : ''}</p>
        ${e.summary ? `<p>${esc(e.summary)}</p>` : ''}
        ${e.points?.length ? `<ul>${e.points.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}`,
    }),
  },
  certificate: {
    list: certificates,
    render: (c) => ({
      color: c.color,
      html: `
        <div class="eyebrow">${esc(KIND_LABEL[c.kind] || 'Certificate')}${c.date ? ' · ' + esc(c.date) : ''}</div>
        <h2>${esc(c.name)}${sampleTag(c)}</h2>
        <p class="sub">Issued by ${esc(c.issuer)}</p>
        ${c.credentialId ? `<p>${esc(c.credentialId)}</p>` : ''}
        <div class="card-actions">${ext(c.url, 'Show credential ↗', true)}</div>`,
    }),
  },
  achievement: {
    list: achievements,
    render: (a) => ({
      color: a.color,
      html: `
        ${shot(a.image, a.title)}
        <div class="eyebrow">${esc(ACH_LABEL[a.kind] || 'Achievement')}${a.date ? ' · ' + esc(a.date) : ''}</div>
        <h2>${esc(a.title)}${sampleTag(a)}</h2>
        <p class="sub">${esc(a.event)}${a.role ? ' · ' + esc(a.role) : ''}</p>
        ${a.result ? `<div class="chips"><span class="chip" style="border-color:${esc(a.color)}">🏅 ${esc(a.result)}</span></div>` : ''}
        ${a.description ? `<p>${esc(a.description)}</p>` : ''}
        ${a.points?.length ? `<ul>${a.points.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
        <div class="card-actions">${ext(a.link, 'See more ↗', true)}</div>`,
    }),
  },
  // "See everything" lists opened by the kiosks in the 3D world
  more: {
    list: [
      { section: 'project', title: 'All projects', sub: (p) => p.tagline, name: (p) => p.title, items: projects, color: '#ff6b9d' },
      { section: 'achievement', title: 'All hackathons & events', sub: (a) => `${a.event} · ${a.date}`, name: (a) => a.title, items: achievements, color: '#3ddc84' },
      { section: 'certificate', title: 'All certifications', sub: (c) => `${c.issuer}${c.date ? ' · ' + c.date : ''}`, name: (c) => c.name, items: certificates, color: '#ffb547' },
      { section: 'experience', title: 'Experience & education', sub: (e) => `${e.org} · ${e.start} – ${e.end}`, name: (e) => e.role, items: experience, color: '#7cf5ff' },
    ],
    render: (m) => ({
      color: m.color,
      html: `
        <div class="eyebrow">See everything</div>
        <h2>${esc(m.title)}</h2>
        <p class="sub">${m.items.length} items · ★ marks the highlights you can see on the island</p>
        <div class="more-list">${m.items
          .map((it, i) => `<button class="more-row" data-open="${m.section}:${i}" style="--c:${esc(it.color || m.color)}"><span class="dot"></span><span><b>${it.featured ? '★ ' : ''}${esc(m.name(it))}</b><small>${esc(m.sub(it) || '')}</small></span><span class="go">›</span></button>`)
          .join('')}</div>`,
    }),
  },
  about: {
    list: [profile],
    render: () => ({
      color: '#7cf5ff',
      html: `
        ${profile.photo ? `<div class="about-photo">${avatarHtml('')}</div>` : ''}
        <div class="eyebrow">About · ${esc(profile.location)}</div>
        <h2>${esc(profile.name)} <span style="color:var(--muted);font-weight:400">(${esc(profile.nickname)})</span></h2>
        <p class="sub">${esc(profile.title)}</p>
        ${profile.about.map((p) => `<p>${esc(p)}</p>`).join('')}
        <div class="skills-grid">${profile.skills
          .map((g) => `<div><h4>${esc(g.group)}</h4><div class="chips" style="margin:0">${g.items.map((i) => `<span class="chip">${esc(i)}</span>`).join('')}</div></div>`)
          .join('')}</div>
        ${highlightsHtml()}
        ${testimonialHtml()}
        <div class="card-actions">${contactButtons()}</div>`,
    }),
  },
};

export function highlightsHtml() {
  if (!profile.highlights?.length) return '';
  return `<h4 class="mini-h">Highlights</h4><ul class="hl">${profile.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>`;
}

export function testimonialHtml() {
  const t = profile.testimonial;
  if (!t?.quote) return '';
  return `<blockquote class="quote"><p>“${esc(t.quote)}”</p><footer>${esc(t.author)}${t.role ? ' · ' + esc(t.role) : ''}${t.date ? ' · ' + esc(t.date) : ''}</footer></blockquote>`;
}

export function contactButtons() {
  const l = profile.links;
  return [
    l.email ? `<a class="btn btn-primary" href="mailto:${esc(l.email)}">Email me</a>` : '',
    ext(l.linkedin, 'LinkedIn ↗', !l.email),
    ext(l.github, 'GitHub ↗'),
    ext(l.resume, 'Résumé ↗'),
  ].join('');
}
