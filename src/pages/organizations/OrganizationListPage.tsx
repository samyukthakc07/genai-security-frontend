import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Building2, Users } from 'lucide-react'
import { Button, Card, CardTitle, CardHeader, CardContent, Badge } from '@/components/ui'
import { useOrganizationStore } from '@/store/organizationSlice'
import { formatDate, formatNumber } from '@/utils/formatters'
import { PageLoading } from '@/components/ui/LoadingSpinner'
export function OrganizationListPage() {
  const navigate = useNavigate()
  const { organizations, isLoading, fetchOrganizations } = useOrganizationStore()
  const [showCreate, setShowCreate] = useState(false)

  // Kick off the API fetch on mount
  useEffect(() => {
    fetchOrganizations()
  }, [])

  if (isLoading) return <PageLoading />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your organizations and teams</p>
        </div>
        <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4" /> New Organization</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizations.map((org: any) => (
          <Card key={org.id} hover onClick={() => navigate(`/organizations/${org.id}`)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center"><Building2 className="h-5 w-5 text-indigo-600" /></div>
                <div>
                  <CardTitle className="text-base">{org.name}</CardTitle>
                  <p className="text-xs text-gray-500">{org.industry || 'No industry set'}</p>
                </div>
              </div>
              <Badge variant={org.is_active ? 'success' : 'default'}>{org.is_active ? 'Active' : 'Inactive'}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{org.description || 'No description'}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Users className="h-4 w-4" />{formatNumber(org.member_count)} members</span>
                <span>{formatDate(org.created_at)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showCreate && <CreateOrganizationModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

function CreateOrganizationModal({ onClose }: { onClose: () => void }) {
  const { createOrganization, isLoading } = useOrganizationStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const org = await createOrganization({ name, description, industry: industry || undefined })
      navigate(`/organizations/${org.id}`)
      onClose()
    } catch { /* Handle error */ }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Organization</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Acme Corp" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Organization description" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Industry</label><input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g., Technology, Finance, Healthcare" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" /></div>
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" type="button" onClick={onClose}>Cancel</Button><Button type="submit" isLoading={isLoading}>Create</Button></div>
        </form>
      </div>
    </div>
  )
}
