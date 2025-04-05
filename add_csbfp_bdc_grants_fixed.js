// Script to add Canada Small Business Financing Program (CSBFP) and 
// Business Development Bank of Canada (BDC) Programs

import fetch from 'node-fetch';

// Grant data
const grants = [
  {
    title: "Canada Small Business Financing Program (CSBFP)",
    description: "The Canada Small Business Financing Program makes it easier for small businesses to get loans from financial institutions. The government shares the risk with lenders to help businesses start up, expand, or improve their operations.",
    fundingAmount: "$1M",
    eligibility: "Canadian small businesses with gross annual revenues of $10 million or less. Eligible expenses include property improvements, equipment, and leasehold improvements.",
    deadline: "Ongoing",
    applicationUrl: "https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/eng/home",
    sourceUrl: "https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/eng/home",
    websiteUrl: "https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/eng/home",
    type: "federal",
    industry: "Small Business",
    department: "Innovation, Science and Economic Development Canada",
    province: null,
    fundingOrganization: "Government of Canada",
    category: "Financing",
    competitionLevel: "Medium",
    eligibilityCriteria: [
      "Canadian small businesses with gross annual revenues of $10 million or less",
      "Purchasing or improving equipment",
      "Purchasing or improving real property",
      "Leasehold improvements",
      "Must be a for-profit business"
    ],
    pros: [
      "Up to $1 million in financing for any one borrower",
      "Government shares the risk with lenders, making it easier to secure loans",
      "Competitive interest rates",
      "Available through most financial institutions across Canada",
      "Specific allocations for real property, equipment, and leasehold improvements"
    ],
    cons: [
      "Registration and administration fees apply",
      "Cannot be used for inventory, working capital, or franchise fees",
      "Requires personal guarantees from business owners",
      "Some industries are ineligible",
      "Must be arranged through a financial institution"
    ],
    applicationProcess: ["Apply directly through participating financial institutions, including banks, credit unions, and caisses populaires."],
    documents: [
      "Business plan",
      "Financial statements",
      "List of assets to be purchased with financing",
      "Personal financial information",
      "Proof of Canadian citizenship or permanent residency"
    ],
    websiteDescription: "Official program page from Innovation, Science and Economic Development Canada.",
    imageUrl: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=500&h=280&q=80",
    applicationTips: "Work with your financial institution to determine your loan structure and eligible expenses before applying. Having a detailed business plan showing how the loan will help grow your business is essential.",
    successRate: "Medium",
    featured: true
  },
  {
    title: "BDC Small Business Loan",
    description: "The Business Development Bank of Canada offers flexible financing options specifically designed for small and medium-sized Canadian businesses, with favorable terms and advisory services.",
    fundingAmount: "$100K - $500K",
    eligibility: "Canadian small and medium-sized businesses. Financing can be used for equipment, real estate, business expansion, working capital, or technology implementation.",
    deadline: "Ongoing",
    applicationUrl: "https://www.bdc.ca/en/financing/business-loans",
    sourceUrl: "https://www.bdc.ca/en/financing",
    websiteUrl: "https://www.bdc.ca",
    type: "federal",
    industry: "Multiple Industries",
    department: "Business Development Bank of Canada",
    province: null,
    fundingOrganization: "Business Development Bank of Canada",
    category: "Financing",
    competitionLevel: "Medium",
    eligibilityCriteria: [
      "Canadian-owned business",
      "For-profit venture",
      "Demonstrable ability to repay loan",
      "Good business credit record",
      "Tangible plan for how the loan will be used"
    ],
    pros: [
      "Flexible payment schedules tailored to your cash flow",
      "Longer amortization periods than traditional loans",
      "No penalties for early repayment",
      "Complementary advisory services available",
      "Lower collateral requirements than traditional lenders"
    ],
    cons: [
      "Interest rates may be higher than traditional banks",
      "More stringent financial requirements for startups",
      "Application and approval process can be lengthy",
      "May require personal guarantees",
      "Less flexible terms for businesses in higher-risk sectors"
    ],
    applicationProcess: ["Apply online through BDC's website or connect with a local BDC account manager who will guide you through the process."],
    documents: [
      "Business plan or project description",
      "Personal financial statements from business owners",
      "Business financial statements (last 2-3 years)",
      "Cash flow projections",
      "Information about requested security/collateral"
    ],
    websiteDescription: "Official website of the Business Development Bank of Canada.",
    imageUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=500&h=280&q=80",
    applicationTips: "Focus on clearly explaining how the loan will contribute to your business growth or operational improvements. Prepare a detailed breakdown of how funds will be used and the expected return on investment.",
    successRate: "Medium",
    featured: true
  },
  {
    title: "BDC Working Capital Loan",
    description: "Financing solution from the Business Development Bank of Canada designed to provide the working capital businesses need to cover everyday expenses and pursue growth opportunities.",
    fundingAmount: "$100K - $750K",
    eligibility: "Canadian small and medium-sized businesses needing working capital for operations, inventory, marketing, hiring, or to take advantage of new opportunities.",
    deadline: "Ongoing",
    applicationUrl: "https://www.bdc.ca/en/financing/business-loans/working-capital-financing",
    sourceUrl: "https://www.bdc.ca/en/financing/business-loans/working-capital-financing",
    websiteUrl: "https://www.bdc.ca",
    type: "federal",
    industry: "Multiple Industries",
    department: "Business Development Bank of Canada",
    province: null,
    fundingOrganization: "Business Development Bank of Canada",
    category: "Financing",
    competitionLevel: "Medium",
    eligibilityCriteria: [
      "Canadian-owned business",
      "For-profit venture",
      "In operation for at least 12 months",
      "Revenue-generating business",
      "Positive cash flow or clear path to positive cash flow"
    ],
    pros: [
      "Designed specifically for working capital needs",
      "Flexible repayment options aligned with business cycles",
      "Can be used to fund seasonal or cyclical shortfalls",
      "No penalties for early repayment",
      "Combines financing with advisory services"
    ],
    cons: [
      "May require personal guarantees",
      "Higher interest rates than traditional bank loans",
      "More stringent application process for newer businesses",
      "May require regular reporting on business metrics",
      "Not suitable for distressed businesses"
    ],
    applicationProcess: ["Apply online or through a BDC account manager who will work with you to structure the working capital solution that fits your specific needs."],
    documents: [
      "Current and projected financial statements",
      "Accounts receivable and accounts payable listings",
      "Inventory valuation details",
      "Cash flow projections",
      "Business plan showing how additional working capital will benefit the business"
    ],
    websiteDescription: "BDC's working capital financing page with detailed information on eligibility and application process.",
    imageUrl: "https://images.unsplash.com/photo-1589666564459-93cdd3ab856a?auto=format&fit=crop&w=500&h=280&q=80",
    applicationTips: "Be prepared to show how your business manages its current working capital cycle and how additional financing will improve your operations or help you capitalize on new opportunities.",
    successRate: "Medium",
    featured: false
  },
  {
    title: "BDC Technology Financing",
    description: "Specialized financing from BDC for businesses looking to invest in digital technologies, software implementations, or technology upgrades to improve productivity and competitiveness.",
    fundingAmount: "$50K - $500K",
    eligibility: "Canadian businesses investing in technology and digital solutions such as e-commerce platforms, ERP systems, CRM systems, automation, or other productivity-enhancing technologies.",
    deadline: "Ongoing",
    applicationUrl: "https://www.bdc.ca/en/financing/business-loans/technology-financing",
    sourceUrl: "https://www.bdc.ca/en/financing/business-loans/technology-financing",
    websiteUrl: "https://www.bdc.ca",
    type: "federal",
    industry: "Technology",
    department: "Business Development Bank of Canada",
    province: null,
    fundingOrganization: "Business Development Bank of Canada",
    category: "Technology",
    competitionLevel: "Medium",
    eligibilityCriteria: [
      "Canadian-owned business",
      "For-profit venture",
      "Clear technology implementation plan",
      "Demonstrable return on technology investment",
      "Good business credit history"
    ],
    pros: [
      "Tailored specifically for technology investments",
      "Flexible repayment terms aligned with expected ROI timeline",
      "Can finance both hardware and software purchases",
      "Can include implementation costs and training",
      "Complementary technology advisory services available"
    ],
    cons: [
      "May require technical validation of proposed solutions",
      "Higher interest rates than traditional equipment loans",
      "Implementation risks may affect loan approval",
      "More documentation required than standard loans",
      "May require vendor estimates and implementation timelines"
    ],
    applicationProcess: ["Apply through BDC's website or work with a BDC account manager who can help validate your technology investment plan and structure the appropriate financing."],
    documents: [
      "Technology implementation plan",
      "Vendor quotes and proposals",
      "Business financial statements",
      "Expected ROI calculations",
      "Training and implementation timeline"
    ],
    websiteDescription: "BDC's technology financing page with information on eligible technologies and application process.",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&h=280&q=80",
    applicationTips: "Clearly articulate how the technology investment will improve your business operations, increase productivity, or create new revenue opportunities. Having vendor quotes and a clear implementation timeline strengthens your application.",
    successRate: "Medium-High",
    featured: false
  },
  {
    title: "BDC Women in Technology Venture Fund",
    description: "Canada's largest venture capital fund dedicated to investing in women-led technology companies and building a robust ecosystem to support women in tech.",
    fundingAmount: "$500K - $5M",
    eligibility: "Women-led or women-founded technology companies with high growth potential seeking Series A or B funding. Companies should be Canadian-based with innovation in software, hardware, or digital health sectors.",
    deadline: "Ongoing",
    applicationUrl: "https://www.bdc.ca/en/bdc-capital/venture-capital/strategic-approach/women-tech-fund",
    sourceUrl: "https://www.bdc.ca/en/bdc-capital/venture-capital/strategic-approach/women-tech-fund",
    websiteUrl: "https://www.bdc.ca",
    type: "federal",
    industry: "Technology",
    department: "Business Development Bank of Canada",
    province: null,
    fundingOrganization: "BDC Capital",
    category: "Venture Capital",
    competitionLevel: "High",
    eligibilityCriteria: [
      "Women-led or founded technology company (woman CEO or significant equity ownership by women)",
      "Canadian-based business",
      "Seeking Series A or B funding (typically)",
      "Proven product-market fit with early revenues",
      "Scalable business model with high growth potential"
    ],
    pros: [
      "Access to Canada's largest fund dedicated to women in technology",
      "Strategic support and mentorship beyond capital",
      "Connection to BDC's extensive network of partners and resources",
      "Active involvement from experienced venture capital professionals",
      "Focus on building the ecosystem for women entrepreneurs"
    ],
    cons: [
      "Highly competitive application process",
      "Requires significant traction and proof of concept",
      "Limited to technology sectors",
      "Equity investment rather than non-dilutive funding",
      "Expects significant growth and eventual exit potential"
    ],
    applicationProcess: ["Companies don't apply directly but are referred through the fund's network or can be discovered through industry events, accelerators, or other venture capital partners."],
    documents: [
      "Detailed business plan",
      "Financial projections with clear path to profitability",
      "Product/technology overview",
      "Market analysis and competitive positioning",
      "Team background and qualifications"
    ],
    websiteDescription: "Official page for BDC Capital's Women in Technology Venture Fund with information about the fund's mandate and portfolio.",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=500&h=280&q=80",
    applicationTips: "Demonstrate strong evidence of product-market fit, early customer traction, and a clear vision for scaling the business. Having an experienced team with domain expertise is critical for consideration.",
    successRate: "Low-Medium",
    featured: true
  },
  {
    title: "BDC Growth & Transition Capital",
    description: "Customized financing solutions from BDC to help growing businesses fund expansion plans, business transitions, change of ownership, or acquisitions without giving up control.",
    fundingAmount: "$250K - $10M",
    eligibility: "Established Canadian businesses with strong management, positive cash flow, and a clear growth or transition plan. Suitable for expansion, acquisitions, management buyouts, or shareholder buyouts.",
    deadline: "Ongoing",
    applicationUrl: "https://www.bdc.ca/en/financing/growth-transition-capital",
    sourceUrl: "https://www.bdc.ca/en/financing/growth-transition-capital",
    websiteUrl: "https://www.bdc.ca",
    type: "federal",
    industry: "Multiple Industries",
    department: "Business Development Bank of Canada",
    province: null,
    fundingOrganization: "BDC Capital",
    category: "Growth Financing",
    competitionLevel: "Medium",
    eligibilityCriteria: [
      "Established Canadian business (typically 3+ years)",
      "Positive cash flow and EBITDA",
      "Strong management team",
      "Clear growth or transition strategy",
      "Operations in a stable or growing market"
    ],
    pros: [
      "Patient capital with flexible terms (up to 10 years)",
      "No or limited dilution of ownership",
      "Customized solutions that can be subordinated to existing debt",
      "No personal guarantees required in some cases",
      "Strategic advice from experienced investment professionals"
    ],
    cons: [
      "Higher cost of capital than traditional debt",
      "May include equity features like warrants or royalties",
      "Rigorous due diligence process",
      "Regular reporting requirements",
      "May include business covenants and restrictions"
    ],
    applicationProcess: ["Connect with a BDC Growth & Transition Capital team member who will assess your business needs and structure a customized financing solution."],
    documents: [
      "Business plan with growth or transition strategy",
      "3-5 years of financial statements",
      "Financial projections (3-5 years)",
      "Valuation information (for buyouts or acquisitions)",
      "Management team profiles"
    ],
    websiteDescription: "BDC Capital's Growth & Transition Capital page with information on financing solutions for business expansion and ownership transitions.",
    imageUrl: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&w=500&h=280&q=80",
    applicationTips: "Prepare a well-documented growth plan or transition strategy with clear financial projections. Be ready to demonstrate the management team's capability to execute the plan and achieve projected results.",
    successRate: "Medium",
    featured: false
  }
];

// Function to add grant to database
async function addGrant(grantData) {
  try {
    const response = await fetch('http://localhost:5000/api/admin/grants/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(grantData)
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Added grant: ${grantData.title}`);
    return data;
  } catch (error) {
    console.error(`Failed to add grant ${grantData.title}:`, error);
    throw error;
  }
}

// Main function to add all grants
async function addAllGrants() {
  console.log(`Preparing to add ${grants.length} grants...`);
  
  for (const grant of grants) {
    try {
      await addGrant(grant);
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error adding grant: ${grant.title}`, error);
    }
  }
  
  console.log('Finished adding all grants!');
}

// Run the function
addAllGrants().catch(console.error);