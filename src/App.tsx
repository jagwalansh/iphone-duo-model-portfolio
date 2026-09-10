import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { PORTFOLIO_DATA } from './data/portfolio'
import {
  FoldablePhone,
  PhoneDevice,
  useFoldablePhone
} from './iphone-duo'
import {
  generateCoverScreenTexture,
  generateInnerScreenTexture
} from './iphone-duo/screen-generator'
import './app.css'

declare global {
  interface Window {
    phone?: any
    duo?: any
  }
}

const DEFAULT_SCALE = 1.0

export default function App() {
  const [projectIndex, setProjectIndex] = useState(0)
  const [scale, setScale] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('apple_duo_scale')
      if (saved) {
        const parsed = parseFloat(saved)
        // If it was the previous test default 1.5, upgrade to the user's preferred 1.0
        if (parsed === 1.5) {
          localStorage.setItem('apple_duo_scale', '1.0')
          return 1.0
        }
        if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 3.5) return parsed
      }
    }
    return DEFAULT_SCALE
  })
  const [showSlider, setShowSlider] = useState(false)

  const activeProject = PORTFOLIO_DATA.projects[projectIndex]

  // Pure Apple studio light mode textures
  const coverTexture = useMemo(() => {
    return generateCoverScreenTexture({ isDark: false })
  }, [])

  const innerTexture = useMemo(() => {
    return generateInnerScreenTexture(activeProject, { isDark: false })
  }, [activeProject])

  const handleUpdateScale = useCallback((newScale: number) => {
    const clamped = Math.round(Math.max(0.6, Math.min(3.0, newScale)) * 100) / 100
    setScale(clamped)
    if (typeof window !== 'undefined') {
      localStorage.setItem('apple_duo_scale', clamped.toString())
    }
    return clamped
  }, [])

  return (
    <main className="studio-canvas">
      <FoldablePhone defaultValue={0} duration={1.8}>
        <InteractivePhone
          coverTexture={coverTexture}
          innerTexture={innerTexture}
          projectIndex={projectIndex}
          scale={scale}
          onUpdateScale={handleUpdateScale}
          onCycleProject={(nextIdx) => setProjectIndex(nextIdx)}
          showSlider={showSlider}
          onToggleSlider={() => setShowSlider(prev => !prev)}
        />
      </FoldablePhone>

      {/* Optional on-screen mini slider toggled via 'C' key or phone.toggleUI() */}
      {showSlider && (
        <aside className="size-hud" aria-label="Phone Size Control">
          <div className="size-hud-header">
            <span>Phone Scale</span>
            <button
              type="button"
              className="size-hud-close"
              onClick={() => setShowSlider(false)}
              aria-label="Close size controls"
            >
              ✕
            </button>
          </div>
          <div className="size-hud-body">
            <input
              type="range"
              min="0.8"
              max="2.6"
              step="0.05"
              value={scale}
              onChange={(e) => handleUpdateScale(parseFloat(e.target.value))}
              aria-label="Adjust phone scale"
            />
            <output>{scale.toFixed(2)}x</output>
          </div>
          <div className="size-hud-presets">
            {[0.8, 1.0, 1.2, 1.4, 1.6].map(preset => (
              <button
                key={preset}
                type="button"
                className={`preset-btn ${scale === preset ? 'active' : ''}`}
                onClick={() => handleUpdateScale(preset)}
              >
                {preset}x
              </button>
            ))}
          </div>
        </aside>
      )}
    </main>
  )
}

function InteractivePhone({
  coverTexture,
  innerTexture,
  projectIndex,
  scale,
  onUpdateScale,
  onCycleProject,
  showSlider,
  onToggleSlider
}: {
  coverTexture: string
  innerTexture: string
  projectIndex: number
  scale: number
  onUpdateScale: (s: number) => number
  onCycleProject: (idx: number) => void
  showSlider: boolean
  onToggleSlider: () => void
}) {
  const { progress, animateTo, toggle, setValue } = useFoldablePhone()
  const scaleRef = useRef(scale)
  scaleRef.current = scale
  const projectIdxRef = useRef(projectIndex)
  projectIdxRef.current = projectIndex

  // Handle in-phone clicks
  const handlePhoneClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>, isLeftHalf: boolean) => {
      const isFolded = progress.get() < 0.5
      if (isFolded) {
        animateTo(1)
      } else {
        if (isLeftHalf) {
          const totalProjects = PORTFOLIO_DATA.projects.length
          const nextIndex = (projectIndex + 1) % totalProjects
          onCycleProject(nextIndex)
        } else {
          animateTo(0)
        }
      }
    },
    [progress, animateTo, projectIndex, onCycleProject]
  )

  // Register Console Controller API on window.phone and window.duo
  useEffect(() => {
    const controller = {
      get scale() {
        return scaleRef.current
      },
      set scale(val: number) {
        const updated = onUpdateScale(val)
        console.log(`%c📱 Phone scale set to: ${updated}x`, 'color: #10b981; font-weight: bold;')
      },
      setScale(val: number) {
        const updated = onUpdateScale(val)
        console.log(`%c📱 Phone scale set to: ${updated}x`, 'color: #10b981; font-weight: bold;')
        return updated
      },
      getScale() {
        return scaleRef.current
      },
      setSize(val: number) {
        return controller.setScale(val)
      },
      setFold(degrees: number) {
        const clamped = Math.max(0, Math.min(180, degrees)) / 180
        animateTo(clamped)
        console.log(`%c📱 Phone fold angle set to: ${degrees}°`, 'color: #6366f1; font-weight: bold;')
      },
      unfold() {
        animateTo(1)
        console.log('%c📱 Phone unfolding...', 'color: #6366f1; font-weight: bold;')
      },
      fold() {
        animateTo(0)
        console.log('%c📱 Phone folding...', 'color: #6366f1; font-weight: bold;')
      },
      toggle() {
        toggle()
      },
      setProject(idOrIndex: string | number) {
        const total = PORTFOLIO_DATA.projects.length
        let targetIdx = 0
        if (typeof idOrIndex === 'number') {
          targetIdx = Math.max(0, Math.min(total - 1, idOrIndex))
        } else {
          const found = PORTFOLIO_DATA.projects.findIndex(
            p => p.id.toLowerCase() === idOrIndex.toLowerCase() || p.title.toLowerCase() === idOrIndex.toLowerCase()
          )
          if (found !== -1) targetIdx = found
        }
        onCycleProject(targetIdx)
        if (progress.get() < 0.5) animateTo(1)
        console.log(`%c📱 Active project: ${PORTFOLIO_DATA.projects[targetIdx].title}`, 'color: #f97316; font-weight: bold;')
      },
      nextProject() {
        const next = (projectIdxRef.current + 1) % PORTFOLIO_DATA.projects.length
        onCycleProject(next)
        if (progress.get() < 0.5) animateTo(1)
        console.log(`%c📱 Active project: ${PORTFOLIO_DATA.projects[next].title}`, 'color: #f97316; font-weight: bold;')
      },
      prevProject() {
        const total = PORTFOLIO_DATA.projects.length
        const prev = (projectIdxRef.current - 1 + total) % total
        onCycleProject(prev)
        if (progress.get() < 0.5) animateTo(1)
        console.log(`%c📱 Active project: ${PORTFOLIO_DATA.projects[prev].title}`, 'color: #f97316; font-weight: bold;')
      },
      toggleUI() {
        onToggleSlider()
      },
      reset() {
        onUpdateScale(DEFAULT_SCALE)
        animateTo(0)
        onCycleProject(0)
        console.log('%c📱 Phone reset to defaults', 'color: #64748b; font-weight: bold;')
      },
      help() {
        console.group('%c📱 Apple Duo Console Control Guide', 'color: #4f46e5; font-size: 14px; font-weight: bold;')
        console.table({
          'phone.scale = 1.8': 'Set phone scale (property setter)',
          'phone.setScale(1.6)': 'Set phone scale (function call, range: 0.8 - 3.0)',
          'phone.getScale()': 'Get current phone scale',
          'phone.unfold()': 'Unfold phone into dual-screen portfolio',
          'phone.fold()': 'Fold phone to welcome cover screen',
          'phone.toggle()': 'Toggle fold / unfold',
          'phone.setFold(180)': 'Set precise fold angle (0 to 180 degrees)',
          'phone.setProject("finwise")': 'Select project by name or index (0-4)',
          'phone.nextProject()': 'Switch to next project',
          'phone.prevProject()': 'Switch to previous project',
          'phone.toggleUI()': 'Toggle on-screen size slider (or press "C" key)',
          'phone.reset()': 'Reset phone size and position to defaults'
        })
        console.groupEnd()
      }
    }

    window.phone = controller
    window.duo = controller

    console.log(
      '%c📱 Apple Duo Console Control Active%c\n' +
      'Try typing in console:\n' +
      '  phone.scale = 1.7       (or phone.setScale(1.7))\n' +
      '  phone.unfold()          (or phone.setFold(180))\n' +
      '  phone.setProject(1)     (0: HunterAI, 1: Finwise, 2: LeetFut...)\n' +
      '  phone.help()            (shows all commands)\n' +
      '  Press "C" on keyboard to toggle the on-screen size slider',
      'color: #4f46e5; font-weight: 800; font-size: 13px;',
      'color: #374151; font-size: 11px; line-height: 1.5;'
    )

    return () => {
      delete window.phone
      delete window.duo
    }
  }, [onUpdateScale, animateTo, toggle, onCycleProject, onToggleSlider, progress])

  // Scroll, Wheel & Touch Gestures for Fold / Unfold & Project Navigation
  useEffect(() => {
    let accumulatedDeltaY = 0
    let accumulatedDeltaX = 0
    let lastWheelTime = 0
    let resetTimer: ReturnType<typeof setTimeout> | null = null
    let lastFoldActionTime = 0
    let lastProjectCycleTime = 0

    function handleWheel(e: WheelEvent) {
      // Allow interaction with on-screen scale HUD without hijacking
      if ((e.target as HTMLElement)?.closest?.('.size-hud')) {
        return
      }

      // Prevent native page bounce and trackpad history gestures
      e.preventDefault()

      const now = Date.now()
      const isFolded = progress.get() < 0.5

      // Reset accumulation if wheel events have settled
      if (now - lastWheelTime > 180) {
        accumulatedDeltaY = 0
        accumulatedDeltaX = 0
      }
      lastWheelTime = now

      accumulatedDeltaY += e.deltaY
      accumulatedDeltaX += e.deltaX

      if (resetTimer) clearTimeout(resetTimer)
      resetTimer = setTimeout(() => {
        accumulatedDeltaY = 0
        accumulatedDeltaX = 0
      }, 220)

      // Forward direction = scroll down (wheel down, trackpad 2-finger swipe down) or right
      const isScrollingForward = accumulatedDeltaY > 15 || accumulatedDeltaX > 18
      // Backward direction = scroll up (wheel up, trackpad 2-finger swipe up) or left
      const isScrollingBackward = accumulatedDeltaY < -15 || accumulatedDeltaX < -18

      if (isFolded) {
        // When folded shut: scrolling down/forward opens the phone!
        if (isScrollingForward) {
          animateTo(1)
          lastFoldActionTime = now
          accumulatedDeltaY = 0
          accumulatedDeltaX = 0
        }
      } else {
        // When unfolded:
        if (isScrollingBackward) {
          // Scrolling up/backward folds the phone back shut!
          animateTo(0)
          lastFoldActionTime = now
          accumulatedDeltaY = 0
          accumulatedDeltaX = 0
        } else if (isScrollingForward) {
          // Scrolling down while open cycles to next project
          // (Requires settled phone state and debounce so opening inertia doesn't trigger it)
          const isOpenAndSettled = progress.get() >= 0.85 && (now - lastFoldActionTime > 900)
          if (isOpenAndSettled && now - lastProjectCycleTime > 420 && Math.abs(accumulatedDeltaY) > 45) {
            const total = PORTFOLIO_DATA.projects.length
            const next = (projectIdxRef.current + 1) % total
            onCycleProject(next)
            lastProjectCycleTime = now
            accumulatedDeltaY = 0
            accumulatedDeltaX = 0
          }
        }
      }
    }

    // Touch swipe gestures for mobile & touch displays
    let touchStartY = 0
    let touchStartX = 0
    let touchStartTime = 0

    function handleTouchStart(e: TouchEvent) {
      if ((e.target as HTMLElement)?.closest?.('.size-hud')) return
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY
        touchStartX = e.touches[0].clientX
        touchStartTime = Date.now()
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      if ((e.target as HTMLElement)?.closest?.('.size-hud')) return
      if (e.changedTouches.length === 1) {
        const deltaY = touchStartY - e.changedTouches[0].clientY // > 0: swipe up (scroll down)
        const deltaX = touchStartX - e.changedTouches[0].clientX // > 0: swipe left (scroll forward)
        const duration = Date.now() - touchStartTime

        if (duration < 650) {
          const isFolded = progress.get() < 0.5
          const isSwipeForward = deltaY > 32 || deltaX > 32
          const isSwipeBackward = deltaY < -32 || deltaX < -32

          if (isFolded && isSwipeForward) {
            animateTo(1)
            lastFoldActionTime = Date.now()
          } else if (!isFolded && isSwipeBackward) {
            animateTo(0)
            lastFoldActionTime = Date.now()
          } else if (!isFolded && isSwipeForward && progress.get() >= 0.85) {
            const total = PORTFOLIO_DATA.projects.length
            const next = (projectIdxRef.current + 1) % total
            onCycleProject(next)
          }
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      if (resetTimer) clearTimeout(resetTimer)
    }
  }, [progress, animateTo, onCycleProject])

  // Keyboard controls
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return

      if (e.key.toLowerCase() === 'c') {
        e.preventDefault()
        onToggleSlider()
      } else if (e.key === ' ' || e.key === 'Enter' || e.key.toLowerCase() === 'f') {
        e.preventDefault()
        toggle()
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        if (progress.get() < 0.5) {
          animateTo(1)
        } else {
          const total = PORTFOLIO_DATA.projects.length
          onCycleProject((projectIndex + 1) % total)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'Escape') {
        e.preventDefault()
        if (progress.get() >= 0.5) {
          animateTo(0)
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        const total = PORTFOLIO_DATA.projects.length
        onCycleProject((projectIndex + 1) % total)
        if (progress.get() < 0.5) animateTo(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const total = PORTFOLIO_DATA.projects.length
        onCycleProject((projectIndex - 1 + total) % total)
        if (progress.get() < 0.5) animateTo(1)
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        onUpdateScale(scaleRef.current + 0.1)
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        onUpdateScale(scaleRef.current - 0.1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle, progress, animateTo, projectIndex, onCycleProject, onToggleSlider, onUpdateScale])

  return (
    <div className="fullscreen-phone-container">
      <PhoneDevice
        modelSrc="/models/iphone-duo.glb"
        coverSrc={coverTexture}
        screenSrc={innerTexture}
        rotation={-6}
        exposure={1.2}
        blur={24}
        parallax={1}
        scale={scale}
        onPhoneClick={handlePhoneClick}
      />
    </div>
  )
}
