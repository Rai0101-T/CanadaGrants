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

// Function to add regional development grants
async function addRegionalDevelopmentGrants() {
  console.log("Adding regional development grants...");
  
  const regionalAgencies = [
    {
      name: "Federal Economic Development Agency for Southern Ontario (FedDev Ontario)",
      region: "Southern Ontario",
      type: "federal",
      website: "https://www.feddevontario.gc.ca/",
      competitionLevel: "Medium"
    },
    {
      name: "Federal Economic Development Agency for Northern Ontario (FedNor)",
      region: "Northern Ontario",
      type: "federal",
      website: "https://fednor.gc.ca/",
      competitionLevel: "Medium"
    },
    {
      name: "Western Economic Diversification Canada (WD)",
      region: "Western Canada",
      type: "federal",
      website: "https://www.wd-deo.gc.ca/",
      competitionLevel: "Medium"
    },
    {
      name: "Atlantic Canada Opportunities Agency (ACOA)",
      region: "Atlantic Canada",
      type: "federal",
      website: "https://www.acoa-apeca.gc.ca/",
      competitionLevel: "Medium"
    },
    {
      name: "Canada Economic Development for Quebec Regions (CED)",
      region: "Quebec",
      type: "federal",
      website: "https://www.dec-ced.gc.ca/",
      competitionLevel: "Medium"
    },
    {
      name: "Canadian Northern Economic Development Agency (CanNor)",
      region: "Northern Canada",
      type: "federal",
      website: "https://www.cannor.gc.ca/",
      competitionLevel: "Low"
    }
  ];
  
  const programTypes = [
    {
      name: "Business Scale-Up and Productivity",
      description: "Supports businesses at various stages of growth to accelerate their expansion, improve productivity, and enhance their competitiveness in domestic and global markets.",
      fundingAmount: "$250,000 to $5 million (repayable contribution)",
      category: "Business Growth"
    },
    {
      name: "Regional Innovation Ecosystem",
      description: "Supports the growth and development of innovation ecosystems to foster business innovation and productivity, entrepreneurship, and the commercialization of new products, technologies, and processes.",
      fundingAmount: "$500,000 to $5 million (non-repayable contribution)",
      category: "Innovation"
    },
    {
      name: "Community Economic Development and Diversification",
      description: "Supports communities to leverage their capacity and strengths to diversify their economies, transition from traditional to growth industries, and seek new opportunities for economic development.",
      fundingAmount: "$100,000 to $2 million (may be repayable or non-repayable)",
      category: "Community Development"
    },
    {
      name: "Women Entrepreneurship Strategy",
      description: "Supports women entrepreneurs in starting and growing their businesses through increased access to financing, talent, networks and expertise.",
      fundingAmount: "$25,000 to $250,000 (non-repayable contribution)",
      category: "Women in Business"
    },
    {
      name: "Jobs and Growth Fund",
      description: "Supports job creation and positions local economies for long-term growth by transitioning to a green economy, fostering an inclusive recovery, enhancing competitiveness, and creating jobs.",
      fundingAmount: "$500,000 to $10 million (mixture of repayable and non-repayable)",
      category: "Job Creation"
    }
  ];
  
  // Generate regional development grants
  for (const agency of regionalAgencies) {
    for (const program of programTypes) {
      const title = `${agency.name} ${program.name}`;
      
      await addGrant({
        title: title,
        description: `${program.description} This program is delivered by ${agency.name} to support economic development in ${agency.region}.`,
        type: agency.type,
        imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Ongoing (some projects may have call for proposals)",
        fundingAmount: program.fundingAmount,
        category: program.category,
        eligibilityCriteria: [
          `Business or organization located in ${agency.region}`,
          "Legal entity capable of entering into contractual agreements",
          "Project addresses regional priorities",
          "Demonstrated need for funding assistance",
          "Capacity to implement and sustain the project"
        ],
        pros: [
          "Focused on regional economic priorities",
          "Support from regional development officers",
          "May offer both repayable and non-repayable funding",
          "Continuous intake for many programs",
          "Regional expertise and connections"
        ],
        cons: [
          `Limited to organizations in ${agency.region}`,
          "Competitive application process",
          "Detailed application documentation required",
          "Funding decisions can take several months",
          "Extensive reporting requirements"
        ],
        websiteUrl: agency.website,
        featured: false,
        industry: "any",
        province: null,
        competitionLevel: agency.competitionLevel,
        department: agency.name,
        documents: [
          "Business or project plan",
          "Financial statements",
          "Cost estimates",
          "Cash flow projections",
          "Supporting documentation as specified"
        ],
        applicationDates: "Ongoing (some projects may have call for proposals)"
      });
    }
    console.log(`Added grants for ${agency.name}`);
  }
}

// Function to add indigenous business grants
async function addIndigenousBusinessGrants() {
  console.log("Adding indigenous business grants...");
  
  const indigenousPrograms = [
    {
      title: "Aboriginal Business and Entrepreneurship Development",
      description: "Provides support to Indigenous entrepreneurs for business planning, start-up, acquisition, expansion, and marketing activities that benefit Aboriginal individuals and communities.",
      fundingAmount: "Up to $99,999 for individuals; up to $250,000 for community-owned businesses",
      category: "Business Development",
      department: "Indigenous Services Canada",
      websiteUrl: "https://www.sac-isc.gc.ca/",
      competitionLevel: "Medium"
    },
    {
      title: "First Nations and Inuit Youth Employment Strategy",
      description: "Provides funding to First Nations and Inuit communities to support youth in acquiring skills and work experience, helping them prepare for and succeed in the labor market.",
      fundingAmount: "Varies by community and project scope",
      category: "Employment",
      department: "Indigenous Services Canada",
      websiteUrl: "https://www.sac-isc.gc.ca/",
      competitionLevel: "Medium"
    },
    {
      title: "Aboriginal Loan Guarantee Program",
      description: "Provides loan guarantees to Aboriginal businesses for the development and acquisition of renewable energy infrastructure to support their participation in Ontario's clean energy initiatives.",
      fundingAmount: "Loan guarantees up to $50 million per project",
      category: "Energy",
      department: "Ontario Financing Authority",
      websiteUrl: "https://www.ofina.on.ca/",
      competitionLevel: "Medium"
    },
    {
      title: "First Nations Market Housing Fund",
      description: "Facilitates financing for housing on First Nations land and supports First Nations communities in developing capacity for sustainable market-based housing systems.",
      fundingAmount: "Credit enhancement for housing loans",
      category: "Housing",
      department: "Canada Mortgage and Housing Corporation",
      websiteUrl: "https://www.fnmhf.ca/",
      competitionLevel: "Low"
    },
    {
      title: "Indigenous Skills and Employment Training Program",
      description: "Provides funding to Indigenous service delivery organizations to offer job training, skills development, and employment support services tailored to the unique needs of Indigenous peoples.",
      fundingAmount: "Based on community size and project scope",
      category: "Skills Training",
      department: "Employment and Social Development Canada",
      websiteUrl: "https://www.canada.ca/en/employment-social-development.html",
      competitionLevel: "Medium"
    },
    {
      title: "Strategic Partnerships Initiative",
      description: "Coordinates federal efforts to support Indigenous participation in complex economic development opportunities, particularly in natural resource sectors.",
      fundingAmount: "Varies by project and partnership",
      category: "Economic Partnerships",
      department: "Indigenous Services Canada",
      websiteUrl: "https://www.sac-isc.gc.ca/",
      competitionLevel: "High"
    },
    {
      title: "Indigenous Growth Fund",
      description: "Provides capital to Aboriginal Financial Institutions to support Indigenous-led businesses with loans and investments that foster economic growth and job creation.",
      fundingAmount: "Varies based on business needs",
      category: "Access to Capital",
      department: "National Aboriginal Capital Corporations Association",
      websiteUrl: "https://nacca.ca/",
      competitionLevel: "Medium"
    },
    {
      title: "Aboriginal Business Financing Program",
      description: "Provides non-repayable contributions to Indigenous entrepreneurs and businesses for business planning, start-up, marketing, and expansions.",
      fundingAmount: "Up to $99,999 for business support; up to $250,000 for business development",
      category: "Business Financing",
      department: "Aboriginal Financial Institutions",
      websiteUrl: "https://nacca.ca/",
      competitionLevel: "Medium"
    }
  ];
  
  for (const program of indigenousPrograms) {
    await addGrant({
      title: program.title,
      description: program.description,
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=500&h=280&q=80",
      deadline: "Ongoing (check with local delivery organization)",
      fundingAmount: program.fundingAmount,
      category: program.category,
      eligibilityCriteria: [
        "First Nations, Inuit, or Métis individuals or communities",
        "Indigenous-owned or controlled businesses",
        "Meet program-specific eligibility criteria",
        "Demonstrated need for funding assistance",
        "Project viability and sustainability"
      ],
      pros: [
        "Specifically designed for Indigenous peoples and communities",
        "May offer non-repayable contributions",
        "Cultural appropriateness in program delivery",
        "Support throughout application and implementation",
        "Focus on long-term economic development"
      ],
      cons: [
        "Funding may be limited based on annual allocations",
        "Application process can be complex",
        "May require community support/endorsement",
        "Detailed reporting requirements",
        "Competitive application process for some programs"
      ],
      websiteUrl: program.websiteUrl,
      featured: false,
      industry: "any",
      province: null,
      competitionLevel: program.competitionLevel,
      department: program.department,
      documents: [
        "Proof of Indigenous identity/status",
        "Business or project plan",
        "Financial statements (if applicable)",
        "Cost estimates",
        "Supporting documentation as specified"
      ],
      applicationDates: "Ongoing (check with local delivery organization)"
    });
  }
  console.log("Added Indigenous business grants");
}

// Main function to add various grants
async function addAllGrants() {
  try {
    // Add regional development grants
    await addRegionalDevelopmentGrants();
    
    // Add indigenous business grants
    await addIndigenousBusinessGrants();
    
    console.log("All batch 3 grants added successfully!");
  } catch (error) {
    console.error("Error adding grants:", error);
  }
}

// Run the function to add all grants
addAllGrants();