import React, { useEffect, useMemo, useState } from 'react'
import {
  Archive,
  CheckCircle2,
  Eye,
  Mail,
  MessageCircleMore,
  MessagesSquare,
  Paperclip,
  Plane,
  Plus,
  Search,
  Smartphone,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'

type DeliveryMethod = 'Email' | 'WhatsApp' | 'SMS'
type CommunicationStatus = 'Draft' | 'Sent' | 'Received' | 'Delivered' | 'Failed' | 'Archived'
type CommunicationCategory = 'Fee reminder' | 'Holiday notice' | 'PTM invite' | 'General'
type RecipientMode = 'groups' | 'individual'
type FilterTab = 'All' | 'Drafts' | 'Sent' | 'Received' | 'Delivered' | 'Failed'
type ComposeStatus = 'Draft' | 'Active'
type PriorityLevel = 'Low' | 'Normal' | 'High'

type CommunicationMessage = {
  id: string
  scheduleDate: string
  type: 'Notice' | 'Fees' | 'General'
  category: CommunicationCategory
  subjectLine: string
  deliveryMethod: DeliveryMethod
  status: CommunicationStatus
  recipients: string[]
  content: string
  attachments: string[]
  aiContext: string
  priority: PriorityLevel
}

type ComposeFormState = {
  category: CommunicationCategory
  deliveryMethod: DeliveryMethod
  subjectLine: string
  scheduleDate: string
  recipients: string
  cc: string
  bcc: string
  phoneNumber: string
  aiContext: string
  content: string
  attachments: string[]
  recipientMode: RecipientMode
  selectedGroups: string[]
  classValue: string
  sectionValue: string
  priority: PriorityLevel
  status: ComposeStatus
  individualEntry: string
  individualRecipients: string[]
}

type CommunicationsHubProps = {
  role?: 'admin' | 'teacher'
}

const STORAGE_KEY = 'skaimitra_communications_messages_v2'
const groupOptions = ['All Students', 'All Teachers', 'Administrators', 'All Parents']
const filterTabs: FilterTab[] = ['All', 'Drafts', 'Sent', 'Received', 'Delivered', 'Failed']
const suggestionPills = ['Professional tone', 'Friendly tone', 'Make concise', 'Formal tone']

const sampleMessages: CommunicationMessage[] = [
  {
    id: 'msg-1',
    scheduleDate: '2026-04-02T09:00',
    type: 'Notice',
    category: 'Holiday notice',
    subjectLine: 'School Summer Holidays',
    deliveryMethod: 'Email',
    status: 'Draft',
    recipients: ['All'],
    content: 'Please note the school summer holiday schedule for April.',
    attachments: [],
    aiContext: '',
    priority: 'Normal',
  },
  {
    id: 'msg-2',
    scheduleDate: '2026-04-06T10:30',
    type: 'Notice',
    category: 'Holiday notice',
    subjectLine: 'School Summer Holidays',
    deliveryMethod: 'WhatsApp',
    status: 'Sent',
    recipients: ['All'],
    content: 'WhatsApp reminder for the summer holiday schedule.',
    attachments: [],
    aiContext: '',
    priority: 'Normal',
  },
  {
    id: 'msg-3',
    scheduleDate: '2026-04-30T08:15',
    type: 'Fees',
    category: 'Fee reminder',
    subjectLine: 'School Fees',
    deliveryMethod: 'Email',
    status: 'Draft',
    recipients: ['Students'],
    content: 'Fee reminder for the current term.',
    attachments: [],
    aiContext: '',
    priority: 'High',
  },
  {
    id: 'msg-4',
    scheduleDate: '2026-04-08T11:00',
    type: 'Notice',
    category: 'General',
    subjectLine: 'Bus Route Update',
    deliveryMethod: 'SMS',
    status: 'Delivered',
    recipients: ['All Parents'],
    content: 'Route timing adjustments have been sent to parents.',
    attachments: [],
    aiContext: '',
    priority: 'Normal',
  },
  {
    id: 'msg-5',
    scheduleDate: '2026-04-09T08:45',
    type: 'General',
    category: 'General',
    subjectLine: 'Parent Response: Field Trip Consent',
    deliveryMethod: 'Email',
    status: 'Received',
    recipients: ['Teacher'],
    content: 'A parent has replied with field trip consent and follow-up questions.',
    attachments: [],
    aiContext: '',
    priority: 'Normal',
  },
  {
    id: 'msg-6',
    scheduleDate: '2026-04-10T17:00',
    type: 'General',
    category: 'PTM invite',
    subjectLine: 'Parent Teacher Meeting Reminder',
    deliveryMethod: 'WhatsApp',
    status: 'Failed',
    recipients: ['Class 8 Parents'],
    content: 'PTM invite delivery failed for one of the recipient segments.',
    attachments: [],
    aiContext: '',
    priority: 'Normal',
  },
]

const emptyForm = (): ComposeFormState => ({
  category: 'General',
  deliveryMethod: 'Email',
  subjectLine: '',
  scheduleDate: '2026-03-31T12:30',
  recipients: '',
  cc: '',
  bcc: '',
  phoneNumber: '',
  aiContext: '',
  content: '',
  attachments: [],
  recipientMode: 'groups',
  selectedGroups: [],
  classValue: '',
  sectionValue: '',
  priority: 'Normal',
  status: 'Draft',
  individualEntry: '',
  individualRecipients: [],
})

const loadMessages = (): CommunicationMessage[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return sampleMessages
    const parsed = JSON.parse(raw) as CommunicationMessage[]
    return parsed.length ? parsed : sampleMessages
  } catch {
    return sampleMessages
  }
}

const saveMessages = (messages: CommunicationMessage[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

const formatScheduleDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: '2-digit',
  })

const messageTypeFromCategory = (category: CommunicationCategory): CommunicationMessage['type'] => {
  if (category === 'Fee reminder') return 'Fees'
  if (category === 'Holiday notice') return 'Notice'
  return 'General'
}

const statusTextClass = (status: CommunicationStatus) => {
  switch (status) {
    case 'Sent':
      return 'communications-status communications-status-sent'
    case 'Received':
      return 'communications-status communications-status-received'
    case 'Delivered':
      return 'communications-status communications-status-delivered'
    case 'Failed':
      return 'communications-status communications-status-failed'
    default:
      return 'communications-status communications-status-draft'
  }
}

const statsIconMap = {
  total: MessagesSquare,
  draft: Paperclip,
  sent: Plane,
  delivered: CheckCircle2,
  failed: X,
}

const channelCards = [
  { key: 'Email', title: 'Email', description: 'Reach customers via email', icon: Mail, className: 'is-email' },
  { key: 'WhatsApp', title: 'WhatsApp', description: 'Send messages via WhatsApp', icon: MessageCircleMore, className: 'is-whatsapp' },
  { key: 'SMS', title: 'SMS', description: 'Text message campaigns', icon: Smartphone, className: 'is-sms' },
]

const CommunicationsHub: React.FC<CommunicationsHubProps> = ({ role = 'teacher' }) => {
  const [messages, setMessages] = useState<CommunicationMessage[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterTab, setFilterTab] = useState<FilterTab>('All')
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<CommunicationMessage | null>(null)
  const [formState, setFormState] = useState<ComposeFormState>(emptyForm)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMessages(loadMessages())
  }, [])

  useEffect(() => {
    if (!notice && !error) return
    const timer = window.setTimeout(() => {
      setNotice(null)
      setError(null)
    }, 2800)
    return () => window.clearTimeout(timer)
  }, [notice, error])

  const stats = useMemo(() => ({
    total: messages.filter((item) => item.status !== 'Archived').length,
    draft: messages.filter((item) => item.status === 'Draft').length,
    sent: messages.filter((item) => item.status === 'Sent').length,
    received: messages.filter((item) => item.status === 'Received').length,
    delivered: messages.filter((item) => item.status === 'Delivered').length,
    failed: messages.filter((item) => item.status === 'Failed').length,
  }), [messages])

  const filteredMessages = useMemo(() => {
    return messages
      .filter((message) => message.status !== 'Archived')
      .filter((message) => {
        if (!searchTerm.trim()) return true
        const query = searchTerm.trim().toLowerCase()
        return [message.subjectLine, message.type, message.deliveryMethod, message.recipients.join(', ')]
          .join(' ')
          .toLowerCase()
          .includes(query)
      })
      .filter((message) => (filterDate ? message.scheduleDate.slice(0, 10) === filterDate : true))
      .filter((message) => {
        if (filterTab === 'All') return true
        if (filterTab === 'Drafts') return message.status === 'Draft'
        if (filterTab === 'Sent') return message.status === 'Sent'
        if (filterTab === 'Received') return message.status === 'Received'
        if (filterTab === 'Delivered') return message.status === 'Delivered'
        if (filterTab === 'Failed') return message.status === 'Failed'
        return true
      })
  }, [messages, searchTerm, filterDate, filterTab])

  const resetCompose = () => {
    setFormState(emptyForm())
    setError(null)
  }

  const openCompose = () => {
    resetCompose()
    setIsComposeOpen(true)
  }

  const closeCompose = () => {
    setIsComposeOpen(false)
    resetCompose()
  }

  const updateForm = <K extends keyof ComposeFormState>(field: K, value: ComposeFormState[K]) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const toggleGroupRecipient = (group: string) => {
    setFormState((prev) => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(group)
        ? prev.selectedGroups.filter((item) => item !== group)
        : [...prev.selectedGroups, group],
    }))
  }

  const addIndividualRecipient = () => {
    const trimmed = formState.individualEntry.trim()
    if (!trimmed) return
    setFormState((prev) => ({
      ...prev,
      individualRecipients: [...prev.individualRecipients, trimmed],
      individualEntry: '',
    }))
  }

  const handleAttachmentUpload = (files: FileList | null) => {
    if (!files?.length) return
    const fileNames = Array.from(files).map((file) => file.name)
    setFormState((prev) => ({ ...prev, attachments: [...prev.attachments, ...fileNames] }))
  }

  const handleAiAssist = (override?: string) => {
    const context = override || formState.aiContext || formState.subjectLine
    if (!context.trim()) {
      setError('Add a subject or AI context so the assistant can generate content.')
      return
    }

    const generated = [
      `Hello,`,
      ``,
      `This ${formState.category.toLowerCase()} is to inform you about ${context.trim()}.`,
      `Please review the details carefully and follow the required next steps.`,
      ``,
      `Thank you,`,
      `${role === 'admin' ? 'Skaimitra Admin Team' : 'Skaimitra Teacher Team'}`,
    ].join('\n')

    setFormState((prev) => ({ ...prev, content: generated }))
    setNotice('AI content generated successfully.')
  }

  const buildRecipients = () => {
    if (formState.deliveryMethod === 'WhatsApp' || formState.deliveryMethod === 'SMS') {
      return formState.phoneNumber
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }

    if (formState.recipientMode === 'groups') {
      const baseRecipients = [...formState.selectedGroups]
      if (formState.classValue) baseRecipients.push(`Class ${formState.classValue}`)
      if (formState.sectionValue) baseRecipients.push(`Section ${formState.sectionValue}`)
      if (formState.recipients.trim()) {
        baseRecipients.push(...formState.recipients.split(',').map((item) => item.trim()).filter(Boolean))
      }
      return baseRecipients
    }

    const individuals = [...formState.individualRecipients]
    if (formState.recipients.trim()) {
      individuals.push(...formState.recipients.split(',').map((item) => item.trim()).filter(Boolean))
    }
    return individuals
  }

  const persistMessages = (nextMessages: CommunicationMessage[], successMessage: string) => {
    setMessages(nextMessages)
    saveMessages(nextMessages)
    setNotice(successMessage)
  }

  const saveDraft = () => {
    const nextRecipients = buildRecipients()
    const nextMessage: CommunicationMessage = {
      id: `${Date.now()}`,
      scheduleDate: formState.scheduleDate,
      type: messageTypeFromCategory(formState.category),
      category: formState.category,
      subjectLine: formState.subjectLine || 'Untitled draft',
      deliveryMethod: formState.deliveryMethod,
      status: 'Draft',
      recipients: nextRecipients.length ? nextRecipients : ['All'],
      content: formState.content,
      attachments: formState.attachments,
      aiContext: formState.aiContext,
      priority: formState.priority,
    }

    persistMessages([nextMessage, ...messages], 'Draft saved successfully.')
    closeCompose()
  }

  const sendMessage = () => {
    const nextRecipients = buildRecipients()
    if (formState.deliveryMethod === 'Email' && !formState.subjectLine.trim()) {
      setError('Subject line is required.')
      return
    }
    if (formState.deliveryMethod !== 'SMS' && !formState.content.trim()) {
      setError('Message content is required.')
      return
    }
    if (!nextRecipients.length) {
      setError(formState.deliveryMethod === 'Email' ? 'Please add at least one recipient or recipient group.' : 'Please enter at least one phone number.')
      return
    }

    const nextStatus: CommunicationStatus = formState.deliveryMethod === 'SMS' ? 'Delivered' : 'Sent'
    const nextMessage: CommunicationMessage = {
      id: `${Date.now()}`,
      scheduleDate: formState.scheduleDate,
      type: messageTypeFromCategory(formState.category),
      category: formState.category,
      subjectLine: formState.subjectLine.trim(),
      deliveryMethod: formState.deliveryMethod,
      status: nextStatus,
      recipients: nextRecipients,
      content: formState.content.trim(),
      attachments: formState.attachments,
      aiContext: formState.aiContext,
      priority: formState.priority,
    }

    persistMessages([nextMessage, ...messages], 'Message sent successfully.')
    closeCompose()
  }

  const handleDelete = (id: string) => {
    persistMessages(messages.filter((message) => message.id !== id), 'Message deleted successfully.')
    if (selectedMessage?.id === id) {
      setSelectedMessage(null)
    }
  }

  const handleArchive = (id: string) => {
    persistMessages(
      messages.map((message) => (message.id === id ? { ...message, status: 'Archived' as const } : message)),
      'Message archived successfully.',
    )
    if (selectedMessage?.id === id) {
      setSelectedMessage(null)
    }
  }

  const isEmpty = filteredMessages.length === 0

  return (
    <main className="role-main role-main-detail communications-page-shell">
      <section className="role-primary communications-page">
        <section className="role-section-head role-admin-page-head communications-page-head">
          <div>
            <h2>Communications Hub</h2>
            <p className="role-muted">Create, schedule and track Email/WhatsApp messages with AI assist.</p>
          </div>
        </section>

        {notice ? <div className="role-floating-notice is-success">{notice}</div> : null}
        {error ? <div className="role-floating-notice is-error">{error}</div> : null}

        <section className="communications-stats-grid">
          {[
            { label: 'Total', value: stats.total, key: 'total', colorClass: 'is-total' },
            { label: 'Draft', value: stats.draft, key: 'draft', colorClass: 'is-draft' },
            { label: 'Sent', value: stats.sent, key: 'sent', colorClass: 'is-sent' },
            { label: 'Delivered', value: stats.delivered, key: 'delivered', colorClass: 'is-delivered' },
            { label: 'Failed', value: stats.failed, key: 'failed', colorClass: 'is-failed' },
          ].map((card) => {
            const Icon = statsIconMap[card.key as keyof typeof statsIconMap]
            return (
              <article key={card.label} className={`communications-stat-card ${card.colorClass}`}>
                <div>
                  <span className="communications-stat-label">{card.label}</span>
                  <strong className="communications-stat-value">{card.value}</strong>
                </div>
                <span className="communications-stat-icon">
                  <Icon size={16} />
                </span>
              </article>
            )
          })}
        </section>

        <section className="communications-channel-section">
          <div className="communications-section-label">Channels</div>
          <div className="communications-channel-grid">
            {channelCards.map((channel) => (
              <article key={channel.key} className={`communications-channel-card ${channel.className}`}>
                <span className="communications-channel-icon">
                  <channel.icon size={20} />
                </span>
                <div>
                  <h3>{channel.title}</h3>
                  <p>{channel.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="communications-filter-tabs">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={filterTab === tab ? 'is-active' : ''}
              onClick={() => setFilterTab(tab)}
            >
              {tab}
            </button>
          ))}
        </section>

        <section className="communications-controls-bar">
          <div className="communications-controls-left">
            <div className="role-user-search-wrap communications-search">
              <Search size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by subject, type, delivery method, or recipient..."
              />
            </div>
          </div>
          <div className="communications-controls-right">
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="communications-date-input" />
            <button type="button" className="role-secondary-btn" onClick={() => setFilterDate('')}>
              Clear Date
            </button>
            <button type="button" className="role-primary-btn" onClick={openCompose}>
              <Plus size={14} />
              New Message
            </button>
          </div>
        </section>

        {isEmpty ? (
          <section className="communications-empty-state-card">
            <div className="communications-empty-icon">
              <MessagesSquare size={40} />
            </div>
            <h3>No messages found</h3>
            <p className="role-muted">Create your first message to get started</p>
            <button type="button" className="role-primary-btn" onClick={openCompose}>
              <Plus size={14} />
              New Message
            </button>
          </section>
        ) : (
          <section className="role-card role-communications-table-card communications-table-card">
            <div className="role-table-responsive">
              <table className="role-table communications-table">
                <thead>
                  <tr>
                    <th>Schedule Date</th>
                    <th>Type</th>
                    <th>Subject Line</th>
                    <th>Delivery Method</th>
                    <th>Status</th>
                    <th>Recipients</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((message) => (
                    <tr key={message.id}>
                      <td>{formatScheduleDate(message.scheduleDate)}</td>
                      <td>{message.type}</td>
                      <td>{message.subjectLine}</td>
                      <td>{message.deliveryMethod}</td>
                      <td><span className={statusTextClass(message.status)}>{message.status}</span></td>
                      <td>{message.recipients.join(', ')}</td>
                      <td>
                        <div className="communications-action-icons">
                          <button type="button" title="View" onClick={() => setSelectedMessage(message)}>
                            <Eye size={15} />
                          </button>
                          <button type="button" title="Delete" onClick={() => handleDelete(message.id)}>
                            <Trash2 size={15} />
                          </button>
                          <button type="button" title="Archive" onClick={() => handleArchive(message.id)}>
                            <Archive size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </section>

      {isComposeOpen ? (
        <div className="communications-modal-backdrop" role="presentation" onClick={closeCompose}>
          <section className="communications-compose-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <header className="communications-compose-head">
              <div className="communications-compose-title">
                <Plane size={18} />
                <h3>Compose Message</h3>
              </div>
              <button type="button" onClick={closeCompose} aria-label="Close compose modal">
                <X size={18} />
              </button>
            </header>

            <div className="communications-compose-body">
              <div className="communications-modal-grid">
                <div className="communications-delivery-field">
                  <span className="communications-modal-label">Delivery Type</span>
                  <div className="communications-delivery-toggle">
                    {(['Email', 'WhatsApp', 'SMS'] as DeliveryMethod[]).map((method) => (
                      <button
                        key={method}
                        type="button"
                        className={formState.deliveryMethod === method ? 'is-active' : ''}
                        onClick={() => updateForm('deliveryMethod', method)}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <label>
                  <span>Priority</span>
                  <select value={formState.priority} onChange={(e) => updateForm('priority', e.target.value as PriorityLevel)}>
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                  </select>
                </label>
              </div>

              <section className="communications-compose-section">
                <span className="communications-modal-label">Recipients</span>
                <div className="communications-recipient-tabs">
                  <button type="button" className={formState.recipientMode === 'groups' ? 'is-active' : ''} onClick={() => updateForm('recipientMode', 'groups')}>
                    Groups
                  </button>
                  <button type="button" className={formState.recipientMode === 'individual' ? 'is-active' : ''} onClick={() => updateForm('recipientMode', 'individual')}>
                    Individual
                  </button>
                </div>

                {formState.recipientMode === 'groups' ? (
                  <>
                    <div className="communications-groups-grid">
                      {groupOptions.map((group) => (
                        <label key={group} className="communications-group-option">
                          <input type="checkbox" checked={formState.selectedGroups.includes(group)} onChange={() => toggleGroupRecipient(group)} />
                          <span>{group}</span>
                        </label>
                      ))}
                    </div>

                    <div className="communications-modal-label">Filter by Class & Section</div>
                    <div className="communications-modal-grid">
                      <label>
                        <span>Select Class</span>
                        <select value={formState.classValue} onChange={(e) => updateForm('classValue', e.target.value)}>
                          <option value="">Select Class</option>
                          <option value="6">Class 6</option>
                          <option value="7">Class 7</option>
                          <option value="8">Class 8</option>
                        </select>
                      </label>
                      <label>
                        <span>Select Section</span>
                        <select value={formState.sectionValue} onChange={(e) => updateForm('sectionValue', e.target.value)}>
                          <option value="">Select Section</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </label>
                    </div>
                  </>
                ) : (
                  <div className="communications-individual-stack">
                    <input
                      type="text"
                      placeholder="Enter email or phone number"
                      value={formState.individualEntry}
                      onChange={(e) => updateForm('individualEntry', e.target.value)}
                    />
                    <button type="button" className="communications-add-recipient-btn" onClick={addIndividualRecipient}>
                      <Plus size={16} />
                      Add Recipient
                    </button>
                    {formState.individualRecipients.length ? (
                      <div className="communications-recipient-chips">
                        {formState.individualRecipients.map((recipient) => (
                          <span key={recipient} className="role-badge">{recipient}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </section>

              {formState.deliveryMethod === 'Email' ? (
                <>
                  <label>
                    <span>To</span>
                    <input
                      type="text"
                      placeholder="Default recipients"
                      value={formState.recipients}
                      onChange={(e) => updateForm('recipients', e.target.value)}
                    />
                  </label>

                  <div className="communications-modal-grid">
                    <label>
                      <span>CC</span>
                      <input
                        type="text"
                        placeholder="Optional CC recipients"
                        value={formState.cc}
                        onChange={(e) => updateForm('cc', e.target.value)}
                      />
                    </label>
                    <label>
                      <span>BCC</span>
                      <input
                        type="text"
                        placeholder="Optional BCC recipients"
                        value={formState.bcc}
                        onChange={(e) => updateForm('bcc', e.target.value)}
                      />
                    </label>
                  </div>
                </>
              ) : (
                <label>
                  <span>Phone Number</span>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    value={formState.phoneNumber}
                    onChange={(e) => updateForm('phoneNumber', e.target.value)}
                  />
                </label>
              )}

              <div className="communications-modal-grid">
                <label>
                  <span>Category</span>
                  <select value={formState.category} onChange={(e) => updateForm('category', e.target.value as CommunicationCategory)}>
                    <option value="General">General</option>
                    <option value="Fee reminder">Fee reminder</option>
                    <option value="Holiday notice">Holiday notice</option>
                    <option value="PTM invite">PTM invite</option>
                  </select>
                </label>
                <label>
                  <span>Status</span>
                  <select value={formState.status} onChange={(e) => updateForm('status', e.target.value as ComposeStatus)}>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                  </select>
                </label>
              </div>

              {formState.deliveryMethod === 'Email' ? (
                <label>
                  <span>Subject</span>
                  <input
                    type="text"
                    placeholder="Message subject line"
                    value={formState.subjectLine}
                    onChange={(e) => updateForm('subjectLine', e.target.value)}
                  />
                </label>
              ) : null}

              <label>
                <span>Schedule (Optional)</span>
                <input
                  type="datetime-local"
                  value={formState.scheduleDate}
                  onChange={(e) => updateForm('scheduleDate', e.target.value)}
                />
              </label>

              {formState.deliveryMethod !== 'SMS' ? (
                <section className="communications-ai-panel communications-content-combined-panel">
                  <div className="communications-ai-panel-head">
                    <strong>Message Content</strong>
                  </div>
                  <textarea
                    className="communications-content-textarea"
                    value={formState.content}
                    onChange={(e) => updateForm('content', e.target.value)}
                    placeholder="Write your message content here..."
                  />
                  <div className="communications-ai-panel-row">
                    <input
                      type="text"
                      placeholder="Describe what you want to say..."
                      value={formState.aiContext}
                      onChange={(e) => updateForm('aiContext', e.target.value)}
                    />
                    <button type="button" className="role-primary-btn" onClick={() => handleAiAssist()}>
                      <Sparkles size={14} />
                      Generate
                    </button>
                  </div>
                  <div className="communications-ai-suggestions">
                    {suggestionPills.map((pill) => (
                      <button key={pill} type="button" onClick={() => handleAiAssist(pill)}>
                        {pill}
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              <label>
                <span>Attachments</span>
                <label className="communications-upload-field">
                  <Paperclip size={16} />
                  <span>Upload attachments</span>
                  <input type="file" multiple onChange={(e) => handleAttachmentUpload(e.target.files)} />
                </label>
              </label>
              {formState.attachments.length ? (
                <div className="communications-recipient-chips">
                  {formState.attachments.map((attachment) => (
                    <span key={attachment} className="role-badge">{attachment}</span>
                  ))}
                </div>
              ) : null}
            </div>

            <footer className="communications-compose-actions">
              <button type="button" className="role-secondary-btn" onClick={closeCompose}>Cancel</button>
              <button type="button" className="role-secondary-btn communications-outline-btn" onClick={saveDraft}>Save Draft</button>
              <button type="button" className="role-primary-btn" onClick={sendMessage}>Send Message</button>
            </footer>
          </section>
        </div>
      ) : null}

      {selectedMessage ? (
        <div className="communications-modal-backdrop" role="presentation" onClick={() => setSelectedMessage(null)}>
          <section className="communications-view-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <header className="communications-compose-head">
              <div className="communications-compose-title">
                <MessagesSquare size={18} />
                <h3>Message Details</h3>
              </div>
              <button type="button" onClick={() => setSelectedMessage(null)} aria-label="Close message details">
                <X size={18} />
              </button>
            </header>
            <div className="communications-view-content">
              <p><strong>Subject:</strong> {selectedMessage.subjectLine}</p>
              <p><strong>Type:</strong> {selectedMessage.type}</p>
              <p><strong>Delivery Method:</strong> {selectedMessage.deliveryMethod}</p>
              <p><strong>Status:</strong> <span className={statusTextClass(selectedMessage.status)}>{selectedMessage.status}</span></p>
              <p><strong>Recipients:</strong> {selectedMessage.recipients.join(', ')}</p>
              <p><strong>Schedule Date:</strong> {formatScheduleDate(selectedMessage.scheduleDate)}</p>
              <p><strong>Content:</strong></p>
              <div className="communications-view-body">{selectedMessage.content}</div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  )
}

export default CommunicationsHub
