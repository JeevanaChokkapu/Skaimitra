import { useEffect, useMemo, useRef, useState } from 'react'
import { Send, Trash2 } from 'lucide-react'

type UserRole = 'admin' | 'teacher' | 'student'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: string
}

type AIChatProps = {
  role: UserRole
}

const STORAGE_KEY = 'skaimitra_ai_chat_history'

const roleSystemPrompt: Record<UserRole, string> = {
  teacher: 'You are a helpful teacher assistant who can create lesson plans, suggest assignments, and improve classroom strategy.',
  student: 'You are a student tutor who explains concepts clearly, answers subject questions, and provides study summaries.',
  admin: 'You are an admin assistant who drafts announcements, analyzes reports, and provides data-driven insights.',
}

const loadMessages = (): ChatMessage[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Record<string, ChatMessage[]>
    return parsed[window.location.pathname] ?? []
  } catch {
    return []
  }
}

const saveMessages = (messages: ChatMessage[]) => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as Record<string, ChatMessage[]>) : {}
    parsed[window.location.pathname] = messages
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
  } catch {
    // ignore
  }
}

function AIChat({ role }: AIChatProps) {
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMessages(loadMessages())
  }, [])

  useEffect(() => {
    saveMessages(messages)
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const chats = useMemo(() => messages, [messages])

  const addMessage = (roleKey: 'user' | 'assistant', text: string) => {
    setMessages((current) => [...current, { id: `${Date.now()}-${Math.random()}`, role: roleKey, text, ts: new Date().toISOString() }])
  }

  const onSend = async () => {
    if (!inputText.trim()) return
    const userText = inputText.trim()
    setError('')
    addMessage('user', userText)
    setInputText('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          prompt: userText,
          context: roleSystemPrompt[role],
          history: messages.map((item) => ({ role: item.role, content: item.text })),
        }),
      })

      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload?.error || 'Failed to fetch AI response.')
      }

      const json = await response.json() as { reply: string }
      addMessage('assistant', json.reply)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
      addMessage('assistant', `Sorry, something went wrong: ${msg}`)
    } finally {
      setIsLoading(false)
    }
  }

  const onClear = () => {
    setMessages([])
    saveMessages([])
    setError('')
    setInputText('')
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void onSend()
    }
  }

  return (
    <section className="role-card ai-assistant-panel ai-assistant-panel-inline" aria-label="AI Assistant">
      <header className="ai-assistant-header">
        <div>
          <h4>AI Assistant</h4>
          <p>{role === 'teacher' ? 'Plan faster and grade smarter.' : role === 'admin' ? 'Draft, analyze, and organize quickly.' : 'Ask for study help anytime.'}</p>
        </div>
        <div className="ai-assistant-header-actions">
          <button type="button" className="ai-assistant-icon-btn" onClick={onClear} title="Clear chat">
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      <div className="ai-chat-body" ref={scrollRef}>
        {chats.length === 0 ? <p className="ai-chat-empty">Start a conversation with your AI helper.</p> : null}
        {chats.map((msg) => (
          <div key={msg.id} className={`ai-chat-message ${msg.role === 'user' ? 'ai-chat-user' : 'ai-chat-assistant'}`}>
            <div className="ai-chat-bubble">{msg.text}</div>
            <span className="ai-chat-ts">{new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        ))}
        {isLoading ? <div className="ai-chat-loading">AI is typing...</div> : null}
        {error ? <div className="ai-chat-error">{error}</div> : null}
      </div>

      <div className="ai-chat-input-row">
        <input
          type="text"
          placeholder="Type your question..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Type message"
        />
        <button type="button" className="ai-chat-send-btn" onClick={() => void onSend()} disabled={!inputText.trim() || isLoading}>
          <Send size={16} />
        </button>
      </div>
    </section>
  )
}

export default AIChat
