import { Pencil, Trash2 } from 'lucide-react'
import type { TeacherAssignment } from './teacherTypes'

type AssignmentTagProps = {
  assignment: TeacherAssignment
  onEdit: () => void
  onRemove: (assignmentId: string) => void
}

function AssignmentTag({ assignment, onEdit, onRemove }: AssignmentTagProps) {
  const classGroups = Array.isArray(assignment.classes) ? assignment.classes : []

  return (
    <article className="teacher-assignment-tag-card">
      <div className="teacher-assignment-tag-head">
        <h5>{assignment.subject}</h5>

        <div className="teacher-assignment-block-actions">
          <button
            type="button"
            className="teacher-assignment-icon-btn"
            onClick={onEdit}
            aria-label={`Edit ${assignment.subject} assignment`}
            title="Edit assignment"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            className="teacher-assignment-icon-btn is-danger"
            onClick={() => onRemove(assignment.id)}
            aria-label={`Remove ${assignment.subject} assignment`}
            title="Remove assignment"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="teacher-assignment-group-list">
        {classGroups.map((classGroup) => (
          <div key={`${assignment.id}-${classGroup.className}`} className="teacher-assignment-group-row">
            <strong>{classGroup.className}</strong>
            <span className="role-muted">-&gt;</span>
            <div className="teacher-assignment-chip-row">
              {(Array.isArray(classGroup.sections) ? classGroup.sections : []).map((section) => (
                <span key={`${classGroup.className}-${section}`} className="teacher-assignment-chip">
                  {section}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default AssignmentTag
