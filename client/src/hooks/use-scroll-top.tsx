import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Custom hook to automatically scroll to top when navigating between pages,
 * unless navigating to specific sections on the About Us page
 */
export function useScrollTop() {
  const [location] = useLocation();

  useEffect(() => {
    // If navigating to the About Us page with a hash
    if (location.startsWith('/about-us#')) {
      // Extract the ID from the hash
      const sectionId = location.split('#')[1];
      
      // Give the DOM time to render completely
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          // Calculate header offset (fixed header height)
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          // Scroll to the element with smooth behavior and offset
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
      
      return;
    }

    // For all other navigation, scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location]);

  return null;
}