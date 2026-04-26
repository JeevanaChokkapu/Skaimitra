import { GraduationCap, ShieldCheck, UserRound, UsersRound } from 'lucide-react'
import { countActivePermissions, type PermissionRole, type RolePermissionsState, type RolePermissionRoleMeta } from './rolePermissionsTypes'

type PermissionSummaryProps = {
  roles: RolePermissionRoleMeta[]
  permissions: RolePermissionsState
}

const roleIcons = {
  shield: ShieldCheck,
  graduation: GraduationCap,
  student: UserRound,
  parent: UsersRound,
}

function PermissionSummary({ roles, permissions }: PermissionSummaryProps) {
  return (
    <section className="role-permission-summary-section">
      <div className="role-permission-summary-head">
        <h3>Permission Summary</h3>
      </div>

      <div className="role-permission-summary-grid">
        {roles.map((role) => {
          const Icon = roleIcons[role.icon]
          const activePermissions = countActivePermissions(permissions[role.role as PermissionRole])

          return (
            <article key={role.role} className={`role-permission-summary-card ${role.accentClass}`}>
              <span className="role-permission-summary-icon">
                <Icon size={20} />
              </span>
              <strong>{role.name}</strong>
              <span className="role-permission-summary-count">{activePermissions}</span>
              <p>Active Permissions</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default PermissionSummary
