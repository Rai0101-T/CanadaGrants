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
      
      Please analyze the compatibility between this business and the grant by considering the following 10 key factors:
      
      1. Industry/Sector Match: Does the business's industry (tech, healthcare, agriculture, etc.) align with the grant's target sectors?
      
      2. Business Size: Does the number of employees (micro, small, medium, large) and revenue thresholds meet the grant's requirements?
      
      3. Business Stage: Is the business's development stage (idea, startup, growth, established, scaling) appropriate for this grant?
      
      4. Geographic Location: Do the business's country, province/territory, city, or regional location (rural vs. urban) meet the grant's geographic requirements?
      
      5. Ownership/Demographics: Are there any special eligibility criteria related to ownership (women-owned, Indigenous-owned, youth-led, newcomer-founded) that apply?
      
      6. Purpose/Use of Funds: Does the grant's purpose (hiring, R&D, training, equipment purchase, export expansion, sustainability, tech adoption) align with the business's needs?
      
      7. Legal Entity Type: Is the business's legal structure (corporation, sole proprietorship, nonprofit, cooperative, partnership) eligible for this grant?
      
      8. Specific Eligibility Requirements: Does the business meet any specific requirements (incorporation status, minimum revenue, employee count)?
      
      9. Funding Type: Does the type of funding offered (grant, loan, equity-free funding, tax credit, wage subsidy) match what the business is seeking?
      
      10. Application Status/Deadlines: Is the grant currently accepting applications? Does the business have enough time to prepare a quality application?
      
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
      model: "gpt-3.5-turbo", // Using GPT-3.5 Turbo to avoid hitting quota limits
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
 * Enhanced to consider multiple factors based on user requirements
 */
function generateFallbackCompatibility(user: User, grant: Grant): CompatibilityResult {
  // Initialize score at 50 (neutral baseline)
  let score = 50;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const improvementTips: string[] = [];
  
  // 1. Industry/Sector Match
  const industryMatch = user.industry && grant.industry && 
    (user.industry.toLowerCase().includes(grant.industry.toLowerCase()) || 
     grant.industry.toLowerCase().includes(user.industry.toLowerCase()) ||
     grant.industry.toLowerCase() === 'all industries' ||
     grant.industry.toLowerCase() === 'any');
  
  if (industryMatch) {
    score += 15;
    strengths.push(`Your business industry (${user.industry}) aligns with the grant focus (${grant.industry || 'All industries'}).`);
  } else if (user.industry && grant.industry) {
    score -= 15;
    weaknesses.push(`Your business industry (${user.industry}) may not align with the grant focus (${grant.industry}).`);
    improvementTips.push(`Look for grants specifically targeted to the ${user.industry} industry.`);
  } else if (!user.industry) {
    weaknesses.push("You haven't specified your business industry, which is important for grant matching.");
    improvementTips.push("Update your profile with your specific industry sector.");
  }
  
  // 2. Business Size (via Employee Count)
  const employeeCount = user.employeeCount ? parseInt(user.employeeCount) : null;
  const isSmallBusiness = employeeCount !== null && employeeCount < 100;
  
  // Many Canadian grants target SMEs, so we'll check eligibility criteria
  if (grant.eligibilityCriteria) {
    const smeTargeted = grant.eligibilityCriteria.some(criteria => 
      criteria.toLowerCase().includes('small') || 
      criteria.toLowerCase().includes('sme') ||
      criteria.toLowerCase().includes('medium-sized'));
      
    if (smeTargeted && isSmallBusiness) {
      score += 10;
      strengths.push(`Your business size (${user.employeeCount} employees) qualifies as a small/medium enterprise (SME).`);
    } else if (smeTargeted && !isSmallBusiness && employeeCount !== null) {
      score -= 10;
      weaknesses.push(`This grant targets small/medium enterprises, but your business has ${user.employeeCount} employees.`);
    } else if (!user.employeeCount) {
      improvementTips.push("Add your employee count to your profile for better grant matching.");
    }
  }
  
  // 3. Geographic Location
  const locationMatch = !grant.province || 
    grant.province === 'All Provinces' ||
    (user.province && grant.province && 
     (user.province.toLowerCase() === grant.province.toLowerCase() || 
      grant.province.toLowerCase().includes(user.province.toLowerCase())));
  
  if (locationMatch && user.province) {
    score += 15;
    strengths.push(`Your business location (${user.province}) meets the grant's regional requirements (${grant.province || 'All Provinces'}).`);
  } else if (!locationMatch && user.province && grant.province) {
    score -= 15;
    weaknesses.push(`Your business location (${user.province}) doesn't match the grant's regional requirements (${grant.province}).`);
  } else if (!user.province) {
    weaknesses.push("You haven't specified your business location, which is important for regional grants.");
    improvementTips.push("Update your profile with your business location/province.");
  }
  
  // 4. Business Maturity (based on year founded)
  const yearFounded = user.yearFounded ? parseInt(user.yearFounded) : null;
  const currentYear = new Date().getFullYear();
  
  if (yearFounded) {
    const businessAge = currentYear - yearFounded;
    
    // Check if eligibility criteria mention startup or established businesses
    const startupFocused = grant.eligibilityCriteria && grant.eligibilityCriteria.some(criteria => 
      criteria.toLowerCase().includes('startup') || 
      criteria.toLowerCase().includes('new business'));
    
    if (startupFocused && businessAge <= 5) {
      score += 10;
      strengths.push(`Your business age (${businessAge} years) aligns with grants targeting startups and new businesses.`);
    } else if (startupFocused && businessAge > 5) {
      score -= 5;
      weaknesses.push(`This grant may target newer businesses, while yours has been operating for ${businessAge} years.`);
    } else if (businessAge > 3) {
      // Most grants prefer businesses with some operational history
      score += 5;
      strengths.push(`Your business has been established for ${businessAge} years, showing operational stability.`);
    }
  } else {
    improvementTips.push("Add your business's founding year to your profile for better matching.");
  }
  
  // 5. Application Deadline Check
  if (grant.deadline) {
    const deadlineText = grant.deadline.toLowerCase();
    const isOngoing = 
      deadlineText.includes('ongoing') || 
      deadlineText.includes('rolling') || 
      deadlineText.includes('open') ||
      deadlineText.includes('continuous');
    
    if (isOngoing) {
      score += 5;
      strengths.push("This grant has an ongoing application process, giving you flexibility to apply when ready.");
    } else {
      // Check if deadline contains a future date
      const currentDate = new Date();
      // Very simple date extraction - just checking for 2025 or 2026
      const hasFutureYear = deadlineText.includes('2025') || deadlineText.includes('2026');
      
      if (hasFutureYear) {
        score += 5;
        strengths.push("The application deadline appears to be in the future, giving you time to prepare.");
      } else {
        improvementTips.push("Verify the application deadline on the grant's official website.");
      }
    }
  }
  
  // Additional context improvements
  if (user.businessDescription) {
    score += 5;
    strengths.push("You've provided a business description, which helps in assessing grant eligibility.");
  } else {
    weaknesses.push("Your profile lacks a business description, which is crucial for grant applications.");
    improvementTips.push("Add a detailed business description to your profile for better matching.");
  }
  
  // Ensure score stays within 0-100 range
  score = Math.max(0, Math.min(100, score));
  
  // Default strings if arrays are empty
  if (strengths.length === 0) strengths.push("Limited matching factors identified with the available information.");
  if (weaknesses.length === 0) weaknesses.push("No major concerns identified with the available information.");
  if (improvementTips.length === 0) {
    improvementTips.push("Complete all sections of your business profile for a more accurate assessment.");
    improvementTips.push("Review the grant eligibility criteria on their official website.");
  }
  
  return {
    score,
    reasoning: "This compatibility score evaluates alignment across industry, business size, location, maturity, and application timing.",
    strengths,
    weaknesses,
    improvementTips,
  };
}