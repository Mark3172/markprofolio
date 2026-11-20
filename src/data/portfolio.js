/* =====================================================================
 *  YOUR PORTFOLIO CONTENT — edit this one file to update the whole site.
 *
 *  Both the 3D world and the classic (2D / mobile) view read from here.
 *  Content comes from your LinkedIn profile and GitHub (Nov 2026).
 *
 *  Add an item by copying a block in the same list; the 3D world lays
 *  everything out automatically. Search for "TODO" for the few optional
 *  things still missing (email, résumé, demo links).
 *  Setting `placeholder: true` on any item shows a dashed "sample" tag.
 * ===================================================================== */

export const profile = {
  name: 'Myo Set Paing',
  nickname: 'Mark',
  title: 'Junior ERP Support Specialist @ Global Connect Asia · IT graduate',
  tagline: 'I solve problems where IT systems, people and good design meet: ERP, networks, UI/UX and AI.',
  location: 'Yangon, Myanmar',
  about: [
    "Hi, I'm Mark, a passionate IT professional and Curtin Singapore graduate (Class of 2026). I currently work as a Junior ERP Support Specialist / Customer Success Engineer at Global Connect Asia, where I lead the ExpoTrans helpdesk team and help clients go live on Odoo ERP.",
    'My foundation is in systems and networking (system & network administration, CCNA routing, switching and wireless), and I keep growing in UI/UX, marketing and problem solving. I have designed accessible products in agile teams, built an AI student-support chatbot, and ship side projects like GreenLens AI.',
    'Outside work I spent two years leading teams at AIESEC in Myanmar, served as Vice President of my foundation class student council, and was active in the Curtin Innovation and Technology Club. I love hackathons and meeting people who want to build things that make a positive impact.',
  ],
  status: 'Open to work in Singapore · on-site, hybrid or remote',
  photo: 'media/profile.jpg', // LinkedIn profile photo (initials show if missing)
  links: {
    github: 'https://github.com/Mark3172',
    linkedin: 'https://www.linkedin.com/in/mark3172/',
    facebook: 'https://www.facebook.com/mark.myo/',
    instagram: 'https://www.instagram.com/mark_hhh3172/',
    email: 'markmyo6@gmail.com', // business inquiries
    resume: 'cv/Myo-Set-Paing-CV.pdf', // built from this file: `node scripts/build_cv.mjs`
  },
  // Each group becomes an orbiting crystal around the Beacon.
  skills: [
    { group: 'ERP & Support', items: ['Odoo ERP', 'User Acceptance Testing', 'Go-Live Support', 'Help Desk Support', 'Troubleshooting', 'Mobile Testing'] },
    { group: 'Networks & Cloud', items: ['CCNA: Switching & Routing', 'Cisco Wireless', 'Routing Protocols', 'Virtualization', 'IT Infrastructure Ops', 'AWS Cloud'] },
    { group: 'Design', items: ['UI/UX', 'Figma', 'Prototyping', 'UX Research', 'Accessibility', 'Graphic & Logo Design'] },
    { group: 'Programming & AI', items: ['Python', 'C', 'MySQL', 'TypeScript', 'Prompt Engineering', 'Chatbots & NLP'] },
    { group: 'Leadership', items: ['Project Management', 'Team Leadership', 'Event Planning', 'HR Management', 'Marketing', 'Time Management'] },
  ],
  // Services listed on LinkedIn: shown as "I can help with" in the contact section.
  services: ['UX Design', 'Web Design', 'Web Development', 'UX Writing', 'Content Strategy', 'Writing', 'Translation'],
  // Big numbers at the top of the classic view.
  keyFacts: [
    { value: '9', label: 'Licenses & certifications' },
    { value: '4', label: 'Hackathons, plus 6 tech events' },
    { value: '2 yrs', label: 'Team leadership at AIESEC' },
    { value: 'Odoo', label: 'ERP go-lives supported' },
  ],
  // Only the biggest wins: shown in the About card and as "Career highlights".
  // "Why hire me" cards at the top of the classic view. Keep each claim backed by
  // something on the site: `go` is the section the "See proof" link jumps to.
  whyHire: [
    { title: 'ERP go-live experience', text: 'I lead the ExpoTrans helpdesk team at Global Connect Asia through an Odoo ERP rollout: UAT, go-live and post-launch support.', go: 'experience' },
    { title: 'Ships fast under pressure', text: '3 hackathon builds in 2026 for NASA Space Apps, the Google Cloud AI Builder Cup and Cursor, each with a live demo.', go: 'hackathons' },
    { title: 'Design + tech in one person', text: 'UI/UX and accessibility work (Figma, user research) alongside CCNA networking, AWS and AI tooling.', go: 'projects' },
  ],
  // "Growth" timeline under Why hire me: one line per milestone, oldest first.
  // Only real facts; `go` is the section the milestone links to.
  milestones: [
    { year: '2022', title: 'AIESEC in Myanmar', text: 'Joined; led HR and logistics teams for 2 years', go: 'experience' },
    { year: '2022–23', title: 'Network & system admin', text: 'Two YIU certificates, both Grade A', go: 'education' },
    { year: '2023', title: 'IT foundation degree', text: 'All high distinctions · student council VP', go: 'education' },
    { year: '2023–26', title: 'Curtin Singapore', text: 'Diploma → Bachelor of IT, Class of 2026', go: 'education' },
    { year: 'Mar 2026', title: 'Global Connect Asia', text: 'Junior ERP Support Specialist, leading the ExpoTrans helpdesk', go: 'experience' },
    { year: '2026', title: '4 hackathons, 5 certificates', text: 'NASA Space Apps, Google Cloud, Cursor, IBM', go: 'hackathons' },
  ],
  // Quick facts for recruiters. Only add what is true; leave a line out rather than guess.
  // TODO (optional): add { label: 'Available', value: '...' }, work authorisation or languages.
  atAGlance: [
    { label: 'Looking for', value: 'ERP, IT support, UI/UX and junior engineering roles' },
    { label: 'Location', value: 'Yangon, Myanmar · open to Singapore (on-site, hybrid or remote)' },
    { label: 'Now', value: 'Junior ERP Support Specialist at Global Connect Asia (since Mar 2026)' },
    { label: 'Education', value: 'Curtin Singapore, IT · Class of 2026' },
    { label: 'Credentials', value: '9 licenses & certifications, including AWS, CCNA and Google' },
  ],
  highlights: [
    'Leading the ExpoTrans helpdesk team through an Odoo ERP go-live at Global Connect Asia',
    'Built AstroMed, an astronaut health console, at NASA Space Apps Challenge Yangon 2026',
    'Graduated from Curtin Singapore (Class of 2026) after all high distinctions at foundation level',
    'Shipped 3 hackathon builds in 2026: AstroMed (NASA), HRChronicle AI (Google Cloud) and GreenLens AI (Cursor)',
  ],
  testimonial: {
    quote:
      "I had the pleasure of working with Myo on a group project, where his patience and creativity truly stood out. His ability to translate complex ideas into visually engaging content was instrumental in our project's success. Myo's collaborative spirit, attention to detail, and commitment to quality make him an invaluable asset to any team.",
    author: 'Maung Maung Aye Chan',
    role: 'Konstrukteur Werkstudent at Schaeffler',
    date: 'Aug 2024',
  },
};

/* ---------------------------------------------------------------------
 *  PROJECTS — each one becomes a glowing pedestal in the Project Workshop.
 *  `color` is the hologram colour (any CSS hex).
 * ------------------------------------------------------------------- */
export const projects = [
  {
    id: 'astromed',
    category: 'hackathon',
    featured: true,
    title: 'AstroMed',
    tagline: 'Astronaut health console · NASA Space Apps Yangon 2026',
    description:
      'Built over the two-day NASA Space Apps Challenge Yangon (14–15 Nov 2026). AstroMed is a health-monitoring console for a Mars transit crew 20 light-minutes from Earth, organised around NASA’s five hazards of human spaceflight. Astronauts run their own daily checks with colour-coded results and plain-language guidance, and an on-board AI co-pilot keeps working when the link to Earth drops.',
    highlights: [
      'Clickable 3D body map for reporting injuries, plus live ECG and 24-hour HRV trends',
      '“Hotline to Earth” with real 20-minute link delay, urgency levels and an offline queue',
      'Server-enforced roles for astronaut, commander and mission oversight; gamified health missions',
    ],
    tech: ['TypeScript', 'Three.js', 'AI co-pilot', 'RBAC'],
    links: { code: 'https://github.com/Planet-Coders/AstroMed', demo: 'https://astro-med-ashy.vercel.app' },
    image: 'media/astromed.jpg',
    color: '#4cc9f0',
    year: '2026',
  },
  {
    id: 'hrchronicle',
    category: 'hackathon',
    featured: true,
    title: 'HRChronicle AI',
    tagline: 'Gemini HR copilot · Google Cloud AI Builder Cup 2026',
    description:
      'Our team’s entry to the Google Cloud AI Builder Cup: an AI platform that keeps track of employee milestones like birthdays and work anniversaries across Asia-Pacific teams and turns them into culture-aware recognition.',
    highlights: [
      'Gemini HR copilot with tool calling, roster import from photos or PDFs via OCR, and voice in and out',
      'GenAI celebration cards sent by email, Teams or Telegram, in 7 languages',
      '3D Asia-Pacific globe, Myanmar mobile-wallet checkout, admin console and audit logs',
    ],
    tech: ['React 19', 'TypeScript', 'Gemini 2.5 Flash', 'Firebase', 'Three.js'],
    links: { code: 'https://github.com/vibecode-ting/hr_chronicle_ai', demo: 'https://myanmardev.web.app' },
    image: 'media/hrchronicle.webp',
    color: '#ffb547',
    year: '2026',
  },
  {
    id: 'greenlens',
    category: 'hackathon',
    featured: true,
    title: 'GreenLens AI',
    tagline: 'AI environmental inspector · Cursor Myanmar Hackathon 2026',
    description:
      'Point it at a room, office or shop and GreenLens spots practical sustainability issues, then walks you through confirming, acting on and measuring them. Uncertain observations stay "potential" until a person confirms them, and all energy, water, CO2e and cost figures come from deterministic code rather than the model.',
    highlights: [
      'Provider-agnostic agent core with an allow-listed tool registry',
      'Multimodal photo inspection via OpenRouter, Gemini or OpenAI, with a mock provider for offline demos',
      'Next.js web app, CLI and REST API',
    ],
    tech: ['TypeScript', 'Next.js', 'LLM agents', 'Vision models'],
    links: { code: 'https://github.com/Mark3172/greenlens-ai', demo: 'https://greentechai.netlify.app/scan' },
    image: 'media/greenlens.jpg',
    color: '#3ddc84',
    year: '2026',
  },
  {
    id: 'expotrans',
    category: 'professional',
    featured: true,
    title: 'ExpoTrans Helpdesk',
    tagline: 'Team lead · Odoo ERP rollout at Global Connect Asia',
    description:
      'I lead the ExpoTrans helpdesk team at Global Connect Asia, supporting the client through user acceptance testing, go-live and post-implementation, and feeding what we learn into future software enhancements.',
    highlights: [
      'Lead the helpdesk team and coordinate with stakeholders and cross-functional teams',
      'Support UAT, go-live and post-implementation activities',
      'Troubleshoot issues and assist with project management and communication',
    ],
    tech: ['Odoo ERP', 'UAT', 'Go-Live Support', 'Team Lead'],
    links: { code: '', demo: '' },
    color: '#ffb547',
    year: '2026 – now',
  },
  {
    id: 'alt',
    category: 'professional',
    title: 'ALT App Pilot Launch',
    tagline: 'Help desk support & pilot testing for GERES',
    description:
      'A three-month project supporting the pilot launch of the ALT mobile app for the GERES organization. I gave help desk support to users, tested the app to find functional and UX issues, and passed real-world feedback to the project and development teams.',
    highlights: [
      'Handled user-reported issues during the pilot',
      'Assisted with UAT and pilot testing',
      'Improved the user experience based on real-world feedback',
    ],
    tech: ['Help Desk', 'Mobile Testing', 'UAT', 'UX'],
    links: { code: '', demo: '' },
    color: '#4cc9f0',
    year: '2026',
  },
  {
    id: 'ai-student-assistant',
    category: 'university',
    title: 'AI Student Assistant',
    tagline: 'AI-powered student support chatbot · Curtin',
    description:
      'An AI chatbot that answers students’ academic and university questions (courses, resources and student services) with natural-language understanding and an interactive chat UI. It cuts repetitive inquiries and explores how generative AI can make student support instant, personalised and accessible.',
    highlights: ['Natural-language understanding with prompt engineering', 'Interactive chat interface for students', 'Built in a 5-person team at Curtin University'],
    tech: ['AI', 'Chatbots', 'NLP', 'Prompt Engineering'],
    links: { code: '', demo: '' },
    color: '#b18cff',
    year: '2024 – 25',
  },
  {
    id: 'readly',
    category: 'university',
    title: 'Readly',
    tagline: 'Accessible learning platform for dyslexic learners',
    description:
      'Designed and prototyped an accessible educational platform for users with dyslexia and other neurodivergent needs, for Curtin’s Human Computer Interfaces unit. As the Graphic Designer in a 3-person agile team I owned the visual direction, UI and high-fidelity prototypes, and took part in user research and usability evaluation.',
    highlights: [
      'Customisable fonts, colour themes, text-to-speech, simplified reading layouts and large controls',
      'User research: interviews, surveys, personas and journey maps',
      'Iterative Design Thinking: empathise, define, ideate, prototype, test',
    ],
    tech: ['Figma', 'UI/UX', 'Accessibility', 'Prototyping'],
    links: { code: '', demo: '' },
    color: '#ff6b9d',
    year: '2024',
  },
  {
    id: 'midnight-express',
    category: 'personal',
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
    color: '#9d7bff',
    year: '2026',
  },
  {
    id: 'bill-splitter',
    category: 'personal',
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
    color: '#ffd166',
    year: '2026',
  },
  {
    id: 'weather',
    category: 'personal',
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
    color: '#7cf5ff',
    year: '2025',
  },
  {
    id: 'this-site',
    category: 'personal',
    title: 'This 3D Portfolio',
    tagline: 'The island you are exploring right now',
    description:
      'A free-roam low-poly island built with Three.js: walk, sprint and jump around in third or first person, open every project, certificate and role as a card, collect data shards and climb a floating parkour route to a secret lookout. Falls back to a fast classic layout on older devices.',
    highlights: ['Third-person and first-person cameras with mouse look (pointer lock)', 'Lightweight physics: jumping, platforms, jump pads, respawn', 'Single data file drives both the 3D world and the classic view'],
    tech: ['JavaScript', 'Three.js', 'Vite'],
    links: { code: 'https://github.com/Mark3172/markprofolio', demo: '' },
    color: '#ff8fb8',
    year: '2026',
  },
];

/* ---------------------------------------------------------------------
 *  EXPERIENCE & EDUCATION — monoliths along the Timeline Trail, newest first.
 *  type: 'work' | 'education' | 'internship' | 'volunteer'
 * ------------------------------------------------------------------- */
export const experience = [
  {
    type: 'work',
    role: 'Junior ERP Support Specialist / Customer Success Engineer',
    org: 'Global Connect Asia',
    start: 'Mar 2026',
    end: 'Present',
    location: 'Yangon, Myanmar · On-site',
    summary:
      'Supporting clients in implementing and maintaining IT solutions: troubleshooting technical issues, assisting with system configuration and making customer onboarding smooth, together with cross-functional teams.',
    points: [
      'Lead the ExpoTrans helpdesk team through UAT, go-live and post-implementation',
      'Supported the ALT mobile app pilot launch for GERES',
      'Odoo ERP consultant & support at the Myanmar-China Expo; delivered client pilot training',
      'Skills: Odoo, User Acceptance Testing, Go-Live Support, Project Management, UX',
    ],
  },
  {
    type: 'education',
    role: 'Diploma of IT → Bachelor of Information Technology',
    org: 'Curtin Singapore · Curtin University',
    start: 'Oct 2023',
    end: '2026',
    location: 'Singapore',
    summary: 'Diploma of IT (from Oct 2023) and Bachelor’s degree in Information Technology (Jul 2024 – Oct 2025). Graduated with the Class of 2026.',
    points: [
      'Units across UI/UX, IT infrastructure operations, MySQL, technical design, C programming and social & international marketing',
      'Projects: Readly (accessible learning platform) and the AI Student Assistant chatbot',
      'Member of the Curtin Innovation and Technology Club',
    ],
  },
  {
    type: 'internship',
    role: 'Talent Intelligence & Experience Manager',
    org: 'AIESEC in Myanmar',
    start: 'Feb 2022',
    end: 'Feb 2024',
    location: 'Yangon, Myanmar',
    summary:
      'Two years with AIESEC contributing to youth leadership development and cross-cultural exchange programs: organising events, supporting project execution and engaging stakeholders.',
    points: [
      'Talent Intelligence & Experience Manager (Feb 2022 – Feb 2024): HR management',
      'Logistics & Delegate Servicing Manager (Jul 2022 – Jan 2023): project management and leadership',
      'Logistics & Delegate Servicing Member (Feb – Jul 2022): graphic design, logo design and online content',
      'Ran virtual and physical events for youth education and mental-health causes, and worked with AIESEC teams in Japan and Indonesia',
      'Promoted events such as the Edu Valley education fair (Goethe-Institut Myanmar, 2023); earned an AIESEC leadership certificate',
    ],
  },
  {
    type: 'education',
    role: 'Network & System Administration Certificates',
    org: 'Youth International University (YIU)',
    start: 'Aug 2022',
    end: 'May 2023',
    location: 'Yangon, Myanmar',
    summary: 'Two certificate programs, both completed with Grade A.',
    points: [
      'Network & System Administration (Nov 2022 – May 2023): web, FTP, DHCP and DNS servers, RAID, virtualization, indoor/outdoor wireless, Linux',
      'System, Networking & LAN/WAN Management (Aug – Dec 2022): computer systems, CCTV, wireless networks, troubleshooting',
    ],
  },
  {
    type: 'education',
    role: 'Foundation Degree, Information Technology',
    org: 'Yangon Institute of University Studies (YIUS)',
    start: 'Sep 2022',
    end: 'Mar 2023',
    location: 'Yangon, Myanmar',
    summary: 'All high distinctions in every subject, earning an academic excellence award.',
    points: ['Vice President of the student council'],
  },
  {
    type: 'education',
    role: 'Level 7 English (Upper Intermediate)',
    org: 'American Center',
    start: 'Jul 2020',
    end: 'Oct 2020',
    location: 'Yangon, Myanmar',
    summary: 'Certificate of completion: academic vocabulary, essays and advanced English in challenging learning environments.',
    points: [],
  },
  {
    type: 'education',
    role: 'Bachelor of Science, Chemistry (first year)',
    org: 'University of Yangon',
    start: '2019',
    end: '2019',
    location: 'Yangon, Myanmar',
    summary: 'Completed the first year before studies paused due to COVID and the political situation.',
    points: ['Class monitor; led special class events'],
  },
];

/* ---------------------------------------------------------------------
 *  CERTIFICATES & LICENSES — floating medallions in the Hall of Badges.
 *  kind: 'certificate' | 'license' | 'award'
 *  `short` / `issuerShort` are the few words printed on the 3D medal;
 *  `featured: true` puts it in the big front row.
 *  `image` (optional): a photo/scan of the certificate in public/media/certs/.
 * ------------------------------------------------------------------- */
export const certificates = [
  {
    name: 'Build a Free Website with WordPress',
    short: 'WordPress Website',
    issuerShort: 'Coursera',
    issuer: 'Coursera',
    kind: 'certificate',
    date: 'Nov 2026',
    credentialId: 'Credential ID L33PA1IMV7EH',
    url: 'https://www.coursera.org/account/accomplishments/records/L33PA1IMV7EH',
    image: 'media/certs/coursera-wordpress.jpg',
    color: '#4cc9f0',
  },
  {
    name: 'AI for Brainstorming and Planning',
    short: 'AI for Planning',
    issuerShort: 'Google',
    issuer: 'Google',
    kind: 'certificate',
    date: 'Oct 2026',
    credentialId: 'Credential ID WZ9V254STTDJ',
    url: 'https://www.coursera.org/account/accomplishments/records/WZ9V254STTDJ',
    image: 'media/certs/google-ai-planning.jpg',
    color: '#3ddc84',
  },
  {
    name: 'AI Fundamentals',
    short: 'AI Fundamentals',
    issuerShort: 'Google',
    issuer: 'Google',
    kind: 'certificate',
    date: 'Oct 2026',
    credentialId: 'Credential ID 9R1NPCOLNZX5',
    url: 'https://www.coursera.org/account/accomplishments/records/9R1NPCOLNZX5',
    image: 'media/certs/google-ai-fundamentals.jpg',
    color: '#ffd166',
  },
  {
    name: 'Technical Support Fundamentals',
    short: 'Tech Support Fundamentals',
    issuerShort: 'Google',
    featured: true,
    issuer: 'Google',
    kind: 'certificate',
    date: 'Oct 2026',
    credentialId: 'Credential ID QX2W4CAS2KGC',
    url: 'https://www.coursera.org/account/accomplishments/verify/QX2W4CAS2KGC',
    image: 'media/certs/google-tech-support.jpg',
    color: '#ff6b9d',
  },
  {
    name: 'UX Design Advanced Job Simulation',
    short: 'UX Design Simulation',
    issuerShort: 'Lloyds · Forage',
    featured: true,
    issuer: 'Lloyds Banking Group · Forage',
    kind: 'certificate',
    date: 'Jan 2026',
    credentialId: 'Credential ID sMu34p2XdhZhyxK82',
    url: 'https://www.theforage.com/completion-certificates/Zbnc2o4ok6kD2NEXx/bBWnMDoKTJCzwyu5f_Zbnc2o4ok6kD2NEXx_695a4ff2f76d215bcfd2e789_1767793543479_completion_certificate.pdf',
    color: '#b18cff',
  },
  {
    name: 'AWS Academy Cloud Foundations',
    short: 'Cloud Foundations',
    issuerShort: 'AWS',
    featured: true,
    issuer: 'Amazon Web Services (AWS)',
    kind: 'certificate',
    date: 'Jul 2025',
    credentialId: 'Cloud computing fundamentals',
    url: '',
    color: '#ff9f43',
  },
  {
    name: 'UI/UX Essentials Certificate',
    short: 'UI/UX Essentials',
    issuerShort: 'MM Project',
    issuer: 'MM PROJECT',
    kind: 'certificate',
    date: 'May 2025',
    credentialId:
      'Foundations of user-centred design: wireframing, prototyping and usability testing, creating intuitive and visually appealing digital experiences.',
    url: '',
    color: '#7cf5ff',
  },
  {
    name: 'CCNA: Switching, Routing & Wireless Essentials',
    short: 'CCNA SRWE',
    issuerShort: 'Cisco',
    featured: true,
    issuer: 'Cisco Networking Academy · Curtin University',
    kind: 'certificate',
    date: 'May 2024',
    credentialId:
      'Hands-on VLANs, inter-VLAN routing, static and dynamic routing protocols, wireless setup, troubleshooting and network security fundamentals.',
    url: '',
    color: '#049fd9',
  },
  {
    name: 'Volunteer Certificate',
    short: 'Volunteer Leader',
    issuerShort: 'AIESEC',
    issuer: 'AIESEC in Myanmar',
    kind: 'award',
    date: 'Feb 2022 – Feb 2024',
    credentialId: 'Project Team Member and Project Team Leader: youth leadership development and cross-cultural exchange programs.',
    url: '',
    color: '#037ef3',
  },
  {
    name: 'GitHub Achievements',
    short: 'GitHub Achievements',
    issuerShort: 'GitHub',
    issuer: 'GitHub',
    kind: 'award',
    date: '',
    credentialId: 'Pull Shark ×2 · Pair Extraordinaire · YOLO · Developer Program Member',
    url: 'https://github.com/Mark3172?tab=achievements',
    color: '#c9a6ff',
  },
];

/* ---------------------------------------------------------------------
 *  NEWS & ANNOUNCEMENTS — add one block whenever you post something new.
 *  The newest item becomes the announcement banner at the top of the site
 *  (for 45 days) and the News board on the island's plaza.
 *
 *  date:   'YYYY-MM-DD' (or 'YYYY-MM' if you don't know the day)
 *  source: 'linkedin' | 'facebook' | 'instagram' | 'github'
 *  link:   the post's own URL (LinkedIn: ⋯ on the post → "Copy link to post")
 *  image:  optional, a file in /public, e.g. 'media/nasa.jpg'
 * ------------------------------------------------------------------- */
export const news = [
  {
    date: '2026-11-15',
    title: 'We built AstroMed at NASA Space Apps Challenge Yangon',
    text: 'Two days at UIT with team Planet Coders, building a health-monitoring console for a Mars transit crew. The best hackathon team I could have asked for.',
    source: 'linkedin',
    link: 'https://www.linkedin.com/in/mark3172/recent-activity/all/',
    image: 'media/nasa.jpg',
  },
  {
    date: '2026-10',
    title: 'Submitted HRChronicle AI to the Google Cloud AI Builder Cup',
    text: 'A Gemini-powered HR copilot for employee milestones across Asia-Pacific, built with a 3-person team.',
    source: 'github',
    link: 'https://github.com/vibecode-ting/hr_chronicle_ai',
    image: 'media/hrchronicle.webp',
  },
  {
    date: '2026-09-26',
    title: 'Grok Bot Workshop at American Center Yangon',
    text: 'A hands-on introduction to building with Grok bots alongside Yangon’s AI developer community.',
    source: 'linkedin',
    link: 'https://www.linkedin.com/in/mark3172/recent-activity/all/',
    image: 'media/grok.jpg',
  },
  {
    date: '2026-08-29',
    title: 'Selected for the Cursor AI Hackathon Myanmar',
    text: 'Went from zero to GreenLens AI, a working AI-vision sustainability inspector, in one intense build sprint.',
    source: 'linkedin',
    link: 'https://www.linkedin.com/in/mark3172/recent-activity/all/',
    image: 'media/cursor.jpg',
  },
  {
    date: '2026-07',
    title: 'Joined the Myanmar-China Expo with Global Connect Asia',
    text: 'As a GCA Consultant & Support, helping build business connections between Myanmar and China.',
    source: 'linkedin',
    link: 'https://www.linkedin.com/in/mark3172/recent-activity/all/',
    image: 'media/expo.jpg',
  },
  {
    date: '2026-05-03',
    title: 'IBM Dev Day: Bob Edition certificate of participation',
    text: 'Attended every session of IBM’s virtual event and hackathon with mentors and international participants.',
    source: 'linkedin',
    link: 'https://www.linkedin.com/in/mark3172/recent-activity/all/',
    image: 'media/ibm.jpg',
  },
];

/* ---------------------------------------------------------------------
 *  HACKATHONS, EVENTS & ACHIEVEMENTS — trophies in the Hackathon Arena.
 *  kind: 'hackathon' | 'event' | 'award' | 'leadership'
 *  `featured: true` makes it a big trophy and a career highlight.
 *  `image` (optional): a photo or screenshot in /public, e.g. 'media/nasa.jpg'.
 * ------------------------------------------------------------------- */
export const achievements = [
  {
    title: 'NASA Space Apps Challenge',
    event: 'NASA Space Apps Challenge Yangon · at UIT',
    kind: 'hackathon',
    date: 'Nov 2026',
    role: 'Team Planet Coders',
    result: 'Built AstroMed',
    description:
      'Built AstroMed with team Planet Coders at the University of Information Technology (14–15 Nov): a health-monitoring console for a Mars transit crew, with a 3D body map, delayed “hotline to Earth” and an offline AI co-pilot. The best hackathon team I could have asked for: no ego, no conflict, positive and collaborative right to the final minutes.',
    link: 'https://github.com/Planet-Coders/AstroMed',
    image: 'media/nasa.jpg',
    color: '#4cc9f0',
    featured: true,
  },
  {
    title: 'Cursor Myanmar Hackathon',
    event: 'Cursor Myanmar Hackathon · Yangon',
    kind: 'hackathon',
    date: 'Aug 2026',
    role: 'Selected participant',
    result: 'Built GreenLens AI',
    description:
      'Selected to compete in an intense AI-assisted build sprint, where I went from zero to GreenLens AI, a working AI-vision sustainability inspector, in record time. Key takeaways: architecture matters more than ever, context is king (constraints, system prompts and specs), and AI redefines development velocity.',
    link: 'https://greentechai.netlify.app/scan',
    image: 'media/cursor.jpg',
    color: '#b18cff',
    featured: true,
  },
  {
    title: 'Google Cloud AI Builder Cup',
    event: 'Google Cloud AI Builder Cup 2026 · online',
    kind: 'hackathon',
    date: 'Oct 2026',
    role: 'Team member · submitted',
    result: 'Built HRChronicle AI',
    description:
      'Built and submitted HRChronicle AI with a 3-person team: a Gemini-powered HR copilot for employee milestones and recognition across Asia-Pacific, with OCR roster import, AI celebration cards, 7 languages and a 3D globe.',
    link: 'https://myanmardev.web.app',
    image: 'media/hrchronicle.webp',
    color: '#ffb547',
    featured: true,
  },
  {
    title: 'IBM Hackathon',
    event: 'IBM Dev Day: Bob Edition · virtual event & hackathon',
    kind: 'hackathon',
    date: 'May 2026',
    role: 'Participant',
    result: '',
    description:
      'Attended every session with IBM mentors and international participants. Participation restrictions for Myanmar prevented the final project submission, but the learning stayed.',
    link: '',
    image: 'media/ibm.jpg',
    color: '#3d7bff',
  },
  {
    title: 'Myanmar-China Expo',
    event: 'Myanmar-China Expo · Global Connect Asia',
    kind: 'event',
    date: 'Jul 2026',
    role: 'GCA consultant & support',
    result: '',
    description: 'Joined the Myanmar-China Expo as a Global Connect Asia consultant and support, helping build business connections between Myanmar and China around ERP and Odoo solutions.',
    link: '',
    image: 'media/expo.jpg',
    color: '#ff8fab',
  },
  {
    title: 'Client Pilot Training',
    event: 'Global Connect Asia',
    kind: 'event',
    date: 'May 2026',
    role: 'Trainer',
    result: '',
    description: 'Delivered pilot training to client users ahead of a full system implementation.',
    link: '',
    color: '#3ddc84',
  },
  {
    title: 'GITEX ASIA × AI Everything',
    event: 'GITEX ASIA x AI Everything Singapore',
    kind: 'event',
    date: 'Apr 2025',
    role: 'Attendee',
    result: '',
    description: 'Attended GITEX ASIA x AI Everything Singapore (23–25 Apr 2025), one of Asia’s largest tech shows, with friends from Curtin, including the Cybersecurity Stage sessions.',
    link: '',
    image: 'media/gitex.jpg',
    color: '#ff6b9d',
  },
  {
    title: 'Cursor × Grok Bot Meetup',
    event: 'Grok Bot Workshop · American Center Yangon',
    kind: 'event',
    date: 'Sep 2026',
    role: 'Attendee',
    result: '',
    description: 'Hands-on introduction to building with Grok bots alongside Yangon’s AI developer community.',
    link: '',
    image: 'media/grok.jpg',
    color: '#c9a6ff',
  },
  {
    title: 'ASEAN Data Science Program',
    event: 'Thate Pan Hub · Myanmar',
    kind: 'event',
    date: '2024',
    role: 'Trainee',
    result: '',
    description: 'Two-day training on SAP Analytics Cloud and SAP Build Apps.',
    link: '',
    color: '#4cc9f0',
  },
  {
    title: 'Weekly LeetCode Sessions',
    event: 'IT Club · Curtin Singapore',
    kind: 'leadership',
    date: '2024',
    role: 'Club member',
    result: '',
    description: 'Practised algorithms and problem solving every week with the Curtin Singapore IT Club.',
    link: '',
    color: '#7cf5ff',
  },
  {
    title: 'Academic Excellence Award',
    event: 'Yangon Institute of University Studies',
    kind: 'award',
    date: '2023',
    role: 'Vice President, student council',
    result: 'All high distinctions',
    description: 'Earned high distinctions in every subject of the IT foundation degree while serving as student council Vice President.',
    link: '',
    color: '#ffd166',
  },
];
