import { useEffect, useState } from 'react'
import { LogOut, UserCircle2, X } from 'lucide-react'
import type { ProfileSettingsData } from './ProfileSettingsPanel'

type ProfileDrawerProps = {
  profile: ProfileSettingsData
  onSave: (nextProfile: ProfileSettingsData) => void
  onLogout: () => void
}

const getInitials = (profile: ProfileSettingsData) => {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim()
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function ProfileDrawer({ profile, onSave, onLogout }: ProfileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [form, setForm] = useState(profile)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    setForm(profile)
  }, [profile])

  useEffect(() => {
    if (!isOpen) return

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = overflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!message) return
    const timeoutId = window.setTimeout(() => setMessage(''), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [message])

  const updateField = <K extends keyof ProfileSettingsData>(field: K, value: ProfileSettingsData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = () => {
    onSave(form)
    setIsEditing(false)
    setMessage('Profile updated successfully.')
  }

  const handleSavePassword = () => {
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setMessage('Enter and confirm the new password.')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('New password and confirm password must match.')
      return
    }

    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setIsChangingPassword(false)
    setMessage('Password updated successfully.')
  }

  const closeDrawer = () => {
    setIsOpen(false)
    setIsEditing(false)
    setIsChangingPassword(false)
    setForm(profile)
  }

  return (
    <>
      <button type="button" className="profile-drawer-trigger" aria-label="Open profile panel" onClick={() => setIsOpen(true)}>
        <span className="profile-drawer-avatar profile-drawer-avatar-trigger">{getInitials(profile) || <UserCircle2 size={18} />}</span>
      </button>

      {isOpen ? (
        <div className="profile-drawer-overlay" role="presentation" onClick={closeDrawer}>
          <aside className="profile-drawer" role="dialog" aria-modal="true" aria-label={`${profile.role} profile`} onClick={(e) => e.stopPropagation()}>
            <div className="profile-drawer-head">
              <div className="profile-drawer-identity">
                <span className="profile-drawer-avatar">{getInitials(profile)}</span>
                <div className="profile-drawer-identity-copy">
                  <h2>{`${form.firstName} ${form.lastName}`.trim()}</h2>
                  <p>{form.role}</p>
                  <span>{form.email}</span>
                </div>
              </div>
              <button type="button" className="profile-drawer-close" aria-label="Close profile panel" onClick={closeDrawer}>
                <X size={18} />
              </button>
            </div>

            {message ? <p className="profile-settings-success">{message}</p> : null}

            <div className="profile-drawer-divider" />

            <section className="profile-drawer-section">
              <div className="profile-drawer-section-head">
                <h3>Profile Details</h3>
                {isEditing ? (
                  <button type="button" className="role-secondary-btn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                ) : null}
              </div>

              {isEditing ? (
                <div className="profile-drawer-form">
                  <label>
                    <span>Username</span>
                    <input type="text" value={form.username} onChange={(e) => updateField('username', e.target.value)} />
                  </label>
                  <label>
                    <span>Email</span>
                    <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
                  </label>
                  <label>
                    <span>First Name</span>
                    <input type="text" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
                  </label>
                  <label>
                    <span>Last Name</span>
                    <input type="text" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
                  </label>
                  <label>
                    <span>Phone Number</span>
                    <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
                  </label>
                  <label>
                    <span>WhatsApp Number</span>
                    <input type="tel" value={form.whatsAppPhone} onChange={(e) => updateField('whatsAppPhone', e.target.value)} />
                  </label>
                  <label className="profile-drawer-form-span">
                    <span>Address</span>
                    <textarea value={form.address} onChange={(e) => updateField('address', e.target.value)} rows={4} />
                  </label>
                  <label>
                    <span>Status</span>
                    <input type="text" value={form.status} onChange={(e) => updateField('status', e.target.value)} />
                  </label>
                  <div className="profile-drawer-inline-actions">
                    <button type="button" className="role-primary-btn" onClick={handleSaveProfile}>
                      Save Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-drawer-details">
                  <div>
                    <span>Username</span>
                    <strong>{form.username}</strong>
                  </div>
                  <div>
                    <span>Email</span>
                    <strong>{form.email}</strong>
                  </div>
                  <div>
                    <span>Phone Number</span>
                    <strong>{form.phone || 'Not provided'}</strong>
                  </div>
                  <div>
                    <span>WhatsApp Number</span>
                    <strong>{form.whatsAppPhone || 'Not provided'}</strong>
                  </div>
                  <div className="profile-drawer-detail-span">
                    <span>Address</span>
                    <strong>{form.address || 'Not provided'}</strong>
                  </div>
                  <div>
                    <span>Status</span>
                    <strong>{form.status}</strong>
                  </div>
                </div>
              )}
            </section>

            <div className="profile-drawer-divider" />

            {isChangingPassword ? (
              <section className="profile-drawer-section">
                <div className="profile-drawer-section-head">
                  <h3>Change Password</h3>
                  <button type="button" className="role-secondary-btn" onClick={() => setIsChangingPassword(false)}>
                    Cancel
                  </button>
                </div>
                <div className="profile-drawer-form">
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
                  <label>
                    <span>Confirm Password</span>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </label>
                  <div className="profile-drawer-inline-actions">
                    <button type="button" className="role-primary-btn" onClick={handleSavePassword}>
                      Save Password
                    </button>
                  </div>
                </div>
              </section>
            ) : null}

            <section className="profile-drawer-actions">
              <button type="button" className="role-primary-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
              <button type="button" className="role-secondary-btn" onClick={() => setIsChangingPassword((prev) => !prev)}>
                Change Password
              </button>
              <button type="button" className="profile-drawer-logout" onClick={onLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </section>
          </aside>
        </div>
      ) : null}
    </>
  )
}

export default ProfileDrawer
