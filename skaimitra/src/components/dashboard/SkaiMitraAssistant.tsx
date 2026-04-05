import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Bot, MessageCircle, Send, X } from 'lucide-react'

type ChatMessage = {
  id: string
  text: string
  isBot: boolean
  createdAt: string
}

type SkaiMitraAssistantProps = {
  role?: 'teacher' | 'student' | 'admin'
}

export function SkaiMitraAssistant({ role = 'teacher' }: SkaiMitraAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: "Hello! I'm SkaiMitra, your AI assistant. Ask me anything about lessons, assignments, or reports.",
      isBot: true,
      createdAt: new Date().toISOString(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen])

  const sendBotMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: `${Date.now()}`, text, isBot: true, createdAt: new Date().toISOString() }])
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = { id: `${Date.now()}-u`, text: inputMessage.trim(), isBot: false, createdAt: new Date().toISOString() }
    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          prompt: userMessage.text,
          history: messages.map((msg) => ({ role: msg.isBot ? 'assistant' : 'user', content: msg.text })),
        }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error((data?.error) || 'AI response failed.')
      }

      const data = (await res.json()) as { reply: string }
      sendBotMessage(data.reply)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to connect with AI'
      sendBotMessage(`Error: ${message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 z-50 text-white flex items-center justify-center"
          aria-label="Open SkaiMitra Assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col border border-purple-200 bg-white overflow-hidden rounded-lg">
          <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="text-lg font-medium">SkaiMitra Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="border border-white/30 p-1 rounded hover:bg-white/20"
              aria-label="Close AI assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                    msg.isBot ? 'bg-white text-gray-800' : 'bg-linear-to-r from-purple-600 to-blue-600 text-white'
                  }`}
                >
                  {msg.isBot && <p className="text-xs font-medium mb-1">SkaiMitra</p>}
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {isLoading && <div className="text-sm text-gray-500">AI is typing...</div>}
          </div>

          <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Type a message"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="inline-flex items-center justify-center rounded px-3 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
