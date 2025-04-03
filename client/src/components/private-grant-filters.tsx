import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PrivateGrantFiltersProps {
  onFilterChange: (filters: {
    organization: string;
    industry: string;
    grantAmount: string;
    deadline: string;
  }) => void;
  className?: string;
}

export default function PrivateGrantFilters({
  onFilterChange,
  className = "",
}: PrivateGrantFiltersProps) {
  const [filters, setFilters] = useState({
    organization: "all_organizations",
    industry: "all_industries",
    grantAmount: "any_amount",
    deadline: "any_deadline",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className={`flex flex-col md:flex-row gap-3 ${className}`}>
      {/* Organization Filter */}
      <div className="w-full md:w-1/4">
        <Select
          value={filters.organization}
          onValueChange={(value) => handleFilterChange("organization", value)}
        >
          <SelectTrigger className="bg-black bg-opacity-70 text-white border border-gray-600 focus:border-primary">
            <SelectValue placeholder="Organization" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white border-gray-700">
            <SelectItem value="all_organizations">All Organizations</SelectItem>
            <SelectItem value="rogers">Rogers Communications</SelectItem>
            <SelectItem value="td">TD Bank Group</SelectItem>
            <SelectItem value="shopify">Shopify Inc.</SelectItem>
            <SelectItem value="rbc">Royal Bank of Canada</SelectItem>
            <SelectItem value="desjardins">Desjardins Group</SelectItem>
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
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="environment">Environment</SelectItem>
            <SelectItem value="e-commerce">E-commerce</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="social">Social Enterprise</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="fintech">Financial Technology</SelectItem>
            <SelectItem value="agriculture">Agriculture</SelectItem>
            <SelectItem value="energy">Energy</SelectItem>
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