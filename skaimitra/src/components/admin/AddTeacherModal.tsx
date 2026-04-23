import type { FormEvent } from 'react'
import { X } from 'lucide-react'
import TeacherForm from './TeacherForm'
import type { TeacherFormValues } from './teacherTypes'

type AddTeacherModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  values: TeacherFormValues
  subjectOptions: string[]
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onFieldChange: (field: keyof TeacherFormValues, value: string) => void
  onToggleSubject: (subject: string) => void
}

function AddTeacherModal({
  isOpen,
  mode,
  values,
  subjectOptions,
  onClose,
  onSubmit,
  onFieldChange,
  onToggleSubject,
}: AddTeacherModalProps) {
  if (!isOpen) return null

  return (
    <div className="role-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="role-modal teacher-modal teacher-form-modal"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'edit' ? 'Edit teacher' : 'Add teacher'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="role-modal-head teacher-modal-head">
          <div>
            <h2>{mode === 'edit' ? 'Edit Teacher' : 'Add Teacher'}</h2>
            <p className="role-muted">
              {mode === 'edit'
                ? 'Update the teacher profile with only the details that matter.'
                : 'Create a complete teacher profile for staff management and assignments.'}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close add teacher modal">
            <X size={18} />
          </button>
        </div>

        <form className="teacher-modal-form" onSubmit={onSubmit}>
          <TeacherForm
            values={values}
            mode={mode}
            subjectOptions={subjectOptions}
            onFieldChange={onFieldChange}
            onToggleSubject={onToggleSubject}
          />

          <div className="teacher-modal-actions">
            <button type="button" className="role-secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="role-primary-btn">
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddTeacherModal
