import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2, Plus, Shield } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Tabs } from '@/components/ui'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { useOrganizationStore } from '@/store/organizationSlice'
import { formatDate } from '@/utils/formatters'
import { PageLoading } from '@/components/ui/LoadingSpinner'

export function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentOrganization, members, isLoading, fetchOrganization, fetchMembers, deleteOrganization } = useOrganizationStore()
  const [showInvite, setShowInvite] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchOrganization(id).catch(() => {})
    fetchMembers(id).catch(() => {})
  }, [id, fetchOrganization, fetchMembers])

  const org = currentOrganization
  const orgMembers = members

  if (isLoading && !org) return <PageLoading />

  if (!org) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate('/organizations')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft className="h-4 w-4" /> Back to organizations</button>
        <Card><p className="p-8 text-center text-gray-500">Organization not found.</p></Card>
      </div>
    )
  }

  const memberColumns: Column<any>[] = [
    { key: 'user', header: 'User', render: (m: any) => (
      <span className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700">
          {(m.email || m.user?.email || '?').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium">{m.first_name || m.user?.first_name || ''} {m.last_name || m.user?.last_name || ''}</p>
          <p className="text-xs text-gray-500">{m.email || m.user?.email || ''}</p>
        </div>
      </span>
    )},
    { key: 'role', header: 'Role', render: (m: any) => <Badge variant={m.role === 'owner' ? 'info' : 'default'}>{m.role}</Badge> },
    { key: 'joined_at', header: 'Joined', render: (m: any) => formatDate(m.joined_at) },
  ]

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><p className="text-2xl font-bold text-gray-900">{orgMembers.length}</p><p className="text-sm text-gray-500">Members</p></Card>
            <Card><p className="text-2xl font-bold text-gray-900 capitalize">{org.subscription_tier}</p><p className="text-sm text-gray-500">Subscription</p></Card>
            <Card><p className="text-2xl font-bold text-gray-900">{formatDate(org.created_at)}</p><p className="text-sm text-gray-500">Created</p></Card>
          </div>
          {org.description && (<Card><CardTitle>Description</CardTitle><p className="text-sm text-gray-600 mt-2">{org.description}</p></Card>)}
        </div>
      ),
    },
    {
      id: 'members',
      label: 'Members',
      badge: orgMembers.length,
      content: (
        <div className="space-y-4">
          <div className="flex justify-end"><Button size="sm" onClick={() => setShowInvite(true)}><Plus className="h-4 w-4" /> Invite Member</Button></div>
          <DataTable columns={memberColumns} data={orgMembers} keyExtractor={(m: any) => m.id} searchable emptyMessage="No members found" />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/organizations')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="h-5 w-5 text-gray-500" /></button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{org.name}</h1>
              <Badge variant={org.is_active ? 'success' : 'default'}>{org.is_active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">{org.industry || 'No industry'}</p>
          </div>
        </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate(`/projects?org=${org?.id}`)}><Shield className="h-4 w-4" /> Projects</Button>
        <Button variant="outline" size="sm" onClick={() => {}}><Edit2 className="h-4 w-4" /> Edit</Button>
        <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}><Trash2 className="h-4 w-4" /> Delete</Button>
      </div>
      </div>

      <Tabs tabs={tabs} />

      {showInvite && <InviteMemberModal orgId={org.id} onClose={() => setShowInvite(false)} />}

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Organization?</h2>
            <p className="text-sm text-gray-500 mb-4">This will permanently delete <strong>{org.name}</strong> and all associated data.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
              <Button variant="danger" onClick={async () => { await deleteOrganization(org.id); navigate('/organizations') }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InviteMemberModal({ orgId, onClose }: { orgId: string; onClose: () => void }) {
  const { inviteMember, isLoading } = useOrganizationStore()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await inviteMember(orgId, email, role)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Invite Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="colleague@company.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"><option value="member">Member</option><option value="admin">Admin</option><option value="viewer">Viewer</option><option value="auditor">Auditor</option></select></div>
          <div className="flex justify-end gap-3"><Button variant="outline" type="button" onClick={onClose}>Cancel</Button><Button type="submit" isLoading={isLoading}>Invite</Button></div>
        </form>
      </div>
    </div>
  )
}
