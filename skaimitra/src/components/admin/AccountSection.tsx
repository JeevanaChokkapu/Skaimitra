import type { StudentFormValues } from './studentTypes'

type AccountSectionProps = {
  values: StudentFormValues
  onFieldChange: (field: keyof StudentFormValues, value: string | boolean) => void
}

function AccountSection({ values, onFieldChange }: AccountSectionProps) {
  return (
    <section className="teacher-form-section">
      <div className="teacher-form-section-head">
        <h3>Account Information</h3>
        <p>Create the student&apos;s account credentials. Password hashing stays in the backend flow.</p>
      </div>

      <div className="teacher-form-grid">
        <label>
          <span>Username</span>
          <input
            type="text"
            placeholder="student.username"
            value={values.username}
            onChange={(e) => onFieldChange('username', e.target.value)}
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            placeholder="Create password"
            value={values.password}
            onChange={(e) => onFieldChange('password', e.target.value)}
            required
          />
        </label>
      </div>
    </section>
  )
}

export default AccountSection
