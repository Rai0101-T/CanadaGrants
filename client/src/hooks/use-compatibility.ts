import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Grant } from "@shared/schema";

export interface CompatibilityResult {
  score: number;           // 0-100 compatibility score
  reasoning: string;       // Short explanation of the score
  strengths: string[];     // Matching aspects between business and grant
  weaknesses: string[];    // Mismatched aspects
  improvementTips: string[]; // Suggestions to improve compatibility
}

export interface CompatibilityResponse {
  grant: Grant;
  compatibility: CompatibilityResult;
}

export function useCompatibility() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const calculateCompatibility = async (grantId: number) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      const response = await apiRequest("POST", `/api/grants/compatibility/${grantId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to calculate compatibility: ${response.statusText}`);
      }
      
      const data: CompatibilityResponse = await response.json();
      
      setCompatibilityResult(data.compatibility);
      
      return data.compatibility;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Compatibility Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    calculateCompatibility,
    compatibilityResult,
    isAnalyzing,
    error,
  };
}