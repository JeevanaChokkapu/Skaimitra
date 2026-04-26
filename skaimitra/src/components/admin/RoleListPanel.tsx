import RoleCard from './RoleCard'
import type { PermissionRole, RolePermissionRoleMeta } from './rolePermissionsTypes'

type RoleListPanelProps = {
  roles: RolePermissionRoleMeta[]
  selectedRole: PermissionRole
  onSelectRole: (role: PermissionRole) => void
}

function RoleListPanel({ roles, selectedRole, onSelectRole }: RoleListPanelProps) {
  return (
    <aside className="role-permission-side-panel">
      <div className="role-permission-side-head">
        <h3>User Roles</h3>
        <p className="role-muted">Select a role to manage permissions</p>
      </div>

      <div className="role-permission-role-list">
        {roles.map((role) => (
          <RoleCard key={role.role} role={role} isSelected={selectedRole === role.role} onSelect={() => onSelectRole(role.role)} />
        ))}
      </div>
    </aside>
  )
}

export default RoleListPanel
