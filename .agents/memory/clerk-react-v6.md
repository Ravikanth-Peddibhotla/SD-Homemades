---
name: Clerk React v6
description: Current managed Clerk constraints and auth-boundary API behavior for this project.
---

Use the current Clerk React v6 `Show` component for signed-in and signed-out conditional UI rather than older `SignedIn`/`SignedOut` exports. Replit-managed Clerk currently supports email/password and configured social providers, but not phone/SMS sign-in.

**Why:** The installed Clerk package exposes the v6 API, while older examples may still use removed wrapper exports; the product brief includes phone OTP but the managed provider cannot fulfill it.

**How to apply:** Keep auth flows on supported Clerk methods and do not present a fake SMS/OTP submission. Add a separate SMS provider only if phone authentication becomes a required production feature.