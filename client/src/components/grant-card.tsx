import { Link } from "wouter";
import { Grant } from "@shared/schema";
import { Clock, DollarSign } from "lucide-react";

interface GrantCardProps {
  grant: Grant;
}

export default function GrantCard({ grant }: GrantCardProps) {
  return (
    <Link href={`/grant/${grant.id}`}>
      <a className="netflix-card block cursor-pointer h-full">
        <div className="relative">
          <img 
            src={grant.imageUrl} 
            alt={grant.title} 
            className="w-full h-40 object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-bold text-lg">{grant.title}</h3>
            <span className={`text-xs font-bold px-2 py-1 rounded ${
              grant.type === 'federal' 
                ? 'bg-green-600 text-white' 
                : 'bg-yellow-400 text-black'
            }`}>
              {grant.type === 'federal' ? 'Federal' : 'Provincial'}
            </span>
          </div>
          <p className="text-sm mb-3 text-gray-300 line-clamp-2">
            {grant.description}
          </p>
          <div className="flex justify-between text-sm text-gray-400">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" /> {grant.deadline}
            </span>
            <span className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" /> {grant.fundingAmount}
            </span>
          </div>
        </div>
      </a>
    </Link>
  );
}
