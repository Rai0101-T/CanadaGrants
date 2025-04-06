// Script to add CSBFP and BDC grants to the database

import fetch from 'node-fetch';

// Function to add a grant
async function addGrant(grantData) {
  try {
    const response = await fetch('http://localhost:5000/api/admin/grants/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(grantData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API responded with status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`Added grant: ${grantData.title} (ID: ${result.id})`);
    return result;
  } catch (error) {
    console.error(`Error adding grant ${grantData.title}:`, error);
    throw error;
  }
}

// Main function to add all grants
async function addAllGrants() {
  // CSBFP Grant
  const csbfpGrant = {
    title: "Canada Small Business Financing Program (CSBFP)",
    description: "The Canada Small Business Financing Program makes it easier for small businesses to get loans from financial institutions by sharing the risk with lenders. These loans can be used to finance the costs of purchasing or improving real property, leasehold improvements, or equipment.",
    type: "federal",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Ongoing",
    fundingAmount: "Up to $1,000,000",
    category: "Financing",
    industry: "Multiple",
    province: "All",
    competitionLevel: "Medium",
    eligibilityCriteria: [
      "Canadian small business or start-up",
      "Annual revenue below $10 million",
      "Loan must be used for eligible purposes",
      "Must apply through a financial institution",
      "Cannot be used for certain restricted activities"
    ],
    pros: [
      "Available through most financial institutions",
      "Higher approval rates than traditional loans",
      "Competitive interest rates",
      "Up to 90% of eligible costs financed",
      "Extended amortization periods (up to 15 years for real property)"
    ],
    cons: [
      "2% registration fee added to loan amount",
      "Limited to certain types of expenditures",
      "Cannot be used for working capital or inventory",
      "Requires personal guarantee from business owner",
      "Cannot be used for franchise fees or goodwill"
    ],
    websiteUrl: "https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/eng/home",
    featured: true,
    createdAt: new Date().toISOString(),
    fundingOrganization: "Innovation, Science and Economic Development Canada",
    applicationProcess: [
      "Determine eligibility and prepare business documentation",
      "Visit a participating financial institution",
      "Complete loan application with supporting documents",
      "Financial institution assesses application",
      "If approved, lender registers with CSBFP",
      "Funds are released according to terms"
    ],
    documents: [
      "Business plan",
      "Financial statements or projections",
      "Cost estimates for purchases",
      "Proof of business registration",
      "Personal financial information"
    ],
    contactEmail: "csbfp-pfpec@ised-isde.gc.ca",
    contactPhone: "+1-866-959-1699",
    whoCanApply: [
      "Small businesses operating for profit in Canada",
      "Start-up enterprises",
      "Most business sectors except farming, religious organizations, and charitable organizations"
    ],
    industryFocus: [
      "Retail",
      "Manufacturing",
      "Service industries",
      "Professional services",
      "Tourism"
    ],
    locationRestrictions: "Available across all Canadian provinces and territories",
    otherRequirements: [
      "Loans must be used for specific eligible expenses",
      "Annual revenue cannot exceed $10 million",
      "Maximum loan amount is $1,000,000"
    ],
    applicationDates: "Applications accepted year-round",
    applicationLink: "https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/eng/h_la00007.html",
    howToApply: [
      "Applications must be made through participating financial institutions (banks, credit unions)",
      "Business must prepare financial documentation before applying",
      "Loan approval is determined by the financial institution"
    ],
    reviewProcess: "Application review is conducted by the financial institution, typically taking 1-4 weeks depending on the complexity of the request",
    restrictions: [
      "Cannot be used for goodwill, working capital, inventory, or franchise fees",
      "Maximum loan amount is $1,000,000 ($350,000 for equipment and leasehold improvements)",
      "2% registration fee is applied to the loan amount"
    ],
    faqQuestions: [
      "Can I use CSBFP for working capital?",
      "How long does the application process take?",
      "What businesses are ineligible for CSBFP?"
    ],
    faqAnswers: [
      "No, CSBFP loans cannot be used for working capital, inventory, franchise fees, or goodwill.",
      "The application process typically takes 1-4 weeks, depending on the complexity of your business and the financial institution's processes.",
      "Farming businesses, religious organizations, charitable organizations, and businesses with annual revenue exceeding $10 million are ineligible."
    ]
  };
  
  // BDC Grant
  const bdcGrant = {
    title: "Business Development Bank of Canada (BDC) Programs",
    description: "The Business Development Bank of Canada offers various financing solutions and advisory services designed specifically for Canadian businesses. BDC provides loans, investments and advisory services with a focus on small and medium-sized enterprises.",
    type: "federal",
    imageUrl: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Ongoing",
    fundingAmount: "$10K-$5M+",
    category: "Financing",
    industry: "Multiple",
    province: "All",
    competitionLevel: "Medium",
    eligibilityCriteria: [
      "Canadian business with operations in Canada",
      "Viable business model with growth potential",
      "Strong management team",
      "Ability to repay financing",
      "Business at any stage (startup to maturity)"
    ],
    pros: [
      "Flexible financing options tailored to business needs",
      "Patient capital with longer repayment terms",
      "Access to business advisory services",
      "Higher risk tolerance than traditional banks",
      "No penalties for early repayment"
    ],
    cons: [
      "Interest rates may be higher than traditional banks",
      "Detailed business plan and financials required",
      "Application process can be rigorous",
      "May require personal guarantees",
      "Some programs have specific industry or stage requirements"
    ],
    websiteUrl: "https://www.bdc.ca/en",
    featured: true,
    createdAt: new Date().toISOString(),
    fundingOrganization: "Business Development Bank of Canada",
    applicationProcess: [
      "Contact BDC directly or apply online",
      "Meet with a BDC representative to discuss needs",
      "Submit business documentation and financial statements",
      "BDC conducts business assessment",
      "Financing offer preparation and presentation",
      "Funds disbursement upon acceptance"
    ],
    documents: [
      "Business plan",
      "Financial statements (past 3 years if available)",
      "Financial projections",
      "Personal net worth statement",
      "Detailed project description and costs"
    ],
    contactEmail: "info@bdc.ca",
    contactPhone: "+1-877-232-2269",
    whoCanApply: [
      "Canadian businesses at any stage",
      "Startups with strong business plans",
      "Growth-oriented small and medium businesses",
      "Businesses seeking to expand or export",
      "Businesses requiring working capital"
    ],
    industryFocus: [
      "Manufacturing",
      "Technology",
      "Services",
      "Wholesale & retail",
      "Tourism & hospitality"
    ],
    locationRestrictions: "Available across all Canadian provinces and territories with local offices in major cities",
    otherRequirements: [
      "Demonstrated ability to repay",
      "Viable business model",
      "Strong management team"
    ],
    applicationDates: "Applications accepted year-round",
    applicationLink: "https://www.bdc.ca/en/financing",
    howToApply: [
      "Initial applications can be submitted online",
      "Phone applications accepted at 1-877-232-2269",
      "In-person meetings at local BDC offices",
      "Through referrals from financial institutions"
    ],
    reviewProcess: "BDC reviews applications based on business viability, management capability, financial statements, and repayment ability. Decisions typically take 1-3 weeks.",
    restrictions: [
      "Primarily focused on Canadian businesses with operations in Canada",
      "Cannot be used for illegal activities or non-viable business models",
      "Some programs have specific eligibility requirements based on industry or business stage"
    ],
    faqQuestions: [
      "What types of financing does BDC offer?",
      "Does BDC finance startups?",
      "What makes BDC different from other lenders?"
    ],
    faqAnswers: [
      "BDC offers term loans, working capital financing, equipment financing, technology financing, and specialized industry financing. They also provide advisory services and venture capital investments.",
      "Yes, BDC does finance startups, particularly those with strong business plans, management teams, and some form of market validation or traction.",
      "BDC is more flexible than traditional banks, offering longer repayment terms, no penalties for early repayment, and a higher tolerance for risk. They also provide advisory services alongside financing."
    ]
  };

  try {
    // Add each grant
    await addGrant(csbfpGrant);
    await addGrant(bdcGrant);
    
    console.log('Successfully added all CSBFP and BDC grants!');
  } catch (error) {
    console.error('Error in addAllGrants:', error);
  }
}

// Run the main function
addAllGrants().catch(console.error);