// Script to add National Research Council and CanExport Program grants
import axios from 'axios';

// Define the grants data for National Research Council of Canada (NRC IRAP)
const nrcIrapGrant = {
  title: "National Research Council Industrial Research Assistance Program (NRC IRAP)",
  description: "The NRC IRAP provides advice, connections, and funding to help Canadian small and medium-sized businesses increase their innovation capacity and take ideas to market.",
  type: "federal",
  industry: "Technology",
  category: "Research & Development",
  imageUrl: "https://images.unsplash.com/photo-1581093458791-9ededf674ead?auto=format&fit=crop&w=500&h=280&q=80",
  deadline: "Ongoing (various funding streams have specific deadlines)",
  fundingAmount: "$50,000 to $10,000,000 (depending on the program)",
  createdAt: new Date().toISOString(),
  featured: true,
  department: "National Research Council of Canada",
  applicationUrl: "https://nrc.canada.ca/en/support-technology-innovation",
  websiteUrl: "https://nrc.canada.ca/en/support-technology-innovation",
  pros: [
    "Non-repayable contributions (grants) for eligible projects",
    "Access to expert advice and guidance from Industrial Technology Advisors",
    "Connections to potential research and business partners",
    "Various funding streams available for different business needs and stages"
  ],
  cons: [
    "Competitive application process",
    "Detailed project planning and documentation required",
    "Funding is typically provided on a cost-shared basis (business must contribute)",
    "Post-project reporting and accountability measures"
  ],
  competitionLevel: "High",
  eligibilityCriteria: [
    "Canadian small or medium-sized business (500 or fewer full-time employees)",
    "Incorporated and profit-oriented",
    "Growth-oriented with potential to grow and generate profits through innovation",
    "Have the financial capacity to undertake the project",
    "Project must involve technological innovation or research and development"
  ],
  documents: [
    "Detailed project proposal",
    "Business financial statements",
    "Project budget and timeline",
    "Technical details of the innovation",
    "Evidence of ability to finance your portion of project costs"
  ],
  faqQuestions: [
    "What types of projects does NRC IRAP fund?",
    "How do I apply for NRC IRAP funding?",
    "What percentage of project costs will NRC IRAP cover?",
    "How long does the application process take?",
    "Are there any industry restrictions?"
  ],
  faqAnswers: [
    "NRC IRAP funds research and development projects, technology adoption and adaptation projects, and business innovation capacity-building activities. Projects should involve technological innovation and have commercial potential.",
    "The first step is to connect with an Industrial Technology Advisor (ITA) in your region. They will assess your project and guide you through the application process if it fits the program.",
    "NRC IRAP typically provides cost-shared funding, which means they will cover a portion of eligible project costs. The exact percentage varies depending on the project, but businesses are expected to contribute significantly.",
    "The timeline varies, but plan for several months from initial contact to funding decision. Complex projects may take longer to assess.",
    "NRC IRAP supports businesses across many sectors, but projects must involve technological innovation. Some industries may be excluded based on government priorities or other factors."
  ]
};

// Define the grants data for CanExport Program
const canExportGrant = {
  title: "CanExport Program",
  description: "The CanExport program provides financial assistance to Canadian small and medium-sized enterprises (SMEs) to help them develop new export opportunities and markets, especially in high-growth emerging markets.",
  type: "federal",
  industry: "any",
  category: "Export Development",
  imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&h=280&q=80",
  deadline: "Ongoing (applications accepted year-round)",
  fundingAmount: "Up to $75,000 per project (covering up to 75% of eligible expenses)",
  createdAt: new Date().toISOString(),
  featured: false,
  department: "Global Affairs Canada",
  applicationUrl: "https://www.tradecommissioner.gc.ca/funding_support_programs-programmes_de_financement_de_soutien.aspx?lang=eng",
  websiteUrl: "https://www.tradecommissioner.gc.ca/funding_support_programs-programmes_de_financement_de_soutien.aspx?lang=eng",
  pros: [
    "Non-repayable contribution (grant)",
    "Covers up to 75% of eligible expenses",
    "Supports various market development activities",
    "Relatively straightforward application process"
  ],
  cons: [
    "Requires upfront investment with reimbursement after project completion",
    "Must target markets where you have no or minimal existing sales",
    "Some industries and activities are ineligible",
    "Detailed reporting requirements"
  ],
  competitionLevel: "Medium",
  eligibilityCriteria: [
    "Canadian small or medium-sized enterprise (SME) - fewer than 500 full-time employees",
    "Annual revenue in Canada of $100,000 to $100 million",
    "Canadian business number (BN)",
    "Project must target markets where you have less than $100,000 in sales or no existing sales",
    "Must have capacity to carry out export market development activities"
  ],
  documents: [
    "Detailed export business plan",
    "Project budget with cost breakdown",
    "Financial statements",
    "Company incorporation documents",
    "Description of target market opportunity"
  ],
  faqQuestions: [
    "What expenses are eligible for CanExport funding?",
    "How do I apply for CanExport funding?",
    "How much of my project costs will be covered?",
    "How quickly will I receive funding after approval?",
    "Can I apply for multiple CanExport projects?"
  ],
  faqAnswers: [
    "Eligible expenses include travel costs, participation in trade shows, market research, adaptation of marketing tools, consultant fees for legal, tax, and business advice, IP protection, and B2B meeting arrangement services.",
    "Applications must be submitted through the online portal on the CanExport website. The application requires detailed information about your company, the target market, your export strategy, and a budget for eligible activities.",
    "CanExport covers up to 75% of eligible expenses, up to a maximum of $75,000 per project. Your company must contribute the remaining 25% or more of project costs.",
    "CanExport is a reimbursement program, meaning you must incur and pay for expenses before claiming them. After submitting all required documentation, reimbursement typically takes 4-8 weeks.",
    "Yes, companies can receive CanExport funding for up to 3 projects per government fiscal year (April 1 to March 31), as long as they target different markets or activities. The lifetime maximum funding per company is $250,000."
  ]
};

// Function to send grant data to API
async function addGrant(grantData) {
  try {
    const response = await axios.post('http://localhost:5000/api/admin/grants/add', grantData);
    console.log(`Successfully added grant: ${grantData.title}`);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error adding grant ${grantData.title}:`, error.response ? error.response.data : error.message);
    throw error;
  }
}

// Main function to add all grants
async function addAllGrants() {
  try {
    console.log('Adding NRC IRAP grant...');
    await addGrant(nrcIrapGrant);
    
    console.log('Adding CanExport grant...');
    await addGrant(canExportGrant);
    
    console.log('All grants added successfully!');
  } catch (error) {
    console.error('Failed to add all grants:', error);
  }
}

// Execute the main function
addAllGrants();