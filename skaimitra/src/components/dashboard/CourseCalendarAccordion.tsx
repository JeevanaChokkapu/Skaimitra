import type { ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

type AccordionWeek = {
  key: string
  label: string
  meta: string
  detail: ReactNode
}

type AccordionMonth = {
  key: string
  month: string
  year: string
  weeks: AccordionWeek[]
}

type WeekListProps = {
  monthKey: string
  weeks: AccordionWeek[]
  selectedWeekKey: string | null
  onWeekSelect: (monthKey: string, weekKey: string) => void
}

type MonthItemProps = {
  month: AccordionMonth
  isExpanded: boolean
  selectedWeekKey: string | null
  onToggle: (monthKey: string) => void
  onWeekSelect: (monthKey: string, weekKey: string) => void
}

type CourseCalendarAccordionProps = {
  months: AccordionMonth[]
  expandedMonthKey: string | null
  selectedWeekKey: string | null
  onMonthToggle: (monthKey: string) => void
  onWeekSelect: (monthKey: string, weekKey: string) => void
}

export function WeekList({ monthKey, weeks, selectedWeekKey, onWeekSelect }: WeekListProps) {
  return (
    <div className="course-calendar-week-list">
      {weeks.map((week) => {
        const isSelected = selectedWeekKey === week.key

        return (
          <div key={week.key} className={`course-calendar-week-panel ${isSelected ? 'is-selected' : ''}`}>
            <button
              type="button"
              className={`course-calendar-week-trigger ${isSelected ? 'is-selected' : ''}`}
              onClick={() => onWeekSelect(monthKey, week.key)}
              aria-expanded={isSelected}
            >
              <span className="course-calendar-week-trigger-copy">
                <strong>{week.label}</strong>
                <span>{week.meta}</span>
              </span>
              <ChevronRight size={16} className={`course-calendar-week-trigger-icon ${isSelected ? 'is-selected' : ''}`} />
            </button>

            {isSelected ? <div className="course-calendar-week-detail">{week.detail}</div> : null}
          </div>
        )
      })}
    </div>
  )
}

export function MonthItem({ month, isExpanded, selectedWeekKey, onToggle, onWeekSelect }: MonthItemProps) {
  return (
    <section className={`course-calendar-month-card ${isExpanded ? 'is-expanded' : ''}`}>
      <button
        type="button"
        className={`course-calendar-month-trigger ${isExpanded ? 'is-expanded' : ''}`}
        onClick={() => onToggle(month.key)}
        aria-expanded={isExpanded}
      >
        <span className="course-calendar-month-trigger-copy">
          <h3>{month.month}</h3>
          <span className="course-calendar-year">{month.year}</span>
        </span>
        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      {isExpanded ? (
        <WeekList
          monthKey={month.key}
          weeks={month.weeks}
          selectedWeekKey={selectedWeekKey}
          onWeekSelect={onWeekSelect}
        />
      ) : null}
    </section>
  )
}

export default function CourseCalendarAccordion({
  months,
  expandedMonthKey,
  selectedWeekKey,
  onMonthToggle,
  onWeekSelect,
}: CourseCalendarAccordionProps) {
  return (
    <div className="course-calendar-month-stack">
      {months.map((month) => (
        <MonthItem
          key={month.key}
          month={month}
          isExpanded={expandedMonthKey === month.key}
          selectedWeekKey={selectedWeekKey}
          onToggle={onMonthToggle}
          onWeekSelect={onWeekSelect}
        />
      ))}
    </div>
  )
}
