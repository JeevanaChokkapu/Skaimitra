import { useEffect, useState } from 'react'

export type SchoolSettingsData = {
  schoolName: string
  licenseNumber: string
  address: string
  locationType: 'Urban' | 'Rural' | 'Semi-Urban'
  contactPerson: string
  phoneNumber: string
  whatsappPhoneNumber: string
  email: string
  faxNumber: string
  websiteUrl: string
  mapAddressUrl: string
  academicAffiliation: string
  logoName: string
}

type SchoolSettingsFormProps = {
  settings: SchoolSettingsData
  onSave: (nextSettings: SchoolSettingsData) => void
}

function SchoolSettingsForm({ settings, onSave }: SchoolSettingsFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState(settings)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    setForm(settings)
    setIsEditing(false)
    setSuccessMessage('')
  }, [settings])

  useEffect(() => {
    if (!successMessage) return
    const timeoutId = window.setTimeout(() => setSuccessMessage(''), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [successMessage])

  const updateField = <K extends keyof SchoolSettingsData>(field: K, value: SchoolSettingsData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleEdit = () => {
    setForm(settings)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setForm(settings)
    setIsEditing(false)
  }

  const handleSave = () => {
    onSave(form)
    setIsEditing(false)
    setSuccessMessage('School settings saved successfully.')
  }

  return (
    <section className="school-settings-panel role-card role-detail-card">
      <div className="planner-card-head profile-settings-head">
        <div>
          <h2>School Settings</h2>
          <p className="role-muted">Manage school details, academic metadata, and public contact information.</p>
        </div>
      </div>

      {successMessage ? <p className="profile-settings-success">{successMessage}</p> : null}

      <div className="school-settings-stack">
        <section className="school-settings-section">
          <div className="school-settings-section-head">
            <h3>Basic Details</h3>
          </div>
          <div className="profile-settings-grid">
            <label>
              <span>School Name</span>
              <input type="text" value={form.schoolName} onChange={(e) => updateField('schoolName', e.target.value)} readOnly={!isEditing} />
            </label>
            <label>
              <span>School License Number</span>
              <input type="text" value={form.licenseNumber} onChange={(e) => updateField('licenseNumber', e.target.value)} readOnly={!isEditing} />
            </label>
            <label className="planner-span-2">
              <span>Address</span>
              <textarea value={form.address} onChange={(e) => updateField('address', e.target.value)} readOnly={!isEditing} rows={4} />
            </label>
            <label>
              <span>Location Type</span>
              <select value={form.locationType} onChange={(e) => updateField('locationType', e.target.value as SchoolSettingsData['locationType'])} disabled={!isEditing}>
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
                <option value="Semi-Urban">Semi-Urban</option>
              </select>
            </label>
          </div>
        </section>

        <section className="school-settings-section">
          <div className="school-settings-section-head">
            <h3>Contact Details</h3>
          </div>
          <div className="profile-settings-grid">
            <label>
              <span>School Contact Person</span>
              <input type="text" value={form.contactPerson} onChange={(e) => updateField('contactPerson', e.target.value)} readOnly={!isEditing} />
            </label>
            <label>
              <span>Phone Number</span>
              <input type="tel" value={form.phoneNumber} onChange={(e) => updateField('phoneNumber', e.target.value)} readOnly={!isEditing} />
            </label>
            <label>
              <span>WhatsApp Phone Number</span>
              <input type="tel" value={form.whatsappPhoneNumber} onChange={(e) => updateField('whatsappPhoneNumber', e.target.value)} readOnly={!isEditing} />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} readOnly={!isEditing} />
            </label>
            <label>
              <span>Fax Number</span>
              <input type="text" value={form.faxNumber} onChange={(e) => updateField('faxNumber', e.target.value)} readOnly={!isEditing} />
            </label>
          </div>
        </section>

        <section className="school-settings-section">
          <div className="school-settings-section-head">
            <h3>Online & Academic Details</h3>
          </div>
          <div className="profile-settings-grid">
            <label>
              <span>School Website URL</span>
              <input type="url" value={form.websiteUrl} onChange={(e) => updateField('websiteUrl', e.target.value)} readOnly={!isEditing} />
            </label>
            <label>
              <span>Map Address URL</span>
              <input type="url" value={form.mapAddressUrl} onChange={(e) => updateField('mapAddressUrl', e.target.value)} readOnly={!isEditing} />
            </label>
            <label className="planner-span-2">
              <span>School Academic Affiliation</span>
              <input
                type="text"
                value={form.academicAffiliation}
                onChange={(e) => updateField('academicAffiliation', e.target.value)}
                readOnly={!isEditing}
              />
            </label>
          </div>
        </section>

        <section className="school-settings-section">
          <div className="school-settings-section-head">
            <h3>Media</h3>
          </div>
          <div className="profile-settings-grid">
            <label className="planner-span-2">
              <span>School Logo</span>
              <div className="school-logo-upload">
                <input
                  type="file"
                  accept="image/*"
                  disabled={!isEditing}
                  onChange={(e) => updateField('logoName', e.target.files?.[0]?.name || form.logoName)}
                />
                <p className="role-muted">{form.logoName || 'No logo selected'}</p>
              </div>
            </label>
          </div>
        </section>
      </div>

      <div className="dashboard-form-footer">
        <div className="dashboard-form-footer-actions">
          {isEditing ? (
            <>
              <button type="button" className="role-secondary-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button type="button" className="role-primary-btn" onClick={handleSave}>
                Save Changes
              </button>
            </>
          ) : (
            <button type="button" className="role-edit-btn" onClick={handleEdit}>
              Edit
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default SchoolSettingsForm
