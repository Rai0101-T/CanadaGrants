import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grant } from "@shared/schema";
import GrantCard from "@/components/grant-card";
import GrantCarousel from "@/components/grant-carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PrivateGrants() {
  const [filters, setFilters] = useState({
    department: "",
    industry: "",
    grantAmount: "",
    deadline: "",
  });
  
  // Fetch all private grants
  const { data: grants, isLoading, isError } = useQuery<Grant[]>({
    queryKey: ["/api/grants/type/private"],
  });
  
  // Apply all filters to grants
  const filteredGrants = useMemo(() => {
    if (!grants) return [];
    
    return grants.filter(grant => {
      // Department filter
      if (filters.department && filters.department !== "all_departments" && 
          grant.category.toLowerCase() !== filters.department.toLowerCase()) {
        return false;
      }
      
      // Industry filter
      if (filters.industry && filters.industry !== "all_industries" && 
          !grant.industry?.toLowerCase().includes(filters.industry.toLowerCase())) {
        return false;
      }
      
      // Grant amount filter
      if (filters.grantAmount && filters.grantAmount !== "any_amount") {
        const amount = parseInt(grant.fundingAmount.replace(/[^0-9]/g, ''));
        
        switch (filters.grantAmount) {
          case "under_10k":
            if (amount >= 10000) return false;
            break;
          case "10k_50k":
            if (amount < 10000 || amount >= 50000) return false;
            break;
          case "50k_100k":
            if (amount < 50000 || amount >= 100000) return false;
            break;
          case "100k_500k":
            if (amount < 100000 || amount >= 500000) return false;
            break;
          case "over_500k":
            if (amount < 500000) return false;
            break;
        }
      }
      
      // Deadline filter
      if (filters.deadline && filters.deadline !== "any_deadline") {
        const deadlineDate = new Date(grant.deadline);
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        const sixtyDaysFromNow = new Date();
        sixtyDaysFromNow.setDate(today.getDate() + 60);
        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(today.getDate() + 90);
        const endOfYear = new Date(today.getFullYear(), 11, 31);
        
        switch (filters.deadline) {
          case "ongoing":
            if (grant.deadline !== "Ongoing" && grant.deadline !== "No Deadline") return false;
            break;
          case "30_days":
            if (deadlineDate > thirtyDaysFromNow) return false;
            break;
          case "60_days":
            if (deadlineDate > sixtyDaysFromNow) return false;
            break;
          case "90_days":
            if (deadlineDate > ninetyDaysFromNow) return false;
            break;
          case "this_year":
            if (deadlineDate > endOfYear) return false;
            break;
        }
      }
      
      return true;
    });
  }, [grants, filters]);
  
  // We've simplified the page to only show all private grants

  return (
    <div className="bg-black text-white min-h-screen pt-24 px-4 pb-16">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Private Grants</h1>
          <p className="text-gray-400 max-w-3xl">
            Discover foundation and corporate funding opportunities across Canada. These grants are provided by private organizations, foundations, and corporations to support various projects, businesses, and initiatives.
          </p>
          
          <div className="mt-6 mb-6">
            <div className={`flex flex-col md:flex-row gap-3 mb-4`}>
              {/* Organization Filter */}
              <div className="w-full md:w-1/4">
                <Select
                  value={filters.department}
                  onValueChange={(value) => setFilters({...filters, department: value})}
                >
                  <SelectTrigger className="bg-black bg-opacity-70 text-white border border-gray-600 focus:border-primary">
                    <SelectValue placeholder="Organization" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white border-gray-700">
                    <SelectItem value="all_departments">All Organizations</SelectItem>
                    <SelectItem value="rogers">Rogers Foundation</SelectItem>
                    <SelectItem value="bell">Bell Let's Talk Fund</SelectItem>
                    <SelectItem value="td">TD Friends of the Environment</SelectItem>
                    <SelectItem value="rbc">RBC Foundation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Industry Filter */}
              <div className="w-full md:w-1/4">
                <Select 
                  value={filters.industry}
                  onValueChange={(value) => setFilters({...filters, industry: value})}
                >
                  <SelectTrigger className="bg-black bg-opacity-70 text-white border border-gray-600 focus:border-primary">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white border-gray-700">
                    <SelectItem value="all_industries">All Industries</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="social">Social Initiatives</SelectItem>
                    <SelectItem value="arts">Arts & Culture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Grant Amount Filter */}
              <div className="w-full md:w-1/4">
                <Select
                  value={filters.grantAmount}
                  onValueChange={(value) => setFilters({...filters, grantAmount: value})}
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
              
              {/* Deadline Filter */}
              <div className="w-full md:w-1/4">
                <Select
                  value={filters.deadline}
                  onValueChange={(value) => setFilters({...filters, deadline: value})}
                >
                  <SelectTrigger className="bg-black bg-opacity-70 text-white border border-gray-600 focus:border-primary">
                    <SelectValue placeholder="Application Deadline" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white border-gray-700">
                    <SelectItem value="any_deadline">Any Deadline</SelectItem>
                    <SelectItem value="ongoing">Ongoing/No Deadline</SelectItem>
                    <SelectItem value="30_days">Within 30 Days</SelectItem>
                    <SelectItem value="60_days">Within 60 Days</SelectItem>
                    <SelectItem value="90_days">Within 90 Days</SelectItem>
                    <SelectItem value="this_year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500">
            Error loading private grants. Please try again later.
          </div>
        ) : filteredGrants.length > 0 ? (
          <div className="space-y-12">
            {/* All Private Grants */}
            <div>
              <h2 className="text-2xl font-bold mb-4">All Private Grants</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredGrants.map((grant) => (
                  <GrantCard key={grant.id} grant={grant} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            No private grants found matching your filter criteria. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
}