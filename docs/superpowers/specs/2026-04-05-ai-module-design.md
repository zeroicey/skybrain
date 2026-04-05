# AI交互模块设计方案

> 文档创建日期: 2026-04-05

## 1. 项目概述

实现智能无人机管理系统的AI交互模块，包含语音控制、智能问答和自然语言任务创建三个页面。

## 2. 技术栈

- React 18 + TypeScript
- Zustand 状态管理
- shadcn/ui 组件库
- 预留API接口（后续接入真实AI）

## 3. 目录结构

```
apps/skybrain-web/src/
├── pages/modules/ai/
│   ├── voice-page.tsx           # 语音控制页面
│   ├── chat-page.tsx            # 智能问答页面
│   └── task-create-page.tsx     # 自然语言任务创建页面
├── components/ai/
│   ├── voice/
│   │   ├── voice-status-indicator.tsx   # 语音状态指示
│   │   ├── voice-visualizer.tsx        # 语音波形可视化
│   │   ├── voice-input-button.tsx     # 语音输入按钮
│   │   ├── recording-indicator.tsx    # 录音指示
│   │   ├── speech-to-text-result.tsx  # 语音识别结果
│   │   ├── command-history-list.tsx   # 指令历史列表
│   │   ├── command-result.tsx         # 指令执行结果
│   │   └── command-example-list.tsx  # 指令示例列表
│   ├── chat/
│   │   ├── chat-header.tsx            # 聊天头部
│   │   ├── clear-chat-button.tsx      # 清空聊天按钮
│   │   ├── chat-settings-button.tsx   # 聊天设置按钮
│   │   ├── message-list.tsx           # 消息列表容器
│   │   ├── user-message.tsx           # 用户消息组件
│   │   ├── ai-message.tsx             # AI回复组件
│   │   ├── markdown-renderer.tsx      # Markdown渲染
│   │   ├── chat-input.tsx             # 聊天输入框
│   │   ├── typing-indicator.tsx       # 正在输入指示
│   │   └── quick-reply-list.tsx       # 快捷回复
│   └── task-create/
│       ├── description-input.tsx      # 任务描述输入
│       ├── parse-result-panel.tsx     # 解析结果面板
│       ├── parsed-field.tsx           # 解析字段组件
│       ├── confidence-score.tsx      # 置信度展示
│       ├── suggested-route.tsx       # 建议航线
│       └── task-confirm-form.tsx      # 任务确认表单
├── stores/
│   └── ai-store.ts                    # AI状态管理
├── data/
│   └── mock-ai.ts                    # Mock数据和API模拟
├── types/
│   └── ai.ts                          # AI模块类型定义
└── components/navbar/
    ├── index.tsx                     # 注册AI导航组件
    └── contents/
        ├── ai-voice.tsx              # 语音控制页导航
        ├── ai-chat.tsx               # 智能问答页导航
        └── ai-task-create.tsx        # 任务创建页导航
```

## 4. 数据类型定义

### ai.ts

```typescript
// AI消息
interface AIMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
  isLoading?: boolean   // 加载状态
  error?: string         // 错误信息
}

// 语音指令结果
interface CommandResult {
  id: string
  command: string
  success: boolean
  message: string
  data?: Record<string, unknown>  // 执行结果数据
  timestamp: Date
}

// 语音指令历史
interface CommandHistory extends CommandResult {}

// 解析任务结果
interface ParsedTask {
  taskType?: string
  taskTypeLabel?: string
  droneId?: string
  droneName?: string
  executeTime?: string
  location?: string
  description?: string
  routeName?: string
  routeId?: string
  confidence: number
}

// 快捷回复
interface QuickReply {
  id: string
  label: string
  query: string
}

// API响应包装
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

// 创建的任务（用于TaskConfirmForm）
interface Task {
  id: string
  name: string
  type: TaskType
  droneId: string
  droneName?: string
  executeTime: string
  routeId?: string
  routeName?: string
  description?: string
  priority?: 'low' | 'normal' | 'high'
}

## 5. 状态管理

### ai-store.ts

```typescript
interface AIStore {
  // 全局错误状态
  error: string | null
  setError: (error: string | null) => void

  // 聊天相关
  messages: AIMessage[]
  isTyping: boolean
  chatError: string | null
  addMessage: (msg: AIMessage) => void
  clearMessages: () => void
  setTyping: (v: boolean) => void
  setChatError: (error: string | null) => void

  // 语音相关
  isRecording: boolean
  isListening: boolean
  voiceError: string | null
  setRecording: (v: boolean) => void
  setListening: (v: boolean) => void
  setVoiceError: (error: string | null) => void
  commandHistory: CommandHistory[]
  addCommand: (cmd: CommandHistory) => void
  clearHistory: () => void

  // 任务创建相关
  parsedTask: ParsedTask | null
  isParsing: boolean
  parseError: string | null
  setParsedTask: (task: ParsedTask | null) => void
  setParsing: (v: boolean) => void
  setParseError: (error: string | null) => void
  clearParsedTask: () => void
}
```

## 6. API接口预留

### mock-ai.ts

```typescript
// 聊天API（预留）
export async function chatWithAI(
  message: string,
  context?: { conversationId?: string }
): Promise<ApiResponse<AIMessage>>

// 语音指令API（预留）
export async function processVoiceCommand(command: string): Promise<ApiResponse<CommandResult>>

// 任务解析API（预留）
export async function parseTaskDescription(description: string): Promise<ApiResponse<ParsedTask>>

// Mock响应数据
export const mockAIResponses: Record<string, string>
export const mockQuickReplies: QuickReply[]
export const mockCommandExamples: string[]
```

## 7. 页面设计

### 7.1 语音控制页面 (/ai/voice)

**布局**: 卡片式，与现有页面一致

```
┌─────────────────────────────────────────────┐
│  顶部：标题 + 语音状态指示                   │
├─────────────────────────────────────────────┤
│  ┌───────────────────────────────────────┐  │
│  │         语音波形可视化区域             │  │
│  │         (VoiceVisualizer)             │  │
│  │                                       │  │
│  │          ╭────────────╮              │  │
│  │          │ 🎤 点击说话  │              │  │
│  │          ╰────────────╯              │  │
│  └───────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│  语音指令历史                                │
│  ┌───────────────────────────────────────┐  │
│  │ 🗣 "让2号无人机去教学楼A巡逻"           │  │
│  │    ✓ 理解成功 → 任务已创建             │  │
│  ├───────────────────────────────────────┤  │
│  │ 🗣 "查看无人机1的状态"                 │  │
│  │    ✓ 理解成功 → 无人机1: 在线         │  │
│  └───────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│  支持的指令示例                              │
│  • 让[无人机]执行[任务]                      │
│  • 查看[无人机]状态                         │
│  • 让[无人机]返航                           │
└─────────────────────────────────────────────┘
```

### 7.2 智能问答页面 (/ai/chat)

**布局**: 沉浸式全屏聊天

```
┌─────────────────────────────────────────────┐
│  顶部：标题 + 清空聊天 + 设置                │
├─────────────────────────────────────────────┤
│  ┌───────────────────────────────────────┐  │
│  │ 🤖 您好！我是无人机系统AI助手         │  │
│  │    有什么可以帮助您的？               │  │
│  │ ─────────────────────────────────────  │  │
│  │ 👤 如何创建巡逻任务？                 │  │
│  │ ─────────────────────────────────────  │  │
│  │ 🤖 您可以通过以下方式创建巡逻任务...  │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [快捷回复: 如何创建任务?]                   │
├─────────────────────────────────────────────┤
│  ┌───────────────────────────────────────┐  │
│  │ [输入问题...]      [发送] [🎤]        │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 7.3 自然语言任务创建页面 (/ai/task-create)

**布局**: 卡片式，分步展示

```
┌─────────────────────────────────────────────┐
│  顶部：自然语言任务创建                      │
├─────────────────────────────────────────────┤
│  ┌───────────────────────────────────────┐  │
│  │    输入您想要创建的任务描述:           │  │
│  │                                        │  │
│  │    [让2号无人机今天下午3点去           │  │
│  │     教学楼A进行日常巡检...]            │  │
│  │                                        │  │
│  │              [智能解析]               │  │
│  └───────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│  解析结果                                    │
│  ┌───────────────────────────────────────┐  │
│  │  ✓ 任务类型: 巡检                      │  │
│  │  ✓ 无人机: 2号无人机                  │  │
│  │  ✓ 执行时间: 今天 15:00                │  │
│  │  ✓ 执行地点: 教学楼A                   │  │
│  │  ✓ 任务描述: 日常巡检                  │  │
│  │                                        │  │
│  │  建议航线: 教学楼巡检航线              │  │
│  └───────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│  确认创建                                    │
│  ┌───────────────────────────────────────┐  │
│  │  任务名称: [教学楼A日常巡检]           │  │
│  │  任务类型: [巡检▼]                    │  │
│  │  执行无人机: [2号无人机▼]            │  │
│  │  执行时间: [2026-03-14 15:00]        │  │
│  │  航线: [教学楼巡检航线▼]              │  │
│  │                                        │  │
│  │  [取消]           [确认创建]           │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## 8. 组件清单

### Voice组件
| 组件 | 描述 | Props |
|------|------|-------|
| VoiceStatusIndicator | 语音状态指示 | status: 'idle' \| 'listening' \| 'processing', label?: string |
| VoiceVisualizer | 语音波形可视化 | isListening: boolean, audioLevel?: number |
| VoiceInputButton | 语音输入按钮 | onRecordingChange: (v: boolean) => void, disabled?: boolean |
| RecordingIndicator | 录音状态指示 | isRecording: boolean, duration?: number |
| SpeechToTextResult | 语音识别结果 | text: string, isFinal: boolean, onConfirm: () => void |
| CommandHistoryList | 指令历史列表 | commands: CommandHistory[], onClear?: () => void |
| CommandResult | 指令结果展示 | command: CommandHistory |
| CommandExampleList | 指令示例列表 | examples: string[] |

### Chat组件
| 组件 | 描述 | Props |
|------|------|-------|
| ChatHeader | 聊天头部 | onClear: () => void, onSettings: () => void |
| MessageList | 消息列表容器 | messages: AIMessage[] |
| UserMessage | 用户消息 | message: AIMessage |
| AIMessage | AI回复 | message: AIMessage |
| MarkdownRenderer | Markdown渲染 | content: string, className?: string |
| ChatInput | 聊天输入框 | onSend: (text: string) => void, onVoice: () => void, disabled?: boolean |
| TypingIndicator | 正在输入动画 | visible: boolean |
| QuickReplyList | 快捷回复列表 | replies: QuickReply[], onSelect: (q: string) => void |
| ClearChatButton | 清空聊天按钮 | onClick: () => void |
| ChatSettingsButton | 聊天设置按钮 | onClick: () => void |

### TaskCreate组件
| 组件 | 描述 | Props |
|------|------|-------|
| DescriptionInput | 任务描述输入 | value: string, onChange: (v: string) => void, onParse: () => void, maxLength?: number, disabled?: boolean |
| ParseResultPanel | 解析结果面板 | result: ParsedTask, onEdit?: (field: keyof ParsedTask, value: string) => void |
| ParsedField | 解析字段 | label: string, value: string, confidence?: number |
| ConfidenceScore | 置信度展示 | score: number, label?: string |
| SuggestedRoute | 建议航线 | routeName: string, onSelect: (routeId: string) => void |
| TaskConfirmForm | 确认表单 | parsed: ParsedTask, onSubmit: (task: Task) => void, onCancel: () => void |

## 9. 路由配置

在 router.ts 中添加:

```typescript
const AIVoicePage = lazy(() => import("@/pages/modules/ai/voice-page"));
const AIChatPage = lazy(() => import("@/pages/modules/ai/chat-page"));
const AITaskCreatePage = lazy(() => import("@/pages/modules/ai/task-create-page"));

// 在 children 中添加:
{
  path: "ai",
  children: [
    { path: "voice", Component: AIVoicePage },
    { path: "chat", Component: AIChatPage },
    { path: "task-create", Component: AITaskCreatePage },
  ]
}
```

## 10. 权限配置

| 页面 | 管理员 | 安保人员 | 运维人员 | 教师 | 学生 |
|------|--------|----------|----------|------|------|
| 语音控制 | ✓ | ✓ | ✓ | ✓ | ✗ |
| 智能问答 | ✓ | ✓ | ✓ | ✓ | ✓ |
| 任务创建 | ✓ | ✓ | ✓ | ✓ | ✗ |

## 11. 后续接入真实AI

预留的API接口:
- `POST /api/ai/chat` - 对话接口
- `POST /api/ai/command` - 语音指令处理
- `POST /api/ai/parse` - 自然语言任务解析

只需在 mock-ai.ts 中替换为真实的API调用即可。