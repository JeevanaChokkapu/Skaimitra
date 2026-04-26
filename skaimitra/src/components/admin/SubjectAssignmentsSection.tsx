import { Plus } from 'lucide-react'
import AssignmentTag from './AssignmentTag'
import type { TeacherProfile } from './teacherTypes'

type SubjectAssignmentsSectionProps = {
  teacher: TeacherProfile
  onOpenAssign: () => void
  onEditAssignment: (assignmentId: string) => void
  onRemoveAssignment: (assignmentId: string) => void
  title?: string
  description?: string
  emptyMessage?: string
  actionLabel?: string
}

function SubjectAssignmentsSection({
  teacher,
  onOpenAssign,
  onEditAssignment,
  onRemoveAssignment,
  title = 'Assign Subjects',
  description = '',
  emptyMessage = 'No assignments added yet.',
  actionLabel = 'Assign',
}: SubjectAssignmentsSectionProps) {
  return (
    <section className="teacher-profile-section">
      <div className="teacher-profile-section-head">
        <div>
          <h3>{title}</h3>
          {description ? <p className="role-muted">{description}</p> : null}
        </div>
        <button type="button" className="role-primary-btn" onClick={onOpenAssign}>
          <Plus size={16} />
          {actionLabel}
        </button>
      </div>

      {teacher.assignments.length ? (
        <div className="teacher-assignment-list">
          {teacher.assignments.map((assignment) => (
            <AssignmentTag
              key={assignment.id}
              assignment={assignment}
              onEdit={() => onEditAssignment(assignment.id)}
              onRemove={onRemoveAssignment}
            />
          ))}
        </div>
      ) : (
        <div className="teacher-profile-empty-state">
          <p className="role-muted">{emptyMessage}</p>
        </div>
      )}
    </section>
  )
}

export default SubjectAssignmentsSection
