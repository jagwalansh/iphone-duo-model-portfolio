import { PORTFOLIO_DATA, Project } from '../data/portfolio'

export interface ScreenTheme {
  isDark: boolean
  accentColor?: string
}

/**
 * Generates an ultra-crisp 800x1120 Canvas Data URL for the folded Cover Screen.
 * Displays "Welcome to Portfolio", dynamic time, author details, and unfold affordance.
 */
export function generateCoverScreenTexture(_theme?: ScreenTheme): string {
  return '/wallpapers/cover-screen.png'
}

export function generateCoverScreenTextureCanvas(theme: ScreenTheme): string {
  const width = 800
  const height = 1120
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  const isDark = theme.isDark ?? false

  // Pure Apple studio light mode background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, '#ffffff')
  bgGrad.addColorStop(0.5, '#f4f5f8')
  bgGrad.addColorStop(1, '#eaecf0')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // Ambient subtle studio glow
  const glow = ctx.createRadialGradient(400, 320, 10, 400, 320, 480)
  glow.addColorStop(0, 'rgba(99, 102, 241, 0.08)')
  glow.addColorStop(0.6, 'rgba(249, 115, 22, 0.04)')
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, width, height)

  // Subtle grid/dot pattern for high-tech Apple precision
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(0, 0, 0, 0.03)'
  for (let x = 40; x < width; x += 40) {
    for (let y = 60; y < height; y += 40) {
      ctx.beginPath()
      ctx.arc(x, y, 1.2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // 1. Status Bar at top (y: 36 - 64)
  const now = new Date()
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  ctx.fillStyle = isDark ? '#ffffff' : '#18181b'
  ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(timeString, 56, 52)

  // Top Dynamic Island Pill
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
  drawRoundedRect(ctx, 310, 32, 180, 32, 16)
  ctx.fill()

  // Green dot in pill
  ctx.fillStyle = '#22c55e'
  ctx.beginPath()
  ctx.arc(330, 48, 4.5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
  ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('PORTFOLIO OS', 344, 52)

  // Right Status Icons (5G, WiFi, Battery)
  ctx.textAlign = 'right'
  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = isDark ? '#ffffff' : '#18181b'
  ctx.fillText('5G', 700, 52)

  // Battery outline
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
  ctx.lineWidth = 1.5
  drawRoundedRect(ctx, 715, 40, 28, 14, 3)
  ctx.stroke()
  ctx.fillStyle = '#22c55e'
  drawRoundedRect(ctx, 717, 42, 21, 10, 2)
  ctx.fill()
  // Battery tip
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(744, 44, 2, 6)

  // 2. Centerpiece Welcome Header (y: 120 - 450)
  // Date subtitle
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dateString = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`

  ctx.textAlign = 'center'
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
  ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif'
  ctx.fillText(dateString.toUpperCase(), 400, 140)

  // Large Time
  ctx.fillStyle = isDark ? '#f4f4f5' : '#09090b'
  ctx.font = '200 92px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif'
  ctx.fillText(timeString, 400, 240)

  // Decorative divider line with center icon
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(120, 290)
  ctx.lineTo(680, 290)
  ctx.stroke()

  // WELCOME TO PORTFOLIO badge
  ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.16)' : 'rgba(99, 102, 241, 0.1)'
  drawRoundedRect(ctx, 240, 316, 320, 36, 18)
  ctx.fill()
  ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)'
  ctx.lineWidth = 1
  drawRoundedRect(ctx, 240, 316, 320, 36, 18)
  ctx.stroke()

  ctx.fillStyle = isDark ? '#a5b4fc' : '#4338ca'
  ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif'
  ctx.fillText('✦  WELCOME TO PORTFOLIO  ✦', 400, 339)

  // Author Name
  ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
  ctx.font = '800 48px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif'
  ctx.fillText(PORTFOLIO_DATA.personal.name, 400, 410)

  // Role subtitle
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.65)'
  ctx.font = '400 19px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif'
  ctx.fillText(PORTFOLIO_DATA.personal.role, 400, 446)

  // 3. Glance Cards (Widgets) (y: 490 - 840)
  const cardW = 320
  const cardH = 100
  const cardGap = 20

  // Widget 1: Active Focus
  drawGlassCard(ctx, 60, 490, cardW, cardH, isDark)
  ctx.textAlign = 'left'
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'
  ctx.font = '600 12px -apple-system, sans-serif'
  ctx.fillText('STATUS', 84, 522)
  ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
  ctx.font = '700 17px -apple-system, sans-serif'
  ctx.fillText('Available for Roles', 84, 550)
  ctx.fillStyle = '#10b981'
  ctx.font = '500 13px -apple-system, sans-serif'
  ctx.fillText('Full-Stack & Systems Engineering', 84, 572)

  // Widget 2: Featured Work
  drawGlassCard(ctx, 60 + cardW + cardGap, 490, cardW, cardH, isDark)
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'
  ctx.font = '600 12px -apple-system, sans-serif'
  ctx.fillText('PROJECTS', 444, 522)
  ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
  ctx.font = '700 17px -apple-system, sans-serif'
  ctx.fillText('5 Featured Builds', 444, 550)
  ctx.fillStyle = '#f97316'
  ctx.font = '500 13px -apple-system, sans-serif'
  ctx.fillText('HunterAI • Finwise • LeetFut', 444, 572)

  // Widget 3: Core Technology
  drawGlassCard(ctx, 60, 610, 660, 100, isDark)
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'
  ctx.font = '600 12px -apple-system, sans-serif'
  ctx.fillText('ENGINEERING STACK', 84, 642)
  ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
  ctx.font = '600 16px -apple-system, sans-serif'
  ctx.fillText('React  •  TypeScript  •  Cloudflare  •  Node.js  •  Python  •  Three.js', 84, 672)
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
  ctx.font = '400 13px -apple-system, sans-serif'
  ctx.fillText('Distributed micro-backends, real-time telemetry & rich WebGL experiences', 84, 694)

  // Widget 4: Location & Origin
  drawGlassCard(ctx, 60, 730, 660, 90, isDark)
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'
  ctx.font = '600 12px -apple-system, sans-serif'
  ctx.fillText('LOCATION & CONNECT', 84, 762)
  ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
  ctx.font = '600 15px -apple-system, sans-serif'
  ctx.fillText('📍 New Delhi, India   |   ✉️ anshjagwal02@gmail.com', 84, 792)

  // 4. Bottom Swipe / Tap To Unfold Affordance (y: 890 - 1080)
  const unfoldGrad = ctx.createLinearGradient(160, 930, 640, 930)
  unfoldGrad.addColorStop(0, 'rgba(99, 102, 241, 0.25)')
  unfoldGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.25)')
  unfoldGrad.addColorStop(1, 'rgba(99, 102, 241, 0.25)')

  ctx.fillStyle = unfoldGrad
  drawRoundedRect(ctx, 160, 930, 480, 64, 32)
  ctx.fill()
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.15)'
  ctx.lineWidth = 1.5
  drawRoundedRect(ctx, 160, 930, 480, 64, 32)
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
  ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
  ctx.fillText('◂ ──  SCROLL DOWN OR TAP TO UNFOLD  ── ▸', 400, 968)

  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
  ctx.font = '400 13px -apple-system, sans-serif'
  ctx.fillText('Scroll down or click to launch Dual-Screen Work & Projects Studio', 400, 1025)

  // Apple home bar at bottom
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.35)'
  drawRoundedRect(ctx, 280, 1070, 240, 5, 2.5)
  ctx.fill()

  return canvas.toDataURL('image/png')
}

/**
 * Generates an ultra-crisp 1600x1120 Canvas Data URL for the unfolded Dual-Screen.
 * Left Screen (0..800): Overview, Navigation, Skills, Bio
 * Right Screen (800..1600): Active Project Showcase, Features, Tech Stack, Links
 */
export function generateInnerScreenTexture(_activeProject?: Project, _theme?: ScreenTheme): string {
  return '/wallpapers/inner-screen.png'
}

export function generateInnerScreenTextureCanvas(activeProject: Project, theme: ScreenTheme): string {
  const width = 1600
  const height = 1120
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const isDark = theme.isDark

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  if (isDark) {
    bgGrad.addColorStop(0, '#090a0d')
    bgGrad.addColorStop(0.5, '#0f1117')
    bgGrad.addColorStop(1, '#08090b')
  } else {
    bgGrad.addColorStop(0, '#fbfbfc')
    bgGrad.addColorStop(0.5, '#f1f2f5')
    bgGrad.addColorStop(1, '#e5e6eb')
  }
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // Accent radial glow on right side matching active project
  const accentGlow = ctx.createRadialGradient(1200, 450, 20, 1200, 450, 600)
  accentGlow.addColorStop(0, `${activeProject.accentColor}25`)
  accentGlow.addColorStop(0.7, `${activeProject.accentColor}05`)
  accentGlow.addColorStop(1, 'transparent')
  ctx.fillStyle = accentGlow
  ctx.fillRect(800, 0, 800, height)

  // Center Hinge divider guide line (virtual fold line at x = 800)
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(800, 0)
  ctx.lineTo(800, height)
  ctx.stroke()

  // ----------------------------------------------------
  // LEFT SCREEN: PROFILE, DIRECTORY & SKILLS (0 to 800px)
  // ----------------------------------------------------

  // Left Status Bar
  const now = new Date()
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  ctx.textAlign = 'left'
  ctx.fillStyle = isDark ? '#ffffff' : '#18181b'
  ctx.font = '600 17px -apple-system, sans-serif'
  ctx.fillText(timeString, 50, 48)

  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'
  ctx.font = '600 13px -apple-system, sans-serif'
  ctx.fillText('ANSH JAGWAL  •  PORTFOLIO OS', 120, 48)

  // Monogram & Title header (y: 80 - 180)
  ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
  ctx.font = '800 36px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
  ctx.fillText('Selected Works', 50, 110)

  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.6)'
  ctx.font = '400 15px -apple-system, sans-serif'
  ctx.fillText('Engineering fast, resilient systems & expressive user interfaces.', 50, 140)

  // Project List / Navigation Menu (y: 170 - 740)
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)'
  ctx.font = '700 12px -apple-system, sans-serif'
  ctx.fillText('INDEX OF PROJECTS  •  SCROLL DOWN TO BROWSE', 50, 185)

  let startY = 205
  PORTFOLIO_DATA.projects.forEach((proj, index) => {
    const isSelected = proj.id === activeProject.id
    const rowH = 92

    // Card background
    if (isSelected) {
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.85)'
      drawRoundedRect(ctx, 45, startY, 710, rowH, 16)
      ctx.fill()
      ctx.strokeStyle = activeProject.accentColor
      ctx.lineWidth = 1.5
      drawRoundedRect(ctx, 45, startY, 710, rowH, 16)
      ctx.stroke()

      // Left active accent pill
      ctx.fillStyle = activeProject.accentColor
      drawRoundedRect(ctx, 50, startY + 16, 4, rowH - 32, 2)
      ctx.fill()
    } else {
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(0, 0, 0, 0.02)'
      drawRoundedRect(ctx, 45, startY, 710, rowH, 16)
      ctx.fill()
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
      ctx.lineWidth = 1
      drawRoundedRect(ctx, 45, startY, 710, rowH, 16)
      ctx.stroke()
    }

    // Number index
    ctx.fillStyle = isSelected ? activeProject.accentColor : (isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)')
    ctx.font = '700 14px monospace'
    ctx.fillText(`0${index + 1}`, 72, startY + 36)

    // Title
    ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
    ctx.font = '700 20px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillText(proj.title, 110, startY + 38)

    // Subtitle / category
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.55)'
    ctx.font = '400 13px -apple-system, sans-serif'
    ctx.fillText(proj.subtitle, 110, startY + 62)

    // Badge on right
    if (proj.badge) {
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)'
      drawRoundedRect(ctx, 600, startY + 32, 130, 28, 14)
      ctx.fill()
      ctx.fillStyle = isSelected ? activeProject.accentColor : (isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)')
      ctx.font = '600 11px -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(proj.badge, 665, startY + 50)
      ctx.textAlign = 'left'
    }

    startY += rowH + 12
  })

  // Skills & Capabilities at bottom of left screen (y: 750 - 1050)
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)'
  ctx.font = '700 12px -apple-system, sans-serif'
  ctx.fillText('CORE TECHNICAL CAPABILITIES', 50, 760)

  drawGlassCard(ctx, 45, 780, 710, 270, isDark)

  const skillList = [
    { label: 'React / Next.js', level: 'Expert' },
    { label: 'TypeScript', level: 'Expert' },
    { label: 'Cloudflare Workers', level: 'Advanced' },
    { label: 'Node.js & Python', level: 'Advanced' },
    { label: 'Three.js & WebGL', level: 'Creative' },
    { label: 'PostgreSQL & Redis', level: 'Systems' }
  ]

  skillList.forEach((s, idx) => {
    const col = idx % 2
    const row = Math.floor(idx / 2)
    const sx = 75 + col * 340
    const sy = 810 + row * 76

    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'
    drawRoundedRect(ctx, sx, sy, 310, 60, 12)
    ctx.fill()

    ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
    ctx.font = '600 15px -apple-system, sans-serif'
    ctx.fillText(s.label, sx + 18, sy + 36)

    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'
    ctx.font = '500 12px -apple-system, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(s.level, sx + 292, sy + 36)
    ctx.textAlign = 'left'
  })

  // Apple home bar on Left
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
  drawRoundedRect(ctx, 320, 1080, 160, 5, 2.5)
  ctx.fill()

  // ----------------------------------------------------
  // RIGHT SCREEN: ACTIVE PROJECT SHOWCASE (800 to 1600px)
  // ----------------------------------------------------

  // Right Status Bar
  ctx.textAlign = 'right'
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'
  ctx.font = '600 13px -apple-system, sans-serif'
  ctx.fillText('SCROLL UP TO FOLD  •  LIVE SHOWCASE', 1540, 48)
  ctx.textAlign = 'left'

  // Category Tag Pill
  ctx.fillStyle = `${activeProject.accentColor}25`
  drawRoundedRect(ctx, 850, 85, 260, 32, 16)
  ctx.fill()
  ctx.strokeStyle = activeProject.accentColor
  ctx.lineWidth = 1
  drawRoundedRect(ctx, 850, 85, 260, 32, 16)
  ctx.stroke()

  ctx.fillStyle = activeProject.accentColor
  ctx.font = '700 12px -apple-system, sans-serif'
  ctx.fillText(`●  ${activeProject.category.toUpperCase()}`, 868, 106)

  // Huge Project Title
  ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
  ctx.font = '800 48px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
  ctx.fillText(activeProject.title, 850, 170)

  // Subtitle
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.7)'
  ctx.font = '500 20px -apple-system, sans-serif'
  ctx.fillText(activeProject.subtitle, 850, 210)

  // Mockup / Architecture Visual Window (y: 245 - 550)
  drawProjectVisualWindow(ctx, 850, 245, 700, 305, activeProject, isDark)

  // Project Description
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.8)'
  ctx.font = '400 16px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
  wrapText(ctx, activeProject.description, 850, 590, 700, 26)

  // Architecture & Engineering Highlights
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
  ctx.font = '700 12px -apple-system, sans-serif'
  ctx.fillText('KEY HIGHLIGHTS & ARCHITECTURE', 850, 680)

  let hlY = 712
  activeProject.highlights.forEach(h => {
    // Bullet icon
    ctx.fillStyle = activeProject.accentColor
    ctx.beginPath()
    ctx.arc(862, hlY - 5, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = isDark ? '#e4e4e7' : '#18181b'
    ctx.font = '500 15px -apple-system, sans-serif'
    ctx.fillText(h, 882, hlY)
    hlY += 34
  })

  // Tech Stack Badges
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
  ctx.font = '700 12px -apple-system, sans-serif'
  ctx.fillText('TECHNOLOGY STACK', 850, 835)

  let badgeX = 850
  let badgeY = 855
  activeProject.techStack.forEach(t => {
    ctx.font = '600 13px -apple-system, sans-serif'
    const textW = ctx.measureText(t).width
    const pillW = textW + 26
    if (badgeX + pillW > 1550) {
      badgeX = 850
      badgeY += 40
    }

    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
    drawRoundedRect(ctx, badgeX, badgeY, pillW, 30, 15)
    ctx.fill()

    ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
    ctx.fillText(t, badgeX + 13, badgeY + 20)

    badgeX += pillW + 10
  })

  // Bottom Interactive Link Pills
  drawGlassCard(ctx, 850, 955, 700, 95, isDark)
  ctx.fillStyle = activeProject.accentColor
  ctx.font = '700 14px -apple-system, sans-serif'
  ctx.fillText('EXPLORE REPOSITORY & LIVE DEMO', 875, 990)
  ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
  ctx.font = '600 16px -apple-system, sans-serif'
  ctx.fillText(`View on GitHub: github.com/anshjagwal/${activeProject.id} ↗`, 875, 1022)

  // Apple home bar on Right
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
  drawRoundedRect(ctx, 1120, 1080, 160, 5, 2.5)
  ctx.fill()

  return canvas.toDataURL('image/png')
}

// -----------------------------------------
// Helper drawing functions
// -----------------------------------------

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawGlassCard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, isDark: boolean) {
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.8)'
  drawRoundedRect(ctx, x, y, w, h, 18)
  ctx.fill()
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
  ctx.lineWidth = 1
  drawRoundedRect(ctx, x, y, w, h, 18)
  ctx.stroke()
}

function drawProjectVisualWindow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  project: Project,
  isDark: boolean
) {
  // Window frame
  ctx.fillStyle = isDark ? '#050608' : '#ffffff'
  drawRoundedRect(ctx, x, y, w, h, 16)
  ctx.fill()
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'
  ctx.lineWidth = 1
  drawRoundedRect(ctx, x, y, w, h, 16)
  ctx.stroke()

  // Window top bar
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'
  drawRoundedRect(ctx, x, y, w, 36, 16)
  ctx.fill()
  ctx.fillRect(x, y + 18, w, 18)

  // Window dots
  const dotColors = ['#ef4444', '#f59e0b', '#10b981']
  dotColors.forEach((color, i) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x + 22 + i * 18, y + 18, 5, 0, Math.PI * 2)
    ctx.fill()
  })

  // Window title / tab
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
  ctx.font = '600 12px monospace'
  ctx.fillText(`${project.id}.systems.internal`, x + 90, y + 22)

  // Code / Telemetry visual inside window
  ctx.fillStyle = project.accentColor
  ctx.font = '600 13px monospace'
  ctx.fillText(`// SYSTEM SPEC: ${project.title.toUpperCase()}`, x + 24, y + 68)

  ctx.fillStyle = isDark ? '#94a3b8' : '#475569'
  ctx.font = '500 13px monospace'
  ctx.fillText(`const runtime = createEdgeInstance({ zone: "global", cluster: "300-pops" });`, x + 24, y + 96)
  ctx.fillText(`const pipeline = await runtime.bootstrap({ telemetry: true, zeroTrust: true });`, x + 24, y + 122)
  ctx.fillText(`pipeline.observe(metrics => dispatchVectorStream(metrics.anomalyScore));`, x + 24, y + 148)

  // Graphical bar indicators
  const barY = y + 180
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
  drawRoundedRect(ctx, x + 24, barY, w - 48, 14, 7)
  ctx.fill()
  const barW = (w - 48) * 0.88
  ctx.fillStyle = project.accentColor
  drawRoundedRect(ctx, x + 24, barY, barW, 14, 7)
  ctx.fill()

  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
  ctx.font = '600 12px monospace'
  ctx.fillText('LATENCY: 28ms  |  STATUS: OPERATIONAL  |  UPTIME: 99.98%', x + 24, y + 225)

  // Visual metrics grid
  const boxW = (w - 72) / 3
  for (let i = 0; i < 3; i++) {
    const bx = x + 24 + i * (boxW + 12)
    const by = y + 242
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'
    drawRoundedRect(ctx, bx, by, boxW, 46, 8)
    ctx.fill()

    ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
    ctx.font = '700 14px monospace'
    const metricLabels = ['sub-50ms', '300+ Edge', '100% TypeSafe']
    ctx.fillText(metricLabels[i], bx + 14, by + 28)
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ')
  let line = ''

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y)
      line = words[n] + ' '
      y += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, y)
}
