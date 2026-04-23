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

function StudentReadonlyField({
  label,
  value,
  className = '',
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <label className={`student-profile-field ${className}`.trim()}>
      <span>{label}</span>
      <input type="text" value={value || 'Not available'} readOnly />
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
                    <p className="role-muted">Core identity, registration, and address details.</p>
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
                    <StudentReadonlyField label="Date of Birth" value={props.student.dateOfBirth} />
                    <StudentReadonlyField label="Gender" value={props.student.gender} />
                    <StudentReadonlyField label="Class" value={props.student.className} />
                    <StudentReadonlyField label="Section" value={props.student.section} />
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
                    <p className="role-muted">Mailing, permanent, and phone contact details.</p>
                  </div>
                </div>

                <div className="student-profile-fields-grid">
                  <StudentReadonlyField label="Mailing Address" value={props.student.mailingAddress} className="student-profile-field-span-2" />
                  <StudentReadonlyField
                    label="Permanent Address"
                    value={props.student.permanentAddress}
                    className="student-profile-field-span-2"
                  />
                  <StudentReadonlyField label="Email" value={props.student.email} />
                  <StudentReadonlyField label="WhatsApp Phone" value={props.student.whatsAppPhone} />
                  {props.student.hasEmergencyContact ? (
                    <>
                      <StudentReadonlyField label="Emergency Contact Name" value={props.student.emergencyContactName} />
                      <StudentReadonlyField label="Emergency Contact Phone" value={props.student.emergencyContactPhone} />
                    </>
                  ) : null}
                </div>
              </section>

              <section className="student-profile-section">
                <div className="student-profile-section-head">
                  <div>
                    <h3>Parent / Guardian</h3>
                    <p className="role-muted">Multiple guardian contacts attached to the student record.</p>
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
                        <StudentReadonlyField label="Email" value={guardian.email} />
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="student-profile-section">
                <div className="student-profile-section-head">
                  <div>
                    <h3>Account Information</h3>
                    <p className="role-muted">Credentials created for student login access.</p>
                  </div>
                </div>

                <div className="student-profile-fields-grid">
                  <StudentReadonlyField label="Username" value={props.student.username} />
                  <StudentReadonlyField label="Password" value={props.student.password ? '********' : ''} />
                </div>
              </section>
            </>
          ) : (
            <form className="student-profile-form" onSubmit={props.onSubmit}>
              <section className="student-profile-section">
                <div className="student-profile-section-head">
                  <div>
                    <h3>Primary Information</h3>
                    <p className="role-muted">Add the student&apos;s identity, registration, address, and photo.</p>
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
                      <span>Class</span>
                      <input
                        type="text"
                        value={props.student.className}
                        onChange={(event) => props.onFieldChange('className', event.target.value)}
                        placeholder="Class 6"
                        required
                      />
                    </label>
                    <label className="student-profile-field">
                      <span>Section</span>
                      <input
                        type="text"
                        value={props.student.section}
                        onChange={(event) => props.onFieldChange('section', event.target.value)}
                        placeholder="A"
                        required
                      />
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
                    <p className="role-muted">Store mailing address, permanent address, and phone number.</p>
                  </div>
                </div>

                <div className="student-profile-fields-grid">
                  <label className="student-profile-field student-profile-field-span-2">
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
                  <label className="student-profile-field student-profile-field-span-2">
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
                  <label className="student-profile-field student-profile-checkbox student-profile-field-span-2">
                    <input
                      type="checkbox"
                      checked={props.student.hasEmergencyContact}
                      onChange={(event) => props.onFieldChange('hasEmergencyContact', event.target.checked)}
                    />
                    <span>Add emergency contact</span>
                  </label>
                  {props.student.hasEmergencyContact ? (
                    <>
                      <label className="student-profile-field">
                        <span>Emergency Contact Name</span>
                        <input
                          type="text"
                          value={props.student.emergencyContactName}
                          onChange={(event) => props.onFieldChange('emergencyContactName', event.target.value)}
                          required
                        />
                      </label>
                      <label className="student-profile-field">
                        <span>Emergency Contact Phone</span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={props.student.emergencyContactPhone}
                          onChange={(event) => props.onFieldChange('emergencyContactPhone', event.target.value)}
                          required
                        />
                      </label>
                    </>
                  ) : null}
                </div>
              </section>

              <section className="student-profile-section">
                <div className="student-profile-section-head">
                  <div>
                    <h3>Parent / Guardian</h3>
                    <p className="role-muted">Add one or more guardian contacts for the student.</p>
                  </div>
                  <button type="button" className="role-primary-btn" onClick={props.onAddGuardian}>
                    <Plus size={16} />
                    Add Guardian
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
                    <p className="role-muted">Create the student&apos;s username and password.</p>
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

              <div className="student-profile-actions">
                <label className="student-profile-field student-profile-checkbox student-profile-send-option">
                  <input
                    type="checkbox"
                    checked={props.student.sendCredentialsAfterSave}
                    onChange={(event) => props.onFieldChange('sendCredentialsAfterSave', event.target.checked)}
                  />
                  <span>Send details after save</span>
                </label>
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
