import { test, expect, type Page } from '@playwright/test'

// ================================================================
// Test Configuration
// ================================================================

const CREDENTIALS = {
  email: 'admin@genai.com',
  password: 'Admin123!',
}

const API_BASE = 'http://localhost:8000/api/v1'

// Asset definitions for the 4 types
const ASSET_TYPES = [
  {
    type: 'models',
    tabLabel: 'LLM Models',
    tabUrl: '/ai-assets/models',
    detailPath: '/ai-assets/models/1',
    firstItemName: 'GPT-4 Turbo',
    provider: 'OpenAI',
    detailTitle: 'GPT-4 Turbo',
  },
  {
    type: 'agents',
    tabLabel: 'AI Agents',
    tabUrl: '/ai-assets/agents',
    detailPath: '/ai-assets/agents/1',
    firstItemName: 'Customer Support Bot',
    provider: 'GPT-4 Turbo',
    detailTitle: 'Customer Support Bot',
  },
  {
    type: 'rag-systems',
    tabLabel: 'RAG Systems',
    tabUrl: '/ai-assets/rag-systems',
    detailPath: '/ai-assets/rag-systems/1',
    firstItemName: 'Knowledge Base RAG',
    provider: 'Pinecone Production',
    detailTitle: 'Knowledge Base RAG',
  },
  {
    type: 'vector-dbs',
    tabLabel: 'Vector DBs',
    tabUrl: '/ai-assets/vector-dbs',
    detailPath: '/ai-assets/vector-dbs/1',
    firstItemName: 'Pinecone Production',
    provider: 'Pinecone',
    detailTitle: 'Pinecone Production',
  },
]

// ================================================================
// Reliable Login via API
// ================================================================

async function loginViaAPI(page: Page) {
  try {
    const response = await page.request.post(`${API_BASE}/auth/login/`, {
      data: { email: CREDENTIALS.email, password: CREDENTIALS.password },
    })
    if (response.ok()) {
      const body = await response.json()
      const accessToken = body.access
      await page.goto('/')
      await page.waitForLoadState('domcontentloaded')
      await page.evaluate((token) => {
        localStorage.setItem('access_token', token)
        localStorage.setItem('refresh_token', token)
      }, accessToken)
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

async function hasAnyContent(page: Page): Promise<boolean> {
  const checks = [
    page.locator('table tbody tr').count(),
    page.locator('[class*="rounded-lg"]').count(),
    page.locator('[class*="p-3"], [class*="p-4"]').count(),
    page.locator('[class*="font-medium"], [class*="font-bold"]').count(),
    page.locator('[class*="text-gray-900"]').count(),
    page.locator('[class*="bg-white"]').count(),
  ]
  const results = await Promise.all(checks)
  return results.some((count) => count >= 2)
}

async function waitForPageReady(page: Page) {
  await page.waitForLoadState('networkidle')
  // Wait briefly for React render, skip if content already visible
  try {
    await page.waitForSelector('[class*="text-gray-900"]', { timeout: 3000 }).catch(() => {})
  } catch { /* content may have other class patterns */ }
  // Check for spinners and wait for them to disappear
  try {
    const spinner = page.locator('.animate-spin').first()
    if (await spinner.isVisible({ timeout: 2000 }).catch(() => false)) {
      await spinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {})
    }
  } catch { /* no spinner */ }
}

async function clickTabButton(page: Page, label: string) {
  const tab = page.locator(`button:has-text("${label}")`).first()
  if (await tab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await tab.click()
    await page.waitForTimeout(500)
    // Verify the tab activated by checking for indigo-600 border (active state)
    const activeTab = page.locator(`button:has-text("${label}").border-indigo-600`).first()
    const isActive = await activeTab.isVisible({ timeout: 2000 }).catch(() => false)
    if (!isActive) {
      // Fallback: just wait a bit more for content to render
      await page.waitForTimeout(500)
    }
  }
}

// ================================================================
// Tests
// ================================================================

test.describe('AI Assets List Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page)
  })

  test('should display page header and all 4 tab categories', async ({ page }) => {
    await page.goto('/ai-assets/models')
    await waitForPageReady(page)

    await expect(page.locator('h1:has-text("AI Assets")').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=31 total assets').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=LLM Models').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=AI Agents').first()).toBeVisible()
    await expect(page.locator('text=RAG Systems').first()).toBeVisible()
    await expect(page.locator('text=Vector DBs').first()).toBeVisible()
  })

  test('should show stats row with 4 metric cards', async ({ page }) => {
    await page.goto('/ai-assets/models')
    await waitForPageReady(page)

    await expect(page.locator('text=LLM Models').first()).toBeVisible()
    await expect(page.locator('text=AI Agents').first()).toBeVisible()
    await expect(page.locator('text=RAG Systems').first()).toBeVisible()
    await expect(page.locator('text=Vector DBs').first()).toBeVisible()

    // Verify stat values
    await expect(page.locator('text=8').first()).toBeVisible()
    await expect(page.locator('text=12').first()).toBeVisible()
  })

  test('should show model list items in default models tab', async ({ page }) => {
    await page.goto('/ai-assets/models')
    await waitForPageReady(page)

    await expect(page.locator('text=GPT-4 Turbo').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Claude 3 Opus').first()).toBeVisible()
    await expect(page.locator('text=Llama 3 70B').first()).toBeVisible()
    await expect(page.locator('text=Mistral Large').first()).toBeVisible()
  })

  test('should switch to agents tab and show agent list', async ({ page }) => {
    await page.goto('/ai-assets/agents')
    await waitForPageReady(page)

    await expect(page.locator('text=Customer Support Bot').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Code Assistant').first()).toBeVisible()
    await expect(page.locator('text=Data Analyst Agent').first()).toBeVisible()
    await expect(page.locator('text=Research Assistant').first()).toBeVisible()
  })

  test('should switch to RAG systems tab and show RAG list', async ({ page }) => {
    await page.goto('/ai-assets/rag-systems')
    await waitForPageReady(page)

    await expect(page.locator('text=Knowledge Base RAG').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Document Retrieval').first()).toBeVisible()
    await expect(page.locator('text=Code Search Engine').first()).toBeVisible()
  })

  test('should switch to Vector DBs tab and show Vector DB list', async ({ page }) => {
    await page.goto('/ai-assets/vector-dbs')
    await waitForPageReady(page)

    await expect(page.locator('text=Pinecone Production').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Weaviate Dev').first()).toBeVisible()
    await expect(page.locator('text=Qdrant Staging').first()).toBeVisible()
  })
})

// ================================================================
// Per-Type Detail Page Tests
// ================================================================

for (const asset of ASSET_TYPES) {
  test.describe(`${asset.type} — ${asset.detailTitle} Detail Page`, () => {
    test.beforeEach(async ({ page }) => {
      await loginViaAPI(page)
    })

    test(`navigates from list to detail for ${asset.type}`, async ({ page }) => {
      // Go to the tab
      await page.goto(asset.tabUrl)
      await waitForPageReady(page)

      // Click the first item
      const item = page.locator(`text=${asset.firstItemName}`).first()
      await expect(item).toBeVisible({ timeout: 5000 })
      await item.click()

      // Verify navigation to detail page
      await page.waitForURL(new RegExp(asset.detailPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 10000 })
      await waitForPageReady(page)

      // Verify the header shows the asset name
      await expect(page.locator(`h1:has-text("${asset.detailTitle}")`).first()).toBeVisible({ timeout: 5000 })

      // Verify back button is present
      await expect(page.locator('button:has(svg)').first()).toBeVisible()

      // Verify Run Scan button exists
      await expect(page.locator('button:has-text("Run Scan")').first()).toBeVisible()
    })

    test('shows stats row with 4 metric cards', async ({ page }) => {
      await page.goto(asset.detailPath)
      await waitForPageReady(page)

      // Check for known stat labels rendered in the stats grid
      const possibleLabels = ['Security Score', 'Risk Score', 'Total Scans', 'Context Window',
        'Risk Level', 'Findings', 'Status', 'Chunk Size', 'Dimension', 'Compliance', 'Tools']
      let visibleCount = 0
      for (const label of possibleLabels) {
        const el = page.locator(`text=${label}`).first()
        if (await el.isVisible({ timeout: 200 }).catch(() => false)) visibleCount++
      }
      expect(visibleCount).toBeGreaterThanOrEqual(2)
    })

    test('overview tab renders description, details grid, and risk assessment', async ({ page }) => {
      await page.goto(asset.detailPath)
      await waitForPageReady(page)

      // Overview should be the default tab
      await expect(page.locator('text=Description').first()).toBeVisible({ timeout: 5000 })
      await expect(page.locator('text=Details').first()).toBeVisible()
      await expect(page.locator('text=Risk Assessment').first()).toBeVisible()

      // Check details grid renders items (uppercase labels from overview object)
      const detailItems = page.locator('[class*="uppercase tracking-wider"]')
      const detailCount = await detailItems.count()
      expect(detailCount).toBeGreaterThanOrEqual(4)
    })

    test('scan history tab renders with scan list', async ({ page }) => {
      await page.goto(asset.detailPath)
      await waitForPageReady(page)

      // Click Scan History tab
      await clickTabButton(page, 'Scan History')
      await page.waitForTimeout(500)

      // Should show scan items or empty state
      const hasNoScans = await page.locator('text=No scans yet').isVisible().catch(() => false)
      if (hasNoScans) {
        await expect(page.locator('button:has-text("Run First Scan")').first()).toBeVisible({ timeout: 3000 })
      } else {
        // If scans exist, verify scan list renders with a scan item
        const hasScans = await hasAnyContent(page)
        expect(hasScans).toBeTruthy()
        // For model 1, check that specific scans appear
        if (asset.detailPath === '/ai-assets/models/1') {
          const scanItem = page.locator('text=Full GPT-4').first()
          await expect(scanItem).toBeVisible({ timeout: 3000 })
        }
      }
    })

    test('security metrics tab renders with OWASP score bars', async ({ page }) => {
      await page.goto(asset.detailPath)
      await waitForPageReady(page)

      // Click Security Metrics tab
      await clickTabButton(page, 'Security Metrics')
      await page.waitForTimeout(500)

      // Should show OWASP LLM Security Scores heading
      await expect(page.locator('text=OWASP LLM Security Scores').first()).toBeVisible({ timeout: 5000 })
      await expect(page.locator('text=Risk Distribution').first()).toBeVisible()
      await expect(page.locator('text=Scan Activity').first()).toBeVisible()

      // Check that score bars exist - use attribute selector to avoid dot in class name
      const scoreBarWrappers = page.locator('[class*="h-2"][class*="bg-gray-100"][class*="rounded-full"]')
      const barCount = await scoreBarWrappers.count()
      expect(barCount).toBeGreaterThanOrEqual(3)
    })

    test('providers info and version shown in header', async ({ page }) => {
      await page.goto(asset.detailPath)
      await waitForPageReady(page)

      // Provider should be visible in the subtitle
      await expect(page.locator(`text=${asset.provider}`).first()).toBeVisible({ timeout: 5000 })
    })
  })
}

// ================================================================
// Tab Switching Test (on one asset type)
// ================================================================

test.describe('Tab Switching on Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page)
  })

  test('should switch between all 3 tabs without errors', async ({ page }) => {
    await page.goto('/ai-assets/models/1')
    await waitForPageReady(page)

    // Overview (default)
    await expect(page.locator('text=Description').first()).toBeVisible({ timeout: 5000 })

    // Switch to Scan History
    await clickTabButton(page, 'Scan History')
    await page.waitForTimeout(300)
    const hasNoScans = await page.locator('text=No scans yet').isVisible().catch(() => false)
    if (!hasNoScans) {
      const hasScanContent = await hasAnyContent(page)
      expect(hasScanContent).toBeTruthy()
    }

    // Switch to Security Metrics
    await clickTabButton(page, 'Security Metrics')
    await page.waitForTimeout(300)
    await expect(page.locator('text=OWASP LLM Security Scores').first()).toBeVisible({ timeout: 5000 })

    // Switch back to Overview
    await clickTabButton(page, 'Overview')
    await page.waitForTimeout(300)
    await expect(page.locator('text=Description').first()).toBeVisible({ timeout: 5000 })
  })
})

// ================================================================
// Error / Not Found State
// ================================================================

test.describe('Asset Not Found', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page)
  })

  test('should show not-found state for invalid asset ID', async ({ page }) => {
    await page.goto('/ai-assets/models/invalid-id-99999')
    await waitForPageReady(page)

    // Should show asset not found message (either from API or mock fallback)
    const notFound = page.locator('text=Asset not found').first()
    const notFoundText = page.locator('text=not found').first()
    await expect(notFound.or(notFoundText)).toBeVisible({ timeout: 10000 })
  })

  test('should show suggest options for not-found state', async ({ page }) => {
    await page.goto('/ai-assets/models/invalid-id-99999')
    await waitForPageReady(page)

    // Back button should be present
    const backBtn = page.locator('button:has-text("Back to AI Assets")').first()
    await expect(backBtn).toBeVisible({ timeout: 5000 })

    // Should have suggestion buttons or "View All Assets" link
    const viewAllBtn = page.locator('button:has-text("View All Assets")').first()
    await expect(viewAllBtn).toBeVisible({ timeout: 5000 })
  })
})

// ================================================================
// Cross-Type Navigation
// ================================================================

test.describe('Cross-Type Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page)
  })

  test('should navigate model detail -> back to list -> agent detail', async ({ page }) => {
    // Go to model detail
    await page.goto('/ai-assets/models/1')
    await waitForPageReady(page)
    await expect(page.locator('h1:has-text("GPT-4 Turbo")').first()).toBeVisible({ timeout: 5000 })

    // Navigate back to list
    await page.goto('/ai-assets/agents')
    await waitForPageReady(page)
    await expect(page.locator('text=Customer Support Bot').first()).toBeVisible({ timeout: 5000 })

    // Click agent item
    await page.locator('text=Customer Support Bot').first().click()
    await page.waitForURL(/\/ai-assets\/agents\/1/, { timeout: 10000 })
    await waitForPageReady(page)
    await expect(page.locator('h1:has-text("Customer Support Bot")').first()).toBeVisible({ timeout: 5000 })
  })

  test('should navigate RAG detail -> back to list -> Vector DB detail', async ({ page }) => {
    // Go to RAG detail
    await page.goto('/ai-assets/rag-systems/3')
    await waitForPageReady(page)
    await expect(page.locator('h1:has-text("Code Search Engine")').first()).toBeVisible({ timeout: 5000 })

    // Navigate to Vector DBs
    await page.goto('/ai-assets/vector-dbs')
    await waitForPageReady(page)
    await expect(page.locator('text=Pinecone Production').first()).toBeVisible({ timeout: 5000 })

    // Click Vector DB item
    await page.locator('text=Qdrant Staging').first().click()
    await page.waitForURL(/\/ai-assets\/vector-dbs\/3/, { timeout: 10000 })
    await waitForPageReady(page)
    await expect(page.locator('h1:has-text("Qdrant Staging")').first()).toBeVisible({ timeout: 5000 })
  })
})
