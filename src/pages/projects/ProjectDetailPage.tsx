import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2, Shield, Activity } from 'lucide-react'
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Tabs, EmptyState } from '@/components/ui'
import { useProjectStore } from '@/store/projectSlice'
import { formatDate } from '@/utils/formatters'
import { PageLoading } from '@/components/ui/LoadingSpinner'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentProject, isLoading, fetchProject, deleteProject } = useProjectStore()
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchProject(id).catch(() => {})
  }, [id, fetchProject])

  const project = currentProject

  if (isLoading && !project) return <PageLoading />

  if (!project) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft className="h-4 w-4" /> Back to projects</button>
        <Card><p className="p-8 text-center text-gray-500">Project not found.</p></Card>
      </div>
    )
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          {project.description && (<Card><CardTitle>Description</CardTitle><p className="text-sm text-gray-600 mt-2">{project.description}</p></Card>)}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><p className="text-2xl font-bold text-gray-900">{project.project_type?.replace(/_/g, ' ')}</p><p className="text-sm text-gray-500">Type</p></Card>
            <Card><p className="text-2xl font-bold text-gray-900">{formatDate(project.created_at)}</p><p className="text-sm text-gray-500">Created</p></Card>
            <Card><p className="text-sm text-gray-600">{project.created_by_name || 'N/A'}</p><p className="text-sm text-gray-500">Created by</p></Card>
          </div>
        </div>
      ),
    },
    {
      id: 'scans',
      label: 'Scans',
      content: (<EmptyState icon={<Activity className="h-12 w-12" />} title="No scans yet" description="Launch your first AI security scan for this project" action={{ label: 'New Scan', onClick: () => navigate(`/scans/quick?project=${project.id}`) }} />),
    },
    {
      id: 'findings',
      label: 'Findings',
      content: (<EmptyState icon={<Shield className="h-12 w-12" />} title="No findings yet" description="Findings will appear here once scans are completed" />),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/projects')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="h-5 w-5 text-gray-500" /></button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <Badge variant={project.status === 'active' ? 'success' : 'default'}>{project.status}</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">{project.project_type?.replace(/_/g, ' ')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Edit2 className="h-4 w-4" /> Edit</Button>
          <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}><Trash2 className="h-4 w-4" /> Delete</Button>
        </div>
      </div>

      <Tabs tabs={tabs} />

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Project?</h2>
            <p className="text-sm text-gray-500 mb-4">This will permanently delete <strong>{project.name}</strong> and all associated scan data.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
              <Button variant="danger" onClick={async () => { await deleteProject(project.id); navigate('/projects') }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
