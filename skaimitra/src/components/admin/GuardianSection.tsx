import { Plus, Trash2 } from 'lucide-react'
import type { GuardianContact } from './studentTypes'

type GuardianSectionProps = {
  guardians: GuardianContact[]
  onGuardianChange: (guardianId: string, field: keyof GuardianContact, value: string) => void
  onAddGuardian: () => void
  onRemoveGuardian: (guardianId: string) => void
}

function GuardianSection({
  guardians,
  onGuardianChange,
  onAddGuardian,
  onRemoveGuardian,
}: GuardianSectionProps) {
  return (
    <section className="teacher-form-section">
      <div className="teacher-form-section-head student-section-head-with-action">
        <div>
          <h3>Parent/Guardian Information</h3>
          <p>Add one or more parent or guardian contacts for this student.</p>
        </div>
        <button type="button" className="role-secondary-btn student-inline-add-btn" onClick={onAddGuardian}>
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="student-guardian-list">
        {guardians.map((guardian, index) => (
          <article key={guardian.id} className="student-guardian-card">
            <div className="student-guardian-card-head">
              <div>
                <strong>{guardian.relation || `Guardian ${index + 1}`}</strong>
                <p className="role-muted">Parent/guardian contact details</p>
              </div>
              {guardians.length > 1 ? (
                <button
                  type="button"
                  className="role-icon-square-btn student-delete-btn"
                  onClick={() => onRemoveGuardian(guardian.id)}
                  aria-label={`Remove guardian ${index + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              ) : null}
            </div>

            <div className="teacher-form-grid">
              <label>
                <span>Name</span>
                <input
                  type="text"
                  placeholder="Full name"
                  value={guardian.name}
                  onChange={(e) => onGuardianChange(guardian.id, 'name', e.target.value)}
                />
              </label>

              <label>
                <span>Relation</span>
                <select value={guardian.relation} onChange={(e) => onGuardianChange(guardian.id, 'relation', e.target.value)}>
                  <option value="">Select relation</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </label>

              <label>
                <span>Phone</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="9876543210"
                  value={guardian.phone}
                  onChange={(e) => onGuardianChange(guardian.id, 'phone', e.target.value)}
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  placeholder="guardian@email.com"
                  value={guardian.email}
                  onChange={(e) => onGuardianChange(guardian.id, 'email', e.target.value)}
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default GuardianSection
