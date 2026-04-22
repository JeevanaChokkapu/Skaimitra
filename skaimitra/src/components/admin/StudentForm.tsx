import type { StudentFormValues } from './studentTypes'

type StudentFormProps = {
  values: StudentFormValues
  mode: 'create' | 'edit'
  classOptions: string[]
  sectionOptions: string[]
  onFieldChange: (field: keyof StudentFormValues, value: string) => void
}

function StudentForm({ values, mode, classOptions, sectionOptions, onFieldChange }: StudentFormProps) {
  return (
    <div className="student-form-shell">
      <section className="teacher-form-section">
        <div className="teacher-form-section-head">
          <h3>Student Details</h3>
          <p>
            {mode === 'edit'
              ? 'Update academic identity, section placement, and primary profile details.'
              : 'Academic identity, section placement, and primary profile details.'}
          </p>
        </div>

        <div className="teacher-form-grid">
          <label>
            <span>Student Name</span>
            <input
              type="text"
              placeholder="Full name"
              value={values.fullName}
              onChange={(e) => onFieldChange('fullName', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Admission No</span>
            <input
              type="text"
              placeholder="ADM-2026-001"
              value={values.admissionNo}
              onChange={(e) => onFieldChange('admissionNo', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Roll No</span>
            <input
              type="text"
              placeholder="24"
              value={values.rollNo}
              onChange={(e) => onFieldChange('rollNo', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Class</span>
            <select value={values.className} onChange={(e) => onFieldChange('className', e.target.value)} required>
              <option value="">Select class</option>
              {classOptions.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Section</span>
            <select value={values.section} onChange={(e) => onFieldChange('section', e.target.value)} required>
              <option value="">Select section</option>
              {sectionOptions.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Grade ID</span>
            <input
              type="text"
              placeholder="GR-06"
              value={values.gradeId}
              onChange={(e) => onFieldChange('gradeId', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Section ID</span>
            <input
              type="text"
              placeholder="SEC-A"
              value={values.sectionId}
              onChange={(e) => onFieldChange('sectionId', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Date of Birth</span>
            <input
              type="date"
              value={values.dateOfBirth}
              onChange={(e) => onFieldChange('dateOfBirth', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Gender</span>
            <select value={values.gender} onChange={(e) => onFieldChange('gender', e.target.value)} required>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="teacher-form-span-2">
            <span>Address</span>
            <textarea
              rows={4}
              placeholder="Enter residential address"
              value={values.address}
              onChange={(e) => onFieldChange('address', e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="teacher-form-section">
        <div className="teacher-form-section-head">
          <h3>Guardian Details</h3>
          <p>
            {mode === 'edit'
              ? 'Review and update guardian contact details used for school communication.'
              : 'Primary guardian contact details used for follow-ups and school communication.'}
          </p>
        </div>

        <div className="teacher-form-grid">
          <label>
            <span>Guardian Name</span>
            <input
              type="text"
              placeholder="Guardian full name"
              value={values.guardianName}
              onChange={(e) => onFieldChange('guardianName', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Relation</span>
            <select value={values.relation} onChange={(e) => onFieldChange('relation', e.target.value)} required>
              <option value="">Select relation</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Guardian">Guardian</option>
            </select>
          </label>

          <label>
            <span>Guardian Phone</span>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={values.guardianPhone}
              onChange={(e) => onFieldChange('guardianPhone', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Guardian Email</span>
            <input
              type="email"
              placeholder="guardian@school.edu"
              value={values.guardianEmail}
              onChange={(e) => onFieldChange('guardianEmail', e.target.value)}
              required
            />
          </label>
        </div>
      </section>
    </div>
  )
}

export default StudentForm
