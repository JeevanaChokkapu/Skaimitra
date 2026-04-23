import { Mail, Pencil, Phone, UserPlus } from 'lucide-react'
import AssignmentTag from './AssignmentTag'
import { getTeacherFullName, getTeacherInitials, getTeacherPrimarySubject, type TeacherProfile } from './teacherTypes'

type TeacherCardProps = {
  teacher: TeacherProfile
  onView: (teacher: TeacherProfile) => void
  onAssign: (teacher: TeacherProfile, subject?: string) => void
  onEditAssignment: (teacher: TeacherProfile, assignmentId: string) => void
  onRemoveAssignment: (teacherId: number, assignmentId: string) => void
}

function TeacherCard({ teacher, onView, onAssign, onEditAssignment, onRemoveAssignment }: TeacherCardProps) {
  const fullName = getTeacherFullName(teacher)
  const primarySubject = getTeacherPrimarySubject(teacher)

  return (
    <article className="teacher-card">
      <div className="teacher-card-top">
        <div className="teacher-card-actions teacher-card-actions-top">
          <button type="button" className="role-primary-btn teacher-card-assign-action" onClick={() => onAssign(teacher)}>
            <UserPlus size={16} />
            Assign
          </button>
          <button type="button" className="role-icon-square-btn" onClick={() => onView(teacher)} aria-label={`Edit ${fullName}`}>
            <Pencil size={16} />
          </button>
        </div>

        <div className="teacher-card-main">
          {teacher.profilePhoto ? (
            <img src={teacher.profilePhoto} alt={fullName} className="teacher-card-avatar teacher-card-avatar-image" />
          ) : (
            <div className="teacher-card-avatar">{getTeacherInitials(teacher)}</div>
          )}

          <div className="teacher-card-copy">
            <div className="teacher-card-title-row">
              <div className="teacher-card-title-copy">
                <button type="button" className="teacher-card-name-btn" onClick={() => onView(teacher)}>
                  {fullName}
                </button>
                <p className="teacher-card-subject">{primarySubject}</p>
              </div>
            </div>

            <div className="teacher-card-contact-row">
              <span>
                <Mail size={14} />
                {teacher.email}
              </span>
              <span>
                <Phone size={14} />
                {teacher.phone}
              </span>
            </div>
          </div>
        </div>

      </div>

      <div className="teacher-card-assignment-block">
        <h5>Current Assignments:</h5>
        {teacher.assignments.length ? (
          <div className="teacher-assignment-list teacher-card-assignment-summary">
            {teacher.assignments.map((assignment) => (
              <AssignmentTag
                key={assignment.id}
                assignment={assignment}
                onEdit={() => onEditAssignment(teacher, assignment.id)}
                onRemove={(assignmentId) => onRemoveAssignment(teacher.id, assignmentId)}
              />
            ))}
          </div>
        ) : (
          <p className="role-muted teacher-card-empty">No class or subject assignments yet.</p>
        )}
      </div>
    </article>
  )
}

export default TeacherCard
