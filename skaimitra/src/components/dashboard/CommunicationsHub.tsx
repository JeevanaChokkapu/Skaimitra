import React, { useEffect, useMemo, useState } from 'react'
import {
  Archive,
  Calendar,
  Edit3,
  Eye,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  Send,
  Trash2,
  Zap,
} from 'lucide-react'

type CommunicationStatus = 'Draft' | 'Scheduled' | 'Sent' | 'Archived'
type DeliveryMethod = 'Email' | 'WhatsApp' | 'Both'
type CommunicationCategory = 'Fee Reminder' | 'Holiday Notice' | 'PTM Invite' | 'General'

type CommunicationMessage = {
  id: string
  scheduleDate: string
  category: CommunicationCategory
  subject: string
  content: string
  deliveryMethod: DeliveryMethod
  recipients: string[]
  status: CommunicationStatus
  createdAt: string
  updatedAt: string
  attachments: string[]
}

type CommunicationsHubProps = {
  role?: 'admin' | 'teacher'
}

const emptyForm: Partial<CommunicationMessage> = {
  category: 'General',
  subject: '',
  content: '',
  deliveryMethod: 'Email',
  recipients: [],
  scheduleDate: new Date().toISOString().slice(0, 16),
  status: 'Draft',
  attachments: [],
}

const STORAGE_KEY = 'skaimitra_communications_messages'

function loadMessages(): CommunicationMessage[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CommunicationMessage[]
    return parsed.map((item) => ({ ...item }))
  } catch {
    return []
  }
}

function saveMessages(data: CommunicationMessage[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const statusClassName = (status: CommunicationStatus): string => {
  switch (status) {
    case 'Sent':
      return 'role-status-badge status-success'
    case 'Scheduled':
      return 'role-status-badge status-warning'
    case 'Archived':
      return 'role-status-badge status-muted'
    default:
      return 'role-status-badge status-neutral'
  }
}

const CommunicationsHub: React.FC<CommunicationsHubProps> = ({ role = 'teacher' }) => {
  const [messages, setMessages] = useState<CommunicationMessage[]>([])
  const [view, setView] = useState<'list' | 'new' | 'detail' | 'edit'>('list')
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [formState, setFormState] = useState<Partial<CommunicationMessage>>(emptyForm)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiContext, setAiContext] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    try {
      setMessages(loadMessages())
      setError(null)
    } catch (err) {
      setError('Unable to load communications. Please refresh.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (messages.length === 0) return
    const interval = window.setInterval(() => {
      const nowIso = new Date().toISOString()
      let updated = false
      const nextMessages = messages.map((msg) => {
        if (msg.status === 'Scheduled' && msg.scheduleDate <= nowIso) {
          updated = true
          return { ...msg, status: 'Sent' as CommunicationStatus, updatedAt: nowIso }
        }
        return msg
      })
      if (updated) {
        setMessages(nextMessages)
        saveMessages(nextMessages)
      }
    }, 30 * 1000)

    return () => window.clearInterval(interval)
  }, [messages])

  const selectedMessage = useMemo(
    () => messages.find((msg) => msg.id === selectedMessageId) ?? null,
    [messages, selectedMessageId],
  )

  const filteredMessages = useMemo(() => {
    let list = [...messages]
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase()
      list = list.filter((m) =>
        [m.subject, m.category, m.deliveryMethod, m.recipients.join(', ')]
          .join(' ')
          .toLowerCase()
          .includes(q),
      )
    }
    if (filterDate) {
      list = list.filter((m) => m.scheduleDate.slice(0, 10) === filterDate)
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [messages, searchTerm, filterDate])

  const resetForm = () => {
    setFormState(emptyForm)
    setAiContext('')
    setSelectedMessageId(null)
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const withStatus = (update: Partial<CommunicationMessage>, status: CommunicationStatus): CommunicationMessage => ({
    ...(update as CommunicationMessage),
    id: (update as CommunicationMessage).id || `${Date.now()}-${Math.random()}`,
    scheduleDate: update.scheduleDate || new Date().toISOString().slice(0, 16),
    category: update.category || 'General',
    subject: update.subject || '',
    content: update.content || '',
    deliveryMethod: update.deliveryMethod || 'Email',
    recipients: update.recipients || [],
    attachments: update.attachments || [],
    status,
    createdAt: (update as CommunicationMessage).createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  const saveMessage = (status: CommunicationStatus) => {
    if (!formState.subject?.trim()) {
      setError('Subject is required.')
      return
    }
    if (!formState.content?.trim()) {
      setError('Message content is required.')
      return
    }
    if (!formState.recipients || formState.recipients.length === 0) {
      setError('At least one recipient is required.')
      return
    }

    const scheduledIso = new Date(formState.scheduleDate ?? new Date().toISOString()).toISOString()
    const message: CommunicationMessage = withStatus({
      ...formState,
      scheduleDate: scheduledIso,
    },
      status,
    )

    let nextMessages = messages.slice()
    const existingIndex = nextMessages.findIndex((m) => m.id === formState.id)
    if (existingIndex >= 0) {
      nextMessages[existingIndex] = { ...nextMessages[existingIndex], ...message, updatedAt: new Date().toISOString() }
    } else {
      nextMessages.unshift(message)
    }

    setMessages(nextMessages)
    saveMessages(nextMessages)
    resetForm()

    showToast(status === 'Draft' ? 'Draft saved successfully' : 'Message sent successfully')
    setView('list')
  }

  const handleSendMessage = () => {
    if (!formState.scheduleDate) {
      saveMessage('Sent')
      return
    }
    const scheduleTimestamp = new Date(formState.scheduleDate).getTime()
    const now = Date.now()
    const nextStatus = (scheduleTimestamp > now ? 'Scheduled' : 'Sent') as CommunicationStatus
    saveMessage(nextStatus)
  }

  const handleDeleteMessage = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return
    const nextMessages = messages.filter((m) => m.id !== id)
    setMessages(nextMessages)
    saveMessages(nextMessages)
    showToast('Message deleted successfully')
    setView('list')
  }

  const handleArchive = (id: string) => {
    const nextMessages = messages.map((m) =>
      m.id === id ? { ...m, status: 'Archived' as CommunicationStatus, updatedAt: new Date().toISOString() } : m,
    )
    setMessages(nextMessages)
    saveMessages(nextMessages)
    showToast('Message archived')
  }

  const handleAiAssist = () => {
    if (!formState.category || !formState.subject) {
      setError('Please fill category and subject before AI Assist.')
      return
    }
    setError(null)
    // Simulated AI content generation
    const generated = `Dear recipient,\n\nThis is a ${formState.category} regarding "${formState.subject}". ${
      aiContext ? `${aiContext} ` : ''
    }Please review the details above and take the necessary action.\n\nThank you.`
    setFormState((prev) => ({ ...prev, content: generated }))
  }

  const openNewMessage = () => {
    resetForm()
    setView('new')
    setError(null)
  }

  const openDetail = (id: string) => {
    setSelectedMessageId(id)
    setView('detail')
  }

  const openEdit = (id: string) => {
    const message = messages.find((m) => m.id === id)
    if (!message) return
    setFormState(message)
    setSelectedMessageId(id)
    setView('edit')
  }

  const isEmpty = !isLoading && !error && filteredMessages.length === 0

  return (
    <main className="role-main role-main-detail">
      <section className="role-primary">
        <section className="role-section-head role-admin-page-head">
          <div>
            <h2>{role === 'admin' ? 'Admin' : 'Teacher'} Communications Hub</h2>
            <p className="role-muted">Create, schedule and track Email/WhatsApp messages with AI assist.</p>
          </div>
        </section>

        <section className="communications-controls-wrapper">
          <div className="role-user-search-wrap role-user-search-inline">
            <Search size={16} />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search subjects, categories, recipients..." />
          </div>
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          <button type="button" className="role-secondary-btn" onClick={() => setFilterDate('')}>
            Clear Date
          </button>
          <button type="button" className="role-primary-btn" onClick={openNewMessage}>
            <Plus size={14} /> + New Message
          </button>
        </section>

        {toast && <div className="role-floating-notice is-success">{toast}</div>}
        {error && <div className="role-floating-notice is-error">{error}</div>}

        {isLoading && <p className="role-muted">Loading...</p>}

        {isEmpty && (
          <section className="communications-empty-state-card">
            <div className="communications-empty-icon">
              <MessageSquare size={40} />
            </div>
            <h3>No messages found</h3>
            <p className="role-muted">Create your first message to get started.</p>
            <button type="button" className="role-primary-btn" onClick={openNewMessage}>
              <Plus size={14} /> + New Message
            </button>
          </section>
        )}

        {view === 'list' && !isLoading && !isEmpty && (
          <section className="role-card role-admin-communications-card role-communications-table-card">
            <div className="role-table-responsive">
              <table className="role-table">
                <thead>
                  <tr>
                    <th>Schedule Date</th>
                    <th>Type</th>
                    <th>Subject</th>
                    <th>Delivery</th>
                    <th>Status</th>
                    <th>Recipients</th>
                    <th style={{ minWidth: 120 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((item) => (
                    <tr key={item.id}>
                      <td>{new Date(item.scheduleDate).toLocaleString()}</td>
                      <td>{item.category}</td>
                      <td>{item.subject}</td>
                      <td>{item.deliveryMethod}</td>
                      <td>
                        <span className={statusClassName(item.status)}>{item.status}</span>
                      </td>
                      <td>{item.recipients.join(', ') || 'All'}</td>
                      <td>
                        <button className="role-icon-square-btn" title="View" onClick={() => openDetail(item.id)}>
                          <Eye size={14} />
                        </button>
                        <button className="role-icon-square-btn" title="Edit" onClick={() => openEdit(item.id)}>
                          <Edit3 size={14} />
                        </button>
                        <button className="role-icon-square-btn role-icon-square-btn-danger" title="Delete" onClick={() => handleDeleteMessage(item.id)}>
                          <Trash2 size={14} />
                        </button>
                        <button className="role-icon-square-btn" title="Archive" onClick={() => handleArchive(item.id)}>
                          <Archive size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {(view === 'new' || view === 'edit') && (
          <section className="communications-form-card">
            <div className="role-section-head">
              <h3>{view === 'new' ? 'Create Message' : 'Edit Message'}</h3>
            </div>

            <div className="communications-form-grid">
              <label>
                <span>Category</span>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState((prev) => ({ ...prev, category: e.target.value as CommunicationCategory }))}
                >
                  {['Fee Reminder', 'Holiday Notice', 'PTM Invite', 'General'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Delivery Method</span>
                <select
                  value={formState.deliveryMethod}
                  onChange={(e) => setFormState((prev) => ({ ...prev, deliveryMethod: e.target.value as DeliveryMethod }))}
                >
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Both">Both</option>
                </select>
              </label>

              <label className="full-width">
                <span>Subject Line</span>
                <input
                  type="text"
                  value={formState.subject}
                  onChange={(e) => setFormState((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter message subject"
                />
              </label>

              <label>
                <span>Schedule Date</span>
                <input
                  type="datetime-local"
                  value={formState.scheduleDate?.slice(0, 16) ?? ''}
                  onChange={(e) => setFormState((prev) => ({ ...prev, scheduleDate: e.target.value }))}
                />
              </label>

              <label>
                <span>Recipients</span>
                <input
                  type="text"
                  placeholder="All, Students, Teachers, Class 6A, ..."
                  value={formState.recipients?.join(', ') ?? ''}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      recipients: e.target.value.split(',').map((v) => v.trim()).filter(Boolean),
                    }))
                  }
                />
              </label>

              <label className="full-width">
                <span>Optional AI Context</span>
                <input
                  type="text"
                  value={aiContext}
                  placeholder="Extra details for auto-generated content"
                  onChange={(e) => setAiContext(e.target.value)}
                />
              </label>

              <label className="full-width">
                <span>Message Content</span>
                <textarea
                  rows={10}
                  value={formState.content}
                  onChange={(e) => setFormState((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your message content here..."
                />
              </label>

              <label className="full-width">
                <span>Attachments</span>
                <div className="communications-attachment-uploader">
                  <input
                    type="file"
                    multiple
                    onChange={(event) => {
                      const files = Array.from(event.target.files || [])
                      setFormState((prev) => ({
                        ...prev,
                        attachments: [...(prev.attachments ?? []), ...files.map((file) => file.name)],
                      }))
                      event.target.value = ''
                    }}
                  />
                  <div className="role-message-attachments">
                    {(formState.attachments || []).map((fileName) => (
                      <span key={fileName} className="role-badge role-badge-light">
                        <Paperclip size={12} /> {fileName}
                      </span>
                    ))}
                  </div>
                </div>
              </label>
            </div>

            <div className="communications-form-actions">
              <button type="button" className="role-secondary-btn" onClick={() => setView('list')}>
                Cancel
              </button>
              <button type="button" className="role-secondary-btn outlined" onClick={() => saveMessage('Draft')}>
                Save Draft
              </button>
              <button type="button" className="role-primary-btn" onClick={handleSendMessage}>
                <Send size={14} /> Send Message
              </button>
              <button type="button" className="role-icon-btn" onClick={handleAiAssist}>
                <Zap size={18} />
              </button>
            </div>
          </section>
        )}

        {view === 'detail' && selectedMessage && (
          <section className="role-card role-admin-communications-card role-communication-detail-card">
            <div className="role-section-head">
              <h3>Message Detail</h3>
              <div className="role-card-actions" style={{ gap: 8 }}>
                <button type="button" className="role-secondary-btn" onClick={() => setView('list')}>
                  Back
                </button>
                {selectedMessage.status === 'Draft' && (
                  <button type="button" className="role-primary-btn" onClick={() => openEdit(selectedMessage.id)}>
                    <Edit3 size={14} /> Edit
                  </button>
                )}
                {selectedMessage.status === 'Sent' && (
                  <button type="button" className="role-secondary-btn" onClick={() => handleArchive(selectedMessage.id)}>
                    <Archive size={14} /> Archive
                  </button>
                )}
              </div>
            </div>

            <div className="role-detail-grid">
              <div>
                <h4>{selectedMessage.subject}</h4>
                <p className="role-muted">{selectedMessage.category} • {selectedMessage.deliveryMethod}</p>
                <p>{selectedMessage.content}</p>
              </div>
              <div className="role-card role-card-small">
                <p><strong>Scheduled</strong></p>
                <p><Calendar size={14} /> {new Date(selectedMessage.scheduleDate).toLocaleString()}</p>
                <p><strong>Recipients</strong></p>
                <p>{selectedMessage.recipients.join(', ') || 'All'}</p>
                <p><strong>Status</strong></p>
                <p className={statusClassName(selectedMessage.status)}>{selectedMessage.status}</p>
                <p><strong>Attachments</strong></p>
                <p>{selectedMessage.attachments.length ? selectedMessage.attachments.join(', ') : 'None'}</p>
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

export default CommunicationsHub
