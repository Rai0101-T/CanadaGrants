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

// Function to add more federal industry grants - batch 1
async function addFederalIndustryGrants() {
  console.log("Adding federal industry grants...");
  
  const industries = [
    "Aerospace", "Automotive", "Biotechnology", "Clean Technology", 
    "Digital Media", "Pharmaceuticals", "Telecommunications"
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
        imageUrl: `https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=500&h=280&q=80`,
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

// Function to add more private foundation and corporate grants - batch 1
async function addPrivateGrants() {
  console.log("Adding private organization grants...");
  
  const corporations = [
    "TD Bank", "BMO", "CIBC", "Manulife", "Sun Life",
    "Telus", "Bell", "Rogers", "IBM", "Microsoft"
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
        imageUrl: `https://images.unsplash.com/photo-1565514020179-26b4d6219e45?auto=format&fit=crop&w=500&h=280&q=80`,
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
    // Add federal industry grants (batch 1)
    await addFederalIndustryGrants();
    
    // Add private and corporate grants (batch 1)
    await addPrivateGrants();
    
    console.log("All batch 1 grants added successfully!");
  } catch (error) {
    console.error("Error adding grants:", error);
  }
}

// Run the function to add all grants
addAllGrants();