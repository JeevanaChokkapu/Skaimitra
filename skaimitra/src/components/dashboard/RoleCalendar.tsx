import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Pencil, Trash2, X } from 'lucide-react'
import { type CalendarEventRecord } from '../../lib/api'

type RoleCalendarProps = {
  title: string
  events: CalendarEventRecord[]
  addButtonLabel?: string
  onAddEvent?: () => void
  onEditEvent?: (event: CalendarEventRecord) => void
  onDeleteEvent?: (event: CalendarEventRecord) => void
  emptyMessage?: string
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function getCalendarCells(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const mondayOffset = firstDay === 0 ? 6 : firstDay - 1
  const cells: Array<number | null> = Array.from({ length: mondayOffset }, () => null)

  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatEventMeta(event: CalendarEventRecord) {
  const time = event.time ? `${event.time} • ` : ''
  const classScope = event.classSections.length ? ` • ${event.classSections.join(', ')}` : ''
  return `${time}${event.eventType}${classScope}`
}

function getDateNumberStyle(hasEvents: boolean, isToday: boolean) {
  if (hasEvents) {
    return {
      borderColor: '#111827',
      color: '#111827',
      fontWeight: 700,
      boxShadow: 'inset 0 0 0 1px #111827',
    } as const
  }

  if (isToday) {
    return {
      borderColor: '#2563eb',
      color: '#2563eb',
      fontWeight: 700,
    } as const
  }

  return undefined
}

function RoleCalendar({
  title,
  events,
  addButtonLabel,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  emptyMessage = 'No events scheduled for this date.',
}: RoleCalendarProps) {
  const [calendarDate, setCalendarDate] = useState(() => {
    const now = new Date()
    return { month: now.getMonth(), year: now.getFullYear() }
  })
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)

  const today = new Date()
  const isCurrentMonth = today.getMonth() === calendarDate.month && today.getFullYear() === calendarDate.year
  const calendarCells = useMemo(
    () => getCalendarCells(calendarDate.year, calendarDate.month),
    [calendarDate.year, calendarDate.month],
  )

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEventRecord[]>()
    events.forEach((event) => {
      const key = event.date
      const existing = map.get(key) || []
      existing.push(event)
      map.set(key, existing)
    })
    return map
  }, [events])

  const selectedDateEvents = selectedDateKey ? eventsByDate.get(selectedDateKey) || [] : []
  const visibleMonthEvents = useMemo(
    () =>
      events
        .filter((event) => {
          const eventDate = new Date(`${event.date}T00:00:00`)
          return eventDate.getFullYear() === calendarDate.year && eventDate.getMonth() === calendarDate.month
        })
        .sort((a, b) => {
          const left = new Date(`${a.date}T${a.time || '00:00'}`).getTime()
          const right = new Date(`${b.date}T${b.time || '00:00'}`).getTime()
          return left - right
        }),
    [calendarDate.month, calendarDate.year, events],
  )

  const eventsGroupedByDate = useMemo(() => {
    const grouped = new Map<string, CalendarEventRecord[]>()
    visibleMonthEvents.forEach((event) => {
      const existing = grouped.get(event.date) || []
      existing.push(event)
      grouped.set(event.date, existing)
    })
    return Array.from(grouped.entries()).sort((a, b) => new Date(`${a[0]}T00:00:00`).getTime() - new Date(`${b[0]}T00:00:00`).getTime())
  }, [visibleMonthEvents])

  return (
    <>
      <section className="role-card role-calendar-card">
        <div className="role-section-head role-calendar-title-row">
          <h3 className="role-section-title">{title}</h3>
          {onAddEvent && addButtonLabel ? (
            <button type="button" className="role-primary-btn role-calendar-add-btn" onClick={onAddEvent}>
              {addButtonLabel}
            </button>
          ) : null}
        </div>

        <div className="role-calendar-head">
          <p className="role-muted">
            {monthNames[calendarDate.month]} {calendarDate.year}
          </p>
          <div className="role-calendar-controls">
            <button
              type="button"
              className="role-calendar-nav-btn"
              aria-label="Previous month"
              onClick={() =>
                setCalendarDate((prev) =>
                  prev.month === 0 ? { month: 11, year: prev.year - 1 } : { month: prev.month - 1, year: prev.year },
                )
              }
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              className="role-calendar-nav-btn"
              aria-label="Next month"
              onClick={() =>
                setCalendarDate((prev) =>
                  prev.month === 11 ? { month: 0, year: prev.year + 1 } : { month: prev.month + 1, year: prev.year },
                )
              }
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="role-calendar-grid">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => (
            <span key={d} className="role-calendar-day role-muted">
              {d}
            </span>
          ))}
          {calendarCells.map((day, index) => {
            if (!day) return <span key={`empty-${index}`} className="role-calendar-event-cell is-empty" />

            const dateKey = formatDateKey(calendarDate.year, calendarDate.month, day)
            const dayEvents = eventsByDate.get(dateKey) || []
            const isToday = isCurrentMonth && day === today.getDate()
            const hasEvents = dayEvents.length > 0

            return (
              <button
                key={dateKey}
                type="button"
                className={`role-calendar-event-cell ${isToday ? 'is-today' : ''} ${hasEvents ? 'has-events' : ''} ${
                  dayEvents.length > 1 ? 'has-multiple' : ''
                }`}
                onClick={() => hasEvents && setSelectedDateKey(dateKey)}
                title={hasEvents ? dayEvents.map((event) => event.title).join(', ') : ''}
              >
                <span
                  className={`role-calendar-date-number ${hasEvents ? 'is-event-date' : ''} ${
                    isToday ? 'is-today-date' : ''
                  }`}
                  style={getDateNumberStyle(hasEvents, isToday)}
                >
                  {day}
                </span>
                {hasEvents ? (
                  <span className="role-calendar-date-indicators">
                    <span className="role-calendar-event-dot" />
                    {dayEvents.length > 1 ? <span className="role-calendar-count-badge">{dayEvents.length}</span> : null}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>

        {eventsGroupedByDate.length ? (
          <div className="role-calendar-events-list">
            <h4>Events this month</h4>
            {eventsGroupedByDate.map(([date, events]) => (
              <div key={date} className="role-calendar-events-date-group">
                <h5>{date}</h5>
                {events.map((event) => (
                  <article key={event.eventId} className="role-calendar-event-item">
                    <div>
                      <strong>{event.title}</strong>
                      <span>
                        {event.time ? `${event.time} • ${event.eventType}` : event.eventType}
                      </span>
                      <span>{event.description}</span>
                    </div>
                    {event.canEdit && (onEditEvent || onDeleteEvent) ? (
                      <div className="role-calendar-event-actions">
                        {onEditEvent ? (
                          <button
                            type="button"
                            className="role-icon-action"
                            onClick={() => onEditEvent(event)}
                            aria-label={`Edit ${event.title}`}
                          >
                            <Pencil size={14} />
                          </button>
                        ) : null}
                        {onDeleteEvent ? (
                          <button
                            type="button"
                            className="role-icon-action is-danger"
                            onClick={() => onDeleteEvent(event)}
                            aria-label={`Delete ${event.title}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {selectedDateKey ? (
        <div className="role-modal-backdrop" role="presentation" onClick={() => setSelectedDateKey(null)}>
          <section className="role-modal role-calendar-day-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="role-modal-head">
              <h2>{selectedDateKey}</h2>
              <button type="button" onClick={() => setSelectedDateKey(null)} aria-label="Close event list">
                <X size={18} />
              </button>
            </div>

            <div className="role-calendar-day-list">
              {selectedDateEvents.length ? (
                selectedDateEvents.map((event) => (
                  <article key={event.eventId} className="role-calendar-day-item">
                    <div>
                      <h4>{event.title}</h4>
                      <p className="role-muted">{formatEventMeta(event)}</p>
                      <p>{event.description}</p>
                      <p className="role-calendar-created-by">
                        <strong>Created by:</strong> {event.createdByName}
                      </p>
                    </div>
                    {event.canEdit && (onEditEvent || onDeleteEvent) ? (
                      <div className="role-calendar-event-actions">
                        {onEditEvent ? (
                          <button type="button" className="role-icon-action" onClick={() => onEditEvent(event)}>
                            <Pencil size={14} />
                          </button>
                        ) : null}
                        {onDeleteEvent ? (
                          <button type="button" className="role-icon-action is-danger" onClick={() => onDeleteEvent(event)}>
                            <Trash2 size={14} />
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                ))
              ) : (
                <p className="role-muted">{emptyMessage}</p>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}

export default RoleCalendar
