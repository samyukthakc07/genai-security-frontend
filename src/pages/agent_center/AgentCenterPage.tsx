import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Bot, Cpu, MessageSquare, Workflow, Shield, Zap,
   
   
   
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Globe, Video, Music, Code, TrendingUp, ArrowUpRight,
} from 'lucide-react'
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui'
import { cn } from '@/utils/helpers'
import assetService, { type AIAgentData } from '@/services/assetService'

const colorOptions = ['blue', 'green', 'purple', 'orange', 'teal', 'pink'] as const

const colorMap = {
  blue: { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50' },
  green: { bg: 'bg-green-600', text: 'text-green-600', light: 'bg-green-50' },
  purple: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50' },
  orange: { bg: 'bg-orange-600', text: 'text-orange-600', light: 'bg-orange-50' },
  teal: { bg: 'bg-teal-600', text: 'text-teal-600', light: 'bg-teal-50' },
  pink: { bg: 'bg-pink-600', text: 'text-pink-600', light: 'bg-pink-50' },
}

function getIconForAgentType(type: string) {
  if (type === 'autonomous') return <Workflow className="h-5 w-5" />
  if (type === 'assistant') return <MessageSquare className="h-5 w-5" />
  if (type === 'research') return <Globe className="h-5 w-5" />
  return <Bot className="h-5 w-5" />
}

export function AgentCenterPage() {
  const navigate = useNavigate()
  const [agents, setAgents] = useState<AIAgentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    assetService.listAgents()
      .then(setAgents)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading agents...</div>
  }

  const activeCount = agents.filter((a) => a.status === 'active' || a.status === 'running').length
  const uniqueModels = new Set(agents.map(a => typeof a.model === 'string' ? a.model : a.model?.name).filter(Boolean)).size

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AI Agent Center</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">
            Deploy, configure, and monitor your AI agents across the organization
          </p>
        </div>
        <Button>
          <Bot className="h-4 w-4" />
          Create Agent
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Bot className="h-4 w-4" />, label: 'Total Agents', value: agents.length.toString(), color: 'blue' },
          { icon: <Zap className="h-4 w-4" />, label: 'Active', value: activeCount.toString(), color: 'green' },
          { icon: <Cpu className="h-4 w-4" />, label: 'Models Used', value: uniqueModels.toString(), color: 'purple' },
          { icon: <Bot className="h-4 w-4" />, label: 'Configurable', value: agents.length.toString(), color: 'cyan' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={cn(
              'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
              stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              stat.color === 'green' ? 'bg-green-50 text-green-600' :
              stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
              'bg-cyan-50 text-cyan-600'
            )}>{stat.icon}</div>
            <div>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((agent, index) => {
          const colorKey = colorOptions[index % colorOptions.length]
          const c = colorMap[colorKey]
          const modelName = typeof agent.model === 'string' ? agent.model : (agent.model?.name || 'Unknown Model')
          
          return (
            <Card key={agent.id} hover className="transition-all hover:shadow-md cursor-pointer" onClick={() => navigate(`/assets/agents/${agent.id}`)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', c.light, c.text)}>
                    {getIconForAgentType(agent.agent_type)}
                  </div>
                  <Badge variant={
                    agent.status === 'active' ? 'success' :
                    agent.status === 'idle' ? 'warning' : 'default'
                  }>
                    {agent.status_display || agent.status || 'Active'}
                  </Badge>
                </div>

                <h3 className="text-sm font-semibold text-gray-900">{agent.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{agent.description || agent.agent_type_display || 'AI Agent'}</p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">{modelName}</span>
                  <ArrowUpRight className="h-4 w-4 text-gray-300" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
