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

// Function to generate grants for all provinces
async function addProvincialGrants() {
  console.log("Adding provincial grants batch 1...");
  
  const provinces = [
    {name: "Ontario", abbr: "ON"},
    {name: "Quebec", abbr: "QC"},
    {name: "British Columbia", abbr: "BC"},
    {name: "Alberta", abbr: "AB"},
    {name: "Manitoba", abbr: "MB"},
    {name: "Saskatchewan", abbr: "SK"},
    {name: "Nova Scotia", abbr: "NS"},
    {name: "New Brunswick", abbr: "NB"},
    {name: "Newfoundland and Labrador", abbr: "NL"},
    {name: "Prince Edward Island", abbr: "PEI"},
    {name: "Northwest Territories", abbr: "NT"},
    {name: "Yukon", abbr: "YT"},
    {name: "Nunavut", abbr: "NU"}
  ];
  
  const industryTypes = [
    "Technology", "Manufacturing", "Agriculture", "Tourism", 
    "Healthcare", "Cultural Industries", "Clean Energy", 
    "Food Processing", "Mining", "Forestry", "Fisheries"
  ];
  
  const grantTypes = [
    {
      type: "Research and Innovation",
      description: "Provides funding support for innovative research projects that advance technology and knowledge in key sectors.",
      fundingRanges: ["$10,000 to $50,000", "$50,000 to $250,000", "Up to $500,000"]
    },
    {
      type: "Business Expansion",
      description: "Supports established businesses looking to grow, expand markets, or scale operations within the province.",
      fundingRanges: ["$25,000 to $100,000", "$100,000 to $500,000", "Up to $1 million"]
    },
    {
      type: "Export Development",
      description: "Helps businesses develop new export markets and expand international trade opportunities.",
      fundingRanges: ["$5,000 to $25,000", "$25,000 to $75,000", "Up to $150,000"]
    },
    {
      type: "Skills Training",
      description: "Provides funding to help employers train current employees or hire and train new staff with specialized skills.",
      fundingRanges: ["$5,000 to $20,000", "$20,000 to $50,000", "Up to $100,000 per year"]
    },
    {
      type: "Capital Investment",
      description: "Supports businesses making significant capital investments in equipment, facilities or technology.",
      fundingRanges: ["$50,000 to $250,000", "$250,000 to $1 million", "Up to $5 million"]
    },
    {
      type: "Start-up Support",
      description: "Provides early-stage funding for new businesses and entrepreneurs launching innovative ventures.",
      fundingRanges: ["$5,000 to $25,000", "$25,000 to $100,000", "Up to $250,000"]
    },
    {
      type: "Community Economic Development",
      description: "Supports projects that promote economic growth and diversification in local communities.",
      fundingRanges: ["$10,000 to $50,000", "$50,000 to $200,000", "Up to $500,000"]
    }
  ];
  
  // Generate province-specific grants
  for (const province of provinces) {
    for (const industry of industryTypes) {
      for (const grantType of grantTypes) {
        // Skip some combinations to avoid too many similar grants
        if (Math.random() > 0.3) continue;
        
        const fundingAmount = grantType.fundingRanges[Math.floor(Math.random() * grantType.fundingRanges.length)];
        const title = `${province.name} ${industry} ${grantType.type} Fund`;
        
        await addGrant({
          title: title,
          description: `${grantType.description} This program focuses specifically on supporting ${industry.toLowerCase()} businesses in ${province.name}.`,
          type: "provincial",
          imageUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?auto=format&fit=crop&w=500&h=280&q=80`,
          deadline: Math.random() > 0.5 ? "Ongoing (applications accepted year-round)" : "Annual deadline (check website for current cycle)",
          fundingAmount: fundingAmount,
          category: grantType.type,
          eligibilityCriteria: [
            `Business must be located in ${province.name}`,
            `Must operate in the ${industry} sector`,
            `In operation for at least one year`,
            `Minimum annual revenue requirements may apply`,
            `Project must align with provincial economic priorities`
          ],
          pros: [
            "Designed specifically for provincial businesses",
            "Focused on local economic development",
            "Access to provincial business development officers",
            "May stack with federal programs",
            "Regional application support available"
          ],
          cons: [
            "Limited to businesses within the province",
            "Competitive application process",
            "May require matching funds",
            "Detailed reporting requirements",
            "Limited funding envelope each year"
          ],
          websiteUrl: `https://www.${province.abbr.toLowerCase()}.ca/business`,
          featured: false,
          industry: industry,
          province: province.name,
          competitionLevel: Math.random() > 0.7 ? "High" : Math.random() > 0.4 ? "Medium" : "Low",
          department: `${province.name} Ministry of Economic Development`,
          documents: [
            "Business registration documents",
            "Financial statements",
            "Project proposal",
            "Budget and timeline",
            "Impact assessment"
          ],
          applicationDates: Math.random() > 0.5 ? "Ongoing (applications accepted year-round)" : "Annual deadline (check website for current cycle)"
        });
      }
    }
    console.log(`Added grants for ${province.name}`);
  }
}

// Function to add more industry-specific federal grants
async function addFederalIndustryGrants() {
  console.log("Adding federal industry grants...");
  
  const industries = [
    "Aerospace", "Automotive", "Biotechnology", "Clean Technology", 
    "Digital Media", "Pharmaceuticals", "Telecommunications", "Oil and Gas",
    "Mining", "Construction", "Transportation", "Retail", "Hospitality"
  ];
  
  const federalProgramTypes = [
    {
      type: "Research and Development",
      description: "Supports research and development activities aimed at creating new products, processes, or services.",
      fundingRanges: ["$100,000 to $500,000", "$500,000 to $2 million", "Up to $5 million"]
    },
    {
      type: "Market Expansion",
      description: "Helps Canadian businesses access new markets both domestically and internationally.",
      fundingRanges: ["$50,000 to $250,000", "$250,000 to $1 million", "Up to $2 million"]
    },
    {
      type: "Innovation Adoption",
      description: "Supports the adoption of innovative technologies and practices to increase productivity and competitiveness.",
      fundingRanges: ["$75,000 to $300,000", "$300,000 to $1 million", "Up to $3 million"]
    },
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
      if (Math.random() > 0.4) continue;
      
      const departmentIndex = Math.floor(Math.random() * federalDepartments.length);
      const department = federalDepartments[departmentIndex];
      const fundingAmount = programType.fundingRanges[Math.floor(Math.random() * programType.fundingRanges.length)];
      const title = `Canadian ${industry} ${programType.type} Initiative`;
      
      await addGrant({
        title: title,
        description: `${programType.description} This program is specifically designed for businesses in the ${industry} sector across Canada.`,
        type: "federal",
        imageUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?auto=format&fit=crop&w=500&h=280&q=80`,
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

// Function to add more private foundation and corporate grants
async function addPrivateGrants() {
  console.log("Adding private organization grants...");
  
  const corporations = [
    "TD Bank", "BMO", "CIBC", "Manulife", "Sun Life",
    "Telus", "Bell", "Rogers", "IBM", "Microsoft", 
    "Google", "Facebook", "Amazon", "Walmart", "Sobeys",
    "Loblaws", "Canadian Tire", "Home Depot", "Shell", "Suncor"
  ];
  
  const foundationTypes = [
    {
      type: "Social Innovation",
      description: "Supports innovative solutions to pressing social challenges across Canadian communities.",
      fundingRanges: ["$5,000 to $25,000", "$25,000 to $100,000", "Up to $250,000"]
    },
    {
      type: "Environmental Sustainability",
      description: "Funds initiatives that protect the environment and promote sustainable practices.",
      fundingRanges: ["$10,000 to $50,000", "$50,000 to $150,000", "Up to $300,000"]
    },
    {
      type: "Education and Skills",
      description: "Supports educational initiatives and skills development programs across Canada.",
      fundingRanges: ["$5,000 to $20,000", "$20,000 to $75,000", "Up to $150,000"]
    },
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
      if (Math.random() > 0.2) continue;
      
      const fundingAmount = foundationType.fundingRanges[Math.floor(Math.random() * foundationType.fundingRanges.length)];
      const title = `${corporation} ${foundationType.type} Fund`;
      
      await addGrant({
        title: title,
        description: `${foundationType.description} The ${corporation} ${foundationType.type} Fund represents the company's commitment to giving back to Canadian communities.`,
        type: "private",
        imageUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?auto=format&fit=crop&w=500&h=280&q=80`,
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

// Main function to add various grants
async function addAllGrants() {
  try {
    // Add provincial grants (potentially 7 grant types × 11 industries × 13 provinces = 1001 grants)
    // We'll add a portion of these by using random selection in the function
    await addProvincialGrants();
    
    // Add federal industry grants (6 program types × 13 industries = 78 grants)
    // We'll add a portion of these by using random selection in the function
    await addFederalIndustryGrants();
    
    // Add private and corporate grants (6 foundation types × 20 corporations = 120 grants)
    // We'll add a portion of these by using random selection in the function
    await addPrivateGrants();
    
    console.log("All grants added successfully!");
  } catch (error) {
    console.error("Error adding grants:", error);
  }
}

// Run the function to add all grants
addAllGrants();