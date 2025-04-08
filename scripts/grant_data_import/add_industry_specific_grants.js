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
  // 1. Canadian Agricultural Partnership
  console.log('Adding Canadian Agricultural Partnership grant...');
  await addGrant({
    title: 'Canadian Agricultural Partnership (CAP)',
    description: 'The Canadian Agricultural Partnership is a five-year federal-provincial-territorial initiative supporting the agriculture, agri-food and agri-based products sector. It provides funding through various programs focusing on innovation, competitiveness, market development, and environmental sustainability.',
    type: 'federal',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Varies by program and province (check website for current opportunities)',
    fundingAmount: '$5,000 to $2,000,000+ (varies by program)',
    category: 'Agriculture',
    eligibilityCriteria: [
      'Farm or agri-food business operating in Canada',
      'Must meet program-specific eligibility requirements',
      'Business registration and valid tax number',
      'Project aligns with CAP priorities',
      'May require demonstrated history in agriculture sector'
    ],
    pros: [
      'Comprehensive support for agricultural sector',
      'Multiple funding streams for different needs',
      'Both federal and provincial delivery options',
      'Can fund up to 50-75% of project costs (program dependent)',
      'Support for innovation and new technologies'
    ],
    cons: [
      'Complex application process',
      'Cost-sharing required (business must contribute)',
      'Reimbursement model for many programs',
      'Competitive selection process',
      'Detailed reporting requirements'
    ],
    websiteUrl: 'https://agriculture.canada.ca/en/canadian-agricultural-partnership',
    featured: false,
    industry: 'Agriculture',
    province: null,
    competitionLevel: 'Medium',
    department: 'Agriculture and Agri-Food Canada',
    documents: [
      'Business plan',
      'Project plan and objectives',
      'Cost estimates/quotes',
      'Financial statements',
      'Proof of agriculture-related business activity'
    ],
    applicationDates: 'Varies by program and province (check website for current opportunities)'
  });

  // 2. AgriInnovate Program
  console.log('Adding AgriInnovate Program grant...');
  await addGrant({
    title: 'AgriInnovate Program',
    description: 'The AgriInnovate Program aims to accelerate the commercialization, adoption and/or demonstration of innovative products, technologies, processes or services that improve the agriculture sector competitiveness and sustainability.',
    type: 'federal',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770faae9?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (continuous intake)',
    fundingAmount: 'Up to $10 million (covers up to 50% of eligible costs)',
    category: 'Agriculture',
    eligibilityCriteria: [
      'For-profit organizations operating in Canada',
      'Project related to agriculture, agri-food, or agri-based products',
      'Focus on commercialization or adoption of innovation',
      'Minimum total project cost of $100,000',
      'Demonstrate financial capability to complete project'
    ],
    pros: [
      'Substantial funding available for large projects',
      'Supports late-stage innovation (near commercialization)',
      'Repayable contribution (interest-free loan)',
      'Continuous intake process',
      'Covers wide range of innovation types'
    ],
    cons: [
      'Funding is repayable (not a grant)',
      'Must fund at least 50% of eligible costs',
      'Complex application with detailed business case required',
      'Focus on near-market innovations, not early research',
      'Competitive selection process'
    ],
    websiteUrl: 'https://agriculture.canada.ca/en/agricultural-programs-and-services/agriinnovate-program',
    featured: false,
    industry: 'Agriculture',
    province: null,
    competitionLevel: 'High',
    department: 'Agriculture and Agri-Food Canada',
    documents: [
      'Detailed business case',
      'Project implementation plan',
      'Financial projections',
      'Evidence of innovation benefits',
      'Financial statements for last 3 years'
    ],
    applicationDates: 'Ongoing (continuous intake)'
  });

  // 3. Clean Growth Hub
  console.log('Adding Clean Growth Hub grant...');
  await addGrant({
    title: 'Clean Growth Hub',
    description: 'The Clean Growth Hub is a whole-of-government focal point for clean technology focused on supporting companies and projects. It provides advisory services, connections to programs, and coordination across federal clean technology programs to help businesses access funding and support.',
    type: 'federal',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (advisory service)',
    fundingAmount: 'Varies by program (Hub connects to multiple funding sources)',
    category: 'Clean Technology',
    eligibilityCriteria: [
      'Canadian businesses working in clean technology',
      'Specific criteria vary by funding program',
      'Technology with environmental benefits',
      'Focus on innovation, adoption, or export',
      'Various stages from R&D to commercialization'
    ],
    pros: [
      'Single window to access multiple programs',
      'Expert advisory services',
      'No cost to access the Hub',
      'Personalized funding guidance',
      'Connections to relevant government programs'
    ],
    cons: [
      'Not a direct funding program itself',
      'Each funding program has its own application process',
      'Some programs are highly competitive',
      'May involve complex application processes',
      'No guarantee of securing funding'
    ],
    websiteUrl: 'https://www.ic.gc.ca/eic/site/099.nsf/eng/home',
    featured: false,
    industry: 'Clean Technology',
    province: null,
    competitionLevel: 'Medium',
    department: 'Innovation, Science and Economic Development Canada',
    documents: [
      'Business description',
      'Technology description',
      'Project concept',
      'Funding needs assessment',
      'Additional documents depend on specific programs'
    ],
    applicationDates: 'Ongoing (advisory service)'
  });

  // 4. Green Municipal Fund
  console.log('Adding Green Municipal Fund grant...');
  await addGrant({
    title: 'Green Municipal Fund (GMF)',
    description: 'The Green Municipal Fund, delivered by the Federation of Canadian Municipalities, provides funding and knowledge to support sustainable community projects. The fund offers grants, loans, and capacity building for initiatives that reduce energy consumption, address climate change, and improve environmental quality.',
    type: 'federal',
    imageUrl: 'https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (continuous intake for most initiatives)',
    fundingAmount: 'Grants up to $500,000 and loans up to $10 million (varies by project type)',
    category: 'Clean Technology',
    eligibilityCriteria: [
      'Municipal governments or their partners',
      'Project must demonstrate environmental benefits',
      'Must align with GMF priority sectors (energy, water, waste, transportation, land use)',
      'Evidence of technical feasibility',
      'Financial viability and sound business case'
    ],
    pros: [
      'Combination of grants and below-market loans',
      'Funding for multiple project phases (planning, feasibility, pilot, implementation)',
      'Peer learning and knowledge sharing opportunities',
      'Comprehensive support beyond funding',
      'Multiple funding streams available'
    ],
    cons: [
      'Complex application process',
      'Competitive selection process',
      'May require detailed environmental impact assessment',
      'Loan component requires repayment',
      'Lengthy approval timeline for large projects'
    ],
    websiteUrl: 'https://fcm.ca/en/programs/green-municipal-fund',
    featured: false,
    industry: 'Clean Technology',
    province: null,
    competitionLevel: 'Medium',
    organization: 'Federation of Canadian Municipalities',
    documents: [
      'Project plan and timeline',
      'Environmental benefits assessment',
      'Financial analysis and business case',
      'Council/board resolution',
      'Letters of support'
    ],
    applicationDates: 'Ongoing (continuous intake for most initiatives)'
  });

  // 5. Next Generation Manufacturing Canada (NGen) Supercluster
  console.log('Adding NGen Supercluster grant...');
  await addGrant({
    title: 'Next Generation Manufacturing Canada (NGen) Supercluster',
    description: 'NGen is Canada Advanced Manufacturing Supercluster, dedicated to building world-leading manufacturing capabilities in Canada. NGen funds collaborative projects that develop transformative manufacturing and technology solutions to give Canadian manufacturers a competitive edge.',
    type: 'federal',
    imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Periodic calls for proposals (check website for current opportunities)',
    fundingAmount: '$500,000 to $20 million+ (up to 44.4% of eligible project costs)',
    category: 'Manufacturing',
    eligibilityCriteria: [
      'Industry-led consortium with at least one SME',
      'Partners must be NGen members',
      'Project demonstrates advanced manufacturing innovation',
      'Clear commercialization strategy and market potential',
      'Projects must be transformative and collaborative'
    ],
    pros: [
      'Substantial funding for large collaborative projects',
      'Access to Canada manufacturing innovation network',
      'Support for both technological and manufacturing process innovation',
      'Intellectual property framework that benefits participants',
      'Multiple funding streams for different project types'
    ],
    cons: [
      'Complex application process',
      'Requires industry collaboration and consortium building',
      'Highly competitive selection process',
      'Project partners must provide matching funds',
      'Detailed reporting and project management requirements'
    ],
    websiteUrl: 'https://www.ngen.ca/',
    featured: false,
    industry: 'Manufacturing',
    province: null,
    competitionLevel: 'Very High',
    organization: 'Next Generation Manufacturing Canada',
    documents: [
      'Detailed project plan',
      'Consortium agreement',
      'Technology readiness assessment',
      'Commercialization strategy',
      'Intellectual property strategy'
    ],
    applicationDates: 'Periodic calls for proposals (check website for current opportunities)'
  });

  // 6. Aboriginal Business and Entrepreneurship Development
  console.log('Adding Aboriginal Business and Entrepreneurship Development grant...');
  await addGrant({
    title: 'Aboriginal Business and Entrepreneurship Development (ABED)',
    description: 'Aboriginal Business and Entrepreneurship Development provides support to Indigenous entrepreneurs and businesses for a range of activities including business planning, start-up, expansion, and marketing. The program aims to increase the competitiveness of Indigenous businesses in Canadian and global markets.',
    type: 'federal',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8659b8e39abc?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (continuous intake)',
    fundingAmount: 'Up to $99,999 for non-repayable contributions, up to $250,000 for repayable contributions',
    category: 'Indigenous Business',
    eligibilityCriteria: [
      'Indigenous individuals (Status or Non-status Indian, Métis, or Inuit)',
      'Majority-owned Indigenous businesses or organizations',
      'Operating in Canada',
      'Commercially viable business concept',
      'Owner must be actively involved in business operations'
    ],
    pros: [
      'Tailored support for Indigenous entrepreneurs',
      'Combination of grants and repayable contributions',
      'Funding for various business stages and needs',
      'Business support services available',
      'Can cover up to 75% of eligible costs for some applicants'
    ],
    cons: [
      'Owner must demonstrate minimum 10% cash equity in the project',
      'Approval process can be lengthy',
      'Detailed business plan required',
      'Limited total funding amount',
      'Some contributions are repayable'
    ],
    websiteUrl: 'https://www.sac-isc.gc.ca/eng/1582037564226/1610797399865',
    featured: false,
    industry: 'any',
    province: null,
    competitionLevel: 'Medium',
    department: 'Indigenous Services Canada',
    documents: [
      'Business plan',
      'Proof of Indigenous heritage',
      'Financial statements (for existing businesses)',
      'Financial projections',
      'Quotes for project costs'
    ],
    applicationDates: 'Ongoing (continuous intake)'
  });

  console.log('All industry-specific grants added successfully.');
}

// Run the function to add all grants
addAllGrants();