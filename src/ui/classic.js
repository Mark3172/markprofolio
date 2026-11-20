import './classic.css';
import { profile, projects, experience, certificates, achievements } from '../data/portfolio.js';
import { esc, sampleTag, shot, avatarHtml, imgAttrs, ACH_LABEL, TYPE_LABEL, TYPE_COLOR, sortedNews, newsListHtml, newsDate, isFresh, SOURCE_LABEL } from './cards.js';
import { createModal } from './modal.js';
import { enhance, projectsFor } from './interactive.js';

const ICONS = {
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.13V21h-4v-4.9c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.89 1.28-1.89 2.6V21h-4V9.75Z"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"/></svg>',
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

const ACH_TABS = [
  { id: 'all', label: 'All' },
  { id: 'hackathon', label: 'Hackathons' },
  { id: 'event', label: 'Events' },
  { id: 'recognition', label: 'Recognition' },
];
const achGroup = (a) => (a.kind === 'hackathon' ? 'hackathon' : a.kind === 'event' ? 'event' : 'recognition');
const CAT_LABEL = { professional: 'Professional', hackathon: 'Hackathon', university: 'University', personal: 'Personal build' };
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
    l.resume ? `<a class="cbtn" href="${esc(l.resume)}" download>${ICONS.doc}Download CV</a>` : '',
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
  // Light theme by default (easier to read for most visitors); the choice is remembered.
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch {}
  const isLight = () => document.body.classList.contains('light');
  document.body.classList.toggle('light', saved !== 'dark');
  const initials = profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const work = experience.filter((e) => e.type !== 'education');
  const edu = experience.filter((e) => e.type === 'education');
  const current = work[0];
  const school = edu[0];
  const featCerts = certificates.filter((c) => c.featured);
  const otherCerts = certificates.filter((c) => !c.featured);
  const topSkills = profile.skills.map((g) => g.items[0]).slice(0, 5);
  // skills used in a project become buttons that filter the project list
  const skillChip = (s) => {
    const n = projectsFor(s, projects).length;
    return n ? `<button type="button" class="skill-btn" data-skill="${esc(s)}" title="See ${n} project${n === 1 ? '' : 's'} using ${esc(s)}">${esc(s)}<em>${n}</em></button>` : `<span>${esc(s)}</span>`;
  };
  const cats = ['all', ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const hacks = achievements.filter((a) => a.kind === 'hackathon');

  const eduRow = (e) => `
        <div class="edu-row glass">
          <div class="edu-when">${esc(e.start === e.end ? e.start : `${e.start} – ${e.end}`)}</div>
          <div><h3>${esc(e.role)}${sampleTag(e)}</h3><div class="edu-org">${esc(e.org)}</div>${e.summary ? `<p>${esc(e.summary)}</p>` : ''}</div>
        </div>`;
  const sec = (id, num, title, sub, body) => `
    <section class="cv-sec reveal" id="${id}">
      <div class="cv-sec-head"><span class="num">${num}</span><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>
      ${body}
    </section>`;

  const allNews = sortedNews();
  const latest = allNews[0];
  let dismissed = '';
  try {
    dismissed = localStorage.getItem('news-dismissed') || '';
  } catch {
    /* storage blocked: banner just shows */
  }
  const showBanner = latest && isFresh(latest.date) && dismissed !== latest.date + latest.title;

  root.innerHTML = `
  <div class="cv-bg" aria-hidden="true"><i class="b1"></i><i class="b2"></i><i class="b3"></i><div class="grid"></div></div>
  <a class="skip" href="#projects">Skip to content</a>
  ${showBanner ? `<div class="announce" role="status"><span class="announce-tag">New</span><a href="#news" class="announce-text"><b>${esc(latest.title)}</b><span> · ${esc(SOURCE_LABEL[latest.source] || 'Update')}, ${esc(newsDate(latest.date))}</span></a><button class="announce-x" aria-label="Dismiss announcement">✕</button></div>` : ''}
  <div class="cv">
    <header class="cv-nav">
      <a class="cv-brand" href="#top"><img class="mono" src="logo.svg" alt="" width="36" height="36"><span>${esc(profile.nickname)}<small>.portfolio</small></span></a>
      <nav aria-label="Sections">
        <span class="nav-ind" aria-hidden="true"></span><a href="#projects">Projects</a><a href="#hackathons">Hackathons</a><a href="#experience">Experience</a><a href="#certifications">Certifications</a><a href="#education">Education</a>${allNews.length ? '<a href="#news">News</a>' : ''}<a href="#contact">Contact</a>
      </nav>
      ${profile.links.resume ? `<a class="cbtn cbtn-ghost nav-cv" href="${esc(profile.links.resume)}" download aria-label="Download CV (PDF)">${ICONS.doc}<span>CV</span></a>` : ''}
      <button class="theme-btn" type="button" data-theme-toggle aria-label="Switch to dark theme" title="Switch theme"><svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg><svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
      ${canExplore ? `<button class="cbtn cbtn-ghost cbtn-game" data-explore aria-label="Play game mode">${ICONS.cube}<span>Play game mode</span></button>` : ''}
    </header>

    <section class="hero" id="top">
      <div class="hero-main">
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
        ${canExplore ? `<button class="game-cta" data-explore><span class="game-ic">${ICONS.cube}</span><span class="game-txt"><b>Explore this portfolio as a 3D game</b><small>Walk my island, finish quests and race the Island Dash.</small></span><span class="game-go">Play ▶</span></button>` : ''}
      </div>
      <aside class="portrait" aria-label="Profile">
        <figure class="pt-frame">
          ${profile.photo
            ? `<img class="pt-photo" ${imgAttrs(profile.photo, '(max-width: 960px) 80vw, 400px')} alt="${esc(profile.name)}" width="800" height="800" fetchpriority="high" onerror="this.parentNode.classList.add('pt-fallback')">`
            : ''}
          <div class="pt-flat avatar">${avatarHtml(initials)}</div>
          <figcaption class="pt-open"><i></i>Open to work</figcaption>
        </figure>
        <div class="id-actions">
          ${profile.links.email ? `<button class="id-act" data-copy="${esc(profile.links.email)}" title="Copy my email">${ICONS.mail}<span>Copy email</span><i class="ok">Copied ✓</i></button>` : ''}
          <div class="id-act id-clock" data-clock="Asia/Yangon" title="My local time in Yangon">${ICONS.globe}<span><b>–</b><small>Yangon time</small></span></div>
        </div>
      </aside>
    </section>

    ${profile.keyFacts?.length ? `<section class="stats reveal">${profile.keyFacts.map((f) => { const m = /^(\d+)(.*)$/.exec(f.value); return `<div class="stat"><b${m ? ` data-count="${m[1]}" data-suffix="${esc(m[2])}"` : ''}>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`; }).join('')}</section>` : ''}

    ${profile.whyHire?.length ? sec('hire', '★', 'Why hire me', 'The short version, with proof one click away.', `
      <div class="why">${profile.whyHire.map((w, i) => `
        <a class="why-card bento-card" href="#${esc(w.go)}" style="--d:${i * 80}ms"><span class="ic">${ICONS[HL_ICONS[i % HL_ICONS.length]]}</span><b>${esc(w.title)}</b><p>${esc(w.text)}</p><span class="why-go">See proof ${ICONS.arrow}</span></a>`).join('')}
      </div>
      <div class="hire-row">
        ${profile.atAGlance?.length ? `<div class="glance glass"><h3>At a glance</h3><dl>${profile.atAGlance.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>
          <div class="glance-cta">${profile.links.email ? `<a class="cbtn cbtn-primary" href="mailto:${esc(profile.links.email)}?subject=${encodeURIComponent('Opportunity for Mark')}">${ICONS.mail}Email me</a><button class="cbtn" data-copy="${esc(profile.links.email)}">Copy email<i class="ok">Copied ✓</i></button>` : ''}${link(profile.links.linkedin, `${ICONS.linkedin}LinkedIn`, 'cbtn')}</div></div>` : ''}
        ${profile.testimonial?.quote ? `<figure class="glass quote-card"><span class="qmark">“</span><blockquote>${esc(profile.testimonial.quote)}</blockquote><figcaption><b>${esc(profile.testimonial.author)}</b><span>${esc(profile.testimonial.role)}${profile.testimonial.date ? ' · ' + esc(profile.testimonial.date) : ''}</span></figcaption></figure>` : ''}
      </div>
      ${profile.milestones?.length ? `<div class="growth glass"><h3>My growth so far</h3><ol>${profile.milestones.map((m) => `<li><a href="#${esc(m.go)}"><time>${esc(m.year)}</time><b>${esc(m.title)}</b><small>${esc(m.text)}</small></a></li>`).join('')}</ol></div>` : ''}`) : ''}

    ${sec('projects', '01', 'Projects', `${projects.length} things I've led, designed or built.`, `
      <div class="tabs" role="tablist" data-tabs="spot-row"><span class="tab-ind" aria-hidden="true"></span>${cats.map((c, i) => `<button role="tab" aria-selected="${i === 0}" class="${i === 0 ? 'on' : ''}" data-cat="${c}">${c === 'all' ? 'All' : CAT_LABEL[c] || c}<em>${c === 'all' ? projects.length : projects.filter((p) => p.category === c).length}</em></button>`).join('')}</div>
      <div class="skill-filter" hidden role="status"><span>Projects using <b></b> · <em></em></span><button type="button" aria-label="Show all projects">Show all ✕</button></div>
      <div class="spot" data-spot>
        <ol class="spot-list">${projects.map((p, i) => `
          <li class="spot-row${i === 0 ? ' on' : ''}" data-cat="${esc(p.category || '')}" style="--c:${esc(p.color)}">
            <button class="spot-btn" data-i="${i}" aria-expanded="${i === 0}">
              <span class="spot-n">${String(i + 1).padStart(2, '0')}</span>
              <span class="spot-t"><b>${esc(p.title)}${p.featured ? ` <i class="spot-star" title="Featured">${ICONS.star}</i>` : ''}</b><small>${esc(p.tagline)}</small></span>
              <span class="spot-tag">${esc(CAT_LABEL[p.category] || 'Project')}</span>
              <span class="spot-arrow">${ICONS.arrow}</span>
            </button>
            <div class="spot-inline"></div>
          </li>`).join('')}
        </ol>
        <div class="spot-view glass" aria-live="polite"></div>
      </div>`)}

    ${achievements?.length ? sec('hackathons', '02', 'Hackathons & achievements', 'Competitions, events and recognition.', `
      <div class="tabs" role="tablist" data-tabs="ach-item"><span class="tab-ind" aria-hidden="true"></span>${ACH_TABS.filter((t) => t.id === 'all' || achievements.some((a) => achGroup(a) === t.id)).map((t, i) => `<button role="tab" aria-selected="${i === 0}" class="${i === 0 ? 'on' : ''}" data-cat="${t.id}">${t.label}<em>${t.id === 'all' ? achievements.length : achievements.filter((a) => achGroup(a) === t.id).length}</em></button>`).join('')}</div>
      <div class="hbento">${achievements.map((a, i) => ({ a, i })).filter((x) => x.a.featured).map(({ a, i }) => `
        <button class="htile ach-item" data-cat="${achGroup(a)}" data-open="achievement:${i}" style="--c:${esc(a.color)}">
          ${a.image ? `<img ${imgAttrs(a.image, '(max-width: 860px) 100vw, 640px')} alt="" loading="lazy" decoding="async" onerror="this.remove()">` : ''}
          <span class="htile-shade"></span>
          <span class="htile-body">
            <span class="htile-kind">${ICONS.trophy}${esc(ACH_LABEL[a.kind] || '')} · ${esc(a.date)}</span>
            <b>${esc(a.title)}</b>
            <small>${esc([a.result, a.role].filter(Boolean).join(' · ') || a.event)}</small>
          </span>
        </button>`).join('')}
      </div>
      <div class="hlist glass">${achievements.map((a, i) => ({ a, i })).filter((x) => !x.a.featured).map(({ a, i }) => `
        <button class="hrow ach-item" data-cat="${achGroup(a)}" data-open="achievement:${i}" style="--c:${esc(a.color)}">
          <span class="hrow-date">${esc(a.date)}</span>
          <span class="hrow-t"><b>${esc(a.title)}</b><small>${esc(a.event)}${a.role ? ' · ' + esc(a.role) : ''}</small></span>
          <span class="hrow-kind">${esc(ACH_LABEL[a.kind] || '')}</span>
          <span class="spot-arrow">${ICONS.arrow}</span>
        </button>`).join('')}
      </div>`) : ''}

    ${sec('experience', '03', 'Experience', 'Work and leadership roles.', `
      <div class="xp"><span class="xp-line" aria-hidden="true"><i></i></span>${work.map((e) => `
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

    ${sec('certifications', '04', 'Licenses & certifications', `${certificates.length} credentials.`, `
      <div class="cfeat">${featCerts.map((c) => `
        <article class="ccard glass${c.image ? ' has-img' : ''}" style="--c:${esc(c.color)}">
          ${c.image ? `<button type="button" class="cthumb" data-open="certificate:${certificates.indexOf(c)}" aria-label="View the ${esc(c.name)} certificate"><img ${imgAttrs(c.image, '(max-width: 640px) 90vw, 520px')} alt="" loading="lazy" decoding="async" width="1200" height="928" onerror="this.closest('.cthumb').remove()"></button>` : ''}
          <span class="cmono${monogram(c.issuerShort || c.issuer).length > 3 ? ' sm' : ''}">${esc(monogram(c.issuerShort || c.issuer))}</span>
          <div><h3>${esc(c.name)}${sampleTag(c)}</h3><div class="cmeta">${esc(c.issuer)}${c.date ? ' · ' + esc(c.date) : ''}</div>
          ${link(c.url, `Verify ${ICONS.arrow}`, 'cverify')}</div>
        </article>`).join('')}
      </div>
      <details class="cmore"><summary>Show ${otherCerts.length} more credentials</summary>
      <div class="clist glass">${otherCerts.map((c) => `
        <div class="crow" style="--c:${esc(c.color)}">${c.image ? `<button type="button" class="cthumb cthumb-sm" data-open="certificate:${certificates.indexOf(c)}" aria-label="View the ${esc(c.name)} certificate"><img ${imgAttrs(c.image, '96px')} alt="" loading="lazy" decoding="async" width="1200" height="928"></button>` : '<span class="cdot"></span>'}<div class="cname"><b>${esc(c.name)}</b><span>${esc(c.issuer)}</span></div><span class="cdate">${esc(c.date)}</span>${c.url ? link(c.url, `Verify ${ICONS.arrow}`, 'cverify') : '<span class="cverify off"></span>'}</div>`).join('')}
      </div></details>`)}

    ${sec('education', '05', 'Education', '', `
      <div class="edu">${edu.slice(0, 3).map(eduRow).join('')}</div>
      ${edu.length > 3 ? `<details class="cmore edu-more"><summary>Show ${edu.length - 3} earlier</summary><div class="edu">${edu.slice(3).map(eduRow).join('')}</div></details>` : ''}`)}

    ${sec('skills', '06', 'Skills', 'Tap a highlighted skill to see the projects where I used it.', `
      <div class="sgrid">${profile.skills.map((g) => `<div class="glass sk"><h3>${esc(g.group)}</h3><div class="chips">${g.items.map(skillChip).join('')}</div></div>`).join('')}</div>`)}

    ${sec('about', '07', 'About', '', `
      <div class="about-grid">
        <div class="glass prose">${profile.about.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      </div>`)}

    ${allNews.length ? sec('news', '●', 'Latest news', 'What I have been posting about lately.', `
      <div class="news-wrap">
        <div class="news-list">${newsListHtml(allNews, 3)}</div>
        <div class="news-follow glass">
          <b>Follow along</b>
          <p>I post about hackathons, ERP projects and what I'm building.</p>
          <div class="news-links">
            <a href="${esc(profile.links.linkedin)}" target="_blank" rel="noopener">${ICONS.linkedin}LinkedIn</a>
            ${profile.links.instagram ? `<a href="${esc(profile.links.instagram)}" target="_blank" rel="noopener">${ICONS.instagram || ''}Instagram</a>` : ''}
            ${profile.links.facebook ? `<a href="${esc(profile.links.facebook)}" target="_blank" rel="noopener">${ICONS.facebook || ''}Facebook</a>` : ''}
          </div>
          ${allNews.length > 3 ? `<button class="news-all" data-news-all>See all ${allNews.length} updates</button>` : ''}
        </div>
      </div>`) : ''}

    <section class="contact reveal" id="contact">
      <h2>Let's work together.</h2>
      <p>Open to ERP, IT support, UI/UX and junior engineering roles in Singapore, plus hackathon teams and collaborations.</p>
      <div class="ctas">${ctas()}</div>
      ${profile.services?.length ? `<div class="services"><span>I can help with</span>${profile.services.map((s) => `<em>${esc(s)}</em>`).join('')}</div>` : ''}
      ${profile.links.email ? `<p class="mailline">Business inquiries: <a href="mailto:${esc(profile.links.email)}">${esc(profile.links.email)}</a></p>` : ''}
      <div class="socials">${socials()}</div>
    </section>

    <nav class="mtabs" aria-label="Sections">
      <a href="#top" class="on">${ICONS.star}<span>Top</span></a>
      <a href="#projects">${ICONS.cube}<span>Projects</span></a>
      <a href="#hackathons">${ICONS.trophy}<span>Hacks</span></a>
      <a href="#experience">${ICONS.brief}<span>Work</span></a>
      <a href="#certifications">${ICONS.cap}<span>Certs</span></a>
      <a href="#contact">${ICONS.mail}<span>Contact</span></a>
    </nav>

    <footer class="cv-foot"><span>© ${new Date().getFullYear()} ${esc(profile.name)}</span>${canExplore ? '<button data-explore class="linkish">Prefer a game? Explore the 3D island →</button>' : '<span>Built with Three.js & Vite</span>'}</footer>
  </div>`;

  // floating game-mode button: appears once the hero's own button has scrolled away
  if (canExplore) {
    const fab = document.createElement('button');
    fab.className = 'fab-game';
    fab.dataset.explore = '';
    fab.innerHTML = `${ICONS.cube}<span>Game mode</span>`;
    root.appendChild(fab);
    const heroCta = root.querySelector('.game-cta');
    new IntersectionObserver(([e]) => fab.classList.toggle('on', !e.isIntersecting)).observe(heroCta);
  }
  root.querySelectorAll('[data-explore]').forEach((b) => b.addEventListener('click', onExplore));
  // Warm up the game while the visitor is still deciding: on hover/focus/touch of any
  // game button (and once the page is idle on fast connections) fetch the 3D code, so the
  // loading screen mostly has nothing left to download.
  if (canExplore) {
    let warmed = false;
    const warm = () => {
      if (warmed) return;
      warmed = true;
      import('../world/World.js').catch(() => {});
      import('./hud.js').catch(() => {});
    };
    root.querySelectorAll('[data-explore]').forEach((b) => ['pointerenter', 'focus', 'touchstart'].forEach((ev) => b.addEventListener(ev, warm, { once: true, passive: true })));
    const c = navigator.connection;
    if (!(c && (c.saveData || /(^|-)2g|3g/.test(c.effectiveType || '')))) {
      const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(warm, { timeout: 6000 }) : setTimeout(warm, 4000));
      addEventListener('load', () => setTimeout(idle, 2500), { once: true });
    }
  }

  // tabs with a sliding indicator (project categories, hackathon kinds)
  const placeInd = (bar) => {
    const on = bar.querySelector('button.on');
    const ind = bar.querySelector('.tab-ind');
    if (!on || !ind) return;
    ind.style.width = on.offsetWidth + 'px';
    ind.style.transform = `translateX(${on.offsetLeft}px)`;
  };
  root.querySelectorAll('[data-tabs]').forEach((bar) => {
    const cls = bar.dataset.tabs;
    const btns = bar.querySelectorAll('button');
    btns.forEach((b) =>
      b.addEventListener('click', () => {
        btns.forEach((x) => {
          x.classList.toggle('on', x === b);
          x.setAttribute('aria-selected', x === b);
        });
        placeInd(bar);
        const cat = b.dataset.cat;
        let k = 0;
        const scope = bar.closest('section') || root;
        scope.querySelectorAll('.' + cls).forEach((c) => {
          const hide = cat !== 'all' && c.dataset.cat !== cat;
          c.hidden = hide;
          if (!hide) {
            c.classList.remove('pop');
            void c.offsetWidth;
            c.style.animationDelay = `${Math.min(k++, 8) * 40}ms`;
            c.classList.add('pop');
          }
        });
        scope.querySelector('[data-spot]')?.dispatchEvent(new Event('spot:first'));
      }),
    );
    requestAnimationFrame(() => placeInd(bar));
  });

  // project spotlight: pick a row, the preview panel shows it (inline on phones)
  const spotView = (p, i) => `
    ${shot(p.image, p.title, 'spot-shot')}
    <div class="spot-body" style="--c:${esc(p.color)}">
      <div class="pcard-top"><span class="tag">${esc(CAT_LABEL[p.category] || 'Project')}</span>${p.featured ? `<span class="tag tag-star">${ICONS.star}Featured</span>` : ''}<span class="yr">${esc(p.year || '')}</span></div>
      <h3>${esc(p.title)}${sampleTag(p)}</h3>
      <p class="tl">${esc(p.tagline)}</p>
      <p>${esc(p.description)}</p>
      ${p.highlights?.length ? `<ul>${p.highlights.slice(0, 3).map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
      <div class="chips">${(p.tech || []).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
      <div class="plinks">${link(p.links?.demo, `Live demo ${ICONS.arrow}`)}${link(p.links?.code, `Code ${ICONS.arrow}`)}</div>
    </div>`;
  const spot = root.querySelector('[data-spot]');
  if (spot) {
    const view = spot.querySelector('.spot-view');
    const narrow = matchMedia('(max-width: 860px)');
    const select = (row, toggle = false) => {
      const i = Number(row.querySelector('.spot-btn').dataset.i);
      const wasOn = row.classList.contains('on');
      spot.querySelectorAll('.spot-row').forEach((r) => {
        r.classList.remove('on');
        r.querySelector('.spot-btn').setAttribute('aria-expanded', 'false');
        r.querySelector('.spot-inline').innerHTML = '';
      });
      if (toggle && wasOn && narrow.matches) return; // tap again to close on phones
      row.classList.add('on');
      row.querySelector('.spot-btn').setAttribute('aria-expanded', 'true');
      const html = spotView(projects[i], i);
      if (narrow.matches) row.querySelector('.spot-inline').innerHTML = `<div class="spot-card glass">${html}</div>`;
      else {
        view.classList.remove('swap');
        void view.offsetWidth;
        view.innerHTML = html;
        view.classList.add('swap');
      }
    };
    spot.addEventListener('click', (e) => {
      const row = e.target.closest('.spot-btn')?.closest('.spot-row');
      if (row) select(row, true);
    });
    // desktop: hovering a row previews it
    spot.addEventListener('pointerover', (e) => {
      if (narrow.matches || e.pointerType !== 'mouse') return;
      const row = e.target.closest('.spot-row');
      if (row && !row.classList.contains('on')) select(row);
    });
    spot.addEventListener('spot:first', () => {
      const first = [...spot.querySelectorAll('.spot-row')].find((r) => !r.hidden);
      if (first) select(first);
    });
    narrow.addEventListener('change', () => spot.dispatchEvent(new Event('spot:first')));
    if (narrow.matches) spot.querySelector('.spot-row')?.classList.remove('on');
    else select(spot.querySelector('.spot-row'));
  }

  enhance(root, { projects });

  // card -> full details in a modal (same cards as the 3D world)
  const modal = createModal();
  root.addEventListener('click', (e) => {
    const card = e.target.closest('.ach-item[data-open], .cthumb[data-open]');
    if (!card || e.target.closest('a')) return;
    const [sec, i] = card.dataset.open.split(':');
    modal.show(sec, Number(i));
  });

  // news: "see all" opens the full list; the announcement banner can be dismissed
  root.querySelector('[data-news-all]')?.addEventListener('click', () => modal.show('news', 0));
  const banner = root.querySelector('.announce');
  banner?.querySelector('.announce-x').addEventListener('click', () => {
    banner.classList.add('gone');
    setTimeout(() => banner.remove(), 400);
    try {
      localStorage.setItem('news-dismissed', latest.date + latest.title);
    } catch {
      /* ignore */
    }
  });

  const navInd = root.querySelector('.nav-ind');
  const moveNav = () => {
    const on = root.querySelector('.cv-nav nav a.on');
    if (!navInd) return;
    navInd.style.opacity = on ? 1 : 0;
    if (on) {
      navInd.style.width = on.offsetWidth + 'px';
      navInd.style.transform = `translateX(${on.offsetLeft}px)`;
    }
  };
  addEventListener('resize', () => {
    root.querySelectorAll('[data-tabs]').forEach(placeInd);
    moveNav();
  });
  document.fonts?.ready.then(() => {
    root.querySelectorAll('[data-tabs]').forEach(placeInd);
    moveNav();
  });

  // theme switch
  const themeBtn = root.querySelector('[data-theme-toggle]');
  const syncTheme = () => {
    const light = isLight();
    themeBtn?.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f7f6f3' : '#080a18');
  };
  syncTheme();
  themeBtn?.addEventListener('click', () => {
    document.body.classList.toggle('light');
    try { localStorage.setItem('theme', isLight() ? 'light' : 'dark'); } catch {}
    syncTheme();
  });

  // moving 3D background (lazy, only where it will run smoothly)
  // Waits for the visitor's first interaction so it never delays the content, and is
  // skipped on data-saver or slow connections (the CSS gradient background stays).
  const conn = navigator.connection;
  const slowNet = conn && (conn.saveData || /(^|-)2g|3g/.test(conn.effectiveType || ''));
  if (canExplore && !slowNet && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let mounted = false;
    const go = () => {
      if (mounted || isLight()) return;
      mounted = true;
      import('./classicBg.js').then((m) => m.mountClassicBg(root.querySelector('.cv-bg'))).catch(() => {});
    };
    root.querySelector('[data-theme-toggle]')?.addEventListener('click', () => setTimeout(go, 50));
    // like the portrait: starts on the first move, scroll or tap
    const BG_EVTS = ['pointermove', 'pointerdown', 'scroll', 'keydown', 'touchstart'];
    const start = () => {
      BG_EVTS.forEach((ev) => removeEventListener(ev, start));
      'requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 800 }) : setTimeout(go, 200);
    };
    BG_EVTS.forEach((ev) => addEventListener(ev, start, { passive: true, once: true }));
  }

  // scroll reveal + active nav
  const els = root.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && (en.target.classList.add('in'), io.unobserve(en.target))),
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((e) => io.observe(e));
    const links = [...root.querySelectorAll('.cv-nav nav a, .mtabs a')];
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const id = '#' + en.target.id;
          // sections without their own tab keep the last one lit
          if (!links.some((l) => l.getAttribute('href') === id)) return;
          links.forEach((l) => l.classList.toggle('on', l.getAttribute('href') === id));
          moveNav();
        }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    root.querySelectorAll('section[id]').forEach((s) => spy.observe(s));
  } else els.forEach((e) => e.classList.add('in'));
}
