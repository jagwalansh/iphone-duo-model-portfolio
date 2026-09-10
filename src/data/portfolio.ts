export interface Project {
  id: string
  title: string
  subtitle: string
  category: string
  description: string
  highlights: string[]
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  badge?: string
  accentColor: string
}

export interface SkillCategory {
  name: string
  skills: string[]
}

export const PORTFOLIO_DATA = {
  personal: {
    name: 'Ansh Jagwal',
    role: 'Software Engineer & Full-Stack Builder',
    tagline: 'Designing high-performance web systems, AI platforms, and tactile digital products.',
    email: 'anshjagwal02@gmail.com',
    location: 'New Delhi, India',
    status: 'Open for Opportunities',
    github: 'https://github.com/anshjagwal',
    linkedin: 'https://linkedin.com/in/anshjagwal',
  },
  projects: [
    {
      id: 'hunterai',
      title: 'HunterAI',
      subtitle: 'Cloudflare-Powered Autonomous Threat Intelligence',
      category: 'AI Systems & Cloudflare Workers',
      description: 'An intelligent threat hunting and reconnaissance system built on Cloudflare Workers and serverless AI inference. Analyzes domain telemetry, identifies anomalies, and automates real-time incident mitigation.',
      highlights: [
        'Edge AI inference with sub-50ms latency across 300+ global locations',
        'Automated threat pattern extraction and threat scoring engine',
        'Real-time streaming dashboard with interactive vector analytics'
      ],
      techStack: ['Cloudflare Workers', 'TypeScript', 'React', 'Hono', 'Cloudflare D1', 'Vectorize'],
      githubUrl: 'https://github.com/anshjagwal/cloudflare-hunterai',
      badge: 'Featured Build',
      accentColor: '#f97316'
    },
    {
      id: 'finwise',
      title: 'Finwise',
      subtitle: 'Intelligent Personal Financial Analytics Platform',
      category: 'FinTech & Full-Stack Web',
      description: 'Comprehensive personal wealth tracking and predictive budget intelligence. Features automatic transaction categorization, savings forecasting, and portfolio allocation visualization.',
      highlights: [
        'Multi-currency ledger with real-time exchange rate sync',
        'Interactive financial goal projections and cashflow visualization',
        'Secure client-side data encryption with zero-knowledge architecture'
      ],
      techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'Chart.js'],
      githubUrl: 'https://github.com/anshjagwal/Finwise',
      badge: 'Full-Stack App',
      accentColor: '#10b981'
    },
    {
      id: 'leetfut',
      title: 'LeetFut',
      subtitle: 'Competitive Programming Arena with Football Dynamics',
      category: 'Gamification & Algorithmic Systems',
      description: 'A novel competitive programming platform that blends algorithmic challenge resolution with FIFA Ultimate Team football mechanics. Complete code challenges to scout, build, and upgrade developer rosters.',
      highlights: [
        'Real-time code evaluation engine with multi-language execution',
        'Dynamic card rating system based on algorithmic time-complexity',
        'Live multiplayer squad battles and global ranking leaderboards'
      ],
      techStack: ['React', 'Node.js', 'Docker Sandbox', 'WebSockets', 'Tailwind CSS', 'Redis'],
      githubUrl: 'https://github.com/anshjagwal/leetfut',
      badge: 'Algorithmic Arena',
      accentColor: '#6366f1'
    },
    {
      id: 'habit-tracker',
      title: 'Habit Tracker',
      subtitle: 'Minimalist Momentum & Habit Analytics App',
      category: 'Productivity & Data Visualization',
      description: 'A distraction-free, privacy-first habit and momentum tracker. Designed with tactile micro-interactions, streak decay resistance, and insightful consistency heatmaps.',
      highlights: [
        'GitHub-style contribution heatmaps for daily habit consistency',
        'Offline-first architecture with local IndexedDB sync',
        'Fluid gestures, keyboard shortcuts, and dark OLED theme'
      ],
      techStack: ['React', 'TypeScript', 'Vite', 'Lucide', 'Zustand', 'Web Audio API'],
      githubUrl: 'https://github.com/anshjagwal/habit-tracker',
      badge: 'Productivity',
      accentColor: '#8b5cf6'
    },
    {
      id: 'keyverse',
      title: 'KeyVerse',
      subtitle: 'Mechanical Keyboard Audio & Typing Telemetry Engine',
      category: 'Web Audio & Creative Engineering',
      description: 'An interactive typing sanctuary providing tactile mechanical switch sound synthesis, real-time typing speed diagnostics, and layout ergonomics analytics.',
      highlights: [
        'Sample-accurate mechanical switch acoustic synthesizer',
        'Key-by-key latency and burst speed telemetry analysis',
        'Custom mechanical keycap theme customizer and sound packs'
      ],
      techStack: ['Web Audio API', 'Canvas API', 'TypeScript', 'Tailwind CSS', 'Vite'],
      githubUrl: 'https://github.com/anshjagwal/keyverse',
      badge: 'Creative Tech',
      accentColor: '#06b6d4'
    }
  ] as Project[],
  skills: [
    {
      name: 'Languages & Core',
      skills: ['TypeScript', 'JavaScript (ESNext)', 'Python', 'Java', 'SQL', 'HTML5/CSS3']
    },
    {
      name: 'Frontend & Creative',
      skills: ['React', 'Next.js', 'Three.js / WebGL', 'Framer Motion', 'Tailwind CSS', 'Canvas API']
    },
    {
      name: 'Backend & Cloud',
      skills: ['Node.js', 'Hono / Express', 'Cloudflare Workers', 'PostgreSQL', 'Prisma', 'Docker']
    },
    {
      name: 'Concepts & Methodologies',
      skills: ['Distributed Systems', 'Data Structures & Algorithms', 'REST & GraphQL', 'UI/UX Craftsmanship', 'System Design']
    }
  ] as SkillCategory[]
}
