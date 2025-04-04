import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Custom hook to automatically scroll to top when navigating between pages,
 * unless navigating to specific sections on the About Us page
 */
export function useScrollTop() {
  const [location] = useLocation();

  useEffect(() => {
    // If navigating to specific sections on the About Us page
    if (location.includes('#')) {
      // Give a small delay to ensure the DOM is fully loaded
      setTimeout(() => {
        const sectionId = location.split('#')[1];
        const element = document.getElementById(sectionId);
        if (element) {
          // Scroll to the element with smooth behavior
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    // For all other navigation, scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location]);

  return null;
}