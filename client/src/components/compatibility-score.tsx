import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useCompatibility, CompatibilityResult } from "@/hooks/use-compatibility";
import { Loader2, Target, ThumbsUp, ThumbsDown, Info, Lightbulb } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";

interface CompatibilityScoreProps {
  grantId: number;
}

export function CompatibilityScore({ grantId }: CompatibilityScoreProps) {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { calculateCompatibility, compatibilityResult, isAnalyzing } = useCompatibility();
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculateCompatibility = () => {
    calculateCompatibility(grantId);
    setHasCalculated(true);
  };

  // If user is not logged in, show sign in message
  if (!user) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333333]">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 text-primary mr-2" />
          Grant Compatibility
        </h3>
        <p className="text-gray-300 mb-4">Sign in to see how compatible this grant is with your business profile.</p>
        <Button 
          variant="outline" 
          className="w-full border-white/20 hover:bg-white/10"
          onClick={() => navigate("/auth")}
        >
          Sign In
        </Button>
      </div>
    );
  }

  // If user doesn't have a complete business profile
  if (user && (!user.businessName || !user.industry || !user.businessDescription)) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333333]">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 text-primary mr-2" />
          Grant Compatibility
        </h3>
        <p className="text-gray-300 mb-4">Complete your business profile to check your compatibility with this grant.</p>
        <Button 
          variant="outline" 
          className="w-full border-white/20 hover:bg-white/10"
          // This would navigate to a profile edit page
          onClick={() => navigate("/profile")}
        >
          Update Profile
        </Button>
      </div>
    );
  }

  // Before calculation
  if (!hasCalculated) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333333]">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 text-primary mr-2" />
          Grant Compatibility
        </h3>
        <p className="text-gray-300 mb-4">Find out how well this grant matches your business profile.</p>
        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleCalculateCompatibility}
        >
          Check Compatibility
        </Button>
      </div>
    );
  }

  // During analysis
  if (isAnalyzing) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333333]">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 text-primary mr-2" />
          Grant Compatibility
        </h3>
        <div className="flex flex-col items-center justify-center py-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-gray-300">Analyzing compatibility...</p>
        </div>
      </div>
    );
  }

  // After calculation, with results
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333333]">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Target className="h-5 w-5 text-primary mr-2" />
        Grant Compatibility
      </h3>
      
      {compatibilityResult ? (
        <CompatibilityDetails result={compatibilityResult} />
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-300 mb-4">Sorry, we couldn't calculate your compatibility score. Please try again.</p>
          <Button 
            variant="outline" 
            className="border-white/20 hover:bg-white/10"
            onClick={handleCalculateCompatibility}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}

function CompatibilityDetails({ result }: { result: CompatibilityResult }) {
  // Determine the color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };
  
  // Determine the progress color based on score
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-4">
      {/* Score display */}
      <div className="text-center">
        <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
          {result.score}%
        </div>
        <Progress 
          value={result.score} 
          className="h-2 mt-3 mb-2 bg-gray-700"
          indicatorClassName={getProgressColor(result.score)}
        />
        <p className="text-gray-300 mt-2">{result.reasoning}</p>
      </div>
      
      {/* Detailed analysis accordions */}
      <Accordion type="single" collapsible className="mt-6">
        <AccordionItem value="strengths" className="border-[#333333]">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center text-left">
              <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
              <span className="font-semibold text-white">Strengths</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 text-gray-300">
              {result.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                  </div>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="weaknesses" className="border-[#333333]">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center text-left">
              <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
              <span className="font-semibold text-white">Areas of Concern</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 text-gray-300">
              {result.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-red-400"></span>
                  </div>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="tips" className="border-[#333333]">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center text-left">
              <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
              <span className="font-semibold text-white">Improvement Tips</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 text-gray-300">
              {result.improvementTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                  </div>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="pt-2">
        <p className="text-xs text-gray-400 italic flex items-center">
          <Info className="h-3 w-3 mr-1" />
          AI-powered analysis based on your business profile
        </p>
      </div>
    </div>
  );
}