import fetch from 'node-fetch';

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
      throw new Error(`Failed to add grant: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`Successfully added grant: ${grantData.title}`);
    return result;
  } catch (error) {
    console.error(`Error adding grant: ${error.message}`);
    return null;
  }
}

// Main function to add grants from the CSBFP list and BDC programs
async function addAllGrants() {
  try {
    // Add key federal programs
    await addGrant({
      title: "Canada Small Business Financing Program (CSBFP)",
      description: "The CSBFP is a loan guarantee program that helps small businesses obtain loans from financial institutions by sharing the risk with lenders. The program makes it easier for small businesses to obtain financing for establishing, expanding, modernizing, or improving their businesses.",
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Ongoing (no application deadline)",
      fundingAmount: "Up to $1 million for any one borrower ($350,000 for equipment and leasehold improvements)",
      category: "Financing",
      eligibilityCriteria: [
        "Small businesses or start-ups operating for profit in Canada",
        "Annual gross revenue below $10 million",
        "Loan must be used to finance eligible costs (equipment, leasehold improvements, property)",
        "Cannot be used for goodwill, inventory, franchise fees, or working capital",
        "Some business activities excluded (farming, non-profit, etc.)"
      ],
      pros: [
        "Higher approval rate than standard business loans",
        "Competitive interest rates (capped at lender's prime + 3%)",
        "Up to 90% of loan guaranteed by government",
        "Longer repayment terms (up to 15 years for real property)",
        "Available through most major financial institutions"
      ],
      cons: [
        "2% registration fee (can be financed as part of loan)",
        "Restrictions on what the loan can be used for",
        "Personal guarantee required (limited to 25% of original loan amount)",
        "Some industries not eligible",
        "Financial institution makes final lending decision"
      ],
      websiteUrl: "https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/eng/home",
      featured: true,
      industry: "any",
      province: null,
      competitionLevel: "Low",
      department: "Innovation, Science and Economic Development Canada",
      documents: [
        "Business plan",
        "Financial statements or projections",
        "Quotes for equipment or improvements",
        "Proof of business registration",
        "Personal financial information"
      ],
      applicationDates: "Ongoing (no application deadline)"
    });

    await addGrant({
      title: "BDC Business Loans",
      description: "The Business Development Bank of Canada (BDC) offers various financing solutions designed specifically for Canadian entrepreneurs, including start-up financing, equipment purchasing, working capital, growth & transition, and technology financing.",
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Ongoing (no application deadline)",
      fundingAmount: "From $10,000 to several million (varies by loan type)",
      category: "Financing",
      eligibilityCriteria: [
        "Canadian business operating commercially",
        "Good credit history and management experience",
        "Positive cash flow or realistic projections",
        "Personal investment in the business",
        "Strong business plan with market potential"
      ],
      pros: [
        "Specialized in business financing with flexible terms",
        "Longer amortization periods than traditional lenders",
        "Principal payment postponements available during challenging times",
        "No penalties for early repayment",
        "Advisory services included with most loans"
      ],
      cons: [
        "Interest rates may be higher than traditional banks",
        "Approval process can be lengthy",
        "May require personal guarantees",
        "Stringent financial documentation requirements",
        "Some industry restrictions apply"
      ],
      websiteUrl: "https://www.bdc.ca/en/financing",
      featured: true,
      industry: "any",
      province: null,
      competitionLevel: "Medium",
      department: "Business Development Bank of Canada",
      documents: [
        "Business plan",
        "Financial statements (past 3 years if available)",
        "Cash flow projections",
        "Personal net worth statement",
        "List of assets to be purchased (if applicable)"
      ],
      applicationDates: "Ongoing (no application deadline)"
    });

    await addGrant({
      title: "NRC Industrial Research Assistance Program (IRAP)",
      description: "The National Research Council's IRAP provides financial assistance, advisory services, and connections to help Canadian small and medium-sized businesses increase their innovation capacity and commercialize new products and services.",
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1581093588401-fdd3d37e28f1?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Ongoing with periodic calls for specific initiatives",
      fundingAmount: "Small projects: up to $50,000; Larger projects: up to $10 million",
      category: "Research and Development",
      eligibilityCriteria: [
        "For-profit, incorporated company in Canada",
        "500 or fewer full-time employees",
        "Plan to pursue growth and profit through innovation",
        "Financial capacity to complete the project",
        "Technical capability to achieve project goals"
      ],
      pros: [
        "Non-repayable contributions (not loans)",
        "Expert technical and business advice from Industrial Technology Advisors",
        "Networking opportunities with research institutions",
        "Can cover up to 80% of eligible project costs",
        "Additional youth employment funding available"
      ],
      cons: [
        "Highly competitive application process",
        "Must demonstrate clear innovation component",
        "Extensive reporting requirements",
        "Reimbursement-based (need to spend money first)",
        "Project scope must be well-defined"
      ],
      websiteUrl: "https://nrc.canada.ca/en/support-technology-innovation",
      featured: true,
      industry: "any",
      province: null,
      competitionLevel: "High",
      department: "National Research Council Canada",
      documents: [
        "Detailed project proposal",
        "Incorporation documents",
        "Financial statements",
        "Project budget with breakdown of costs",
        "Evidence of technical capability"
      ],
      applicationDates: "Ongoing with periodic calls for specific initiatives"
    });

    await addGrant({
      title: "CanExport Program",
      description: "The CanExport program provides direct financial assistance to Canadian small and medium-sized businesses to help them develop new export opportunities and markets, especially in high-growth emerging markets.",
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1529563021893-c9966433d256?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Ongoing (applications must be submitted before activities begin)",
      fundingAmount: "Between $20,000 and $75,000 (up to 75% of eligible expenses)",
      category: "Export Development",
      eligibilityCriteria: [
        "Canadian for-profit company with 1-500 full-time employees",
        "Annual revenue in Canada of $100,000 to $100 million",
        "Minimal or no existing exports to target market(s)",
        "Ability to cover at least 25% of project costs",
        "Market entry plan and product/service ready for export"
      ],
      pros: [
        "Non-repayable funding (not a loan)",
        "Can apply for multiple target markets",
        "Covers various market entry activities",
        "Quick application process (typically 25 business days)",
        "Can reapply for different markets"
      ],
      cons: [
        "Reimbursement-based (need to spend money first)",
        "Cannot apply for markets where already established",
        "Activities must be completed within one year",
        "Limited to specific eligible activities",
        "Cannot combine with other federal export programs"
      ],
      websiteUrl: "https://www.tradecommissioner.gc.ca/funding-financement/canexport/index.aspx",
      featured: false,
      industry: "any",
      province: null,
      competitionLevel: "Medium",
      department: "Global Affairs Canada",
      documents: [
        "Export marketing plan",
        "Detailed budget for project activities",
        "Company financial statements",
        "Business number and incorporation documents",
        "Description of products/services for export"
      ],
      applicationDates: "Ongoing (applications must be submitted before activities begin)"
    });

    await addGrant({
      title: "Futurpreneur Canada Start-Up Program",
      description: "Futurpreneur Canada provides financing, mentoring, and support tools to entrepreneurs aged 18-39. Their flagship Start-Up Program offers collateral-free loans along with expert mentorship to help young entrepreneurs launch successful businesses.",
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Ongoing (no application deadline)",
      fundingAmount: "Up to $60,000 ($20,000 from Futurpreneur and up to $40,000 from BDC)",
      category: "Start-Up Financing",
      eligibilityCriteria: [
        "Canadian citizen or permanent resident aged 18-39",
        "Business must be majority-owned by eligible young entrepreneur(s)",
        "Must operate business full-time in Canada",
        "New business or in operation less than 12 months",
        "Agree to work with a Futurpreneur mentor for 2 years"
      ],
      pros: [
        "Collateral-free loan with favorable terms",
        "Two-year mentorship with experienced business professional",
        "Pre-launch coaching and business resources",
        "Low interest rates with flexible repayment options",
        "Additional resources and networking opportunities"
      ],
      cons: [
        "Age restrictions (18-39 only)",
        "Business must be relatively new or pre-launch",
        "Personal guarantee required for loan",
        "Cannot be used to purchase existing business",
        "Thorough application process (may take several weeks)"
      ],
      websiteUrl: "https://www.futurpreneur.ca/en/get-started/financing-and-mentoring/",
      featured: false,
      industry: "any",
      province: null,
      competitionLevel: "Medium",
      department: "Futurpreneur Canada",
      documents: [
        "Business plan",
        "Cash flow projection (2 years)",
        "Personal financial statements",
        "Credit check authorization",
        "Proof of age and Canadian status"
      ],
      applicationDates: "Ongoing (no application deadline)"
    });

    await addGrant({
      title: "Women Entrepreneurship Strategy (WES) Ecosystem Fund",
      description: "The WES Ecosystem Fund helps non-profit organizations deliver support for women entrepreneurs to start and grow businesses. It aims to strengthen capacity within the entrepreneurship ecosystem and close gaps in service for women entrepreneurs.",
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1573496130407-57329f01f769?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Periodic calls for applications",
      fundingAmount: "Varies by project (up to several million dollars)",
      category: "Women in Business",
      eligibilityCriteria: [
        "Canadian non-profit organization",
        "Proposal must support women entrepreneurs",
        "Address gaps in the entrepreneurship ecosystem",
        "Demonstrate partnerships and collaboration",
        "Clear plan for sustainability after funding ends"
      ],
      pros: [
        "Substantial funding for ecosystem development",
        "Potential for multi-year funding",
        "Support for innovative delivery models",
        "Emphasis on underrepresented women entrepreneurs",
        "Ability to create systemic change"
      ],
      cons: [
        "Only open to organizations, not individual entrepreneurs",
        "Highly competitive application process",
        "Extensive reporting requirements",
        "Periodic calls for applications (not ongoing)",
        "Project scope must be comprehensive"
      ],
      websiteUrl: "https://ised-isde.canada.ca/site/women-entrepreneurship-strategy/en",
      featured: false,
      industry: "any",
      province: null,
      competitionLevel: "High",
      department: "Innovation, Science and Economic Development Canada",
      documents: [
        "Detailed project proposal",
        "Organizational profile and capacity",
        "Budget and financial information",
        "Letters of support from partners",
        "Performance measurement framework"
      ],
      applicationDates: "Periodic calls for applications"
    });

    await addGrant({
      title: "Sustainable Development Technology Canada (SDTC) Funding",
      description: "SDTC funds and supports Canadian companies developing and demonstrating new environmental technologies that address climate change, clean air, clean water, and clean soil issues. They bridge the gap between research and commercialization.",
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Ongoing intake process",
      fundingAmount: "From $50,000 to $10 million",
      category: "Clean Technology",
      eligibilityCriteria: [
        "Canadian company with proprietary technology",
        "Pre-commercial stage (TRL 3-8) clean technology",
        "Strong value proposition and market potential",
        "Quantifiable environmental benefits",
        "Potential for significant global market"
      ],
      pros: [
        "Non-repayable funding (not a loan)",
        "Support throughout technology development lifecycle",
        "Access to network of investors and partners",
        "Technical and business support beyond funding",
        "High credibility for attracting additional investment"
      ],
      cons: [
        "Extensive due diligence process",
        "Highly competitive selection process",
        "Significant reporting and milestone requirements",
        "Must demonstrate clear environmental benefits",
        "Project typically requires additional funding sources"
      ],
      websiteUrl: "https://www.sdtc.ca/en/",
      featured: false,
      industry: "Clean Technology",
      province: null,
      competitionLevel: "Very High",
      department: "Sustainable Development Technology Canada",
      documents: [
        "Detailed project proposal with technology description",
        "Environmental benefits assessment",
        "Market analysis and commercialization plan",
        "Financial projections and funding request",
        "Team capabilities and experience"
      ],
      applicationDates: "Ongoing intake process"
    });

    // Add provincial programs from the list
    await addGrant({
      title: "Ontario Small Business Enterprise Centres (SBECs)",
      description: "Small Business Enterprise Centres provide entrepreneurs with all the tools they need to start and grow their businesses, including business plan consultations, access to resources, workshops, seminars, and mentorship.",
      type: "provincial",
      imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Ongoing services and periodic program intakes",
      fundingAmount: "Varies by program (primarily advisory services with some grant programs)",
      category: "Business Support",
      eligibilityCriteria: [
        "Ontario-based entrepreneur or small business",
        "Local residency (for specific SBEC catchment area)",
        "For grant programs: meet specific program criteria",
        "Commitment to business development process",
        "Participation in required training (for some programs)"
      ],
      pros: [
        "Free or low-cost advisory services",
        "Local support from advisors familiar with regional economy",
        "Network of over 50 centres across Ontario",
        "Access to Starter Company Plus and Summer Company grants in many locations",
        "Ongoing support throughout business lifecycle"
      ],
      cons: [
        "Grant funding limited and competitive when available",
        "Services vary by location",
        "May have waiting periods for one-on-one consultations",
        "Limited financial assistance compared to other programs",
        "Some programs restricted to specific demographics"
      ],
      websiteUrl: "https://www.ontario.ca/page/small-business-enterprise-centre-locations",
      featured: false,
      industry: "any",
      province: "Ontario",
      competitionLevel: "Low",
      department: "Ontario Ministry of Economic Development, Job Creation and Trade",
      documents: [
        "Business registration (if applicable)",
        "Business plan (for advisory services)",
        "Financial projections (for funding programs)",
        "Personal identification",
        "Additional documents as specified by local SBEC"
      ],
      applicationDates: "Ongoing services and periodic program intakes"
    });

    await addGrant({
      title: "Alberta Innovates Programs",
      description: "Alberta Innovates offers a suite of programs to help businesses, researchers, and entrepreneurs develop and commercialize new technology, products, and services. Their programs support various stages from ideation to scale-up.",
      type: "provincial",
      imageUrl: "https://images.unsplash.com/photo-1585858229735-cd08d8cb1980?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Varies by program (some ongoing, some with specific intake periods)",
      fundingAmount: "Varies by program (from $10,000 to $1 million+)",
      category: "Innovation",
      eligibilityCriteria: [
        "Alberta-based organization (typically)",
        "Project aligns with Alberta Innovates strategic priorities",
        "Demonstrates innovation or technology development",
        "Potential for economic benefit to Alberta",
        "Meet program-specific eligibility requirements"
      ],
      pros: [
        "Variety of programs for different business stages",
        "Support for multiple sectors and technologies",
        "Both financial and advisory support available",
        "Potential for follow-on funding through multiple programs",
        "Connection to Alberta's innovation ecosystem"
      ],
      cons: [
        "Competitive application process for most programs",
        "Detailed reporting requirements",
        "Some programs require matching funds",
        "Approval process can be lengthy",
        "Must align with provincial strategic priorities"
      ],
      websiteUrl: "https://albertainnovates.ca/programs/",
      featured: false,
      industry: "any",
      province: "Alberta",
      competitionLevel: "Medium",
      department: "Alberta Innovates",
      documents: [
        "Program application form",
        "Project proposal",
        "Budget and financial information",
        "Business/technology development plan",
        "Additional documents as specified by program"
      ],
      applicationDates: "Varies by program (some ongoing, some with specific intake periods)"
    });

    await addGrant({
      title: "Quebec Tax Credits for E-business (TCEB)",
      description: "The Tax Credit for E-Business supports Quebec companies that carry out innovative, high value-added activities in the information technology sector, particularly in the design of e-commerce solutions and software.",
      type: "provincial",
      imageUrl: "https://images.unsplash.com/photo-1630646128606-4d2b37835860?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Annual (applied for during tax filing)",
      fundingAmount: "Up to 30% of eligible salaries (maximum $25,000 per employee annually)",
      category: "Tax Credit",
      eligibilityCriteria: [
        "Corporation with establishment in Quebec",
        "At least 75% of activities in information technology sector",
        "Annual gross revenue of $100,000 or more",
        "Eligible activities include e-commerce solutions, software development, etc.",
        "Meet minimum number of qualified employees"
      ],
      pros: [
        "Refundable tax credit (payment received even without tax payable)",
        "Significant reduction in labor costs for eligible businesses",
        "Can be combined with other tax credits (with limitations)",
        "Available for up to 10 years",
        "No limit on company size or revenue"
      ],
      cons: [
        "Complex eligibility criteria and application process",
        "Requires certification from Investissement Québec",
        "Annual verification and renewal process",
        "Only applies to specific IT activities",
        "Subject to changes in provincial tax policy"
      ],
      websiteUrl: "https://www.investquebec.com/quebec/en/financial-products/tax-credits/tax-credit-for-e-business.html",
      featured: false,
      industry: "Information Technology",
      province: "Quebec",
      competitionLevel: "Medium",
      department: "Investissement Québec & Revenu Québec",
      documents: [
        "Application for initial qualification certificate",
        "Detailed description of business activities",
        "Employee information and job descriptions",
        "Financial statements",
        "Tax filings"
      ],
      applicationDates: "Annual (applied for during tax filing)"
    });

    await addGrant({
      title: "Atlantic Canada Opportunities Agency (ACOA) Programs",
      description: "ACOA offers a range of programs to support businesses and economic development in Atlantic Canada, including the Business Development Program, Atlantic Innovation Fund, and Regional Economic Growth through Innovation programs.",
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1531754796549-7195e2ab42c4?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Ongoing intake for most programs",
      fundingAmount: "Varies by program (from $10,000 to several million)",
      category: "Business Development",
      eligibilityCriteria: [
        "Business or organization located in Atlantic Canada",
        "Project contributes to economic growth in the region",
        "Demonstrated need for financial assistance",
        "Sufficient management capability and financial commitment",
        "Meet program-specific eligibility requirements"
      ],
      pros: [
        "Tailored to Atlantic Canada's economic needs",
        "Various funding options (loans, contributions, etc.)",
        "Support throughout application and project implementation",
        "Programs for various business stages and sizes",
        "Regional offices provide localized support"
      ],
      cons: [
        "Approval process can be lengthy",
        "Detailed reporting and compliance requirements",
        "Some programs require matching funds",
        "Focus on priority sectors may limit eligibility",
        "Competitive application process for larger projects"
      ],
      websiteUrl: "https://www.canada.ca/en/atlantic-canada-opportunities.html",
      featured: false,
      industry: "any",
      province: null,
      competitionLevel: "Medium",
      department: "Atlantic Canada Opportunities Agency",
      documents: [
        "Project proposal or business plan",
        "Financial statements and projections",
        "Detailed project budget",
        "Evidence of other financing sources",
        "Supporting documents based on specific program"
      ],
      applicationDates: "Ongoing intake for most programs"
    });

    // Add an industry-specific grant from the list
    await addGrant({
      title: "Canadian Agricultural Partnership Programs",
      description: "The Canadian Agricultural Partnership is a five-year federal-provincial-territorial initiative supporting Canada's agriculture, agri-food and agri-based products sector through various programs focusing on innovation, competitiveness, and sustainability.",
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Varies by program and province",
      fundingAmount: "Varies by program (from $5,000 to $1 million+)",
      category: "Agriculture",
      eligibilityCriteria: [
        "Involvement in the agriculture, agri-food, or agri-product sector",
        "Business or organization registered in Canada",
        "Project aligns with program priorities",
        "Meet program-specific requirements",
        "Proof of financial viability or project sustainability"
      ],
      pros: [
        "Comprehensive programs covering various aspects of agriculture",
        "Both federal and provincial delivery streams",
        "Support for innovation and technology adoption",
        "Programs for various scales of operation (small to large)",
        "Focus on long-term sector sustainability"
      ],
      cons: [
        "Complex program structure with different delivery mechanisms",
        "Application windows vary by province and program",
        "Some programs require cost-sharing",
        "Competitive application process for most programs",
        "Detailed reporting requirements"
      ],
      websiteUrl: "https://agriculture.canada.ca/en/about-our-department/key-departmental-initiatives/canadian-agricultural-partnership",
      featured: false,
      industry: "Agriculture",
      province: null,
      competitionLevel: "Medium",
      department: "Agriculture and Agri-Food Canada",
      documents: [
        "Program application form",
        "Project proposal",
        "Cost estimates and quotes",
        "Business registration documents",
        "Financial information as specified by program"
      ],
      applicationDates: "Varies by program and province"
    });

    // Add a private organization grant from the list
    await addGrant({
      title: "RBC Small Business Grants",
      description: "RBC offers various grant programs for Canadian small businesses, including the Women in Enterprise Grant, Tech for Nature Grant, and other initiatives that support entrepreneurship, innovation, and community development.",
      type: "private",
      imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Periodic calls for applications",
      fundingAmount: "$10,000 to $100,000 (varies by program)",
      category: "Small Business",
      eligibilityCriteria: [
        "Canadian-registered business",
        "Meet program-specific criteria (e.g., women-owned for Women in Enterprise)",
        "Demonstrates innovation or community impact",
        "In operation for minimum specified period (varies by program)",
        "Alignment with RBC community priorities"
      ],
      pros: [
        "Non-repayable grants (not loans)",
        "Additional business support and mentorship",
        "Exposure through RBC networks and channels",
        "Relatively streamlined application process",
        "Combines financial support with networking opportunities"
      ],
      cons: [
        "Highly competitive application process",
        "Limited application windows",
        "Program focus areas may change annually",
        "Some programs have specific demographic requirements",
        "Typically requires established business (not pre-revenue)"
      ],
      websiteUrl: "https://www.rbc.com/community-social-impact/",
      featured: false,
      industry: "any",
      province: null,
      competitionLevel: "High",
      organization: "Royal Bank of Canada",
      documents: [
        "Grant application form",
        "Business profile and history",
        "Financial information",
        "Project or business growth plan",
        "Supporting documentation as specified by program"
      ],
      applicationDates: "Periodic calls for applications"
    });

    console.log("All CSBFP and BDC grants added successfully!");
  } catch (error) {
    console.error("Error adding grants:", error);
  }
}

// Run the function to add all grants
addAllGrants();