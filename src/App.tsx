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

  // Apple Duo authentic prototype textures matching user photos
  const coverTexture = useMemo(() => {
    return '/wallpapers/cover-screen.png'
  }, [])

  const innerTexture = useMemo(() => {
    return '/wallpapers/inner-screen.png'
  }, [])

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

  // Always-On Display (AOD) Sleep & Wake state
  const [isAsleep, setIsAsleep] = useState(false)
  const isAsleepRef = useRef(isAsleep)
  isAsleepRef.current = isAsleep

  // Delay before the wake crossfade animation begins (ms)
  const [wakeDelay, setWakeDelay] = useState(400)
  const wakeLockoutRef = useRef(0)

  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastActivityRef = useRef(Date.now())
  const tapWokePhoneRef = useRef(false)

  const wakePhone = useCallback(() => {
    if (isAsleepRef.current) {
      setIsAsleep(false)
      wakeLockoutRef.current = Date.now() + 600
      console.log('%c☀️ Apple Duo woke up (Always-On Display dismissed)', 'color: #f59e0b; font-weight: bold;')
    }
    lastActivityRef.current = Date.now()
  }, [])

  const sleepPhone = useCallback(() => {
    if (progress.get() < 0.15) {
      setIsAsleep(true)
      console.log('%c🌙 Apple Duo entered Always-On Display (AOD)', 'color: #94a3b8; font-style: italic;')
    }
  }, [progress])

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }
    // Only schedule sleep if phone is currently folded shut on the lock screen
    if (progress.get() < 0.15) {
      inactivityTimerRef.current = setTimeout(() => {
        if (progress.get() < 0.15) {
          sleepPhone()
        }
      }, 5000)
    }
  }, [progress, sleepPhone])

  // Inactivity tracking: resets 5s countdown on user activity, wakes on click/tap
  useEffect(() => {
    resetInactivityTimer()

    let lastMoveTime = 0
    function handleUserActivity(e?: Event) {
      const now = Date.now()

      // If asleep, mouse movement alone doesn't wake the phone (tapping/clicking/keys do!)
      if (isAsleepRef.current) {
        return
      }

      // Throttle pointer move to avoid continuous timer restarts
      if (e?.type === 'pointermove' || e?.type === 'mousemove') {
        if (now - lastMoveTime < 250) return
        lastMoveTime = now
      }

      lastActivityRef.current = now
      resetInactivityTimer()
    }

    function handleGlobalPointerDown() {

      if (isAsleepRef.current) {
        tapWokePhoneRef.current = true
        wakePhone()
        resetInactivityTimer()
      } else {
        tapWokePhoneRef.current = false
      }
    }

    function handleGlobalPointerUp() {
      setTimeout(() => {
        tapWokePhoneRef.current = false
      }, 100)
    }

    window.addEventListener('pointermove', handleUserActivity, { passive: true })
    window.addEventListener('pointerdown', handleGlobalPointerDown, { passive: true })
    window.addEventListener('touchstart', handleGlobalPointerDown, { passive: true })
    window.addEventListener('pointerup', handleGlobalPointerUp, { passive: true })
    window.addEventListener('touchend', handleGlobalPointerUp, { passive: true })

    const unsubscribe = progress.on('change', (val) => {
      if (val >= 0.15) {
        // Unfolding phone wakes it immediately and cancels sleep timer
        if (isAsleepRef.current) {
          setIsAsleep(false)
        }
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current)
          inactivityTimerRef.current = null
        }
      } else {
        // Phone folded back shut: restart 5s inactivity countdown
        resetInactivityTimer()
      }
    })

    return () => {
      window.removeEventListener('pointermove', handleUserActivity)
      window.removeEventListener('pointerdown', handleGlobalPointerDown)
      window.removeEventListener('touchstart', handleGlobalPointerDown)
      window.removeEventListener('pointerup', handleGlobalPointerUp)
      window.removeEventListener('touchend', handleGlobalPointerUp)
      unsubscribe()
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [resetInactivityTimer, progress, wakePhone])

  // Handle in-phone clicks
  const handlePhoneClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>, isLeftHalf: boolean) => {
      // If sleeping in AOD mode, or if this tap was to wake up the phone, do NOT unfold!
      if (isAsleepRef.current || tapWokePhoneRef.current || Date.now() < wakeLockoutRef.current) {
        tapWokePhoneRef.current = false
        wakePhone()
        resetInactivityTimer()
        return
      }

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
    [progress, animateTo, projectIndex, onCycleProject, wakePhone, resetInactivityTimer]
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
      get isAsleep() {
        return isAsleepRef.current
      },
      get wakeDelay() {
        return wakeDelay
      },
      setWakeDelay(ms: number) {
        setWakeDelay(ms)
        console.log(`%c⏱️ Wake animation delay set to: ${ms}ms`, 'color: #10b981; font-weight: bold;')
      },
      sleep() {
        sleepPhone()
      },
      wake() {
        wakePhone()
        resetInactivityTimer()
      },
      setFold(degrees: number) {
        const clamped = Math.max(0, Math.min(180, degrees)) / 180
        animateTo(clamped)
        console.log(`%c📱 Phone fold angle set to: ${degrees}°`, 'color: #6366f1; font-weight: bold;')
      },
      unfold() {
        wakePhone()
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
          'phone.sleep()': 'Enter Always-On Display (dark blur with time)',
          'phone.wake()': 'Wake phone back to bright lock screen',
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

  // Scroll, Wheel & Touch Gestures - Open and fold in exact sync with scroll
  useEffect(() => {
    // Total scroll distance (pixels) required to transition from 0 (shut) to 1 (unfolded flat)
    const FOLD_SCROLL_SPAN = 450
    // Scroll threshold to navigate between portfolio projects when fully unfolded
    const PROJECT_SCROLL_THRESHOLD = 130

    let targetProgress = progress.get()
    let rafId: number | null = null
    let projectScrollAccumulator = 0
    let isActivelyScrolling = false
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null
    let projectScrollResetTimer: ReturnType<typeof setTimeout> | null = null

    // Keep targetProgress in sync with external animations (e.g. click unfold, console, keyboard)
    const unsubscribeProgress = progress.on('change', (latest) => {
      if (!isActivelyScrolling) {
        targetProgress = latest
      }
    })

    function lerpStep() {
      const current = progress.get()
      const diff = targetProgress - current

      if (Math.abs(diff) > 0.0006) {
        // Silky exponential lerp gives immediate tactile feedback without jitter
        const next = current + diff * 0.22
        setValue(next)
        rafId = requestAnimationFrame(lerpStep)
      } else {
        setValue(targetProgress)
        rafId = null
      }
    }

    function updateTargetProgress(newTarget: number) {
      // Clamp between 0 and 1, with magnetic snap at extremes
      let clamped = Math.max(0, Math.min(1, newTarget))
      if (clamped < 0.008) clamped = 0
      if (clamped > 0.992) clamped = 1

      targetProgress = clamped

      if (!rafId) {
        rafId = requestAnimationFrame(lerpStep)
      }
    }

    function processScrollDelta(rawDeltaY: number, rawDeltaX: number) {
      if (isAsleepRef.current) {
        wakePhone()
        resetInactivityTimer()
        return
      }

      if (Date.now() < wakeLockoutRef.current) {
        return
      }

      isActivelyScrolling = true
      if (scrollEndTimer) clearTimeout(scrollEndTimer)
      scrollEndTimer = setTimeout(() => {
        isActivelyScrolling = false
      }, 200)

      // Dominant delta: prefer vertical scroll, fall back to horizontal if user swipes sideways
      const delta = Math.abs(rawDeltaY) >= Math.abs(rawDeltaX) * 0.8
        ? rawDeltaY
        : rawDeltaX * 0.9

      if (Math.abs(delta) < 0.5) return

      const currentTarget = targetProgress
      const totalProjects = PORTFOLIO_DATA.projects.length

      // Phase 1: Phone is folding or unfolding (target < 0.999)
      if (currentTarget < 0.999) {
        // Reset project scroll accumulator while phone is in fold transition
        projectScrollAccumulator = 0

        const deltaProgress = delta / FOLD_SCROLL_SPAN
        updateTargetProgress(currentTarget + deltaProgress)
        return
      }

      // Phase 2: Phone is fully unfolded (target >= 0.999)
      // Scrolling down advances projects; scrolling up reverses projects; scrolling up on Project 0 folds phone shut!
      if (projectScrollResetTimer) clearTimeout(projectScrollResetTimer)
      projectScrollResetTimer = setTimeout(() => {
        projectScrollAccumulator = 0
      }, 350)

      projectScrollAccumulator += delta

      if (delta > 0) {
        // Scrolling DOWN while fully open -> advance to next project
        if (projectScrollAccumulator >= PROJECT_SCROLL_THRESHOLD) {
          projectScrollAccumulator = 0
          const next = (projectIdxRef.current + 1) % totalProjects
          onCycleProject(next)
        }
      } else {
        // Scrolling UP while fully open
        if (projectIdxRef.current > 0) {
          // On project > 0: reverse to previous project
          if (projectScrollAccumulator <= -PROJECT_SCROLL_THRESHOLD) {
            projectScrollAccumulator = 0
            const prev = (projectIdxRef.current - 1 + totalProjects) % totalProjects
            onCycleProject(prev)
          }
        } else {
          // On Project 0: small 30px buffer, then start folding phone back shut in sync with scroll!
          if (projectScrollAccumulator <= -30) {
            const foldDelta = (projectScrollAccumulator + 30) / FOLD_SCROLL_SPAN
            updateTargetProgress(1 + foldDelta)
            projectScrollAccumulator = 0
          }
        }
      }
    }

    function handleWheel(e: WheelEvent) {
      // Allow interaction with on-screen scale HUD without hijacking
      if ((e.target as HTMLElement)?.closest?.('.size-hud')) {
        return
      }

      // Prevent native page bounce / gesture navigation
      e.preventDefault()

      let deltaY = e.deltaY
      let deltaX = e.deltaX

      // Normalize across browsers (e.g. Firefox line mode)
      if (e.deltaMode === 1) {
        deltaY *= 24
        deltaX *= 24
      } else if (e.deltaMode === 2) {
        deltaY *= window.innerHeight
        deltaX *= window.innerHeight
      }

      processScrollDelta(deltaY, deltaX)
    }

    // Touch gesture support for mobile & tablet displays
    let lastTouchY = 0
    let lastTouchX = 0
    let isTouching = false

    function handleTouchStart(e: TouchEvent) {
      if ((e.target as HTMLElement)?.closest?.('.size-hud')) return
      if (e.touches.length === 1) {
        lastTouchY = e.touches[0].clientY
        lastTouchX = e.touches[0].clientX
        isTouching = true
      }
    }

    function handleTouchMove(e: TouchEvent) {
      if (!isTouching || e.touches.length !== 1) return
      if ((e.target as HTMLElement)?.closest?.('.size-hud')) return

      const currentY = e.touches[0].clientY
      const currentX = e.touches[0].clientX

      // Dragging finger UP corresponds to scrolling DOWN
      const deltaY = (lastTouchY - currentY) * 1.6
      const deltaX = (lastTouchX - currentX) * 1.6

      lastTouchY = currentY
      lastTouchX = currentX

      processScrollDelta(deltaY, deltaX)
    }

    function handleTouchEnd() {
      isTouching = false
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      unsubscribeProgress()
      if (rafId) cancelAnimationFrame(rafId)
      if (scrollEndTimer) clearTimeout(scrollEndTimer)
      if (projectScrollResetTimer) clearTimeout(projectScrollResetTimer)
    }
  }, [progress, setValue, onCycleProject, wakePhone, resetInactivityTimer])

  // Keyboard controls
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return

      if (isAsleepRef.current) {
        wakePhone()
        resetInactivityTimer()
      }

      if (e.key.toLowerCase() === 'c') {
        e.preventDefault()
        onToggleSlider()
      } else if (e.key === ' ' || e.key === 'Enter' || e.key.toLowerCase() === 'f') {
        e.preventDefault()
        toggle()
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        if (progress.get() < 0.92) {
          animateTo(1)
        } else {
          const total = PORTFOLIO_DATA.projects.length
          onCycleProject((projectIndex + 1) % total)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        if (progress.get() >= 0.92 && projectIndex > 0) {
          onCycleProject(projectIndex - 1)
        } else {
          animateTo(0)
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        animateTo(0)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        const total = PORTFOLIO_DATA.projects.length
        onCycleProject((projectIndex + 1) % total)
        if (progress.get() < 0.92) animateTo(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const total = PORTFOLIO_DATA.projects.length
        onCycleProject((projectIndex - 1 + total) % total)
        if (progress.get() < 0.92) animateTo(1)
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
  }, [toggle, progress, animateTo, projectIndex, onCycleProject, onToggleSlider, onUpdateScale, wakePhone, resetInactivityTimer])

  return (
    <div className="fullscreen-phone-container">
      <PhoneDevice
        modelSrc="/models/iphone-duo.glb"
        coverSrc={coverTexture}
        coverOverlaySrc="/wallpapers/cover-screen-aod.png"
        screenSrc={innerTexture}
        isAsleep={isAsleep}
        sleepOpacity={0.9}
        wakeDelay={wakeDelay}
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
