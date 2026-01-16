/**
 * Utility function to merge Tailwind CSS classes
 * Handles conditional classes and deduplication
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

