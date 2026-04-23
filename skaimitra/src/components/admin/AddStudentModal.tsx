import type { ChangeEvent, FormEvent } from 'react'
import { X } from 'lucide-react'
import AccountSection from './AccountSection'
import ContactInfoSection from './ContactInfoSection'
import GuardianSection from './GuardianSection'
import PrimaryInfoSection from './PrimaryInfoSection'
import type { GuardianContact, StudentFormValues } from './studentTypes'

type AddStudentModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  values: StudentFormValues
  stateOptions: string[]
  countryOptions: string[]
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onFieldChange: (field: keyof StudentFormValues, value: string | boolean) => void
  onGuardianChange: (guardianId: string, field: keyof GuardianContact, value: string) => void
  onAddGuardian: () => void
  onRemoveGuardian: (guardianId: string) => void
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function AddStudentModal({
  isOpen,
  mode,
  values,
  stateOptions,
  countryOptions,
  onClose,
  onSubmit,
  onFieldChange,
  onGuardianChange,
  onAddGuardian,
  onRemoveGuardian,
  onPhotoChange,
}: AddStudentModalProps) {
  if (!isOpen) return null

  return (
    <div className="role-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="role-modal teacher-modal teacher-form-modal student-form-modal"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'edit' ? 'Edit student' : 'Add student'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="role-modal-head teacher-modal-head">
          <div>
            <h2>{mode === 'edit' ? 'Edit Student' : 'Add Student'}</h2>
            <p className="role-muted">Create a clean, section-based onboarding flow for student profile, contact, guardians, and account setup.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close add student modal">
            <X size={18} />
          </button>
        </div>

        <form className="teacher-modal-form student-modal-form-layout" onSubmit={onSubmit}>
          <PrimaryInfoSection
            values={values}
            stateOptions={stateOptions}
            countryOptions={countryOptions}
            onFieldChange={onFieldChange}
            onPhotoChange={onPhotoChange}
          />
          <ContactInfoSection values={values} onFieldChange={onFieldChange} />
          <GuardianSection
            guardians={values.guardians}
            onGuardianChange={onGuardianChange}
            onAddGuardian={onAddGuardian}
            onRemoveGuardian={onRemoveGuardian}
          />
          <AccountSection values={values} onFieldChange={onFieldChange} />

          <div className="teacher-modal-actions student-modal-actions">
            <button type="submit" className="role-primary-btn">
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddStudentModal
