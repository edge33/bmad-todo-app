# Cursor Rules for todoapp

This directory contains AI agent implementation guidelines for the todoapp project. These rules ensure consistency, quality, and alignment across all code written by AI agents or developers.

## Files

### 1. AGENTS.md (758 lines)

**Primary reference for AI agents and developers**

Contains:
- Quick reference core principles
- Complete naming conventions (database, API, code)
- API response format specifications
- File organization and structure
- State management patterns (TanStack Query)
- Error handling patterns
- Performance targets (NFR validation)
- Accessibility requirements (WCAG AA)
- Type safety guidelines
- Development workflow
- Common pattern templates

**Use this file:**
- Before starting implementation on any story
- When unsure about naming conventions
- As reference for code patterns
- For performance and accessibility requirements

### 2. COMMON-MISTAKES.md (493 lines)

**Common implementation errors and how to avoid them**

Contains:
- 15 critical/common mistakes with examples
- What's wrong vs what's right for each
- Why the mistake matters
- Complete validation checklist

**Use this file:**
- During code review
- Before marking stories complete
- When debugging unexpected issues
- To understand constraints

## Quick Start

### For First Story

1. Read **AGENTS.md** sections:
   - "Quick Reference: Core Principles"
   - "Naming Conventions"
   - "File Organization"

2. Review the template in **AGENTS.md** for your story type:
   - "Backend API Story"
   - "Frontend Component Story"
   - "React Hook Story"

3. Reference **AGENTS.md** as needed during implementation

### For Code Review

1. Use **COMMON-MISTAKES.md** validation checklist
2. Check naming conventions in **AGENTS.md**
3. Verify patterns match story type template

### When Stuck

1. Search **AGENTS.md** for your topic
2. Check **COMMON-MISTAKES.md** for similar pattern
3. Review related code in existing stories
4. Reference architecture.md in parent directory

## Key Principles

These rules enforce these core project principles:

1. **Type Safety First** — All data structures use shared types from `@shared-types`
2. **Simplicity** — When in doubt, choose the simpler solution
3. **Performance-First** — Every decision validated against <100ms, <1s, <100KB targets
4. **Optimistic UX** — User feedback is immediate; API calls happen in background
5. **No Over-Engineering** — Low complexity is intentional and valued

## Integration with Cursor

Cursor automatically reads files in `.cursor/rules/` to provide context to AI agents. These files:

- Are read by Claude when you @mention "rules" or ask for guidance
- Provide project-specific patterns and conventions
- Ensure consistency across all AI-generated code
- Support code review and validation

## Usage in Development

### Before Starting a Story

```
@rules: Show me the naming conventions for this project
@rules: What's the pattern for React hooks?
@rules: How should I organize this component?
```

### During Implementation

```
@rules: Is this the correct error handling pattern?
@rules: Should this be in hooks/ or services/?
@rules: What's the TanStack Query pattern for mutations?
```

### Before Submitting

```
@rules: Run the validation checklist for my implementation
@rules: Check my code against common mistakes
@rules: Verify my naming conventions
```

## Updating Rules

When patterns change or new patterns emerge:

1. Update the relevant section in AGENTS.md
2. Add new mistakes to COMMON-MISTAKES.md if needed
3. Update templates if implementation approach changes
4. Commit changes so future stories use updated patterns

## File Structure

```
.cursor/
├── rules/
│   ├── README.md                  # This file
│   ├── AGENTS.md                  # Primary implementation guide
│   └── COMMON-MISTAKES.md         # Common errors and fixes
└── skills/                        # (Other Cursor skills)
```

## Related Documents

These rules reference and enforce patterns from:

- **architecture.md** — Technical architecture and design decisions
- **epics.md** — Work breakdown and user stories
- **prd.md** — Product requirements
- **ux-design-specification.md** — UX patterns and design

All of these documents are aligned with these rules to ensure consistency.

## Questions?

If a question isn't answered in these files:

1. Check **architecture.md** for design decisions
2. Check **epics.md** for story-specific requirements
3. Check existing code in the same directory
4. Ask for clarification in the story comment

---

**Last Updated:** 2026-04-02  
**Created from:** Architecture Document v1.0  
**Coverage:** Naming, Patterns, Performance, Accessibility, Type Safety