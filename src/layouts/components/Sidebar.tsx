import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Brain,
  Shield,
  ShieldCheck,
  AlertCircle,
  ClipboardCheck,
  FileText,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield as ShieldLogo,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import { APP_NAME } from '@/utils/constants'
import type { ReactNode } from 'react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: ReactNode
  path: string
  children?: MenuItem[]
}

// Sidebar menu items matching the conversion plan design
const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard' },
  { id: 'organizations', label: 'Organizations', icon: <Building2 className="h-5 w-5" />, path: '/organizations' },
  { id: 'projects', label: 'Projects', icon: <FolderKanban className="h-5 w-5" />, path: '/projects' },
  {
    id: 'ai-assets', label: 'AI Assets', icon: <Brain className="h-5 w-5" />, path: '/ai-assets',
    children: [
      { id: 'ai-models', label: 'LLM Models', icon: null, path: '/ai-assets/models' },
      { id: 'ai-agents', label: 'AI Agents', icon: null, path: '/ai-assets/agents' },
      { id: 'rag-systems', label: 'RAG Systems', icon: null, path: '/ai-assets/rag-systems' },
      { id: 'vector-dbs', label: 'Vector DBs', icon: null, path: '/ai-assets/vector-dbs' },
    ],
  },
  {
    id: 'scans', label: 'AI Security Scans', icon: <Shield className="h-5 w-5" />, path: '/scans',
    children: [
      { id: 'all-scans', label: 'All Scans', icon: null, path: '/scans' },
      { id: 'quick-scan', label: 'Quick Scan', icon: null, path: '/scans/quick' },
    ],
  },
  {
    id: 'modules', label: 'OWASP Modules', icon: <ShieldCheck className="h-5 w-5" />, path: '/modules',
    children: [
      { id: 'llm01', label: 'LLM01 Prompt Injection', icon: null, path: '/modules/prompt-injection' },
      { id: 'llm02', label: 'LLM02 Sensitive Info', icon: null, path: '/modules/sensitive-info' },
      { id: 'llm03', label: 'LLM03 Supply Chain', icon: null, path: '/modules/supply-chain' },
      { id: 'llm04', label: 'LLM04 Data Poisoning', icon: null, path: '/modules/data-poisoning' },
      { id: 'llm05', label: 'LLM05 Output Handling', icon: null, path: '/modules/output-handling' },
      { id: 'llm06', label: 'LLM06 Excessive Agency', icon: null, path: '/modules/excessive-agency' },
      { id: 'llm07', label: 'LLM07 Prompt Leakage', icon: null, path: '/modules/prompt-leakage' },
      { id: 'llm08', label: 'LLM08 Vector Security', icon: null, path: '/modules/vector-security' },
      { id: 'llm09', label: 'LLM09 Hallucination', icon: null, path: '/modules/hallucination' },
      { id: 'llm10', label: 'LLM10 Unbounded Consumption', icon: null, path: '/modules/unbounded-consumption' },
      { id: 'pattern-explorer', label: 'Pattern Explorer', icon: null, path: '/modules/pattern-explorer' },
    ],
  },
  { id: 'findings', label: 'AI Findings', icon: <AlertCircle className="h-5 w-5" />, path: '/findings' },
  { id: 'compliance', label: 'Compliance', icon: <ClipboardCheck className="h-5 w-5" />, path: '/compliance' },
  { id: 'reports', label: 'Reports', icon: <FileText className="h-5 w-5" />, path: '/reports' },
  { id: 'agent-center', label: 'AI Agent Center', icon: <Bot className="h-5 w-5" />, path: '/agent-center' },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
]

function SidebarMenuItem({
  item,
  collapsed,
  depth = 0,
}: {
  item: MenuItem
  collapsed: boolean
  depth?: number
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  const isExpanded = location.pathname.startsWith(item.path)

  return (
    <div>
      <button
        onClick={() => navigate(item.path)}
        className={cn(
          'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          collapsed && 'justify-center px-2',
          isActive
            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        )}
        title={collapsed ? item.label : undefined}
      >
        <span className={cn('shrink-0', isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500')}>
          {item.icon}
        </span>
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.label}</span>
            {item.children && (
              <ChevronRight
                className={cn(
                  'h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform',
                  isExpanded && 'rotate-90'
                )}
              />
            )}
          </>
        )}
      </button>

      {/* Children (sub-menu) */}
      {!collapsed && item.children && isExpanded && (
        <div className="ml-8 mt-1 space-y-0.5">
          {item.children.map((child) => (
            <button
              key={child.id}
              onClick={() => navigate(child.path)}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors',
                location.pathname === child.path
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              )}
            >
              <span className="h-1 w-1 rounded-full bg-current opacity-40" />
              {child.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'h-screen bg-white dark:bg-[var(--color-surface)] border-r border-gray-200 dark:border-[var(--color-border)] flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-200 dark:border-[var(--color-border)]">
        <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <ShieldLogo className="h-5 w-5 text-white dark:text-[#ffffff]" />
        </div>
        {!collapsed && (
          <div className="truncate">
            <p className="text-sm font-bold text-gray-900 truncate">GenAI</p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Security Platform</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.id} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-gray-200 dark:border-[var(--color-border)]">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-[var(--color-text)] hover:bg-gray-100 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  )
}
