import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export function SkaiMitraAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    { text: "Hello! I'm SkaiMitra, your AI learning assistant. How can I help you today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages((prev: Array<{ text: string; isBot: boolean }>) => [...prev, { text: inputMessage, isBot: false }]);
    
    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "I can help you with that! Let me find the information for you.",
        "That's a great question! Here's what I found...",
        "I understand. Let me assist you with your request.",
        "Based on your query, I recommend checking the relevant course materials.",
        "I'm here to help! Would you like me to provide more details?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev: Array<{ text: string; isBot: boolean }>) => [...prev, { text: randomResponse, isBot: true }]);
    }, 1000);

    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 z-50"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-t-lg p-4 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <CardTitle className="text-lg">SkaiMitra Assistant</CardTitle>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-white/80 mt-1">AI-powered learning assistant</p>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message: { text: string; isBot: boolean }, index: number) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isBot
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'bg-linear-to-r from-purple-600 to-blue-600 text-white'
                  }`}
                >
                  {message.isBot && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4" />
                      <span className="text-xs font-semibold">SkaiMitra</span>
                    </div>
                  )}
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-4 bg-white border-t shrink-0">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
