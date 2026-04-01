import type { InboxMessage } from '../../lib/dashboardData'

type MessageCenterProps = {
  isOpen: boolean
  messages: InboxMessage[]
  selectedMessageId: string | null
  onClose: () => void
  onSelect: (messageId: string) => void
  onPrev?: () => void
  onNext?: () => void
}

function MessageCenter({
  isOpen,
  messages,
  selectedMessageId,
  onClose,
  onSelect,
  onPrev,
  onNext,
}: MessageCenterProps) {
  if (!isOpen) return null

  const selectedMessage =
    messages.find((message) => message.id === selectedMessageId) ?? messages[0] ?? null

  const selectedMessageIndex = selectedMessage ? messages.findIndex((message) => message.id === selectedMessage.id) : -1
  const hasPrev = selectedMessageIndex > 0
  const hasNext = selectedMessageIndex >= 0 && selectedMessageIndex < messages.length - 1

  return (
    <div className="role-modal-backdrop" role="presentation" onClick={onClose}>
      <section className="role-modal role-message-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="role-modal-head">
          <h2>Messages</h2>
          <button type="button" onClick={onClose} aria-label="Close messages">
            x
          </button>
        </div>

        <div className="role-message-layout">
          <div className="role-message-list">
            {messages.length === 0 ? (
              <p className="role-muted">No messages available.</p>
            ) : (
              messages.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  className={`role-message-list-item ${selectedMessage?.id === message.id ? 'is-active' : ''}`}
                  onClick={() => onSelect(message.id)}
                >
                  <strong>{message.title}</strong>
                  <span>{message.date}</span>
                  <small>{message.audience}</small>
                </button>
              ))
            )}
          </div>

          <div className="role-message-detail">
            {selectedMessage ? (
              <>
                <div className="role-message-detail-nav">
                  {hasPrev && (
                    <button type="button" onClick={onPrev} aria-label="Previous message">
                      &lt;
                    </button>
                  )}
                  {hasNext && (
                    <button type="button" onClick={onNext} aria-label="Next message">
                      &gt;
                    </button>
                  )}
                </div>
                <h3>{selectedMessage.title}</h3>
                <p className="role-muted">{`${selectedMessage.date} • ${selectedMessage.audience}`}</p>
                <div className="role-message-body">{selectedMessage.description}</div>
              </>
            ) : (
              <p className="role-muted">Select a message to view its description.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default MessageCenter
