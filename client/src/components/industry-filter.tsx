import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IndustryFilterProps {
  onFilterChange: (industry: string) => void;
  className?: string;
  type?: "buttons" | "dropdown";
}

export default function IndustryFilter({ 
  onFilterChange, 
  className,
  type = "buttons" 
}: IndustryFilterProps) {
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
    "Science",
    "Small Business"
  ];
  
  // Trigger the filter change effect when selected industry changes
  useEffect(() => {
    onFilterChange(selectedIndustry === "All" ? "" : selectedIndustry);
  }, [selectedIndustry, onFilterChange]);
  
  const handleSelectChange = (value: string) => {
    setSelectedIndustry(value);
  };
  
  // Render as buttons (original style)
  if (type === "buttons") {
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
  
  // Render as dropdown
  return (
    <div className={cn("w-full max-w-xs", className)}>
      <label className="block text-sm font-medium text-gray-200 mb-2">
        Filter by Industry
      </label>
      <Select value={selectedIndustry} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white focus:ring-primary">
          <SelectValue placeholder="Select Industry" />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700 text-white">
          {industries.map((industry) => (
            <SelectItem key={industry} value={industry} className="focus:bg-gray-800 focus:text-white">
              {industry}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}