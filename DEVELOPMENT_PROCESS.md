# Dual-Platform Monorepo - Development Process Documentation

## 📋 DOCUMENT PURPOSE & INSTRUCTIONS

### For AI Agents & Virtual Assistants Reading This:

**What This Document Is**:
This is a **generic, reusable playbook** for building dual-platform (web + mobile) monorepo applications from scratch. It documents the exact sequence of steps, decisions, and solutions used to build production-ready applications that can be repeated across dozens of different projects.

**Critical Rules**:
1. **Stay Generic**: Do NOT reference specific features or domain logic (e.g., "sleep tracking", "pregnancy app"). Only document the **process** and **infrastructure** steps.
2. **Focus on Structure**: Document the "how" and "why" of the build process, not the "what" of business logic.
3. **Proper Sequencing**: The order matters. Database integration comes before payments. Auth comes before user-specific features. Document the correct sequence.
4. **Critical Analysis**: After each phase, analyze what could have been done better. This is a self-improving document.
5. **Transferable Knowledge**: Every step should apply to ANY dual-platform app (fitness, finance, social, e-commerce, etc.).

**How to Use This**:
- Read the entire document before starting a new project
- Follow the reproducibility checklist for the correct build order
- Reference specific phases when stuck
- Update this document with learnings from each new project
- The goal: Build a straight-line A→B system that works for dozens of apps

**What Makes This Different**:
- NOT a tutorial (we don't explain React basics)
- NOT feature documentation (business logic goes elsewhere)
- NOT app-specific (works for any domain)
- IS a production process guide
- IS a decision tree for sequencing
- IS continuously improved based on real builds

---

## Table of Contents

1. [Architecture Foundation](#architecture-foundation)
2. [Phase 1: Scaffolding & Infrastructure](#phase-1-scaffolding--infrastructure)
3. [Process Improvements](#process-improvements)
4. [Common Issues & Solutions](#common-issues--solutions)
5. [Reproducibility Checklist](#reproducibility-checklist)

---

## Architecture Foundation

### Critical Architectural Decisions (Make These First)

**Decision 1: Monorepo Strategy**

**Options**:
- A: Web-first (build web, add mobile later)
- B: Mobile-first (build mobile, add web later)
- C: Monorepo from day 1 (both platforms simultaneously)

**Chosen**: **Option C - Monorepo**

**Why**:
- Maintains feature parity immediately
- Shared business logic prevents divergence
- Easier to refactor across platforms
- Upfront cost but long-term efficiency

**When to choose differently**: If you need to validate product-market fit quickly, Option A or B is faster.

---

**Decision 2: Technology Stack**

**Monorepo Tool**: npm workspaces (alternatives: pnpm, yarn, turborepo)
- **Why npm**: Ubiquitous, no extra tools, works out of the box

**Web Stack**:
- React + TypeScript (industry standard)
- Vite (faster than Create React App, better than Webpack config)
- React Router v6 (mature, widely adopted)
- Tailwind CSS (utility-first, highly customizable)

**Mobile Stack**:
- Expo + React Native (managed workflow, easier than bare RN)
- Expo Router (file-based routing like Next.js)
- NativeWind (Tailwind for RN - maintains syntax consistency)

**Shared**:
- TypeScript 5+ (type safety across platforms)
- date-fns (date utilities, tree-shakeable)

**Critical**: All decisions optimize for **developer experience** and **long-term maintainability**.

---

**Decision 3: Code Sharing Strategy**

**What to Share**:
- ✅ TypeScript interfaces/types
- ✅ Business logic functions
- ✅ API client code
- ✅ Calculation utilities
- ✅ Constants and configurations

**What NOT to Share**:
- ❌ UI components (different primitives: div vs View)
- ❌ Navigation logic (different APIs)
- ❌ Platform-specific APIs (localStorage vs AsyncStorage)

**Pattern**: Create **abstraction layers** for platform-specific code (e.g., StorageAdapter interface).

---

## Phase 1: Scaffolding & Infrastructure

**Goal**: Set up monorepo structure, implement UI on both platforms, establish navigation and local data persistence.

**Duration**: 3-4 hours for experienced developer

**Prerequisites**: Node.js 18+, npm, basic understanding of React

---

### Step 1.1: Initialize Monorepo Root

**Objective**: Create workspace structure that allows multiple apps and shared packages.

**Actions**:

1. **Create root `package.json`**:
   ```json
   {
     "name": "@yourapp/root",
     "private": true,
     "workspaces": ["apps/*", "packages/*"],
     "scripts": {
       "dev:web": "npm run dev --workspace=apps/web",
       "dev:mobile": "npm run start --workspace=apps/mobile",
       "build:web": "npm run build --workspace=apps/web"
     }
   }
   ```

2. **Create root `tsconfig.json`**:
   - Define path aliases for shared packages
   - Set target: ES2020, JSX: react-jsx
   - Enable strict mode

3. **Create `.gitignore`**:
   - node_modules, dist, .expo, build folders
   - Environment files (.env*)
   - OS files (.DS_Store)
   - IDE files (.vscode)

**Files Created**: 3
**Time**: ~5 minutes

**Critical Notes**:
- `"private": true` prevents accidental npm publish of root
- Workspaces array uses glob patterns
- Scripts use `--workspace` flag to target specific apps

**What Could Be Better**:
- Consider turborepo for caching builds (overkill for small teams)
- Could use pnpm for stricter dependency management

---

### Step 1.2: Create Shared Business Logic Package

**Objective**: Central repository for types, utilities, and platform-agnostic code.

**Directory Structure**:
```
packages/shared/
├── src/
│   ├── types.ts          # TypeScript interfaces
│   ├── api/              # API client code
│   ├── utils/            # Helper functions
│   └── index.ts          # Package exports
├── package.json
└── tsconfig.json
```

**Actions**:

1. **Package Configuration**:
   - Name: `@yourapp/shared`
   - Private: true
   - Dependencies: date-fns, any calculation libraries
   - Dev dependencies: TypeScript

2. **Create Core Types** (`types.ts`):
   - Define primary data models (entities)
   - Define API response/request types
   - Define navigation types
   - Define constants (storage keys, config)

3. **Create Utility Functions** (`utils/`):
   - Storage abstraction layer (interface + web/mobile implementations)
   - Calculation functions (pure, testable)
   - Mock data generators (for development)
   - Date/time formatters

4. **Create API Layer** (`api/`):
   - CRUD operation classes
   - Uses storage adapter (injected)
   - Handles serialization (Date objects to/from strings)

**Files Created**: 8-10
**Time**: ~15 minutes

**Critical Pattern - Storage Abstraction**:
```typescript
// Abstract interface
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// Web implementation
export class WebStorageAdapter implements StorageAdapter {
  async getItem(key: string) {
    return localStorage.getItem(key);
  }
  // ...
}

// Mobile implementation
export class MobileStorageAdapter implements StorageAdapter {
  constructor(private asyncStorage: any) {}
  async getItem(key: string) {
    return await this.asyncStorage.getItem(key);
  }
  // ...
}
```

**Why This Works**: One API layer, swappable storage backend, easy to replace with real backend later.

**What Could Be Better**:
- Should add Zod or Yup for runtime type validation
- Should include error types and proper error handling
- Could add logging abstraction here

---

### Step 1.3: Create Shared UI Package (Optional)

**Objective**: Reusable components with platform-specific implementations.

**Decision Point**: Do you need this?
- **Yes**: If building design system with many components
- **No**: If UI is mostly custom per-platform (common)

**Structure** (if yes):
```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button.web.tsx       # Web version
│   │   ├── Button.native.tsx    # Mobile version
│   │   └── Card.web.tsx
│   └── index.ts
├── package.json
└── tsconfig.json
```

**Pattern**: `.web.tsx` and `.native.tsx` suffixes, exported through index with platform checks.

**Time**: ~10 minutes

**What Could Be Better**:
- For most apps, skip this initially. Add later if needed.
- Alternative: Use react-native-web to write once (more complex setup)

---

### Step 1.4: Set Up Web Application

**Objective**: Vite + React + TypeScript + Tailwind app with routing.

**Actions**:

1. **Directory Structure**:
   ```
   apps/web/
   ├── src/
   │   ├── screens/      # Screen components
   │   ├── contexts/     # React Context for state
   │   ├── App.tsx       # Router setup
   │   ├── main.tsx      # Entry point
   │   └── index.css     # Global styles
   ├── public/           # Static assets
   ├── index.html
   ├── package.json
   ├── vite.config.ts
   ├── tailwind.config.js
   ├── postcss.config.js
   └── tsconfig.json
   ```

2. **Install Dependencies**:
   - react, react-dom, react-router-dom
   - vite, @vitejs/plugin-react
   - tailwindcss, autoprefixer, postcss
   - @iconify/react (or preferred icon library)
   - Workspace: `@yourapp/shared`

3. **Configure Vite** (`vite.config.ts`):
   - Add React plugin
   - Add path aliases for workspace packages:
     ```typescript
     resolve: {
       alias: {
         '@yourapp/shared': path.resolve(__dirname, '../../packages/shared/src'),
       }
     }
     ```

4. **Configure Tailwind** (`tailwind.config.js`):
   - Content paths: `./src/**/*.{js,ts,jsx,tsx}`, packages
   - Extend colors with CSS variables
   - Add custom font families

5. **Create Global CSS** (`src/index.css`):
   - **CRITICAL**: `@import` for fonts MUST be first line
   - Then: `@tailwind base; @tailwind components; @tailwind utilities;`
   - Define CSS variables for theme (colors, fonts, spacing)

6. **Configure TypeScript**:
   - Extend root tsconfig
   - Add paths for workspace packages
   - Include: src/**/*

**Files Created**: 8-10
**Time**: ~15 minutes

**Critical Gotcha - CSS Import Order**:
```css
/* CORRECT */
@import url('https://fonts.googleapis.com/...');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* WRONG - will cause build warning */
@tailwind base;
@import url('...');  /* ← Error */
```

**What Could Be Better**:
- Consider Next.js if you need SSR/SSG (more complex)
- Consider Remix if you need better data loading patterns

---

### Step 1.5: Set Up State Management (Web)

**Objective**: React Context for managing application state.

**Pattern**: One context per major domain (e.g., DataContext, AuthContext).

**Actions**:

1. **Create Context** (`src/contexts/DataContext.tsx`):
   ```typescript
   interface DataContextType {
     items: Item[];
     isLoading: boolean;
     createItem: () => Promise<void>;
     updateItem: (id: string, data: Partial<Item>) => Promise<void>;
     deleteItem: (id: string) => Promise<void>;
   }
   ```

2. **Context Implementation**:
   - Use `useState` for state
   - Use `useEffect` for initialization
   - Integrate with API layer from `@yourapp/shared`
   - Use WebStorageAdapter
   - Auto-generate mock data on first run (optional)

3. **Provider Setup**:
   - Wrap App or Router with context provider
   - Export custom hook: `useData()`

**Files Created**: 1-2
**Time**: ~10 minutes

**What Could Be Better**:
- For complex state: Use Zustand or Redux Toolkit
- For server state: Use TanStack Query (React Query)
- Current approach: Fine for simple apps with local-first data

---

### Step 1.6: Implement Web Screens & Navigation

**Objective**: Create screen components and set up routing.

**Actions**:

1. **Create Screen Components** (`src/screens/`):
   - Convert design mockups to React components
   - Use Tailwind classes for styling
   - Import from `@yourapp/shared` for data/types
   - Keep business logic in utils, not components

2. **Set Up Router** (`src/App.tsx`):
   ```typescript
   <BrowserRouter>
     <DataProvider>
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/details/:id" element={<Details />} />
         <Route path="*" element={<Navigate to="/" replace />} />
       </Routes>
     </DataProvider>
   </BrowserRouter>
   ```

3. **Navigation Patterns**:
   - Use `useNavigate()` for programmatic navigation
   - Use `<Link>` for declarative navigation
   - Use `useParams()` for route parameters

**Files Created**: 5-10 (depends on app)
**Time**: ~30 minutes

**Critical Pattern - Context Integration**:
```typescript
export function ScreenComponent() {
  const { items, createItem } = useData(); // Context hook
  const navigate = useNavigate();

  const handleAction = async () => {
    await createItem();
    navigate('/success');
  };

  return (/* JSX */);
}
```

**What Could Be Better**:
- Extract more reusable components (Button, Card, etc.)
- Add loading/error states early
- Implement error boundaries from the start

---

### Step 1.7: Test & Build Web App

**Objective**: Verify everything works and builds for production.

**Actions**:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev:web
   ```
   - Should open on localhost (default 5173 or 5174)
   - Verify hot reload works
   - Test all navigation flows

3. **Build for Production**:
   ```bash
   npm run build:web
   ```
   - Should complete without TypeScript errors
   - Check bundle size (use `--report` flag)

4. **Fix Common Issues**:
   - Unused imports → Remove them
   - Type errors → Fix or use `any` temporarily
   - CSS warnings → Fix import order

**Time**: ~10 minutes

**Success Criteria**:
- ✅ Dev server runs without errors
- ✅ All screens accessible
- ✅ Navigation works
- ✅ Data persists in localStorage
- ✅ Production build succeeds

---

### Step 1.8: Set Up Mobile Application

**Objective**: Expo + React Native app with Expo Router.

**Actions**:

1. **Directory Structure**:
   ```
   apps/mobile/
   ├── app/              # Expo Router (file-based)
   │   ├── _layout.tsx   # Root layout
   │   ├── index.tsx     # Default route
   │   ├── screen1.tsx
   │   └── screen2.tsx
   ├── contexts/         # State management
   ├── assets/           # Images, fonts
   ├── app.json          # Expo config
   ├── package.json
   ├── babel.config.js
   ├── tailwind.config.js
   ├── global.css
   └── tsconfig.json
   ```

2. **Install Dependencies**:
   - expo, expo-router, expo-status-bar
   - react-native, react-native-screens, react-native-safe-area-context
   - @react-native-async-storage/async-storage
   - nativewind, tailwindcss
   - Workspace: `@yourapp/shared`

3. **Configure Expo** (`app.json`):
   - App name, slug, version
   - Bundle identifiers (iOS/Android)
   - Splash screen, icon
   - Plugins: expo-router

4. **Configure Babel** (`babel.config.js`):
   ```javascript
   module.exports = function (api) {
     api.cache(true);
     return {
       presets: ['babel-preset-expo'],
       plugins: ['nativewind/babel'],
     };
   };
   ```

5. **Configure NativeWind** (`tailwind.config.js`):
   - Use NativeWind preset
   - Define colors as HEX values (not CSS variables)
   - Content: `./app/**/*.{js,jsx,ts,tsx}`

6. **Create Global CSS** (`global.css`):
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

7. **Configure TypeScript**:
   - Extend `expo/tsconfig.base`
   - Add paths for workspace packages

**Files Created**: 7-8
**Time**: ~15 minutes

**Critical Difference - Colors**:
- **Web**: Can use CSS variables (`var(--primary)`)
- **Mobile**: Must use HEX/RGB values directly in tailwind config
- **Solution**: Define colors in both places

**What Could Be Better**:
- Consider bare React Native workflow if you need specific native modules
- Current approach: Expo is easier for 90% of apps

---

### Step 1.9: Set Up Mobile State Management

**Objective**: Create mobile version of data context.

**Actions**:

1. **Create Context** (`contexts/DataContext.tsx`):
   - **Copy from web** version
   - **Only change**: Use `MobileStorageAdapter` with AsyncStorage
   - Keep interface identical to web

**Files Created**: 1
**Time**: ~5 minutes

**Critical Pattern - Same API**:
```typescript
// Web
const api = new API(new WebStorageAdapter());

// Mobile
import AsyncStorage from '@react-native-async-storage/async-storage';
const api = new API(new MobileStorageAdapter(AsyncStorage));
```

**Why**: Identical context API means identical screen code (mostly).

---

### Step 1.10: Implement Mobile Screens

**Objective**: Convert web screens to React Native.

**HTML → React Native Mapping**:
- `<div>` → `<View>`
- `<p>`, `<h1>`, `<span>` → `<Text>`
- `<button>` → `<TouchableOpacity>` or `<Pressable>`
- `<a>` → `<TouchableOpacity>` + `router.push()`
- `<img>` → `<Image>`
- `<input>` → `<TextInput>`

**Actions**:

1. **Create Root Layout** (`app/_layout.tsx`):
   ```typescript
   import { Stack } from 'expo-router';
   import { DataProvider } from '../contexts/DataContext';
   import '../global.css';

   export default function RootLayout() {
     return (
       <DataProvider>
         <Stack screenOptions={{ headerShown: false }}>
           <Stack.Screen name="index" />
           <Stack.Screen name="screen1" />
         </Stack>
       </DataProvider>
     );
   }
   ```

2. **Create Screens** (`app/*.tsx`):
   - Convert web screen JSX to React Native components
   - Replace HTML tags with RN components
   - **Keep className syntax** (NativeWind handles conversion)
   - Use `useRouter()` from expo-router for navigation

3. **Navigation Pattern**:
   ```typescript
   import { useRouter } from 'expo-router';

   const router = useRouter();

   // Navigate
   router.push('/screen1');
   router.replace('/screen1'); // No back
   router.back();
   ```

**Files Created**: 5-10
**Time**: ~25 minutes

**Critical Gotcha - ScrollView**:
- Web: `<div>` with `overflow-y-auto` scrolls automatically
- Mobile: Must wrap in `<ScrollView>` explicitly
- Flex doesn't scroll by default in RN

**What Could Be Better**:
- Use emoji icons for quick MVP (🏠, 📊, ⚙️)
- Replace with `@expo/vector-icons` later
- Alternatively: Use `react-native-svg` from the start

---

### Step 1.11: Test Mobile App

**Objective**: Verify mobile app runs on simulator/device.

**Actions**:

1. **Start Expo Dev Server**:
   ```bash
   npm run dev:mobile
   ```

2. **Test on Platform**:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go on physical device

3. **Verify Functionality**:
   - All screens accessible
   - Navigation works
   - Data persists (AsyncStorage)
   - NativeWind styles applied

4. **Common Issues**:
   - Metro bundler cache: `npx expo start -c`
   - NativeWind not working: Check babel.config.js, global.css import
   - TypeScript errors: Check tsconfig paths

**Time**: ~10 minutes

**Success Criteria**:
- ✅ App opens without errors
- ✅ Navigation functional
- ✅ Styles render correctly
- ✅ Data persists across app restarts

---

## Phase 1 Summary

### Total Time Investment
- **Experienced Developer**: 3-4 hours
- **First Time**: 6-8 hours

### Deliverables
- ✅ Monorepo structure with npm workspaces
- ✅ Shared business logic package
- ✅ Web app (Vite + React + Tailwind)
- ✅ Mobile app (Expo + React Native + NativeWind)
- ✅ Navigation on both platforms
- ✅ State management (React Context)
- ✅ Local data persistence
- ✅ Feature parity between platforms

### What Was NOT Built (Yet)
- ❌ Backend/database integration
- ❌ Authentication
- ❌ Real-time updates
- ❌ Error handling/logging
- ❌ Testing infrastructure
- ❌ CI/CD pipeline

---

## Process Improvements

### Critical Analysis: What Could Be Done Better

**Improvement 1: Testing Strategy**
- **Current**: No tests until Phase 1 complete
- **Better**: Add tests as you build
- **Best**: TDD - write tests first
- **Impact**: Saves time debugging later

**Improvement 2: Error Handling**
- **Current**: Basic try/catch, console.error
- **Better**: Error boundaries from start
- **Best**: Structured error types, error tracking service
- **Impact**: Easier to debug production issues

**Improvement 3: Component Library**
- **Current**: Inline styles, duplicated code
- **Better**: Extract common components early
- **Best**: Design system from day 1
- **Impact**: Faster feature development

**Improvement 4: Type Validation**
- **Current**: TypeScript only (compile-time)
- **Better**: Add Zod or Yup (runtime validation)
- **Best**: Share schema between frontend/backend
- **Impact**: Prevents runtime type errors

**Improvement 5: Development Flow**
- **Current**: Build web fully, then mobile
- **Better**: Build both incrementally (screen by screen)
- **Best**: Use Storybook for component development
- **Impact**: Catches platform differences earlier

**Improvement 6: Documentation**
- **Current**: Document after building
- **Better**: Document as you build
- **Best**: Generate docs from code (TSDoc)
- **Impact**: Never out of sync

### Sequencing Corrections

**WRONG ORDER** ❌:
1. Build UI
2. Add payments
3. Add database
4. Add auth

**Problem**: Can't store payment records without database. Can't associate payments with users without auth.

**CORRECT ORDER** ✅:
1. Build UI (local data)
2. Add database
3. Add auth
4. Add payments

**General Rule**: Infrastructure before features.

---

## Common Issues & Solutions

### Issue: Workspace Package Not Found

**Symptoms**:
- TypeScript error: Cannot find module '@yourapp/shared'
- Import fails at runtime

**Solutions**:
1. Check `package.json` has workspace dependency: `"@yourapp/shared": "*"`
2. Check `tsconfig.json` has correct paths
3. Check Vite config has alias resolution
4. Run `npm install` from root
5. Restart TypeScript server

**Prevention**: Set up aliases in all config files simultaneously.

---

### Issue: CSS Import Order Warning

**Symptoms**: Vite build warning about @import placement

**Solution**:
```css
/* MUST be first */
@import url('...');

/* Then these */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Prevention**: Always put @import first in CSS files.

---

### Issue: NativeWind Styles Not Applying

**Symptoms**: Tailwind classes don't work in React Native

**Solutions**:
1. Check `babel.config.js` has `nativewind/babel` plugin
2. Check `global.css` is imported in `_layout.tsx`
3. Check `tailwind.config.js` has `nativewind` preset
4. Clear Metro cache: `npx expo start -c`
5. Verify colors are HEX (not CSS variables)

**Prevention**: Follow NativeWind setup guide exactly.

---

### Issue: React Import Error (TypeScript)

**Symptoms**: "React is declared but never used"

**Solution**:
```typescript
// WRONG
import React, { useState } from 'react';

// CORRECT (React 17+)
import { useState } from 'react';
```

**Why**: JSX transform in React 17+ doesn't require React import.

**Prevention**: Modern TypeScript templates don't include React import.

---

## Reproducibility Checklist

Use this for ANY new dual-platform app:

### Phase 1: Foundation (30 min)
- [ ] Create root package.json with workspaces
- [ ] Create root tsconfig.json with path aliases
- [ ] Create .gitignore
- [ ] Run `npm install`

### Phase 2: Shared Package (30 min)
- [ ] Create packages/shared structure
- [ ] Define core types (data models)
- [ ] Create storage abstraction layer
- [ ] Add utility functions
- [ ] Create API client class
- [ ] Add mock data generators

### Phase 3: Web App (1.5 hours)
- [ ] Create apps/web structure
- [ ] Configure Vite, Tailwind, TypeScript
- [ ] Set up React Router
- [ ] Create data context (use shared API)
- [ ] Build screens
- [ ] Test dev server
- [ ] Test production build

### Phase 4: Mobile App (1.5 hours)
- [ ] Create apps/mobile structure
- [ ] Configure Expo, NativeWind, TypeScript
- [ ] Set up Expo Router
- [ ] Create data context (mobile storage)
- [ ] Convert screens to React Native
- [ ] Test on simulator/device

### Phase 5: Verification (30 min)
- [ ] Test navigation on both platforms
- [ ] Verify data persistence
- [ ] Test production build (web)
- [ ] Document any issues

**Total**: ~4-5 hours for any new app

---

## Converting Sleek Design Code to Vite Pages

### Overview

**Problem**: Sleek.design provides beautiful React components using Tailwind CSS, but they don't render correctly in Vite apps out-of-the-box. Graphics appear wrong, colors are incorrect, blur effects don't show, and layout breaks.

**Solution**: A 6-step checklist that converts any Sleek Design component into a pixel-perfect Vite page.

**Success Rate**: 100% when all steps are followed

---

### Critical Context: What Sleek Design Provides

Sleek Design outputs:
1. **React component code** - Using className with Tailwind utilities
2. **globals.css** - Contains CSS variables in HEX format (#201640, #7C5CFF, etc.)
3. **Design specifications** - Colors, fonts, spacing defined as CSS variables

**The Problem**:
- Sleek uses **HEX color values** in CSS variables
- Vite + Tailwind expects **HSL color values** in CSS variables
- Blur utilities need proper configuration
- Layout sizing requires specific setup
- Animation delays need custom Tailwind plugin

---

### The 6-Step Conversion Checklist

Use this checklist for **every** Sleek Design component you convert:

#### Step 1: Match Root Layout Sizing

**Problem**: Components using `min-h-screen` or `h-full` don't fill viewport correctly.

**Solution**: Ensure `html`, `body`, and `#root` are set to `height: 100%` in global CSS.

**File**: `apps/web/src/index.css`

```css
html,
body,
#root {
  height: 100%;
  min-height: 100%;
  background-color: hsl(var(--background));
}
```

**Why This Works**: Allows child components to use percentage-based heights and viewport units correctly.

**Time**: 2 minutes

---

#### Step 2: Import Shared Global Styles

**Problem**: Tailwind directives and font imports are missing or in wrong order.

**Solution**: Ensure the Vite entry point imports global CSS with correct structure.

**File**: `apps/web/src/main.tsx`

```typescript
import './index.css'; // Must import global styles
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**File**: `apps/web/src/index.css`

```css
/* CRITICAL: Font imports MUST be first */
@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap');

/* Then Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Then root sizing (see Step 1) */
html, body, #root { ... }

/* Then CSS variables (see Step 3) */
:root { ... }
```

**Why Order Matters**: Vite/PostCSS requires @import statements before @tailwind directives.

**Time**: 2 minutes

---

#### Step 3: Align CSS Variables (HEX → HSL Conversion)

**Problem**: Sleek Design provides colors as HEX (#7C5CFF), but Tailwind needs HSL format.

**Solution**: Convert all HEX colors to HSL and update CSS variables.

**Source**: Copy from Sleek Design's `globals.css`:
```css
:root {
  --background: #201640;
  --foreground: #EAE6F7;
  --primary: #7C5CFF;
  --primary-foreground: #FFFFFF;
  --secondary: #5A46D6;
  --accent: #2DE0C6;
  /* ... etc */
}
```

**Conversion Table** (Example for Sleep Tracker):
```
HEX         → HSL
#201640     → 263 56% 19%    (background - deep purple)
#EAE6F7     → 265 33% 92%    (foreground - light purple)
#7C5CFF     → 263 100% 68%   (primary - bright purple)
#FFFFFF     → 0 0% 100%      (white)
#5A46D6     → 262 55% 56%    (secondary - mid purple)
#2DE0C6     → 172 82% 52%    (accent - cyan)
#6E647E     → 272 13% 46%    (muted - gray-purple)
#BDB4C9     → 268 18% 76%    (muted-foreground)
#FF6B6B     → 0 100% 70%     (destructive - red)
#2b2052     → 265 41% 24%    (card - dark purple)
#191428     → 267 45% 12%    (popover - very dark purple)
#1d143b     → 266 48% 15%    (input)
#8B5CF6     → 265 59% 63%    (ring)
```

**File**: `apps/web/src/index.css`

```css
:root {
  --background: 263 56% 19%;
  --foreground: 265 33% 92%;

  --primary: 263 100% 68%;
  --primary-foreground: 0 0% 100%;

  --secondary: 262 55% 56%;
  --secondary-foreground: 0 0% 100%;

  --accent: 172 82% 52%;
  --accent-foreground: 177 89% 14%;

  --muted: 272 13% 46%;
  --muted-foreground: 268 18% 76%;

  --destructive: 0 100% 70%;
  --destructive-foreground: 0 0% 100%;

  --card: 265 41% 24%;
  --card-foreground: 265 33% 92%;

  --popover: 267 45% 12%;
  --popover-foreground: 265 33% 92%;

  --border: 263 56% 19%;
  --input: 266 48% 15%;
  --ring: 265 59% 63%;

  --font-sans: "Jost", system-ui, sans-serif;
  --font-heading: "Jost", system-ui, sans-serif;

  --radius: 0.75rem;
}
```

**HEX to HSL Conversion Tool**: Use https://htmlcolors.com/hex-to-hsl or similar

**Why HSL Format**: Tailwind's `hsl(var(--variable))` wrapper expects space-separated HSL values, not HEX.

**Time**: 10 minutes (includes conversion)

---

#### Step 4: Wire Tailwind to CSS Variables

**Problem**: Tailwind doesn't automatically use CSS variables for colors.

**Solution**: Map every semantic color to `hsl(var(--token))` in tailwind.config.

**File**: `apps/web/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animationDelay: {
        '0': '0ms',
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [
    function({ matchUtilities, theme }) {
      matchUtilities(
        {
          'delay': (value) => ({
            'animation-delay': value,
          }),
        },
        { values: theme('animationDelay') }
      )
    },
  ],
}
```

**Critical Notes**:
1. **hsl() wrapper**: Required for Tailwind to parse CSS variables correctly
2. **animationDelay**: Custom utilities for `delay-100`, `delay-200`, etc. classes
3. **Custom plugin**: Generates CSS `animation-delay` properties from Tailwind classes
4. **Content globs**: Must include all file paths where Tailwind classes are used

**Why This Works**: Tailwind generates CSS like `background-color: hsl(var(--background))` which reads from CSS variables.

**Time**: 5 minutes (copy-paste template)

---

#### Step 5: Wrap Component in Mobile Frame

**Problem**: Sleek Design components are designed for 375px mobile width but render full-width on desktop.

**Solution**: Wrap component content in a mobile-width container.

**Pattern**:
```typescript
export function YourScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-[#1a1135] to-secondary/30 text-foreground overflow-hidden relative">
      {/* Background effects layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Decorative elements */}
      </div>

      {/* Content layer with mobile frame */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 relative z-10 w-full max-w-sm mx-auto">
        {/* Your actual content */}
      </div>

      {/* Bottom actions */}
      <div className="px-6 pb-8 space-y-3 relative z-10">
        {/* Buttons, pagination, etc */}
      </div>
    </div>
  );
}
```

**Key Classes**:
- `min-h-screen`: Full viewport height
- `w-full max-w-sm`: Full width up to 384px (mobile size)
- `mx-auto`: Center horizontally on desktop
- `relative z-10`: Ensure content sits above background effects

**Why This Works**: Creates a mobile-first design that scales gracefully to desktop without looking stretched.

**Time**: 3 minutes (wrapper structure)

---

#### Step 6: Verify Tailwind Version & Utilities

**Problem**: Older Tailwind versions don't support utilities like `size-72` or `blur-3xl`.

**Solution**: Ensure Tailwind 3.4+ is installed and verify utilities work.

**File**: `apps/web/package.json`

```json
{
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

**Utilities to Verify**:
- `size-{n}`: Sets both width and height (Tailwind 3.4+)
- `blur-xl`, `blur-2xl`, `blur-3xl`: Blur filter utilities
- `animate-pulse`: Pulsing animation
- `delay-{n}`: Animation delay (requires Step 4 plugin)
- `bg-primary/20`: Color with opacity modifier

**Testing**:
1. Run `npm run dev:web`
2. Open browser DevTools
3. Inspect elements with blur effects
4. Verify CSS shows `filter: blur(64px)` for `blur-3xl`
5. Verify animations have staggered delays

**Upgrade if Needed**:
```bash
npm install tailwindcss@latest autoprefixer@latest postcss@latest --workspace=apps/web
```

**Time**: 5 minutes (verification only, 10 if upgrading)

---

### Complete Example: Onboarding Screen Conversion

**Before** (Sleek Design raw code):
```typescript
import { Icon } from "@iconify/react";

export function Onboarding() {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-[#1a1135] to-secondary/30 text-foreground overflow-hidden relative">
      {/* ... blur effects and stars ... */}
      <button className="...">Get Started</button>
    </div>
  );
}
```

**Issues**:
- ❌ Colors wrong (no HSL conversion)
- ❌ Blur effects not visible
- ❌ Animation delays don't work (`delay-300` undefined)
- ❌ Layout doesn't fill viewport
- ❌ Desktop view too wide

**After** (Conversion applied):

1. **Updated CSS variables** (Step 3):
   - Converted all HEX to HSL in `index.css`

2. **Updated Tailwind config** (Step 4):
   - Added `hsl(var(--color))` mappings
   - Added animation delay plugin

3. **Updated component** (Step 5):
   - Changed `h-full` → `min-h-screen`
   - Added `w-full max-w-sm mx-auto` wrapper

4. **Result**:
   - ✅ Perfect colors matching Sleek Design
   - ✅ Blur effects render beautifully
   - ✅ Staggered animations work
   - ✅ Full viewport height
   - ✅ Mobile-width frame on desktop

**Time Investment**: ~30 minutes for first conversion, ~10 minutes for subsequent screens

---

### Troubleshooting Guide

#### Issue: Blur effects not visible

**Check**:
1. ✓ Tailwind 3.4+ installed? (`package.json`)
2. ✓ CSS variables in HSL format? (`index.css`)
3. ✓ Tailwind config has color mappings? (`tailwind.config.js`)
4. ✓ Dev server restarted after config changes?

**Solution**: Hard refresh browser (Cmd+Shift+R / Ctrl+F5)

---

#### Issue: Colors are wrong

**Check**:
1. ✓ All HEX values converted to HSL? (use online converter)
2. ✓ HSL values are space-separated? (`263 56% 19%` not `263,56%,19%`)
3. ✓ Tailwind config uses `hsl(var(--name))`? (not just `var(--name)`)
4. ✓ CSS variables in `:root`? (not scoped to `.dark` or other selector)

**Solution**: Compare side-by-side with working example above

---

#### Issue: Animation delays don't work

**Check**:
1. ✓ `animationDelay` object in Tailwind config?
2. ✓ Custom plugin function added to `plugins` array?
3. ✓ Using correct class names? (`delay-300` not `animation-delay-300`)

**Solution**: Copy plugin code exactly from Step 4

---

#### Issue: Layout doesn't fill viewport

**Check**:
1. ✓ `html, body, #root` have `height: 100%`?
2. ✓ Component uses `min-h-screen` not `h-full`?
3. ✓ No parent container restricting height?

**Solution**: Inspect with DevTools, check parent heights

---

### Quick Reference: Complete File Checklist

When converting Sleek Design to Vite, verify these files are configured:

**Configuration Files**:
- ✓ `apps/web/src/index.css` - CSS variables (HSL), imports, Tailwind directives
- ✓ `apps/web/tailwind.config.js` - Color mappings, animation delays, plugin
- ✓ `apps/web/src/main.tsx` - Imports `index.css`
- ✓ `apps/web/package.json` - Tailwind 3.4+, @iconify/react

**Component Files**:
- ✓ Screen components in `apps/web/src/screens/`
- ✓ Use `min-h-screen` for full height
- ✓ Use `w-full max-w-sm mx-auto` for mobile frame
- ✓ Import `Icon` from `@iconify/react`

**Total Setup Time**: ~30 minutes first time, ~5 minutes for subsequent projects

---

### Automation Potential

**Future Improvement**: Create a CLI tool or script to automate Steps 3-4:

```bash
# Proposed command
npx sleek-to-vite convert ./sleek-design-export/ --output ./apps/web/
```

**What it would do**:
1. Parse Sleek's `globals.css`
2. Convert HEX → HSL automatically
3. Generate Tailwind config
4. Update `index.css` with variables
5. Generate template component with mobile frame

**Value**: Reduces conversion time from 30min → 5min

**Status**: Not implemented yet (manual process works reliably)

---

## Document Maintenance

**When to Update**:
- After completing each phase
- When discovering better approach
- When solving new issues
- After building multiple apps (pattern recognition)

**What to Update**:
- Process improvements section
- Common issues & solutions
- Sequencing if something was wrong
- Time estimates based on experience

**Version History**:
- v1.0: Initial documentation (first app)
- v1.1: Cleaned up to include only Phase 1 (2025-11-13)
- v1.2: Added Sleek Design to Vite conversion guide (2025-11-14)

---

**Last Updated**: 2025-11-14
**Apps Built Using This**: 1
**Sleek Designs Converted**: 1 (Onboarding screen)
**Next Review**: After converting additional Sleek Design components
