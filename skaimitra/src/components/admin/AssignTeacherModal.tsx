import { useMemo, useState, type FormEvent } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { getTeacherFullName, type AssignTeacherFormValues, type TeacherProfile } from './teacherTypes'

type AssignTeacherModalProps = {
  isOpen: boolean
  teacher: TeacherProfile | null
  values: AssignTeacherFormValues
  classOptions: string[]
  sectionOptions: string[]
  subjectOptions: string[]
  isEditing: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onFieldChange: (field: 'className', value: string) => void
  onToggleSubject: (subject: string) => void
  onToggleSection: (section: string) => void
}

function AssignTeacherModal({
  isOpen,
  teacher,
  values,
  classOptions,
  sectionOptions,
  subjectOptions,
  isEditing,
  onClose,
  onSubmit,
  onFieldChange,
  onToggleSubject,
  onToggleSection,
}: AssignTeacherModalProps) {
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false)

  const subjectSummary = useMemo(() => {
    if (!values.subjects.length) return 'Select subject'
    if (values.subjects.length === 1) return values.subjects[0]
    return `${values.subjects.length} subjects selected`
  }, [values.subjects])

  if (!isOpen || !teacher) return null

  return (
    <div className="role-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="role-modal teacher-modal teacher-assign-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${isEditing ? 'Edit' : 'Assign'} teacher ${getTeacherFullName(teacher)}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="role-modal-head teacher-modal-head teacher-assign-modal-head">
          <div>
            <h2>{isEditing ? `Edit Assignment: ${getTeacherFullName(teacher)}` : `Assign: ${getTeacherFullName(teacher)}`}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close assign teacher modal">
            <X size={18} />
          </button>
        </div>

        <form id="teacher-assign-form" className="teacher-modal-form" onSubmit={onSubmit}>
          <div className="teacher-assign-form-stack">
            <div className="teacher-assign-field">
              <div className="teacher-form-section-head">
                <h3>Subject</h3>
              </div>

              <div className="teacher-multiselect">
                <button
                  type="button"
                  className={`teacher-multiselect-trigger ${isSubjectMenuOpen ? 'is-open' : ''}`}
                  onClick={() => setIsSubjectMenuOpen((prev) => !prev)}
                >
                  <div className="teacher-multiselect-values">
                    {values.subjects.length ? (
                      values.subjects.map((subject) => (
                        <span key={subject} className="teacher-multiselect-chip">
                          {subject}
                          <span
                            role="button"
                            tabIndex={0}
                            className="teacher-multiselect-chip-remove"
                            onClick={(event) => {
                              event.stopPropagation()
                              onToggleSubject(subject)
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                event.stopPropagation()
                                onToggleSubject(subject)
                              }
                            }}
                          >
                            <X size={12} />
                          </span>
                        </span>
                      ))
                    ) : (
                      <span className="teacher-multiselect-placeholder">{subjectSummary}</span>
                    )}
                  </div>
                  <ChevronDown size={18} />
                </button>

                {isSubjectMenuOpen ? (
                  <div className="teacher-multiselect-menu">
                    {subjectOptions.map((subject) => (
                      <button
                        key={subject}
                        type="button"
                        className={`teacher-multiselect-option ${values.subjects.includes(subject) ? 'is-selected' : ''}`}
                        onClick={() => onToggleSubject(subject)}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="teacher-assign-inline-row">
              <div className="teacher-assign-field teacher-assign-field-class">
                <span className="teacher-form-field-label">Class</span>
                <select className="teacher-assign-select" value={values.className} onChange={(event) => onFieldChange('className', event.target.value)}>
                  <option value="">Select class</option>
                  {classOptions.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>

              <div className="teacher-assign-field teacher-assign-field-section">
                <span className="teacher-form-field-label">Section</span>
                <div className="teacher-assign-section-row">
                  {sectionOptions.map((section) => (
                    <label key={section} className="teacher-assign-section-option">
                      <input
                        type="checkbox"
                        checked={values.sections.includes(section)}
                        onChange={() => onToggleSection(section)}
                      />
                      <span>{section}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="teacher-modal-actions teacher-modal-actions-end">
            <button type="submit" className="role-primary-btn">
              Save
            </button>
            <button type="button" className="role-secondary-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AssignTeacherModal
