# Synapause Changelog

# Changelog

All notable changes to this project will be documented in this file.

---

## [1.2.0] - 2026-07-25

### 🚀 Major Update
This release introduces a complete overhaul of the authentication system, significant improvements to the Chrome Extension architecture, and major refinements to the quiz experience through the new Neuro Nudge interstitial (HALO HASAN).

---

### ✨ Added

#### Authentication
- Email OTP verification system.
- Forgot Password flow with OTP verification.
- Login using either Username or Email.
- Automatic deletion of expired unverified accounts.

#### Account Management
- Change Username.
- Change Email.
- Change Password.
- Dedicated popup for each account setting.
- Password requirement indicator.
- Loading, success, and error states.

#### Extension
- Website ↔ Extension account synchronization.
- Automatic user synchronization using Chrome Storage.
- HALO HASAN interstitial before every quiz.
- Dynamic Greeting.
- Dynamic Quote (Lighter).
- Dynamic Persuasion.
- Personalized greeting using logged-in username.

---

### ♻️ Changed

#### Architecture
- Refactored JavaScript into feature-based modules.
- Unified `profile.js` for both Home and Dashboard.
- Simplified Extension configuration.
- Website monitoring is now internally managed.
- Separated Question API and Analytics API.

#### Quiz Engine
- Quiz is now preloaded before user interaction.
- Session starts before quiz rendering.
- Timer starts only after pressing **Continue**.
- Improved quiz state initialization.
- Improved question history handling.
- Replacement questions are now tracked.

#### User Experience
- Redesigned Account Management UI.
- Redesigned HALO HASAN interface.
- Improved popup transitions.
- Improved animations.
- Improved loading feedback.
- Improved visual hierarchy.
- Improved responsive layout.
- Improved Dark Mode support.

---

### 🐞 Fixed

#### Authentication
- Fixed Website ↔ Extension synchronization.
- Fixed USER_ID synchronization.
- Fixed session synchronization.

#### Quiz
- Fixed quiz state not resetting between intervals.
- Fixed timer continuation issue.
- Fixed question replacement history.
- Fixed analytics being saved under incorrect users.

#### Analytics
- Fixed `startSession()`.
- Fixed `saveAnswer()`.
- Fixed `finishSession()`.
- Fixed analytics user mapping.

#### Stability
- Improved extension stability.
- Improved backend stability.
- Improved session management.
- Added extensive debugging logs and trace-flow debugging.

---

### 🧠 Developer Notes

This version started as a planned **v1.2.0 Authentication System Rework**, but evolved into a broader maintenance release after multiple architecture and synchronization issues were discovered during development. Rather than postponing those fixes, they were addressed together to improve overall system stability, maintainability, and user experience.
As with any software release, some issues may still remain undiscovered. Future patch releases will continue to focus on incremental bug fixes and quality improvements.