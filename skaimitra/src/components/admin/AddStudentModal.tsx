import type { FormEvent } from 'react'
import { X } from 'lucide-react'
import StudentForm from './StudentForm'
import type { StudentFormValues } from './studentTypes'

type AddStudentModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  values: StudentFormValues
  classOptions: string[]
  sectionOptions: string[]
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onFieldChange: (field: keyof StudentFormValues, value: string) => void
}

function AddStudentModal({
  isOpen,
  mode,
  values,
  classOptions,
  sectionOptions,
  onClose,
  onSubmit,
  onFieldChange,
}: AddStudentModalProps) {
  if (!isOpen) return null

  return (
    <div className="role-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="role-modal teacher-modal teacher-form-modal"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'edit' ? 'Edit student' : 'Add student'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="role-modal-head teacher-modal-head">
          <div>
            <h2>{mode === 'edit' ? 'Edit Student' : 'Add Student'}</h2>
            <p className="role-muted">
              {mode === 'edit'
                ? 'Update student and guardian details from one clean form.'
                : 'Add a student profile with academic placement and guardian information.'}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close add student modal">
            <X size={18} />
          </button>
        </div>

        <form className="teacher-modal-form" onSubmit={onSubmit}>
          <StudentForm
            values={values}
            mode={mode}
            classOptions={classOptions}
            sectionOptions={sectionOptions}
            onFieldChange={onFieldChange}
          />

          <div className="teacher-modal-actions">
            <button type="button" className="role-secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="role-primary-btn">
              {mode === 'edit' ? 'Save Changes' : 'Save Student'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddStudentModal
