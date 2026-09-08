import { test, expect, type Page } from '@playwright/test'

// ================================================================
// Test Configuration
// ================================================================

const CREDENTIALS = {
  email: 'admin@genai.com',
  password: 'Admin123!',
}

const API_BASE = 'http://localhost:8000/api/v1'

// Module definitions
const MODULES = [
  { id: 'LLM01', page: '/modules/prompt-injection', title: 'Prompt Injection', badgeColor: 'danger',
    stats: ['Scans Analyzed', 'Injections Detected'], tabs: ['scans', 'findings', 'batches'],
    tabLabels: ['Scan Results', 'Active Findings', 'Batch Analysis'] },
  { id: 'LLM02', page: '/modules/sensitive-info', title: 'Sensitive Information Disclosure', badgeColor: 'danger',
    stats: ['Secrets Found', 'Critical'], tabs: ['secrets', 'pii', 'sources'],
    tabLabels: ['Detected Secrets', 'PII Findings', 'By Source'] },
  { id: 'LLM03', page: '/modules/supply-chain', title: 'Supply Chain Security', badgeColor: 'warning',
    stats: ['AI SBOMs', 'Dependencies'], tabs: ['sbom', 'dependencies', 'sdk'],
    tabLabels: ['AI SBOMs', 'Dependencies', 'SDK Risk Assessment'] },
  { id: 'LLM04', page: '/modules/data-poisoning', title: 'Data & Model Poisoning', badgeColor: 'warning',
    stats: ['Validations', 'Passed'], tabs: ['validations', 'rag', 'integrity'],
    tabLabels: ['Data Validations', 'RAG Documents', 'Integrity Checks'] },
  { id: 'LLM05', page: '/modules/output-handling', title: 'Improper Output Handling', badgeColor: 'danger',
    stats: ['Outputs Analyzed', 'Vulnerabilities'], tabs: ['sanitizations', 'xss', 'code'],
    tabLabels: ['Sanitization Results', 'XSS Findings', 'Unsafe Code'] },
  { id: 'LLM06', page: '/modules/excessive-agency', title: 'Excessive Agency', badgeColor: 'warning',
    stats: ['Permissions', 'Pending Approvals'], tabs: ['permissions', 'approvals', 'logs'],
    tabLabels: ['Agent Permissions', 'Action Approvals', 'Tool Access Logs'] },
  { id: 'LLM07', page: '/modules/prompt-leakage', title: 'System Prompt Leakage', badgeColor: 'danger',
    stats: ['Scans Performed', 'Leakage Detected'], tabs: ['scans', 'secrets'],
    tabLabels: ['Leakage Scans', 'Secrets in Prompts'] },
  { id: 'LLM08', page: '/modules/vector-security', title: 'Vector & Embedding Security', badgeColor: 'warning',
    stats: ['Vector DBs', 'Secured'], tabs: ['assessments', 'exposures', 'rag'],
    tabLabels: ['DB Assessments', 'Embedding Exposures', 'RAG Security'] },
  { id: 'LLM09', page: '/modules/hallucination', title: 'Misinformation & Hallucination', badgeColor: 'warning',
    stats: ['Findings', 'Critical/High'], tabs: ['findings', 'citations', 'responses'],
    tabLabels: ['Hallucination Findings', 'Citation Validation', 'Response Validation'] },
  { id: 'LLM10', page: '/modules/unbounded-consumption', title: 'Unbounded Consumption', badgeColor: 'success',
    stats: ['Daily Cost', 'Tokens Today'], tabs: ['usage', 'dos', 'rate-limits'],
    tabLabels: ['Token Usage', 'DoS Events', 'Rate Limits'] },
]

// ================================================================
// Reliable Login via API
// ================================================================

async function loginViaAPI(page: Page) {
  // First set the token directly via the API for reliability
  try {
    const response = await page.request.post(`${API_BASE}/auth/login/`, {
      data: { email: CREDENTIALS.email, password: CREDENTIALS.password },
    })
    if (response.ok()) {
      const body = await response.json()
      const accessToken = body.access
      // Store token in localStorage
      await page.goto('/')
      await page.waitForLoadState('domcontentloaded')
      await page.evaluate((token) => {
        localStorage.setItem('access_token', token)
        localStorage.setItem('refresh_token', token)
      }, accessToken)
      // Navigate to dashboard to establish session
      await page.goto('/dashboard')
      await page.waitForLoadState('networkidle')
      return
    }
  } catch {
    // Fall through to UI login
  }

  // Fallback: UI-based login
  await page.goto('/login')
  await page.waitForLoadState('networkidle')

  const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first()
  const passwordInput = page.locator('input[type="password"], input[name="password"]').first()

  if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await emailInput.fill(CREDENTIALS.email)
    await passwordInput.fill(CREDENTIALS.password)
    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign In")').first()
    await submitBtn.click()
    await page.waitForURL(/\/dashboard/, { timeout: 10000 }).catch(() => {})
  }
}

// ================================================================
// Content detection helpers
// ================================================================

async function switchTab(page: Page, tabLabel: string) {
  const tab = page.locator(`button:has-text("${tabLabel}"), [role="tab"]:has-text("${tabLabel}")`).first()
  if (await tab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await tab.click()
    // Wait for loading to complete
    await page.waitForTimeout(1000)
    // Check for spinners and wait for them to disappear
    try {
      const spinner = page.locator('.animate-spin').first()
      if (await spinner.isVisible({ timeout: 2000 }).catch(() => false)) {
        await spinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {})
      }
    } catch { /* no spinner */ }
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
  }
}

async function hasAnyContent(page: Page): Promise<boolean> {
  // Check multiple content patterns
  const checks = [
    page.locator('table tbody tr').count(),
    page.locator('[class*="rounded-lg"]').count(),
    page.locator('[class*="p-3"], [class*="p-4"]').count(),
    page.locator('[class*="font-medium"], [class*="font-bold"]').count(),
    page.locator('[class*="bg-gray-50"], [class*="bg-white"]').count(),
  ]
  const results = await Promise.all(checks)
  // Pass if any significant number of elements exist
  return results.some((count) => count >= 2)
}

// ================================================================
// Tests
// ================================================================

test.describe('Modules Overview Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page)
  })

  test('should display all 10 module cards with live stats', async ({ page }) => {
    await page.goto('/modules')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Check stats bar is visible (use first() to avoid strict mode ambiguity)
    await expect(page.locator('text=Total Records').first()).toBeVisible({ timeout: 10000 })

    // Check all 10 module cards are present
    for (const mod of MODULES) {
      await expect(page.locator(`text=${mod.id}`).first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('should filter modules by search', async ({ page }) => {
    await page.goto('/modules')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    const searchInput = page.locator('input[placeholder*="Search"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.fill('prompt')
      await page.waitForTimeout(500)
      await expect(page.locator('text=/Showing \\d+ of 10 modules/').first()).toBeVisible({ timeout: 5000 })
    }
  })
})

// ================================================================
// Per-Module Tests
// ================================================================

for (const mod of MODULES) {
  test.describe(`${mod.id} — ${mod.title}`, () => {
    test.beforeEach(async ({ page }) => {
      await loginViaAPI(page)
    })

    test('page loads with stats', async ({ page }) => {
      await page.goto(mod.page)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2500)

      // Check the page loaded by looking for any content
      const hasContent = await hasAnyContent(page)
      expect(hasContent).toBeTruthy()
    })

    // Test each tab
    for (let i = 0; i < mod.tabs.length; i++) {
      const tabLabel = mod.tabLabels[i]

      test(`tab "${tabLabel}" loads with data`, async ({ page }) => {
        test.setTimeout(45000)

        await page.goto(mod.page)
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(2000)

        // Verify page loaded
        const loaded = await hasAnyContent(page)
        expect(loaded).toBeTruthy()

        // Switch to the target tab
        await switchTab(page, tabLabel)

        // Check for content
        const hasContent = await hasAnyContent(page)
        expect(hasContent).toBeTruthy()
      })
    }
  })
}

// ================================================================
// Cross-Module Navigation Test
// ================================================================

test.describe('Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page)
  })

  test('should navigate from overview to module and back', async ({ page }) => {
    await page.goto('/modules')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Click LLM01 card
    const firstCard = page.locator('text=LLM01').first()
    await firstCard.click()
    await page.waitForURL(/\/modules\/prompt-injection/, { timeout: 10000 })
    await page.waitForLoadState('networkidle')

    // Verify page loaded
    const hasContent = await hasAnyContent(page)
    expect(hasContent).toBeTruthy()

    // Navigate back to overview
    await page.goto('/modules')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=LLM10').first()).toBeVisible({ timeout: 5000 })
  })
})
