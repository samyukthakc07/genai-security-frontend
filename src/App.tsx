import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainLayout } from '@/layouts/MainLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { OrganizationListPage } from '@/pages/organizations/OrganizationListPage'
import { OrganizationDetailPage } from '@/pages/organizations/OrganizationDetailPage'
import { ProjectListPage } from '@/pages/projects/ProjectListPage'
import { ProjectDetailPage } from '@/pages/projects/ProjectDetailPage'
import { ModulesOverviewPage } from '@/pages/modules/ModulesOverviewPage'
import { GlobalSearchPage } from '@/pages/GlobalSearchPage'
import { AiAssetsPage } from '@/pages/ai_assets/AiAssetsPage'
import { AssetDetailPage } from '@/pages/ai_assets/AssetDetailPage'
import { ScansPage } from '@/pages/scans/ScansPage'
import { ScanDetailPage } from '@/pages/scans/ScanDetailPage'
import { NewScanPage } from '@/pages/scans/NewScanPage'
import { FindingsPage } from '@/pages/findings/FindingsPage'
import { FindingsDetailPage } from '@/pages/findings/FindingsDetailPage'
import { CompliancePage } from '@/pages/compliance/CompliancePage'
import { ReportsPage } from '@/pages/reports/ReportsPage'
import { AgentCenterPage } from '@/pages/agent_center/AgentCenterPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { PromptInjectionPage } from '@/pages/modules/PromptInjectionPage'
import { PatternExplorerPage } from '@/pages/modules/PatternExplorerPage'
import { SensitiveInfoPage } from '@/pages/modules/SensitiveInfoPage'
import { SupplyChainPage } from '@/pages/modules/SupplyChainPage'
import { DataPoisoningPage } from '@/pages/modules/DataPoisoningPage'
import { OutputHandlingPage } from '@/pages/modules/OutputHandlingPage'
import { ExcessiveAgencyPage } from '@/pages/modules/ExcessiveAgencyPage'
import { PromptLeakagePage } from '@/pages/modules/PromptLeakagePage'
import { VectorSecurityPage } from '@/pages/modules/VectorSecurityPage'
import { HallucinationPage } from '@/pages/modules/HallucinationPage'
import { UnboundedConsumptionPage } from '@/pages/modules/UnboundedConsumptionPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<MainLayout />}>
            {/* Redirect to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Organizations */}
            <Route path="/organizations" element={<OrganizationListPage />} />
            <Route path="/organizations/:id" element={<OrganizationDetailPage />} />

            {/* Projects */}
            <Route path="/projects" element={<ProjectListPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />

            {/* Global Search */}
            <Route path="/search" element={<GlobalSearchPage />} />

            {/* OWASP LLM Modules Overview */}
            <Route path="/modules" element={<ModulesOverviewPage />} />
            <Route path="/modules/prompt-injection" element={<PromptInjectionPage />} />
            <Route path="/modules/pattern-explorer" element={<PatternExplorerPage />} />
            <Route path="/modules/sensitive-info" element={<SensitiveInfoPage />} />
            <Route path="/modules/supply-chain" element={<SupplyChainPage />} />
            <Route path="/modules/data-poisoning" element={<DataPoisoningPage />} />
            <Route path="/modules/output-handling" element={<OutputHandlingPage />} />
            <Route path="/modules/excessive-agency" element={<ExcessiveAgencyPage />} />
            <Route path="/modules/prompt-leakage" element={<PromptLeakagePage />} />
            <Route path="/modules/vector-security" element={<VectorSecurityPage />} />
            <Route path="/modules/hallucination" element={<HallucinationPage />} />
            <Route path="/modules/unbounded-consumption" element={<UnboundedConsumptionPage />} />

            {/* Dedicated pages for sidebar sections */}
            <Route path="/ai-assets" element={<AiAssetsPage />} />
            <Route path="/ai-assets/:type/:id" element={<AssetDetailPage />} />
            <Route path="/ai-assets/*" element={<AiAssetsPage />} />
            
            {/* Alias for /assets routing to fix 404s */}
            <Route path="/assets" element={<Navigate to="/ai-assets" replace />} />
            <Route path="/assets/:type/:id" element={<AssetDetailPage />} />
            <Route path="/assets/*" element={<Navigate to="/ai-assets" replace />} />

            <Route path="/scans" element={<ScansPage />} />
            <Route path="/scans/quick" element={<NewScanPage />} />
            <Route path="/scans/new" element={<NewScanPage />} />
            <Route path="/scans/:id" element={<ScanDetailPage />} />
            <Route path="/scans/*" element={<ScansPage />} />
            <Route path="/findings/:id" element={<FindingsDetailPage />} />
            <Route path="/findings" element={<FindingsPage />} />
            <Route path="/findings/*" element={<FindingsPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/compliance/*" element={<CompliancePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/*" element={<ReportsPage />} />
            <Route path="/agent-center" element={<AgentCenterPage />} />
            <Route path="/agent-center/*" element={<AgentCenterPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/*" element={<SettingsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
