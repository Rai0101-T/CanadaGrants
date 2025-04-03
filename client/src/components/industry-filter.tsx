import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface IndustryFilterProps {
  onFilterChange: (industry: string) => void;
  className?: string;
}

export default function IndustryFilter({ onFilterChange, className }: IndustryFilterProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  
  // List of common industries for grant categories
  const industries = [
    "All",
    "Technology",
    "Healthcare",
    "Education",
    "Environment",
    "Agriculture",
    "Manufacturing",
    "Infrastructure",
    "Energy",
    "Arts & Culture",
    "Social Services",
    "Research",
    "Small Business"
  ];
  
  // Trigger the filter change effect when selected industry changes
  useEffect(() => {
    onFilterChange(selectedIndustry === "All" ? "" : selectedIndustry);
  }, [selectedIndustry, onFilterChange]);
  
  return (
    <div className={cn("flex flex-wrap items-center gap-2 md:gap-4 pb-1", className)}>
      {industries.map((industry) => (
        <button
          key={industry}
          onClick={() => setSelectedIndustry(industry)}
          className={cn(
            "px-3 md:px-5 py-1 rounded whitespace-nowrap text-sm md:text-base font-medium transition-colors",
            selectedIndustry === industry
              ? "bg-primary text-white"
              : "bg-transparent text-gray-400 hover:text-white hover:bg-[#333]"
          )}
        >
          {industry}
        </button>
      ))}
    </div>
  );
}