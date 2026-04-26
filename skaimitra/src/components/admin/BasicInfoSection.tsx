import { UserCircle2 } from 'lucide-react'
import { getTeacherFullName, splitTeacherAddress, type TeacherProfile } from './teacherTypes'

type BasicInfoSectionProps = {
  teacher: TeacherProfile
}

function BasicInfoSection({ teacher }: BasicInfoSectionProps) {
  const fullName = getTeacherFullName(teacher)
  const fallbackAddress = splitTeacherAddress(teacher.address)

  const items = [
    { label: 'First Name', value: teacher.firstName || 'Not available' },
    { label: 'Middle Name', value: teacher.middleName || 'Not available' },
    { label: 'Last Name', value: teacher.lastName || 'Not available' },
    { label: 'Gender', value: teacher.gender || 'Not available' },
    { label: 'Address', value: teacher.address || 'Not available' },
    { label: 'City', value: teacher.city || fallbackAddress.city || 'Not available' },
    { label: 'Pincode', value: teacher.pincode || 'Not available' },
    { label: 'State', value: teacher.state || fallbackAddress.state || 'Not available' },
    { label: 'Country', value: teacher.country || fallbackAddress.country || 'Not available' },
  ]

  return (
    <section className="teacher-profile-section">
      <div className="teacher-profile-section-head">
        <div>
          <h3>Basic Information</h3>
          <p className="role-muted">Identity and location details for the teacher profile.</p>
        </div>
      </div>

      <div className="student-profile-primary-grid">
        <div className="student-profile-photo-card">
          {teacher.profilePhoto ? (
            <img src={teacher.profilePhoto} alt={fullName} className="student-profile-photo-image" />
          ) : (
            <div className="student-profile-photo-placeholder">
              <UserCircle2 size={56} />
            </div>
          )}
          <span>Profile Photo</span>
        </div>

        <div className="teacher-profile-info-grid">
          {items.map((item) => (
            <label key={item.label} className="teacher-profile-readonly-field">
              <span>{item.label}</span>
              <input type="text" value={item.value} readOnly />
            </label>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BasicInfoSection
