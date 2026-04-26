import type { ChangeEvent } from 'react'
import type { StudentFormValues } from './studentTypes'

type PrimaryInfoSectionProps = {
  values: StudentFormValues
  stateOptions: string[]
  countryOptions: string[]
  onFieldChange: (field: keyof StudentFormValues, value: string | boolean) => void
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function PrimaryInfoSection({
  values,
  stateOptions,
  countryOptions,
  onFieldChange,
  onPhotoChange,
}: PrimaryInfoSectionProps) {
  return (
    <section className="teacher-form-section">
      <div className="teacher-form-section-head">
        <h3>Primary Information</h3>
      </div>

      <div className="teacher-form-grid">
        <label>
          <span>First Name</span>
          <input
            type="text"
            placeholder="First name"
            value={values.firstName}
            onChange={(e) => onFieldChange('firstName', e.target.value)}
            required
          />
        </label>

        <label>
          <span>Last Name</span>
          <input
            type="text"
            placeholder="Last name"
            value={values.lastName}
            onChange={(e) => onFieldChange('lastName', e.target.value)}
            required
          />
        </label>

        <label>
          <span>Date of Birth</span>
          <input
            type="date"
            value={values.dateOfBirth}
            onChange={(e) => onFieldChange('dateOfBirth', e.target.value)}
          />
        </label>

        <label>
          <span>Gender</span>
          <select value={values.gender} onChange={(e) => onFieldChange('gender', e.target.value)}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="teacher-form-span-2">
          <span>Address Line</span>
          <textarea
            rows={4}
            placeholder="Street, building, landmark"
            value={values.addressLine}
            onChange={(e) => onFieldChange('addressLine', e.target.value)}
          />
        </label>

        <label>
          <span>City</span>
          <input type="text" placeholder="City" value={values.city} onChange={(e) => onFieldChange('city', e.target.value)} />
        </label>

        <label>
          <span>State</span>
          <select value={values.state} onChange={(e) => onFieldChange('state', e.target.value)}>
            <option value="">Select state</option>
            {stateOptions.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Country</span>
          <select value={values.country} onChange={(e) => onFieldChange('country', e.target.value)}>
            <option value="">Select country</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>

        <label className="teacher-form-span-2">
          <span>Profile Photo Upload</span>
          <input type="file" accept="image/*" onChange={onPhotoChange} />
        </label>

        <div className="teacher-form-span-2 student-photo-preview-card">
          <span className="student-photo-preview-label">Preview</span>
          {values.profilePhoto ? (
            <img src={values.profilePhoto} alt="Student profile preview" className="student-photo-preview-image" />
          ) : (
            <div className="student-photo-preview-empty">Upload an image to preview the profile photo.</div>
          )}
        </div>
      </div>
    </section>
  )
}

export default PrimaryInfoSection
