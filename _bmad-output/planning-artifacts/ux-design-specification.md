---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]
inputDocuments: ["/Users/francesco/dev/hub/todoapp/_bmad-output/planning-artifacts/prd.md", "/Users/francesco/dev/hub/todoapp/_bmad-output/planning-artifacts/architecture.md"]
---

# UX Design Specification todoapp

**Author:** Fran  
**Date:** 2026-04-02

---

## Executive Summary

### Project Vision

Todoapp is a personal task management application built around one principle: **absolute clarity through simplicity**. The interface should disappear from the user's mind—they see their tasks and nothing else. Every element serves a purpose; nothing is decorative or exploratory. The experience is fast, friendly, and frictionless, designed for users who want to capture tasks quickly and move on, not spend time managing complexity.

The defining UX characteristic is **satisfying micro-interactions**: status changes feel rewarding through subtle, purposeful animations, but the overall aesthetic remains minimal and uncluttered. Design is friendly—warm, approachable, human—without being playful or corporate.

### Target Users

**Primary User:** Knowledge workers and individuals managing daily tasks who are frustrated with complex, feature-heavy task managers that demand constant configuration and navigation. They want a tool that *just works*.

**Usage Pattern:** Quick daily usage across desktop and mobile. Users will capture tasks in moments (seconds, not minutes) and check off completed work throughout the day. No review/planning sessions—pure action-oriented task management.

**Device Context:** Balanced desktop and mobile usage. Users expect the same fast, frictionless experience whether they're at a desk or on their phone. The interface must adapt seamlessly without losing clarity or efficiency.

**Tech Comfort:** General population—no technical knowledge required. The interface should be immediately intuitive; if users need to think about how to use it, we've failed.

### Key Design Challenges

1. **Minimalism Without Coldness** — Create an uncluttered, clean interface that feels approachable and human, not sterile or corporate. Every design choice must earn its place through purpose or delightful polish.

2. **Micro-Animation Restraint** — Add satisfying, purposeful animations to reward status changes, but maintain the perception of instant feedback and never introduce visual noise that distracts or clutters the experience.

3. **Mobile-Desktop Parity** — Deliver an equally uncluttered, intuitive experience on small screens and large displays. Touch interactions must feel natural; desktop interactions must feel responsive. No platform feels like an afterthought.

4. **Speed and Affordance** — Design must make it obvious what users can do (add, complete, delete) without explanation, and every interaction must feel fast and rewarding.

### Design Opportunities

1. **Thoughtful Micro-Interactions** — Subtle transitions, smooth state changes, and purposeful animations can make mundane task management feel satisfying and appreciated. Motion becomes a communication tool that reinforces intent.

2. **Generous Whitespace as Premium** — Strategic use of breathing room around tasks and inputs signals focus and quality. Space itself becomes a design feature that reduces cognitive load.

3. **Friendly Visual Language** — Warm, approachable color palette, humane typography, and friendly iconography create emotional connection without clutter. The design feels human, not algorithmic.

4. **Native-Feeling Touch Interactions** — Swipe, tap, and gesture patterns that align with mobile OS conventions make the app feel like it belongs on the device, reducing friction and learning curve.

---

## Core User Experience

### Defining Experience

The heart of todoapp is the **satisfying completion ritual**. Users add tasks quickly (single input field, always visible), but the primary interaction loop is marking tasks complete. Each completion is rewarded with clear visual feedback—status change, subtle animation—making progress tangible and appreciated. Completed tasks remain visible, creating a growing record of accomplishment throughout the day.

The experience is **completion-forward**: every design decision prioritizes making the completion action feel effortless, satisfying, and clear. Adding tasks is frictionless but secondary; completing them is the moment of satisfaction that keeps users returning.

### Platform Strategy

**Unified Touch and Click Model:**
- Both desktop (mouse) and mobile (touch) use the same interaction pattern: tap/click to toggle task completion
- No gesture-specific interactions (no swipes for primary actions)
- Identical information architecture and interaction model across all platforms
- Responsive layout adapts spacing, sizing, and breathing room; interaction patterns remain constant

**Why Consistent Taps Over Swipes:**
- Immediate affordance: users understand tap-to-complete instantly, no discovery needed
- Accidental prevention: swipes trigger unintentionally during normal mobile use
- Mental model parity: same action produces same result everywhere
- Desktop clarity: mouse clicks map directly to mobile taps; no translation needed

**Mobile Considerations:**
- Touch targets sized for comfortable thumb interaction (minimum 44x44px)
- No hover states needed; replace with active/pressed states
- Vertical scrolling priority; minimize horizontal scrolling
- Input field optimized for mobile keyboards

**Desktop Considerations:**
- Generous whitespace emphasizes focus and clarity
- Keyboard shortcuts (Enter to add, Space/Click to complete, Delete to remove)
- Hover states provide subtle affordance hints

### Effortless Interactions

1. **Always-Ready Input** — The task creation field is permanently visible at the top/bottom, requiring no navigation or "Add" button click. Users type and hit Enter; task appears instantly.

2. **One-Tap Completion** — Clicking or tapping anywhere on a task toggles its completion status. No checkboxes to hunt for; the entire task surface is interactive. Status change is immediate.

3. **Persistent Progress** — Completed tasks remain visible with clear visual distinction (color + checkmark), creating an immediate sense of daily accomplishment. Users can see what they've done.

4. **Onboarding Through Example** — Two pre-populated example tasks (one active, one complete) teach the interface in seconds. New users see the input field and understand the full mental model without reading anything.

5. **Instant Deletion** — Hover/press reveals delete action; one more tap removes the task. Fast, clear, no confirmation dialogs cluttering the experience.

### Critical Success Moments

1. **First Open** — User sees two example tasks (one done, one active) and immediately grasps the interface. No confusion, no "what do I do?" moment.

2. **First Completion** — User taps a task and sees it transform—color change, checkmark, subtle animation. The satisfaction of instant visual feedback hooks them.

3. **Task Accumulation** — Throughout the day, completed tasks stack up visually. By day's end, users see their work. The persistent list becomes a motivator.

4. **Quick Capture** — User adds multiple tasks in sequence without friction. The input field resets; the next task appears immediately. Speed builds confidence.

5. **Mobile Fluidity** — Switching to mobile, the experience feels native, not adapted. Same interactions, same satisfaction, no re-learning needed.

### Experience Principles

1. **Completion is the Hero** — Every design decision prioritizes making task completion satisfying, fast, and rewarding. This is the moment users return for.

2. **Always Ready** — The input field is always visible and ready. Users should never hunt for where to add a task. Minimum friction to capture.

3. **Persistent Progress** — Completed tasks remain visible, creating a visual record of accomplishment. Progress is tangible and motivating.

4. **One Interaction Model** — Tap/click to complete. No gestures, no hidden menus, no platform-specific surprises. Consistency creates confidence.

5. **Feedback Over Features** — Visual feedback (animation, color, checkmark) makes mundane actions feel rewarding. Motion and polish replace feature count.

6. **Uncluttered Focus** — Every visual element earns its place. Whitespace is generous. Distractions are eliminated. The tasks are the interface.

---

## Desired Emotional Response

### Primary Emotional Goals

**Satisfaction & Accomplishment** — The moment users complete a task, they should feel genuinely satisfied. The visual feedback (animation, color change, checkmark) reinforces this accomplishment, making the mundane action of checking off a task feel rewarding and appreciated.

**Coziness & Comfort** — Using todoapp should feel like settling into a familiar, welcoming space. The uncluttered, warm design creates an environment where users feel at home, not stressed. This is a tool that feels like a friend, not a boss.

**Calm & Organization** — As users move through their day, completing tasks and seeing their progress, they should feel increasingly calm and in control. The persistent list of completed work creates order and clarity, reducing cognitive load and anxiety.

**Familiarity & Confidence** — From the first moment opening the app, users should feel immediately confident in how to use it. No learning curve, no confusion. The example tasks teach the interface through visual example, not explanation. Users feel competent and capable instantly.

### Emotional Journey Mapping

| Stage | Emotional Goal | Design Support |
|-------|----------------|-----------------|
| **First Open** | Immediate familiarity, confidence | Two example tasks (one active, one complete) show the full mental model at a glance |
| **Quick Capture** | Smooth, meditative ease | Always-visible input field, single Enter keystroke, minimal friction |
| **Task Completion** | Satisfaction, accomplishment, delight | Visual transformation (color + checkmark), subtle animation rewards the action |
| **Viewing Progress** | Calm, organization, motivation | Persistent completed tasks create visible daily record; accomplishment compounds |
| **Accidental Deletion** | Confidence, safety, no regret | Undo functionality prevents mistakes; users can be bold without fear |
| **Returning Tomorrow** | Continuity, momentum, readiness | Tasks persist; yesterday's progress visible; tomorrow's tasks already captured |

### Micro-Emotions

**Confidence Over Confusion:**
- Design makes interactions obvious without explanation
- Example tasks demonstrate the full interface
- Single, consistent interaction model (tap to complete)
- Undo functionality removes fear of mistakes

**Satisfaction Over Indifference:**
- Completion action is rewarded with visual transformation
- Animations make mundane actions feel intentional and appreciated
- Persistent completed tasks create tangible sense of progress
- Each completion reinforces user competence

**Calm Over Friction:**
- Uncluttered interface reduces cognitive load
- Always-ready input eliminates decision fatigue about where to add tasks
- Smooth interactions (no jarring transitions or delays) promote tranquility
- No hidden menus, modals, or surprise interactions create predictability

**Coziness Over Coldness:**
- Warm color palette and friendly typography humanize the interface
- Generous whitespace signals thoughtfulness and care
- Micro-animations feel intentional, not automatic
- Overall aesthetic is approachable, not corporate or sterile

**Accomplishment Over Overwhelm:**
- Completed tasks remain visible, creating growing sense of achievement
- Visual accumulation throughout the day motivates continued use
- List never feels cluttered (completed tasks change appearance, not disappear)
- Users see what they've done, creating momentum

### Design Implications

| Emotional Goal | UX Design Approach |
|---|---|
| **Satisfaction on Completion** | Subtle animation (200-300ms) on status change—smooth color transition, checkmark appears, task shifts slightly. Animation is fast enough to feel responsive, long enough to be noticed and appreciated. |
| **Coziness** | Warm color palette (soft blues, warm grays, friendly greens), rounded corners, generous padding, humanizing typography. Interface feels like a designed space, not a database. |
| **Calm & Organization** | Vertical scrolling creates a flowing list; completed tasks remain in place with visual distinction (lighter color, checkmark). No sudden disappearances or re-ordering; predictable structure. |
| **Familiarity on First Use** | Example tasks visible immediately. One active (clean state), one complete (color + checkmark). Users see the complete mental model without reading. Input field visible and obvious. |
| **Smooth Capture** | Input field always visible at top or bottom. Single Enter keystroke submits. Field clears and resets for next task. No multi-step process. Interaction feels meditative and continuous. |
| **Confident Deletion** | Delete action revealed on hover/press; not immediate. Single tap to delete. Undo button appears in toast notification (3-5 seconds to recover). Users can be bold without consequences. |

### Emotional Design Principles

1. **Satisfaction is the Core Reward** — Every completion action should feel genuinely satisfying. Animation and visual feedback make this moment special, not perfunctory. The satisfaction compounds as users see their daily accomplishments.

2. **Coziness Over Efficiency** — While the app is fast and efficient, the primary emotional goal is comfort. Users should feel like they're using a thoughtfully designed space, not a utility. Warmth and humanity matter as much as speed.

3. **Confidence Through Clarity** — Users should never wonder how to use todoapp. Design should make interactions obvious through visual example (example tasks), consistent patterns (tap to complete), and safe recovery (undo). Confidence builds on day one and grows with familiarity.

4. **Calm as a Feature** — The minimal, uncluttered design is intentional. Whitespace, breathing room, and lack of visual noise reduce cognitive load and anxiety. Using the app should feel like a break from complexity, not another source of stress.

5. **Trust Through Thoughtfulness** — Undo functionality, persistent progress, predictable interactions, and warm visual design all communicate that this product was built with users in mind. Users feel cared for, which builds trust and loyalty.

6. **Accomplishment as Fuel** — Seeing completed tasks accumulate creates a compounding sense of achievement. The persistent list isn't clutter; it's proof of progress. This motivates continued use and creates positive reinforcement.

---

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Apple Reminders**

Apple Reminders succeeds through radical clarity. The interface is so simple it's almost invisible—users open it and immediately know what to do. No onboarding, no explanation, no discovery phase. The interactions are instant and predictable: tap to complete, swipe to delete. Completed reminders disappear or appear with a checkmark, providing clear status feedback. The core strength is *intuitivity*: the mental model is so obvious that first-time users feel confident immediately.

**Notion**

Notion demonstrates that minimalist information architecture doesn't require cold, sterile design. Instead, Notion wraps functionality in warm, approachable visual language: emojis, friendly typography, rounded corners, generous whitespace, and a personality that feels designed with care. The interface feels like a space someone built for you, not a database interface. The visual design choices—color, icons, subtle details—communicate friendliness without adding complexity to the core experience.

### Transferable UX Patterns

**Navigation & Onboarding Patterns:**

1. **Implicit Teaching Through Example** — Apple Reminders doesn't explain; it shows. Todoapp will use example tasks (one active, one complete) to teach the interface instantly. No tutorial, no text explanation. Visual example is the onboarding.

2. **Immediate Affordance Recognition** — Both apps make interactions obvious from first glance. Users shouldn't need to think. Todoapp will use consistent tap/click interactions and clear visual hierarchy so users understand immediately what they can do.

**Interaction Patterns:**

1. **Instant Status Feedback** — Apple Reminders provides immediate visual confirmation (checkmark, status change). Todoapp will reward completion with smooth animation and visual transformation, making the action feel satisfying.

2. **Persistent Progress Visibility** — Both apps keep completed items visible or accessible. Todoapp will maintain completed tasks in the list with visual distinction, creating a record of daily accomplishment.

3. **Effortless Primary Action** — In Reminders, completing a reminder is one tap. In Notion, adding a new item is frictionless. Todoapp will make both completion (primary) and capture (secondary) feel effortless—tap to complete, always-visible input for adding.

**Visual Design Patterns:**

1. **Cozy Visual Personality** — Notion's use of emojis, warm colors, rounded corners, and friendly typography creates approachability without sacrificing clarity. Todoapp will adopt this warmth: emoji support for tasks, rounded UI elements, warm color palette (soft blues, warm grays, friendly greens), and humanizing typography.

2. **Generous Whitespace** — Both apps use breathing room strategically. Todoapp will embrace whitespace as a design principle: tasks feel centered and focused, not cramped.

3. **Icon and Visual Language** — Notion uses clear, friendly icons. Todoapp will use simple, recognizable icons (checkmark for complete, trash for delete) with friendly styling.

### Anti-Patterns to Avoid

1. **Over-Explanation** — Don't explain with modals, tooltips, or help text. Both Reminders and Notion let design do the explaining. Todoapp design should be self-evident.

2. **Hidden Functionality** — Avoid deep menus, contextual options, or features that require discovery. Everything important should be visible. Don't hide delete behind a swipe or menu.

3. **Sterile Minimalism** — Avoid the trap of minimalist design that feels cold or corporate. Notion proves that simplicity can be warm and approachable. Todoapp needs personality.

4. **Confirmation Dialogs for Common Actions** — Apple Reminders doesn't confirm task completion; it just happens. Todoapp won't confirm completion either. Undo is available but not interrupting. (Delete may have a subtle confirmation to prevent accidents.)

5. **Complex Visual Hierarchy** — Avoid too many text sizes, colors, or visual weights. Both Reminders and Notion maintain clarity through restraint. Todoapp will keep visual hierarchy simple and clear.

### Design Inspiration Strategy

**What to Adopt:**

1. **Apple Reminders' Intuitivity** — Interaction patterns that are immediately obvious. Users open todoapp and understand what to do without any explanation. Tap to complete, input to add, delete action for removal. No learning curve.

2. **Notion's Visual Warmth** — Friendly, approachable design language with emojis, warm colors, rounded corners, and humanizing typography. The interface feels designed with care, not stripped of personality.

3. **Both Apps' Respect for Speed** — Instant feedback, no loading states where possible, no unnecessary steps. Both apps feel responsive and fast.

**What to Adapt:**

1. **Notion's Customization** → **Todoapp's Simplicity** — Notion lets users customize everything. Todoapp will offer emoji choices for tasks (personality without complexity) but keep everything else fixed and opinionated. No custom colors, views, or configurations.

2. **Reminders' Disappearing Tasks** → **Todoapp's Persistent Progress** — Reminders can hide completed items. Todoapp will keep them visible with visual distinction to create a sense of accomplishment and daily progress.

**What to Avoid:**

1. **Notion's Complexity** — Notion's power comes from flexibility, but that's not todoapp's goal. Todoapp rejects configuration, multiple views, and advanced features.

2. **Sterile Minimalism** — Unlike some minimalist apps that feel cold, todoapp will feel warm and human. Every design choice communicates care.

3. **Mobile Compromise** — Neither Reminders nor Notion compromises the experience on mobile. Todoapp will be equally polished and intuitive on all devices.

---

## Design System Foundation

### Design System Choice

**Tailwind CSS + Custom Component Architecture**

Todoapp will use Tailwind CSS as its design system foundation, paired with custom React components built on top of Tailwind utilities. This approach provides complete visual control while maintaining speed and keeping the bundle size lean.

Tailwind CSS is a utility-first framework that enables rapid development with pixel-perfect customization. Instead of pre-built components that constrain design, Tailwind provides building blocks (spacing, colors, sizing, animations) that you compose into custom components. This gives todoapp the visual uniqueness of a custom design system with the development speed of a pre-built framework.

### Rationale for Selection

1. **Visual Control & Uniqueness** — Tailwind's utility-first approach means every pixel of todoapp's design is intentional and customizable. You're not constrained by another designer's component opinions. The warm, cozy aesthetic you envision (rounded corners, emoji support, friendly spacing) is completely achievable.

2. **Bundle Size Alignment** — Tailwind with tree-shaking produces ~18KB gzipped for todoapp's needs. This fits comfortably within your <100KB target and leaves room for libraries like TanStack Query and React without bloating.

3. **Solo Developer Speed** — Tailwind's utility-first model is faster than building everything from scratch or learning a complex component library. You can build task components quickly without boilerplate. Documentation is excellent and community is massive.

4. **No Hidden Complexity** — You're not importing a component library with features you don't need. Every line of CSS is exactly what todoapp requires. This keeps the codebase simple and maintainable.

5. **Scalability Without Restructuring** — As todoapp grows (Phase 2, Phase 3), Tailwind adapts. You can extract component patterns into reusable Tailwind component classes or create a simple component library on top without major refactoring.

6. **Design Consistency Through Configuration** — Tailwind's `tailwind.config.js` becomes your design system. Define your warm color palette once, your spacing scale, your border radius, your animation durations. Everything flows from there.

### Implementation Approach

**Tailwind Configuration Strategy:**

```javascript
// tailwind.config.js - Your design system in code
module.exports = {
  darkMode: 'class',  // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Light theme - warm and approachable
        task: {
          activeLight: '#F5F3FF',      // Soft lavender for active tasks
          completeLight: '#E8F5E9',    // Soft green for completed tasks
          accentLight: '#6366F1',      // Warm indigo for accents
          textLight: '#4A4A4A',        // Warm gray for text
          borderLight: '#E0E0E0',      // Soft border gray
          bgLight: '#FFFFFF',          // Clean white background
          
          // Dark theme - maintains coziness in low light
          activeDark: '#1E1B4B',       // Deep slate (inverted lavender)
          completeDark: '#164E63',     // Deep teal (inverted green)
          accentDark: '#818CF8',       // Bright indigo (adjusted for dark bg)
          textDark: '#F3F4F6',         // Off-white for legibility
          borderDark: '#334155',       // Dark gray borders
          bgDark: '#0F172A',           // Deep navy background
        }
      },
      borderRadius: {
        'task': '12px',           // Rounded corners for cozy feel
      },
      spacing: {
        'task-gap': '16px',       // Breathing room between tasks
      },
      animation: {
        'task-complete': 'taskComplete 300ms ease-out',  // Satisfying completion animation
      },
      keyframes: {
        taskComplete: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '1', transform: 'scale(1.05)' },
        }
      }
    }
  }
}
```

**Component Architecture:**

- **Design System Layer** — Tailwind config (colors, spacing, typography, animations)
- **Component Layer** — Reusable React components built with Tailwind utilities
  - `<TaskCard />` — Individual task display with click-to-complete
  - `<TaskList />` — Container for all tasks
  - `<TaskInput />` — Input field for new tasks
  - `<EmptyState />` — Message when no tasks exist
  - `<Toast />` — Notification for undo/errors

- **Page Layer** — `HomePage.tsx` composes components into the full experience

### Customization Strategy

**Design Tokens (Light & Dark Modes):**

| Element | Token | Light Value | Dark Value | Purpose |
|---------|-------|-------------|-----------|---------|
| **Color - Active Task** | `task-active` | Soft lavender (#F5F3FF) | Deep slate (#1E1B4B) | Friendly base for active tasks |
| **Color - Complete Task** | `task-complete` | Soft green (#E8F5E9) | Deep teal (#164E63) | Satisfied, accomplished feeling |
| **Color - Accent** | `task-accent` | Warm indigo (#6366F1) | Bright indigo (#818CF8) | Primary interactive elements |
| **Color - Text** | `task-text` | Warm gray (#4A4A4A) | Off-white (#F3F4F6) | Content text |
| **Color - Background** | `task-bg` | White (#FFFFFF) | Deep navy (#0F172A) | Page background |
| **Color - Border** | `task-border` | Light gray (#E0E0E0) | Dark gray (#334155) | Subtle dividers |
| **Spacing - Task Gap** | `task-gap` | 16px | 16px | Breathing room, cozy feel |
| **Spacing - Padding** | `task-padding` | 16px | 16px | Generous internal spacing |
| **Border Radius** | `task-radius` | 12px | 12px | Rounded corners for warmth |
| **Animation - Completion** | `task-complete` | 300ms ease-out | 300ms ease-out | Smooth, satisfying feedback |

**Dark Mode Strategy:**

- **System Preference Default** — Respects user's OS dark mode setting on first visit
- **User Override** — Toggle button allows users to manually switch (preference persists in localStorage)
- **Maintained Warmth** — Dark mode uses deep, warm colors (deep slate, teal, bright indigo) not cold grays
- **Accessibility** — Text contrast meets WCAG AA in both modes
- **Smooth Transition** — Theme toggle animates smoothly (transition 300ms)

**Custom Component Variants (Light & Dark):**

```javascript
// Using Tailwind @layer to create custom component classes
@layer components {
  .task-card {
    @apply rounded-task p-4 bg-task-bgLight text-task-textLight shadow-sm transition-all duration-300;
    @apply dark:bg-task-bgDark dark:text-task-textDark dark:shadow-lg;
  }
  
  .task-active {
    @apply bg-task-activeLight cursor-pointer hover:shadow-md;
    @apply dark:bg-task-activeDark dark:hover:shadow-lg;
  }
  
  .task-complete {
    @apply bg-task-completeLight opacity-75;
    @apply dark:bg-task-completeDark dark:opacity-80;
  }
  
  .task-input {
    @apply w-full px-4 py-3 border border-task-borderLight rounded-task bg-task-bgLight text-task-textLight placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-task-accentLight;
    @apply dark:bg-task-bgDark dark:text-task-textDark dark:border-task-borderDark dark:placeholder-gray-500 dark:focus:ring-task-accentDark;
  }
}
```

**No Custom CSS Files Needed:**

All styling happens through Tailwind utilities and the config file. Dark mode variants are generated automatically via Tailwind's `dark:` prefix. Styling is declarative and co-located with components.

---

## Defining Core Experience

### Defining Experience

**The Satisfying Completion Ritual**

Todoapp's core interaction is the moment a user taps a task to mark it complete. This single action—tap—triggers a cascade of satisfying feedback that makes task completion feel rewarding and intentional. The interaction is the heart of todoapp: fast, delightful, and immediately visible.

The defining experience is not just marking done; it's the *transformation*. Users see their choice reflected immediately through motion (bounce), visual change (color), and spatial reorganization (moving to completed section). This creates a tangible sense of progress and accomplishment.

### User Mental Model

Users bring a simple mental model to task management:
- **Active tasks** are things I need to do (top of mind, most prominent)
- **Done tasks** are things I've accomplished (important to see, but secondary)
- **Completion is binary** — a task is either active or complete, no in-between states

Users expect task completion to be:
- **Instant** — tap once, change happens immediately (no confirmation, no dialog)
- **Visual** — the change should be obvious at a glance (color, check, movement)
- **Permanent** — once marked done, it stays done (unless they undo)
- **Satisfying** — the interaction should feel rewarding, not clinical

Existing solutions (Apple Reminders, Things) teach users that completion should be one tap with immediate visual feedback. Todoapp improves on this by adding motion and personality to make the moment feel special.

### Success Criteria

A completion interaction is successful when:

1. **Immediate Response** — The moment users tap, something happens (within 50ms). No lag. Instant feedback confirms the tap registered.

2. **Attention Without Disruption** — The bounce animation draws attention and delights, but doesn't feel chaotic or excessive. It's visible but quick (300-400ms total).

3. **Color Transformation** — The task background shifts from active color (soft lavender) to complete color (soft green), making status immediately clear at a glance.

4. **Checkmark Appearance** — A green checkmark appears on the task, reinforcing the "done" state with a universal symbol.

5. **Spatial Movement** — The task smoothly glides from the "Active" section to the "Completed" section (or simply moves within the list if sections are visual).

6. **Satisfaction Signal** — Users feel a sense of accomplishment. They see their action resulted in progress. The visual feedback communicates: "You did it. It's recorded."

7. **Reversibility** — Users feel confident completing tasks because they know undo is available (toast notification with undo button appears for 3-5 seconds).

### Novel vs. Established Patterns

**Established Pattern:** Tap to toggle completion status (Apple Reminders, Things, Todoist)

**Novel Additions to the Pattern:**
1. **Bounce Animation** — The task bounces slightly when marked complete, adding personality and delight beyond simple state change
2. **Color + Checkmark Together** — Most apps use either color OR checkmark; todoapp uses both for absolute clarity
3. **Smooth Section Migration** — Instead of disappearing or staying in place, the task visually moves to the "Completed" section, showing spatial organization

**Why This Works:**
- Users immediately understand the established "tap to complete" pattern
- Novel animations and spatial movement add personality without confusion
- Multiple feedback channels (color, checkmark, motion, location) create confidence in the change

### Experience Mechanics

**Step-by-Step Core Interaction Flow:**

#### 1. Initial State (App Opens)

**User Sees:**
- Two visual sections: "Tasks" (top, prominent) and "Completed" (below)
- Each section has a subtle visual indicator (spacing, light background, or label)
- Active tasks display in "Tasks" section with soft lavender background
- Completed tasks display in "Completed" section with soft green background + checkmark
- Input field visible at top (always ready for new task)

**Mental Model:** "Uncompleted work on top, completed work below. Clear and organized."

#### 2. User Initiates Action

**User Taps** anywhere on an active task in the "Tasks" section.

**What Happens (Within 50ms):**
- Task briefly scales down slightly (99% scale) then bounces back (104% scale then settle at 101%)
- This bounce takes 300-400ms total
- Creates satisfying "pop" feeling without being jarring

#### 3. Visual Feedback Sequence

**Simultaneously during animation:**

**Color Transition (300ms):**
- Background smoothly transitions from soft lavender (#F5F3FF) to soft green (#E8F5E9)
- Transition is smooth, not instant or jarring

**Checkmark Appearance (300ms):**
- Checkmark fades in or slides in from left (starting at 0% opacity, reaching 100%)
- Checkmark appears at same time as color change
- Green checkmark color is slightly darker than background for contrast

**Task Movement (350ms):**
- After bounce animation completes, task smoothly slides down and out of "Tasks" section
- Task slides into "Completed" section below
- Movement is smooth (CSS transition or animation)
- Completed tasks stack in "Completed" section in reverse chronological order (newest completed at top)

#### 4. Feedback Confirmation

**User Sees:**
- Task now appears in "Completed" section with green background + checkmark
- Active task list rearranges if needed (tasks below move up to fill space)
- Optional: Toast notification appears briefly (1-2 seconds) saying "Task completed" or just "✓" (undo button available for 3-5 seconds)

**User Feels:** Accomplished. The task is clearly done. Progress is visible.

#### 5. Completion State

**The Task is Now:**
- In "Completed" section
- Displayed with green background
- Shows checkmark
- Opacity slightly reduced (75-80%) to feel "lighter" than active tasks
- Still clickable (tap again to undo/reactivate)

#### 6. Undo Recovery

**If User Accidentally Marked as Done:**
- Toast notification with "Undo" button appears (3-5 seconds)
- User taps "Undo"
- Task smoothly slides back from "Completed" to "Tasks" section
- Animation reverses: green → lavender, checkmark fades out, task returns to original position

### Animation Specifications

| Element | Animation | Duration | Easing | Details |
|---------|-----------|----------|--------|---------|
| **Bounce** | Scale 99% → 104% → 101% | 300-400ms | cubic-bezier(0.68, -0.55, 0.265, 1.55) | Playful but not excessive |
| **Color** | Lavender → Green | 300ms | ease-out | Smooth transition |
| **Checkmark** | Fade in + scale | 300ms | ease-out | Appears with color change |
| **Movement** | Slide down to Completed | 350ms | ease-out | Smooth glide |
| **Opacity** | On complete | Instant | N/A | Set to 75-80% |

---

## Visual Design Foundation

### Color System

**Light Mode Palette (Primary)**

The light mode uses a warm, approachable color palette inspired by Notion's friendliness combined with Apple Reminders' clarity. Colors are soft and inviting, never harsh or corporate.

| Element | Color | Hex | Purpose |
|---------|-------|-----|---------|
| **Active Task Background** | Soft Lavender | #F5F3FF | Friendly, approachable state for incomplete tasks |
| **Completed Task Background** | Soft Green | #E8F5E9 | Satisfying, accomplished state |
| **Primary Accent** | Warm Indigo | #6366F1 | Interactive elements, focus states |
| **Text - Primary** | Warm Gray | #4A4A4A | Main content text, high contrast |
| **Text - Secondary** | Light Gray | #7A7A7A | Supporting text, timestamps |
| **Background** | Pure White | #FFFFFF | Page background, task cards |
| **Border** | Light Gray | #E0E0E0 | Subtle dividers between sections |
| **Success/Checkmark** | Vibrant Green | #22C55E | Checkmark icon, completion signals |

**Dark Mode Palette (Supported)**

Dark mode maintains the cozy warmth using deep, rich colors instead of cold grays.

| Element | Color | Hex | Purpose |
|---------|-------|-----|---------|
| **Active Task Background** | Deep Slate | #1E1B4B | Warm dark base for incomplete tasks |
| **Completed Task Background** | Deep Teal | #164E63 | Warm dark completion state |
| **Primary Accent** | Bright Indigo | #818CF8 | Interactive elements (brighter for dark bg) |
| **Text - Primary** | Off-White | #F3F4F6 | Main content, high contrast on dark |
| **Text - Secondary** | Light Gray | #D1D5DB | Supporting text, timestamps |
| **Background** | Deep Navy | #0F172A | Page background, dark theme |
| **Border** | Dark Gray | #334155 | Subtle dividers in dark mode |
| **Success/Checkmark** | Light Green | #86EFAC | Checkmark icon (brighter for dark) |

**Color Semantics**

- **Primary Interactive:** Warm Indigo (#6366F1 light / #818CF8 dark) — buttons, focus states, active elements
- **Success State:** Green (#22C55E light / #86EFAC dark) — completion confirmation, checkmarks
- **Neutral/Secondary:** Grays — borders, tertiary text, disabled states
- **No Error/Warning Colors in MVP:** Todoapp's simplicity means minimal error states

**Accessibility Compliance**

- Text on backgrounds: WCAG AA minimum 4.5:1 contrast
- Light mode: Warm Gray on White = 7.8:1 ✓
- Dark mode: Off-White on Deep Navy = 8.2:1 ✓
- Active task interactions clearly distinct from completed (multiple signals: color + checkmark + position)

### Typography System

**Typeface Strategy**

**Primary Font:** Inter or Segoe UI (system default)
- Modern, friendly, highly legible
- Excellent for UI with variety of weights
- Warm humanistic feel without being playful
- System fonts reduce bundle size (no custom fonts loaded)

**Fallback Chain:** Inter, Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif

**Type Scale & Hierarchy**

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **H1** | 28px | 700 (Bold) | 1.2 | Page title, if used |
| **H2** | 20px | 600 (Semibold) | 1.3 | Section headers ("Tasks", "Completed") |
| **Body** | 16px | 400 (Regular) | 1.5 | Task text, main content |
| **Small** | 14px | 400 (Regular) | 1.4 | Timestamps, helper text |
| **Input** | 16px | 400 (Regular) | 1.5 | Task input field |

**Typography Rules**

- Minimum 16px for body text on all devices (readability and mobile form input)
- 1.5 line height for all readable text (generous spacing for comfortable reading)
- No artificial letter spacing needed (natural type spacing is warm)
- Title/headings use 1.2-1.3 line height (tighter, more confident)

### Spacing & Layout Foundation

**Spacing System**

**Base Unit:** 8px (efficient and friendly)

All spacing derives from 8px multiples:
- 4px (half unit) — micro-spacing (icon margins, tight relationships)
- 8px (1x) — small spacing (input padding, small gaps)
- 16px (2x) — standard spacing (section gaps, task padding)
- 24px (3x) — generous spacing (major section separation)
- 32px (4x) — layout breathing room (vertical section gaps)

| Element | Spacing | Size |
|---------|---------|------|
| **Task Card Padding** | All sides | 16px |
| **Gap Between Tasks** | Margin bottom | 12px |
| **Section Gap** | Margin between Tasks/Completed | 32px |
| **Input Field Padding** | All sides | 12px horizontal, 10px vertical |
| **Page Padding** | Mobile/Desktop | 16px mobile, 24px desktop |

**Layout Structure**

**Mobile (< 768px):**
- Single column, full width (except 16px padding on left/right)
- Input field at bottom (floating or sticky)
- "Tasks" section stacked on top
- "Completed" section below (scrollable)
- Max-width: 100% (full viewport)

**Desktop (≥ 768px):**
- Two-column layout, side-by-side
- Left column: "Tasks" (60% width)
- Right column: "Completed" (40% width)
- Input field at top (spans both columns or full width above)
- Max-width: 1200px (centered on large screens)
- Symmetrical padding: 24px horizontal

**Component Layout**

```
Desktop Layout:
┌─────────────────────────────────────┐
│  Input Field (Full Width)           │
├──────────────────┬──────────────────┤
│                  │                  │
│  Tasks Section   │ Completed Section│
│  (60%)           │ (40%)            │
│                  │                  │
│                  │                  │
└──────────────────┴──────────────────┘

Mobile Layout:
┌──────────────────┐
│                  │
│  Tasks Section   │
│  (Full Width)    │
│                  │
├──────────────────┤
│                  │
│ Completed Section│
│  (Full Width)    │
│                  │
├──────────────────┤
│ Input Field      │
│ (Sticky/Bottom)  │
└──────────────────┘
```

**Section Visual Separation**

- "Tasks" and "Completed" sections have subtle visual hierarchy
- "Tasks" section: lighter background or positioned prominently
- "Completed" section: slightly muted (opacity 90%, or lighter background color)
- Optional: subtle divider line between sections (1px border in light/dark gray)
- Spacing between sections creates clear visual grouping

### Accessibility Considerations

**Color & Contrast**

- ✓ All text meets WCAG AA minimum contrast (4.5:1)
- ✓ Status changes communicated via multiple signals (color + checkmark + position) — not color alone
- ✓ Completed tasks visually distinct even if color-blindness present (checkmark + different position)

**Typography & Readability**

- ✓ Minimum 16px body text (comfortable on mobile, prevents auto-zoom on iOS)
- ✓ 1.5 line height for body text (accessible line spacing)
- ✓ Semantic HTML for headings (H1, H2, etc.)
- ✓ Sufficient font weight for readability (400 for body, 600+ for headings)

**Interactivity**

- ✓ Touch targets: Minimum 44x44px on mobile (task cards sized appropriately)
- ✓ Focus states: Clear visual indication when elements receive focus
- ✓ Keyboard navigation: Tab order logical, Enter submits, Delete removes
- ✓ Screen reader support: Semantic HTML, ARIA labels for interactive elements

**Motion & Animation**

- ✓ Animations under 400ms (not gratuitous)
- ✓ No flashing/strobing (all animations smooth, no rapid flicker)
- ✓ Reduced motion respected: Animation disabled for users with `prefers-reduced-motion`

---

**Visual Foundation Summary:**

Todoapp's visual design is friendly, warm, and accessible. The color palette (soft lavender, soft green, warm indigo) creates emotional resonance without excess. Typography is clean and legible. Spacing balances density and breathing room. Layout adapts gracefully from mobile single-column to desktop two-column. Every design choice supports the core emotional goal: cozy, satisfying task completion.

---

## Design Direction Decision

### Design Directions Explored

Six comprehensive design direction variations were created and evaluated:

1. **Clean & Minimal** — Minimalist sidebar approach
2. **Card Based** — Card-style design with separation
3. **Emoji & Playful** — Warm, friendly with emojis and gradients ⭐ SELECTED
4. **Dark Elegant** — Dark mode design
5. **Spacious & Airy** — Generous spacing and breathing room
6. **Compact & Dense** — Efficient space usage

### Chosen Direction

**Direction 3: Emoji & Playful with Refined Completed Task Design**

The chosen direction combines warm, approachable visual language (inspired by Notion) with intuitive interactions (inspired by Apple Reminders). The design features:

- **Friendly Visual Language** — Gradient backgrounds (lavender to green), emoji support for task icons, rounded corners
- **Playful UI** — Dashed input border with add button, warm color palette
- **Clear Status Distinction** — Active tasks in white, completed tasks with clean white background + green left border
- **High Contrast Completed Tasks** — White background (#FFFFFF) with 4px green left border (#22c55e), dark green text (#2d5a3d)
- **Emoji Integration** — Tasks can include emoji icons (optional), checkmark emoji for completed status

### Design Rationale

This direction was selected because it:

1. **Balances Warmth & Clarity** — Emotionally resonant (playful, friendly) without sacrificing clarity or simplicity
2. **Supports Core Experience** — The distinct completed task design (white + green border) makes the "satisfying completion" moment visually rewarding
3. **Maintains Accessibility** — High contrast, multiple status signals (checkmark + color + position), clear visual hierarchy
4. **Scales Across Platforms** — Works equally well on mobile (single column) and desktop (side-by-side layout)
5. **Aligns with Inspiration** — Captures Notion's warmth and personality while maintaining Reminders' intuitive simplicity

### Implementation Approach

**Color Adjustments for Completed Tasks:**

- Active task background: White (#FFFFFF)
- Completed task background: White (#FFFFFF) with left border
- Completed task left border: 4px solid Green (#22c55e)
- Completed task text: Dark Green (#2d5a3d) for high contrast
- Checkmark icon: Green emoji (✅)

**Layout Structure:**

- Mobile: Single column, input field at bottom
- Desktop: Two-column layout (Tasks 60%, Completed 40%), input field at top
- Gradient background: Spans full viewport (soft lavender to soft green)
- Sections clearly separated with visual hierarchy

**Component Details:**

- Tasks: White background, emoji icons (optional), full opacity
- Completed tasks: White background, green left border (4px), darker text, full opacity
- Input: Dashed border, enter to submit, emoji picker optional
- Animations: Bounce (300-400ms) on completion, smooth color transition, glide to completed section
