import './classic.css';
import { profile, projects, experience, certificates, achievements } from '../data/portfolio.js';
import { esc, sampleTag, ACH_LABEL, TYPE_LABEL, TYPE_COLOR } from './cards.js';

const ICONS = {
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.13V21h-4v-4.9c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.89 1.28-1.89 2.6V21h-4V9.75Z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.55V4.47A20.6 20.6 0 0 0 14.3 4.3c-2.24 0-3.8 1.37-3.8 3.9v2.3H8v3h2.5V21h3Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  brief: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  cube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z"/><path d="m3 7 9 5 9-5M12 12v10"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6L12 2Z"/></svg>',
};

const CAT_LABEL = { professional: 'Professional', university: 'University', personal: 'Personal build' };
const HL_ICONS = ['brief', 'trophy', 'cap', 'cube'];

const link = (href, label, cls = '') => (href ? `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener">${label}</a>` : '');

function socials() {
  const l = profile.links;
  return ['linkedin', 'github', 'facebook', 'instagram']
    .filter((k) => l[k])
    .map((k) => `<a class="soc" href="${esc(l[k])}" target="_blank" rel="noopener" aria-label="${k}">${ICONS[k]}</a>`)
    .join('');
}

function ctas() {
  const l = profile.links;
  return [
    l.email ? `<a class="cbtn cbtn-primary" href="mailto:${esc(l.email)}">${ICONS.mail}Email me</a>` : '',
    link(l.linkedin, `${ICONS.linkedin}Connect on LinkedIn`, `cbtn${l.email ? '' : ' cbtn-primary'}`),
    link(l.resume, `Download CV`, 'cbtn'),
    link(l.github, `${ICONS.github}GitHub`, 'cbtn'),
  ].join('');
}

const monogram = (s) =>
  s && s.replace(/[^A-Za-z]/g, '').length <= 6 && !s.includes(' ')
    ? s.toUpperCase()
    : (s || '?')
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => (w.length <= 4 && w === w.toUpperCase() ? w : w[0]))
    .join('')
    .slice(0, 4);

/** Recruiter-friendly 2D portfolio (also the no-WebGL fallback). */
export function renderClassic(root, { canExplore, onExplore }) {
  document.body.classList.add('classic-mode');
  const initials = profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const work = experience.filter((e) => e.type !== 'education');
  const edu = experience.filter((e) => e.type === 'education');
  const current = work[0];
  const school = edu[0];
  const featCerts = certificates.filter((c) => c.featured);
  const otherCerts = certificates.filter((c) => !c.featured);
  const topSkills = profile.skills.map((g) => g.items[0]).slice(0, 5);
  const cats = ['all', ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const hacks = achievements.filter((a) => a.kind === 'hackathon');

  const sec = (id, num, title, sub, body) => `
    <section class="cv-sec reveal" id="${id}">
      <div class="cv-sec-head"><span class="num">${num}</span><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>
      ${body}
    </section>`;

  root.innerHTML = `
  <div class="cv-bg" aria-hidden="true"><i class="b1"></i><i class="b2"></i><i class="b3"></i><div class="grid"></div></div>
  <div class="cv">
    <header class="cv-nav">
      <a class="cv-brand" href="#top"><span class="mono">${esc(initials)}</span><span>${esc(profile.nickname)}<small>.portfolio</small></span></a>
      <nav aria-label="Sections">
        <a href="#experience">Experience</a><a href="#projects">Projects</a><a href="#hackathons">Hackathons</a><a href="#certifications">Certifications</a><a href="#education">Education</a><a href="#contact">Contact</a>
      </nav>
      ${canExplore ? `<button class="cbtn cbtn-ghost" data-explore>${ICONS.cube}<span>Explore in 3D</span></button>` : ''}
    </header>

    <section class="hero" id="top">
      <div class="hero-main reveal">
        ${profile.status ? `<span class="pill"><span class="dot"></span>${esc(profile.status)}</span>` : ''}
        <h1>${esc(profile.name)} <span class="nick">(${esc(profile.nickname)})</span></h1>
        <p class="role">${esc(current ? current.role : profile.title)}${current ? ` <span>at</span> ${esc(current.org)}` : ''}</p>
        <p class="lead">${esc(profile.tagline)}</p>
        <div class="meta">
          <span>${ICONS.pin}${esc(profile.location)}</span>
          ${school ? `<span>${ICONS.cap}${esc(school.org.split(' · ')[0])} · Class of ${esc(school.end)}</span>` : ''}
          <span>${ICONS.globe}Open to Singapore roles</span>
        </div>
        <div class="ctas">${ctas()}</div>
        <div class="socials">${socials()}</div>
      </div>
      <aside class="idcard reveal">
        <div class="avatar"><span>${esc(initials)}</span></div>
        <div class="id-name">${esc(profile.nickname)}</div>
        <div class="id-title">${esc(profile.title.split(' · ')[0])}</div>
        <ul class="id-list">
          ${current ? `<li>${ICONS.brief}<div><b>${esc(current.org)}</b><small>${esc(current.start)} – ${esc(current.end)}</small></div></li>` : ''}
          ${school ? `<li>${ICONS.cap}<div><b>${esc(school.org.split(' · ')[0])}</b><small>${esc(school.role)}</small></div></li>` : ''}
          ${hacks.length ? `<li>${ICONS.trophy}<div><b>${hacks.length} hackathons</b><small>${esc(hacks.map((a) => a.title).slice(0, 2).join(', '))}</small></div></li>` : ''}
        </ul>
        <div class="id-skills">${topSkills.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
      </aside>
    </section>

    ${profile.keyFacts?.length ? `<section class="stats reveal">${profile.keyFacts.map((f) => `<div class="stat"><b>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`).join('')}</section>` : ''}

    ${profile.highlights?.length ? sec('highlights', '★', 'Career highlights', 'The biggest things so far.', `
      <div class="bento">${profile.highlights.map((h, i) => `<div class="bento-card"><span class="ic">${ICONS[HL_ICONS[i % HL_ICONS.length]]}</span><p>${esc(h)}</p></div>`).join('')}</div>`) : ''}

    ${sec('about', '01', 'About', '', `
      <div class="about-grid">
        <div class="glass prose">${profile.about.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        ${profile.testimonial?.quote ? `<figure class="glass quote-card"><span class="qmark">“</span><blockquote>${esc(profile.testimonial.quote)}</blockquote><figcaption><b>${esc(profile.testimonial.author)}</b><span>${esc(profile.testimonial.role)}${profile.testimonial.date ? ' · ' + esc(profile.testimonial.date) : ''}</span></figcaption></figure>` : ''}
      </div>`)}

    ${sec('experience', '02', 'Experience', 'Work and leadership roles.', `
      <div class="xp">${work.map((e) => `
        <article class="xp-item glass" style="--c:${TYPE_COLOR[e.type] || '#7cf5ff'}">
          <div class="xp-when"><b>${esc(e.start)}</b><span>${esc(e.end)}</span><em>${esc(TYPE_LABEL[e.type] || '')}</em></div>
          <div class="xp-body">
            <h3>${esc(e.role)}${sampleTag(e)}</h3>
            <div class="xp-org">${esc(e.org)}${e.location ? `<span>${esc(e.location)}</span>` : ''}</div>
            ${e.summary ? `<p>${esc(e.summary)}</p>` : ''}
            ${e.points?.length ? `<ul>${e.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
          </div>
        </article>`).join('')}
      </div>`)}

    ${sec('projects', '03', 'Projects', `${projects.length} things I've led, designed or built.`, `
      <div class="filters" role="tablist">${cats.map((c, i) => `<button role="tab" class="${i === 0 ? 'on' : ''}" data-cat="${c}">${c === 'all' ? 'All' : CAT_LABEL[c] || c}</button>`).join('')}</div>
      <div class="pgrid">${projects.map((p) => `
        <article class="pcard glass${p.featured ? ' feat' : ''}" data-cat="${esc(p.category || '')}" style="--c:${esc(p.color)}">
          <div class="pcard-top"><span class="tag">${esc(CAT_LABEL[p.category] || 'Project')}</span>${p.featured ? `<span class="tag tag-star">${ICONS.star}Featured</span>` : ''}<span class="yr">${esc(p.year || '')}</span></div>
          <h3>${esc(p.title)}${sampleTag(p)}</h3>
          <p class="tl">${esc(p.tagline)}</p>
          <p>${esc(p.description)}</p>
          ${p.featured && p.highlights?.length ? `<ul>${p.highlights.slice(0, 3).map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
          <div class="chips">${(p.tech || []).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
          <div class="plinks">${link(p.links?.demo, `Live demo ${ICONS.arrow}`)}${link(p.links?.code, `Code ${ICONS.arrow}`)}</div>
        </article>`).join('')}
      </div>`)}

    ${achievements?.length ? sec('hackathons', '04', 'Hackathons & achievements', 'Competitions, events and recognition.', `
      <div class="agrid">${achievements.map((a) => `
        <article class="acard glass${a.featured ? ' feat' : ''}" style="--c:${esc(a.color)}">
          <div class="a-top"><span class="a-kind">${ICONS[a.kind === 'hackathon' || a.kind === 'award' ? 'trophy' : 'star']}${esc(ACH_LABEL[a.kind] || '')}</span><span class="yr">${esc(a.date)}</span></div>
          <h3>${esc(a.title)}${sampleTag(a)}</h3>
          <div class="a-ev">${esc(a.event)}</div>
          ${a.role || a.result ? `<div class="a-role">${esc([a.role, a.result].filter(Boolean).join(' · '))}</div>` : ''}
          ${a.description ? `<p>${esc(a.description)}</p>` : ''}
          ${link(a.link, `See more ${ICONS.arrow}`, 'a-link')}
        </article>`).join('')}
      </div>`) : ''}

    ${sec('certifications', '05', 'Licenses & certifications', `${certificates.length} credentials.`, `
      <div class="cfeat">${featCerts.map((c) => `
        <article class="ccard glass" style="--c:${esc(c.color)}">
          <span class="cmono${monogram(c.issuerShort || c.issuer).length > 3 ? ' sm' : ''}">${esc(monogram(c.issuerShort || c.issuer))}</span>
          <div><h3>${esc(c.name)}${sampleTag(c)}</h3><div class="cmeta">${esc(c.issuer)}${c.date ? ' · ' + esc(c.date) : ''}</div>
          ${link(c.url, `Verify ${ICONS.arrow}`, 'cverify')}</div>
        </article>`).join('')}
      </div>
      <div class="clist glass">${otherCerts.map((c) => `
        <div class="crow" style="--c:${esc(c.color)}"><span class="cdot"></span><div class="cname"><b>${esc(c.name)}</b><span>${esc(c.issuer)}</span></div><span class="cdate">${esc(c.date)}</span>${c.url ? link(c.url, `Verify ${ICONS.arrow}`, 'cverify') : '<span class="cverify off"></span>'}</div>`).join('')}
      </div>`)}

    ${sec('education', '06', 'Education', '', `
      <div class="edu">${edu.map((e) => `
        <div class="edu-row glass">
          <div class="edu-when">${esc(e.start)} – ${esc(e.end)}</div>
          <div><h3>${esc(e.role)}${sampleTag(e)}</h3><div class="edu-org">${esc(e.org)}</div>${e.summary ? `<p>${esc(e.summary)}</p>` : ''}</div>
        </div>`).join('')}
      </div>`)}

    ${sec('skills', '07', 'Skills', '', `
      <div class="sgrid">${profile.skills.map((g) => `<div class="glass sk"><h3>${esc(g.group)}</h3><div class="chips">${g.items.map((i) => `<span>${esc(i)}</span>`).join('')}</div></div>`).join('')}</div>`)}

    <section class="contact reveal" id="contact">
      <h2>Let's work together.</h2>
      <p>Open to ERP, IT support, UI/UX and junior engineering roles in Singapore, plus hackathon teams and collaborations.</p>
      <div class="ctas">${ctas()}</div>
      ${profile.links.email ? `<p class="mailline">Business inquiries: <a href="mailto:${esc(profile.links.email)}">${esc(profile.links.email)}</a></p>` : ''}
      <div class="socials">${socials()}</div>
    </section>

    <footer class="cv-foot"><span>© ${new Date().getFullYear()} ${esc(profile.name)}</span>${canExplore ? '<button data-explore class="linkish">Prefer a game? Explore the 3D island →</button>' : '<span>Built with Three.js & Vite</span>'}</footer>
  </div>`;

  root.querySelectorAll('[data-explore]').forEach((b) => b.addEventListener('click', onExplore));

  // project filters
  const fbtns = root.querySelectorAll('.filters button');
  fbtns.forEach((b) =>
    b.addEventListener('click', () => {
      fbtns.forEach((x) => x.classList.toggle('on', x === b));
      const cat = b.dataset.cat;
      root.querySelectorAll('.pcard').forEach((c) => (c.hidden = cat !== 'all' && c.dataset.cat !== cat));
    }),
  );

  // scroll reveal + active nav
  const els = root.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && (en.target.classList.add('in'), io.unobserve(en.target))),
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((e) => io.observe(e));
    const links = [...root.querySelectorAll('.cv-nav nav a')];
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) links.forEach((l) => l.classList.toggle('on', l.getAttribute('href') === '#' + en.target.id));
        }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    root.querySelectorAll('section[id]').forEach((s) => spy.observe(s));
  } else els.forEach((e) => e.classList.add('in'));
}
