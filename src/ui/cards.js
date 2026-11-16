import { profile, projects, experience, certificates } from '../data/portfolio.js';

export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const sampleTag = (item) => (item.placeholder ? '<span class="sample" title="Sample content: edit src/data/portfolio.js">sample</span>' : '');

const ext = (href, label, primary = false) =>
  href ? `<a class="btn${primary ? ' btn-primary' : ''}" href="${esc(href)}" target="_blank" rel="noopener">${label}</a>` : '';

export const KIND_LABEL = { certificate: 'Certificate', license: 'License', award: 'Award' };
export const TYPE_LABEL = { work: 'Experience', education: 'Education', volunteer: 'Volunteering' };
export const TYPE_COLOR = { work: '#ffb547', education: '#7cf5ff', volunteer: '#3ddc84' };

/** Each section: list of items + a renderer that returns { color, html }. */
export const sections = {
  project: {
    list: projects,
    render: (p) => ({
      color: p.color,
      html: `
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
  about: {
    list: [profile],
    render: () => ({
      color: '#7cf5ff',
      html: `
        <div class="eyebrow">About · ${esc(profile.location)}</div>
        <h2>${esc(profile.name)} <span style="color:var(--muted);font-weight:400">(${esc(profile.nickname)})</span></h2>
        <p class="sub">${esc(profile.title)}</p>
        ${profile.about.map((p) => `<p>${esc(p)}</p>`).join('')}
        <div class="skills-grid">${profile.skills
          .map((g) => `<div><h4>${esc(g.group)}</h4><div class="chips" style="margin:0">${g.items.map((i) => `<span class="chip">${esc(i)}</span>`).join('')}</div></div>`)
          .join('')}</div>
        <div class="card-actions">${contactButtons()}</div>`,
    }),
  },
};

export function contactButtons() {
  const l = profile.links;
  return [
    l.email ? `<a class="btn btn-primary" href="mailto:${esc(l.email)}">Email me</a>` : '',
    ext(l.linkedin, 'LinkedIn ↗', !l.email),
    ext(l.github, 'GitHub ↗'),
    ext(l.resume, 'Résumé ↗'),
  ].join('');
}
