import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'

type BackArrowHeaderProps = {
  title: string
  subtitle?: string
  onBack: () => void
  actions?: ReactNode
}

export default function BackArrowHeader({ title, subtitle, onBack, actions }: BackArrowHeaderProps) {
  return (
    <div className="role-section-head back-arrow-header">
      <div className="back-arrow-header-copy">
        <button type="button" className="back-arrow-header-btn" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2>{title}</h2>
          {subtitle ? <p className="role-muted">{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="back-arrow-header-actions">{actions}</div> : null}
    </div>
  )
}
