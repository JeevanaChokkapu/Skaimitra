import type { ChangeEvent, FormEvent } from 'react'
import { ArrowLeft, Pencil, Plus, Save, Trash2, UserCircle2 } from 'lucide-react'
import {
  getStudentFullName,
  getStudentInitials,
  type GuardianContact,
  type StudentFormValues,
  type StudentProfile,
} from './studentTypes'

type StudentProfileViewProps = {
  mode: 'view'
  student: StudentProfile
  onBack: () => void
  onEdit: () => void
}

type StudentProfileEditorProps = {
  mode: 'create' | 'edit'
  student: StudentFormValues
  classOptions: string[]
  sectionOptions: string[]
  stateOptions: string[]
  countryOptions: string[]
  onBack: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onFieldChange: (field: keyof StudentFormValues, value: string | boolean) => void
  onGuardianChange: (guardianId: string, field: keyof GuardianContact, value: string) => void
  onAddGuardian: () => void
  onRemoveGuardian: (guardianId: string) => void
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void
}

type StudentProfilePageProps = StudentProfileViewProps | StudentProfileEditorProps

const studentCategoryOptions = ['General', 'OBC', 'SC', 'ST', 'Others']
const studentReligionOptions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Others']

function StudentReadonlyField({
  label,
  value,
  className = '',
  href = '',
}: {
  label: string
  value: string
  className?: string
  href?: string
}) {
  const displayValue = value || 'Not available'

  return (
    <label className={`student-profile-field ${className}`.trim()}>
      <span>{label}</span>
      {href && value ? (
        <a className="profile-clickable-field" href={href}>
          {displayValue}
        </a>
      ) : (
        <input type="text" value={displayValue} readOnly />
      )}
    </label>
  )
}

function StudentProfilePage(props: StudentProfilePageProps) {
  const isViewMode = props.mode === 'view'
  const displayName = getStudentFullName(props.student)
  const profilePhoto = props.student.profilePhoto

  return (
    <main className="role-main role-main-detail">
      <section className="role-primary student-profile-page">
        <div className="student-profile-topbar">
          <button type="button" className="role-secondary-btn" onClick={props.onBack}>
            <ArrowLeft size={16} />
            Back to Students
          </button>
        </div>

        <section className="student-profile-shell">
          <div className="student-profile-head">
            <div>
              <p className="student-profile-kicker">Student Profile</p>
              <h2>{props.mode === 'create' ? 'Add Student' : isViewMode ? displayName || 'Student Details' : 'Edit Student'}</h2>
              {/* <p className="role-muted">
                {isViewMode
                  ? 'Review the student record in a structured ERP-style layout.'
                  : 'Capture student identity, contact, guardian, and account details in one full-page form.'}
              </p> */}
            </div>

            {isViewMode ? (
              <button type="button" className="role-primary-btn" onClick={props.onEdit}>
                <Pencil size={16} />
                Edit Student
              </button>
            ) : null}
          </div>

          {isViewMode ? (
            <>
              <section className="student-profile-section">
                <div className="student-profile-section-head">
                  <div>
                    <h3>Primary Information</h3>
                  </div>
                </div>

                <div className="student-profile-primary-grid">
                  <div className="student-profile-photo-card">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt={displayName || 'Student'} className="student-profile-photo-image" />
                    ) : (
                      <div className="student-profile-photo-placeholder">
                        <UserCircle2 size={56} />
                        <strong>{getStudentInitials(props.student)}</strong>
                      </div>
                    )}
                    <span>Profile Photo</span>
                  </div>

                  <div className="student-profile-fields-grid">
                    <StudentReadonlyField label="First Name" value={props.student.firstName} />
                    <StudentReadonlyField label="Middle Name" value={props.student.middleName} />
                    <StudentReadonlyField label="Last Name" value={props.student.lastName} />
                    <StudentReadonlyField label="Admission Number" value={props.student.admissionNumber} />
                    <StudentReadonlyField label="Roll Number" value={props.student.rollNumber} />
                    <StudentReadonlyField label="Class" value={props.student.className} />
                    <StudentReadonlyField label="Section" value={props.student.section} />
                    <StudentReadonlyField label="Date of Birth" value={props.student.dateOfBirth} />
                    <StudentReadonlyField label="Gender" value={props.student.gender} />
                    <StudentReadonlyField label="Category" value={props.student.category} />
                    <StudentReadonlyField label="Religion" value={props.student.religion} />
                    <StudentReadonlyField label="Address Line" value={props.student.addressLine} className="student-profile-field-span-2" />
                    <StudentReadonlyField label="City" value={props.student.city} />
                    <StudentReadonlyField label="State" value={props.student.state} />
                  <StudentReadonlyField label="Country" value={props.student.country} />
                  <StudentReadonlyField label="Pincode" value={props.student.pincode} />
                </div>
              </div>
            </section>

              <section className="student-profile-section">
                <div className="student-profile-section-head">
                  <div>
                    <h3>Contact Information</h3>
                  
                  </div>
                </div>

                <div className="student-profile-fields-grid student-contact-grid">
                  <StudentReadonlyField label="Mailing Address" value={props.student.mailingAddress} />
                  <StudentReadonlyField
                    label="Permanent Address"
                    value={props.student.permanentAddress}
                  />
                  <StudentReadonlyField label="Email" value={props.student.email} href={`mailto:${props.student.email}`} />
                  <StudentReadonlyField label="WhatsApp Phone" value={props.student.whatsAppPhone} />
                  <StudentReadonlyField label="Phone Number" value={props.student.phoneNumber} />
                  <StudentReadonlyField label="Emergency Contact Name" value={props.student.emergencyContactName} />
                  <StudentReadonlyField label="Emergency Contact Phone" value={props.student.emergencyContactPhone} />
                </div>
              </section>

              <section className="student-profile-section">
                <div className="student-profile-section-head">
                  <div>
                    <h3>Parent / Guardian</h3>
                    
                  </div>
                </div>

                <div className="student-profile-guardian-list">
                  {props.student.guardians.map((guardian, index) => (
                    <article key={guardian.id} className="student-profile-guardian-card">
                      <div className="student-profile-guardian-head">
                        <strong>{guardian.relation || `Guardian ${index + 1}`}</strong>
                      </div>
                      <div className="student-profile-fields-grid">
                        <StudentReadonlyField label="Name" value={guardian.name} />
                        <StudentReadonlyField label="Relation" value={guardian.relation} />
                        <StudentReadonlyField label="Phone" value={guardian.phone} />
                        <StudentReadonlyField label="Email" value={guardian.email} href={`mailto:${guardian.email}`} />
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="student-profile-section">
                <div className="student-profile-section-head">
                  <div>
                    <h3>Account Information</h3>
                    
                  </div>
                </div>

                <div className="student-profile-fields-grid">
                  <StudentReadonlyField label="Username" value={props.student.username} />
                  <StudentReadonlyField label="Password" value={props.student.password ? '********' : ''} />
                </div>
              </section>

              <section className="student-profile-section">
                <div className="student-profile-section-head">
                  <div>
                    <h3>History</h3>
                  </div>
                </div>

                <div className="student-profile-fields-grid">
                  <StudentReadonlyField label="Reports" value={props.student.reports} href={props.student.reports} />
                  <StudentReadonlyField label="Admission Year" value={props.student.admissionYear} />
                  <StudentReadonlyField label="Class" value={props.student.historyClass} />
                  <StudentReadonlyField label="Section" value={props.student.historySection} />
                  <StudentReadonlyField label="Passed Out Year" value={props.student.historyPassedOutYear} />
                  <StudentReadonlyField label="Marks / Grade" value={props.student.historyMarksOrGrade} />
                </div>
              </section>
            </>
          ) : (
            <form className="student-profile-form" onSubmit={props.onSubmit}>
              <section className="student-profile-section">
                <div className="student-profile-section-head">
                  <div>
                    <h3>Primary Information</h3>
                  </div>
                </div>

                <div className="student-profile-primary-grid">
                  <div className="student-profile-photo-card student-profile-photo-card-edit">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt={displayName || 'Student preview'} className="student-profile-photo-image" />
                    ) : (
                      <div className="student-profile-photo-placeholder">
                        <UserCircle2 size={56} />
                        <strong>{getStudentInitials(props.student)}</strong>
                      </div>
                    )}
                    <label className="student-profile-upload-field">
                      <span>Profile Photo Upload</span>
                      <input type="file" accept="image/*" onChange={props.onPhotoChange} />
                    </label>
                  </div>

                  <div className="student-profile-fields-grid">
                    <label className="student-profile-field">
                      <span>First Name</span>
                      <input
                        type="text"
                        value={props.student.firstName}
                        onChange={(event) => props.onFieldChange('firstName', event.target.value)}
                        required
                      />
                    </label>
                    <label className="student-profile-field">
                      <span>Middle Name</span>
                      <input
                        type="text"
                        value={props.student.middleName}
                        onChange={(event) => props.onFieldChange('middleName', event.target.value)}
                      />
                    </label>
                    <label className="student-profile-field">
                      <span>Last Name</span>
                      <input
                        type="text"
                        value={props.student.lastName}
                        onChange={(event) => props.onFieldChange('lastName', event.target.value)}
                        required
                      />
                    </label>
                    <label className="student-profile-field">
                      <span>Admission Number</span>
                      <input
                        type="text"
                        value={props.student.admissionNumber}
                        onChange={(event) => props.onFieldChange('admissionNumber', event.target.value)}
                      />
                    </label>
                    <label className="student-profile-field">
                      <span>Roll Number</span>
                      <input
                        type="text"
                        value={props.student.rollNumber}
                        onChange={(event) => props.onFieldChange('rollNumber', event.target.value)}
                      />
                    </label>
                    <label className="student-profile-field">
                      <span>Class</span>
                      <select value={props.student.className} onChange={(event) => props.onFieldChange('className', event.target.value)}>
                        <option value="">Select class</option>
                        {props.classOptions.map((className) => (
                          <option key={className} value={className}>
                            {className}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="student-profile-field">
                      <span>Section</span>
                      <select value={props.student.section} onChange={(event) => props.onFieldChange('section', event.target.value)}>
                        <option value="">Select section</option>
                        {props.sectionOptions.map((section) => (
                          <option key={section} value={section}>
                            {section}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="student-profile-field">
                      <span>Date of Birth</span>
                      <input
                        type="date"
                        value={props.student.dateOfBirth}
                        onChange={(event) => props.onFieldChange('dateOfBirth', event.target.value)}
                      />
                    </label>
                    <label className="student-profile-field">
                      <span>Gender</span>
                      <select value={props.student.gender} onChange={(event) => props.onFieldChange('gender', event.target.value)}>
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                    <label className="student-profile-field">
                      <span>Category</span>
                      <select value={props.student.category} onChange={(event) => props.onFieldChange('category', event.target.value)}>
                        <option value="">Select category</option>
                        {studentCategoryOptions.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="student-profile-field">
                      <span>Religion</span>
                      <select value={props.student.religion} onChange={(event) => props.onFieldChange('religion', event.target.value)}>
                        <option value="">Select religion</option>
                        {studentReligionOptions.map((religion) => (
                          <option key={religion} value={religion}>
                            {religion}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="student-profile-field student-profile-field-span-2">
                      <span>Address Line</span>
                      <textarea
                        rows={4}
                        value={props.student.addressLine}
                        onChange={(event) => props.onFieldChange('addressLine', event.target.value)}
                      />
                    </label>
                    <label className="student-profile-field">
                      <span>City</span>
                      <input type="text" value={props.student.city} onChange={(event) => props.onFieldChange('city', event.target.value)} />
                    </label>
                    <label className="student-profile-field">
                      <span>State</span>
                      <select value={props.student.state} onChange={(event) => props.onFieldChange('state', event.target.value)}>
                        <option value="">Select state</option>
                        {props.stateOptions.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="student-profile-field">
                      <span>Country</span>
                      <select value={props.student.country} onChange={(event) => props.onFieldChange('country', event.target.value)}>
                        <option value="">Select country</option>
                        {props.countryOptions.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="student-profile-field">
                      <span>Pincode</span>
                      <input type="text" value={props.student.pincode} onChange={(event) => props.onFieldChange('pincode', event.target.value)} />
                    </label>
                  </div>
                </div>
              </section>

              <section className="student-profile-section">
                <div className="student-profile-section-head">
                  <div>
                    <h3>Contact Information</h3>
                  </div>
                </div>

                <div className="student-profile-fields-grid student-contact-grid">
                  <label className="student-profile-field">
                    <span>Mailing Address</span>
                    <textarea
                      rows={4}
                      value={props.student.mailingAddress}
                      onChange={(event) => props.onFieldChange('mailingAddress', event.target.value)}
                    />
                  </label>
                  <label className="student-profile-field student-profile-checkbox">
                    <input
                      type="checkbox"
                      checked={props.student.sameAsMailingAddress}
                      onChange={(event) => props.onFieldChange('sameAsMailingAddress', event.target.checked)}
                    />
                    <span>Permanent address same as mailing address</span>
                  </label>
                  <label className="student-profile-field">
                    <span>Permanent Address</span>
                    <textarea
                      rows={4}
                      value={props.student.permanentAddress}
                      onChange={(event) => props.onFieldChange('permanentAddress', event.target.value)}
                      disabled={props.student.sameAsMailingAddress}
                    />
                  </label>
                  <label className="student-profile-field">
                    <span>Email</span>
                    <input
                      type="email"
                      value={props.student.email}
                      onChange={(event) => props.onFieldChange('email', event.target.value)}
                      required
                    />
                  </label>
                  <label className="student-profile-field">
                    <span>WhatsApp Phone</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={props.student.whatsAppPhone}
                      onChange={(event) => props.onFieldChange('whatsAppPhone', event.target.value)}
                      required
                    />
                  </label>
                  <label className="student-profile-field">
                    <span>Phone Number</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={props.student.phoneNumber}
                      onChange={(event) => props.onFieldChange('phoneNumber', event.target.value)}
                    />
                  </label>
                  <label className="student-profile-field student-profile-checkbox student-profile-field-span-2">
                    <input
                      type="checkbox"
                      checked={props.student.hasEmergencyContact}
                      onChange={(event) => props.onFieldChange('hasEmergencyContact', event.target.checked)}
                    />
                    <span>Add emergency contact</span>
                  </label>
                  <label className="student-profile-field">
                    <span>Emergency Contact Name</span>
                    <input
                      type="text"
                      value={props.student.emergencyContactName}
                      onChange={(event) => props.onFieldChange('emergencyContactName', event.target.value)}
                      disabled={!props.student.hasEmergencyContact}
                      required={props.student.hasEmergencyContact}
                    />
                  </label>
                  <label className="student-profile-field">
                    <span>Emergency Contact Phone</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={props.student.emergencyContactPhone}
                      onChange={(event) => props.onFieldChange('emergencyContactPhone', event.target.value)}
                      disabled={!props.student.hasEmergencyContact}
                      required={props.student.hasEmergencyContact}
                    />
                  </label>
                </div>
              </section>

              <section className="student-profile-section">
                <div className="student-profile-section-head">
                  <div>
                    <h3>Parent / Guardian</h3>
                  </div>
                  <button type="button" className="role-primary-btn" onClick={props.onAddGuardian}>
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                <div className="student-profile-guardian-list">
                  {props.student.guardians.map((guardian, index) => (
                    <article key={guardian.id} className="student-profile-guardian-card">
                      <div className="student-profile-guardian-head">
                        <strong>{guardian.relation || `Guardian ${index + 1}`}</strong>
                        {props.student.guardians.length > 1 ? (
                          <button
                            type="button"
                            className="teacher-assignment-icon-btn is-danger"
                            onClick={() => props.onRemoveGuardian(guardian.id)}
                            aria-label={`Remove guardian ${index + 1}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : null}
                      </div>

                      <div className="student-profile-fields-grid">
                        <label className="student-profile-field">
                          <span>Name</span>
                          <input
                            type="text"
                            value={guardian.name}
                            onChange={(event) => props.onGuardianChange(guardian.id, 'name', event.target.value)}
                          />
                        </label>
                        <label className="student-profile-field">
                          <span>Relation</span>
                          <select
                            value={guardian.relation}
                            onChange={(event) => props.onGuardianChange(guardian.id, 'relation', event.target.value)}
                          >
                            <option value="">Select relation</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Guardian">Guardian</option>
                          </select>
                        </label>
                        <label className="student-profile-field">
                          <span>Phone</span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            value={guardian.phone}
                            onChange={(event) => props.onGuardianChange(guardian.id, 'phone', event.target.value)}
                          />
                        </label>
                        <label className="student-profile-field">
                          <span>Email</span>
                          <input
                            type="email"
                            value={guardian.email}
                            onChange={(event) => props.onGuardianChange(guardian.id, 'email', event.target.value)}
                          />
                        </label>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="student-profile-section">
                <div className="student-profile-section-head">
                  <div>
                    <h3>Account Information</h3>
                  </div>
                </div>

                <div className="student-profile-fields-grid">
                  <label className="student-profile-field">
                    <span>Username</span>
                    <input
                      type="text"
                      value={props.student.username}
                      onChange={(event) => props.onFieldChange('username', event.target.value)}
                    />
                  </label>
                  <label className="student-profile-field">
                    <span>Password</span>
                    <input
                      type="password"
                      value={props.student.password}
                      onChange={(event) => props.onFieldChange('password', event.target.value)}
                      required
                    />
                  </label>
                </div>
              </section>

              <section className="student-profile-section">
                <div className="student-profile-section-head">
                  <div>
                    <h3>History</h3>
                  </div>
                </div>

                <div className="student-profile-fields-grid">
                  <label className="student-profile-field">
                    <span>Reports</span>
                    <input
                      type="url"
                      placeholder="https://example.com/report.pdf"
                      value={props.student.reports}
                      onChange={(event) => props.onFieldChange('reports', event.target.value)}
                    />
                  </label>
                  <label className="student-profile-field">
                    <span>Admission Year</span>
                    <input
                      type="number"
                      min="1900"
                      max="2100"
                      placeholder="2026"
                      value={props.student.admissionYear}
                      onChange={(event) => props.onFieldChange('admissionYear', event.target.value)}
                    />
                  </label>
                  <label className="student-profile-field">
                    <span>Class</span>
                    <select value={props.student.historyClass} onChange={(event) => props.onFieldChange('historyClass', event.target.value)}>
                      <option value="">Select class</option>
                      {props.classOptions.map((className) => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="student-profile-field">
                    <span>Section</span>
                    <select value={props.student.historySection} onChange={(event) => props.onFieldChange('historySection', event.target.value)}>
                      <option value="">Select section</option>
                      {props.sectionOptions.map((section) => (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="student-profile-field">
                    <span>Passed Out Year</span>
                    <input
                      type="number"
                      min="1900"
                      max="2100"
                      placeholder="2026"
                      value={props.student.historyPassedOutYear}
                      onChange={(event) => props.onFieldChange('historyPassedOutYear', event.target.value)}
                    />
                  </label>
                  <label className="student-profile-field">
                    <span>Marks / Grade</span>
                    <input
                      type="text"
                      placeholder="485/500 or A+"
                      value={props.student.historyMarksOrGrade}
                      onChange={(event) => props.onFieldChange('historyMarksOrGrade', event.target.value)}
                    />
                  </label>
                </div>
              </section>

              <div className="student-profile-actions">
                <button type="submit" className="role-primary-btn">
                  <Save size={16} />
                  Save
                </button>
              </div>
            </form>
          )}
        </section>
      </section>
    </main>
  )
}

export default StudentProfilePage
