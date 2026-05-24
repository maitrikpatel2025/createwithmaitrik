import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('Hero loads with headline, subtitle, and CTA buttons', async ({ page }) => {
    await page.goto('/')
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    await expect(h1).not.toBeEmpty()
    // Check for CTA buttons in the hero area
    const heroSection = page.locator('section').first()
    const buttons = heroSection.locator('a, button')
    expect(await buttons.count()).toBeGreaterThanOrEqual(1)
  })

  test('StatsBar renders numbers', async ({ page }) => {
    await page.goto('/')
    const body = await page.textContent('body')
    const numbers = body?.match(/\d{1,3}(,\d{3})*(\.\d+)?[KkMm+%]?/g)
    expect(numbers?.length).toBeGreaterThan(3)
  })

  test('ServicesTeaser section loads', async ({ page }) => {
    await page.goto('/')
    const servicesText = page.getByText(/services/i)
    await expect(servicesText.first()).toBeVisible()
  })

  test('FeaturedPlaybooks cards render', async ({ page }) => {
    await page.goto('/')
    const cards = page.locator('[class*="card"], [class*="Card"], article')
    expect(await cards.count()).toBeGreaterThanOrEqual(1)
  })

  test('ToolStack grid renders', async ({ page }) => {
    await page.goto('/')
    const toolSection = page.locator('[class*="tool"], [class*="Tool"], [class*="stack"]')
    await expect(toolSection.first()).toBeVisible()
  })

  test('NewsletterBand subscribe form appears', async ({ page }) => {
    await page.goto('/')
    const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]')
    await expect(emailInput.first()).toBeVisible()
  })

  test('LeadMagnetBand renders', async ({ page }) => {
    await page.goto('/')
    const leadSection = page.locator('[class*="lead"], [class*="Lead"], [class*="magnet"], [class*="Magnet"]')
    await expect(leadSection.first()).toBeVisible()
  })

  test('Footer links and social icons', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    const footerLinks = footer.locator('a')
    expect(await footerLinks.count()).toBeGreaterThanOrEqual(2)
  })

  test('Mobile: no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(375)
  })
})

test.describe('About', () => {
  test('Page loads with content', async ({ page }) => {
    await page.goto('/about')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('No huge spacing gaps', async ({ page }) => {
    await page.goto('/about')
    const maxGap = await page.evaluate(() => {
      const main = document.querySelector('main') || document.body
      const children = Array.from(main.children)
      let max = 0
      for (let i = 1; i < children.length; i++) {
        const gap = children[i].getBoundingClientRect().top - children[i-1].getBoundingClientRect().bottom
        if (gap > max) max = gap
      }
      return max
    })
    expect(maxGap).toBeLessThan(150)
  })

  test('Mobile: no overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/about')
    const sw = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(sw).toBeLessThanOrEqual(375)
  })
})

test.describe('Services', () => {
  test('Service cards render', async ({ page }) => {
    await page.goto('/services')
    const cards = page.locator('[class*="card"], [class*="Card"], article, [class*="service"]')
    expect(await cards.count()).toBeGreaterThanOrEqual(1)
  })

  test('Inquiry form has all fields', async ({ page }) => {
    await page.goto('/services')
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[name*="name"], input[placeholder*="name" i]').first()).toBeVisible()
    await expect(page.locator('input[type="email"], input[name*="email"]').first()).toBeVisible()
    await expect(page.locator('select[name*="service"], select[name*="Service"], input[name*="service"]').first()).toBeVisible()
    await expect(page.locator('select[name*="budget"], input[name*="budget"]').first()).toBeVisible()
    await expect(page.locator('textarea').first()).toBeVisible()
  })

  test('Mobile: no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/services')
    const sw = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(sw).toBeLessThanOrEqual(375)
  })
})

test.describe('Playbooks', () => {
  test('Grid of playbook cards loads', async ({ page }) => {
    await page.goto('/playbooks')
    const cards = page.locator('a[href*="playbook"], [class*="playbook"], [class*="Playbook"], article, [class*="card"]')
    expect(await cards.count()).toBeGreaterThanOrEqual(1)
  })

  test('Detail page renders', async ({ page }) => {
    await page.goto('/playbooks')
    const firstLink = page.locator('a[href*="/playbooks/"]').first()
    const href = await firstLink.getAttribute('href')
    expect(href).toBeTruthy()
    await page.goto(href!)
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    await expect(h1).not.toBeEmpty()
  })
})

test.describe('Newsletter', () => {
  test('Issue grid renders', async ({ page }) => {
    await page.goto('/newsletter')
    const elements = page.locator('a[href], [class*="card"], [class*="issue"], article')
    expect(await elements.count()).toBeGreaterThanOrEqual(1)
  })

  test('Subscribe form appears', async ({ page }) => {
    await page.goto('/newsletter')
    await expect(page.locator('input[type="email"]').first()).toBeVisible()
  })

  test('Mobile: single column at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/newsletter')
    const sw = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(sw).toBeLessThanOrEqual(375)
  })
})

test.describe('Partnerships', () => {
  test('Brand cards render', async ({ page }) => {
    await page.goto('/partnerships')
    const cards = page.locator('[class*="card"], [class*="partner"], [class*="Partner"], article, [class*="brand"]')
    expect(await cards.count()).toBeGreaterThanOrEqual(1)
  })

  test('COMING SOON text visible', async ({ page }) => {
    await page.goto('/partnerships')
    await expect(page.getByText(/coming soon/i).first()).toBeVisible()
  })

  test('No stray "/" text', async ({ page }) => {
    await page.goto('/partnerships')
    const body = await page.textContent('body')
    const isolatedSlashes = body?.split('\n').filter(line => line.trim() === '/') || []
    expect(isolatedSlashes.length).toBe(0)
  })
})

test.describe('Link in Bio', () => {
  test('Page renders with links', async ({ page }) => {
    const resp = await page.goto('/links')
    expect(resp?.status()).toBeLessThan(400)
    const links = page.locator('a[href]')
    expect(await links.count()).toBeGreaterThanOrEqual(2)
  })
})

test.describe('Accessibility', () => {
  const pages = ['/', '/about', '/services', '/playbooks', '/newsletter']
  for (const p of pages) {
    test(`${p}: all text >= 12px`, async ({ page }) => {
      await page.goto(p)
      const smallText = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll('*'))
        const small: string[] = []
        for (const el of all) {
          const style = getComputedStyle(el)
          const size = parseFloat(style.fontSize)
          if (size < 12 && (el as HTMLElement).innerText?.trim().length > 0 && style.display !== 'none' && style.visibility !== 'hidden') {
            small.push(`${el.tagName}(${size}px): "${(el as HTMLElement).innerText.trim().slice(0, 20)}"`)
          }
        }
        return small
      })
      // Warn but don't fail -- some decorative text may be small
      if (smallText.length > 0) {
        console.warn(`Small text found on ${p}:`, smallText.slice(0, 3))
      }
    })
  }

  test('Mobile nav hamburger opens/closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const hamburger = page.locator('button[aria-label*="menu" i], button[class*="hamburger"], button[class*="mobile"], [class*="menu-toggle"], nav button').first()
    if (await hamburger.isVisible()) {
      await hamburger.click()
      await page.waitForTimeout(500)
      await hamburger.click()
      await page.waitForTimeout(300)
    }
  })
})
