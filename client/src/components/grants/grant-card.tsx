import { Link } from "wouter";
import { Grant } from "@shared/schema";
import { CalendarDays, MapPin, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GrantCardProps {
  grant: Grant;
  showLessInfo?: boolean;
}

export default function GrantCard({ grant, showLessInfo = false }: GrantCardProps) {
  // Function to capitalize first letter of each word
  const capitalize = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Determine grant type styling
  const typeColors = {
    federal: "bg-blue-900/60 text-blue-300",
    provincial: "bg-green-900/60 text-green-300",
    private: "bg-purple-900/60 text-purple-300",
  };

  return (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300 h-full flex flex-col">
      <div 
        className="h-40 bg-cover bg-center" 
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url(${grant.imageUrl || 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=500&h=280&q=80'})` 
        }}
      >
        <div className="p-3 flex justify-between items-start h-full">
          <Badge className={`${typeColors[grant.type]} font-medium`}>
            {capitalize(grant.type)}
          </Badge>
          
          {grant.featured && (
            <Badge variant="outline" className="bg-black/60 border-yellow-500 text-yellow-500">
              Featured
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2 h-14">
          {grant.title}
        </CardTitle>
        {!showLessInfo && (
          <CardDescription className="line-clamp-2 h-10 text-gray-400">
            {grant.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pb-3 flex-grow">
        <div className="space-y-2 text-sm">
          {grant.fundingAmount && (
            <div className="flex items-center text-gray-400">
              <DollarSign className="h-4 w-4 mr-2 text-primary" />
              <span>{grant.fundingAmount}</span>
            </div>
          )}
          
          {grant.deadline && (
            <div className="flex items-center text-gray-400">
              <CalendarDays className="h-4 w-4 mr-2 text-primary" />
              <span>Deadline: {grant.deadline}</span>
            </div>
          )}
          
          {grant.province && (
            <div className="flex items-center text-gray-400">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>{grant.province}</span>
            </div>
          )}
          
          {grant.industry && (
            <div className="flex items-center text-gray-400">
              <Briefcase className="h-4 w-4 mr-2 text-primary" />
              <span>{grant.industry}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pb-4 pt-0">
        <Link href={`/grant/${grant.id}`}>
          <Button variant="netflix" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}