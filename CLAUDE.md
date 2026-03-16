# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**skybrain** is an intelligent drone patrol system for campus scenarios, integrating AI large models (via OpenClaw) for autonomous inspection, monitoring, and task execution.

### Core Features
- Real-time autonomous patrol along preset flight paths
- AI-powered computer vision for object/target recognition
- Task scheduling based on time and requirements
- Anomaly detection (obstacles, signal loss, etc.)
- Automatic data logging to database
- Natural language control via OpenClaw AI assistant

## Current Status

This project is in the **planning/design phase**. No implementation code exists yet - only documentation and frontend architecture specifications have been created.

## Documentation

| File | Description |
|------|-------------|
| `requirements.md` | Detailed functional requirements (P0/P1/P2 priorities) |
| `research.md` | Technology research, use cases, case studies |
| `tasks.md` | Task tracking for project progress |
| `frontend-architecture/` | 62 pages, 95 components specifications |

## System Architecture (Planned)

```
User Layer (Web/App/OpenClaw)
         ↓
Business Logic Layer (Task Scheduling, Flight Planning, Coordination)
         ↓
Communication Layer (MAVLink, WebSocket, MQTT, 4G/5G)
         ↓
Device Layer (Drones, Hangars, Sensors, Cameras, Speakers)
```

### Backend Structure (when implementing)
```
backend/
├── src/
│   ├── gateways/       # OpenClaw API gateway
│   ├── schedulers/     # Task scheduling
│   ├── vision/         # AI vision module
│   ├── mavlink/        # Drone communication
│   └── api/            # REST/WebSocket APIs
```

### Frontend Structure (follow frontend-architecture/)
```
frontend/
├── pages/              # 14 modules, 62 pages
│   ├── dashboard.md    # 3 pages
│   ├── monitor.md      # 4 pages
│   ├── tasks.md        # 6 pages
│   └── ...
└── components/         # 12 categories, 95 components
```

## Tech Stack

- **Backend**: Node.js + Express
- **AI Integration**: OpenClaw (智谱, 火山引擎)
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Hardware**: MAVLink SDK

### Frontend (from frontend-architecture/)
- **Framework**: React 18+ / Vue 3
- **UI Library**: Ant Design 5 / Element Plus
- **Maps**: Leaflet / Mapbox GL / 高德地图
- **Charts**: ECharts 5

## Common Commands (when implemented)

```bash
# Backend
npm install            # Install dependencies
npm run dev           # Start development server
npm run build         # Build for production

# Frontend
npm install
npm run dev           # Start Vite dev server
npm run build         # Build for production
npm run lint          # Lint code
```

## Key Design Decisions

1. **OpenClaw Integration**: Natural language control - users control drones via text/voice
2. **Multi-drone Coordination**: Partitioned作业, relay missions, formation flying
3. **No-fly Zone Management**: Critical safety feature for campus
4. **Privacy Protection**: Face blurring, data anonymization required
5. **User Roles**: Admin, Security Staff, Operations, Teachers, Students

## Implementation Priority

Follow `requirements.md` priority annotations:
- **P0**: Core functionality (auto patrol, perimeter security, emergency response)
- **P1**: Important features (facility inspection, event support)
- **P2**: Enhancement features (logistics, environment monitoring)

## Language

Project documentation is in Chinese (Simplified). Code and technical terms follow existing documentation patterns.