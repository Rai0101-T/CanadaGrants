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
  // 1. Strategic Innovation Fund
  console.log('Adding Strategic Innovation Fund grant...');
  await addGrant({
    title: 'Strategic Innovation Fund (SIF)',
    description: 'The Strategic Innovation Fund supports large-scale, transformative, and collaborative projects that promote innovation in Canada across all industries. It aims to accelerate technology transfer, commercialization, and scaling up of Canadian companies.',
    type: 'federal',
    imageUrl: 'https://images.unsplash.com/photo-1551089779-36e3f1c604a3?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (continuous intake)',
    fundingAmount: '$10 million to $100 million+',
    category: 'Innovation',
    eligibilityCriteria: [
      'For-profit corporations (businesses of all sizes) incorporated in Canada',
      'Industry associations established in Canada',
      'Research and development organizations established in Canada',
      'Project must be innovative and transformative',
      'Minimum project size of $20 million',
    ],
    pros: [
      'Substantial funding available for large-scale projects',
      'Supports various activities from R&D to production scaling',
      'Can fund up to 50% of eligible project costs',
      'Collaborative projects across multiple partners encouraged',
      'Multiple funding streams available for different types of innovation activities'
    ],
    cons: [
      'Highly competitive application process',
      'Complex and lengthy application requirements',
      'Better suited for large-scale projects and established companies',
      'Significant documentation and reporting requirements',
      'May require repayment depending on the stream'
    ],
    websiteUrl: 'https://ised-isde.canada.ca/site/strategic-innovation-fund/en',
    featured: true,
    industry: 'any',
    province: null,
    competitionLevel: 'High',
    department: 'Innovation, Science and Economic Development Canada',
    documents: [
      'Detailed business case',
      'Project plan with milestones and timelines',
      'Financial projections and funding breakdown',
      'Supporting documentation for technological innovation',
      'Environmental impact assessment (if applicable)'
    ],
    applicationDates: 'Ongoing (continuous intake)',
    applicationLink: 'https://ised-isde.canada.ca/site/strategic-innovation-fund/en/how-apply'
  });

  // 2. Sustainable Development Technology Canada (SDTC)
  console.log('Adding SDTC grant...');
  await addGrant({
    title: 'Sustainable Development Technology Canada (SDTC)',
    description: 'SDTC funds and supports Canadian companies developing and demonstrating new clean technologies that address climate change, clean air, clean water, and clean soil challenges. The fund helps bridge the gap between research and commercialization.',
    type: 'federal',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (regular funding rounds throughout the year)',
    fundingAmount: '$50,000 to $10 million',
    category: 'Clean Technology',
    eligibilityCriteria: [
      'Canadian company developing clean technology innovation',
      'Technology must have significant and quantifiable environmental benefits',
      'Project should demonstrate a new or improved technology with commercial potential',
      'Must have strong business case and plan for market adoption',
      'Project should create sustainable jobs in Canada'
    ],
    pros: [
      'Non-repayable funding up to 40% of eligible project costs',
      'Access to network of experts and investors',
      'Project management support and coaching available',
      'Potential follow-on funding for successful projects',
      'Enhances credibility in the cleantech ecosystem'
    ],
    cons: [
      'Highly competitive selection process',
      'Rigorous due diligence process',
      'Requires demonstration of significant environmental benefits',
      'Extensive reporting requirements',
      'Must secure matching contributions from other sources'
    ],
    websiteUrl: 'https://www.sdtc.ca',
    featured: true,
    industry: 'Clean Technology',
    province: null,
    competitionLevel: 'High',
    department: 'Sustainable Development Technology Canada',
    documents: [
      'Technical proposal with innovation details',
      'Business plan with market analysis',
      'Environmental benefits quantification',
      'Project implementation plan',
      'Letters of support from industry partners'
    ],
    applicationDates: 'Ongoing (regular funding rounds throughout the year)',
    applicationLink: 'https://www.sdtc.ca/en/apply/'
  });

  // 3. Canada Digital Adoption Program - Grow Your Business Online
  console.log('Adding CDAP - Grow Your Business Online grant...');
  await addGrant({
    title: 'Canada Digital Adoption Program - Grow Your Business Online',
    description: 'The Grow Your Business Online stream of the Canada Digital Adoption Program helps small businesses implement e-commerce capabilities and enhance their digital presence. It provides microgrants and support for adopting digital technologies.',
    type: 'federal',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'March 31, 2025 (subject to change)',
    fundingAmount: 'Up to $2,400',
    category: 'Digital Transformation',
    eligibilityCriteria: [
      'Small business with 1-49 employees',
      'Registered to operate in Canada',
      'For-profit business',
      'Must commit to maintaining a digital presence for at least 6 months',
      'Must consent to participating in follow-up surveys'
    ],
    pros: [
      'No repayment required (grant)',
      'Access to e-commerce advisors',
      'Support for digital marketing and website enhancement',
      'Relatively straightforward application process',
      'Additional support through partner organizations'
    ],
    cons: [
      'Limited grant amount',
      'Must use for specified digital adoption activities',
      'May have waiting periods depending on demand',
      'Must work with specific service providers in some regions',
      'Post-funding reporting requirements'
    ],
    websiteUrl: 'https://ised-isde.canada.ca/site/canada-digital-adoption-program/en',
    featured: false,
    industry: 'any',
    province: null,
    competitionLevel: 'Low',
    department: 'Innovation, Science and Economic Development Canada',
    documents: [
      'Business registration information',
      'Basic business information',
      'Digital needs assessment',
      'Banking information (for grant deposit)',
      'Attestation form'
    ],
    applicationDates: 'Ongoing until March 31, 2025',
    applicationLink: 'https://ised-isde.canada.ca/site/canada-digital-adoption-program/en/grow-your-business-online'
  });

  // 4. Canada Digital Adoption Program - Boost Your Business Technology
  console.log('Adding CDAP - Boost Your Business Technology grant...');
  await addGrant({
    title: 'Canada Digital Adoption Program - Boost Your Business Technology',
    description: 'The Boost Your Business Technology stream helps businesses develop a digital adoption plan and implement new digital technologies to increase their competitiveness. It provides funding for digital advisors, technology implementation, and hiring support.',
    type: 'federal',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'March 31, 2025 (subject to change)',
    fundingAmount: 'Up to $15,000 for digital planning, up to $100,000 interest-free loan for implementation',
    category: 'Digital Transformation',
    eligibilityCriteria: [
      'Small or medium-sized business with 1-499 full-time equivalent employees',
      'Annual revenue of at least $500,000 in one of the last three tax years',
      'For-profit business registered in Canada',
      'Plan to use the grant to develop a digital adoption plan',
      'Commitment to implementing the recommendations'
    ],
    pros: [
      'Substantial support for comprehensive digital transformation',
      'Zero-interest loans for technology implementation',
      'Access to skilled digital advisors',
      'Wage subsidies for student hiring',
      'Support through entire digital adoption journey'
    ],
    cons: [
      'More complex application process than the Grow Your Business Online stream',
      'Loan component requires repayment',
      'More extensive reporting requirements',
      'Need to work with qualified service providers',
      'Implementation funding not guaranteed'
    ],
    websiteUrl: 'https://ised-isde.canada.ca/site/canada-digital-adoption-program/en',
    featured: true,
    industry: 'any',
    province: null,
    competitionLevel: 'Medium',
    department: 'Innovation, Science and Economic Development Canada',
    documents: [
      'Financial statements for last 3 years',
      'Business registration information',
      'Digital needs assessment',
      'Business plan',
      'Technology assessment'
    ],
    applicationDates: 'Ongoing until March 31, 2025',
    applicationLink: 'https://ised-isde.canada.ca/site/canada-digital-adoption-program/en/boost-your-business-technology'
  });

  console.log('All federal grants added successfully.');
}

// Run the function to add all grants
addAllGrants();