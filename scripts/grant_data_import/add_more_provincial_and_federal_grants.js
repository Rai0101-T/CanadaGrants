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
    console.log('Response:', result);
    return result;
  } catch (error) {
    console.error(`Error adding grant: ${error.message}`);
    return null;
  }
}

async function addAllGrants() {
  // More Provincial Grants
  
  // 1. New Brunswick - NB Growth Program
  console.log('Adding NB Growth Program grant...');
  await addGrant({
    title: "NB Growth Program",
    description: "The New Brunswick Growth Program provides financial assistance to established businesses in New Brunswick to help them become more competitive and increase their growth. The program offers non-repayable contributions to help businesses implement new technology, develop new products, and expand their markets.",
    type: "provincial",
    imageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Ongoing (applications accepted year-round)",
    fundingAmount: "Up to $300,000 (covers up to 50% of eligible costs)",
    category: "Business Growth",
    eligibilityCriteria: [
      "Established business located in New Brunswick",
      "Minimum annual sales of $500,000",
      "In operation for at least two years",
      "Project must involve new technology adoption, market expansion, or product development",
      "Strong growth potential and financial capacity to complete the project"
    ],
    pros: [
      "Non-repayable contributions (grants)",
      "Covers a wide range of business growth activities",
      "Continuous intake (no fixed deadlines)",
      "Complements other provincial and federal programs",
      "Dedicated business development officers provide support"
    ],
    cons: [
      "Requires 50% financial contribution from applicant",
      "Complex application with business plan requirement",
      "Competitive selection process",
      "Reimbursement model (spend first, claim later)",
      "Detailed reporting requirements"
    ],
    websiteUrl: "https://www.opportunities.gnb.ca/",
    featured: false,
    industry: "any",
    province: "New Brunswick",
    competitionLevel: "Medium",
    department: "Opportunities New Brunswick",
    documents: [
      "Business plan",
      "Financial statements (last 2 years)",
      "Detailed project description",
      "Marketing plan (if applicable)",
      "Cost estimates for project expenditures"
    ],
    applicationDates: "Ongoing (applications accepted year-round)"
  });

  // 2. Nova Scotia - Ignite Program
  console.log('Adding Ignite Program grant...');
  await addGrant({
    title: "Ignite Program (Nova Scotia)",
    description: "The Ignite Program supports early-stage Nova Scotia companies to develop and commercialize new technologies. The program provides funding for research projects that help companies overcome specific technical challenges in developing innovative products or services with significant market potential.",
    type: "provincial",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Quarterly application deadlines",
    fundingAmount: "Up to $100,000 (covers up to 50% of eligible project costs)",
    category: "Research & Innovation",
    eligibilityCriteria: [
      "Start-up or SME located in Nova Scotia",
      "Project must involve development of a new technology-based product or service",
      "Must address a clearly defined technical challenge",
      "Collaboration with a researcher from a Nova Scotia post-secondary institution",
      "Project must be completed within 12 months"
    ],
    pros: [
      "Non-repayable funding (grants)",
      "Access to academic expertise and research facilities",
      "Helps bridge gap between research and commercialization",
      "Support for both early-stage and established companies",
      "Industry-academic collaboration"
    ],
    cons: [
      "Requires matching funds from applicant",
      "Research collaboration requirement may be challenging for some companies",
      "Competitive application process",
      "Fixed quarterly deadlines (not continuous intake)",
      "Limited to technology-based projects"
    ],
    websiteUrl: "https://innovacorp.ca/",
    featured: false,
    industry: "Technology",
    province: "Nova Scotia",
    competitionLevel: "High",
    organization: "Innovacorp",
    documents: [
      "Project proposal",
      "Research collaboration agreement",
      "Technical specifications and development plan",
      "Company financial statements",
      "Commercialization strategy"
    ],
    applicationDates: "Quarterly application deadlines"
  });

  // 3. Newfoundland and Labrador - Business Investment Fund
  console.log('Adding NL Business Investment Fund grant...');
  await addGrant({
    title: "Newfoundland and Labrador Business Investment Fund",
    description: "The Newfoundland and Labrador Business Investment Fund provides financial support to businesses in key growth sectors to diversify the provincial economy and create sustainable employment. The program offers a combination of loans and grants for business establishment, expansion, and modernization projects.",
    type: "provincial",
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Ongoing (applications accepted year-round)",
    fundingAmount: "Up to $500,000 (combination of loans and grants)",
    category: "Business Development",
    eligibilityCriteria: [
      "Business operating or planning to operate in Newfoundland and Labrador",
      "Project must create or maintain employment in the province",
      "Focus on priority sectors (manufacturing, aquaculture, technology, tourism, etc.)",
      "Financially viable business plan",
      "Evidence of market demand and economic benefit"
    ],
    pros: [
      "Combination of loans and non-repayable contributions",
      "Supports multiple stages of business development",
      "Available to both new and established businesses",
      "Continuous intake (no fixed deadlines)",
      "Comprehensive support for larger projects"
    ],
    cons: [
      "Complex application process",
      "Requires substantial business contribution (typically 50-80%)",
      "Security may be required for loan components",
      "Funding decisions can take several months",
      "Extensive reporting and monitoring requirements"
    ],
    websiteUrl: "https://www.gov.nl.ca/industry/",
    featured: false,
    industry: "any",
    province: "Newfoundland and Labrador",
    competitionLevel: "Medium",
    department: "Department of Industry, Energy and Technology",
    documents: [
      "Business plan",
      "Financial statements and projections",
      "Project description and timeline",
      "Job creation/retention details",
      "Market analysis and evidence of demand"
    ],
    applicationDates: "Ongoing (applications accepted year-round)"
  });

  // 4. Northwest Territories - Support for Entrepreneurs and Economic Development (SEED)
  console.log('Adding NWT SEED Program grant...');
  await addGrant({
    title: "Support for Entrepreneurs and Economic Development (SEED) Program",
    description: "The SEED Program supports NWT entrepreneurs and small businesses in starting or expanding their businesses, creating employment, and developing the NWT economy. The program provides funding for business planning, start-up, capital acquisition, marketing, and other business development activities.",
    type: "provincial",
    imageUrl: "https://images.unsplash.com/photo-1609621838510-5ad474b7d25d?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Ongoing (applications accepted between April 1 and February 15 each fiscal year)",
    fundingAmount: "Up to $75,000 (varies by stream and project)",
    category: "Business Development",
    eligibilityCriteria: [
      "NWT resident at least 19 years old",
      "NWT-based business (registered and operating in NWT)",
      "Business license in good standing",
      "Project must create economic benefits in the NWT",
      "Applicant must contribute minimum equity (10-30% depending on stream)"
    ],
    pros: [
      "Multiple funding streams for different business needs",
      "Non-repayable contributions",
      "Priority for businesses in small communities",
      "Special focus on traditional economy and tourism",
      "Micro-business stream for smaller projects"
    ],
    cons: [
      "Limited funding amount compared to southern provinces",
      "Funding can be highly competitive",
      "Annual budget may be depleted before fiscal year end",
      "Higher equity contribution for larger projects",
      "Not available during March (fiscal year-end)"
    ],
    websiteUrl: "https://www.iti.gov.nt.ca/en/services/support-entrepreneurs-and-economic-development-seed",
    featured: false,
    industry: "any",
    province: "Northwest Territories",
    competitionLevel: "Medium",
    department: "Department of Industry, Tourism and Investment",
    documents: [
      "Business license",
      "Project proposal",
      "Budget and quotes",
      "Business plan (for larger requests)",
      "Evidence of financial contribution"
    ],
    applicationDates: "Ongoing (April 1 to February 15 annually)"
  });

  // 5. Yukon - Business Development Program
  console.log('Adding Yukon Business Development Program grant...');
  await addGrant({
    title: "Yukon Business Development Program",
    description: "The Yukon Business Development Program supports Yukon businesses in their growth and expansion efforts. The program provides funding for business planning, marketing initiatives, business skills development, and other activities that help Yukon businesses become more competitive and sustainable.",
    type: "provincial",
    imageUrl: "https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Ongoing (applications accepted year-round)",
    fundingAmount: "Up to $50,000 (varies by project type)",
    category: "Business Growth",
    eligibilityCriteria: [
      "Yukon-based business (registered and operating in Yukon)",
      "Minimum 51% Yukon ownership",
      "Business license in good standing",
      "Project must benefit the Yukon economy",
      "Must demonstrate project viability"
    ],
    pros: [
      "Multiple funding categories for different business needs",
      "Non-repayable contributions",
      "Continuous intake (no fixed deadlines)",
      "Can apply for multiple projects in different categories",
      "Special streams for target sectors like tourism"
    ],
    cons: [
      "Lower funding amounts than some other provincial programs",
      "Maximum funding percentage varies by category (50-75%)",
      "Detailed application requirements",
      "Must demonstrate commercial viability",
      "Competitive for limited funds"
    ],
    websiteUrl: "https://yukon.ca/en/doing-business/funding-and-support-business",
    featured: false,
    industry: "any",
    province: "Yukon",
    competitionLevel: "Medium",
    department: "Department of Economic Development",
    documents: [
      "Business license",
      "Project proposal",
      "Budget with quotes",
      "Marketing plan (for marketing projects)",
      "Financial statements (for established businesses)"
    ],
    applicationDates: "Ongoing (applications accepted year-round)"
  });

  // More Federal Grants
  
  // 1. Youth Employment and Skills Strategy (YESS)
  console.log('Adding YESS Program grant...');
  await addGrant({
    title: "Youth Employment and Skills Strategy (YESS) Program",
    description: "The Youth Employment and Skills Strategy Program supports organizations that provide job opportunities for young Canadians, particularly those facing barriers to employment. The program offers funding to help youth develop skills and gain work experience needed to successfully transition into the labor market.",
    type: "federal",
    imageUrl: "https://images.unsplash.com/photo-1587554801471-37976a229b8e?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Periodic calls for proposals (check website for current opportunities)",
    fundingAmount: "Varies by project (typically $250,000 to $1 million per year)",
    category: "Employment",
    eligibilityCriteria: [
      "Not-for-profit organizations, public or private employers, provincial/territorial governments",
      "Indigenous organizations and municipalities",
      "Provide support to youth facing barriers to employment",
      "Participants must be between 15 and 30 years old",
      "Project must align with YESS objectives and priorities"
    ],
    pros: [
      "Substantial funding for larger employment projects",
      "Multi-year funding available (up to 3 years)",
      "Focuses on underrepresented and vulnerable youth",
      "Supports a wide range of employment interventions",
      "Can fund both employment services and wage subsidies"
    ],
    cons: [
      "Highly competitive application process",
      "Complex application with detailed project planning",
      "Limited intake periods (not continuous)",
      "Significant reporting and evaluation requirements",
      "Primarily for organizations rather than individual businesses"
    ],
    websiteUrl: "https://www.canada.ca/en/employment-social-development/services/funding/youth-employment-strategy.html",
    featured: false,
    industry: "any",
    province: null,
    competitionLevel: "High",
    department: "Employment and Social Development Canada",
    documents: [
      "Detailed project proposal",
      "Budget and cash flow projection",
      "Letters of support from partners",
      "Organization governance documents",
      "Performance measurement strategy"
    ],
    applicationDates: "Periodic calls for proposals (check website for current opportunities)"
  });

  // 2. Agricultural Clean Technology Program
  console.log('Adding Agricultural Clean Technology Program grant...');
  await addGrant({
    title: "Agricultural Clean Technology Program",
    description: "The Agricultural Clean Technology Program provides funding to support the adoption of clean technologies in the agriculture sector. The program aims to help reduce greenhouse gas emissions, improve energy efficiency, and promote sustainable growth in Canadian agriculture through innovation and technology adoption.",
    type: "federal",
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Applications accepted until funding is fully allocated",
    fundingAmount: "Up to $2 million (50-75% of eligible project costs)",
    category: "Agriculture",
    eligibilityCriteria: [
      "For-profit organizations operating in the agriculture sector",
      "Not-for-profit organizations supporting the agriculture sector",
      "Projects must reduce environmental impacts through clean technology",
      "Focus on precision agriculture, green energy, or bioeconomy solutions",
      "Technology must be commercially available or near commercial readiness"
    ],
    pros: [
      "Substantial funding for large-scale projects",
      "Covers both research and adoption of clean technologies",
      "Higher funding percentages for Indigenous applicants",
      "Supports both early adopters and technology developers",
      "Aligns with carbon reduction goals and sustainability strategies"
    ],
    cons: [
      "Competitive application process",
      "Detailed environmental impact assessment required",
      "Complex reporting requirements",
      "Requires significant applicant contribution (25-50%)",
      "Technology performance verification may be necessary"
    ],
    websiteUrl: "https://agriculture.canada.ca/en/agricultural-programs-and-services/agricultural-clean-technology-program",
    featured: false,
    industry: "Agriculture",
    province: null,
    competitionLevel: "Medium",
    department: "Agriculture and Agri-Food Canada",
    documents: [
      "Project proposal",
      "Technology specification and performance data",
      "Environmental impact assessment",
      "Financial projections and statements",
      "Evidence of matching funds"
    ],
    applicationDates: "Applications accepted until funding is fully allocated"
  });

  // 3. Export Development Canada (EDC) Programs
  console.log('Adding EDC Programs grant...');
  await addGrant({
    title: "Export Development Canada (EDC) Programs",
    description: "Export Development Canada offers a range of financial solutions to help Canadian companies expand globally. EDC provides export financing, insurance, guarantees, knowledge, and connections to help businesses of all sizes succeed in international markets.",
    type: "federal",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Ongoing (application accepted year-round)",
    fundingAmount: "Varies by program and business needs (from $10,000 to $50+ million)",
    category: "Export Development",
    eligibilityCriteria: [
      "Canadian company with export activities or plans",
      "Financial viability and business capability",
      "Products/services with export potential",
      "Commitment to international expansion",
      "Compliance with EDC's environmental and social risk assessment"
    ],
    pros: [
      "Comprehensive suite of financial tools",
      "Support for businesses of all sizes from startups to multinationals",
      "Risk mitigation tools for international contracts",
      "No fixed upper limit on financing amounts",
      "Global connections and market intelligence"
    ],
    cons: [
      "Primarily financing rather than grants",
      "Underwriting process can be rigorous",
      "Fees and interest rates based on risk assessment",
      "Security or collateral may be required",
      "Environmental review required for certain sectors"
    ],
    websiteUrl: "https://www.edc.ca/",
    featured: false,
    industry: "any",
    province: null,
    competitionLevel: "Low",
    department: "Export Development Canada",
    documents: [
      "Business plan",
      "Financial statements",
      "Export strategy",
      "International contract details (if applicable)",
      "Environmental impact information (for relevant sectors)"
    ],
    applicationDates: "Ongoing (applications accepted year-round)"
  });

  // 4. Scientific Research and Experimental Development (SR&ED) Tax Credit
  console.log('Adding SR&ED Tax Credit grant...');
  await addGrant({
    title: "Scientific Research and Experimental Development (SR&ED) Tax Credit",
    description: "The Scientific Research and Experimental Development Tax Credit is Canada's largest R&D tax incentive program. It provides tax credits and refunds to businesses of all sizes and sectors that conduct scientific research or experimental development work in Canada.",
    type: "federal",
    imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Claims must be filed within 18 months of the tax year end",
    fundingAmount: "Up to 35% refundable tax credit for Canadian-controlled private corporations; 15% for others",
    category: "Research & Development",
    eligibilityCriteria: [
      "Business carrying out eligible R&D in Canada",
      "Project must involve technological advancement or uncertainty",
      "Systematic investigation or research",
      "Detailed documentation of work performed",
      "Must have related expenditures (salaries, materials, etc.)"
    ],
    pros: [
      "One of the most generous R&D programs in the world",
      "Available to businesses of any size or sector",
      "Can claim capital expenses and overhead costs",
      "Refundable credits for Canadian-controlled private corporations",
      "Can be claimed every year for ongoing R&D"
    ],
    cons: [
      "Complex documentation requirements",
      "Technical and financial eligibility criteria",
      "Potential for CRA review or audit",
      "Not a direct funding program (tax credit after expenses incurred)",
      "Requires specialized knowledge to prepare claim"
    ],
    websiteUrl: "https://www.canada.ca/en/revenue-agency/services/scientific-research-experimental-development-tax-incentive-program.html",
    featured: false,
    industry: "any",
    province: null,
    competitionLevel: "Low",
    department: "Canada Revenue Agency",
    documents: [
      "Technical description of R&D projects",
      "Financial information on R&D expenditures",
      "Documentation of work performed",
      "T661 Scientific Research form",
      "T2 Corporation Income Tax Return"
    ],
    applicationDates: "Claims must be filed within 18 months of the tax year end"
  });

  // 5. Build in Canada Innovation Program (BCIP)
  console.log('Adding BCIP grant...');
  await addGrant({
    title: "Innovative Solutions Canada (formerly BCIP)",
    description: "Innovative Solutions Canada (formerly Build in Canada Innovation Program) helps Canadian innovators by funding R&D and testing pre-commercial innovations. The program provides government departments as testing partners for innovative products and services before they hit the market.",
    type: "federal",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Ongoing with regular calls for proposals for specific challenges",
    fundingAmount: "Up to $500,000 for standard innovations; up to $1 million for military innovations",
    category: "Innovation",
    eligibilityCriteria: [
      "Canadian business with fewer than 500 employees",
      "80% of R&D activities must be performed in Canada",
      "80% of labor costs must be incurred in Canada",
      "Innovation must be pre-commercial (TRL 7-9)",
      "Innovation must address specific government challenge or need"
    ],
    pros: [
      "Direct path to sell innovations to government customers",
      "Real-world testing with government departments",
      "Feedback from potential end-users",
      "Retains intellectual property rights with the innovator",
      "Both direct funding and procurement opportunities"
    ],
    cons: [
      "Highly competitive process",
      "Challenge-specific calls (must fit government needs)",
      "Complex proposal requirements",
      "Focus on pre-commercial innovations only",
      "Limited funding availability compared to demand"
    ],
    websiteUrl: "https://www.ic.gc.ca/eic/site/101.nsf/eng/home",
    featured: false,
    industry: "Technology",
    province: null,
    competitionLevel: "High",
    department: "Innovation, Science and Economic Development Canada",
    documents: [
      "Detailed innovation description",
      "Technical specifications",
      "Testing plan proposal",
      "Business capability documentation",
      "Intellectual property information"
    ],
    applicationDates: "Ongoing with regular calls for proposals for specific challenges"
  });

  console.log('All additional grants added successfully.');
}

// Run the function to add all grants
addAllGrants();