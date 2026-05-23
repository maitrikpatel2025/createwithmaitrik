/**
 * Validation Tests for Payload CMS Admin UI Polish
 *
 * Tests that the admin UI customization is correctly implemented:
 * - Files exist and are properly structured
 * - CSS imports are in correct order
 * - Configuration is correct
 * - Custom components are properly registered
 * - Design tokens are mapped correctly
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Test utilities
let testResults: { name: string; status: 'PASS' | 'FAIL'; message: string }[] = []

function test(name: string, fn: () => void | Promise<void>) {
  try {
    fn()
    testResults.push({ name, status: 'PASS', message: 'Test passed' })
    console.log(`✓ ${name}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    testResults.push({ name, status: 'FAIL', message })
    console.error(`✗ ${name}`)
    console.error(`  ${message}`)
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

// Root directory
const ROOT = process.cwd()

// ============================================================
// Test Suite
// ============================================================

console.log('🧪 Running Admin UI Polish Validation Tests\n')

// Test 1: Admin CSS file exists and has correct structure
test('Admin CSS file exists at src/app/(payload)/admin.css', () => {
  const cssPath = join(ROOT, 'src/app/(payload)/admin.css')
  assert(existsSync(cssPath), 'admin.css file does not exist')

  const cssContent = readFileSync(cssPath, 'utf-8')

  // Check for key CSS variable mappings
  assert(cssContent.includes('--theme-bg'), 'Missing --theme-bg variable')
  assert(cssContent.includes('--cwm-white'), 'Missing cwm color token mapping')
  assert(cssContent.includes('--cwm-blue'), 'Missing cwm-blue token mapping')
  assert(cssContent.includes('--cwm-graphite'), 'Missing cwm-graphite token mapping')

  // Check for typography overrides
  assert(cssContent.includes('--font-body'), 'Missing font-body override')
  assert(cssContent.includes('--font-mono'), 'Missing font-mono override')
  assert(cssContent.includes('--font-display'), 'Missing font-display variable')
  assert(cssContent.includes('Space Grotesk'), 'Missing Space Grotesk font family')
  assert(cssContent.includes('Inter'), 'Missing Inter font family')
  assert(cssContent.includes('JetBrains Mono'), 'Missing JetBrains Mono font family')

  // Check for component-specific styles
  assert(cssContent.includes('.nav'), 'Missing nav styling')
  assert(cssContent.includes('.btn'), 'Missing button styling')
  assert(cssContent.includes('input[type="text"]'), 'Missing input styling')
  assert(cssContent.includes('.field-label'), 'Missing field label styling')
})

// Test 2: Layout file correctly imports admin CSS
test('Layout imports admin CSS in correct order', () => {
  const layoutPath = join(ROOT, 'src/app/(payload)/layout.tsx')
  assert(existsSync(layoutPath), 'layout.tsx file does not exist')

  const layoutContent = readFileSync(layoutPath, 'utf-8')

  // Check imports exist
  assert(layoutContent.includes("import '@payloadcms/next/css'"),
    'Missing Payload CSS import')
  assert(layoutContent.includes("import './admin.css'"),
    'Missing admin.css import')

  // Check import order (admin.css should come after Payload CSS)
  const payloadCssIndex = layoutContent.indexOf("import '@payloadcms/next/css'")
  const adminCssIndex = layoutContent.indexOf("import './admin.css'")

  assert(payloadCssIndex > -1 && adminCssIndex > -1,
    'CSS imports not found')
  assert(adminCssIndex > payloadCssIndex,
    'admin.css must be imported after @payloadcms/next/css for overrides to work')
})

// Test 3: Logo component exists and is properly structured
test('Logo component exists and uses correct styling', () => {
  const logoPath = join(ROOT, 'src/components/admin/Logo.tsx')
  assert(existsSync(logoPath), 'Logo.tsx file does not exist')

  const logoContent = readFileSync(logoPath, 'utf-8')

  // Check it's a client component
  assert(logoContent.includes("'use client'"),
    'Logo must be a client component')

  // Check it uses the display font
  assert(logoContent.includes('var(--font-display)'),
    'Logo should use --font-display CSS variable')

  // Check it exports default
  assert(logoContent.includes('export default'),
    'Logo must have default export')

  // Check for brand elements
  assert(logoContent.includes('/'),
    'Logo should include the "/" brand symbol')
  assert(logoContent.includes('Maitrik Patel'),
    'Logo should include brand name')
})

// Test 4: Icon component exists and is properly structured
test('Icon component exists and uses correct styling', () => {
  const iconPath = join(ROOT, 'src/components/admin/Icon.tsx')
  assert(existsSync(iconPath), 'Icon.tsx file does not exist')

  const iconContent = readFileSync(iconPath, 'utf-8')

  // Check it's a client component
  assert(iconContent.includes("'use client'"),
    'Icon must be a client component')

  // Check it uses the display font
  assert(iconContent.includes('var(--font-display)'),
    'Icon should use --font-display CSS variable')

  // Check it exports default
  assert(iconContent.includes('export default'),
    'Icon must have default export')

  // Check for brand symbol
  assert(iconContent.includes('/'),
    'Icon should include the "/" brand symbol')
})

// Test 5: Payload config references custom components
test('Payload config correctly references custom components', () => {
  const configPath = join(ROOT, 'src/payload.config.ts')
  assert(existsSync(configPath), 'payload.config.ts file does not exist')

  const configContent = readFileSync(configPath, 'utf-8')

  // Check admin section exists
  assert(configContent.includes('admin:'),
    'Missing admin configuration')

  // Check components.graphics section exists
  assert(configContent.includes('components:'),
    'Missing components configuration')
  assert(configContent.includes('graphics:'),
    'Missing graphics configuration')

  // Check Logo and Icon references
  assert(configContent.includes('Logo:'),
    'Missing Logo component reference')
  assert(configContent.includes('Icon:'),
    'Missing Icon component reference')

  // Check paths are correct
  assert(configContent.includes('/src/components/admin/Logo.tsx'),
    'Logo path is incorrect')
  assert(configContent.includes('/src/components/admin/Icon.tsx'),
    'Icon path is incorrect')

  // Check for #default export syntax
  assert(configContent.includes('#default'),
    'Component references should use #default syntax')

  // Check theme is set to light
  assert(configContent.includes("theme: 'light'"),
    'Theme should be set to light mode')
})

// Test 6: Design token mapping is comprehensive
test('Admin CSS maps all critical design tokens', () => {
  const cssPath = join(ROOT, 'src/app/(payload)/admin.css')
  const cssContent = readFileSync(cssPath, 'utf-8')

  // Color tokens
  const requiredColors = [
    '--theme-bg',
    '--theme-text',
    '--theme-elevation-500', // Primary action color
    '--theme-success-500',
    '--theme-warning-500',
    '--theme-error-500',
  ]

  requiredColors.forEach(token => {
    assert(cssContent.includes(token), `Missing required color token: ${token}`)
  })

  // Border radius tokens
  const requiredRadii = [
    '--border-radius-sm',
    '--border-radius',
    '--border-radius-lg',
  ]

  requiredRadii.forEach(token => {
    assert(cssContent.includes(token), `Missing required radius token: ${token}`)
  })

  // Shadow tokens
  const requiredShadows = [
    '--shadow-sm',
    '--shadow-md',
    '--shadow-lg',
  ]

  requiredShadows.forEach(token => {
    assert(cssContent.includes(token), `Missing required shadow token: ${token}`)
  })
})

// Test 7: Interactive states use correct transitions
test('Interactive elements have proper transition styles', () => {
  const cssPath = join(ROOT, 'src/app/(payload)/admin.css')
  const cssContent = readFileSync(cssPath, 'utf-8')

  // Check for transition definitions
  assert(cssContent.includes('transition:'),
    'Missing transition definitions')

  // Check for frontend transition tokens
  assert(cssContent.includes('var(--dur-fast)'),
    'Should use --dur-fast transition duration token')
  assert(cssContent.includes('var(--ease-standard)'),
    'Should use --ease-standard easing token')

  // Check button states
  assert(cssContent.includes(':hover'),
    'Missing hover state styles')
  assert(cssContent.includes(':focus'),
    'Missing focus state styles')
  assert(cssContent.includes(':active'),
    'Missing active state styles')
})

// Test 8: Nav bar matches frontend height
test('Navigation bar matches frontend height (60px)', () => {
  const cssPath = join(ROOT, 'src/app/(payload)/admin.css')
  const cssContent = readFileSync(cssPath, 'utf-8')

  // Check for 60px nav height
  assert(cssContent.includes('height: 60px'),
    'Nav should have 60px height to match frontend')

  // Check for backdrop filter (glassmorphism effect)
  assert(cssContent.includes('backdrop-filter'),
    'Nav should have backdrop-filter for glassmorphism')
  assert(cssContent.includes('blur(20px)'),
    'Nav should have blur effect')
})

// Test 9: Globals CSS contains design system
test('Frontend design system exists in globals.css', () => {
  const globalsPath = join(ROOT, 'src/app/globals.css')
  assert(existsSync(globalsPath), 'globals.css file does not exist')

  const globalsContent = readFileSync(globalsPath, 'utf-8')

  // Check for design tokens
  assert(globalsContent.includes('--cwm-white'), 'Missing cwm-white token')
  assert(globalsContent.includes('--cwm-blue'), 'Missing cwm-blue token')
  assert(globalsContent.includes('--cwm-graphite'), 'Missing cwm-graphite token')
  assert(globalsContent.includes('--font-display'), 'Missing font-display token')
  assert(globalsContent.includes('--font-body'), 'Missing font-body token')
  assert(globalsContent.includes('--font-mono'), 'Missing font-mono token')
})

// Test 10: File structure integrity
test('All required files exist in correct locations', () => {
  const requiredFiles = [
    'src/app/(payload)/admin.css',
    'src/app/(payload)/layout.tsx',
    'src/components/admin/Logo.tsx',
    'src/components/admin/Icon.tsx',
    'src/payload.config.ts',
    'src/app/globals.css',
  ]

  requiredFiles.forEach(file => {
    const filePath = join(ROOT, file)
    assert(existsSync(filePath), `Required file missing: ${file}`)
  })
})

// ============================================================
// Print Summary
// ============================================================

console.log('\n' + '='.repeat(60))
console.log('Test Summary')
console.log('='.repeat(60))

const passed = testResults.filter(r => r.status === 'PASS').length
const failed = testResults.filter(r => r.status === 'FAIL').length
const total = testResults.length

console.log(`Total Tests: ${total}`)
console.log(`Passed: ${passed}`)
console.log(`Failed: ${failed}`)

if (failed > 0) {
  console.log('\n❌ FAILED TESTS:')
  testResults
    .filter(r => r.status === 'FAIL')
    .forEach(r => {
      console.log(`  • ${r.name}`)
      console.log(`    ${r.message}`)
    })
  process.exit(1)
} else {
  console.log('\n✅ All tests passed!')
  process.exit(0)
}
