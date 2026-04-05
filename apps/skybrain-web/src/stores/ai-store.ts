// AI状态管理
import { create } from 'zustand'
import type { AIMessage, CommandHistory, ParsedTask } from '@/types/ai'

interface AIStore {
  // 全局
  error: string | null
  setError: (error: string | null) => void

  // 聊天
  messages: AIMessage[]
  isTyping: boolean
  chatError: string | null
  addMessage: (msg: AIMessage) => void
  clearMessages: () => void
  setTyping: (v: boolean) => void
  setChatError: (error: string | null) => void

  // 语音
  isRecording: boolean
  isListening: boolean
  voiceError: string | null
  setRecording: (v: boolean) => void
  setListening: (v: boolean) => void
  setVoiceError: (error: string | null) => void
  commandHistory: CommandHistory[]
  addCommand: (cmd: CommandHistory) => void
  clearHistory: () => void

  // 任务创建
  parsedTask: ParsedTask | null
  isParsing: boolean
  parseError: string | null
  setParsedTask: (task: ParsedTask | null) => void
  setParsing: (v: boolean) => void
  setParseError: (error: string | null) => void
  clearParsedTask: () => void
}

export const useAIStore = create<AIStore>((set) => ({
  // 全局
  error: null,
  setError: (error) => set({ error }),

  // 聊天
  messages: [],
  isTyping: false,
  chatError: null,
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
  setTyping: (isTyping) => set({ isTyping }),
  setChatError: (chatError) => set({ chatError }),

  // 语音
  isRecording: false,
  isListening: false,
  voiceError: null,
  setRecording: (isRecording) => set({ isRecording }),
  setListening: (isListening) => set({ isListening }),
  setVoiceError: (voiceError) => set({ voiceError }),
  commandHistory: [],
  addCommand: (cmd) => set((state) => ({ commandHistory: [cmd, ...state.commandHistory] })),
  clearHistory: () => set({ commandHistory: [] }),

  // 任务创建
  parsedTask: null,
  isParsing: false,
  parseError: null,
  setParsedTask: (parsedTask) => set({ parsedTask }),
  setParsing: (isParsing) => set({ isParsing }),
  setParseError: (parseError) => set({ parseError }),
  clearParsedTask: () => set({ parsedTask: null, parseError: null }),
}))