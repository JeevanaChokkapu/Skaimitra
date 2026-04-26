import { ArrowLeft, Save, UserCircle2 } from 'lucide-react'
import type { TeacherFormValues } from './teacherTypes'

type TeacherProfileEditorProps = {
  values: TeacherFormValues
  subjectOptions: string[]
  onBack: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onFieldChange: (field: keyof TeacherFormValues, value: string) => void
  onToggleSubject: (subject: string) => void
}

function TeacherProfileEditor({
  values,
  subjectOptions,
  onBack,
  onSubmit,
  onFieldChange,
  onToggleSubject,
}: TeacherProfileEditorProps) {
  const previewName = `${values.firstName} ${values.lastName}`.trim() || 'New Teacher'
  const basicFields: Array<{ label: string; field: keyof TeacherFormValues; type?: string; placeholder?: string }> = [
    { label: 'First Name', field: 'firstName', placeholder: 'First name' },
    { label: 'Last Name', field: 'lastName', placeholder: 'Last name' },
    { label: 'Email', field: 'email', type: 'email', placeholder: 'teacher@school.edu' },
    { label: 'Phone', field: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
    { label: 'Gender', field: 'gender' },
    { label: 'Employee ID', field: 'employeeId', placeholder: 'EMP-001' },
    { label: 'LinkedIn Profile', field: 'linkedInProfile', type: 'url', placeholder: 'https://www.linkedin.com/in/username' },
    { label: 'Login Username', field: 'username', placeholder: 'teacher.username' },
    { label: 'Password', field: 'password', type: 'password', placeholder: 'Create password' },
    { label: 'WhatsApp Phone', field: 'whatsAppPhone', type: 'tel', placeholder: '+91 98765 43210' },
  ]

  const professionalFields: Array<{
    label: string
    field: keyof TeacherFormValues
    type?: string
    placeholder?: string
  }> = [
    { label: 'Joining Date', field: 'joiningDate', type: 'date' },
    { label: 'Prior Experience', field: 'priorExperience', type: 'number', placeholder: 'Years' },
    { label: 'Relieving Date', field: 'relievingDate', type: 'date' },
    { label: 'Home Phone', field: 'homePhone', type: 'tel', placeholder: '+91 040 4000 1200' },
  ]

  return (
    <main className="role-main role-main-detail">
      <section className="role-primary teacher-profile-page">
        <div className="teacher-profile-topbar">
          <button type="button" className="role-secondary-btn" onClick={onBack}>
            <ArrowLeft size={16} />
            Back to Teachers
          </button>
        </div>

        <section className="teacher-profile-hero">
          <div className="teacher-profile-hero-main">
            <div className="teacher-card-avatar teacher-profile-hero-avatar teacher-card-avatar-empty" aria-label="No teacher profile photo">
              <UserCircle2 size={28} />
            </div>
            <div className="teacher-profile-hero-copy">
              <p className="teacher-profile-kicker">Create Teacher Profile</p>
              <h2>{previewName}</h2>
              <p className="teacher-card-subject">
                {values.subjectSpecializations.join(', ') || 'Add subject specializations and contact details.'}
              </p>
            </div>
          </div>
        </section>

        <form className="teacher-profile-editor-form" onSubmit={onSubmit}>
          <section className="teacher-profile-section">
            <div className="teacher-profile-section-head">
              <div>
                <h3>Basic Information</h3>
                <p className="role-muted">Fill in the core identity and contact details for this teacher.</p>
              </div>
            </div>

            <div className="teacher-profile-info-grid teacher-profile-form-grid">
              {basicFields.map((item) => (
                <label key={item.field} className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>{item.label}</span>
                  {item.field === 'gender' ? (
                    <select value={values.gender} onChange={(event) => onFieldChange('gender', event.target.value)} required>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <input
                      type={item.type || 'text'}
                      placeholder={item.placeholder}
                      value={values[item.field] as string}
                      onChange={(event) => onFieldChange(item.field, event.target.value)}
                      required={item.field !== 'whatsAppPhone'}
                    />
                  )}
                </label>
              ))}

              <label className="teacher-profile-readonly-field teacher-profile-input-field teacher-profile-field-span-3">
                <span>Address</span>
                <textarea
                  rows={4}
                  placeholder="Enter full address with city, state, country"
                  value={values.address}
                  onChange={(event) => onFieldChange('address', event.target.value)}
                  required
                />
              </label>
            </div>
          </section>

          <section className="teacher-profile-section">
            <div className="teacher-profile-section-head">
              <div>
                <h3>Professional Details</h3>
                <p className="role-muted">Capture work experience and employment details.</p>
              </div>
            </div>

            <div className="teacher-profile-info-grid teacher-profile-form-grid">
              {professionalFields.map((item) => (
                <label key={item.field} className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>{item.label}</span>
                  <input
                    type={item.type || 'text'}
                    placeholder={item.placeholder}
                    value={values[item.field] as string}
                    onChange={(event) => onFieldChange(item.field, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="teacher-profile-section">
            <div className="teacher-profile-section-head">
              <div>
                <h3>Subject Specializations</h3>
                <p className="role-muted">Choose the subjects this teacher can be assigned to teach.</p>
              </div>
            </div>

            <div className="teacher-class-picker teacher-subject-picker-grid">
              {subjectOptions.map((subject) => {
                const isActive = values.subjectSpecializations.includes(subject)

                return (
                  <button
                    key={subject}
                    type="button"
                    className={`teacher-class-option ${isActive ? 'is-active' : ''}`}
                    onClick={() => onToggleSubject(subject)}
                    aria-pressed={isActive}
                  >
                    <span className="teacher-class-option-label">{subject}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <div className="teacher-modal-actions teacher-modal-actions-end">
            <button type="button" className="role-secondary-btn" onClick={onBack}>
              Cancel
            </button>
            <button type="submit" className="role-primary-btn">
              <Save size={16} />
              Save
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default TeacherProfileEditor
