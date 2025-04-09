import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Grant } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileCheck, Lightbulb, BrainCircuit, AlertCircle, CheckCircle2, Wand2 } from "lucide-react";

export default function GrantScribe() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("apply");
  
  // Grant application assistance form
  const [selectedGrantId, setSelectedGrantId] = useState<number | "">("");
  const [applicationText, setApplicationText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [improvedText, setImprovedText] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);
  
  // Plagiarism check form
  const [textToCheck, setTextToCheck] = useState("");
  const [plagiarismResult, setPlagiarismResult] = useState<any | null>(null);
  
  // Ideas generation form
  const [selectedIdeaGrantId, setSelectedIdeaGrantId] = useState<number | "">("");
  const [projectType, setProjectType] = useState("");
  const [keywords, setKeywords] = useState("");
  const [ideas, setIdeas] = useState<any | null>(null);
  
  // Fetch all grants for select dropdowns
  const { data: grants, isLoading: isLoadingGrants } = useQuery<Grant[]>({
    queryKey: ["/api/grants"],
  });
  
  // Mutation for application assistance
  const assistMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/grantscribe/assist", {
        grantId: selectedGrantId,
        applicationText
      });
    },
    onSuccess: (data: any) => {
      setFeedback(data.feedback);
      setImprovedText(data.improvedText);
      setOriginalText(data.originalText);
      toast({
        title: "Analysis Complete",
        description: "Your grant application has been analyzed by GrantScribe."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze your application. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Mutation for plagiarism check
  const plagiarismMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/grantscribe/plagiarism-check", {
        text: textToCheck
      });
    },
    onSuccess: (data: any) => {
      setPlagiarismResult(data);
      toast({
        title: "Check Complete",
        description: "Your text has been checked for potential plagiarism."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to check for plagiarism. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Mutation for idea generation
  const ideasMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/grantscribe/generate-ideas", {
        grantId: selectedIdeaGrantId,
        projectType,
        keywords
      });
    },
    onSuccess: (data: any) => {
      setIdeas(data.ideas);
      toast({
        title: "Ideas Generated",
        description: "Project ideas have been generated for your grant."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleAssistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrantId) {
      toast({
        title: "Selection Required",
        description: "Please select a grant from the dropdown.",
        variant: "destructive"
      });
      return;
    }
    
    if (applicationText.trim().length < 100) {
      toast({
        title: "More Content Needed",
        description: "Please enter at least 100 characters for a proper analysis.",
        variant: "destructive"
      });
      return;
    }
    
    assistMutation.mutate();
  };
  
  const handlePlagiarismSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textToCheck.trim().length < 100) {
      toast({
        title: "More Content Needed",
        description: "Please enter at least 100 characters for a proper plagiarism check.",
        variant: "destructive"
      });
      return;
    }
    
    plagiarismMutation.mutate();
  };
  
  const handleIdeasSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIdeaGrantId) {
      toast({
        title: "Selection Required",
        description: "Please select a grant from the dropdown.",
        variant: "destructive"
      });
      return;
    }
    
    ideasMutation.mutate();
  };
  
  // Format the plagiarism results for display
  const formattedPlagiarismResult = useMemo(() => {
    if (!plagiarismResult) return null;
    
    return {
      score: plagiarismResult.plagiarismScore,
      sections: plagiarismResult.flaggedSections || [],
      explanation: plagiarismResult.explanation,
      recommendations: plagiarismResult.recommendations || []
    };
  }, [plagiarismResult]);
  
  return (
    <div className="bg-black text-white min-h-screen pt-24 px-4 pb-16">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex items-center mb-6">
            <Wand2 className="h-10 w-10 mr-3 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">GrantScribe</h1>
          </div>
          <p className="text-lg text-gray-300 max-w-3xl">
            Your AI-powered guide to successful grant applications. Get assistance writing applications, 
            check for plagiarism, and generate creative project ideas tailored to specific grants.
          </p>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="max-w-5xl mx-auto"
        >
          <TabsList className="grid grid-cols-3 mb-10">
            <TabsTrigger value="apply" className="flex items-center">
              <BrainCircuit className="h-4 w-4 mr-2" /> Application Assistant
            </TabsTrigger>
            <TabsTrigger value="plagiarism" className="flex items-center">
              <FileCheck className="h-4 w-4 mr-2" /> Plagiarism Check
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" /> Idea Generator
            </TabsTrigger>
          </TabsList>
          
          {/* Application Assistant */}
          <TabsContent value="apply">
            <Card className="bg-[#222] border-gray-700">
              <CardHeader>
                <CardTitle>Application Assistant</CardTitle>
                <CardDescription className="text-gray-400">
                  Get expert feedback on your grant application draft. Our AI will analyze your text and provide 
                  suggestions to strengthen your application.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleAssistSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium">Select Grant</label>
                      <Select 
                        value={selectedGrantId.toString()} 
                        onValueChange={(value) => setSelectedGrantId(parseInt(value))}
                      >
                        <SelectTrigger className="bg-[#333] border-gray-700">
                          <SelectValue placeholder="Select a grant" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#333] border-gray-700">
                          {isLoadingGrants ? (
                            <SelectItem value="loading">Loading grants...</SelectItem>
                          ) : grants && grants.length > 0 ? (
                            grants.map(grant => (
                              <SelectItem key={grant.id} value={grant.id.toString()}>
                                {grant.title}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none">No grants available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Application Draft
                      </label>
                      <Textarea
                        value={applicationText}
                        onChange={(e) => setApplicationText(e.target.value)}
                        placeholder="Paste your grant application draft here..."
                        className="h-56 bg-[#333] border-gray-700"
                      />
                      <p className="mt-2 text-xs text-gray-400">
                        Minimum 100 characters for meaningful analysis.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="netflix" 
                    className="mt-6 w-full"
                    disabled={assistMutation.isPending}
                  >
                    {assistMutation.isPending ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>Analyze Application</>
                    )}
                  </Button>
                </form>
              </CardContent>
              
              {feedback && (
                <CardFooter className="block border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" /> Analysis Results
                  </h3>
                  <div className="whitespace-pre-line bg-[#333] p-4 rounded-md text-gray-200 mb-6">
                    {feedback}
                  </div>
                  
                  {improvedText && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Wand2 className="h-5 w-5 mr-2 text-primary" /> AI-Enhanced Application
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2 text-gray-300">Original Text</h4>
                          <div className="bg-[#333] p-4 rounded-md text-gray-400 h-[400px] overflow-y-auto border border-gray-700">
                            {originalText}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 text-gray-300 flex items-center">
                            Improved Version <span className="ml-2 text-xs bg-primary text-black px-2 py-0.5 rounded">AI Enhanced</span>
                          </h4>
                          <div className="bg-[#272727] p-4 rounded-md text-white h-[400px] overflow-y-auto border border-primary">
                            {improvedText}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Copy improved text to clipboard
                            navigator.clipboard.writeText(improvedText || "");
                            toast({
                              title: "Copied to clipboard",
                              description: "The improved application text has been copied to your clipboard."
                            });
                          }}
                          className="text-sm"
                        >
                          Copy Improved Version
                        </Button>
                      </div>
                    </div>
                  )}
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          {/* Plagiarism Check */}
          <TabsContent value="plagiarism">
            <Card className="bg-[#222] border-gray-700">
              <CardHeader>
                <CardTitle>Plagiarism Check</CardTitle>
                <CardDescription className="text-gray-400">
                  Verify the originality of your application content. Our AI will analyze your text for potential 
                  plagiarism issues before you submit.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handlePlagiarismSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Text to Check
                      </label>
                      <Textarea
                        value={textToCheck}
                        onChange={(e) => setTextToCheck(e.target.value)}
                        placeholder="Paste the text you want to check for plagiarism..."
                        className="h-56 bg-[#333] border-gray-700"
                      />
                      <p className="mt-2 text-xs text-gray-400">
                        Minimum 100 characters for meaningful analysis.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="netflix" 
                    className="mt-6 w-full"
                    disabled={plagiarismMutation.isPending}
                  >
                    {plagiarismMutation.isPending ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                        Checking...
                      </>
                    ) : (
                      <>Check for Plagiarism</>
                    )}
                  </Button>
                </form>
              </CardContent>
              
              {formattedPlagiarismResult && (
                <CardFooter className="block border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold mb-4">Plagiarism Analysis</h3>
                  
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span>Plagiarism Score</span>
                      <span className={`font-bold ${
                        formattedPlagiarismResult.score < 30 ? 'text-green-500' : 
                        formattedPlagiarismResult.score < 70 ? 'text-yellow-500' : 
                        'text-red-500'
                      }`}>
                        {formattedPlagiarismResult.score}%
                      </span>
                    </div>
                    <Progress 
                      value={formattedPlagiarismResult.score} 
                      className="h-2"
                      indicatorClassName={`${
                        formattedPlagiarismResult.score < 30 ? 'bg-green-500' : 
                        formattedPlagiarismResult.score < 70 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                    />
                  </div>
                  
                  {formattedPlagiarismResult.sections.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" /> 
                        Flagged Sections
                      </h4>
                      <ul className="space-y-2">
                        {formattedPlagiarismResult.sections.map((section: string, index: number) => (
                          <li key={index} className="bg-[#333] p-3 rounded border-l-4 border-yellow-500">
                            "{section}"
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Explanation</h4>
                    <p className="text-gray-300 bg-[#333] p-4 rounded-md">
                      {formattedPlagiarismResult.explanation}
                    </p>
                  </div>
                  
                  {formattedPlagiarismResult.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-300">
                        {formattedPlagiarismResult.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          {/* Idea Generator */}
          <TabsContent value="ideas">
            <Card className="bg-[#222] border-gray-700">
              <CardHeader>
                <CardTitle>Idea Generator</CardTitle>
                <CardDescription className="text-gray-400">
                  Need inspiration? Generate creative and grant-specific project ideas that align with 
                  the funding requirements and increase your chances of approval.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleIdeasSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium">Select Grant</label>
                      <Select 
                        value={selectedIdeaGrantId.toString()} 
                        onValueChange={(value) => setSelectedIdeaGrantId(parseInt(value))}
                      >
                        <SelectTrigger className="bg-[#333] border-gray-700">
                          <SelectValue placeholder="Select a grant" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#333] border-gray-700">
                          {isLoadingGrants ? (
                            <SelectItem value="loading">Loading grants...</SelectItem>
                          ) : grants && grants.length > 0 ? (
                            grants.map(grant => (
                              <SelectItem key={grant.id} value={grant.id.toString()}>
                                {grant.title}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none">No grants available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Project Type (Optional)
                      </label>
                      <Input
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        placeholder="e.g., Technology, Community, Education, Environmental"
                        className="bg-[#333] border-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Keywords (Optional)
                      </label>
                      <Input
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="e.g., innovation, community engagement, sustainability"
                        className="bg-[#333] border-gray-700"
                      />
                      <p className="mt-2 text-xs text-gray-400">
                        Separate multiple keywords with commas
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="netflix" 
                    className="mt-6 w-full"
                    disabled={ideasMutation.isPending}
                  >
                    {ideasMutation.isPending ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                        Generating...
                      </>
                    ) : (
                      <>Generate Ideas</>
                    )}
                  </Button>
                </form>
              </CardContent>
              
              {ideas && (
                <CardFooter className="block border-t border-gray-700 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" /> Generated Project Ideas
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Download ideas as JSON file
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ideas, null, 2));
                        const downloadAnchorNode = document.createElement('a');
                        downloadAnchorNode.setAttribute("href", dataStr);
                        downloadAnchorNode.setAttribute("download", "grant-project-ideas.json");
                        document.body.appendChild(downloadAnchorNode);
                        downloadAnchorNode.click();
                        downloadAnchorNode.remove();
                      }}
                    >
                      Save Ideas
                    </Button>
                  </div>
                  
                  <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                    <div>
                      <h4 className="font-medium mb-3 text-lg text-primary">Project Ideas</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {ideas.projectIdeas && ideas.projectIdeas.map((idea: any, index: number) => (
                          <div key={index} className="bg-[#333] p-4 rounded-md border border-gray-700 hover:border-primary transition-colors">
                            <h5 className="font-bold text-primary mb-2">{idea.title}</h5>
                            <p className="text-gray-300">{idea.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {ideas.approachSuggestions && (
                        <div className="bg-[#2A2A2A] p-4 rounded-md border border-gray-700">
                          <h4 className="font-medium mb-3 text-lg text-primary">Implementation Approaches</h4>
                          <ul className="list-disc pl-5 space-y-2 text-gray-300">
                            {ideas.approachSuggestions.map((approach: string, index: number) => (
                              <li key={index} className="pb-2">{approach}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {ideas.alignmentNotes && (
                        <div className="bg-[#2A2A2A] p-4 rounded-md border border-gray-700">
                          <h4 className="font-medium mb-3 text-lg text-primary">Alignment with Grant Objectives</h4>
                          <div className="text-gray-300">
                            {typeof ideas.alignmentNotes === 'string' 
                              ? ideas.alignmentNotes 
                              : Array.isArray(ideas.alignmentNotes) 
                                ? (
                                  <ul className="list-disc pl-5 space-y-2">
                                    {ideas.alignmentNotes.map((note: string, index: number) => (
                                      <li key={index} className="pb-2">{note}</li>
                                    ))}
                                  </ul>
                                ) 
                                : null
                            }
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {ideas.budgetConsiderations && (
                        <div className="bg-[#2A2A2A] p-4 rounded-md border border-gray-700">
                          <h4 className="font-medium mb-3 text-lg text-primary">Budget Considerations</h4>
                          <ul className="list-disc pl-5 space-y-2 text-gray-300">
                            {ideas.budgetConsiderations.map((budget: string, index: number) => (
                              <li key={index} className="pb-2">{budget}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {ideas.impactMetrics && (
                        <div className="bg-[#2A2A2A] p-4 rounded-md border border-gray-700">
                          <h4 className="font-medium mb-3 text-lg text-primary">Impact Metrics</h4>
                          <ul className="list-disc pl-5 space-y-2 text-gray-300">
                            {ideas.impactMetrics.map((metric: string, index: number) => (
                              <li key={index} className="pb-2">{metric}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {ideas.notice && (
                      <div className="mt-4 p-3 bg-gray-800 rounded-md text-gray-400 text-sm">
                        <p><strong>Note:</strong> {ideas.notice}</p>
                      </div>
                    )}
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}