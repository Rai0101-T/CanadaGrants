import { db } from './server/db';
import { grants } from './shared/schema';
import { eq } from 'drizzle-orm';

// Define the grant data
const grantsData = [
  // Federal Grants
  {
    title: "Canada Small Business Financing Program (CSBFP)",
    description: "A program that makes it easier for small businesses to get loans from financial institutions by sharing the risk with lenders.",
    type: "federal" as const,
    industry: "Business",
    fundingAmount: "$1,000,000",
    deadline: "Ongoing",
    featured: true,
    category: "Financing",
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["Small businesses with gross annual revenue under $10 million", "Canadian businesses operating for profit"],
    pros: ["Up to $1,000,000 in funding", "Lower interest rates than typical loans", "Longer repayment terms"],
    cons: ["2% registration fee", "Higher interest rate than conventional loans"],
    fundingOrganization: "Innovation, Science and Economic Development Canada",
    department: "Innovation, Science and Economic Development Canada",
    websiteUrl: "https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/eng/home",
    applicationLink: "https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/eng/h_la00007.html",
    applicationProcess: "Apply through a financial institution (banks, credit unions)",
    documents: ["Business plan", "Financial statements", "Cash flow projections"],
    whoCanApply: "Small businesses in Canada with gross annual revenues of $10 million or less"
  },
  {
    title: "Business Development Bank of Canada (BDC) Programs",
    description: "Various financing and advisory solutions for entrepreneurs at every stage of their business.",
    type: "federal" as const,
    industry: "Business",
    fundingAmount: "Up to $5,000,000",
    deadline: "Ongoing",
    featured: true,
    category: "Financing",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["Canadian businesses", "Viable business model"],
    pros: ["Flexible financing options", "Advisory services", "Longer repayment terms"],
    cons: ["Strict qualification criteria", "May require collateral"],
    fundingOrganization: "Business Development Bank of Canada",
    department: "Business Development Bank of Canada",
    websiteUrl: "https://www.bdc.ca/",
    applicationLink: "https://www.bdc.ca/en/financing",
    applicationProcess: "Complete an online application or contact a BDC representative",
    documents: ["Business plan", "Financial statements", "Tax returns"],
    whoCanApply: "Canadian businesses with growth potential"
  },
  {
    title: "National Research Council of Canada Industrial Research Assistance Program (NRC IRAP)",
    description: "Financial support and advisory services for technology innovation projects.",
    type: "federal" as const,
    industry: "Technology",
    fundingAmount: "Up to $10,000,000",
    deadline: "Varies by program",
    featured: true,
    category: "Research and Development",
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "High" as const,
    eligibilityCriteria: ["Small to medium-sized enterprises", "Innovative technology development"],
    pros: ["Non-repayable funding", "Expert advisory services", "Network of resources"],
    cons: ["Competitive application process", "Detailed reporting requirements"],
    fundingOrganization: "National Research Council of Canada",
    department: "National Research Council of Canada",
    websiteUrl: "https://nrc.canada.ca/en/support-technology-innovation",
    applicationLink: "https://nrc.canada.ca/en/support-technology-innovation/financial-support-technology-innovation-through-nrc-irap",
    applicationProcess: "Contact an Industrial Technology Advisor (ITA)",
    documents: ["Project proposal", "Financial statements", "Technical documentation"],
    whoCanApply: "Canadian for-profit small and medium-sized businesses"
  },
  {
    title: "CanExport Program",
    description: "Financial assistance for Canadian businesses looking to develop new export opportunities.",
    type: "federal" as const,
    industry: "International Trade",
    fundingAmount: "Up to $75,000",
    deadline: "Ongoing",
    featured: false,
    category: "Export",
    imageUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["Canadian small and medium-sized enterprises", "Annual revenue between $100,000 and $100 million"],
    pros: ["Covers up to 75% of eligible expenses", "Wide range of eligible activities", "Relatively quick approval process"],
    cons: ["Reimbursement-based funding", "Some activities not eligible"],
    fundingOrganization: "Global Affairs Canada",
    department: "Global Affairs Canada",
    websiteUrl: "https://www.tradecommissioner.gc.ca/funding_support_programs-programmes_de_financement_de_soutien.aspx?lang=eng",
    applicationLink: "https://www.tradecommissioner.gc.ca/funding-financement/canexport/index.aspx?lang=eng",
    applicationProcess: "Apply online through the CanExport website",
    documents: ["Export marketing plan", "Financial statements", "Project proposal"],
    whoCanApply: "Canadian small and medium-sized enterprises with $100,000 to $100 million in annual revenue"
  },
  {
    title: "Futurpreneur Canada",
    description: "Financing, mentoring and business resources for young entrepreneurs.",
    type: "federal" as const,
    industry: "Youth Entrepreneurship",
    fundingAmount: "Up to $60,000",
    deadline: "Ongoing",
    featured: true,
    category: "Startup",
    imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["Canadian citizens or permanent residents aged 18-39", "Business less than 1 year old or not yet launched"],
    pros: ["Includes mentorship", "No collateral required", "Startup-friendly terms"],
    cons: ["Age restrictions", "Must be matched with BDC loan for full amount"],
    fundingOrganization: "Futurpreneur Canada",
    department: "Innovation, Science and Economic Development Canada",
    websiteUrl: "https://www.futurpreneur.ca/",
    applicationLink: "https://www.futurpreneur.ca/en/get-started/financing-and-mentoring/",
    applicationProcess: "Complete an online application and submit a business plan",
    documents: ["Business plan", "Cash flow projection", "Personal net worth statement"],
    whoCanApply: "Canadian entrepreneurs aged 18-39"
  },
  {
    title: "Women Entrepreneurship Strategy (WES)",
    description: "A comprehensive initiative to help women grow their businesses through access to financing, talent, networks and expertise.",
    type: "federal" as const,
    industry: "Women Entrepreneurship",
    fundingAmount: "Varies by program",
    deadline: "Varies by program",
    featured: true,
    category: "Equity and Diversity",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["Women-owned or women-led businesses", "Canadian businesses"],
    pros: ["Targeted support for women entrepreneurs", "Multiple funding streams", "Access to networks"],
    cons: ["Competitive application process", "Limited funding windows"],
    fundingOrganization: "Innovation, Science and Economic Development Canada",
    department: "Innovation, Science and Economic Development Canada",
    websiteUrl: "https://ised-isde.canada.ca/site/women-entrepreneurship-strategy/en",
    applicationLink: "https://ised-isde.canada.ca/site/women-entrepreneurship-strategy/en/women-entrepreneurship-strategy-ecosystem-fund",
    applicationProcess: "Varies by specific program within WES",
    documents: ["Business plan", "Financial statements", "Project proposal"],
    whoCanApply: "Women-owned or women-led businesses in Canada"
  },
  {
    title: "Strategic Innovation Fund",
    description: "Support for large-scale, transformative innovation projects in Canada.",
    type: "federal" as const,
    industry: "Innovation",
    fundingAmount: "$10,000,000+",
    deadline: "Ongoing",
    featured: false,
    category: "Innovation",
    imageUrl: "https://images.unsplash.com/photo-1495592822108-9e6261896da8?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "High" as const,
    eligibilityCriteria: ["Large-scale projects", "Minimum $10 million in requested contribution"],
    pros: ["Substantial funding amounts", "Support for various innovation activities", "Flexible terms"],
    cons: ["Extremely competitive", "Complex application process", "Long evaluation timeframe"],
    fundingOrganization: "Innovation, Science and Economic Development Canada",
    department: "Innovation, Science and Economic Development Canada",
    websiteUrl: "https://ised-isde.canada.ca/site/strategic-innovation-fund/en",
    applicationLink: "https://ised-isde.canada.ca/site/strategic-innovation-fund/en/applying-strategic-innovation-fund",
    applicationProcess: "Contact the Strategic Innovation Fund before applying",
    documents: ["Detailed project proposal", "Business plan", "Financial models", "Economic impact assessment"],
    whoCanApply: "Large corporations, industry consortia, and research organizations"
  },
  {
    title: "Sustainable Development Technology Canada (SDTC)",
    description: "Funding for cleantech projects and companies developing new environmental technologies.",
    type: "federal" as const,
    industry: "Cleantech",
    fundingAmount: "Up to $5,000,000",
    deadline: "Ongoing",
    featured: false,
    category: "Clean Technology",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "High" as const,
    eligibilityCriteria: ["Novel cleantech solutions", "Potential for environmental and economic benefits"],
    pros: ["Non-dilutive funding", "Support throughout development cycle", "Connection to industry partners"],
    cons: ["Highly competitive", "Multi-stage application process", "Focus on pre-commercial technologies"],
    fundingOrganization: "Sustainable Development Technology Canada",
    department: "Environment and Climate Change Canada",
    websiteUrl: "https://www.sdtc.ca/en/",
    applicationLink: "https://www.sdtc.ca/en/apply/",
    applicationProcess: "Submit an initial application online and pass through multiple evaluation stages",
    documents: ["Project proposal", "Technology description", "Market analysis", "Environmental benefits quantification"],
    whoCanApply: "Canadian companies developing innovative environmental technologies"
  },
  {
    title: "Canada Digital Adoption Program",
    description: "Helps small and medium-sized businesses boost their e-commerce presence and digitize their operations.",
    type: "federal" as const,
    industry: "Digital Technology",
    fundingAmount: "Up to $15,000",
    deadline: "March 31, 2025",
    featured: true,
    category: "Digital Transformation",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Low" as const,
    eligibilityCriteria: ["Small or medium-sized enterprise", "For-profit business", "1+ employees"],
    pros: ["Digital plan micro-grants", "Youth hiring wage subsidies", "Interest-free loans"],
    cons: ["Some streams require matching funds", "Limited to specific digital activities"],
    fundingOrganization: "Innovation, Science and Economic Development Canada",
    department: "Innovation, Science and Economic Development Canada",
    websiteUrl: "https://ised-isde.canada.ca/site/digital-adoption-program/en",
    applicationLink: "https://ised-isde.canada.ca/site/digital-adoption-program/en/boost-your-business-technology-stream",
    applicationProcess: "Apply online through program website",
    documents: ["Business number", "Financial statements", "Digital needs assessment"],
    whoCanApply: "Small and medium-sized businesses across Canada"
  },
  {
    title: "Innovation Canada",
    description: "A one-stop-shop for businesses seeking innovation funding and support from all levels of government.",
    type: "federal" as const,
    industry: "Innovation",
    fundingAmount: "Varies by program",
    deadline: "Varies by program",
    featured: false,
    category: "Resources",
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["Canadian businesses", "Specific criteria vary by program"],
    pros: ["Single access point to multiple programs", "Personalized list of programs", "Streamlined discovery process"],
    cons: ["Not a direct funding source", "Still need to apply to individual programs"],
    fundingOrganization: "Innovation, Science and Economic Development Canada",
    department: "Innovation, Science and Economic Development Canada",
    websiteUrl: "https://innovation.ised-isde.canada.ca/",
    applicationLink: "https://innovation.ised-isde.canada.ca/s/?language=en",
    applicationProcess: "Use the online tool to find programs matching your needs",
    whoCanApply: "Any Canadian business seeking innovation support"
  },

  // Provincial Grants
  {
    title: "Small Business Enterprise Centres (SBECs)",
    description: "Local centers providing business consulting services and support to small businesses and entrepreneurs in Ontario.",
    type: "provincial" as const,
    province: "Ontario",
    industry: "Business",
    fundingAmount: "Varies by program",
    deadline: "Ongoing",
    featured: true,
    category: "Business Support",
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Low" as const,
    eligibilityCriteria: ["Ontario-based small businesses", "Specific criteria vary by program"],
    pros: ["Local support", "Free or low-cost services", "Personalized guidance"],
    cons: ["Limited direct funding", "Services vary by location"],
    fundingOrganization: "Government of Ontario",
    department: null,
    websiteUrl: "https://www.ontario.ca/page/small-business-enterprise-centre-locations",
    applicationLink: "https://www.ontario.ca/page/small-business-enterprise-centre-locations",
    applicationProcess: "Contact your local SBEC",
    documents: [],
    whoCanApply: "Ontario small businesses and entrepreneurs"
  },
  {
    title: "Ontario Centres of Excellence (OCE)",
    description: "Connects industry and academia to commercialize innovations and create jobs in Ontario.",
    type: "provincial" as const,
    province: "Ontario",
    industry: "Innovation",
    fundingAmount: "Up to $250,000",
    deadline: "Varies by program",
    featured: false,
    category: "Research and Innovation",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "High" as const,
    eligibilityCriteria: ["Ontario-based businesses", "Collaboration with academic institutions"],
    pros: ["Industry-academic collaboration", "Commercialization support", "Technical expertise"],
    cons: ["Competitive application process", "Matching funds often required"],
    fundingOrganization: "Government of Ontario",
    department: null,
    websiteUrl: "https://www.oce-ontario.org/",
    applicationLink: "https://www.oce-ontario.org/programs",
    applicationProcess: "Submit an application through the online portal",
    documents: ["Project proposal", "Partnership agreement", "Budget"],
    whoCanApply: "Ontario businesses collaborating with academic institutions"
  },
  {
    title: "Ontario Together Fund",
    description: "Support for businesses that retool operations to produce PPE and critical supplies.",
    type: "provincial" as const,
    province: "Ontario",
    industry: "Manufacturing",
    fundingAmount: "Up to $2,500,000",
    deadline: "Ongoing",
    featured: false,
    category: "Manufacturing",
    imageUrl: "https://images.unsplash.com/photo-1507920549782-050bfbccd361?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["Ontario-based manufacturers", "Production of critical supplies"],
    pros: ["Substantial funding amounts", "Support for equipment purchases", "Fast-tracked applications"],
    cons: ["Specific focus on critical supplies", "Matching funds required"],
    fundingOrganization: "Government of Ontario",
    department: null,
    websiteUrl: "https://www.ontario.ca/page/ontario-together-fund",
    applicationLink: "https://www.ontario.ca/page/ontario-together-fund",
    applicationProcess: "Submit a proposal through the online form",
    documents: ["Project plan", "Financial statements", "Cost estimates"],
    whoCanApply: "Ontario manufacturers capable of retooling for critical supplies"
  },
  {
    title: "BC Launch Online Grant",
    description: "Helps businesses create or improve their online store to attract new local customers.",
    type: "provincial" as const,
    province: "British Columbia",
    industry: "E-commerce",
    fundingAmount: "Up to $7,500",
    deadline: "Until funds are allocated",
    featured: true,
    category: "Digital",
    imageUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["BC-based business", "Registered in BC", "GST registered", "1+ year in operation"],
    pros: ["Covers 75% of eligible expenses", "Simple application process", "Quick approvals"],
    cons: ["Limited to e-commerce activities", "First-come, first-served"],
    fundingOrganization: "Government of British Columbia",
    department: null,
    websiteUrl: "https://launchonline.ca/",
    applicationLink: "https://launchonline.ca/",
    applicationProcess: "Complete the online application form",
    documents: ["Business registration", "Business plan", "Quotes from service providers"],
    whoCanApply: "BC-based businesses looking to launch or improve their e-commerce presence"
  },
  {
    title: "BC Employer Training Grant",
    description: "Provides funding for employers to support skills training for their current or new employees.",
    type: "provincial" as const,
    province: "British Columbia",
    industry: "Workforce Development",
    fundingAmount: "Up to $10,000 per employee",
    deadline: "Ongoing",
    featured: false,
    category: "Training",
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Low" as const,
    eligibilityCriteria: ["BC-based employers", "Training must address skills needs"],
    pros: ["Covers up to 80% of training costs", "Various training options", "Multiple streams available"],
    cons: ["Reimbursement-based", "Must pay upfront", "Approval required before training starts"],
    fundingOrganization: "Government of British Columbia",
    department: null,
    websiteUrl: "https://www.workbc.ca/Employer-Resources/BC-Employer-Training-Grant.aspx",
    applicationLink: "https://www.workbc.ca/Employer-Resources/BC-Employer-Training-Grant/Apply-for-Funding.aspx",
    applicationProcess: "Apply online through WorkBC",
    documents: ["Training plan", "Cost quotes", "Business information"],
    whoCanApply: "BC employers looking to upskill current or new employees"
  },
  {
    title: "Innovate BC programs",
    description: "Various funding programs to help BC companies start and scale their technology businesses.",
    type: "provincial" as const,
    province: "British Columbia",
    industry: "Technology",
    fundingAmount: "Varies by program",
    deadline: "Varies by program",
    featured: false,
    category: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["BC-based technology companies", "Specific criteria vary by program"],
    pros: ["Various funding options", "Industry connections", "Expert mentorship"],
    cons: ["Competitive application process", "Technology focus"],
    fundingOrganization: "Government of British Columbia",
    department: null,
    websiteUrl: "https://www.innovatebc.ca/",
    applicationLink: "https://www.innovatebc.ca/funding/",
    applicationProcess: "Apply to specific programs through the Innovate BC website",
    documents: ["Business plan", "Technical documentation", "Financial projections"],
    whoCanApply: "BC technology companies at various stages of development"
  },
  {
    title: "Alberta Innovates",
    description: "Programs and funding to help businesses commercialize new technologies and innovations.",
    type: "provincial" as const,
    province: "Alberta",
    industry: "Innovation",
    fundingAmount: "Up to $1,000,000",
    deadline: "Varies by program",
    featured: true,
    category: "Innovation",
    imageUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["Alberta-based businesses", "Innovative solutions", "Technology focus"],
    pros: ["Various funding streams", "Technical expertise", "Industry partnerships"],
    cons: ["Matching funds often required", "Competitive application process"],
    fundingOrganization: "Government of Alberta",
    department: null,
    websiteUrl: "https://albertainnovates.ca/",
    applicationLink: "https://albertainnovates.ca/programs/",
    applicationProcess: "Apply online to specific programs",
    documents: ["Project proposal", "Technical documentation", "Financial statements"],
    whoCanApply: "Alberta businesses with innovative technologies or solutions"
  },
  {
    title: "Business Link",
    description: "Support services for small businesses and entrepreneurs in Alberta.",
    type: "provincial" as const,
    province: "Alberta",
    industry: "Business",
    fundingAmount: "Varies by program",
    deadline: "Ongoing",
    featured: false,
    category: "Business Support",
    imageUrl: "https://images.unsplash.com/photo-1460794418188-1bb7dba2720d?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Low" as const,
    eligibilityCriteria: ["Alberta-based small businesses", "Alberta entrepreneurs"],
    pros: ["Free advisory services", "Business planning support", "Market research assistance"],
    cons: ["Limited direct funding", "Service-based rather than financial support"],
    fundingOrganization: "Government of Alberta",
    department: null,
    websiteUrl: "https://businesslink.ca/",
    applicationLink: "https://businesslink.ca/what-we-do/services/",
    applicationProcess: "Contact Business Link for services",
    documents: [],
    whoCanApply: "Alberta small businesses and entrepreneurs"
  },
  {
    title: "Tax Credits for E-business (TCEB)",
    description: "Tax credits for Quebec corporations that carry out innovative activities in the technology sector.",
    type: "provincial" as const,
    province: "Quebec",
    industry: "Information Technology",
    fundingAmount: "Up to 30% of eligible salaries",
    deadline: "Annual tax filing",
    featured: false,
    category: "Tax Credit",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["Quebec-based corporations", "E-business activities", "Minimum revenue requirements"],
    pros: ["Substantial tax savings", "Refundable credit", "Multiple years of support"],
    cons: ["Complex eligibility requirements", "Need for technical documentation"],
    fundingOrganization: "Government of Quebec",
    department: null,
    websiteUrl: "https://www.investquebec.com/quebec/en/financial-products/tax-measures/tax-credits-for-e-business.html",
    applicationLink: "https://www.investquebec.com/quebec/en/products-and-services/financial-products.html",
    applicationProcess: "Apply through Invest Quebec and annual tax filings",
    documents: ["Technical documentation", "Tax returns", "Employee information"],
    whoCanApply: "Quebec corporations developing information technologies or e-business software"
  },
  {
    title: "Quebec Economic Development Program (QEDP)",
    description: "Support for business and regional economic development in Quebec.",
    type: "provincial" as const,
    province: "Quebec",
    industry: "Business",
    fundingAmount: "Varies by project",
    deadline: "Ongoing",
    featured: false,
    category: "Economic Development",
    imageUrl: "https://images.unsplash.com/photo-1553729784-e91953dec042?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["Quebec-based businesses", "Economic development projects"],
    pros: ["Flexible funding options", "Various eligible activities", "Regional focus"],
    cons: ["Detailed application requirements", "Project-specific funding"],
    fundingOrganization: "Canada Economic Development for Quebec Regions",
    department: null,
    websiteUrl: "https://dec.canada.ca/eng/programs/qedp/index.html",
    applicationLink: "https://dec.canada.ca/eng/funding/index.html",
    applicationProcess: "Contact a CED business office",
    documents: ["Business plan", "Financial statements", "Project proposal"],
    whoCanApply: "Quebec businesses and organizations contributing to economic development"
  },

  // Private Organization Grants
  {
    title: "RBC Small Business Grants",
    description: "Various grant programs offered by RBC to support small businesses in Canada.",
    type: "private" as const,
    industry: "Business",
    fundingAmount: "Varies by program",
    deadline: "Varies by program",
    featured: true,
    category: "Small Business",
    imageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["Canadian small businesses", "Specific criteria vary by program"],
    pros: ["Various funding opportunities", "Banking relationship benefits", "Business advice"],
    cons: ["Competitive application process", "Bank client preference"],
    fundingOrganization: "Royal Bank of Canada",
    department: null,
    organization: "Royal Bank of Canada",
    websiteUrl: "https://www.rbcroyalbank.com/business/advice/index-i.html",
    applicationLink: "https://www.rbcroyalbank.com/business/small-business/index.html",
    applicationProcess: "Apply through RBC website or local branch",
    documents: [],
    whoCanApply: "Canadian small businesses, particularly RBC clients"
  },
  {
    title: "Scotiabank Women Initiative",
    description: "A comprehensive program to help women entrepreneurs access capital, mentorship, and education.",
    type: "private" as const,
    industry: "Women Entrepreneurship",
    fundingAmount: "Varies by program component",
    deadline: "Ongoing",
    featured: true,
    category: "Women Entrepreneurs",
    imageUrl: "https://images.unsplash.com/photo-1573164713712-03790a178651?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["Women-owned or women-led businesses", "Canadian businesses"],
    pros: ["Dedicated funding for women", "Mentorship components", "Networking opportunities"],
    cons: ["Bank client preference", "Competitive selection"],
    fundingOrganization: "Scotiabank",
    department: null,
    organization: "Scotiabank",
    websiteUrl: "https://www.scotiabank.com/women-initiative/ca/en.html",
    applicationLink: "https://www.scotiabank.com/women-initiative/ca/en/business-resources/the-know.html",
    applicationProcess: "Apply through Scotiabank website or local branch",
    documents: [],
    whoCanApply: "Women-owned or women-led businesses in Canada"
  },
  {
    title: "Starter Company Plus",
    description: "Provides entrepreneurs with business training, mentoring, and grants to start or expand a business.",
    type: "private" as const,
    industry: "Business",
    fundingAmount: "Up to $5,000",
    deadline: "Varies by region",
    featured: false,
    category: "Entrepreneurship",
    imageUrl: "https://images.unsplash.com/photo-1478358161113-b0e11994a36b?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium" as const,
    eligibilityCriteria: ["Ontario residents 18+", "Not in school full-time", "Not already receiving other provincial grants"],
    pros: ["Includes training and mentoring", "Non-repayable grant", "Local support"],
    cons: ["Limited funding amount", "Regional availability varies", "Time commitment for training"],
    fundingOrganization: "Small Business Enterprise Centres",
    department: null,
    organization: "Small Business Enterprise Centres",
    websiteUrl: "https://www.ontario.ca/page/start-company-young-adults",
    applicationLink: "https://www.ontario.ca/page/small-business-enterprise-centre-locations",
    applicationProcess: "Apply through local Small Business Enterprise Centre",
    documents: ["Business plan", "Cash flow projection", "Budget"],
    whoCanApply: "Ontario entrepreneurs 18+ who are not in school full-time"
  },
  {
    title: "Spin Master Innovation Fund",
    description: "Support for innovative early-stage businesses founded by entrepreneurs under 40.",
    type: "private" as const,
    industry: "Innovation",
    fundingAmount: "Up to $50,000",
    deadline: "Annual application cycle",
    featured: false,
    category: "Startup",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "High" as const,
    eligibilityCriteria: ["Entrepreneurs under 40", "Canadian citizens or permanent residents", "Early-stage businesses"],
    pros: ["Includes mentorship", "Non-repayable", "Networking opportunities"],
    cons: ["Highly competitive", "Age restrictions", "Annual application window"],
    fundingOrganization: "Spin Master and Futurpreneur Canada",
    department: null,
    organization: "Spin Master and Futurpreneur Canada",
    websiteUrl: "https://www.futurpreneur.ca/en/spin-master-innovation-fund/",
    applicationLink: "https://www.futurpreneur.ca/en/spin-master-innovation-fund/",
    applicationProcess: "Apply through Futurpreneur Canada",
    documents: ["Business plan", "Financial projections", "Innovation description"],
    whoCanApply: "Canadian entrepreneurs under 40 with innovative business ideas"
  },
  {
    title: "Creative Destruction Lab",
    description: "A seed-stage program for scalable science and technology-based companies.",
    type: "private" as const,
    industry: "Technology",
    fundingAmount: "Investment opportunities",
    deadline: "Annual application cycle",
    featured: false,
    category: "Accelerator",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "High" as const,
    eligibilityCriteria: ["Science and technology startups", "Scalable business model"],
    pros: ["Access to investment", "Mentorship from successful entrepreneurs", "Academic resources"],
    cons: ["Extremely competitive", "Rigorous objective-setting", "May require equity"],
    fundingOrganization: "Creative Destruction Lab",
    department: null,
    organization: "Creative Destruction Lab",
    websiteUrl: "https://www.creativedestructionlab.com/",
    applicationLink: "https://www.creativedestructionlab.com/apply/",
    applicationProcess: "Apply online during the annual application period",
    documents: ["Company pitch", "Technology description", "Team information"],
    whoCanApply: "Early-stage science and technology companies with scalable potential"
  }
];

async function addGrants() {
  try {
    // Check if grants already exist to avoid duplicates
    const existingGrants = await db.select().from(grants);
    
    if (existingGrants.length > 0) {
      console.log(`Found ${existingGrants.length} existing grants. Checking for new grants to add...`);
      
      // Get existing grant titles for comparison
      const existingTitles = existingGrants.map(grant => grant.title);
      
      // Filter out grants that already exist
      const newGrants = grantsData.filter(grant => !existingTitles.includes(grant.title));
      
      if (newGrants.length === 0) {
        console.log('No new grants to add. Exiting...');
        process.exit(0);
      }
      
      console.log(`Adding ${newGrants.length} new grants...`);
      
      // Insert new grants
      for (const grant of newGrants) {
        const processedGrant = {
          ...grant,
          createdAt: new Date().toISOString(),
          pros: Array.isArray(grant.pros) ? grant.pros : [],
          cons: Array.isArray(grant.cons) ? grant.cons : [],
          eligibilityCriteria: Array.isArray(grant.eligibilityCriteria) ? grant.eligibilityCriteria : [],
          documents: Array.isArray(grant.documents) ? grant.documents : [],
          province: grant.province || null,
          organization: (grant as any).organization || null
        };
        
        try {
          await db.insert(grants).values(processedGrant);
          console.log(`Added: ${grant.title}`);
        } catch (error) {
          console.error(`Error adding ${grant.title}:`, error);
        }
      }
      
      console.log(`Successfully added ${newGrants.length} new grants.`);
    } else {
      console.log('No existing grants found. Adding all grants...');
      
      // Insert all grants
      for (const grant of grantsData) {
        const processedGrant = {
          ...grant,
          createdAt: new Date().toISOString(),
          pros: Array.isArray(grant.pros) ? grant.pros : [],
          cons: Array.isArray(grant.cons) ? grant.cons : [],
          eligibilityCriteria: Array.isArray(grant.eligibilityCriteria) ? grant.eligibilityCriteria : [],
          documents: Array.isArray(grant.documents) ? grant.documents : [],
          province: grant.province || null,
          organization: (grant as any).organization || null
        };
        
        try {
          await db.insert(grants).values(processedGrant);
          console.log(`Added: ${grant.title}`);
        } catch (error) {
          console.error(`Error adding ${grant.title}:`, error);
        }
      }
      
      console.log(`Successfully added ${grantsData.length} grants.`);
    }
    
    // Confirm added grants
    const updatedGrants = await db.select().from(grants);
    console.log(`Total grants in database: ${updatedGrants.length}`);
    
  } catch (error) {
    console.error('Error adding grants:', error);
  }
}

// Run the function
addGrants();