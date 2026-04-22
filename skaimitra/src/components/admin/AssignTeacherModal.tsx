import type { FormEvent } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { getTeacherFullName, type AssignTeacherFormValues, type TeacherProfile } from './teacherTypes'

type AssignTeacherModalProps = {
  isOpen: boolean
  teacher: TeacherProfile | null
  values: AssignTeacherFormValues
  courseOptions: string[]
  classOptions: string[]
  sectionOptions: string[]
  subjectOptions: string[]
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onFieldChange: (field: keyof Omit<AssignTeacherFormValues, 'subjects'>, value: string) => void
  onToggleSubject: (subject: string) => void
}

function AssignTeacherModal({
  isOpen,
  teacher,
  values,
  courseOptions,
  classOptions,
  sectionOptions,
  subjectOptions,
  onClose,
  onSubmit,
  onFieldChange,
  onToggleSubject,
}: AssignTeacherModalProps) {
  if (!isOpen || !teacher) return null

  return (
    <div className="role-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="role-modal teacher-modal teacher-assign-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Assign teacher ${getTeacherFullName(teacher)}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="role-modal-head teacher-modal-head">
          <div>
            <h2>Assign Teacher: {getTeacherFullName(teacher)}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close assign teacher modal">
            <X size={18} />
          </button>
        </div>

        <form className="teacher-modal-form" onSubmit={onSubmit}>
          <div className="teacher-assign-grid">
            <label>
              <span>Course</span>
              <div className="teacher-select-wrap">
                <select value={values.course} onChange={(e) => onFieldChange('course', e.target.value)} required>
                  <option value="">Select course</option>
                  {courseOptions.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
            </label>

            <label>
              <span>Class</span>
              <div className="teacher-select-wrap">
                <select value={values.className} onChange={(e) => onFieldChange('className', e.target.value)} required>
                  <option value="">Select class</option>
                  {classOptions.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
            </label>

            <label>
              <span>Section</span>
              <div className="teacher-select-wrap">
                <select value={values.section} onChange={(e) => onFieldChange('section', e.target.value)} required>
                  <option value="">Select section</option>
                  {sectionOptions.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
            </label>
          </div>

          <section className="teacher-assign-subjects">
            <div className="teacher-form-section-head">
              <h3>Subjects to Teach</h3>
            </div>

            <div className="teacher-assign-subject-grid">
              {subjectOptions.map((subject) => (
                <label key={subject} className="teacher-assign-subject-option">
                  <input
                    type="checkbox"
                    checked={values.subjects.includes(subject)}
                    onChange={() => onToggleSubject(subject)}
                  />
                  <span>{subject}</span>
                </label>
              ))}
            </div>
          </section>

          <div className="teacher-modal-actions teacher-modal-actions-end">
            <button type="button" className="role-secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="role-primary-btn">
              Assign Teacher
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AssignTeacherModal
