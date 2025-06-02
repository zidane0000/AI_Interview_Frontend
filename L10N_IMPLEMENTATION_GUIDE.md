# AI Mock Interview Practice - Internationalization (L10N) Implementation Guide

## 🌍 Overview

This project has completed multilingual internationalization (L10N) implementation, supporting the following languages:

- **English (en)** - English
- **繁體中文 (zh-TW)** - Traditional Chinese

## 📁 File Structure

```text
src/
├── i18n/
│   └── index.ts              # i18n initialization configuration
├── locales/
│   ├── en/                   # English translations
│   │   ├── common.json       # Common translations
│   │   ├── pages.json        # Page translations
│   │   └── interview.json    # Interview-related translations
│   └── zh-TW/               # Traditional Chinese translations
│       ├── common.json       # Common translations
│       ├── pages.json        # Page translations
│       └── interview.json    # Interview-related translations
└── components/
    ├── LanguageSwitcher.tsx  # Language switcher
    └── I18nTestPage.tsx      # Internationalization test page
```

## 🔧 Technical Implementation

### Dependencies

- `i18next` - Core internationalization framework
- `react-i18next` - React integration
- `i18next-browser-languagedetector` - Automatic language detection
- `i18next-http-backend` - Dynamic translation file loading

### Language Detection Order

1. `localStorage` - User's previously selected language
2. `navigator` - Browser language settings
3. `htmlTag` - HTML lang attribute
4. `fallback` - Default to English (en)

## 📝 Usage

### 1. Using Translations in Components

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common:appName')}</h1>
      <p>{t('pages:home.subtitle')}</p>
    </div>
  );
};
```

### 2. Namespace Usage

This project uses three namespaces:

- **common** - Common translations (buttons, navigation, status, etc.)
- **pages** - Page-specific translations
- **interview** - Interview process related translations

### 3. Translation Key Naming Convention

```text
namespace:category.subcategory.key
```

Examples:

- `common:buttons.create` - Create button
- `pages:home.title` - Home page title
- `interview:evaluation.criteria.clarity` - Evaluation criteria - clarity

## 🎯 Core Features

### Language Switcher

Located in the top-right navigation bar, providing:

- Language menu
- Real-time switching
- Local storage for user preferences

### Test Page

Visit `/i18n-test` to view:

- All translation key tests
- Language switching functionality test
- Current language status

## 📋 Translation Key Overview

### Common (Common)

```json
{
  "appName": "Application Name",
  "buttons": { 
    "create": "Create",
    "start": "Start",
    "save": "Save"
  },
  "navigation": {
    "home": "Home",
    "practice": "Practice"
  },
  "status": {
    "loading": "Loading...",
    "error": "Error"
  }
}
```

### Pages (Pages)

```json
{
  "home": {
    "title": "Home Title",
    "subtitle": "Subtitle",
    "createNewInterview": "Create New Interview"
  },
  "mockInterview": {
    "title": "Mock Interview",
    "candidateName": "Candidate Name"
  }
}
```

### Interview (Interview)

```json
{
  "evaluation": {
    "criteria": {
      "clarity": "Expression Clarity",
      "relevance": "Answer Relevance"
    }
  }
}
```

## 🔄 Steps to Add New Translations

### 1. Add Translation Keys

Add key-value pairs in the corresponding JSON files:

```json
// locales/en/pages.json
{
  "newPage": {
    "title": "New Page Title"
  }
}

// locales/zh-TW/pages.json  
{
  "newPage": {
    "title": "新頁面標題"
  }
}
```

### 2. Use in Components

```tsx
const title = t('pages:newPage.title');
```

## 🌟 Best Practices

### 1. Translation Organization

- Group translation keys by functionality
- Use meaningful naming
- Maintain consistent hierarchical structure

### 2. Dynamic Content

```tsx
// Using interpolation
t('pages:takeInterview.questionProgress', { 
  current: 1, 
  total: 5 
})
```

### 3. Conditional Translation

```tsx
// Choose translation based on state
const statusText = interview.completed 
  ? t('common:status.completed')
  : t('common:status.pending');
```

## 🚀 Deployment Considerations

1. **Language File Loading**
   - Ensure all language files are deployed correctly
   - Check file path correctness

2. **Cache Management**
   - Clear cache when translation files change
   - Use version control to avoid cache issues

3. **SEO Considerations**
   - Set correct `lang` attributes
   - Consider multilingual URL structure

## 🐛 FAQ

### Q: Translation not displaying?

A: Check:

- Whether translation keys are correct
- Whether JSON file format is correct
- Whether namespace is correct

### Q: Language switching not responding?

A: Confirm:

- Whether LanguageSwitcher component is correctly imported
- Whether i18n initialization is successful

### Q: How to debug translation issues?

A:

- Visit `/i18n-test` page for testing
- Open browser Console to view error messages
- Check Network panel to see if language files are loaded correctly

## 📈 Future Planning

1. **Additional Language Support**
   - Add other languages (such as Japanese, Korean)
   - Expand translation files

2. **Advanced Features**
   - Date and time localization
   - Number format localization
   - Plural form handling

3. **Automation Tools**
   - Translation file synchronization checking
   - Automatic detection of missing translations

---

**Developer Note**: This implementation has completed the basic internationalization architecture and can be expanded to support more languages and features based on requirements.
