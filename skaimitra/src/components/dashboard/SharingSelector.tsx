import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

type SharingSelectorProps = {
  enabled: boolean
  selectedClasses: string[]
  selectedSections: string[]
  classOptions: string[]
  sectionOptions: string[]
  onEnabledChange: (enabled: boolean) => void
  onClassesChange: (values: string[]) => void
  onSectionsChange: (values: string[]) => void
}

type MultiSelectDropdownProps = {
  label: string
  placeholder: string
  options: string[]
  values: string[]
  onChange: (values: string[]) => void
}

function MultiSelectDropdown({ label, placeholder, options, values, onChange }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const valueSet = useMemo(() => new Set(values), [values])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current) return
      if (event.target instanceof Node && !rootRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleValue(option: string) {
    if (valueSet.has(option)) {
      onChange(values.filter((value) => value !== option))
      return
    }

    onChange([...values, option])
  }

  return (
    <div className="sharing-selector-field" ref={rootRef}>
      <span>{label}</span>
      <button
        type="button"
        className={`sharing-selector-trigger ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className="sharing-selector-trigger-values">
          {values.length ? (
            values.map((value) => (
              <span key={value} className="sharing-selector-chip">
                {value}
              </span>
            ))
          ) : (
            <span className="sharing-selector-placeholder">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={16} className="sharing-selector-trigger-icon" />
      </button>

      {isOpen ? (
        <div className="sharing-selector-dropdown">
          {options.map((option) => {
            const isSelected = valueSet.has(option)

            return (
              <button
                key={option}
                type="button"
                className={`sharing-selector-option ${isSelected ? 'is-selected' : ''}`}
                onClick={() => toggleValue(option)}
              >
                <span>{option}</span>
                {isSelected ? <Check size={14} /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default function SharingSelector({
  enabled,
  selectedClasses,
  selectedSections,
  classOptions,
  sectionOptions,
  onEnabledChange,
  onClassesChange,
  onSectionsChange,
}: SharingSelectorProps) {
  return (
    <section className={`role-card planner-card planner-share-card ${enabled ? 'is-highlighted' : ''}`}>
      <div className="planner-card-head">
        <div>
          <h3>Sharing</h3>
          <p className="role-muted">Choose whether this item can be shared and, if enabled, limit it to selected classes and sections.</p>
        </div>
      </div>

      <div className="planner-share-grid">
        <label className="planner-toggle-field sharing-selector-toggle-row">
          <span>Allow Sharing</span>
          <button
            type="button"
            className={`sharing-selector-toggle ${enabled ? 'is-enabled' : ''}`}
            onClick={() => onEnabledChange(!enabled)}
            aria-pressed={enabled}
          >
            <span className="sharing-selector-toggle-thumb" />
          </button>
        </label>

        {enabled ? (
          <>
            <MultiSelectDropdown
              label="Select Classes"
              placeholder="Choose classes"
              options={classOptions}
              values={selectedClasses}
              onChange={onClassesChange}
            />
            <MultiSelectDropdown
              label="Select Sections"
              placeholder="Choose sections"
              options={sectionOptions}
              values={selectedSections}
              onChange={onSectionsChange}
            />
          </>
        ) : null}
      </div>
    </section>
  )
}
