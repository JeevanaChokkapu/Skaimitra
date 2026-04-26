import PermissionPanel from './PermissionPanel'
import RoleListPanel from './RoleListPanel'
import type { PermissionAction, PermissionRole, RolePermissionsState, RolePermissionRoleMeta } from './rolePermissionsTypes'

type RolePermissionsPageProps = {
  roles: RolePermissionRoleMeta[]
  selectedRole: PermissionRole
  permissions: RolePermissionsState
  onSelectRole: (role: PermissionRole) => void
  onTogglePermission: (role: PermissionRole, moduleKey: string, action: PermissionAction) => void
  onSave: () => void
  onReset: () => void
}

function RolePermissionsPage({
  roles,
  selectedRole,
  permissions,
  onSelectRole,
  onTogglePermission,
  onSave,
  onReset,
}: RolePermissionsPageProps) {
  const selectedRoleMeta = roles.find((role) => role.role === selectedRole) || roles[0]

  return (
    <main className="role-main role-main-detail">
      <section className="role-primary role-permission-page">
        <div className="role-permission-page-head">
          <div>
            <h2>Role & Permissions Management</h2>
            <p className="role-muted">Configure access control for different user roles</p>
          </div>
        </div>

        <div className="role-permission-layout">
          <RoleListPanel roles={roles} selectedRole={selectedRole} onSelectRole={onSelectRole} />
          <PermissionPanel
            selectedRole={selectedRole}
            selectedRoleName={selectedRoleMeta?.name || 'Administrator'}
            permissions={permissions[selectedRole]}
            onTogglePermission={onTogglePermission}
            onSave={onSave}
            onReset={onReset}
          />
        </div>
      </section>
    </main>
  )
}

export default RolePermissionsPage
