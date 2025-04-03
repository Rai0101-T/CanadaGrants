import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Grant } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ExternalLink, DollarSign, Plus, CheckCircle, Building2, 
  FileText, Mail, Phone, MapPin, ThumbsUp, AlertCircle, Calendar, Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import { useMyList } from "@/hooks/use-my-list";

export default function GrantDetails() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isInMyList, addToMyList, removeFromMyList } = useMyList();
  
  const grantId = parseInt(params.id as string);

  // Fetch grant details
  const { data: grant, isLoading, isError } = useQuery<Grant>({
    queryKey: [`/api/grants/${grantId}`],
  });
  
  // Dummy user ID (in a real app, this would come from auth)
  const userId = 1;
  
  // Check if grant is in user's list
  const { data: inListData, refetch: refetchInList } = useQuery<{isInList: boolean}>({
    queryKey: [`/api/mylist/${userId}/${grantId}`],
    enabled: !!grantId,
  });
  
  const isInList = inListData?.isInList;

  const handleAddToList = async () => {
    if (isInList) {
      await removeFromMyList(userId, grantId);
      toast({
        title: "Removed from My List",
        description: `${grant?.title} has been removed from your list`,
      });
    } else {
      await addToMyList(userId, grantId);
      toast({
        title: "Added to My List",
        description: `${grant?.title} has been added to your list`,
      });
    }
    refetchInList();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#141414]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !grant) {
    return (
      <div className="container mx-auto px-4 py-16 text-center bg-[#141414] text-white">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-gray-400 mb-8">Could not load grant details.</p>
        <Button variant="netflix" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] text-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Image Header */}
        <div className="h-64 md:h-80 relative mb-8 rounded-xl overflow-hidden">
          <img 
            src={grant.imageUrl} 
            alt={grant.title}
            onError={(e) => {
              // Fallback for image load errors
              e.currentTarget.src = `https://placehold.co/800x400/1a1a1a/ffffff?text=${encodeURIComponent(grant.type === 'federal' ? 'Federal Grant' : grant.type === 'provincial' ? 'Provincial Grant' : 'Private Grant')}`;
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/90 text-white border-primary">
                {grant.type === 'federal' ? 'Federal Grant' : 
                grant.type === 'provincial' ? 'Provincial Grant' : 'Private Grant'}
              </Badge>
              {grant.category && (
                <Badge variant="outline" className="bg-white/20 border-white/30">
                  {grant.category}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{grant.title}</h1>
            <p className="text-white/80 text-lg max-w-3xl">{grant.description}</p>
          </div>
        </div>
        
        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Funding Amount */}
          <div className="bg-[#1a1a1a] backdrop-blur-sm rounded-lg p-4 border border-[#333333]">
            <div className="flex items-center">
              <div className="bg-primary/20 p-2 rounded-full mr-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Funding Amount</p>
                <p className="text-xl font-bold text-white">{grant.fundingAmount}</p>
              </div>
            </div>
          </div>
          
          {/* Application Deadline */}
          <div className="bg-[#1a1a1a] backdrop-blur-sm rounded-lg p-4 border border-[#333333]">
            <div className="flex items-center">
              <div className="bg-primary/20 p-2 rounded-full mr-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Deadline</p>
                <p className="text-xl font-bold text-white">{grant.deadline || 'Ongoing'}</p>
              </div>
            </div>
          </div>
          
          {/* Category */}
          <div className="bg-[#1a1a1a] backdrop-blur-sm rounded-lg p-4 border border-[#333333]">
            <div className="flex items-center">
              <div className="bg-primary/20 p-2 rounded-full mr-3">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Category</p>
                <p className="text-xl font-bold text-white">{grant.category || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content and Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Eligibility Criteria */}
            <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-md border border-[#333333]">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <CheckCircle className="text-primary h-5 w-5 mr-2" />
                Eligibility Criteria
              </h2>
              
              {grant.eligibilityCriteria && grant.eligibilityCriteria.length > 0 ? (
                <ul className="space-y-3">
                  {grant.eligibilityCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary/80 text-white flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="text-gray-300">{criteria}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">No specific eligibility information available. Please check the official website for details.</p>
              )}
            </div>
            
            {/* Two Column Layout for Secondary Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Industry Focus */}
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#333333]">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Building2 className="text-primary h-5 w-5 mr-2" />
                  Industry Focus
                </h3>
                
                {grant.industryFocus && grant.industryFocus.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {grant.industryFocus.map((industry, index) => (
                      <Badge key={index} variant="outline" className="bg-[#262626] border-[#444444]">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                ) : grant.industry && grant.industry.includes(',') ? (
                  <div className="space-y-2">
                    {grant.industry.split(',').map((industry, index) => (
                      <div key={index} className="flex items-center py-1">
                        <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                        <span className="text-gray-300">{industry.trim()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center py-1">
                    <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                    <span className="text-gray-300">{grant.industry || "All industries"}</span>
                  </div>
                )}
              </div>
              
              {/* Location Restrictions */}
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#333333]">
                <h3 className="font-semibold mb-3 flex items-center">
                  <MapPin className="text-primary h-5 w-5 mr-2" />
                  Location Requirements
                </h3>
                
                <div className="py-1">
                  <span className="text-gray-300">
                    {grant.locationRestrictions || 
                    (grant.province && grant.province !== 'All' ? `Limited to ${grant.province}` : 'Available across Canada')}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Required Documents */}
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#333333]">
              <h3 className="font-semibold mb-3 flex items-center">
                <FileText className="text-primary h-5 w-5 mr-2" />
                Required Documents
              </h3>
              
              {grant.documents && grant.documents.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {grant.documents.map((doc, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                      </div>
                      <span className="text-gray-300">{doc}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">
                  Documentation requirements available on the official website
                </p>
              )}
            </div>
            
            {/* Restrictions */}
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#333333]">
              <h3 className="font-semibold mb-3 flex items-center">
                <AlertCircle className="text-primary h-5 w-5 mr-2" />
                Restrictions & Limitations
              </h3>
              
              {grant.restrictions && grant.restrictions.length > 0 ? (
                <ul className="space-y-2">
                  {grant.restrictions.map((restriction, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-red-400"></span>
                      </div>
                      <span className="text-gray-300">{restriction}</span>
                    </li>
                  ))}
                </ul>
              ) : grant.cons && grant.cons.length > 0 ? (
                <ul className="space-y-2">
                  {grant.cons.map((con, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-red-400"></span>
                      </div>
                      <span className="text-gray-300">{con}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">
                  Funding restrictions available on the official website
                </p>
              )}
            </div>
          </div>
          
          {/* Sidebar - Right 1/3 */}
          <div className="space-y-6">
            {/* Application Actions */}
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#121212] rounded-xl p-6 border border-[#333333] shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Apply Now</h3>
              
              <div className="space-y-4">
                <Button 
                  className="w-full h-12 text-base font-medium bg-primary text-white hover:bg-primary/90"
                  onClick={() => window.open(grant.applicationLink || grant.websiteUrl, '_blank')}
                >
                  Apply for Grant
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base font-medium border-white/20 hover:bg-white/10"
                  onClick={handleAddToList}
                >
                  {isInList ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" /> In My List
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" /> Add to My List
                    </>
                  )}
                </Button>
                
                <div className="pt-4 border-t border-[#333333] mt-4">
                  <a 
                    href={grant.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:text-primary/90 flex items-center text-sm font-medium"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" /> Visit Official Website
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#333333]">
              <h3 className="font-semibold mb-3 flex items-center">
                <Mail className="text-primary h-5 w-5 mr-2" />
                Contact Information
              </h3>
              
              <div className="space-y-3 text-gray-300">
                {grant.fundingOrganization && (
                  <div className="flex items-center py-1">
                    <Building2 className="text-gray-500 h-5 w-5 mr-3" />
                    <span>{grant.fundingOrganization}</span>
                  </div>
                )}
                {grant.contactEmail && (
                  <div className="flex items-center py-1">
                    <Mail className="text-gray-500 h-5 w-5 mr-3" />
                    <a href={`mailto:${grant.contactEmail}`} className="text-primary hover:underline">
                      {grant.contactEmail}
                    </a>
                  </div>
                )}
                {grant.contactPhone && (
                  <div className="flex items-center py-1">
                    <Phone className="text-gray-500 h-5 w-5 mr-3" />
                    <a href={`tel:${grant.contactPhone}`} className="text-primary hover:underline">
                      {grant.contactPhone}
                    </a>
                  </div>
                )}
                {!grant.contactEmail && !grant.contactPhone && !grant.fundingOrganization && (
                  <p>Contact information available on the official website</p>
                )}
              </div>
            </div>
            
            {/* Tips for Success */}
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#333333]">
              <h3 className="font-semibold mb-3 flex items-center">
                <ThumbsUp className="text-primary h-5 w-5 mr-2" />
                Tips for Success
              </h3>
              
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start py-1">
                  <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                  </div>
                  <span>Read eligibility criteria carefully</span>
                </div>
                <div className="flex items-start py-1">
                  <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                  </div>
                  <span>Prepare all required documents in advance</span>
                </div>
                <div className="flex items-start py-1">
                  <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                  </div>
                  <span>Clearly demonstrate how your project aligns with the grant's goals</span>
                </div>
                <div className="flex items-start py-1">
                  <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                  </div>
                  <span>Submit your application before the deadline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Centered FAQs Section */}
        <div className="mt-12 mb-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#333333]">
            {grant.faqQuestions && grant.faqQuestions.length > 0 && grant.faqAnswers && grant.faqAnswers.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {grant.faqQuestions.map((question, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-[#333333] last:border-b-0">
                    <AccordionTrigger className="hover:text-primary py-4">
                      {question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pt-1 pb-4">
                      {grant.faqAnswers && grant.faqAnswers[index]}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b border-[#333333]">
                  <AccordionTrigger className="hover:text-primary py-4">
                    Do I need to be a registered business to apply?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pt-1 pb-4">
                    Requirements vary by grant. Check the eligibility criteria section or contact the funding organization for specific requirements.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b border-[#333333]">
                  <AccordionTrigger className="hover:text-primary py-4">
                    How long does the application process take?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pt-1 pb-4">
                    Application review timelines vary based on the competitiveness of the grant and the funding organization. Most federal grants take 3-6 months for review, while provincial grants may be faster.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-b border-[#333333]">
                  <AccordionTrigger className="hover:text-primary py-4">
                    What happens after I submit my application?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pt-1 pb-4">
                    Applications typically undergo review by a committee. You'll be notified by email about the status of your application. The review process may include multiple stages and possibly interviews or additional documentation requests.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-b border-[#333333]">
                  <AccordionTrigger className="hover:text-primary py-4">
                    Can I apply for multiple grants at the same time?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pt-1 pb-4">
                    Yes, you can typically apply for multiple grants simultaneously, as long as you meet the eligibility criteria for each. However, some grants may have restrictions on receiving multiple government funding sources for the same project.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border-b-0">
                  <AccordionTrigger className="hover:text-primary py-4">
                    What if I need help with my application?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pt-1 pb-4">
                    Many funding organizations offer support services or information sessions for applicants. You can also use our GrantScribe service for assistance with drafting your application, avoiding common pitfalls, and improving your chances of success.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}