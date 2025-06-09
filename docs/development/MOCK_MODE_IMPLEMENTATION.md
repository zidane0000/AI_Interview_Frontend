# Mock vs Dev Mode Implementation

## Overview

This implementation separates mock data from the development environment and adds a new `npm run mock` command. The frontend can now run in two distinct modes:

1. **Development Mode** (`npm run dev`) - Connects to real backend API
2. **Mock Mode** (`npm run mock`) - Uses local mock data without backend

## Implementation Details

### 1. Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite --mode development",
    "mock": "vite --mode mock",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### 2. Environment Files

#### `.env.development`

```env
# Development environment variables
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK_DATA=false
VITE_DEV_MODE=true
```

#### `.env.mock`

```env
# Mock environment variables
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK_DATA=true
VITE_DEV_MODE=true

# App settings
VITE_APP_TITLE=AI Interview Platform (Mock Mode)
VITE_APP_VERSION=1.0.0
```

#### `.env.production`

```env
# Production environment variables
VITE_API_BASE_URL=https://your-api-domain.com
VITE_USE_MOCK_DATA=false
VITE_DEV_MODE=false
```

### 3. Code Structure Changes

#### `/src/services/mockApi.ts`

- Moved all mock data and functions to separate file
- Contains mock interviews, evaluations, and chat sessions
- Provides AI response templates for chat-based interviews

#### `/src/services/api.ts`

- Simplified to contain only real API functions and configuration
- Uses environment variable `VITE_USE_MOCK_DATA` to choose between mock and real API
- Clean separation between mock and real implementations

#### `/src/components/ModeIndicator.tsx`

- New component that shows current mode (Mock/API) in development
- Only visible when `VITE_DEV_MODE=true`
- Positioned in top-right corner with clear visual indicator

### 4. Visual Mode Indicator

- Shows "Mock Mode" with warning color when using mock data
- Shows "API Mode" with success color when using real API
- Displays current Vite mode (development/mock/production)
- Only appears in development environment

## Usage Instructions

### For Frontend-Only Development

```bash
npm run mock
```

- No backend server required
- Uses comprehensive mock data
- Perfect for UI/UX development and testing

### For Full-Stack Development

```bash
npm run dev
```

- Requires backend server running on <http://localhost:8080>
- Connects to real API endpoints
- Full integration testing

### For Production Build

```bash
npm run build
```

- Builds optimized production version
- Uses production environment settings
- No mock data included

## Benefits

1. **Faster Development**: Frontend developers can work without backend
2. **Better Testing**: Comprehensive mock data for all scenarios
3. **Clear Separation**: Mock and real API logic are separate
4. **Visual Feedback**: Clear indication of current mode
5. **Flexible Configuration**: Easy switching between modes

## Environment Variables Reference

| Variable | Development | Mock | Production | Description |
|----------|-------------|------|------------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080` | `http://localhost:8080` | `https://your-api-domain.com` | Backend API URL |
| `VITE_USE_MOCK_DATA` | `false` | `true` | `false` | Enable/disable mock data |
| `VITE_DEV_MODE` | `true` | `true` | `false` | Development mode flag |
| `VITE_APP_TITLE` | Default | "AI Interview Platform (Mock Mode)" | Default | App title override |

## File Structure

```text
src/
├── services/
│   ├── api.ts          # Real API functions
│   ├── mockApi.ts      # Mock data and functions
│   └── api.ts.backup   # Original file backup
├── components/
│   └── ModeIndicator.tsx  # Visual mode indicator
└── utils/
    └── configTest.ts    # Environment configuration test
```

This implementation provides a clean, maintainable solution for separating mock data from development mode while maintaining full functionality in both scenarios.
