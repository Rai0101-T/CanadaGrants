import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Smoothly scrolls to a specific section by ID with header offset
 * @param sectionId The ID of the section to scroll to
 * @param headerOffset Offset to account for fixed header (default: 100px)
 */
export function smoothScrollToSection(sectionId: string, headerOffset = 100): void {
  setTimeout(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, 300); // Delay to ensure DOM is ready
}

// Format currency (e.g. $1,000)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0
  }).format(amount);
}

// Format date (e.g. Jan 1, 2023)
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Check if a value is a valid number
export function isValidNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

// Debounce function for search inputs
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

// Filter array by search term
export function filterBySearchTerm<T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  keys: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return items;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return items.filter(item => {
    return keys.some(key => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerSearchTerm);
      }
      return false;
    });
  });
}

// Parse funding amount from string (e.g. "$1M - $5M" => 1000000)
export function parseFundingAmount(fundingAmount: string): number {
  if (!fundingAmount) return 0;
  
  // Find the first number with potential K/M suffix in the string
  const match = fundingAmount.match(/\$?(\d+(?:\.\d+)?)\s*([KMB])?/i);
  if (!match) return 0;
  
  const [, numStr, suffix] = match;
  let num = parseFloat(numStr);
  
  // Convert based on suffix
  if (suffix && suffix.toUpperCase() === 'K') {
    num *= 1000;
  } else if (suffix && suffix.toUpperCase() === 'M') {
    num *= 1000000;
  } else if (suffix && suffix.toUpperCase() === 'B') {
    num *= 1000000000;
  }
  
  return num;
}
