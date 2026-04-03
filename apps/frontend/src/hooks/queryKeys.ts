/**
 * Query key factory for TanStack Query
 *
 * Provides type-safe, immutable query keys with a hierarchical structure.
 * This factory prevents key mismatches and makes refactoring safe by centralizing
 * all query key definitions.
 *
 * Usage:
 * - taskKeys.all - root key for all task queries
 * - taskKeys.lists() - list query keys
 * - taskKeys.list(filters) - filtered list queries
 * - taskKeys.details() - detail query keys
 * - taskKeys.detail(id) - single task queries
 */
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: number) => [...taskKeys.details(), id] as const,
} as const;
