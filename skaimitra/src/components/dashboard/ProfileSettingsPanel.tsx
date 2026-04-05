import { useEffect, useState } from 'react'

export type ProfileSettingsData = {
  name: string
  email: string
  phone: string
  subject: string
  role: string
}

type ProfileSettingsPanelProps = {
  title?: string
  subtitle?: string
  profile: ProfileSettingsData
  onSave: (nextProfile: ProfileSettingsData) => void
  isInline?: boolean
}

function ProfileSettingsPanel({
  title = 'System Settings',
  subtitle = 'Update your profile details and keep your account information current.',
  profile,
  onSave,
  isInline = false,
}: ProfileSettingsPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<ProfileSettingsData>(profile)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    setForm(profile)
    setSuccessMessage('')
    setIsEditing(false)
  }, [profile])

  useEffect(() => {
    if (!successMessage) return
    const timeoutId = window.setTimeout(() => setSuccessMessage(''), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [successMessage])

  const updateField = <K extends keyof ProfileSettingsData>(field: K, value: ProfileSettingsData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(form)
    setIsEditing(false)
    setSuccessMessage('Changes saved successfully.')
  }

  return (
    <section className={`profile-settings-panel ${isInline ? 'is-inline' : ''}`}>
      <div className="planner-card-head profile-settings-head">
        <div>
          <h3>{title}</h3>
          <p className="role-muted">{subtitle}</p>
        </div>
        <button type="button" className="role-secondary-btn" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? 'Cancel Edit' : 'Edit'}
        </button>
      </div>

      {successMessage ? <p className="profile-settings-success">{successMessage}</p> : null}

      <div className="profile-settings-grid">
        <label>
          <span>Name</span>
          <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} readOnly={!isEditing} />
        </label>
        <label>
          <span>Email</span>
          <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} readOnly={!isEditing} />
        </label>
        <label>
          <span>Phone Number</span>
          <input type="text" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} readOnly={!isEditing} />
        </label>
        <label>
          <span>Subject</span>
          <input type="text" value={form.subject} onChange={(e) => updateField('subject', e.target.value)} readOnly={!isEditing} />
        </label>
        <label className="planner-span-2">
          <span>Role</span>
          <input type="text" value={form.role} readOnly />
        </label>
      </div>

      <div className="planner-inline-actions planner-inline-actions-end profile-settings-actions">
        <button type="button" className="role-primary-btn" onClick={handleSave} disabled={!isEditing}>
          Save Changes
        </button>
      </div>
    </section>
  )
}

export default ProfileSettingsPanel
