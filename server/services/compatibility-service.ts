import { User, Grant } from '@shared/schema';
import OpenAI from 'openai';

interface CompatibilityResult {
  score: number;           // 0-100 compatibility score
  reasoning: string;       // Short explanation of the score
  strengths: string[];     // Matching aspects between business and grant
  weaknesses: string[];    // Mismatched aspects
  improvementTips: string[]; // Suggestions to improve compatibility
}

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Calculates a compatibility score between a user's business profile and a grant
 * @param user The user with business profile details
 * @param grant The grant to check compatibility against
 * @returns A compatibility analysis with score and details
 */
export async function calculateGrantCompatibility(
  user: User,
  grant: Grant
): Promise<CompatibilityResult> {
  try {
    // Format the user's business profile and grant details
    const businessProfile = formatBusinessProfile(user);
    const grantDetails = formatGrantDetails(grant);

    // Prepare the prompt for OpenAI
    const prompt = `
      Analyze the compatibility between this business profile and grant opportunity.
      
      BUSINESS PROFILE:
      ${businessProfile}
      
      GRANT DETAILS:
      ${grantDetails}
      
      Please analyze the compatibility between this business and the grant by considering:
      1. Industry alignment
      2. Business size and maturity
      3. Location/region requirements
      4. Funding amount appropriateness
      5. Business needs vs. grant purpose
      
      Provide a JSON response with the following format:
      {
        "score": Number between 0-100 representing compatibility percentage,
        "reasoning": Short explanation of the overall compatibility score,
        "strengths": [Array of specific matching points between the business and grant],
        "weaknesses": [Array of mismatches or concerns regarding eligibility],
        "improvementTips": [Practical suggestions to improve compatibility]
      }
    `;

    // Call OpenAI API to analyze compatibility
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are an expert grant analyst helping businesses find compatible funding opportunities." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      return generateFallbackCompatibility(user, grant);
    }

    const result: CompatibilityResult = JSON.parse(responseContent);
    return result;
  } catch (error) {
    console.error('Error calculating grant compatibility:', error);
    // Provide a fallback compatibility score if AI analysis fails
    return generateFallbackCompatibility(user, grant);
  }
}

/**
 * Format user's business profile as a structured text for AI analysis
 */
function formatBusinessProfile(user: User): string {
  return `
    Business Name: ${user.businessName || 'Not specified'}
    Business Type: ${user.businessType || 'Not specified'}
    Industry: ${user.industry || 'Not specified'}
    Description: ${user.businessDescription || 'Not specified'}
    Province/Location: ${user.province || 'Not specified'}
    Employee Count: ${user.employeeCount || 'Not specified'}
    Year Founded: ${user.yearFounded || 'Not specified'}
    Website: ${user.website || 'Not specified'}
  `;
}

/**
 * Format grant details as a structured text for AI analysis
 */
function formatGrantDetails(grant: Grant): string {
  return `
    Grant Title: ${grant.title}
    Type: ${grant.type}
    Description: ${grant.description}
    Funding Amount: ${grant.fundingAmount}
    Industry Focus: ${grant.industry || 'Not specified'}
    Eligibility Criteria: ${Array.isArray(grant.eligibilityCriteria) ? grant.eligibilityCriteria.join('; ') : 'Not specified'}
    Province/Region: ${grant.province || 'Not specified'}
    Department/Organization: ${grant.department || grant.organization || 'Not specified'}
    Application Deadline: ${grant.deadline || 'Not specified'}
  `;
}

/**
 * Generate a simplified compatibility score when AI is unavailable
 */
function generateFallbackCompatibility(user: User, grant: Grant): CompatibilityResult {
  // Basic matching logic for industry and location
  const industryMatch = user.industry && grant.industry && 
    (user.industry.toLowerCase().includes(grant.industry.toLowerCase()) || 
     grant.industry.toLowerCase().includes(user.industry.toLowerCase()));
  
  const locationMatch = grant.province === 'All' || 
    !grant.province || 
    (user.province && grant.province && 
     user.province.toLowerCase() === grant.province.toLowerCase());

  // Calculate a basic score
  let score = 50; // Start with neutral score
  if (industryMatch) score += 25;
  if (locationMatch) score += 25;

  // Generate basic strengths and weaknesses
  const strengths = [
    industryMatch ? `Your business industry (${user.industry}) aligns with the grant focus.` : "",
    locationMatch ? "Your business location meets the grant regional requirements." : "",
    user.businessDescription ? "You have provided a business description, which helps in grant applications." : "",
  ].filter(Boolean as any as <T>(x: T) => x is NonNullable<T>);

  const weaknesses = [
    !industryMatch ? `Your business industry (${user.industry}) may not align with the grant focus (${grant.industry}).` : "",
    !locationMatch ? `Your business location (${user.province}) may not meet the grant regional requirements (${grant.province}).` : "",
    !user.businessDescription ? "Adding a more detailed business description would help assess eligibility better." : "",
  ].filter(Boolean as any as <T>(x: T) => x is NonNullable<T>);

  return {
    score,
    reasoning: "This compatibility score is based on basic matching of industry and location factors.",
    strengths: strengths.length > 0 ? strengths : ["Basic eligibility criteria appear to be met."],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["No major concerns identified with the available information."],
    improvementTips: [
      "Complete all sections of your business profile for a more accurate assessment.",
      "Review the grant eligibility criteria on their official website.",
      "Consider contacting the grant provider directly to discuss your specific situation."
    ],
  };
}