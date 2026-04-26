import PermissionCard from './PermissionCard'
import { permissionModules, type PermissionAction, type PermissionRole } from './rolePermissionsTypes'

type PermissionPanelProps = {
  selectedRoleName: string
  selectedRole: PermissionRole
  permissions: Record<string, Record<PermissionAction, boolean>>
  onTogglePermission: (role: PermissionRole, moduleKey: string, action: PermissionAction) => void
  onSave: () => void
  onReset: () => void
}

function PermissionPanel({
  selectedRoleName,
  selectedRole,
  permissions,
  onTogglePermission,
  onSave,
  onReset,
}: PermissionPanelProps) {
  return (
    <section className="role-permission-main-panel">
      <div className="role-permission-main-head">
        <div>
          <h3>{`Permissions for ${selectedRoleName}`}</h3>
          <p className="role-muted">Configure what this role can access and modify</p>
        </div>
      </div>

      <div className="role-permission-card-list">
        {permissionModules.map((module) => (
          <PermissionCard
            key={module.key}
            module={module}
            permissions={permissions[module.key]}
            onToggle={(action) => onTogglePermission(selectedRole, module.key, action)}
          />
        ))}
      </div>

      <div className="role-permission-actions">
        <button type="button" className="role-secondary-btn role-permission-reset-btn" onClick={onReset}>
          Reset to Default
        </button>
        <button type="button" className="role-primary-btn role-permission-save-btn" onClick={onSave}>
          Save Changes
        </button>
      </div>
    </section>
  )
}

export default PermissionPanel
