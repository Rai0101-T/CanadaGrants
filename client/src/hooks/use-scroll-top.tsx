import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { smoothScrollToSection } from '@/lib/utils';

/**
 * Custom hook to automatically scroll to top when navigating between pages,
 * unless navigating to specific sections on the About Us page
 */
export function useScrollTop() {
  const [location] = useLocation();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Case 1: Anchor links to About Us page sections
    if (location.startsWith('/about-us#')) {
      const sectionId = location.split('#')[1];
      smoothScrollToSection(sectionId);
      return;
    }
    
    // Case 2: Normal navigation - scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location]);
  
  // Add a global click handler for footer anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Check if the clicked element is one of our special anchor links
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor) {
        // Case 1: Check for class identifier (special-anchor class)
        if (anchor.classList.contains('special-anchor')) {
          e.preventDefault();
          
          // Try to get section ID from data attribute first
          const sectionId = anchor.getAttribute('data-section') || '';
          if (sectionId) {
            smoothScrollToSection(sectionId);
            return;
          }
          
          // Fallback to href if data-section is not available
          const href = anchor.getAttribute('href');
          if (href && href.startsWith('#')) {
            const idFromHref = href.substring(1);
            smoothScrollToSection(idFromHref);
          }
        }
        
        // Case 2: Check for specific known anchor links
        const href = anchor.getAttribute('href');
        if (href && href.match(/^#(how-it-works|faq|contact-us)$/)) {
          e.preventDefault();
          const sectionId = href.substring(1);
          smoothScrollToSection(sectionId);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return null;
}