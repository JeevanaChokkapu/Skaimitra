import { Download, Eye, Plus, Trash2 } from 'lucide-react'
import type { TeacherProfile, TeacherQualification } from './teacherTypes'

type QualificationSectionProps = {
  teacher: TeacherProfile
  onAddQualification: () => void
  onDeleteQualification: (qualificationId: string) => void
}

function openCertificate(url: string) {
  if (typeof window === 'undefined' || !url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}

function downloadCertificate(url: string, filename: string) {
  if (typeof window === 'undefined' || !url) return

  const link = document.createElement('a')
  link.href = url
  link.download = filename || 'certificate'
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.click()
}

function QualificationRow({
  qualification,
  onDelete,
}: {
  qualification: TeacherQualification
  onDelete: () => void
}) {
  const title = [qualification.degree, qualification.qualification].filter(Boolean).join(' ')
  const meta = [qualification.institutionName, qualification.graduationYear].filter(Boolean).join(' • ')

  return (
    <article className="teacher-qualification-card">
      <div className="teacher-qualification-copy">
        <h4>{title || 'Qualification'}</h4>
        <p className="role-muted">{meta || 'Details not available'}</p>
        {qualification.certificateUrl ? (
          <div className="teacher-qualification-actions">
            <button type="button" className="role-inline-action" onClick={() => openCertificate(qualification.certificateUrl)}>
              <Eye size={14} />
              View Certificate
            </button>
            <button
              type="button"
              className="role-inline-action"
              onClick={() => downloadCertificate(qualification.certificateUrl, qualification.certificateName)}
            >
              <Download size={14} />
              Download
            </button>
          </div>
        ) : null}
      </div>
      <button
        type="button"
        className="teacher-assignment-icon-btn is-danger"
        onClick={onDelete}
        aria-label={`Delete ${title || 'qualification'}`}
        title="Delete qualification"
      >
        <Trash2 size={16} />
      </button>
    </article>
  )
}

function QualificationSection({ teacher, onAddQualification, onDeleteQualification }: QualificationSectionProps) {
  return (
    <section className="teacher-profile-section">
      <div className="teacher-profile-section-head">
        <div>
          <h3>Academic Qualifications</h3>
          <p className="role-muted">Manage degree records and supporting certificates.</p>
        </div>
        <button type="button" className="role-primary-btn teacher-profile-add-btn" onClick={onAddQualification}>
          <Plus size={16} />
          Add Qualification
        </button>
      </div>

      {teacher.qualifications.length ? (
        <div className="teacher-qualification-list">
          {teacher.qualifications.map((qualification) => (
            <QualificationRow
              key={qualification.id}
              qualification={qualification}
              onDelete={() => onDeleteQualification(qualification.id)}
            />
          ))}
        </div>
      ) : (
        <div className="teacher-profile-empty-state">
          <p className="role-muted">No academic qualifications added yet.</p>
        </div>
      )}
    </section>
  )
}

export default QualificationSection
