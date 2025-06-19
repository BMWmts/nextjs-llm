"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"
import { useRef, useEffect, useState } from "react"

interface Message { //กำหนดโครงสร้างของอ็อบเจกต์ ช่วยให้โค้ดมีความปลอดภัยและอ่านง่ายขึ้น
  id: string
  role: "user" | "assistant"
  content: string
}

export function ChatBot() { //ใช้ Hook useState เพื่อจัดการ state ของข้อความทั้งหมด ในการสนทนา
  const [messages, setMessages] = useState<Message[]>([])  //messages คืออาร์เรย์ของอ็อบเจกต์ Message setMessages คือฟังก์ชันสำหรับอัปเดต messages [] คือค่าเริ่มต้น (อาร์เรย์ว่าง)
  const [input, setInput] = useState("") //State สำหรับเก็บ ข้อความที่ผู้ใช้กำลังพิมพ์ ในช่อง input
  const [isLoading, setIsLoading] = useState(false) //State สำหรับระบุว่า กำลังรอการตอบกลับจาก AI อยู่หรือไม่ (เพื่อแสดงสถานะ loading และปิดใช้งานปุ่มส่งข้อความ)
  const messagesEndRef = useRef<HTMLDivElement>(null) //ใช้ Hook useRef เพื่อสร้าง reference ไปยัง DOM element โดยเฉพาะคือ div ที่อยู่ท้ายสุดของ container ข้อความ ใช้สำหรับ เลื่อนหน้าจอลงไปที่ข้อความล่าสุด โดยอัตโนมัติ
  const textareaRef = useRef<HTMLTextAreaElement>(null) //ใช้ useRef เพื่อสร้าง reference ไปยัง textarea element ใช้สำหรับ ปรับขนาด textarea อัตโนมัติ

  const scrollToBottom = () => { //ฟังก์ชันนี้ใช้ scrollIntoView บน messagesEndRef เพื่อเลื่อนหน้าจอให้ข้อความล่าสุดแสดงขึ้นมา
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) //ฟังก์ชันนี้ใช้ scrollIntoView บน messagesEndRef เพื่อเลื่อนหน้าจอให้ข้อความล่าสุดแสดงขึ้นมา
  }

  useEffect(() => { //Hook useEffect นี้จะถูกเรียกใช้ ทุกครั้งที่ messages state มีการเปลี่ยนแปลง (นั่นคือเมื่อมีข้อความใหม่เพิ่มเข้ามา) เพื่อให้หน้าจอเลื่อนลงไปดูข้อความล่าสุดเสมอ
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  const adjustTextareaHeight = () => { //ฟังก์ชันนี้ปรับความสูงของ textarea โดยอัตโนมัติให้พอดีกับเนื้อหาที่ผู้ใช้พิมพ์ แต่ไม่เกิน 120px
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px` // Max height of 120px (about 5 lines)
    }
  }

  useEffect(() => { //Hook useEffect นี้จะถูกเรียกใช้ ทุกครั้งที่ input state มีการเปลี่ยนแปลง (เมื่อผู้ใช้พิมพ์ข้อความ) เพื่อปรับความสูงของ textarea
    adjustTextareaHeight()
  }, [input])

  const handleSubmit = async (e: React.FormEvent) => { //ฟังก์ชันนี้จัดการเมื่อผู้ใช้ ส่งฟอร์ม (กดปุ่มส่งหรือ Enter)
    e.preventDefault() //e.preventDefault(): ป้องกันการรีเฟรชหน้าเว็บที่เป็นพฤติกรรมเริ่มต้นของฟอร์ม HTML
    if (!input.trim() || isLoading) return //รวจสอบว่าช่อง input ไม่ว่างเปล่า และไม่ได้กำลังโหลดอยู่

    const userMessage: Message = { //สร้างอ็อบเจกต์สำหรับข้อความของผู้ใช้
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage]) //เพิ่มข้อความของผู้ใช้เข้าไปในอาร์เรย์ messages (โดยใช้ functional update เพื่อให้แน่ใจว่าได้ state ก่อนหน้าล่าสุด)
    setInput("") //ล้างช่อง input
    setIsLoading(true) //ตั้งค่า isLoading เป็น true เพื่อแสดงสถานะโหลด

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    try {
      const response = await fetch("/api/chat", { //ส่งคำขอ POST ไปยัง API route /api/chat ที่อธิบายไปก่อนหน้านี้ พร้อมกับส่งอาร์เรย์ข้อความทั้งหมด (รวมถึงข้อความล่าสุดของผู้ใช้) ไปด้วย
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      const data = await response.json() //รอและแปลง Response ที่ได้จาก API ให้เป็น JSON

      if (response.ok) { //ตรวจสอบว่าคำขอ API สำเร็จหรือไม่ (HTTP status code 2xx)
// สร้างอ็อบเจกต์ assistantMessage ด้วยเนื้อหาที่ได้จาก AI และเพิ่มลงใน messages state
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

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Assistant (Gemini 2.5 Flash)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation with the AI assistant!</p>
              <p className="text-xs mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 break-words max-h-[290px] overflow-y-auto ${
                  message.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gray-500 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-blue-500 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
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
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-y-auto min-h-[40px] max-h-[120px]"
                disabled={isLoading}
                rows={1}
              />
            </div>
            <Button type="submit" disabled={isLoading || !input.trim()} className="flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-xs text-gray-500 mt-1">Press Enter to send • Shift+Enter for new line</div>
        </div>
      </CardContent>
    </Card>
  )
}
