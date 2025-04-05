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

// Function to add more provincial grants with specific focuses
async function addProvincialGrants() {
  console.log("Adding more specialized provincial grants...");
  
  const provincialGrants = [
    // Ontario
    {
      title: "Ontario Interactive Digital Media Tax Credit",
      description: "A refundable tax credit available to eligible Ontario-based corporations for creating interactive digital media products in Ontario.",
      province: "Ontario",
      industry: "Digital Media",
      fundingAmount: "40% of eligible Ontario labour expenditures",
      category: "Tax Credit",
      department: "Ontario Creates",
      websiteUrl: "https://www.ontariocreates.ca/",
      competitionLevel: "Medium"
    },
    {
      title: "Ontario Film and Television Tax Credit",
      description: "A refundable tax credit available to eligible Ontario-based Canadian corporations for producing film and television productions in Ontario.",
      province: "Ontario",
      industry: "Film and Television",
      fundingAmount: "35% of eligible Ontario labour expenditures",
      category: "Tax Credit",
      department: "Ontario Creates",
      websiteUrl: "https://www.ontariocreates.ca/",
      competitionLevel: "Medium"
    },
    {
      title: "Ontario Automotive Modernization Program",
      description: "Provides funding to small and medium-sized automotive parts suppliers to invest in technology adoption and/or training in lean manufacturing.",
      province: "Ontario",
      industry: "Automotive",
      fundingAmount: "Up to $100,000 (covering up to 50% of eligible project costs)",
      category: "Manufacturing",
      department: "Ontario Ministry of Economic Development, Job Creation and Trade",
      websiteUrl: "https://www.ontario.ca/page/ontario-automotive-modernization-program",
      competitionLevel: "Medium"
    },
    // British Columbia
    {
      title: "BC Agritech Land Matching Program",
      description: "Supports agricultural technology companies by helping them secure land for development and testing of innovative agricultural technologies.",
      province: "British Columbia",
      industry: "AgTech",
      fundingAmount: "Land matching and advisory services",
      category: "Agriculture",
      department: "BC Ministry of Agriculture",
      websiteUrl: "https://www2.gov.bc.ca/gov/content/industry/agriculture-seafood",
      competitionLevel: "Low"
    },
    {
      title: "BC Clean Energy Vehicle Program",
      description: "Provides incentives for the purchase or lease of eligible clean energy vehicles, including electric, hydrogen fuel cell, and longer-range plug-in hybrid vehicles.",
      province: "British Columbia",
      industry: "Clean Energy",
      fundingAmount: "Up to $3,000 for eligible vehicles",
      category: "Clean Technology",
      department: "BC Ministry of Energy, Mines and Low Carbon Innovation",
      websiteUrl: "https://goelectricbc.gov.bc.ca/",
      competitionLevel: "Low"
    },
    {
      title: "BC Tech Co-op Grants Program",
      description: "Provides grants to eligible technology companies to hire co-op students from BC post-secondary institutions.",
      province: "British Columbia",
      industry: "Technology",
      fundingAmount: "Up to $10,800 per year (covering up to 70% of a co-op student's salary)",
      category: "Workforce Development",
      department: "BC Ministry of Advanced Education and Skills Training",
      websiteUrl: "https://www.workbc.ca/",
      competitionLevel: "Medium"
    },
    // Alberta
    {
      title: "Alberta Innovation Vouchers",
      description: "Helps small technology and knowledge-driven businesses in Alberta get their ideas and products to market faster through services provided by Alberta's post-secondary institutions and research organizations.",
      province: "Alberta",
      industry: "Technology",
      fundingAmount: "Up to $100,000",
      category: "Innovation",
      department: "Alberta Innovates",
      websiteUrl: "https://albertainnovates.ca/",
      competitionLevel: "Medium"
    },
    {
      title: "Alberta Film and Television Tax Credit",
      description: "A refundable tax credit for eligible film and television productions that encourages the development of Alberta's film and television industry.",
      province: "Alberta",
      industry: "Film and Television",
      fundingAmount: "22-30% of eligible Alberta production costs",
      category: "Tax Credit",
      department: "Alberta Ministry of Jobs, Economy and Innovation",
      websiteUrl: "https://www.alberta.ca/alberta-film-and-television-tax-credit.aspx",
      competitionLevel: "Medium"
    },
    {
      title: "Alberta Micro Voucher Program",
      description: "Helps entrepreneurs and small technology companies get their innovations into the market by providing funding for early-stage product development.",
      province: "Alberta",
      industry: "Technology",
      fundingAmount: "Up to $10,000",
      category: "Innovation",
      department: "Alberta Innovates",
      websiteUrl: "https://albertainnovates.ca/",
      competitionLevel: "Low"
    },
    // Quebec
    {
      title: "Quebec Scientific Research and Experimental Development Tax Credit",
      description: "A refundable tax credit for businesses conducting scientific research and experimental development in Quebec.",
      province: "Quebec",
      industry: "Research & Development",
      fundingAmount: "14-30% of eligible R&D expenditures",
      category: "Tax Credit",
      department: "Revenu Québec",
      websiteUrl: "https://www.revenuquebec.ca/",
      competitionLevel: "Medium"
    },
    {
      title: "Quebec Innovation Program",
      description: "Supports innovation projects carried out by Quebec businesses to improve their productivity and competitiveness.",
      province: "Quebec",
      industry: "Any",
      fundingAmount: "Up to 50% of eligible project expenses (maximum $350,000)",
      category: "Innovation",
      department: "Investissement Québec",
      websiteUrl: "https://www.investquebec.com/",
      competitionLevel: "Medium"
    },
    {
      title: "Quebec Digital Transformation Program",
      description: "Helps Quebec businesses acquire digital technologies to improve their productivity and competitiveness.",
      province: "Quebec",
      industry: "Any",
      fundingAmount: "Up to 50% of eligible project costs (maximum $100,000)",
      category: "Digital Transformation",
      department: "Investissement Québec",
      websiteUrl: "https://www.investquebec.com/",
      competitionLevel: "Medium"
    },
    // Nova Scotia
    {
      title: "Nova Scotia Film and Television Production Incentive Fund",
      description: "Provides financial incentives to eligible productions filming in Nova Scotia, based on eligible Nova Scotia expenditures.",
      province: "Nova Scotia",
      industry: "Film and Television",
      fundingAmount: "25-32% of eligible Nova Scotia costs",
      category: "Production",
      department: "Nova Scotia Business Inc.",
      websiteUrl: "https://www.novascotiabusiness.com/",
      competitionLevel: "Medium"
    },
    {
      title: "Nova Scotia Innovation Rebate Program",
      description: "Provides financial incentives to Nova Scotia companies investing in innovative processes or product technologies to improve productivity and competitiveness.",
      province: "Nova Scotia",
      industry: "Any",
      fundingAmount: "25% of eligible project costs (maximum $3.75 million)",
      category: "Innovation",
      department: "Nova Scotia Business Inc.",
      websiteUrl: "https://www.novascotiabusiness.com/",
      competitionLevel: "Medium"
    },
    {
      title: "Nova Scotia Digital Animation Tax Credit",
      description: "A refundable tax credit for eligible companies producing digital animation in Nova Scotia.",
      province: "Nova Scotia",
      industry: "Digital Animation",
      fundingAmount: "25% of eligible Nova Scotia labour expenditures",
      category: "Tax Credit",
      department: "Nova Scotia Department of Finance and Treasury Board",
      websiteUrl: "https://novascotia.ca/",
      competitionLevel: "Low"
    }
  ];
  
  for (const grant of provincialGrants) {
    await addGrant({
      title: grant.title,
      description: grant.description,
      type: "provincial",
      imageUrl: "https://images.unsplash.com/photo-1607827448594-a6eaef4c1a7d?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Annual deadlines (check program website for current cycle)",
      fundingAmount: grant.fundingAmount,
      category: grant.category,
      eligibilityCriteria: [
        `Business operating in ${grant.province}`,
        `Project in the ${grant.industry} sector`,
        "Meet program-specific requirements",
        "In good standing with provincial government",
        "Compliance with all applicable regulations"
      ],
      pros: [
        "Designed for specific provincial economic priorities",
        "Targeted to local industry needs",
        "May have less competition than federal programs",
        "Local support and resources available",
        "May offer faster application processing"
      ],
      cons: [
        "Limited to businesses in the province",
        "May have industry-specific requirements",
        "Funding may be limited or competitive",
        "Application windows may be narrow",
        "Detailed reporting requirements"
      ],
      websiteUrl: grant.websiteUrl,
      featured: false,
      industry: grant.industry,
      province: grant.province,
      competitionLevel: grant.competitionLevel,
      department: grant.department,
      documents: [
        "Completed application form",
        "Business registration documents",
        "Project proposal and timeline",
        "Detailed budget",
        "Additional supporting documentation as specified"
      ],
      applicationDates: "Annual deadlines (check program website for current cycle)"
    });
  }
  console.log("Added more specialized provincial grants");
}

// Function to add more federal industry-specific grants
async function addFederalIndustryGrants() {
  console.log("Adding more federal industry-specific grants...");
  
  const federalIndustryGrants = [
    // Agriculture
    {
      title: "AgriInnovate Program",
      description: "Provides repayable contributions for projects that aim to accelerate the demonstration, commercialization and/or adoption of innovative products, technologies, processes or services in the agriculture sector.",
      industry: "Agriculture",
      fundingAmount: "Up to $10 million (50% of eligible costs)",
      category: "Innovation",
      department: "Agriculture and Agri-Food Canada",
      websiteUrl: "https://agriculture.canada.ca/en/agricultural-programs-and-services/agriinnovate-program",
      competitionLevel: "High"
    },
    {
      title: "Agricultural Clean Technology Program",
      description: "Supports the research, development, and adoption of clean technologies in the agriculture sector to help reduce greenhouse gas emissions.",
      industry: "Agriculture",
      fundingAmount: "Up to $2 million for adoption stream; up to $5 million for research stream",
      category: "Clean Technology",
      department: "Agriculture and Agri-Food Canada",
      websiteUrl: "https://agriculture.canada.ca/en/agricultural-programs-and-services/agricultural-clean-technology-program",
      competitionLevel: "Medium"
    },
    // Clean Technology
    {
      title: "Clean Growth Program",
      description: "Provides funding for clean technology research, development, and demonstration projects in Canada's energy, mining, and forestry sectors.",
      industry: "Clean Technology",
      fundingAmount: "Up to $5 million per project (50% of eligible costs)",
      category: "Research and Development",
      department: "Natural Resources Canada",
      websiteUrl: "https://www.nrcan.gc.ca/climate-change/clean-growth-program/20254",
      competitionLevel: "High"
    },
    {
      title: "Energy Innovation Program",
      description: "Supports clean energy innovation projects focusing on renewable energy, smart grids, energy storage, and reducing diesel use in rural and remote communities.",
      industry: "Energy",
      fundingAmount: "Up to 75% of eligible costs",
      category: "Innovation",
      department: "Natural Resources Canada",
      websiteUrl: "https://www.nrcan.gc.ca/science-and-data/funding-partnerships/funding-opportunities/funding-grants-incentives/energy-innovation-program/18876",
      competitionLevel: "High"
    },
    // Manufacturing
    {
      title: "Advanced Manufacturing Fund",
      description: "Supports large-scale, transformative manufacturing activities in Canada, particularly in the aerospace, automotive, and information and communication technology sectors.",
      industry: "Manufacturing",
      fundingAmount: "Varies by project (typically $5-20 million)",
      category: "Manufacturing",
      department: "Innovation, Science and Economic Development Canada",
      websiteUrl: "https://www.ic.gc.ca/eic/site/125.nsf/eng/home",
      competitionLevel: "High"
    },
    {
      title: "Innovative Solutions Canada",
      description: "Helps Canadian innovators by funding R&D and testing prototypes in real-life settings, with a focus on early-stage, pre-commercial innovations.",
      industry: "Any",
      fundingAmount: "Up to $150,000 for Phase 1; up to $1 million for Phase 2",
      category: "Innovation",
      department: "Innovation, Science and Economic Development Canada",
      websiteUrl: "https://www.ic.gc.ca/eic/site/101.nsf/eng/home",
      competitionLevel: "High"
    },
    // Digital Media
    {
      title: "Canada Media Fund",
      description: "Supports the creation of Canadian digital and broadcast content across multiple platforms, including television and digital media.",
      industry: "Digital Media",
      fundingAmount: "Varies by program stream (up to 75% of eligible costs)",
      category: "Content Creation",
      department: "Canada Media Fund",
      websiteUrl: "https://cmf-fmc.ca/",
      competitionLevel: "High"
    },
    {
      title: "Strategic Innovation Fund",
      description: "Supports large-scale, transformative, and collaborative projects across all industrial and technology sectors that will help position Canada as an innovation leader.",
      industry: "Any",
      fundingAmount: "Varies by project (typically $10 million+)",
      category: "Innovation",
      department: "Innovation, Science and Economic Development Canada",
      websiteUrl: "https://www.ic.gc.ca/eic/site/125.nsf/eng/home",
      competitionLevel: "Very High"
    },
    // Forestry
    {
      title: "Investments in Forest Industry Transformation Program",
      description: "Supports Canada's forest sector in becoming more economically competitive and environmentally sustainable through innovative technologies and processes.",
      industry: "Forestry",
      fundingAmount: "Up to $20 million per project",
      category: "Innovation",
      department: "Natural Resources Canada",
      websiteUrl: "https://www.nrcan.gc.ca/science-and-data/funding-partnerships/funding-opportunities/forest-sector-funding-programs/investments-forest-industry-transformation-ifit/13139",
      competitionLevel: "Medium"
    },
    // Healthcare
    {
      title: "Health Research Foundation Grant",
      description: "Supports health research in Canadian academic health centers and promotes the development of the next generation of health researchers.",
      industry: "Healthcare",
      fundingAmount: "Varies by program stream",
      category: "Research",
      department: "Canadian Institutes of Health Research",
      websiteUrl: "https://cihr-irsc.gc.ca/",
      competitionLevel: "Very High"
    },
    // Tourism
    {
      title: "Tourism Growth Program",
      description: "Supports the development of tourism experiences that attract high-value tourists, extend the tourism season, expand into new markets, and diversify Canada's tourism sector.",
      industry: "Tourism",
      fundingAmount: "Up to 50% of eligible costs",
      category: "Business Development",
      department: "Canadian Experiences Fund (Innovation, Science and Economic Development Canada)",
      websiteUrl: "https://www.ic.gc.ca/eic/site/134.nsf/eng/home",
      competitionLevel: "Medium"
    }
  ];
  
  for (const grant of federalIndustryGrants) {
    await addGrant({
      title: grant.title,
      description: grant.description,
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1629640644118-9442dc47b2b4?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Annual application cycles (check program website)",
      fundingAmount: grant.fundingAmount,
      category: grant.category,
      eligibilityCriteria: [
        "Canadian-incorporated entity",
        `Project relates to the ${grant.industry} sector`,
        "Meet program-specific requirements",
        "Demonstrate innovation and economic impact",
        "Capacity to complete and sustain the project"
      ],
      pros: [
        "Substantial funding amounts available",
        "Available to businesses across Canada",
        "Access to federal resources and networks",
        "Potential for follow-on funding",
        "Creates credibility with other funders and partners"
      ],
      cons: [
        "Highly competitive application process",
        "Complex application requirements",
        "Long evaluation and approval timelines",
        "Extensive reporting obligations",
        "May require significant matching funds"
      ],
      websiteUrl: grant.websiteUrl,
      featured: false,
      industry: grant.industry,
      province: null,
      competitionLevel: grant.competitionLevel,
      department: grant.department,
      documents: [
        "Detailed project proposal",
        "Business plan",
        "Financial statements and projections",
        "Evidence of other funding sources",
        "Supporting technical documentation"
      ],
      applicationDates: "Annual application cycles (check program website)"
    });
  }
  console.log("Added more federal industry-specific grants");
}

// Function to add more private and foundation grants
async function addPrivateGrants() {
  console.log("Adding more private and foundation grants...");
  
  const privateGrants = [
    // Banks
    {
      title: "RBC Future Launch",
      description: "Supports programs that help young Canadians access skills development, networking, work experience, and mental wellbeing services as they prepare for the future of work.",
      organization: "Royal Bank of Canada",
      fundingAmount: "Varies by project (typically $25,000 - $500,000)",
      category: "Youth Skills",
      websiteUrl: "https://www.rbc.com/community-social-impact/",
      competitionLevel: "High"
    },
    {
      title: "Scotiabank Climate Change Program",
      description: "Supports organizations working on climate change mitigation, adaptation, and resilience initiatives across Canada.",
      organization: "Scotiabank",
      fundingAmount: "$25,000 - $250,000",
      category: "Environment",
      websiteUrl: "https://www.scotiabank.com/corporate/en/home/corporate-responsibility.html",
      competitionLevel: "Medium"
    },
    // Telecommunications
    {
      title: "TELUS Friendly Future Foundation",
      description: "Supports health programs for youth in underserved communities across Canada, with a focus on mental health and well-being.",
      organization: "TELUS",
      fundingAmount: "$20,000 - $100,000",
      category: "Health",
      websiteUrl: "https://www.friendlyfuture.com/",
      competitionLevel: "Medium"
    },
    {
      title: "Rogers Community Grants",
      description: "Supports programs that help Canadian youth succeed through education programs, particularly those focusing on digital literacy and STEM education.",
      organization: "Rogers Communications",
      fundingAmount: "$15,000 - $25,000",
      category: "Education",
      websiteUrl: "https://about.rogers.com/giving-back/",
      competitionLevel: "Medium"
    },
    // Technology
    {
      title: "Google.org Impact Challenge Canada",
      description: "Supports nonprofit organizations using technology and innovation to tackle social challenges in Canada.",
      organization: "Google",
      fundingAmount: "$250,000 - $1,000,000",
      category: "Social Innovation",
      websiteUrl: "https://impactchallenge.withgoogle.com/canada2020",
      competitionLevel: "Very High"
    },
    {
      title: "Microsoft Canada Community Empowerment Fund",
      description: "Supports nonprofit organizations working to increase digital skills and access to technology for underserved communities in Canada.",
      organization: "Microsoft Canada",
      fundingAmount: "$50,000 - $200,000",
      category: "Digital Skills",
      websiteUrl: "https://www.microsoft.com/en-ca/corporate-responsibility",
      competitionLevel: "High"
    },
    // Retail
    {
      title: "Walmart Canada Community Grants",
      description: "Supports local organizations that focus on hunger relief, disaster preparedness, community engagement, and environmental sustainability.",
      organization: "Walmart Canada",
      fundingAmount: "$1,000 - $25,000",
      category: "Community Development",
      websiteUrl: "https://www.walmartcanada.ca/community-giving",
      competitionLevel: "Medium"
    },
    {
      title: "Best Buy School Tech Grants",
      description: "Provides technology grants to secondary schools across Canada to improve or integrate technology in classrooms.",
      organization: "Best Buy Canada",
      fundingAmount: "$10,000 - $20,000 in technology products",
      category: "Education Technology",
      websiteUrl: "https://www.bestbuy.ca/en-ca/about/school-tech-grants/blt0b1339a4b083a827",
      competitionLevel: "Medium"
    },
    // Foundations
    {
      title: "The MasterCard Foundation Fund for Rural Prosperity",
      description: "Supports innovative financial products, services, and processes that expand access to financial services for people living in poverty in rural areas.",
      organization: "MasterCard Foundation",
      fundingAmount: "$200,000 - $2,500,000",
      category: "Financial Inclusion",
      websiteUrl: "https://mastercardfdn.org/",
      competitionLevel: "Very High"
    },
    {
      title: "Aviva Community Fund",
      description: "Provides funding for community initiatives across Canada in categories such as community resilience, community health, and community development.",
      organization: "Aviva Canada",
      fundingAmount: "Up to $100,000",
      category: "Community Development",
      websiteUrl: "https://www.avivacommunityfund.org/",
      competitionLevel: "High"
    }
  ];
  
  for (const grant of privateGrants) {
    await addGrant({
      title: grant.title,
      description: grant.description,
      type: "private",
      imageUrl: "https://images.unsplash.com/photo-1562565652-7a69e5a98e47?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Annual or semi-annual application cycles",
      fundingAmount: grant.fundingAmount,
      category: grant.category,
      eligibilityCriteria: [
        "Canadian registered charity or non-profit",
        "For-profit businesses with clear social/environmental mission",
        "Project aligns with funding priorities",
        "Demonstrated impact and sustainability",
        "Compliance with application guidelines"
      ],
      pros: [
        "Less bureaucratic than government funding",
        "Faster decision-making process",
        "Access to corporate networks and expertise",
        "Potential for multi-year partnerships",
        "Visibility through corporate channels"
      ],
      cons: [
        "Competitive application process",
        "Must align with corporate priorities",
        "Funding amounts may be smaller than government grants",
        "May require significant brand visibility",
        "Priorities may shift with corporate strategy"
      ],
      websiteUrl: grant.websiteUrl,
      featured: false,
      industry: "any",
      province: null,
      competitionLevel: grant.competitionLevel,
      organization: grant.organization,
      documents: [
        "Grant application form",
        "Project description and timeline",
        "Budget details",
        "Organizational information",
        "Impact measurement plan"
      ],
      applicationDates: "Annual or semi-annual application cycles"
    });
  }
  console.log("Added more private and foundation grants");
}

// Main function to add various grants
async function addAllGrants() {
  try {
    // Add more provincial grants
    await addProvincialGrants();
    
    // Add more federal industry grants
    await addFederalIndustryGrants();
    
    // Add more private grants
    await addPrivateGrants();
    
    console.log("All additional diverse grants added successfully!");
  } catch (error) {
    console.error("Error adding grants:", error);
  }
}

// Run the function to add all grants
addAllGrants();