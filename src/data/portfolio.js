/* =====================================================================
 *  YOUR PORTFOLIO CONTENT — edit this one file to update the whole site.
 *
 *  Both the 3D world and the classic (2D / mobile) view read from here.
 *
 *  Anything with `placeholder: true` is SAMPLE content I could not find
 *  publicly (LinkedIn blocks automated reading). It shows a small dashed
 *  "sample" tag on the site until you replace it and delete that line.
 *  Search this file for "TODO" to find every spot to fill in.
 * ===================================================================== */

export const profile = {
  name: 'Myo Set Paing',
  nickname: 'Mark',
  title: 'IT Student @ Curtin · Builder of web apps, AI tools & games',
  tagline: 'I build playful, useful things for the web — from AI agents to pixel-art games.',
  location: 'Singapore',
  // TODO: rewrite in your own voice (2–3 short paragraphs read best).
  about: [
    "Hi, I'm Mark. I study Information Technology at Curtin University and spend most of my free time shipping side projects: AI-powered tools, fintech-style utilities, dashboards and small games.",
    'I like products that feel good to use, so I care about the details: motion, layout, and making the "boring" parts like data and error states feel polished.',
  ],
  status: 'Open to internships & graduate roles', // TODO: change or set to '' to hide
  links: {
    github: 'https://github.com/Mark3172',
    linkedin: 'https://www.linkedin.com/in/mark3172/',
    email: '', // TODO: add e.g. 'you@example.com' (leave '' to hide the button)
    resume: '', // TODO: link to a PDF, e.g. '/resume.pdf' (put the file in /public)
  },
  // TODO: adjust to your real strengths. Groups become orbiting crystals in 3D.
  skills: [
    { group: 'Languages', items: ['TypeScript', 'JavaScript', 'HTML', 'CSS', 'Python'] },
    { group: 'Frameworks', items: ['React', 'React Native / Expo', 'Next.js', 'Node.js', 'Phaser', 'Vite'] },
    { group: 'AI & Data', items: ['LLM agents', 'OpenAI / Gemini / OpenRouter APIs', 'Prompt design', 'REST APIs'] },
    { group: 'Tools', items: ['Git & GitHub', 'Netlify', 'Figma', 'VS Code'] },
  ],
};

/* ---------------------------------------------------------------------
 *  PROJECTS — each one becomes a glowing pedestal in the Project Workshop.
 *  The first four are your real pinned GitHub repos. Add more by copying
 *  a block. `color` is the hologram colour (any CSS hex).
 * ------------------------------------------------------------------- */
export const projects = [
  {
    id: 'greenlens',
    title: 'GreenLens AI',
    tagline: 'AI-powered environmental inspector',
    description:
      'Point it at a room, office or shop and GreenLens spots practical sustainability issues, then walks you through confirming, acting on and measuring them. Uncertain observations stay "potential" until a person confirms them, and all energy, water, CO2e and cost figures come from deterministic code rather than the model.',
    highlights: [
      'Provider-agnostic agent core with an allow-listed tool registry',
      'Multimodal photo inspection via OpenRouter, Gemini or OpenAI, with a mock provider for offline demos',
      'CLI, REST API and a first inspection UI',
    ],
    tech: ['TypeScript', 'Node.js', 'LLM agents', 'Vision models'],
    links: { code: 'https://github.com/Mark3172/greenlens-ai', demo: '' },
    color: '#3ddc84',
    year: '2026', // TODO: confirm year
  },
  {
    id: 'midnight-express',
    title: 'Midnight Express',
    tagline: 'A 2D pixel-art detective game',
    description:
      'A playable top-down mystery aboard a night train: during a tunnel blackout a passenger vanishes from a locked sleeper, four witnesses disagree, and you have until the last stop to reconstruct the night. Original story, cast, pixel art and audio.',
    highlights: [
      'Three "contradiction" sequences where you present evidence to the right witness',
      'Data-driven story: scenes never hard-code the solution',
      'Fully static build, no backend or account needed',
    ],
    tech: ['TypeScript', 'Phaser', 'Vite', 'Pixel art'],
    links: { code: 'https://github.com/Mark3172/little-detective-mystery', demo: '' },
    color: '#b18cff',
    year: '2026', // TODO: confirm year
  },
  {
    id: 'bill-splitter',
    title: 'Bill Splitter',
    tagline: 'Split the bill in one touch',
    description:
      'A React and React Native utility for splitting group bills, attaching payment QR codes and sharing polished receipt summaries, with a dark fintech-inspired design.',
    highlights: [
      'Live equal-split maths with multi-currency formatting',
      'KPay, AYA Pay, WavePay and bank transfer QR upload, copy and download',
      'Shareable PNG receipt cards and auto-saved history',
    ],
    tech: ['TypeScript', 'React', 'React Native / Expo'],
    links: { code: 'https://github.com/Mark3172/Bill-Splitter', demo: '' },
    color: '#ffb547',
    year: '2026', // TODO: confirm year
  },
  {
    id: 'weather',
    title: 'WeatherAI Dashboard',
    tagline: 'Glassmorphism weather + "Ask AI" assistant',
    description:
      'A zero-scroll weather dashboard with real-time conditions, an interactive "Ask AI" assistant, air-quality gauge, GPS location and weather-reactive canvas effects like rain streaks and drifting snow.',
    highlights: [
      'Live OpenWeatherMap data, or an offline multi-city demo mode',
      'Colour-coded AQI with PM2.5 and PM10 levels',
      'Canvas particle system that reacts to the weather',
    ],
    tech: ['JavaScript', 'HTML/CSS', 'Canvas', 'OpenWeatherMap API'],
    links: { code: 'https://github.com/Mark3172/weather-dashboard', demo: '' },
    color: '#4cc9f0',
    year: '2025', // TODO: confirm year
  },
  {
    id: 'this-site',
    title: 'This 3D Portfolio',
    tagline: 'The island you are exploring right now',
    description:
      'A free-roam low-poly island built with Three.js: walk, sprint and jump around in third or first person, open every project, certificate and role as a card, collect data shards and climb a floating parkour route to a secret lookout. Falls back to a fast classic layout on older devices.',
    highlights: ['Third-person and first-person cameras with mouse look (pointer lock)', 'Lightweight physics: jumping, platforms, jump pads, respawn', 'Single data file drives both the 3D world and the classic view'],
    tech: ['JavaScript', 'Three.js', 'Vite'],
    links: { code: 'https://github.com/Mark3172/markprofolio', demo: '' },
    color: '#ff6b9d',
    year: '2026',
  },
];

/* ---------------------------------------------------------------------
 *  EXPERIENCE & EDUCATION — stones along the Timeline Trail, newest first.
 *  type: 'work' | 'education' | 'volunteer'
 * ------------------------------------------------------------------- */
export const experience = [
  {
    type: 'work',
    role: 'Your role here', // TODO: your job title at Global Connect Asia
    org: 'Global Connect Asia',
    start: '2025', // TODO
    end: 'Present', // TODO
    location: 'Singapore',
    summary: 'TODO: one sentence on what you do there.',
    points: ['TODO: an achievement with a number if possible', 'TODO: a tool or skill you use daily'],
    placeholder: true,
  },
  {
    type: 'education',
    role: 'Bachelor of Information Technology', // TODO: exact degree / major
    org: 'Curtin University',
    start: '2024', // TODO
    end: '2027', // TODO: expected graduation
    location: 'Singapore', // TODO: campus
    summary: 'TODO: major, notable units, GPA or awards if you want to show them.',
    points: [],
    placeholder: true,
  },
  {
    type: 'work',
    role: 'Earlier role or internship', // TODO or delete this block
    org: 'Company name',
    start: '2023',
    end: '2024',
    location: '',
    summary: 'TODO: delete this block if you do not need it.',
    points: [],
    placeholder: true,
  },
];

/* ---------------------------------------------------------------------
 *  CERTIFICATES & LICENSES — floating medallions in the Hall of Badges.
 *  kind: 'certificate' | 'license' | 'award'
 *  Copy these from LinkedIn → "Licenses & certifications".
 * ------------------------------------------------------------------- */
export const certificates = [
  {
    name: 'Certificate name', // TODO
    issuer: 'Issuer (e.g. Google, AWS, Coursera)',
    kind: 'certificate',
    date: '2025',
    credentialId: '',
    url: '', // TODO: "Show credential" link
    color: '#4cc9f0',
    placeholder: true,
  },
  {
    name: 'Another certificate', // TODO
    issuer: 'Issuer',
    kind: 'certificate',
    date: '2025',
    credentialId: '',
    url: '',
    color: '#ffb547',
    placeholder: true,
  },
  {
    name: 'License name', // TODO
    issuer: 'Issuing body',
    kind: 'license',
    date: '2024',
    credentialId: '',
    url: '',
    color: '#3ddc84',
    placeholder: true,
  },
  {
    name: 'GitHub Achievements', // real: from your GitHub profile
    issuer: 'GitHub',
    kind: 'award',
    date: '',
    credentialId: 'Pull Shark ×2 · Pair Extraordinaire · YOLO · Developer Program Member',
    url: 'https://github.com/Mark3172?tab=achievements',
    color: '#b18cff',
  },
];
