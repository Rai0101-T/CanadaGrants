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
          
        {/* Eligibility Criteria Section - Restructured */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Eligibility Criteria</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Who Can Apply */}
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
              
              {/* Industry Focus */}
              <div className="bg-[#333333] p-4 rounded-md">
                <h3 className="font-semibold text-white mb-2">Industry Focus</h3>
                {grant.industryFocus && grant.industryFocus.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {grant.industryFocus.map((industry, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-700 text-white">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Building2 className="text-blue-400 h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="text-gray-300">{grant.industry || "All industries"}</span>
                  </div>
                )}
              </div>
              
              {/* Location Restrictions */}
              <div className="bg-[#333333] p-4 rounded-md">
                <h3 className="font-semibold text-white mb-2">Location Restrictions</h3>
                <div className="flex items-center">
                  <MapPin className="text-red-500 h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="text-gray-300">
                    {grant.locationRestrictions || 
                     (grant.province && grant.province !== 'All' ? `Limited to ${grant.province}` : 'No specific location restrictions')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Other Requirements */}
              <div className="bg-[#333333] p-4 rounded-md">
                <h3 className="font-semibold text-white mb-2">Other Requirements</h3>
                {grant.otherRequirements && grant.otherRequirements.length > 0 ? (
                  <ul className="space-y-2">
                    {grant.otherRequirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="text-yellow-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-2">
                    {grant.eligibilityCriteria?.filter((_, i) => i > 1).map((criteria, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="text-yellow-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{criteria}</span>
                      </li>
                    )) || (
                      <li className="flex items-start">
                        <AlertCircle className="text-yellow-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Contact the funding organization for specific requirements</span>
                      </li>
                    )}
                  </ul>
                )}
              </div>
              
              {/* Required Documents */}
              <div className="bg-[#333333] p-4 rounded-md">
                <h3 className="font-semibold text-white mb-2">Required Documents</h3>
                {grant.documents && grant.documents.length > 0 ? (
                  <ul className="space-y-2">
                    {grant.documents.map((doc, index) => (
                      <li key={index} className="flex items-start">
                        <FileText className="text-blue-400 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{doc}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center">
                    <FileText className="text-blue-400 h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="text-gray-300">Documentation requirements available on the official website</span>
                  </div>
                )}
              </div>
              
              {/* Restrictions on Funding Use */}
              <div className="bg-[#333333] p-4 rounded-md">
                <h3 className="font-semibold text-white mb-2">Restrictions</h3>
                {grant.restrictions && grant.restrictions.length > 0 ? (
                  <ul className="space-y-2">
                    {grant.restrictions.map((restriction, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="text-red-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{restriction}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  grant.cons && grant.cons.length > 0 ? (
                    <ul className="space-y-2">
                      {grant.cons.map((con, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="text-red-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{con}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center">
                      <AlertCircle className="text-red-500 h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">Restrictions on fund usage available on the official website</span>
                    </div>
                  )
                )}
              </div>
            </div>
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
              {/* How to Apply */}
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
                ) : grant.applicationProcess && grant.applicationProcess.length > 0 ? (
                  <ol className="space-y-3 list-decimal pl-5">
                    {grant.applicationProcess.map((step, index) => (
                      <li key={index} className="pl-2 text-gray-300">
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="flex items-center">
                    <ListChecks className="text-blue-400 h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="text-gray-300">Application instructions available on the official website</span>
                  </div>
                )}
              </div>
              
              {/* Review Process & Timeline */}
              <div className="bg-[#333333] p-4 rounded-md">
                <h3 className="font-semibold text-white mb-2">Review Process & Timeline</h3>
                {grant.reviewProcess ? (
                  <div className="space-y-3">
                    <p className="text-gray-300">{grant.reviewProcess}</p>
                    {grant.reviewTimeline && (
                      <div className="mt-2">
                        <span className="text-gray-400 font-medium">Expected timeline: </span>
                        <span className="text-gray-300">{grant.reviewTimeline}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Clock className="text-blue-400 h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="text-gray-300">
                      {grant.competitionLevel === "High" 
                        ? "This is a highly competitive grant with a thorough review process. Detailed timeline available on the official website."
                        : grant.competitionLevel === "Medium"
                        ? "Review process typically takes 1-2 months. Contact the funding organization for specific timelines."
                        : "Standard review process. Contact the funding organization for specific timelines."}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Details Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Additional Details</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Application Link */}
              <div className="bg-[#333333] p-4 rounded-md">
                <h3 className="font-semibold text-white mb-2">Application Link</h3>
                <div className="flex items-center">
                  <ExternalLink className="text-blue-400 h-5 w-5 mr-2 flex-shrink-0" />
                  {grant.applicationLink ? (
                    <a 
                      href={grant.applicationLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:underline"
                    >
                      {grant.applicationLink}
                    </a>
                  ) : grant.websiteUrl ? (
                    <a 
                      href={grant.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:underline"
                    >
                      {grant.websiteUrl}
                    </a>
                  ) : (
                    <span className="text-gray-300">Contact the funding organization for application details</span>
                  )}
                </div>
              </div>
              
              {/* Restrictions on Funding Use */}
              <div className="bg-[#333333] p-4 rounded-md">
                <h3 className="font-semibold text-white mb-2">Restrictions</h3>
                {grant.restrictions && grant.restrictions.length > 0 ? (
                  <ul className="space-y-2">
                    {grant.restrictions.map((restriction, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="text-red-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{restriction}</span>
                      </li>
                    ))}
                  </ul>
                ) : grant.cons && grant.cons.length > 0 ? (
                  <ul className="space-y-2">
                    {grant.cons.map((con, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="text-red-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{con}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center">
                    <AlertCircle className="text-red-500 h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="text-gray-300">Restrictions on fund usage available on the official website</span>
                  </div>
                )}
              </div>
              
              {/* Contact Information */}
              <div className="bg-[#333333] p-4 rounded-md">
                <h3 className="font-semibold text-white mb-2">Contact Information</h3>
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
                  {!grant.contactEmail && !grant.contactPhone && (
                    <div className="flex items-center">
                      <Mail className="text-primary h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">Contact information available on the official website</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* FAQs Section */}
            <div>
              <div className="bg-[#333333] p-4 rounded-md h-full">
                <h3 className="font-semibold text-white mb-3">Frequently Asked Questions</h3>
                {grant.faqQuestions && grant.faqQuestions.length > 0 && grant.faqAnswers && grant.faqAnswers.length > 0 ? (
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
                ) : (
                  <div className="space-y-3">
                    <div className="bg-gray-700 bg-opacity-40 p-3 rounded-md">
                      <h4 className="text-primary mb-1 font-medium">Do I need to be a registered business to apply?</h4>
                      <p className="text-gray-300 text-sm">Requirements vary by grant. Check the eligibility criteria section or contact the funding organization.</p>
                    </div>
                    <div className="bg-gray-700 bg-opacity-40 p-3 rounded-md">
                      <h4 className="text-primary mb-1 font-medium">How long does the application process take?</h4>
                      <p className="text-gray-300 text-sm">Review and decision timelines vary based on the competitiveness of the grant. Check the Review Process section for details.</p>
                    </div>
                    <div className="bg-gray-700 bg-opacity-40 p-3 rounded-md">
                      <h4 className="text-primary mb-1 font-medium">What happens after I submit my application?</h4>
                      <p className="text-gray-300 text-sm">Applications typically undergo review by a committee. You'll be notified by email about the status of your application.</p>
                    </div>
                    <p className="text-gray-400 text-sm mt-3">For more questions, visit the official grant website or contact the funding organization.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
