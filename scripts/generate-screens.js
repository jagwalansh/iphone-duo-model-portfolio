import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

function getBase64(relPath) {
  const full = path.join(projectRoot, relPath)
  if (fs.existsSync(full)) {
    const ext = path.extname(full).slice(1)
    const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'png' ? 'image/png' : 'image/jpeg'
    return `data:${mime};base64,${fs.readFileSync(full).toString('base64')}`
  }
  return ''
}

const desertCoverB64 = getBase64('public/wallpapers/apple-desert-cover.png')
const desertInnerB64 = getBase64('public/wallpapers/apple-desert.png')
const photosWidgetB64 = getBase64('public/wallpapers/photos-widget-portrait.jpg')

const icons = {
  facetime: getBase64('public/app-icons/facetime.jpg'),
  calendar: getBase64('public/app-icons/calendar.jpg'),
  photos: getBase64('public/app-icons/photos.jpg'),
  camera: getBase64('public/app-icons/camera.jpg'),
  mail: getBase64('public/app-icons/mail.jpg'),
  notes: getBase64('public/app-icons/notes.jpg'),
  clock: getBase64('public/app-icons/clock.jpg'),
  maps: getBase64('public/app-icons/apple-maps.jpg'),
  tv: getBase64('public/app-icons/apple-tv.jpg'),
  health: getBase64('public/app-icons/apple-health.jpg'),
  reminders: getBase64('public/app-icons/reminders.jpg'),
  shortcuts: getBase64('public/app-icons/shortcuts.jpg'),
  wallet: getBase64('public/app-icons/apple-wallet.jpg'),
  phone: getBase64('public/app-icons/phone.jpg'),
  safari: getBase64('public/app-icons/safari.jpg'),
  messages: getBase64('public/app-icons/messages.jpg'),
  music: getBase64('public/app-icons/apple-music.jpg'),
}

// Generate Cover Screen HTML (matching Photo 2)
function getCoverHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 800px;
    height: 1120px;
    overflow: hidden;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Rounded", "SF Pro Display", "SF Pro Text", sans-serif;
    -webkit-font-smoothing: antialiased;
    background: #000;
  }
  .wallpaper {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  /* Wi-Fi circular widget below physical camera */
  .wifi-widget {
    position: absolute;
    top: 215px;
    right: 50px;
    width: 52px;
    height: 52px;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Date & Time Header */
  .clock-container {
    position: absolute;
    top: 130px;
    left: 0;
    width: 100%;
    text-align: center;
    color: #ffffff;
    z-index: 5;
  }
  .date {
    font-size: 27px;
    font-weight: 600;
    letter-spacing: 0.3px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.35);
    margin-bottom: 2px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
  }
  .time {
    font-size: 215px;
    font-weight: 800;
    letter-spacing: -6px;
    line-height: 0.88;
    text-shadow: 0 4px 24px rgba(0,0,0,0.25);
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Rounded", "SF Pro Display", sans-serif;
  }

  /* Bottom Actions (Flashlight & Camera stacked vertically on right) */
  .quick-action-btn {
    position: absolute;
    right: 48px;
    width: 62px;
    height: 62px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.28);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    z-index: 10;
  }
  .btn-torch {
    bottom: 126px;
  }
  .btn-camera {
    bottom: 46px;
  }

  /* Home Bar Indicator */
  .home-bar {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: 230px;
    height: 5px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 1px 6px rgba(0,0,0,0.3);
    z-index: 10;
  }
</style>
</head>
<body>
  <img class="wallpaper" src="${desertCoverB64}" alt="Apple Desert Cover Wallpaper" />

  <!-- Wi-Fi Lockscreen Dial Widget -->
  <div class="wifi-widget">
    <svg width="52" height="52" viewBox="0 0 48 48">
      <!-- Top solid arc -->
      <path d="M 6 24 A 18 18 0 0 1 42 24" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round"/>
      <!-- Bottom dotted arc -->
      <circle cx="9" cy="31" r="2" fill="#ffffff" />
      <circle cx="15" cy="37" r="2" fill="#ffffff" />
      <circle cx="24" cy="40" r="2" fill="#ffffff" />
      <circle cx="33" cy="37" r="2" fill="#ffffff" />
      <circle cx="39" cy="31" r="2" fill="#ffffff" />
      <!-- Wi-Fi Icon inside -->
      <path d="M 17 25 A 10 10 0 0 1 31 25 M 20 28.5 A 6 6 0 0 1 28 28.5" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="24" cy="32" r="1.6" fill="#ffffff"/>
    </svg>
  </div>

  <!-- Center Clock & Date -->
  <div class="clock-container">
    <div class="date">Wed Apr 1</div>
    <div class="time">9:41</div>
  </div>

  <!-- Quick Action Buttons -->
  <div class="quick-action-btn btn-torch">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2h10a1 1 0 0 1 1 1v3.5a1 1 0 0 1-.3.7L15 10v11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V10l-2.7-2.8A1 1 0 0 1 6 6.5V3a1 1 0 0 1 1-1zm4.5 9.5a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-1z"/>
    </svg>
  </div>

  <div class="quick-action-btn btn-camera">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 9a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm0 5.5A2 2 0 1 1 12 11a2 2 0 0 1 0 4z"/>
      <path d="M9 3l-1.5 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.5L15 3H9zm11 16H4V7h4.2l1.5-2h4.6l1.5 2H20v12z"/>
    </svg>
  </div>

  <!-- Home Indicator -->
  <div class="home-bar"></div>
</body>
</html>`
}

// Generate Inner Screen HTML (matching Photo 1)
function getInnerHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1600px;
    height: 1120px;
    overflow: hidden;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif;
    -webkit-font-smoothing: antialiased;
    background: #000;
  }
  .wallpaper {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  /* Status Bar Top Right */
  .status-bar {
    position: absolute;
    top: 26px;
    right: 50px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #ffffff;
    z-index: 20;
  }
  .status-time {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.2px;
  }
  .status-location {
    width: 14px;
    height: 14px;
    fill: currentColor;
    transform: rotate(45deg);
  }

  .widget-label {
    text-align: center;
    font-size: 13.5px;
    font-weight: 500;
    color: #ffffff;
    margin-top: 8px;
    text-shadow: 0 1px 6px rgba(0,0,0,0.6);
  }

  /* ============================================================
     LEFT HALF: WIDGETS (0 to 800px)
     ============================================================ */
  .left-widgets-container {
    position: absolute;
    top: 65px;
    left: 60px;
    width: 660px;
    z-index: 10;
  }

  /* 1. Large Calendar Widget */
  .cal-widget {
    width: 660px;
    height: 250px;
    border-radius: 32px;
    background: #ffffff;
    box-shadow: 0 14px 40px rgba(0,0,0,0.2);
    padding: 24px 30px;
    display: flex;
    gap: 36px;
  }
  .cal-col-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .cal-header-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cal-accent-bar {
    width: 4px;
    height: 44px;
    background: #ef4444;
    border-radius: 2px;
  }
  .cal-header-text {
    display: flex;
    flex-direction: column;
  }
  .cal-header-day {
    color: #ef4444;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.6px;
  }
  .cal-header-num {
    color: #111827;
    font-size: 44px;
    font-weight: 800;
    line-height: 1;
  }
  .cal-event-row {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .cal-event-bar-red {
    width: 4px;
    height: 36px;
    background: #ef4444;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .cal-event-bar-orange {
    width: 4px;
    height: 36px;
    background: #f97316;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .cal-event-title {
    font-size: 14.5px;
    font-weight: 700;
    color: #1f2937;
    line-height: 1.2;
  }
  .cal-event-time {
    font-size: 13px;
    color: #6b7280;
    margin-top: 2px;
  }

  .cal-col-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .cal-event-bar-blue {
    width: 4px;
    height: 44px;
    background: #3b82f6;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .cal-tomorrow {
    color: #10b981;
    font-size: 13px;
    font-weight: 700;
  }
  .cal-event-bar-green {
    width: 4px;
    height: 36px;
    background: #10b981;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .cal-more-events {
    color: #9ca3af;
    font-size: 12.5px;
    font-weight: 600;
  }

  /* Middle Row: Battery & Reminders */
  .middle-widgets-row {
    display: flex;
    gap: 30px;
    margin-top: 22px;
  }
  .battery-widget {
    width: 315px;
    height: 250px;
    border-radius: 32px;
    background: rgba(36, 38, 42, 0.68);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    box-shadow: 0 14px 40px rgba(0,0,0,0.22);
    border: 1px solid rgba(255,255,255,0.12);
    padding: 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #ffffff;
  }
  .battery-circle {
    position: relative;
    width: 72px;
    height: 72px;
  }
  .battery-pct {
    font-size: 52px;
    font-weight: 700;
    letter-spacing: -1px;
    line-height: 1;
  }
  .battery-sub {
    font-size: 16px;
    color: #9ca3af;
    font-weight: 500;
    margin-top: 4px;
  }

  .reminders-widget {
    width: 315px;
    height: 250px;
    border-radius: 32px;
    background: #ffffff;
    box-shadow: 0 14px 40px rgba(0,0,0,0.2);
    padding: 24px 26px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .reminders-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .reminders-title-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .reminders-badge {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #3b82f6;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
  }
  .reminders-title {
    font-size: 17px;
    font-weight: 700;
    color: #111827;
  }
  .reminders-count {
    font-size: 19px;
    font-weight: 800;
    color: #3b82f6;
  }
  .reminder-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
  }
  .reminder-circle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2.2px solid #9ca3af;
    flex-shrink: 0;
  }
  .reminder-text {
    font-size: 14.5px;
    color: #374151;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 3. Maps Widget */
  .maps-widget-container {
    margin-top: 22px;
  }
  .maps-widget {
    width: 660px;
    height: 250px;
    border-radius: 32px;
    background: #edebe7;
    box-shadow: 0 14px 40px rgba(0,0,0,0.2);
    overflow: hidden;
    position: relative;
  }
  .map-road-1 {
    position: absolute;
    width: 140%;
    height: 10px;
    background: #ffffff;
    top: 40%;
    left: -20%;
    transform: rotate(-14deg);
    border-top: 1px solid #d6d3cc;
    border-bottom: 1px solid #d6d3cc;
  }
  .map-road-2 {
    position: absolute;
    width: 140%;
    height: 14px;
    background: #fed7aa;
    top: 68%;
    left: -20%;
    transform: rotate(16deg);
    border-top: 1px solid #fb923c;
    border-bottom: 1px solid #fb923c;
  }
  .map-road-3 {
    position: absolute;
    width: 8px;
    height: 140%;
    background: #93c5fd;
    top: -20%;
    left: 38%;
    transform: rotate(4deg);
  }
  .map-city {
    position: absolute;
    font-size: 15px;
    font-weight: 700;
    color: #4b5563;
    letter-spacing: 0.2px;
  }
  .map-sunnyvale { top: 26px; left: 240px; }
  .map-santaclara { top: 60px; right: 120px; }
  .map-cupertino { top: 140px; left: 200px; color: #1e3a8a; }
  .map-campbell { bottom: 35px; right: 150px; }
  .map-pin {
    position: absolute;
    top: 130px;
    left: 295px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #2563eb;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.35);
  }
  .map-search-pill {
    position: absolute;
    bottom: 22px;
    left: 22px;
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 18px 7px 10px;
  }
  .search-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f3f4f6;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #4b5563;
  }
  .food-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #ea580c;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
  }

  /* ============================================================
     RIGHT HALF: WEATHER, PHOTOS, 4X4 APPS, VERTICAL DOCK (840 to 1600px)
     ============================================================ */
  .right-side-container {
    position: absolute;
    top: 65px;
    left: 840px;
    width: 610px;
    z-index: 10;
  }

  .top-media-widgets {
    display: flex;
    gap: 30px;
    width: 610px;
  }

  .weather-widget {
    flex: 1;
    height: 250px;
    border-radius: 32px;
    background: linear-gradient(180deg, #2b619d 0%, #1e4b82 100%);
    box-shadow: 0 14px 40px rgba(0,0,0,0.22);
    padding: 24px 26px;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .weather-location {
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .weather-temp {
    font-size: 64px;
    font-weight: 300;
    line-height: 1;
    margin-top: 8px;
  }
  .weather-condition {
    font-size: 14px;
    font-weight: 600;
    color: #fef08a;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .photos-widget {
    flex: 1;
    height: 250px;
    border-radius: 32px;
    overflow: hidden;
    box-shadow: 0 14px 40px rgba(0,0,0,0.22);
    position: relative;
    background: #1c1917;
  }
  .photos-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* 4x4 App Grid */
  .app-grid {
    margin-top: 36px;
    width: 610px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 26px 20px;
  }
  .app-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .app-icon {
    width: 82px;
    height: 82px;
    border-radius: 20px;
    box-shadow: 0 8px 22px rgba(0,0,0,0.32);
    object-fit: cover;
  }
  .app-name {
    font-size: 13px;
    font-weight: 500;
    color: #ffffff;
    margin-top: 8px;
    text-shadow: 0 1px 6px rgba(0,0,0,0.7);
    text-align: center;
    white-space: nowrap;
  }

  /* Calendar App Icon Custom with "Wed 9" */
  .cal-app-icon {
    width: 82px;
    height: 82px;
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 8px 22px rgba(0,0,0,0.32);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  }
  .cal-app-top {
    width: 100%;
    height: 24px;
    background: #ef4444;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    text-align: center;
    line-height: 24px;
    letter-spacing: 0.5px;
  }
  .cal-app-num {
    font-size: 42px;
    font-weight: 700;
    color: #111827;
    line-height: 54px;
  }

  /* Page Dots below grid */
  .page-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
  }
  .page-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .page-dot.active { background: #ffffff; }
  .page-dot.inactive { background: rgba(255,255,255,0.4); }

  /* Vertical Dock on far right */
  .vertical-dock {
    position: absolute;
    top: 360px;
    right: 42px;
    width: 96px;
    height: 440px;
    border-radius: 48px;
    background: rgba(255, 255, 255, 0.42);
    backdrop-filter: blur(36px);
    -webkit-backdrop-filter: blur(36px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 18px 45px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 16px 0;
    z-index: 15;
  }
  .dock-icon {
    width: 76px;
    height: 76px;
    border-radius: 19px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.22);
    object-fit: cover;
  }

  /* Spotlight Search Circle below Dock */
  .spotlight-btn {
    position: absolute;
    bottom: 120px;
    right: 66px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.32);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.45);
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    z-index: 15;
  }
</style>
</head>
<body>
  <img class="wallpaper" src="${desertInnerB64}" alt="Apple Desert Inner Wallpaper" />

  <!-- Top Right Status Bar -->
  <div class="status-bar">
    <svg class="status-location" viewBox="0 0 24 24">
      <path d="M12 2L2 22l10-4 10 4L12 2z"/>
    </svg>
    <span class="status-time">11:51</span>
    <!-- Wi-Fi Status Symbol -->
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M5 12.55a11 11 0 0 1 14.08 0 M1.42 9a16 16 0 0 1 21.16 0 M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <circle cx="12" cy="20" r="1.5" fill="currentColor"/>
    </svg>
  </div>

  <!-- Left Column Widgets (0 to 800px) -->
  <div class="left-widgets-container">
    <!-- 1. Calendar Widget -->
    <div>
      <div class="cal-widget">
        <div class="cal-col-left">
          <div class="cal-header-row">
            <div class="cal-accent-bar"></div>
            <div class="cal-header-text">
              <span class="cal-header-day">WEDNESDAY</span>
              <span class="cal-header-num">9</span>
            </div>
          </div>
          <div class="cal-event-row">
            <div class="cal-event-bar-red"></div>
            <div>
              <div class="cal-event-title">Project Update</div>
              <div class="cal-event-time">1–2:30PM</div>
            </div>
          </div>
          <div class="cal-event-row">
            <div class="cal-event-bar-orange"></div>
            <div>
              <div class="cal-event-title">Forecast Meeting</div>
              <div class="cal-event-time">3–4PM</div>
            </div>
          </div>
        </div>
        <div class="cal-col-right">
          <div class="cal-event-row">
            <div class="cal-event-bar-blue"></div>
            <div>
              <div class="cal-event-title">Graham 1:1</div>
              <div class="cal-event-time">My Office · 4:30–5PM</div>
            </div>
          </div>
          <div class="cal-tomorrow">TOMORROW</div>
          <div class="cal-event-row">
            <div class="cal-event-bar-green"></div>
            <div>
              <div class="cal-event-title">Run 3 miles</div>
              <div class="cal-event-time">6:30–7:30AM</div>
            </div>
          </div>
          <div class="cal-more-events">||| 5 more events</div>
        </div>
      </div>
      <div class="widget-label">Calendar</div>
    </div>

    <!-- 2. Battery & Reminders Row -->
    <div class="middle-widgets-row">
      <!-- Battery Widget -->
      <div>
        <div class="battery-widget">
          <div class="battery-circle">
            <svg width="72" height="72" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="5"/>
              <circle cx="32" cy="32" r="26" fill="none" stroke="#22c55e" stroke-width="5" stroke-dasharray="145 18" stroke-linecap="round"/>
              <!-- iPhone silhouette -->
              <rect x="25" y="20" width="14" height="24" rx="3" fill="none" stroke="#ffffff" stroke-width="2"/>
            </svg>
          </div>
          <div>
            <div class="battery-pct">88%</div>
            <div class="battery-sub">Batteries</div>
          </div>
        </div>
        <div class="widget-label">Batteries</div>
      </div>

      <!-- Reminders Widget -->
      <div>
        <div class="reminders-widget">
          <div class="reminders-header">
            <div class="reminders-title-group">
              <div class="reminders-badge">✓</div>
              <span class="reminders-title">Work Actio...</span>
            </div>
            <span class="reminders-count">10</span>
          </div>
          <div>
            <div class="reminder-item">
              <div class="reminder-circle"></div>
              <span class="reminder-text">Meet John fo...</span>
            </div>
            <div class="reminder-item">
              <div class="reminder-circle"></div>
              <span class="reminder-text">Finish presen...</span>
            </div>
            <div class="reminder-item">
              <div class="reminder-circle"></div>
              <span class="reminder-text">Schedule staf...</span>
            </div>
          </div>
        </div>
        <div class="widget-label">Reminders</div>
      </div>
    </div>

    <!-- 3. Maps Widget -->
    <div class="maps-widget-container">
      <div class="maps-widget">
        <div class="map-road-1"></div>
        <div class="map-road-2"></div>
        <div class="map-road-3"></div>
        <span class="map-city map-sunnyvale">Sunnyvale</span>
        <span class="map-city map-santaclara">Santa Clara</span>
        <span class="map-city map-cupertino">Cupertino</span>
        <span class="map-city map-campbell">Campbell</span>
        <div class="map-pin"></div>
        <div class="map-search-pill">
          <div class="search-circle">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <div class="food-circle">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
            </svg>
          </div>
          <span style="font-size: 14px; font-weight: 600; color: #1f2937;">Cupertino</span>
        </div>
      </div>
      <div class="widget-label">Maps</div>
    </div>
  </div>

  <!-- Right Side: Weather, Photos, App Grid (840 to 1600px) -->
  <div class="right-side-container">
    <!-- Top Media Widgets (Weather & Photos) -->
    <div class="top-media-widgets">
      <!-- Weather Widget -->
      <div style="flex: 1;">
        <div class="weather-widget">
          <div class="weather-location">
            <span>Cupertino</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22l10-4 10 4L12 2z"/></svg>
          </div>
          <div class="weather-temp">88°</div>
          <div class="weather-condition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#facc15">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#facc15" stroke-width="2.2" stroke-linecap="round"/>
            </svg>
            <span>Heat Advisory</span>
          </div>
        </div>
        <div class="widget-label">Weather</div>
      </div>

      <!-- Photos Widget -->
      <div style="flex: 1;">
        <div class="photos-widget">
          <img class="photos-img" src="${photosWidgetB64}" alt="Photos Portrait" />
        </div>
        <div class="widget-label">Photos</div>
      </div>
    </div>

    <!-- 4x4 App Grid -->
    <div class="app-grid">
      <!-- Row 1 -->
      <div class="app-item">
        <img class="app-icon" src="${icons.facetime}" alt="FaceTime" />
        <span class="app-name">FaceTime</span>
      </div>
      <div class="app-item">
        <div class="cal-app-icon">
          <div class="cal-app-top">Wed</div>
          <div class="cal-app-num">9</div>
        </div>
        <span class="app-name">Calendar</span>
      </div>
      <div class="app-item">
        <img class="app-icon" src="${icons.photos}" alt="Photos" />
        <span class="app-name">Photos</span>
      </div>
      <div class="app-item">
        <img class="app-icon" src="${icons.camera}" alt="Camera" />
        <span class="app-name">Camera</span>
      </div>

      <!-- Row 2 -->
      <div class="app-item">
        <img class="app-icon" src="${icons.mail}" alt="Mail" />
        <span class="app-name">Mail</span>
      </div>
      <div class="app-item">
        <img class="app-icon" src="${icons.notes}" alt="Notes" />
        <span class="app-name">Notes</span>
      </div>
      <div class="app-item">
        <img class="app-icon" src="${icons.clock}" alt="Clock" />
        <span class="app-name">Clock</span>
      </div>
      <div class="app-item">
        <img class="app-icon" src="${icons.maps}" alt="Maps" />
        <span class="app-name">Maps</span>
      </div>

      <!-- Row 3 -->
      <div class="app-item">
        <!-- Siri App Icon -->
        <svg class="app-icon" viewBox="0 0 82 82">
          <rect width="82" height="82" rx="20" fill="#09090b"/>
          <circle cx="41" cy="41" r="28" fill="url(#siriGlow)"/>
          <defs>
            <radialGradient id="siriGlow">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="50%" stop-color="#a855f7"/>
              <stop offset="85%" stop-color="#ec4899"/>
              <stop offset="100%" stop-color="#09090b"/>
            </radialGradient>
          </defs>
        </svg>
        <span class="app-name">Siri</span>
      </div>
      <div class="app-item">
        <img class="app-icon" src="${icons.tv}" alt="TV" />
        <span class="app-name">TV</span>
      </div>
      <div class="app-item">
        <img class="app-icon" src="${icons.health}" alt="Health" />
        <span class="app-name">Health</span>
      </div>
      <div class="app-item">
        <img class="app-icon" src="${icons.reminders}" alt="Reminders" />
        <span class="app-name">Reminders</span>
      </div>

      <!-- Row 4 -->
      <div class="app-item">
        <img class="app-icon" src="${icons.shortcuts}" alt="Shortcuts" />
        <span class="app-name">Shortcuts</span>
      </div>
      <div class="app-item">
        <!-- App Store Icon -->
        <svg class="app-icon" viewBox="0 0 82 82">
          <rect width="82" height="82" rx="20" fill="#0284c7"/>
          <path d="M28 62 L41 22 L54 62 M32 49 L50 49" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
        <span class="app-name">App Store</span>
      </div>
      <div class="app-item">
        <img class="app-icon" src="${icons.wallet}" alt="Wallet" />
        <span class="app-name">Wallet</span>
      </div>
      <div class="app-item">
        <!-- Settings Icon -->
        <svg class="app-icon" viewBox="0 0 82 82">
          <defs>
            <linearGradient id="gearBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#9ca3af"/>
              <stop offset="100%" stop-color="#4b5563"/>
            </linearGradient>
          </defs>
          <rect width="82" height="82" rx="20" fill="url(#gearBg)"/>
          <circle cx="41" cy="41" r="23" fill="#d1d5db"/>
          <circle cx="41" cy="41" r="15" fill="#4b5563"/>
          <circle cx="41" cy="41" r="8.5" fill="#e5e7eb"/>
        </svg>
        <span class="app-name">Settings</span>
      </div>
    </div>

    <!-- Page Indicator Dots -->
    <div class="page-dots">
      <div class="page-dot active"></div>
      <div class="page-dot inactive"></div>
    </div>
  </div>

  <!-- Vertical Dock on Far Right -->
  <div class="vertical-dock">
    <img class="dock-icon" src="${icons.phone}" alt="Phone" />
    <img class="dock-icon" src="${icons.safari}" alt="Safari" />
    <img class="dock-icon" src="${icons.messages}" alt="Messages" />
    <img class="dock-icon" src="${icons.music}" alt="Music" />
  </div>

  <!-- Spotlight Search Button Below Dock -->
  <div class="spotlight-btn">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6">
      <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  </div>
</body>
</html>`
}

// Generate Always-On Display (AOD) Cover Screen HTML
// "when the phone is inactive more than 5 sec the lock screen gets dark and blur and only the time is visible"
function getCoverAodHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 800px;
    height: 1120px;
    overflow: hidden;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Rounded", "SF Pro Display", sans-serif;
    -webkit-font-smoothing: antialiased;
    background: #000000;
  }
  .wallpaper {
    position: absolute;
    inset: -40px;
    width: calc(100% + 80px);
    height: calc(100% + 80px);
    object-fit: cover;
    object-position: center;
    filter: blur(28px) brightness(0.36) contrast(1.1) saturate(0.95);
    transform: scale(1.08);
  }
  .dark-scrim {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 40%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.7) 100%);
  }

  /* Center Clock - ONLY the time is visible in Always-On Display */
  .clock-container {
    position: absolute;
    top: 130px;
    left: 0;
    width: 100%;
    text-align: center;
    color: #ffffff;
    z-index: 5;
  }
  .date {
    visibility: hidden;
    font-size: 27px;
    font-weight: 600;
    letter-spacing: 0.3px;
    margin-bottom: 2px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
  }
  .time {
    font-size: 215px;
    font-weight: 800;
    letter-spacing: -6px;
    line-height: 0.88;
    color: rgba(255, 255, 255, 0.98);
    text-shadow: 0 0 35px rgba(255,255,255,0.4), 0 0 70px rgba(255,255,255,0.18);
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Rounded", "SF Pro Display", sans-serif;
  }
</style>
</head>
<body>
  <img class="wallpaper" src="${desertCoverB64}" alt="Apple Desert Cover Wallpaper" />
  <div class="dark-scrim"></div>

  <!-- Center Clock - ONLY the time is visible (date is invisible placeholder) -->
  <div class="clock-container">
    <div class="date">Friday, Sep 11</div>
    <div class="time">9:41</div>
  </div>
</body>
</html>`
}

async function render() {
  console.log('Launching browser to render pixel-perfect textures...')
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  // 1. Render Cover Screen (800x1120)
  await page.setViewportSize({ width: 800, height: 1120 })
  await page.setContent(getCoverHtml(), { waitUntil: 'networkidle' })
  const coverPath = path.join(projectRoot, 'public/wallpapers/cover-screen.png')
  await page.screenshot({ path: coverPath, type: 'png' })
  console.log(`Saved: ${coverPath}`)

  // 2. Render Cover Screen AOD (800x1120)
  await page.setContent(getCoverAodHtml(), { waitUntil: 'networkidle' })
  const coverAodPath = path.join(projectRoot, 'public/wallpapers/cover-screen-aod.png')
  await page.screenshot({ path: coverAodPath, type: 'png' })
  console.log(`Saved: ${coverAodPath}`)

  // 3. Render Inner Screen (1600x1120)
  await page.setViewportSize({ width: 1600, height: 1120 })
  await page.setContent(getInnerHtml(), { waitUntil: 'networkidle' })
  const innerPath = path.join(projectRoot, 'public/wallpapers/inner-screen.png')
  await page.screenshot({ path: innerPath, type: 'png' })
  console.log(`Saved: ${innerPath}`)

  await browser.close()
  console.log('Done generating textures!')
}

render().catch(err => {
  console.error(err)
  process.exit(1)
})
