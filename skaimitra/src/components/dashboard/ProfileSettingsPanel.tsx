import { useEffect, useState } from 'react'

export type ProfileSettingsData = {
  username: string
  email: string
  firstName: string
  lastName: string
  address: string
  phone: string
  homePhone: string
  whatsAppPhone: string
  schoolId: string
  status: string
  role: string
  subject?: string
}

type ProfileSettingsPanelProps = {
  title?: string
  subtitle?: string
  profile: ProfileSettingsData
  onSave: (nextProfile: ProfileSettingsData) => void
  isInline?: boolean
}

const profileFields: Array<{
  key: keyof ProfileSettingsData
  label: string
  type?: 'text' | 'email' | 'tel'
  span?: boolean
  readOnly?: boolean
}> = [
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'homePhone', label: 'Home Phone', type: 'tel' },
  { key: 'whatsAppPhone', label: 'WhatsApp Phone', type: 'tel' },
  { key: 'schoolId', label: 'School ID' },
  { key: 'status', label: 'Status' },
  { key: 'role', label: 'Role', readOnly: true },
]

function ProfileSettingsPanel({
  title = 'Profile',
  subtitle = 'Review and update your account details.',
  profile,
  onSave,
  isInline = false,
}: ProfileSettingsPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<ProfileSettingsData>(profile)
  const [successMessage, setSuccessMessage] = useState('')
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordMessage, setPasswordMessage] = useState('')

  useEffect(() => {
    setForm(profile)
    setIsEditing(false)
    setSuccessMessage('')
    setShowPasswordFields(false)
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setPasswordMessage('')
  }, [profile])

  useEffect(() => {
    if (!successMessage && !passwordMessage) return
    const timeoutId = window.setTimeout(() => {
      setSuccessMessage('')
      setPasswordMessage('')
    }, 2600)
    return () => window.clearTimeout(timeoutId)
  }, [passwordMessage, successMessage])

  const updateField = <K extends keyof ProfileSettingsData>(field: K, value: ProfileSettingsData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(form)
    setIsEditing(false)
    setSuccessMessage('Profile updated successfully.')
  }

  const handlePasswordSave = () => {
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage('Enter and confirm the new password.')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('New password and confirm password must match.')
      return
    }

    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setShowPasswordFields(false)
    setPasswordMessage('Password updated successfully.')
  }

  return (
    <section className={`profile-settings-panel ${isInline ? 'is-inline' : ''}`}>
      <div className="planner-card-head profile-settings-head">
        <div>
          <h3>{title}</h3>
          <p className="role-muted">{subtitle}</p>
        </div>
        <button type="button" className="role-secondary-btn" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {successMessage ? <p className="profile-settings-success">{successMessage}</p> : null}
      {passwordMessage ? <p className="profile-settings-success">{passwordMessage}</p> : null}

      <div className="profile-settings-grid">
        {profileFields.map((field) => (
          <label key={field.key} className={field.span ? 'planner-span-2' : ''}>
            <span>{field.label}</span>
            <input
              type={field.type ?? 'text'}
              value={form[field.key] ?? ''}
              onChange={(e) => updateField(field.key, e.target.value)}
              readOnly={!isEditing || Boolean(field.readOnly)}
            />
          </label>
        ))}

        {form.subject ? (
          <label>
            <span>Subject</span>
            <input type="text" value={form.subject} onChange={(e) => updateField('subject', e.target.value)} readOnly={!isEditing} />
          </label>
        ) : null}

        <label className="planner-span-2">
          <span>Address</span>
          <textarea value={form.address} onChange={(e) => updateField('address', e.target.value)} readOnly={!isEditing} rows={4} />
        </label>
      </div>

      <section className="profile-password-card">
        <div className="profile-password-head">
          <div>
            <h4>Change Password</h4>
            <p className="role-muted">Passwords stay hidden. Update only when needed.</p>
          </div>
          <button type="button" className="role-secondary-btn" onClick={() => setShowPasswordFields((prev) => !prev)}>
            {showPasswordFields ? 'Hide' : 'Change Password'}
          </button>
        </div>

        {showPasswordFields ? (
          <div className="profile-settings-grid">
            <label>
              <span>Current Password</span>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
              />
            </label>
            <label>
              <span>New Password</span>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              />
            </label>
            <label className="planner-span-2">
              <span>Confirm Password</span>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </label>
          </div>
        ) : null}

        {showPasswordFields ? (
          <div className="planner-inline-actions planner-inline-actions-end profile-settings-actions">
            <button type="button" className="role-secondary-btn" onClick={() => setShowPasswordFields(false)}>
              Cancel
            </button>
            <button type="button" className="role-primary-btn" onClick={handlePasswordSave}>
              Save Password
            </button>
          </div>
        ) : null}
      </section>

      <div className="planner-inline-actions planner-inline-actions-end profile-settings-actions">
        <button type="button" className="role-primary-btn" onClick={handleSave} disabled={!isEditing}>
          Save Changes
        </button>
      </div>
    </section>
  )
}

export default ProfileSettingsPanel
