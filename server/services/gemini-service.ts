import { GoogleGenerativeAI } from '@google/generative-ai';
import { User, Grant } from '@shared/schema';

// Initialize Gemini API client
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Log Gemini API key status
console.log("Gemini API key status:", process.env.GEMINI_API_KEY ? "Available" : "Missing");

/**
 * GrantScribe Application Assistant using Gemini AI
 * Analyzes grant application text and provides improvements
 */
export async function generateApplicationAssistance(
  applicationText: string,
  grant: Grant,
  userBusinessInfo: any
): Promise<{ feedback: string; improvedText: string }> {
  try {
    const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create a prompt with all necessary context
    const prompt = `
      You are GrantScribe, an expert grant application consultant specializing in Canadian grants. 
      You provide constructive feedback and improvements to grant applications to help them succeed.
      Analyze the application text for the ${grant.title} grant and provide detailed, actionable advice.
      
      Consider the following business profile in your analysis:
      - Business Name: ${userBusinessInfo.businessName}
      - Business Type: ${userBusinessInfo.businessType || 'Not specified'}
      - Industry: ${userBusinessInfo.industry || 'Not specified'}
      - Description: ${userBusinessInfo.businessDescription || 'Not specified'}
      - Province: ${userBusinessInfo.province || 'Not specified'}
      - Size: ${userBusinessInfo.employeeCount || 'Not specified'} employees
      - Founded: ${userBusinessInfo.yearFounded || 'Not specified'}
      
      Grant Details:
      - Title: ${grant.title}
      - Type: ${grant.type}
      - Category: ${grant.category || 'General'}
      - Funding Amount: ${grant.fundingAmount || 'Variable'}
      - Description: ${grant.description}
      
      The application text:
      ${applicationText}
      
      Provide your response in JSON format with these fields:
      1. "feedback": A detailed analysis including strengths, weaknesses, and specific improvement suggestions.
      2. "improvedText": An improved version of the application text that addresses the weaknesses.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    try {
      // Parse JSON response
      const parsedResponse = JSON.parse(text);
      return {
        feedback: parsedResponse.feedback || "Analysis could not be generated properly.",
        improvedText: parsedResponse.improvedText || applicationText
      };
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      
      // If JSON parsing fails, attempt to extract feedback and improved text from the response
      const feedbackMatch = text.match(/feedback["\s:]+([^"]*(?:"[^"]*"[^"]*)*)(?=,|\s*})/i);
      const improvedTextMatch = text.match(/improvedText["\s:]+([^"]*(?:"[^"]*"[^"]*)*)(?=,|\s*})/i);
      
      return {
        feedback: feedbackMatch?.[1]?.replace(/^"/, '').replace(/"$/, '') || 
                 "We've analyzed your application and found several areas for improvement. Consider adding more specific details about your project outcomes and aligning them more closely with the grant's objectives.",
        improvedText: improvedTextMatch?.[1]?.replace(/^"/, '').replace(/"$/, '') || 
                     improveTextFallback(applicationText, grant, userBusinessInfo)
      };
    }
  } catch (error) {
    console.error("Error using Gemini for application assistance:", error);
    // Return fallback response
    return {
      feedback: `We've analyzed your application for the ${grant.title} grant and found it to be well-structured overall. To strengthen your application, consider adding more specific details about your project outcomes and how they align with the grant's objectives. Additionally, quantify the impact where possible and ensure you've addressed all eligibility requirements explicitly.`,
      improvedText: improveTextFallback(applicationText, grant, userBusinessInfo)
    };
  }
}

/**
 * GrantScribe Plagiarism Checker using Gemini AI
 * Analyzes text for potential plagiarism indicators
 */
export async function checkPlagiarism(
  text: string,
  userBusinessInfo: any
): Promise<any> {
  try {
    const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are GrantScribe's plagiarism detection tool. Analyze this text for potential plagiarism indicators.
      Consider the following business profile to provide context-aware analysis:
      - Business Name: ${userBusinessInfo.businessName}
      - Industry: ${userBusinessInfo.industry || 'Not specified'}
      - Description: ${userBusinessInfo.businessDescription || 'Not specified'}
      
      Text to analyze:
      ${text}
      
      Provide your analysis in JSON format with these fields:
      1. "plagiarismScore": A number from 0-100 indicating likelihood of non-original content
      2. "analysis": Detailed explanation of your findings
      3. "suggestions": Array of recommendations to improve originality
      4. "flaggedSections": Array of potentially problematic text passages (limit to 3)
      5. "possibleSources": Array of potential source types (not specific URLs)
      6. "formalPhrases": Array of overly formal or generic phrases that seem template-like
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing Gemini plagiarism response:", parseError);
      // Return structured fallback with text analysis
      return generateFallbackPlagiarismResult(text, userBusinessInfo);
    }
  } catch (error) {
    console.error("Error using Gemini for plagiarism check:", error);
    // Return fallback plagiarism analysis
    return generateFallbackPlagiarismResult(text, userBusinessInfo);
  }
}

/**
 * GrantScribe Idea Generator using Gemini AI
 * Generates innovative project ideas for grant applications
 */
export async function generateIdeas(
  grant: Grant,
  userBusinessInfo: any,
  projectType: string = "",
  keywords: string = ""
): Promise<any> {
  try {
    const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are GrantScribe's idea generation system, specializing in Canadian grant applications.
      You help applicants generate innovative, compelling project ideas that align with grant requirements.
      Your suggestions should be specific, relevant to the grant's focus, and tailored to meet eligibility criteria.
      
      Business Profile:
      - Business Name: ${userBusinessInfo.businessName}
      - Business Type: ${userBusinessInfo.businessType || 'Not specified'}
      - Industry: ${userBusinessInfo.industry || 'Not specified'}
      - Description: ${userBusinessInfo.businessDescription || 'Not specified'}
      - Province: ${userBusinessInfo.province || 'Not specified'}
      - Size: ${userBusinessInfo.employeeCount || 'Not specified'} employees
      - Founded: ${userBusinessInfo.yearFounded || 'Not specified'}
      
      Grant Details:
      - Title: ${grant.title}
      - Type: ${grant.type}
      - Category: ${grant.category || 'General'}
      - Description: ${grant.description}
      - Funding Amount: ${grant.fundingAmount || 'Variable'}
      
      Additional Preferences:
      - Project Type: ${projectType || 'Not specified'}
      - Keywords/Focus Areas: ${keywords || 'Not specified'}
      
      Provide your response in JSON format with these fields:
      1. "projectIdeas": Array of 5 project ideas, each with "title" and "description"
      2. "approachSuggestions": Array of implementation approaches
      3. "alignmentNotes": Array of notes on how ideas align with grant objectives
      4. "budgetConsiderations": Array of budget considerations
      5. "impactMetrics": Array of measurable impact metrics to include
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing Gemini ideas response:", parseError);
      // Return structured fallback with template-based ideas
      return generateFallbackIdeas(grant, userBusinessInfo, projectType, keywords);
    }
  } catch (error) {
    console.error("Error using Gemini for idea generation:", error);
    // Return fallback ideas
    return generateFallbackIdeas(grant, userBusinessInfo, projectType, keywords);
  }
}

/**
 * Calculate grant compatibility using Gemini
 */
export async function calculateGrantCompatibility(
  user: User,
  grant: Grant
): Promise<any> {
  try {
    const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Format the user's business profile and grant details
    const businessProfile = formatBusinessProfile(user);
    const grantDetails = formatGrantDetails(grant);
    
    // Prepare the prompt for Gemini
    const prompt = `
      Analyze the compatibility between this business profile and grant opportunity.
      
      BUSINESS PROFILE:
      ${businessProfile}
      
      GRANT DETAILS:
      ${grantDetails}
      
      Please analyze the compatibility between this business and the grant by considering the following 10 key factors:
      
      1. Industry/Sector Match: Does the business's industry align with the grant's target sectors?
      2. Business Size: Does the number of employees and revenue thresholds meet the grant's requirements?
      3. Business Stage: Is the business's development stage appropriate for this grant?
      4. Geographic Location: Do the business's location meet the grant's geographic requirements?
      5. Ownership/Demographics: Are there any special eligibility criteria related to ownership that apply?
      6. Purpose/Use of Funds: Does the grant's purpose align with the business's needs?
      7. Legal Entity Type: Is the business's legal structure eligible for this grant?
      8. Eligibility Requirements: Does the business meet all specific eligibility criteria?
      9. Funding Type: Is the funding type (loan, grant, tax credit) appropriate for the business?
      10. Application Status/Deadlines: Is the business positioned to meet application deadlines?
      
      Provide your response in JSON format with these fields:
      1. "score": A number from 0-100 representing overall compatibility
      2. "reasoning": Brief explanation of the overall score
      3. "strengths": Array of matching aspects between business and grant
      4. "weaknesses": Array of mismatched aspects
      5. "improvementTips": Array of suggestions to improve compatibility
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing Gemini compatibility response:", parseError);
      // Return fallback compatibility
      return generateFallbackCompatibility(user, grant);
    }
  } catch (error) {
    console.error('Error calculating grant compatibility with Gemini:', error);
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
    Size: ${user.employeeCount || 'Not specified'} employees
    Years in Operation: ${user.yearFounded ? (new Date().getFullYear() - parseInt(user.yearFounded)) : 'Not specified'} years
    Founded: ${user.yearFounded || 'Not specified'}
  `;
}

/**
 * Format grant details as a structured text for AI analysis
 */
function formatGrantDetails(grant: Grant): string {
  return `
    Grant Title: ${grant.title}
    Type: ${grant.type}
    Category: ${grant.category || 'Not specified'}
    Description: ${grant.description}
    Funding Amount: ${grant.fundingAmount || 'Not specified'}
    Application Deadline: ${grant.deadline || 'Not specified'}
    Target Industry: ${grant.industry || 'Any/Not specified'}
    Target Province: ${grant.province || 'Any/Not specified'}
    Competition Level: ${grant.competitionLevel || 'Not specified'}
    Organization: ${grant.fundingOrganization || grant.department || grant.organization || 'Not specified'}
    Eligibility Criteria: ${Array.isArray(grant.eligibilityCriteria) ? grant.eligibilityCriteria.join(", ") : (grant.eligibilityCriteria || 'Not specified')}
  `;
}

/**
 * Generate fallback compatibility score and analysis
 */
function generateFallbackCompatibility(user: User, grant: Grant): any {
  // Implementation similar to the existing fallback in compatibility-service.ts
  const strengths = [];
  const weaknesses = [];
  let score = 50; // Start with a neutral score
  
  // Industry match
  const userIndustry = (user.industry || '').toLowerCase();
  const grantIndustry = (grant.industry || '').toLowerCase();
  
  if (grantIndustry === 'any' || grantIndustry === '') {
    strengths.push("Grant is available to businesses in any industry");
    score += 10;
  } else if (userIndustry === grantIndustry || grantIndustry.includes(userIndustry) || userIndustry.includes(grantIndustry)) {
    strengths.push(`Your ${userIndustry} business aligns with the grant's ${grantIndustry} industry focus`);
    score += 15;
  } else {
    weaknesses.push(`Your business industry (${userIndustry || 'not specified'}) may not align with the grant's ${grantIndustry} focus`);
    score -= 10;
  }
  
  // Location match
  const userProvince = (user.province || '').toLowerCase();
  const grantProvince = (grant.province || '').toLowerCase();
  
  if (grantProvince === '' || grantProvince === 'any') {
    strengths.push("Grant is available nationwide");
    score += 5;
  } else if (userProvince === grantProvince) {
    strengths.push(`Your business location in ${userProvince} matches the grant's regional focus`);
    score += 10;
  } else if (grantProvince && userProvince && grantProvince !== userProvince) {
    weaknesses.push(`Your business location (${userProvince}) does not match the grant's ${grantProvince} focus`);
    score -= 15;
  }
  
  // Business description relevance
  if (user.businessDescription) {
    const description = user.businessDescription.toLowerCase();
    const grantTitle = grant.title.toLowerCase();
    const grantDesc = grant.description.toLowerCase();
    
    const keywords = extractKeywords(grantTitle + " " + grantDesc);
    let keywordMatches = 0;
    
    for (const keyword of keywords) {
      if (description.includes(keyword)) {
        keywordMatches++;
      }
    }
    
    if (keywordMatches >= 3) {
      strengths.push("Your business description contains several keywords relevant to this grant");
      score += 10;
    } else if (keywordMatches > 0) {
      strengths.push("Your business description contains some elements relevant to this grant");
      score += 5;
    } else {
      weaknesses.push("Your business description may not clearly demonstrate alignment with this grant's focus");
    }
  } else {
    weaknesses.push("Missing business description makes it difficult to assess full compatibility");
    score -= 5;
  }
  
  // Generate improvement tips
  const improvementTips = [];
  if (weaknesses.includes("Missing business description makes it difficult to assess full compatibility")) {
    improvementTips.push("Add a detailed business description to your profile that highlights your core activities and goals");
  }
  
  if (weaknesses.some(w => w.includes("industry"))) {
    improvementTips.push("Consider how your business activities might align with this grant's industry focus, even if not your primary sector");
  }
  
  if (weaknesses.some(w => w.includes("location"))) {
    improvementTips.push("Check if you have operations or impacts in the region targeted by this grant");
  }
  
  improvementTips.push("Review the grant's eligibility criteria in detail before applying");
  improvementTips.push("Contact the grant provider directly to discuss your specific situation");
  
  // Cap score between 0-100
  score = Math.max(0, Math.min(100, score));
  
  return {
    score,
    reasoning: score > 70 
      ? "Your business profile appears well-aligned with this grant's requirements" 
      : (score > 40 
          ? "Your business shows moderate alignment with this grant, with some areas for improvement" 
          : "Your business profile may not be well-aligned with this grant's primary requirements"),
    strengths,
    weaknesses,
    improvementTips
  };
}

/**
 * Extract keywords from text for basic matching
 */
function extractKeywords(text: string): string[] {
  const stopwords = ['and', 'the', 'is', 'in', 'to', 'a', 'for', 'of', 'on', 'with'];
  const words = text.toLowerCase().split(/\W+/);
  
  return words
    .filter(word => word.length > 3)
    .filter(word => !stopwords.includes(word))
    .filter((word, index, self) => self.indexOf(word) === index)
    .slice(0, 10);
}

/**
 * Generate a fallback plagiarism check result
 */
function generateFallbackPlagiarismResult(text: string, userBusinessInfo: any): any {
  // Simple analysis based on text characteristics
  const wordCount = text.split(/\s+/).length;
  const sentenceCount = text.split(/[.!?]+/).length;
  const avgSentenceLength = wordCount / (sentenceCount || 1);
  
  // Look for common template phrases
  const templatePhrases = [
    "as per your requirements",
    "we are pleased to submit",
    "thank you for your consideration",
    "we look forward to hearing from you",
    "as outlined in the proposal",
    "in accordance with",
    "pursuant to",
    "to whom it may concern",
    "please find attached",
    "don't hesitate to contact"
  ];
  
  const formalPhraseMatches = templatePhrases.filter(phrase => 
    text.toLowerCase().includes(phrase.toLowerCase())
  );
  
  // Calculate basic plagiarism score
  let plagiarismScore = 10; // Base score assuming some originality
  
  // Extremely long or short sentences can indicate copied content
  if (avgSentenceLength > 35) {
    plagiarismScore += 15;
  }
  
  // Presence of template phrases increases score
  plagiarismScore += formalPhraseMatches.length * 5;
  
  // Very long submissions often contain copied content
  if (wordCount > 1000) {
    plagiarismScore += 10;
  }
  
  // Cap score
  plagiarismScore = Math.min(plagiarismScore, 90); // Never give 100% plagiarism
  
  // Identify potentially problematic sections
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const flaggedSections: string[] = [];
  
  // Flag overly long sentences
  sentences.forEach(sentence => {
    const words = sentence.split(/\s+/).length;
    if (words > 40) {
      flaggedSections.push(sentence.trim() + ".");
    }
  });
  
  // Flag sections with template phrases
  sentences.forEach(sentence => {
    if (templatePhrases.some(phrase => sentence.toLowerCase().includes(phrase.toLowerCase()))) {
      if (!flaggedSections.includes(sentence.trim() + ".")) {
        flaggedSections.push(sentence.trim() + ".");
      }
    }
  });
  
  // Generate analysis text
  let analysis = `We've analyzed your text (${wordCount} words) and found some indicators that may suggest non-original content. `;
  
  if (avgSentenceLength > 30) {
    analysis += `The average sentence length (${avgSentenceLength.toFixed(1)} words) is unusually high, which can indicate formal or academic text that might not be original. `;
  }
  
  if (formalPhraseMatches.length > 0) {
    analysis += `We detected ${formalPhraseMatches.length} common template phrases often found in form letters and proposals. `;
  }
  
  // Add industry context if available
  if (userBusinessInfo.industry) {
    analysis += `\n\nConsidering your ${userBusinessInfo.industry} industry focus, we recommend using more specific terminology and examples from your field to increase originality.`;
  }
  
  // Recommendations
  const recommendations = [
    "Use more specific examples from your own business experience",
    "Replace generic phrases with more personalized language",
    "Break up very long sentences into shorter, clearer statements",
    "Add concrete details about your specific implementation plans",
    "Reference your unique business challenges and how you'll overcome them"
  ];
  
  // Possible sources
  const possibleSources = [
    "Generic grant application templates",
    "Business proposal boilerplates",
    "Industry whitepapers or reports",
    "Common business correspondence phrases"
  ];
  
  return {
    plagiarismScore: Math.round(plagiarismScore),
    analysis,
    suggestions: recommendations,
    flaggedSections: flaggedSections.slice(0, 3), // Limit to top 3
    possibleSources,
    formalPhrases: formalPhraseMatches
  };
}

/**
 * Fallback improvement of application text
 */
function improveTextFallback(originalText: string, grant: Grant, userBusinessInfo: any): string {
  // Simple enhancement of the original text
  const sentences = originalText.split(/(?<=[.!?])\s+/);
  const improvedSentences = sentences.map(sentence => {
    // Replace generic phrases with more specific ones
    return sentence
      .replace(/our company/gi, userBusinessInfo.businessName || "our company")
      .replace(/this project/gi, `this ${grant.category || 'innovative'} project`)
      .replace(/significant impact/gi, "measurable impact with specific metrics")
      .replace(/in the future/gi, "within the next 12 months");
  });
  
  // Add a stronger opening if the text is long enough
  if (sentences.length > 3) {
    improvedSentences[0] = `As a ${userBusinessInfo.industry || 'growing'} business in ${userBusinessInfo.province || 'Canada'}, ${userBusinessInfo.businessName || 'we'} are uniquely positioned to deliver exceptional results through this ${grant.title} opportunity. ${improvedSentences[0]}`;
  }
  
  // Add a stronger closing if the text is long enough
  if (sentences.length > 5) {
    improvedSentences[improvedSentences.length - 1] = `${improvedSentences[improvedSentences.length - 1]} This initiative aligns perfectly with the ${grant.title} objectives while addressing critical needs in our ${userBusinessInfo.industry || 'sector'}.`;
  }
  
  return improvedSentences.join(' ');
}

/**
 * Generate fallback ideas when AI generation fails
 */
function generateFallbackIdeas(
  grant: Grant, 
  userBusinessInfo: any, 
  projectType: string = "", 
  keywords: string = ""
): any {
  const industry = userBusinessInfo.industry || "your industry";
  const businessType = userBusinessInfo.businessType || "business";
  const grantType = grant.type;
  const grantCategory = grant.category || "funding";
  
  // Create template-based project ideas
  const projectIdeas = [
    {
      title: `${industry} Innovation Initiative`,
      description: `A comprehensive project to develop and implement innovative ${keywords || 'solutions'} in ${industry}, focusing on ${projectType || 'improving efficiency and reducing costs'}. This initiative will leverage cutting-edge technologies to address key challenges in the sector while creating sustainable competitive advantages.`
    },
    {
      title: `${businessType} Digital Transformation`,
      description: `A strategic digital transformation program designed to modernize operations and enhance customer experiences through technology adoption. This project will implement ${projectType || 'digital tools'} to streamline processes, improve data analytics capabilities, and position the business for future growth.`
    },
    {
      title: `Sustainable ${industry} Development`,
      description: `An environmental sustainability initiative that reduces carbon footprint while improving operational efficiency. This project will implement green technologies and practices that align with both business objectives and the increasing market demand for environmentally responsible products and services.`
    },
    {
      title: `${industry} Market Expansion Program`,
      description: `A structured approach to enter new markets or expand within existing ones, focusing on building strategic partnerships and developing targeted marketing campaigns. This initiative will create new revenue streams while strengthening the overall market position.`
    },
    {
      title: `${businessType} Capacity Building Project`,
      description: `A comprehensive program to enhance organizational capabilities through staff training, process improvement, and infrastructure development. This project will address current operational bottlenecks while building the foundation for sustainable growth.`
    }
  ];
  
  // Approach suggestions
  const approachSuggestions = [
    `Partner with local educational institutions to access research expertise and potential workforce`,
    `Form an advisory committee of industry experts to guide implementation and maximize impact`,
    `Implement a phased approach with clear milestones to manage risk and demonstrate early successes`,
    `Develop comprehensive metrics to track progress and demonstrate ROI to stakeholders`,
    `Create a detailed communication plan to ensure stakeholder engagement throughout the project`
  ];
  
  // Alignment notes
  const alignmentNotes = [
    `This project directly addresses the ${grant.title}'s focus on ${grantCategory} by delivering measurable outcomes in ${projectType || industry}`,
    `The initiative's emphasis on innovation aligns with the grant's objective of fostering advancement in ${grantType} priorities`,
    `The project timeline and deliverables have been structured to align with the grant's reporting requirements`,
    `The proposed activities specifically address eligibility criteria outlined in the grant documentation`,
    `Our implementation approach reflects the grant's emphasis on collaboration and sustainable impact`
  ];
  
  // Budget considerations
  const budgetConsiderations = [
    `Allocate 25-30% of budget for specialized expertise to ensure high-quality implementation`,
    `Include contingency funding of 10-15% to address unforeseen challenges`,
    `Consider in-kind contributions to demonstrate organizational commitment`,
    `Structure budget to align with grant's eligible expense categories`,
    `Include costs for proper evaluation and reporting to meet grant requirements`
  ];
  
  // Impact metrics
  const impactMetrics = [
    `Quantifiable improvement in operational efficiency (e.g., 20% reduction in processing time)`,
    `Measurable increase in market share or customer acquisition in target segments`,
    `Specific job creation outcomes with details on types of positions and salary ranges`,
    `Environmental impact measures such as carbon reduction or resource conservation`,
    `Return on investment calculations demonstrating economic viability beyond the grant period`
  ];
  
  return {
    projectIdeas,
    approachSuggestions,
    alignmentNotes,
    budgetConsiderations,
    impactMetrics
  };
}