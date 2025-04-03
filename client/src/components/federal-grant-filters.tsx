import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FederalGrantFiltersProps {
  onFilterChange: (filters: {
    department: string;
    industry: string;
    grantAmount: string;
    deadline: string;
  }) => void;
  className?: string;
}

export default function FederalGrantFilters({
  onFilterChange,
  className = "",
}: FederalGrantFiltersProps) {
  const [filters, setFilters] = useState({
    department: "",
    industry: "",
    grantAmount: "",
    deadline: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className={`flex flex-col md:flex-row gap-3 ${className}`}>
      {/* Department Filter */}
      <div className="w-full md:w-1/4">
        <Select
          value={filters.department}
          onValueChange={(value) => handleFilterChange("department", value)}
        >
          <SelectTrigger className="bg-black bg-opacity-70 text-white border border-gray-600 focus:border-primary">
            <SelectValue placeholder="Department/Agency" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white border-gray-700">
            <SelectItem value="all_departments">All Departments</SelectItem>
            <SelectItem value="innovation_canada">Innovation, Science and Economic Development Canada</SelectItem>
            <SelectItem value="nrc">National Research Council Canada</SelectItem>
            <SelectItem value="agriculture_canada">Agriculture and Agri-Food Canada</SelectItem>
            <SelectItem value="environment_canada">Environment and Climate Change Canada</SelectItem>
            <SelectItem value="global_affairs">Global Affairs Canada</SelectItem>
            <SelectItem value="health_canada">Health Canada</SelectItem>
            <SelectItem value="transportation">Transport Canada</SelectItem>
            <SelectItem value="heritage_canada">Canadian Heritage</SelectItem>
            <SelectItem value="natural_resources">Natural Resources Canada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Industry Filter */}
      <div className="w-full md:w-1/4">
        <Select
          value={filters.industry}
          onValueChange={(value) => handleFilterChange("industry", value)}
        >
          <SelectTrigger className="bg-black bg-opacity-70 text-white border border-gray-600 focus:border-primary">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white border-gray-700">
            <SelectItem value="all_industries">All Industries</SelectItem>
            <SelectItem value="agriculture">Agriculture</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="energy">Energy</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="tourism">Tourism</SelectItem>
            <SelectItem value="construction">Construction</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grant Amount Filter */}
      <div className="w-full md:w-1/4">
        <Select
          value={filters.grantAmount}
          onValueChange={(value) => handleFilterChange("grantAmount", value)}
        >
          <SelectTrigger className="bg-black bg-opacity-70 text-white border border-gray-600 focus:border-primary">
            <SelectValue placeholder="Grant Amount" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white border-gray-700">
            <SelectItem value="any_amount">Any Amount</SelectItem>
            <SelectItem value="under_10k">Under $10,000</SelectItem>
            <SelectItem value="10k_50k">$10,000 - $50,000</SelectItem>
            <SelectItem value="50k_100k">$50,000 - $100,000</SelectItem>
            <SelectItem value="100k_500k">$100,000 - $500,000</SelectItem>
            <SelectItem value="over_500k">Over $500,000</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Application Deadline Filter */}
      <div className="w-full md:w-1/4">
        <Select
          value={filters.deadline}
          onValueChange={(value) => handleFilterChange("deadline", value)}
        >
          <SelectTrigger className="bg-black bg-opacity-70 text-white border border-gray-600 focus:border-primary">
            <SelectValue placeholder="Application Deadline" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white border-gray-700">
            <SelectItem value="any_deadline">Any Deadline</SelectItem>
            <SelectItem value="ongoing">Ongoing/No Deadline</SelectItem>
            <SelectItem value="30_days">Next 30 Days</SelectItem>
            <SelectItem value="60_days">Next 60 Days</SelectItem>
            <SelectItem value="90_days">Next 90 Days</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}