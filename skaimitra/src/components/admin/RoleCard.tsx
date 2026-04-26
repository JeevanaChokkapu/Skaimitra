import { GraduationCap, ShieldCheck, UserRound, UsersRound } from 'lucide-react'
import type { RolePermissionRoleMeta } from './rolePermissionsTypes'

type RoleCardProps = {
  role: RolePermissionRoleMeta
  isSelected: boolean
  onSelect: () => void
}

const roleIcons = {
  shield: ShieldCheck,
  graduation: GraduationCap,
  student: UserRound,
  parent: UsersRound,
}

function RoleCard({ role, isSelected, onSelect }: RoleCardProps) {
  const Icon = roleIcons[role.icon]

  return (
    <button
      type="button"
      className={`role-permission-role-card ${role.accentClass} ${isSelected ? 'is-selected' : ''}`}
      onClick={onSelect}
    >
      <span className="role-permission-role-icon">
        <Icon size={20} />
      </span>

      <div className="role-permission-role-copy">
        <strong>{role.name}</strong>
        <span>{`${role.userCount} users`}</span>
        <p>{role.description}</p>
      </div>
    </button>
  )
}

export default RoleCard
