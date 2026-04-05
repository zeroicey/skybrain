import { useState } from 'react'
import { useAIStore } from '@/stores/ai-store'
import { chatWithAI, mockQuickReplies } from '@/data/mock-ai'
import { ChatHeader } from '@/components/ai/chat/chat-header'
import { MessageList } from '@/components/ai/chat/message-list'
import { ChatInput } from '@/components/ai/chat/chat-input'
import { QuickReplyList } from '@/components/ai/chat/quick-reply-list'
import { TypingIndicator } from '@/components/ai/chat/typing-indicator'
import { Card, CardContent } from '@/components/ui/card'
import type { AIMessage } from '@/types/ai'

export default function ChatPage() {
  const { messages, isTyping, addMessage, clearMessages, setTyping } = useAIStore()

  const handleSend = async (text: string) => {
    // 添加用户消息
    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    addMessage(userMsg)

    // 显示正在输入
    setTyping(true)

    try {
      const response = await chatWithAI(text)
      if (response.success && response.data) {
        addMessage(response.data)
      } else {
        addMessage({
          id: Date.now().toString(),
          role: 'ai',
          content: '抱歉，我遇到了一些问题，请稍后再试。',
          timestamp: new Date(),
          error: response.error?.message,
        })
      }
    } catch (error) {
      addMessage({
        id: Date.now().toString(),
        role: 'ai',
        content: '抱歉，服务暂时不可用。',
        timestamp: new Date(),
        error: 'Network error',
      })
    } finally {
      setTyping(false)
    }
  }

  const handleQuickReply = (query: string) => {
    handleSend(query)
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col m-6 mr-4">
        <CardContent className="flex-1 flex flex-col p-6 overflow-hidden">
          <ChatHeader onClear={clearMessages} />

          <div className="flex-1 overflow-auto py-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-muted-foreground mb-4">您好！我是无人机系统AI助手，有什么可以帮助您的？</p>
                <QuickReplyList replies={mockQuickReplies} onSelect={handleQuickReply} />
              </div>
            ) : (
              <>
                <MessageList messages={messages} />
                <TypingIndicator visible={isTyping} />
              </>
            )}
          </div>

          {messages.length > 0 && (
            <div className="mt-4">
              <QuickReplyList replies={mockQuickReplies} onSelect={handleQuickReply} />
            </div>
          )}

          <div className="mt-4">
            <ChatInput onSend={handleSend} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}