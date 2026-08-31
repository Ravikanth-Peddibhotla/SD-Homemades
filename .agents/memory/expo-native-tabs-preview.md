---
name: Expo NativeTabs preview guard
description: NativeTabs must be isolated from web previews while preserving the iOS 26 path.
---

NativeTabs should only render when `Platform.OS === 'ios'` and `isLiquidGlassAvailable()` is true; use the classic Tabs fallback for web, Android, and older iOS.

**Why:** The Expo web preview can report liquid-glass availability in a way that selects NativeTabs even though the browser cannot render the native tab surface, producing a blank app without a useful runtime error.

**How to apply:** Whenever an Expo app uses the scaffolded NativeTabs/classic Tabs split, include the platform guard in the route-group layout before verifying the web preview.