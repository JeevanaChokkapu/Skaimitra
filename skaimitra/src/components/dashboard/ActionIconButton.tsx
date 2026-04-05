import type { LucideIcon } from 'lucide-react'

type ActionIconButtonProps = {
  icon: LucideIcon
  onClick: () => void
  ariaLabel: string
  title?: string
  disabled?: boolean
}

const ActionIconButton: React.FC<ActionIconButtonProps> = ({ icon: IconComponent, onClick, ariaLabel, title, disabled }) => (
  <button
    type="button"
    className="action-icon-btn"
    onClick={onClick}
    aria-label={ariaLabel}
    title={title || ariaLabel}
    disabled={disabled}
  >
    <IconComponent size={18} />
  </button>
)

export default ActionIconButton
