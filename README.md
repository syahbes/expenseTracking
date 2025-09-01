# File Structure & Implementation Guide

## 📁 Complete File Structure

```
app/
├── (tabs)/
│   └── settings.tsx                 # Main settings screen (simplified)
│
├── components/
│   ├── ThemedText.tsx              # Your existing component
│   ├── ThemedView.tsx              # Your existing component
│   └── settings/
│       ├── ThemeSetting.tsx        # Theme toggle component
│       ├── CurrencySetting.tsx     # Currency selection component
│       ├── CategoriesSection.tsx   # Categories management section
│       ├── CategoryModal.tsx       # Add category modal
│       └── CurrencyModal.tsx       # Currency selection modal
│
├── database/
│   ├── database.ts                 # Database initialization & setup
│   ├── settingsService.ts          # Settings CRUD operations
│   └── categoriesService.ts        # Categories CRUD operations
│
├── constants/
│   └── settingsConstants.ts        # Default categories, currencies, etc.
│
└── types/
    └── settings.ts                 # TypeScript interfaces
```

## 🚀 Implementation Steps

### 1. Create the folder structure:
```bash
mkdir -p types constants database components/settings
```

### 2. Copy the files in this order:

1. **types/settings.ts** - Base types
2. **constants/settingsConstants.ts** - Constants and defaults
3. **database/database.ts** - Database initialization
4. **database/settingsService.ts** - Settings operations
5. **database/categoriesService.ts** - Categories operations
6. **components/settings/** - All UI components
7. **app/(tabs)/settings.tsx** - Main screen (replace existing)

## ✅ Benefits Achieved

### **Separation of Concerns**
- **UI Components**: Pure presentation logic
- **Database Layer**: Data persistence and CRUD operations
- **Business Logic**: Settings management separated from UI
- **Types**: Centralized type definitions

### **Maintainability**
- **Single Responsibility**: Each file has one clear purpose
- **Easy Debugging**: Bugs are isolated to specific layers
- **Code Reusability**: Components can be reused across the app

### **Developer Experience**
- **Better Testing**: Each layer can be tested independently
- **TypeScript Benefits**: Strong typing throughout the app
- **Clear Dependencies**: Easy to understand data flow

### **Scalability**
- **Easy Extensions**: Add new settings without touching existing code
- **Database Flexibility**: Easy to modify database schema
- **Component Library**: Reusable UI components for other screens

## 🔄 How Data Flows

```
User Interaction 
    ↓
UI Component (ThemeSetting, CurrencySetting, etc.)
    ↓
Main Settings Screen (event handlers)
    ↓
Database Service (settingsService, categoriesService)
    ↓
SQLite Database
    ↓
UI Update (React state)
```

## 📋 Next Steps

1. **Replace your current settings.tsx** with the refactored version
2. **Create all the new files** as shown above
3. **Test each feature** individually
4. **Consider adding**:
   - Loading states
   - Error boundaries  
   - Offline support
   - Data validation
   - Export/import settings

## 🛠️ Usage Examples

### Adding a new setting:
```typescript
// 1. Add to types/settings.ts
export interface Settings {
  theme: 'light' | 'dark';
  currency: string;
  language: string; // New setting
}

// 2. Add to constants
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
];

// 3. Create component
export const LanguageSetting = ({ ... }) => { ... }

// 4. Add to main screen
<LanguageSetting ... />
```

### Accessing settings in other screens:
```typescript
import { loadSettings } from '@/database/settingsService';

const MyScreen = () => {
  const [settings, setSettings] = useState<Settings>();
  
  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);
  
  // Use settings.currency, settings.theme, etc.
};
```

This structure makes your code much more maintainable and follows React Native best practices! 🎉