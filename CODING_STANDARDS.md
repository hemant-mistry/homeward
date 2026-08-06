# 🏡 Homeward: Coding Standards & Architecture Guide

This document outlines the coding conventions, architectural decisions, and best practices for the **Homeward** React Native project. Following these guidelines ensures the codebase remains clean, maintainable, scalable, and calm—just like the app itself.

---

# 📂 1. Project Architecture

We follow a **feature-driven, decoupled architecture**.

## Core Principles

- Screens should be responsible only for layout, navigation, and data orchestration.
- Business logic belongs inside hooks, services, or utility functions.
- UI components should remain reusable and predictable.
- Domain-specific logic should never leak into generic UI components.

---

## `app/` (Screens & Routing)

**Purpose**

Contains only Expo Router screens and route definitions.

### Responsibilities

- Fetch data
- Call hooks
- Handle navigation
- Compose feature components

### Avoid

- Business logic
- Animation logic
- API calculations
- Complex UI rendering

### ✅ Good

```tsx
export default function DashboardScreen() {
  const loan = useLoan();

  return (
    <DashboardLayout>
      <LoanSummary loan={loan} />
      <MilestoneTracker loan={loan} />
    </DashboardLayout>
  );
}
```

---

## `components/ui/`

Reusable UI building blocks.

Examples

- Button
- Card
- Badge
- ProgressRing
- BottomSheet
- Input
- Avatar
- Typography

### Rules

- Must be completely reusable
- Must not know anything about Home Loans
- No API calls
- No navigation
- No business logic

---

## `components/loan/`

Loan-specific UI.

Examples

- PaymentHistory
- MilestoneTracker
- LoanSummary
- InterestBreakdown
- PaymentModal

These components can combine multiple UI components together.

---

## `hooks/`

Reusable React logic.

Examples

- `useLoanMath()`
- `useInterestCalculator()`
- `useConfetti()`
- `useAnimatedProgress()`

Hooks may contain

- state
- effects
- async calls
- memoization

They should not return JSX.

---

## `services/`

Business logic and API communication.

Examples

```
services/
    loan.service.ts
    payment.service.ts
    auth.service.ts
```

Responsibilities

- API requests
- Mapping DTOs
- Error handling
- Authentication

Never call APIs directly inside components.

---

## `utils/`

Pure utility functions.

Examples

- formatCurrency
- calculateInterest
- formatDate
- generateUUID

Utilities should

- have no React imports
- have no state
- have no side effects

---

## `constants/`

Static values.

Examples

- Colors
- Theme
- API URLs
- Feature flags
- Loan milestone messages

---

## `types/`

Shared TypeScript models.

Example

```
types/
    loan.ts
    payment.ts
    user.ts
```

Separate backend models from UI props.

---

# 🏷️ 2. Naming Conventions

Consistency is mandatory.

---

## Files

Use **kebab-case**

✅

```
payment-history.tsx
loan-summary.tsx
use-loan-math.ts
format-currency.ts
```

❌

```
PaymentHistory.tsx
LoanSummary.tsx
loanSummary.tsx
```

---

## Expo Router Exception

Expo Router requires specific filenames.

Examples

```
_layout.tsx
index.tsx
[id].tsx
```

Do not rename these.

---

## Components

Use **PascalCase**

```tsx
function PaymentModal()
```

```tsx
function LoanSummary()
```

---

## Interfaces

Use PascalCase with `Props`.

```tsx
interface PaymentModalProps {}
```

```tsx
interface LoanSummaryProps {}
```

---

## Variables

Use camelCase.

```tsx
const totalInterest
const isLoading
const paymentHistory
```

---

## Functions

Use camelCase.

```tsx
calculateInterest()
formatCurrency()
handlePress()
```

---

## Hooks

Always begin with `use`.

```tsx
useLoan()
useTheme()
usePaymentHistory()
```

---

## Constants

Use `UPPER_SNAKE_CASE` for primitive constants.

```tsx
MAX_RETRIES
DEFAULT_TIMEOUT
```

Exported configuration objects may remain PascalCase.

```tsx
Colors
Theme
Spacing
```

---

# 🎨 3. Styling Standards (NativeWind)

NativeWind is the default styling solution.

---

## Prefer `className`

✅

```tsx
<View className="flex-1 items-center bg-slate-50 p-4">
```

❌

```tsx
<View
    style={{
        flex:1,
        padding:16
    }}
>
```

---

## Dynamic Classes

Use template literals.

```tsx
<Text
    className={`text-lg ${
        isComplete
            ? "text-green-500"
            : "text-gray-500"
    }`}
>
```

Keep dynamic classes readable.

---

## When to Use `style`

Use inline styles only when values are computed at runtime.

Examples

- Animated width
- Animated height
- Skia canvas dimensions
- Rotation transforms
- Runtime calculations

---

## Avoid

Hardcoded colors.

Instead use design tokens.

```tsx
text-primary
bg-surface
border-border
```

---

# ⚡ 4. Performance Guidelines

A calm experience requires consistently smooth performance.

---

## Reanimated Only

Always use

```
react-native-reanimated
```

Never use

```
Animated
```

from React Native.

---

## Keep Animations on the UI Thread

Use

- useSharedValue
- useAnimatedStyle
- withTiming
- withSpring
- interpolate

Avoid triggering animations with React state.

---

## Skia

Use Skia for

- Rings
- Graphs
- Charts
- Glow effects
- Complex illustrations

Keep paths simple.

Drive animations with shared values.

---

## Memoization

Memoize expensive calculations.

```tsx
useMemo()
```

Memoize callbacks.

```tsx
useCallback()
```

Memoize components when needed.

```tsx
React.memo()
```

---

## FlatList

Always prefer FlatList over ScrollView for long lists.

Provide

- keyExtractor
- getItemLayout when possible
- initialNumToRender
- windowSize

---

## Images

- Prefer Expo Image
- Lazy load
- Cache aggressively
- Compress assets

---

# 🛡️ 5. TypeScript Standards

Type safety is mandatory.

---

## Never Use `any`

❌

```tsx
const data:any
```

✅

```tsx
const data:unknown
```

Narrow the type before use.

---

## Component Props

Every component must define props.

```tsx
interface CalmButtonProps {
    title:string
    onPress:() => void
    isPrimary?:boolean
}
```

---

## Prefer Interfaces

For object shapes.

```tsx
interface Loan {}
```

Use types for unions.

```tsx
type LoanStatus =
    | "pending"
    | "approved"
    | "closed"
```

---

## Separate API Types

Don't reuse backend models as component props.

Example

```
types/
    api/
        loan.ts

types/
    ui/
        loan-card.ts
```

---

# 🧩 6. Component Structure

Every component should follow the same structure.

```tsx
// Imports

// Interfaces

// Component

// State

// Derived Values

// Effects

// Helper Functions

// Return
```

Example

```tsx
// Imports
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

// Interfaces
interface MilestoneCardProps {
    title: string;
    isUnlocked: boolean;
}

// Component
export default function MilestoneCard({
    title,
    isUnlocked,
}: MilestoneCardProps) {

    // State
    const [isExpanded, setIsExpanded] = useState(false);

    // Derived Values

    // Effects

    // Helpers
    const handlePress = () => {
        setIsExpanded(!isExpanded);
    };

    // Return
    return (
        <TouchableOpacity
            onPress={handlePress}
            className={`rounded-xl p-4 ${
                isUnlocked
                    ? "bg-sage-100"
                    : "bg-gray-100"
            }`}
        >
            <Text className="text-lg font-bold">
                {title}
            </Text>
        </TouchableOpacity>
    );
}
```

---

# 📁 Recommended Folder Structure

```
app/
│
├── (tabs)/
├── loan/
├── profile/
├── settings/
└── _layout.tsx

components/
│
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── progress-ring.tsx
│   └── input.tsx
│
├── loan/
│   ├── milestone-tracker.tsx
│   ├── payment-history.tsx
│   └── loan-summary.tsx
│
└── common/

hooks/
│
├── use-loan.ts
├── use-theme.ts
├── use-confetti.ts
└── use-interest-calculator.ts

services/
│
├── api.ts
├── auth.service.ts
├── loan.service.ts
└── payment.service.ts

utils/
│
├── format-currency.ts
├── calculate-interest.ts
├── date.ts
└── validation.ts

constants/
│
├── colors.ts
├── spacing.ts
├── typography.ts
└── milestones.ts

types/
│
├── loan.ts
├── payment.ts
└── user.ts

assets/

lib/

providers/

store/

theme/
```

---

# ✅ Code Review Checklist

Before opening a Pull Request, ensure the following:

- [ ] No business logic inside screens.
- [ ] No `any` types.
- [ ] Components have typed props.
- [ ] Files follow kebab-case naming.
- [ ] Uses NativeWind `className` wherever possible.
- [ ] No unnecessary re-renders.
- [ ] Animations use Reanimated.
- [ ] Long lists use FlatList.
- [ ] Business logic extracted into hooks/services.
- [ ] Utility functions remain pure.
- [ ] Constants are centralized.
- [ ] Components remain small and reusable.
- [ ] API models are separated from UI models.
- [ ] Code follows the standard component structure.
- [ ] Imports are organized consistently.
- [ ] No dead code or unused imports.
- [ ] All new functionality is fully typed.
- [ ] Accessibility labels added where appropriate.
- [ ] Error states and loading states are handled gracefully.

---

# 🌿 Homeward Philosophy

Every line of code should make the app feel **simple, calming, and reliable**.

When in doubt, optimize for:

- Readability over cleverness.
- Simplicity over abstraction.
- Reusability over duplication.
- Smoothness over flashy animations.
- Type safety over convenience.
- Consistency over personal preference.

A developer unfamiliar with the project should be able to understand any file within a few minutes. Clean architecture and predictable patterns are features—not afterthoughts.