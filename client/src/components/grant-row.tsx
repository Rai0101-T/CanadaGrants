import { useRef, useState } from "react";
import { Grant } from "@shared/schema";
import GrantCard from "@/components/grant-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GrantRowProps {
  grants: Grant[];
}

export default function GrantRow({ grants }: GrantRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    const container = rowRef.current;
    if (!container) return;

    const scrollAmount = direction === 'left' 
      ? -container.clientWidth * 0.75 
      : container.clientWidth * 0.75;
    
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const container = rowRef.current;
    if (!container) return;

    // Show left arrow if scrolled to the right
    setShowLeftArrow(container.scrollLeft > 0);
    
    // Hide right arrow if scrolled to the end
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
    setShowRightArrow(!isAtEnd);
  };

  if (grants.length === 0) {
    return <div className="text-center py-4 text-gray-400">No grants available</div>;
  }

  return (
    <div className="relative group">
      {showLeftArrow && (
        <button 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 z-10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      
      <div 
        ref={rowRef}
        className="category-row"
        onScroll={handleScroll}
      >
        {grants.map(grant => (
          <div key={grant.id} className="flex-shrink-0 w-72 md:w-80">
            <GrantCard grant={grant} />
          </div>
        ))}
      </div>
      
      {showRightArrow && (
        <button 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 z-10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
