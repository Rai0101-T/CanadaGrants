import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Grant } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  ExternalLink, Clock, DollarSign, Plus, CheckCircle, Building2, 
  FileText, Mail, Phone, ListChecks, ClipboardList, MapPin,
  ThumbsUp, AlertCircle, Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !grant) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
        <p className="text-gray-400 mb-8">Could not load grant details.</p>
        <Button variant="netflix" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-black text-white pt-16 pb-12 min-h-screen">
      <div className="h-64 md:h-80 relative mb-8">
        <img 
          src={grant.imageUrl} 
          alt={grant.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{grant.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className={`px-2 py-1 rounded-sm ${grant.type === 'federal' ? 'bg-green-600 text-white' : 'bg-yellow-400 text-black'}`}>
              {grant.type === 'federal' ? 'Federal' : 'Provincial'}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" /> Deadline: {grant.deadline}
            </span>
            <span className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" /> {grant.fundingAmount}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">About This Grant</h2>
          <p className="text-gray-300">
            {grant.description}
          </p>
        </div>
          
        {/* Eligibility Criteria Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-3">Eligibility Criteria</h2>
              <div className="bg-[#333333] p-4 rounded-md">
                <h3 className="font-semibold text-white mb-2">Who Can Apply</h3>
                <ul className="space-y-2">
                  {grant.whoCanApply?.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="text-green-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  )) || (
                    grant.eligibilityCriteria?.map((criteria, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-green-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{criteria}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
            
            {grant.industryFocus && grant.industryFocus.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-2">Industry Focus</h3>
                <div className="bg-[#333333] p-4 rounded-md">
                  <div className="flex flex-wrap gap-2">
                    {grant.industryFocus.map((industry, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-700 text-white">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {grant.locationRestrictions && (
              <div>
                <h3 className="font-semibold text-white mb-2">Location</h3>
                <div className="bg-[#333333] p-4 rounded-md flex items-center">
                  <MapPin className="text-red-500 h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="text-gray-300">{grant.locationRestrictions}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {/* Pros and Cons are now replaced with more specific info, but retaining a way to see benefits */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">Benefits</h2>
              <div className="bg-[#333333] p-4 rounded-md">
                <ul className="space-y-2">
                  {grant.pros?.map((pro, index) => (
                    <li key={index} className="flex items-start">
                      <ThumbsUp className="text-blue-400 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {grant.otherRequirements && grant.otherRequirements.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-2">Other Requirements</h3>
                <div className="bg-[#333333] p-4 rounded-md">
                  <ul className="space-y-2">
                    {grant.otherRequirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="text-yellow-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {grant.restrictions && grant.restrictions.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-2">Restrictions</h3>
                <div className="bg-[#333333] p-4 rounded-md">
                  <ul className="space-y-2">
                    {grant.restrictions.map((restriction, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="text-red-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{restriction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Application Process Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Application Process</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-[#333333] p-4 rounded-md">
                <h3 className="font-semibold text-white mb-2">Deadline</h3>
                <div className="flex items-center">
                  <Calendar className="text-primary h-5 w-5 mr-2 flex-shrink-0" />
                  <div className="text-gray-300">{grant.deadline}</div>
                </div>
                {grant.applicationDates && (
                  <div className="mt-2 text-gray-300">
                    <span className="text-gray-400">Application window: </span>
                    {grant.applicationDates}
                  </div>
                )}
              </div>
              
              {grant.applicationLink && (
                <div className="bg-[#333333] p-4 rounded-md">
                  <h3 className="font-semibold text-white mb-2">Application Link</h3>
                  <a 
                    href={grant.applicationLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:underline flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" /> Apply Online
                  </a>
                </div>
              )}
              
              {grant.documents && grant.documents.length > 0 && (
                <div className="bg-[#333333] p-4 rounded-md">
                  <h3 className="font-semibold text-white mb-2">Required Documents</h3>
                  <ul className="space-y-2">
                    {grant.documents.map((doc, index) => (
                      <li key={index} className="flex items-start">
                        <FileText className="text-blue-400 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {grant.applicationProcess && grant.applicationProcess.length > 0 && (
                <div className="bg-[#333333] p-4 rounded-md">
                  <h3 className="font-semibold text-white mb-2">How to Apply</h3>
                  {grant.howToApply && grant.howToApply.length > 0 ? (
                    <ol className="space-y-3 list-decimal pl-5">
                      {grant.howToApply.map((step, index) => (
                        <li key={index} className="pl-2 text-gray-300">
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ol className="space-y-3 list-decimal pl-5">
                      {grant.applicationProcess.map((step, index) => (
                        <li key={index} className="pl-2 text-gray-300">
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}
              
              {grant.reviewProcess && (
                <div className="bg-[#333333] p-4 rounded-md">
                  <h3 className="font-semibold text-white mb-2">Review Process</h3>
                  <p className="text-gray-300">{grant.reviewProcess}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Contact & Additional Information Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {(grant.contactEmail || grant.contactPhone) && (
            <div className="bg-[#333333] p-4 rounded-md">
              <h2 className="text-xl font-bold text-white mb-3">Contact Information</h2>
              <div className="space-y-3">
                {grant.fundingOrganization && (
                  <div className="flex items-center">
                    <Building2 className="text-primary h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="text-gray-300">{grant.fundingOrganization}</span>
                  </div>
                )}
                {grant.contactEmail && (
                  <div className="flex items-center">
                    <Mail className="text-primary h-5 w-5 mr-2 flex-shrink-0" />
                    <a href={`mailto:${grant.contactEmail}`} className="text-blue-400 hover:underline">
                      {grant.contactEmail}
                    </a>
                  </div>
                )}
                {grant.contactPhone && (
                  <div className="flex items-center">
                    <Phone className="text-primary h-5 w-5 mr-2 flex-shrink-0" />
                    <a href={`tel:${grant.contactPhone}`} className="text-blue-400 hover:underline">
                      {grant.contactPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {grant.faqQuestions && grant.faqQuestions.length > 0 && grant.faqAnswers && grant.faqAnswers.length > 0 && (
            <div className="bg-[#333333] p-4 rounded-md">
              <h2 className="text-xl font-bold text-white mb-3">FAQs</h2>
              <Accordion type="single" collapsible className="w-full">
                {grant.faqQuestions.map((question, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-700">
                    <AccordionTrigger className="text-white hover:text-primary">{question}</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      {grant.faqAnswers && grant.faqAnswers[index]}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>

          
        <div className="flex flex-col md:flex-row justify-between items-center">
          <a 
            href={grant.websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:text-primary/90 mb-4 md:mb-0 flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" /> Visit Official Website
          </a>
          <div className="flex space-x-4">
            <Button 
              variant="netflix" 
              onClick={handleAddToList}
              className="flex items-center"
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
            <Button 
              variant="outline"
              className="bg-white text-black hover:bg-gray-200 flex items-center"
              onClick={() => window.open(grant.websiteUrl, '_blank')}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
