import { BarChart3, BookOpen, ClipboardList, Megaphone, Settings, ShieldCheck, Users } from 'lucide-react'
import ToggleSwitch from './ToggleSwitch'
import { permissionActions, type PermissionAction, type PermissionModule } from './rolePermissionsTypes'

type PermissionCardProps = {
  module: PermissionModule
  permissions: Record<PermissionAction, boolean>
  onToggle: (action: PermissionAction) => void
}

const moduleIcons = {
  users: Users,
  book: BookOpen,
  clipboard: ClipboardList,
  badge: ShieldCheck,
  chart: BarChart3,
  settings: Settings,
  megaphone: Megaphone,
}

function PermissionCard({ module, permissions, onToggle }: PermissionCardProps) {
  const Icon = moduleIcons[module.icon]

  return (
    <article className="role-permission-card">
      <div className="role-permission-card-head">
        <span className="role-permission-card-icon">
          <Icon size={20} />
        </span>
        <div>
          <h4>{module.label}</h4>
        </div>
      </div>

      <div className="role-permission-toggle-row">
        {permissionActions.map((action) => (
          <div key={action} className="role-permission-toggle-item">
            <span>{action.charAt(0).toUpperCase() + action.slice(1)}</span>
            <ToggleSwitch
              checked={permissions[action]}
              onChange={() => onToggle(action)}
              label={`${module.label} ${action}`}
            />
          </div>
        ))}
      </div>
    </article>
  )
}

export default PermissionCard
