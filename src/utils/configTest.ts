// Simple test script to verify environment configuration
console.log('🔧 Environment Configuration Test');
console.log('================================');
console.log('MODE:', import.meta.env.MODE);
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA);
console.log('VITE_DEV_MODE:', import.meta.env.VITE_DEV_MODE);
console.log('VITE_APP_TITLE:', import.meta.env.VITE_APP_TITLE);

// Test mock data flag
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
console.log('📊 Using Mock Data:', useMockData);

if (useMockData) {
  console.log('🎭 Mock mode is active - no backend required');
} else {
  console.log('🌐 API mode is active - backend required at:', import.meta.env.VITE_API_BASE_URL);
}

export {};
