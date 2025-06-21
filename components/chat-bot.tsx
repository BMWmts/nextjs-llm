"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, User, History, MessageCircle } from "lucide-react"
import { useRef, useEffect, useState } from "react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatHistory {
  id: string
  user_message: string
  ai_response: string
  created_at: string
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  // Load chat history
  const loadChatHistory = async () => {
    try {
      const response = await fetch("/api/chat/history")
      const data = await response.json()

      if (response.ok) {
        setChatHistory(data.history)
        setShowHistory(true)
      }
    } catch (error) {
      console.error("Failed to load chat history:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  if (showHistory) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[80vh]">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black rounded-lg">
                    <History className="h-5 w-5 text-white" />
                  </div>
                  <span>Chat History</span>
                </div>
                <Button variant="outline" onClick={() => setShowHistory(false)}>
                  Back to Chat
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No chat history</p>
                  <p className="text-sm mt-1">Start a conversation to see your history here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {chatHistory.map((chat) => (
                    <div key={chat.id} className="border border-gray-100 rounded-xl p-6 space-y-4">
                      <div className="text-xs text-gray-500">{new Date(chat.created_at).toLocaleString()}</div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          You
                        </div>
                        <div className="text-sm text-gray-900">{chat.user_message}</div>
                      </div>
                      <div className="bg-black p-4 rounded-lg">
                        <div className="font-medium text-sm text-white mb-2 flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          AI Assistant
                        </div>
                        <div className="text-sm text-white">{chat.ai_response}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="h-[80vh] flex flex-col">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span>AI Assistant</span>
                  <p className="text-xs text-gray-500 font-normal mt-1">Powered by Gemini 2.0 Flash</p>
                </div>
              </div>
              <Button variant="outline" onClick={loadChatHistory}>
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <div className="p-6 bg-gray-50 rounded-2xl w-fit mx-auto mb-6">
                    <MessageCircle className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Start a conversation</h3>
                  <p className="text-gray-500 mb-1">Ask me anything and I will help you out!</p>
                  <p className="text-xs text-gray-400">Your conversations are automatically saved</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-black text-white">
                        <MessageCircle className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[75%] rounded-2xl px-6 py-4 break-words max-h-[300px] overflow-y-auto ${
                      message.role === "user"
                        ? "bg-black text-white ml-auto"
                        : "bg-gray-50 text-gray-900 border border-gray-100"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-gray-600 text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-black text-white">
                      <MessageCircle className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="border-t border-gray-100 p-6 bg-white">
              <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-none overflow-y-auto min-h-[48px] max-h-[120px] bg-white text-black transition-colors placeholder:text-gray-400"
                    disabled={isLoading}
                    rows={1}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex-shrink-0 h-12 w-12"
                  size="icon"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
              <div className="text-xs text-gray-500 mt-3 text-center">
                Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to send •
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs ml-1">Shift+Enter</kbd> for new line
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
