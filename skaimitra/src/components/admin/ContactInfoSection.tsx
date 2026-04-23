import type { StudentFormValues } from './studentTypes'

type ContactInfoSectionProps = {
  values: StudentFormValues
  onFieldChange: (field: keyof StudentFormValues, value: string | boolean) => void
}

function ContactInfoSection({ values, onFieldChange }: ContactInfoSectionProps) {
  return (
    <section className="teacher-form-section">
      <div className="teacher-form-section-head">
        <h3>Contact Information</h3>
        <p>Use mailing and permanent addresses for communication and records.</p>
      </div>

      <div className="teacher-form-grid">
        <label className="teacher-form-span-2">
          <span>Mailing Address</span>
          <textarea
            rows={4}
            placeholder="Mailing address"
            value={values.mailingAddress}
            onChange={(e) => onFieldChange('mailingAddress', e.target.value)}
          />
        </label>

        <label className="teacher-form-span-2 student-checkbox-field">
          <input
            type="checkbox"
            checked={values.sameAsMailingAddress}
            onChange={(e) => onFieldChange('sameAsMailingAddress', e.target.checked)}
          />
          <span>Same as mailing address</span>
        </label>

        <label className="teacher-form-span-2">
          <span>Permanent Address</span>
          <textarea
            rows={4}
            placeholder="Permanent address"
            value={values.permanentAddress}
            onChange={(e) => onFieldChange('permanentAddress', e.target.value)}
            disabled={values.sameAsMailingAddress}
          />
        </label>

        <label>
          <span>Phone Number</span>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="9876543210"
            value={values.phoneNumber}
            onChange={(e) => onFieldChange('phoneNumber', e.target.value)}
          />
        </label>
      </div>
    </section>
  )
}

export default ContactInfoSection
