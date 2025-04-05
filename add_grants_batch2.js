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

// Function to add more federal industry grants - batch 2
async function addFederalIndustryGrants() {
  console.log("Adding federal industry grants - batch 2...");
  
  const industries = [
    "Oil and Gas", "Mining", "Construction", "Transportation", 
    "Retail", "Hospitality"
  ];
  
  const federalProgramTypes = [
    {
      type: "Business Scale-up",
      description: "Helps high-growth businesses scale their operations and expand market reach.",
      fundingRanges: ["$250,000 to $1 million", "$1 million to $5 million", "Up to $10 million"]
    },
    {
      type: "Green Initiatives",
      description: "Supports projects that reduce environmental impact and promote sustainable business practices.",
      fundingRanges: ["$100,000 to $500,000", "$500,000 to $2 million", "Up to $5 million"]
    },
    {
      type: "Workforce Development",
      description: "Supports initiatives to develop specialized skills and address workforce needs in specific sectors.",
      fundingRanges: ["$50,000 to $250,000", "$250,000 to $1 million", "Up to $2 million"]
    }
  ];
  
  const federalDepartments = [
    "Innovation, Science and Economic Development Canada",
    "Natural Resources Canada",
    "Agriculture and Agri-Food Canada",
    "Environment and Climate Change Canada",
    "Transport Canada",
    "Employment and Social Development Canada",
    "Global Affairs Canada"
  ];
  
  // Generate federal industry grants
  for (const industry of industries) {
    for (const programType of federalProgramTypes) {
      // Skip some combinations to avoid too many similar grants
      if (Math.random() > 0.5) continue;
      
      const departmentIndex = Math.floor(Math.random() * federalDepartments.length);
      const department = federalDepartments[departmentIndex];
      const fundingAmount = programType.fundingRanges[Math.floor(Math.random() * programType.fundingRanges.length)];
      const title = `Canadian ${industry} ${programType.type} Initiative`;
      
      await addGrant({
        title: title,
        description: `${programType.description} This program is specifically designed for businesses in the ${industry} sector across Canada.`,
        type: "federal",
        imageUrl: `https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=500&h=280&q=80`,
        deadline: Math.random() > 0.5 ? "Ongoing (applications accepted year-round)" : "Annual deadline (check website for current cycle)",
        fundingAmount: fundingAmount,
        category: programType.type,
        eligibilityCriteria: [
          `Canadian business in the ${industry} sector`,
          "Incorporated business with operations in Canada",
          "Minimum revenue requirements may apply",
          "Project must align with program objectives",
          "Financial capacity to complete the project"
        ],
        pros: [
          "Significant funding amounts available",
          "Available to businesses across Canada",
          "Access to federal resources and networks",
          "Potential for multi-year funding",
          "Can lead to additional government opportunities"
        ],
        cons: [
          "Highly competitive application process",
          "Complex application requirements",
          "May require substantial matching funds",
          "Extensive reporting and compliance obligations",
          "Long application processing times"
        ],
        websiteUrl: "https://www.canada.ca/en/innovation-science-economic-development.html",
        featured: false,
        industry: industry,
        province: null,
        competitionLevel: Math.random() > 0.7 ? "High" : Math.random() > 0.4 ? "Medium" : "Low",
        department: department,
        documents: [
          "Comprehensive business plan",
          "Financial statements and projections",
          "Technical proposal",
          "Environmental impact assessment (if applicable)",
          "Detailed budget and project timeline"
        ],
        applicationDates: Math.random() > 0.5 ? "Ongoing (applications accepted year-round)" : "Annual deadline (check website for current cycle)"
      });
    }
    console.log(`Added federal grants for ${industry} industry`);
  }
}

// Function to add more private foundation and corporate grants - batch 2
async function addPrivateGrants() {
  console.log("Adding private organization grants - batch 2...");
  
  const corporations = [
    "Google", "Facebook", "Amazon", "Walmart", "Sobeys",
    "Loblaws", "Canadian Tire", "Home Depot", "Shell", "Suncor"
  ];
  
  const foundationTypes = [
    {
      type: "Community Development",
      description: "Funds projects that strengthen communities and improve quality of life.",
      fundingRanges: ["$5,000 to $25,000", "$25,000 to $100,000", "Up to $200,000"]
    },
    {
      type: "Entrepreneurship",
      description: "Supports innovative entrepreneurs and small businesses with growth potential.",
      fundingRanges: ["$10,000 to $50,000", "$50,000 to $200,000", "Up to $500,000"]
    },
    {
      type: "Health and Wellness",
      description: "Funds initiatives that improve health outcomes and wellness in Canadian communities.",
      fundingRanges: ["$5,000 to $25,000", "$25,000 to $100,000", "Up to $250,000"]
    }
  ];
  
  // Generate corporate foundation grants
  for (const corporation of corporations) {
    for (const foundationType of foundationTypes) {
      // Skip some combinations to avoid too many similar grants
      if (Math.random() > 0.4) continue;
      
      const fundingAmount = foundationType.fundingRanges[Math.floor(Math.random() * foundationType.fundingRanges.length)];
      const title = `${corporation} ${foundationType.type} Fund`;
      
      await addGrant({
        title: title,
        description: `${foundationType.description} The ${corporation} ${foundationType.type} Fund represents the company's commitment to giving back to Canadian communities.`,
        type: "private",
        imageUrl: `https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=500&h=280&q=80`,
        deadline: Math.random() > 0.5 ? "Quarterly application deadlines" : "Annual deadline (check website for current cycle)",
        fundingAmount: fundingAmount,
        category: foundationType.type,
        eligibilityCriteria: [
          "Canadian registered charity or non-profit organization",
          "For-profit businesses with clear social/environmental mission",
          "Project aligns with fund priorities and corporate values",
          "Demonstrated community impact",
          "Sustainability plan for long-term impact"
        ],
        pros: [
          "Less complex application compared to government grants",
          "Potential for corporate partnership beyond funding",
          "Access to corporate networks and expertise",
          "Marketing and promotional opportunities",
          "Potential for multi-year support"
        ],
        cons: [
          "Typically smaller funding amounts than government programs",
          "Must align with corporate priorities",
          "Highly competitive application process",
          "May require significant brand visibility for corporate sponsor",
          "Funding priorities may shift with corporate strategy"
        ],
        websiteUrl: `https://www.${corporation.toLowerCase().replace(' ', '')}.ca/community`,
        featured: false,
        industry: "any",
        province: null,
        competitionLevel: Math.random() > 0.7 ? "High" : Math.random() > 0.4 ? "Medium" : "Low",
        organization: `${corporation} Foundation`,
        documents: [
          "Project proposal",
          "Organizational background",
          "Budget breakdown",
          "Impact measurement plan",
          "Letters of support"
        ],
        applicationDates: Math.random() > 0.5 ? "Quarterly application deadlines" : "Annual deadline (check website for current cycle)"
      });
    }
    console.log(`Added private grants for ${corporation}`);
  }
}

// Add some specialized provincial grants for specific regions
async function addSpecializedProvincialGrants() {
  console.log("Adding specialized provincial grants...");
  
  const specialized = [
    {
      title: "Northern Ontario Heritage Fund",
      description: "The Northern Ontario Heritage Fund Corporation (NOHFC) promotes economic prosperity across Northern Ontario by providing financial assistance for projects that stimulate recovery, growth, job creation and skills development.",
      type: "provincial",
      province: "Ontario",
      fundingAmount: "$5,000 to $1 million (varies by stream)",
      industry: "any",
      category: "Regional Development",
      websiteUrl: "https://nohfc.ca/",
      department: "Northern Ontario Heritage Fund Corporation",
      competitionLevel: "Medium"
    },
    {
      title: "Arctic Energy Alliance Programs",
      description: "The Arctic Energy Alliance offers rebate programs to help Northwest Territories residents and businesses reduce their energy costs and emissions through energy efficiency improvements and renewable energy projects.",
      type: "provincial",
      province: "Northwest Territories",
      fundingAmount: "$1,000 to $50,000 (varies by project)",
      industry: "Energy",
      category: "Energy Efficiency",
      websiteUrl: "https://aea.nt.ca/",
      department: "Arctic Energy Alliance",
      competitionLevel: "Low"
    },
    {
      title: "BC Music Fund",
      description: "The BC Music Fund supports the growth and development of British Columbia's music industry by providing grants for sound recording, live music performances, industry initiatives, and career development.",
      type: "provincial",
      province: "British Columbia",
      fundingAmount: "$5,000 to $75,000 (varies by stream)",
      industry: "Music",
      category: "Arts and Culture",
      websiteUrl: "https://creativebc.com/",
      department: "Creative BC",
      competitionLevel: "Medium"
    },
    {
      title: "Alberta Heritage Foundation for Medical Research",
      description: "The Alberta Heritage Foundation for Medical Research provides funding to support health research in Alberta, including biomedical, clinical, health services, and population health research projects.",
      type: "provincial",
      province: "Alberta",
      fundingAmount: "$50,000 to $1 million (varies by program)",
      industry: "Healthcare",
      category: "Research and Innovation",
      websiteUrl: "https://albertainnovates.ca/",
      department: "Alberta Innovates",
      competitionLevel: "High"
    },
    {
      title: "Quebec Film and Television Tax Credit",
      description: "The Quebec Film and Television Tax Credit offers refundable tax credits to production companies for eligible film, television, and digital media productions made in Quebec.",
      type: "provincial",
      province: "Quebec",
      fundingAmount: "Up to 40% of eligible labor expenditures",
      industry: "Film and Television",
      category: "Tax Credit",
      websiteUrl: "https://sodec.gouv.qc.ca/",
      department: "SODEC",
      competitionLevel: "Medium"
    },
    {
      title: "Nova Scotia Ocean Technology Tax Credit",
      description: "The Nova Scotia Ocean Technology Tax Credit provides a refundable corporate tax credit to companies developing and commercializing products for the ocean technology sector in Nova Scotia.",
      type: "provincial",
      province: "Nova Scotia",
      fundingAmount: "15% of eligible expenditures",
      industry: "Ocean Technology",
      category: "Tax Credit",
      websiteUrl: "https://novascotia.ca/",
      department: "Nova Scotia Department of Finance",
      competitionLevel: "Low"
    },
    {
      title: "Prince Edward Island Craft Development Program",
      description: "The PEI Craft Development Program provides financial assistance to craft businesses for equipment, marketing, product development, and professional development to enhance their competitiveness.",
      type: "provincial",
      province: "Prince Edward Island",
      fundingAmount: "Up to $10,000 per business",
      industry: "Crafts",
      category: "Business Development",
      websiteUrl: "https://www.princeedwardisland.ca/",
      department: "PEI Department of Economic Growth, Tourism and Culture",
      competitionLevel: "Low"
    },
    {
      title: "Saskatchewan Creative Industries Production Grant",
      description: "The Saskatchewan Creative Industries Production Grant supports the growth and development of Saskatchewan's creative industries, including film, television, digital media, music, and publishing.",
      type: "provincial",
      province: "Saskatchewan",
      fundingAmount: "Up to $600,000 per project",
      industry: "Creative Industries",
      category: "Production",
      websiteUrl: "https://www.saskatchewan.ca/",
      department: "Creative Saskatchewan",
      competitionLevel: "Medium"
    },
    {
      title: "Yukon Film Production Fund",
      description: "The Yukon Film Production Fund provides financial support to Yukon-based film and television productions, helping to build a sustainable film industry in the territory.",
      type: "provincial",
      province: "Yukon",
      fundingAmount: "Up to $500,000 per project",
      industry: "Film and Television",
      category: "Production",
      websiteUrl: "https://yukon.ca/",
      department: "Yukon Media Development",
      competitionLevel: "Low"
    },
    {
      title: "Manitoba Interactive Digital Media Tax Credit",
      description: "The Manitoba Interactive Digital Media Tax Credit offers a refundable corporate income tax credit for companies that develop eligible interactive digital media products in Manitoba.",
      type: "provincial",
      province: "Manitoba",
      fundingAmount: "40% of eligible project costs",
      industry: "Digital Media",
      category: "Tax Credit",
      websiteUrl: "https://www.gov.mb.ca/",
      department: "Manitoba Film & Music",
      competitionLevel: "Medium"
    }
  ];
  
  for (const grant of specialized) {
    await addGrant({
      title: grant.title,
      description: grant.description,
      type: grant.type,
      imageUrl: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Annual application cycle (check website for current deadlines)",
      fundingAmount: grant.fundingAmount,
      category: grant.category,
      eligibilityCriteria: [
        `Business or organization operating in ${grant.province}`,
        `Project related to the ${grant.industry} sector`,
        "Meets specific program criteria (see program guidelines)",
        "In good standing with provincial government",
        "Ability to complete project within required timeframe"
      ],
      pros: [
        "Designed for regional economic development",
        "Specific to provincial priorities",
        "Local application support available",
        "Aligned with provincial industry strategies",
        "May have less competition than federal programs"
      ],
      cons: [
        "Limited to businesses in the province",
        "May have restrictive eligibility criteria",
        "Annual funding may be limited",
        "Application windows may be narrow",
        "Reporting requirements can be substantial"
      ],
      websiteUrl: grant.websiteUrl,
      featured: false,
      industry: grant.industry,
      province: grant.province,
      competitionLevel: grant.competitionLevel,
      department: grant.department,
      documents: [
        "Application form",
        "Business registration",
        "Project proposal",
        "Budget and timeline",
        "Supporting documentation as specified in guidelines"
      ],
      applicationDates: "Annual application cycle (check website for current deadlines)"
    });
  }
  console.log("Added specialized provincial grants");
}

// Main function to add various grants
async function addAllGrants() {
  try {
    // Add federal industry grants (batch 2)
    await addFederalIndustryGrants();
    
    // Add private and corporate grants (batch 2)
    await addPrivateGrants();
    
    // Add specialized provincial grants
    await addSpecializedProvincialGrants();
    
    console.log("All batch 2 grants added successfully!");
  } catch (error) {
    console.error("Error adding grants:", error);
  }
}

// Run the function to add all grants
addAllGrants();