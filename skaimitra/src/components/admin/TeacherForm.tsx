import type { TeacherFormValues } from './teacherTypes'

type TeacherFormProps = {
  values: TeacherFormValues
  mode: 'create' | 'edit'
  subjectOptions: string[]
  onFieldChange: (field: keyof TeacherFormValues, value: string) => void
  onToggleSubject: (subject: string) => void
}

function TeacherForm({ values, mode, subjectOptions, onFieldChange, onToggleSubject }: TeacherFormProps) {
  if (mode === 'edit') {
    return (
      <div className="teacher-form-shell">
        <section className="teacher-form-section">
          <div className="teacher-form-section-head">
            <h3>Edit Teacher</h3>
            <p>Update the core profile and employment details for this teacher.</p>
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
              <span>Phone</span>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={values.phone}
                onChange={(e) => onFieldChange('phone', e.target.value)}
                required
              />
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

            <label>
              <span>Gender</span>
              <select value={values.gender} onChange={(e) => onFieldChange('gender', e.target.value)} required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
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
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="teacher-form-shell">
      <section className="teacher-form-section">
        <div className="teacher-form-section-head">
          <h3>Basic Details</h3>
          <p>Identity, login, and contact information.</p>
        </div>

        <div className="teacher-form-grid">
          <label>
            <span>Username</span>
            <input
              type="text"
              placeholder="teacher.username"
              value={values.username}
              onChange={(e) => onFieldChange('username', e.target.value)}
              required
            />
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
            <span>Password</span>
            <input
              type="password"
              placeholder="Create password"
              value={values.password}
              onChange={(e) => onFieldChange('password', e.target.value)}
              required
            />
          </label>

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

          <label>
            <span>WhatsApp Phone</span>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={values.whatsAppPhone}
              onChange={(e) => onFieldChange('whatsAppPhone', e.target.value)}
            />
          </label>

          <label className="teacher-form-span-2">
            <span>Address</span>
            <textarea
              rows={4}
              placeholder="Enter residential address"
              value={values.address}
              onChange={(e) => onFieldChange('address', e.target.value)}
              required
            />
          </label>
        </div>
      </section>

      <section className="teacher-form-section">
        <div className="teacher-form-section-head">
          <h3>Professional Details</h3>
          <p>Academic profile and employment details.</p>
        </div>

        <div className="teacher-form-grid">
          <label>
            <span>Gender</span>
            <select value={values.gender} onChange={(e) => onFieldChange('gender', e.target.value)} required>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
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
              <h3>Subject Specialization</h3>
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
