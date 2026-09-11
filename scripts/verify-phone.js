import { chromium } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

async function test() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1280, height: 900 })

  console.log('Navigating to http://localhost:5173/ ...')
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })

  // Wait for 3D model canvas to be ready
  await page.waitForSelector('.duo-device[data-ready="true"]', { timeout: 15000 })
  console.log('3D Phone model is ready!')

  // 1. Closed state (should match Photo 2)
  await page.waitForTimeout(1000)
  const closedShot = path.join(projectRoot, 'public/wallpapers/verify-closed-phone.png')
  await page.screenshot({ path: closedShot })
  console.log('Captured closed phone screenshot:', closedShot)

  // 2. Open state (should match Photo 1)
  await page.evaluate(() => {
    if (window.phone) {
      window.phone.unfold()
    }
  })
  await page.waitForTimeout(2200) // Wait for unfold animation to finish
  const openShot = path.join(projectRoot, 'public/wallpapers/verify-open-phone.png')
  await page.screenshot({ path: openShot })
  console.log('Captured open phone screenshot:', openShot)

  await browser.close()
  console.log('Verification finished!')
}

test().catch(err => {
  console.error(err)
  process.exit(1)
})
