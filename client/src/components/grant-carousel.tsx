import { useState, useEffect } from "react";
import { Grant } from "@shared/schema";
import { Button } from "@/components/ui/button";
import GrantCard from "@/components/grant-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GrantCarouselProps {
  title: string;
  grants: Grant[];
  className?: string;
}

export default function GrantCarousel({ title, grants, className }: GrantCarouselProps) {
  const [visibleGrants, setVisibleGrants] = useState<Grant[]>([]);
  const [itemsPerView, setItemsPerView] = useState(4);
  
  // Determine how many items to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(1);
      } else if (width < 768) {
        setItemsPerView(2);
      } else if (width < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Update visible grants when grants change
  useEffect(() => {
    setVisibleGrants(grants);
  }, [grants]);
  
  // If no grants to display, return null
  if (!visibleGrants.length) {
    return null;
  }
  
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      <Carousel
        opts={{
          align: "start",
          loop: grants.length > itemsPerView,
        }}
        className="w-full"
      >
        <CarouselContent>
          {visibleGrants.map((grant) => (
            <CarouselItem key={grant.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <GrantCard grant={grant} />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious 
          className="left-2 bg-[#333]/80 hover:bg-[#444]/80 border-none text-white"
        />
        <CarouselNext 
          className="right-2 bg-[#333]/80 hover:bg-[#444]/80 border-none text-white"
        />
      </Carousel>
    </div>
  );
}