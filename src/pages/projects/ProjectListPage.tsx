import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, FolderKanban } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, EmptyState } from '@/components/ui'
import { useProjectStore } from '@/store/projectSlice'
import { useOrganizationStore } from '@/store/organizationSlice'
import { formatDate } from '@/utils/formatters'
import { PageLoading } from '@/components/ui/LoadingSpinner'
import { cn } from '@/utils/helpers'

export function ProjectListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orgId = searchParams.get('org')
  const { projects, fetchProjects } = useProjectStore()
  const { organizations, isLoading: orgsLoading, fetchOrganizations } = useOrganizationStore()
  const [showCreate, setShowCreate] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState(orgId || '')

  // Kick off orgs fetch
  useEffect(() => {
    fetchOrganizations()
  }, [])

  // Kick off projects fetch when org selected
  useEffect(() => {
    fetchProjects(selectedOrg || undefined).catch(() => {})
  }, [selectedOrg])

  const displayOrgs = organizations
  const displayProjects = projects

  if (orgsLoading && organizations.length === 0) return <PageLoading />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage AI security assessment projects</p>
        </div>
        <Button onClick={() => setShowCreate(true)} disabled={!selectedOrg}><Plus className="h-4 w-4" /> New Project</Button>
      </div>



      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setSelectedOrg('')} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', !selectedOrg ? 'bg-indigo-600 text-white dark:text-[#ffffff]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>All</button>
        {displayOrgs.map((org: any) => (
          <button key={org.id} onClick={() => setSelectedOrg(org.id)} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', selectedOrg === org.id ? 'bg-indigo-600 text-white dark:text-[#ffffff]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>{org.name}</button>
        ))}
      </div>

      {displayProjects.length === 0 ? (
        <Card><EmptyState icon={<FolderKanban className="h-12 w-12" />} title="No projects yet" description="Create your first AI security assessment project" action={selectedOrg ? { label: 'Create Project', onClick: () => setShowCreate(true) } : undefined} /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProjects.map((project: any) => (
            <Card key={project.id} hover onClick={() => navigate(`/projects/${project.id}`)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-cyan-100 flex items-center justify-center"><FolderKanban className="h-5 w-5 text-cyan-600" /></div>
                  <div>
                    <CardTitle className="text-base">{project.name}</CardTitle>
                    <p className="text-xs text-gray-500">{project.project_type?.replace(/_/g, ' ')}</p>
                  </div>
                </div>
                <Badge variant={project.status === 'active' ? 'success' : 'default'}>{project.status}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{project.description || 'No description'}</p>
                <div className="text-xs text-gray-500">Created {formatDate(project.created_at)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreate && <CreateProjectModal orgId={selectedOrg} onClose={() => setShowCreate(false)} />}
    </div>
  )
}

function CreateProjectModal({ orgId, onClose }: { orgId: string; onClose: () => void }) {
  const { createProject, isLoading } = useProjectStore()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [projectType, setProjectType] = useState('ai_security')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createProject({ organization: orgId, name, description, project_type: projectType })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="GPT-4 Security Assessment" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Project description" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"><option value="ai_security">AI Security Assessment</option><option value="compliance">Compliance Assessment</option><option value="audit">Security Audit</option><option value="custom">Custom</option></select></div>
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" type="button" onClick={onClose}>Cancel</Button><Button type="submit" isLoading={isLoading}>Create</Button></div>
        </form>
      </div>
    </div>
  )
}
