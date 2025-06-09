# AI Interview Frontend

A modern frontend application for the AI Interview platform, built with React, TypeScript, and Material-UI. This project provides an intuitive interface for managing and conducting AI-powered interview sessions, supporting both real API and mock data modes.

## Features

- Clean, responsive UI with Material-UI (MUI)
- Interview creation, management, and detailed evaluation reports
- Real-time AI conversational interviews (OpenAI/Gemini backend integration)
- Multiple interview types: general, technical, behavioral, and more
- Internationalization (i18n) with English and Traditional Chinese support
- Mock mode for frontend-only development and testing
- Comprehensive error handling and user feedback

## Technical Architecture

- **Framework:** React 19, TypeScript
- **UI Library:** Material-UI (MUI) v7
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **State Management:** React Hooks
- **Internationalization:** react-i18next, i18next-browser-languagedetector

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```bash
npm install
```

### Running the Application

#### Development Mode (connects to backend API)

```bash
npm run dev
```

#### Mock Mode (no backend required)

```bash
npm run mock
```

#### Production Build

```bash
npm run build
```

#### Preview Production Build

```bash
npm run preview
```

## Environment Configuration

- **API Base URL:** Set via `VITE_API_BASE_URL` (default: `http://localhost:8080`)
- **Mock Mode:** Enable with `VITE_USE_MOCK_DATA=true`
- **Other variables:** See `.env` or Vite config for details

## Project Structure

```
src/
  pages/         # Page components (Home, CreateInterview, MockInterview, etc.)
  components/    # Shared UI components
  services/      # API and mock API service layer
  types/         # TypeScript type definitions
  i18n/          # Internationalization setup
  locales/       # Language resource files
  utils/         # Utility functions
  App.tsx        # Main application entry
```

## API Integration

The frontend communicates with the backend via RESTful API endpoints. In mock mode, all endpoints are simulated locally.

**Key Endpoints:**
- `POST /interviews` - Create interview
- `GET /interviews` - List interviews
- `GET /interviews/{id}` - Interview details
- `POST /interviews/{id}/chat/start` - Start AI interview session
- `POST /chat/{sessionId}/message` - Send message to AI
- `GET /chat/{sessionId}` - Get chat session status
- `POST /chat/{sessionId}/end` - End session and get evaluation
- `POST /evaluation` - Submit answers (traditional mode)
- `GET /evaluation/{id}` - Get evaluation results

## Development Notes

- TypeScript enforced throughout the project
- All API calls include error handling and user feedback
- Internationalization is fully supported and switchable at runtime
- Mock mode enables frontend development without backend dependency

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Documentation

- Multi-language Implementation Guide
- Mock Mode Implementation Description

---

Made with React, TypeScript, and Material-UI.


```bash
npm install
```

### Development Environment

#### 🔗 Using Real API (requires backend service running)

```bash
npm run dev
```

#### 🎭 Using Mock Data (no backend service required)

```bash
npm run mock
```

### Production Build

```bash
npm run build
```

### Preview Production Version

```bash
npm run preview
```

## 🌍 Environment Mode Description

This project supports three running modes:

- **🔧 Development Mode** (`npm run dev`): Connect to real backend API (<http://localhost:8080>)
- **🎭 Mock Mode** (`npm run mock`): Use local mock data, completely backend-free
- **🚀 Production Mode** (`npm run build`): Package for production version

### Environment Comparison

| Feature | Development Mode | Mock Mode | Production Mode |
|---------|------------------|-----------|-----------------|
| **Backend Dependency** | ✅ Required | ❌ Not Required | ✅ Required |
| **Data Source** | Real API | Mock Data | Real API |
| **Mode Indicator** | 🟢 API Mode | 🟡 Mock Mode | ❌ Hidden |
| **Development Tools** | ✅ Enabled | ✅ Enabled | ❌ Disabled |
| **Use Case** | Full-stack Development | Frontend Development | Production Deployment |

## 📁 Project Structure

```text
src/
├── pages/           # Page components
│   ├── Home.tsx                # Home page - interview list and feature entry
│   ├── CreateInterview.tsx     # Traditional interview creation
│   ├── MockInterview.tsx       # Smart mock interview creation (new)
│   ├── InterviewDetail.tsx     # Interview details and preview
│   ├── TakeInterview.tsx       # AI conversational interview (refactored)
│   ├── EvaluationResult.tsx    # Detailed evaluation result reports
│   └── Changelog.tsx           # Update log page
├── components/      # Shared components
│   ├── LanguageSwitcher.tsx    # Language switcher
│   ├── ModeIndicator.tsx       # Environment mode indicator
│   ├── LoadingSpinner.tsx      # Loading animation
│   ├── ErrorDisplay.tsx        # Error display
│   └── I18nTestPage.tsx        # Internationalization test page
├── services/        # API service layer
│   ├── api.ts                  # Main API configuration and routing
│   └── mockApi.ts              # Complete mock API implementation
├── types/           # TypeScript type definitions
│   └── index.ts                # Unified type interface definitions
├── i18n/            # Internationalization configuration
│   └── index.ts                # i18n initialization configuration
├── locales/         # Multi-language resource files
│   ├── en/                     # English language pack
│   │   ├── common.json         # Common translations
│   │   ├── pages.json          # Page translations
│   │   └── interview.json      # Interview-related translations
│   └── zh-TW/                  # Traditional Chinese language pack
│       ├── common.json         # Common translations
│       ├── pages.json          # Page translations
│       └── interview.json      # Interview-related translations
├── utils/           # Utility functions
│   ├── configTest.ts           # Environment configuration test
│   └── dateFormat.ts           # Date formatting tools
└── App.tsx          # Main application component
```

## 🔗 API Integration

This system supports two API modes and can seamlessly switch through environment variables:

### Real API Endpoints (Development/Production Mode)

- `POST /interviews` - Create new interview
- `GET /interviews` - Get interview list
- `GET /interviews/{id}` - Get specific interview details
- `POST /interviews/{id}/chat/start` - Start AI conversational interview
- `POST /chat/{sessionId}/message` - Send conversation message
- `GET /chat/{sessionId}` - Get conversation session status
- `POST /chat/{sessionId}/end` - End interview and get evaluation
- `POST /evaluation` - Submit interview answers (traditional mode)
- `GET /evaluation/{id}` - Get evaluation results

### Mock API (Mock Mode)

- Completely independent local mock implementation
- Includes intelligent AI conversation logic
- Preset test data and evaluation algorithms
- Supports all real API functionality

## 🌐 Environment Configuration

### Default Configuration

- **API Backend Address**: `http://localhost:8080`
- **Mock Mode**: Can be enabled via `npm run mock`
- **Development Tools**: Only displayed in development environment

### Environment Variables Description

| Variable | Development Mode | Mock Mode | Production Mode | Description |
|----------|------------------|-----------|-----------------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080` | `http://localhost:8080` | `https://your-api-domain.com` | Backend API address |
| `VITE_USE_MOCK_DATA` | `false` | `true` | `false` | Whether to use mock data |
| `VITE_DEV_MODE` | `true` | `true` | `false` | Development mode flag |
| `VITE_APP_TITLE` | Default title | "AI Interview Platform (Mock Mode)" | Default title | Application title |

## 📖 Page Descriptions

### 1. 🏠 Home (Home)

- Display list and statistics of all interviews
- Provide two interview creation entry points
- Quick access to recent interview records
- Platform feature showcase

### 2. ✏️ Create Interview (CreateInterview)

#### Traditional Q&A Interview Creation

- Input candidate basic information
- Customize interview questions
- Select default question templates
- Support question preview and editing

### 3. 🎭 Smart Mock Interview (MockInterview)

#### AI-Driven Smart Interview Creation ⭐

- Upload resume files (PDF/DOCX)
- Input job description
- Select interview type (general/technical/behavioral)
- AI automatically generates relevant questions
- Support custom question supplements

### 4. 📋 Interview Details (InterviewDetail)

- View complete interview information
- Display all interview questions
- Provide interview guidance instructions
- One-click interview start functionality

### 5. 💬 Take Interview (TakeInterview)

#### Brand New AI Conversational Interview Experience ⭐

- Real-time conversation interaction with AI
- Smart question flow management
- Natural language response processing
- Real-time conversation status tracking
- Support multi-round Q&A conversations

### 6. 📊 Evaluation Results (EvaluationResult)

- Comprehensive scoring and detailed analysis
- AI provides professional feedback suggestions
- Performance strengths and improvement areas
- Support result download and sharing

### 7. 🔄 Changelog (Changelog)

- Feature update history records
- Version change descriptions
- New feature introductions

## 🛠 Development Notes

1. **Environment Selection**: Choose appropriate running mode based on development needs
   - Frontend development: Use `npm run mock` (no backend required)
   - Full-stack development: Use `npm run dev` (requires backend running on `<http://localhost:8080>`)

2. **Type Safety**: Project fully adopts TypeScript, ensuring type checking during development

3. **Error Handling**: All API calls include complete error handling and user feedback

4. **Internationalization**: Supports Traditional Chinese and English, switchable via top-right language switcher

5. **Design Standards**: Follows Material-UI design system and Google Material Design specifications

6. **Mode Indicator**: Development environment displays current running mode (Mock/API) in top-right corner

7. **Data Persistence**: Mock mode data is only saved during session, reloading resets data

## 🎯 Core Feature Highlights

### ⭐ AI Conversational Interviews

- Natural and smooth conversation experience
- Smart question generation and connection
- Real-time interactive responses
- Context-aware conversations

### 🎭 Smart Mock Interview Creation

- Question generation based on resume and job position
- Multiple interview type support
- Automatic question optimization suggestions
- No preset questions needed to start

### 🌐 Complete Internationalization Support

- Traditional Chinese / English bilingual
- Dynamic language switching
- Complete UI translation coverage
- Localized date and time formats

### 🔄 Dual-mode Development Support

- Mock mode: Completely offline development
- Dev mode: Real API integration
- Seamless mode switching
- Visual mode indication

## 🌏 Browser Support

- **Chrome 90+**
- **Firefox 88+**
- **Safari 14+**
- **Edge 90+**

## 📚 Related Documentation

- [Multi-language Implementation Guide](./docs/development/L10N_IMPLEMENTATION_GUIDE.md)
- [Mock Mode Implementation Description](./docs/development/MOCK_MODE_IMPLEMENTATION.md)
- [Development TODOs](./docs/development/development-todos.md)

---

Made with ❤️ using React + TypeScript + Material-UI
