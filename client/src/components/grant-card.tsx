import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Grant } from "@shared/schema";
import { Clock, DollarSign, Building2, MapPin, MonitorSmartphone, Banknote } from "lucide-react";

interface GrantCardProps {
  grant: Grant;
}

export default function GrantCard({ grant }: GrantCardProps) {
  const [_, navigate] = useLocation();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState(grant.imageUrl);
  const isMounted = useRef(true);
  
  // Handle component unmounting
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle image loading issues
  useEffect(() => {
    // Reset states when grant changes
    setImageError(false);
    setImageLoaded(false);
    setImageUrl(grant.imageUrl);
    
    // No need to check image if it doesn't exist
    if (!grant.imageUrl) {
      setImageError(true);
      return;
    }
    
    // Simple way to check if image loads correctly
    const checkImage = () => {
      // Create a temporary hidden image element to test loading
      const tempImg = document.createElement('img');
      
      tempImg.onload = () => {
        if (isMounted.current) {
          setImageLoaded(true);
        }
      };
      
      tempImg.onerror = () => {
        if (isMounted.current) {
          setImageError(true);
        }
      };
      
      tempImg.src = grant.imageUrl;
    };
    
    checkImage();
  }, [grant.id, grant.imageUrl]);

  // Generate a color gradient based on grant type
  const getPlaceholderGradient = () => {
    switch (grant.type) {
      case 'federal':
        return 'bg-gradient-to-br from-red-900 to-red-600';
      case 'provincial':
        return 'bg-gradient-to-br from-blue-900 to-blue-600';
      case 'private':
        return 'bg-gradient-to-br from-purple-900 to-purple-600';
      default:
        return 'bg-gradient-to-br from-gray-800 to-gray-600';
    }
  };

  // Get icons based on grant data
  const getPlaceholderIcon = () => {
    // Check for industry first
    if (grant.industry) {
      const industryLower = grant.industry.toLowerCase();
      if (industryLower.includes('tech')) return <MonitorSmartphone className="h-10 w-10 opacity-60" />;
      if (industryLower.includes('financ') || industryLower.includes('bank')) return <Banknote className="h-10 w-10 opacity-60" />;
    }
    
    // Then check for provinces
    if (grant.province && grant.province !== 'All') {
      return <MapPin className="h-10 w-10 opacity-60" />;
    }
    
    // Default to building icon
    return <Building2 className="h-10 w-10 opacity-60" />;
  };

  // Generate badge color based on grant type
  const getBadgeStyles = () => {
    switch (grant.type) {
      case 'federal':
        return 'bg-green-600 text-white';
      case 'provincial':
        return 'bg-blue-500 text-white';
      case 'private':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div 
      className="netflix-card block cursor-pointer h-full transition-transform duration-200 hover:scale-105 bg-black bg-opacity-80 rounded-md overflow-hidden border border-gray-800"
      onClick={() => navigate(`/grants/${grant.id}`)}
    >
      <div className="relative">
        {/* Show placeholder during loading or if error occurs */}
        {(!imageLoaded || imageError) && (
          <div className={`w-full h-40 flex items-center justify-center ${getPlaceholderGradient()}`}>
            <div className="flex flex-col items-center text-white">
              {getPlaceholderIcon()}
              <div className="text-sm font-medium mt-2 max-w-[80%] text-center truncate">
                {grant.title}
              </div>
            </div>
          </div>
        )}
        
        {/* Actual image with error handling */}
        {!imageError && (
          <img 
            src={imageUrl} 
            alt={grant.title} 
            className={`w-full h-40 object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        )}
        
        {/* Add overlay gradient for better text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent"></div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white font-bold text-lg line-clamp-1" title={grant.title}>{grant.title}</h3>
          <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2 ${getBadgeStyles()}`}>
            {grant.type.charAt(0).toUpperCase() + grant.type.slice(1)}
          </span>
        </div>
        
        <p className="text-sm mb-3 text-gray-300 line-clamp-2">
          {grant.description}
        </p>
        
        <div className="flex justify-between text-sm text-gray-400">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1 flex-shrink-0" /> 
            <span className="truncate">{grant.deadline}</span>
          </span>
          <span className="flex items-center ml-2">
            <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" /> 
            <span className="truncate">{grant.fundingAmount}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
