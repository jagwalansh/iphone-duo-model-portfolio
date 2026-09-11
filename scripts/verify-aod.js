import { chromium } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

async function main() {
  console.log('Starting Playwright AOD sleep/wake verification...')
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  })

  // Listen to console logs
  page.on('console', msg => {
    const text = msg.text()
    if (text.includes('Apple Duo') || text.includes('📱') || text.includes('🌙') || text.includes('☀️')) {
      console.log(`[Browser Console] ${text}`)
    }
  })

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })

  // Wait for 3D model to be ready
  await page.waitForSelector('.duo-device[data-ready="true"]', { timeout: 15000 })
  console.log('Model loaded and ready.')

  // 1. Initial Awake State
  const initialAsleep = await page.evaluate(() => window.phone?.isAsleep)
  console.log(`Initial sleep state: isAsleep = ${initialAsleep}`)
  await page.waitForTimeout(1000)

  const shot1 = path.join(projectRoot, 'public/test-aod-1-awake.png')
  await page.screenshot({ path: shot1 })
  console.log(`Saved screenshot 1 (Awake): ${shot1}`)

  // 2. Wait for 5.2 seconds of complete inactivity
  console.log('Waiting 5.5 seconds for inactivity timer to fire...')
  await page.waitForTimeout(5500)

  const sleepState = await page.evaluate(() => window.phone?.isAsleep)
  console.log(`After 5.5s inactivity: isAsleep = ${sleepState}`)
  if (!sleepState) {
    console.error('ERROR: Phone did not enter sleep state after 5.5s!')
  }

  // Wait 1s for smooth cross-fade animation to complete
  await page.waitForTimeout(1000)
  const shot2 = path.join(projectRoot, 'public/test-aod-2-asleep.png')
  await page.screenshot({ path: shot2 })
  console.log(`Saved screenshot 2 (AOD Asleep): ${shot2}`)

  // 3. Tap on the screen to wake it up
  console.log('Tapping on the phone screen to wake it up...')
  const phoneTarget = page.locator('.duo-device-target')
  await phoneTarget.click()

  // Verify phone is now awake
  const wokenState = await page.evaluate(() => window.phone?.isAsleep)
  console.log(`After tap: isAsleep = ${wokenState}`)

  // Wait 600ms for wake animation to complete
  await page.waitForTimeout(600)

  // Verify phone did not prematurely unfold on first wake tap
  const progressAfterWake = await page.evaluate(() => {
    const el = document.querySelector('.duo-device')
    return parseFloat(el?.getAttribute('data-progress') || '0')
  })
  console.log(`Fold progress after first wake tap: ${progressAfterWake} (Expected close to 0)`)

  const shot3 = path.join(projectRoot, 'public/test-aod-3-woken.png')
  await page.screenshot({ path: shot3 })
  console.log(`Saved screenshot 3 (Woken up): ${shot3}`)

  // 4. Click again while awake: it should unfold!
  console.log('Clicking again while awake to unfold...')
  await phoneTarget.click()
  await page.waitForTimeout(1500)

  const progressAfterSecondClick = await page.evaluate(() => {
    const el = document.querySelector('.duo-device')
    return parseFloat(el?.getAttribute('data-progress') || '0')
  })
  console.log(`Fold progress after second click: ${progressAfterSecondClick} (Expected >= 0.8)`)

  const shot4 = path.join(projectRoot, 'public/test-aod-4-unfolded.png')
  await page.screenshot({ path: shot4 })
  console.log(`Saved screenshot 4 (Unfolded): ${shot4}`)

  await browser.close()
  console.log('All AOD verification checks passed successfully!')
}

main().catch(err => {
  console.error('Verification failed:', err)
  process.exit(1)
})
