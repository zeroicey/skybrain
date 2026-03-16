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

## Documentation Structure

| File | Description |
|------|-------------|
| `README.md` | Project overview, tech stack, development plan |
| `requirements.md` | Detailed functional requirements specification |
| `research.md` | Research on drone applications, use cases, and technology |
| `tasks.md` | Task tracking for project progress |
| `frontend-architecture/` | Detailed frontend architecture design (62 pages, 95 components) |

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

## Tech Stack (Planned)

- **Backend**: Node.js + Express
- **AI Integration**: OpenClaw (supports multiple models: 智谱, 火山引擎)
- **Database**: SQLite / PostgreSQL
- **Hardware Interface**: MAVLink SDK

### Frontend (from frontend-architecture/)
- **Framework**: React 18+ / Vue 3
- **UI Library**: Ant Design 5 / Element Plus
- **Maps**: Leaflet / Mapbox GL / 高德地图 JS API
- **Charts**: ECharts 5
- **Build Tool**: Vite

## Key Design Decisions from Documentation

1. **OpenClaw Integration**: Natural language control - users can control drones via text/voice commands
2. **Multi-drone Coordination**: Supports partitioned作业, relay missions, and formation flying
3. **No-fly Zone Management**: Critical safety feature for campus environments
4. **Privacy Protection**: Face blurring, data anonymization required
5. **User Roles**: Admin, Security Staff, Operations, Teachers, Students

## Working with This Project

When implementing this project:

1. **Start with backend**: Build the OpenClaw gateway, task scheduler, and MAVLink integration first
2. **Use the frontend architecture specs**: The `frontend-architecture/` directory contains detailed page and component specifications to guide UI development
3. **Follow the requirements**: `requirements.md` has priority annotations (P0/P1/P2) for feature implementation order
4. **Reference research.md**: Contains technical solutions for indoor positioning, multi-drone coordination, and AI edge computing

## Language

Project documentation is primarily in Chinese (Simplified). Code and technical terms should follow the existing patterns in the documentation.