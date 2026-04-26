import { teacherContactPersonOptions, type TeacherFormValues } from './teacherTypes'

type TeacherFormProps = {
  values: TeacherFormValues
  mode: 'create' | 'edit'
  subjectOptions: string[]
  onFieldChange: (field: keyof TeacherFormValues, value: string) => void
  onToggleSubject: (subject: string) => void
}

function TeacherForm({ values, mode, subjectOptions, onFieldChange, onToggleSubject }: TeacherFormProps) {
  return (
    <div className="teacher-form-shell">
      <section className="teacher-form-section">
        <div className="teacher-form-section-head">
          <h3>Primary Information</h3>
          <p>Identity and location details for the teacher profile.</p>
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
            <span>Middle Name</span>
            <input
              type="text"
              placeholder="Middle name"
              value={values.middleName}
              onChange={(e) => onFieldChange('middleName', e.target.value)}
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
              placeholder="Enter street address"
              value={values.address}
              onChange={(e) => onFieldChange('address', e.target.value)}
              required
            />
          </label>

          <label>
            <span>City</span>
            <input
              type="text"
              placeholder="Hyderabad"
              value={values.city}
              onChange={(e) => onFieldChange('city', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Pincode</span>
            <input
              type="text"
              placeholder="500001"
              value={values.pincode}
              onChange={(e) => onFieldChange('pincode', e.target.value)}
              required
            />
          </label>

          <label>
            <span>State</span>
            <input
              type="text"
              placeholder="Telangana"
              value={values.state}
              onChange={(e) => onFieldChange('state', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Country</span>
            <input
              type="text"
              placeholder="India"
              value={values.country}
              onChange={(e) => onFieldChange('country', e.target.value)}
              required
            />
          </label>
        </div>
      </section>

      <section className="teacher-form-section">
        <div className="teacher-form-section-head">
          <h3>Contact Information</h3>
          <p>Preferred contact person and communication details.</p>
        </div>

        <div className="teacher-form-grid">
          <label>
            <span>Contact Person</span>
            <select value={values.contactPerson} onChange={(e) => onFieldChange('contactPerson', e.target.value)}>
              {teacherContactPersonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              placeholder="teacher@school.edu"
              value={values.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              required
            />
          </label>

          <label>
            <span>WhatsApp</span>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={values.whatsAppPhone}
              onChange={(e) => onFieldChange('whatsAppPhone', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Phone</span>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={values.phone}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Home Phone</span>
            <input
              type="tel"
              placeholder="+91 040 4000 1200"
              value={values.homePhone}
              onChange={(e) => onFieldChange('homePhone', e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="teacher-form-section">
        <div className="teacher-form-section-head">
          <h3>Other Details</h3>
          <p>Login and employment details for this teacher.</p>
        </div>

        <div className="teacher-form-grid">
          <label>
            <span>Employee ID</span>
            <input
              type="text"
              placeholder="EMP-001"
              value={values.employeeId}
              onChange={(e) => onFieldChange('employeeId', e.target.value)}
              required
            />
          </label>

          <label>
            <span>LinkedIn Profile</span>
            <input
              type="url"
              placeholder="https://www.linkedin.com/in/username"
              value={values.linkedInProfile}
              onChange={(e) => onFieldChange('linkedInProfile', e.target.value)}
            />
          </label>

          <label>
            <span>Login Username</span>
            <input
              type="text"
              placeholder="teacher.username"
              value={values.username}
              onChange={(e) => onFieldChange('username', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              placeholder="Create password"
              value={values.password}
              onChange={(e) => onFieldChange('password', e.target.value)}
              required={mode === 'create'}
            />
          </label>

          <label>
            <span>Joining Date</span>
            <input
              type="date"
              value={values.joiningDate}
              onChange={(e) => onFieldChange('joiningDate', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Prior Experience</span>
            <input
              type="number"
              min="0"
              placeholder="Years"
              value={values.priorExperience}
              onChange={(e) => onFieldChange('priorExperience', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Relieving Date</span>
            <input
              type="date"
              value={values.relievingDate}
              onChange={(e) => onFieldChange('relievingDate', e.target.value)}
            />
          </label>

          <div className="teacher-form-span-2 teacher-assign-subjects">
            <div className="teacher-form-section-head">
              <h3>Assign Subjects</h3>
            </div>

            <div className="teacher-subject-grid">
              {subjectOptions.map((subject) => (
                <label key={subject} className="teacher-assign-subject-option">
                  <input
                    type="checkbox"
                    checked={values.subjectSpecializations.includes(subject)}
                    onChange={() => onToggleSubject(subject)}
                  />
                  <span>{subject}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TeacherForm
