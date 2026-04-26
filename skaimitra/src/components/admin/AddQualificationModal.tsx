import { type ChangeEvent, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { teacherDegreeOptions, teacherQualificationOptions, type TeacherQualificationFormValues } from './teacherTypes'

type AddQualificationModalProps = {
  isOpen: boolean
  values: TeacherQualificationFormValues
  certificateName: string
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onFieldChange: (field: keyof TeacherQualificationFormValues, value: string) => void
  onCertificateChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function AddQualificationModal({
  isOpen,
  values,
  certificateName,
  onClose,
  onSubmit,
  onFieldChange,
  onCertificateChange,
}: AddQualificationModalProps) {
  if (!isOpen) return null

  return (
    <div className="role-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="role-modal teacher-modal teacher-qualification-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Add qualification"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="role-modal-head teacher-modal-head">
          <div>
            <h2>Add Qualification</h2>
            <p className="role-muted">Capture degree details and upload a supporting certificate.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close add qualification modal">
            <X size={18} />
          </button>
        </div>

        <form className="teacher-modal-form" onSubmit={onSubmit}>
          <div className="teacher-form-grid">
            <label>
              <span>Qualification</span>
              <select
                value={values.qualification}
                onChange={(event) => onFieldChange('qualification', event.target.value)}
                required
              >
                <option value="">Select qualification</option>
                {teacherQualificationOptions.map((qualification) => (
                  <option key={qualification} value={qualification}>
                    {qualification}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Degree</span>
              <select
                value={values.degree}
                onChange={(event) => onFieldChange('degree', event.target.value)}
                required
              >
                <option value="">Select degree</option>
                {teacherDegreeOptions.map((degree) => (
                  <option key={degree} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Year of Graduation</span>
              <input
                type="number"
                min="1980"
                max="2100"
                placeholder="2020"
                value={values.graduationYear}
                onChange={(event) => onFieldChange('graduationYear', event.target.value)}
                required
              />
            </label>

            <label>
              <span>Institution Name</span>
              <input
                type="text"
                placeholder="XYZ University"
                value={values.institutionName}
                onChange={(event) => onFieldChange('institutionName', event.target.value)}
                required
              />
            </label>

            <label className="teacher-form-span-2">
              <span>Certificate Upload</span>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={onCertificateChange} required />
              {certificateName ? <small className="role-muted">{certificateName}</small> : null}
            </label>
          </div>

          <div className="teacher-modal-actions teacher-modal-actions-end">
            <button type="button" className="role-secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="role-primary-btn">
              Save Qualification
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddQualificationModal
