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
  links: {
    github: 'https://github.com/Mark3172',
    linkedin: 'https://www.linkedin.com/in/mark3172/',
    email: '', // TODO (optional): add e.g. 'you@example.com' to show an "Email me" button
    resume: '', // TODO (optional): link to a PDF, e.g. '/resume.pdf' (put the file in /public)
  },
  // Each group becomes an orbiting crystal around the Beacon.
  skills: [
    { group: 'ERP & Support', items: ['Odoo ERP', 'User Acceptance Testing', 'Go-Live Support', 'Help Desk Support', 'Troubleshooting', 'Mobile Testing'] },
    { group: 'Networks & Cloud', items: ['CCNA: Switching & Routing', 'Cisco Wireless', 'Routing Protocols', 'Virtualization', 'IT Infrastructure Ops', 'AWS Cloud'] },
    { group: 'Design', items: ['UI/UX', 'Figma', 'Prototyping', 'UX Research', 'Accessibility', 'Graphic & Logo Design'] },
    { group: 'Programming & AI', items: ['Python', 'C', 'MySQL', 'TypeScript', 'Prompt Engineering', 'Chatbots & NLP'] },
    { group: 'Leadership', items: ['Project Management', 'Team Leadership', 'Event Planning', 'HR Management', 'Marketing', 'Time Management'] },
  ],
  // Shown in the About card and the classic view.
  highlights: [
    'NASA Space Apps Challenge Yangon (at UIT): hackathon team, Nov 2026',
    'Selected participant, Cursor Myanmar Hackathon, Aug 2026',
    'Odoo ERP consultant & support for Global Connect Asia at the Myanmar-China Expo',
    'Delivered client pilot training at Global Connect Asia',
    'Launched GreenLens AI: web app, CLI, API and AI vision with multiple model providers',
    'Graduated from Curtin Singapore, Class of 2026',
    'Academic excellence award: all high distinctions at YIUS foundation',
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
    id: 'greenlens',
    title: 'GreenLens AI',
    tagline: 'AI-powered environmental inspector',
    description:
      'Point it at a room, office or shop and GreenLens spots practical sustainability issues, then walks you through confirming, acting on and measuring them. Uncertain observations stay "potential" until a person confirms them, and all energy, water, CO2e and cost figures come from deterministic code rather than the model.',
    highlights: [
      'Provider-agnostic agent core with an allow-listed tool registry',
      'Multimodal photo inspection via OpenRouter, Gemini or OpenAI, with a mock provider for offline demos',
      'Next.js web app, CLI and REST API',
    ],
    tech: ['TypeScript', 'Next.js', 'LLM agents', 'Vision models'],
    links: { code: 'https://github.com/Mark3172/greenlens-ai', demo: '' }, // TODO (optional): live demo URL
    color: '#3ddc84',
    year: '2026',
  },
  {
    id: 'expotrans',
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
 *  type: 'work' | 'education' | 'volunteer'
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
    type: 'volunteer',
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
 * ------------------------------------------------------------------- */
export const certificates = [
  {
    name: 'Build a Free Website with WordPress',
    issuer: 'Coursera',
    kind: 'certificate',
    date: 'Nov 2026',
    credentialId: 'Credential ID L33PA1IMV7EH',
    url: 'https://www.coursera.org/account/accomplishments/records/L33PA1IMV7EH',
    color: '#4cc9f0',
  },
  {
    name: 'AI for Brainstorming and Planning',
    issuer: 'Google',
    kind: 'certificate',
    date: 'Oct 2026',
    credentialId: 'Credential ID WZ9V254STTDJ',
    url: 'https://www.coursera.org/account/accomplishments/records/WZ9V254STTDJ',
    color: '#3ddc84',
  },
  {
    name: 'AI Fundamentals',
    issuer: 'Google',
    kind: 'certificate',
    date: 'Oct 2026',
    credentialId: 'Credential ID 9R1NPCOLNZX5',
    url: 'https://www.coursera.org/account/accomplishments/records/9R1NPCOLNZX5',
    color: '#ffd166',
  },
  {
    name: 'Technical Support Fundamentals',
    issuer: 'Google',
    kind: 'certificate',
    date: 'Oct 2026',
    credentialId: 'Credential ID QX2W4CAS2KGC',
    url: 'https://www.coursera.org/account/accomplishments/verify/QX2W4CAS2KGC',
    color: '#ff6b9d',
  },
  {
    name: 'UX Design Advanced Job Simulation',
    issuer: 'Lloyds Banking Group · Forage',
    kind: 'certificate',
    date: 'Jan 2026',
    credentialId: 'Credential ID sMu34p2XdhZhyxK82',
    url: 'https://www.theforage.com/completion-certificates/Zbnc2o4ok6kD2NEXx/bBWnMDoKTJCzwyu5f_Zbnc2o4ok6kD2NEXx_695a4ff2f76d215bcfd2e789_1767793543479_completion_certificate.pdf',
    color: '#b18cff',
  },
  {
    name: 'AWS Academy Cloud Foundations',
    issuer: 'Amazon Web Services (AWS)',
    kind: 'certificate',
    date: 'Jul 2025',
    credentialId: 'Cloud computing fundamentals',
    url: '',
    color: '#ff9f43',
  },
  {
    name: 'UI/UX Essentials Certificate',
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
    issuer: 'AIESEC in Myanmar',
    kind: 'award',
    date: 'Feb 2022 – Feb 2024',
    credentialId: 'Project Team Member and Project Team Leader: youth leadership development and cross-cultural exchange programs.',
    url: '',
    color: '#037ef3',
  },
  {
    name: 'GitHub Achievements',
    issuer: 'GitHub',
    kind: 'award',
    date: '',
    credentialId: 'Pull Shark ×2 · Pair Extraordinaire · YOLO · Developer Program Member',
    url: 'https://github.com/Mark3172?tab=achievements',
    color: '#c9a6ff',
  },
];
