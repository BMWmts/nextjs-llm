"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, User, History, Sparkles } from "lucide-react"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
        <Card className="w-full max-w-4xl mx-auto h-[700px] flex flex-col">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <History className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Chat History
                </span>
              </div>
              <Button variant="outline" onClick={() => setShowHistory(false)} className="rounded-xl">
                Back to Chat
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6">
            {chatHistory.length === 0 ? (
              <div className="text-center text-slate-500 py-12">
                <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl w-fit mx-auto mb-4">
                  <History className="h-12 w-12 text-slate-400" />
                </div>
                <p className="text-lg font-medium">No chat history found</p>
                <p className="text-sm mt-1">Start a conversation to see your history here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="text-xs text-slate-500 font-medium">
                      {new Date(chat.created_at).toLocaleString()}
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                      <div className="font-semibold text-sm text-blue-800 mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        You
                      </div>
                      <div className="text-sm text-slate-700 leading-relaxed">{chat.user_message}</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                      <div className="font-semibold text-sm text-purple-800 mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        AI Assistant
                      </div>
                      <div className="text-sm text-slate-700 leading-relaxed">{chat.ai_response}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
      <Card className="w-full max-w-4xl mx-auto h-[700px] flex flex-col">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Assistant
                </span>
                <p className="text-xs text-slate-500 font-normal mt-1">Powered by Aem</p>
              </div>
            </div>
            <Button variant="outline" onClick={loadChatHistory} className="rounded-xl">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 py-12">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl w-fit mx-auto mb-6 border border-blue-100">
                  <Sparkles className="h-16 w-16 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Start a conversation</h3>
                <p className="text-slate-500 mb-1">Ask me anything and I will help you out!</p>
                <p className="text-xs text-slate-400">Your conversations are automatically saved</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <Sparkles className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl px-6 py-4 break-words max-h-[300px] overflow-y-auto shadow-lg transition-all duration-300 hover:shadow-xl ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-auto"
                      : "bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200/60"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-white">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 justify-start">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <Sparkles className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-6 py-4 shadow-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-slate-100 p-6 bg-white/50 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-y-auto min-h-[48px] max-h-[120px] bg-white text-black font-medium transition-all duration-200 placeholder:text-slate-500 shadow-sm"
                  style={{ color: "#000000 !important" }}
                  disabled={isLoading}
                  rows={1}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex-shrink-0 h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                size="icon"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
            <div className="text-xs text-slate-500 mt-3 text-center">
              Press <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Enter</kbd> to send •
              <kbd className="px-2 py-1 bg-slate-100 rounded text-xs ml-1">Shift+Enter</kbd> for new line •
              Conversations are saved automatically
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
