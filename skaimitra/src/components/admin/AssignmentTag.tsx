import { X } from 'lucide-react'
import type { TeacherAssignment } from './teacherTypes'

type AssignmentTagProps = {
  assignment: TeacherAssignment
  onRemove: (assignmentId: string) => void
}

function AssignmentTag({ assignment, onRemove }: AssignmentTagProps) {
  return (
    <article className="teacher-assignment-tag-card">
      <div className="teacher-assignment-tag-head">
        <h5>{assignment.subject}</h5>

        <div className="teacher-assignment-chip-row">
          <span className="teacher-assignment-chip">{assignment.className}</span>
          <span className="teacher-assignment-chip">Section {assignment.section}</span>
          <span className="teacher-assignment-chip teacher-assignment-chip-subject">{assignment.subject}</span>
        </div>

        <button
          type="button"
          className="teacher-assignment-remove-btn"
          onClick={() => onRemove(assignment.id)}
          aria-label={`Remove ${assignment.subject} assignment`}
        >
          <X size={16} />
        </button>
      </div>
    </article>
  )
}

export default AssignmentTag
