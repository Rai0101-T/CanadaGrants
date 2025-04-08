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
  // 1. Digital Skills for Youth
  console.log('Adding Digital Skills for Youth grant...');
  await addGrant({
    title: 'Digital Skills for Youth (DS4Y)',
    description: 'Digital Skills for Youth helps post-secondary graduates gain meaningful work experience and digital skills by connecting them with small businesses and not-for-profit organizations. The program provides wage subsidies to employers who hire eligible youth for digital roles.',
    type: 'federal',
    imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Varies by delivery organization (check website for current opportunities)',
    fundingAmount: 'Up to $25,500 per intern (covers up to 90% of eligible expenses)',
    category: 'Youth Employment',
    eligibilityCriteria: [
      'Employer must be a small business, not-for-profit, or indigenous organization',
      'Intern must be between 15-30 years old',
      'Canadian citizen, permanent resident, or refugee status',
      'Post-secondary graduate',
      'Legally entitled to work in Canada',
      'Not in receipt of EI benefits'
    ],
    pros: [
      'Substantial wage subsidy for employers',
      'Includes funding for digital skills training',
      'Helps recent graduates gain relevant work experience',
      'Multiple delivery organizations across Canada',
      'Positions can be remote or in-person'
    ],
    cons: [
      'Specific application periods (not continuous intake)',
      'Competitive selection process',
      'Limited internship period (typically 3-6 months)',
      'Employer must provide meaningful mentorship',
      'Administrative requirements for reporting'
    ],
    websiteUrl: 'https://ised-isde.canada.ca/site/digital-skills-youth/en',
    featured: false,
    industry: 'Technology',
    province: null,
    competitionLevel: 'Medium',
    department: 'Innovation, Science and Economic Development Canada',
    documents: [
      'Employer application form',
      'Job description for the intern position',
      'Training plan outlining digital skills development',
      'Business registration documents',
      'Payroll information'
    ],
    applicationDates: 'Varies by delivery organization (check website for current opportunities)'
  });

  // 2. Investments in Forest Industry Transformation (IFIT)
  console.log('Adding IFIT grant...');
  await addGrant({
    title: 'Investments in Forest Industry Transformation (IFIT)',
    description: 'The Investments in Forest Industry Transformation program provides funding to support Canada forest sector in becoming more economically competitive and environmentally sustainable. The program focuses on innovative projects that create new bioproducts, adopt advanced technologies, and implement process improvements.',
    type: 'federal',
    imageUrl: 'https://images.unsplash.com/photo-1503785640985-f62e3aeee448?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Periodic calls for proposals (check website for current opportunities)',
    fundingAmount: '$2 million to $20 million (up to 50% of eligible costs)',
    category: 'Forestry',
    eligibilityCriteria: [
      'For-profit companies operating in Canada forest sector',
      'Projects must involve a wood processing facility located in Canada',
      'Focus on bioproducts, biorefinery, energy, or process improvements',
      'Technology readiness level of 7-9 (near commercial ready)',
      'Financial capacity to complete the project'
    ],
    pros: [
      'Substantial funding for large-scale projects',
      'Support for innovative and transformative technologies',
      'Non-repayable contributions',
      'Expert guidance throughout project implementation',
      'Helps traditional forest industry diversify products and markets'
    ],
    cons: [
      'Highly competitive selection process',
      'Complex application requirements',
      'Requires significant financial matching from applicant',
      'Limited call for proposal periods',
      'Extensive reporting requirements'
    ],
    websiteUrl: 'https://www.nrcan.gc.ca/science-and-data/funding-partnerships/funding-opportunities/forest-sector-funding-programs/investments-forest-industry-transformation-ifit/13139',
    featured: false,
    industry: 'Forestry',
    province: null,
    competitionLevel: 'High',
    department: 'Natural Resources Canada',
    documents: [
      'Detailed project proposal',
      'Technical assessment of proposed technology',
      'Environmental benefits analysis',
      'Market assessment for new products',
      'Financial projections and business case'
    ],
    applicationDates: 'Periodic calls for proposals (check website for current opportunities)'
  });

  // 3. Indigenous Skills and Employment Training Program
  console.log('Adding Indigenous Skills and Employment Training Program grant...');
  await addGrant({
    title: 'Indigenous Skills and Employment Training Program (ISET)',
    description: 'The Indigenous Skills and Employment Training Program helps Indigenous people improve their skills and find employment. The program provides funding to Indigenous service delivery organizations to offer job training, skills development, and employment support services tailored to the unique needs of their communities.',
    type: 'federal',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (services available year-round)',
    fundingAmount: 'Varies based on individual needs and local programs',
    category: 'Skills Development',
    eligibilityCriteria: [
      'First Nations, Inuit, or Métis individuals',
      'Living on or off reserve',
      'Seeking employment or skills training',
      'Specific eligibility may vary by local service provider',
      'May have priority criteria for youth, women, or persons with disabilities'
    ],
    pros: [
      'Culturally appropriate training and services',
      'Designed and delivered by Indigenous organizations',
      'Comprehensive support (from skills assessment to job placement)',
      'Long-term stable funding approach',
      'Services available in many communities across Canada'
    ],
    cons: [
      'Available services vary by location and service provider',
      'May have waiting lists for certain programs',
      'Limited funding for individual participants',
      'May not cover all industries or occupations',
      'Some remote communities have fewer service options'
    ],
    websiteUrl: 'https://www.canada.ca/en/employment-social-development/programs/indigenous-skills-employment-training.html',
    featured: false,
    industry: 'any',
    province: null,
    competitionLevel: 'Low',
    department: 'Employment and Social Development Canada',
    documents: [
      'Proof of Indigenous identity',
      'Personal identification',
      'Resume (if available)',
      'Employment insurance information (if applicable)',
      'Skills assessment documentation'
    ],
    applicationDates: 'Ongoing (services available year-round)'
  });

  // 4. Manitoba Technology Accelerator
  console.log('Adding Manitoba Technology Accelerator grant...');
  await addGrant({
    title: 'Manitoba Technology Accelerator (MTA)',
    description: 'The Manitoba Technology Accelerator provides mentorship, resources, and funding to help technology startups and scaleups achieve commercial success. MTA offers multiple support programs including business incubation, angel investment access, and growth acceleration services.',
    type: 'provincial',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (application review on a quarterly basis)',
    fundingAmount: 'Varies by program ($25,000 to $250,000+ through investment networks)',
    category: 'Technology',
    eligibilityCriteria: [
      'Technology-focused company based in Manitoba',
      'Scalable business model with growth potential',
      'Innovative product or service with clear market opportunity',
      'Committed founding team',
      'Early revenue or near-revenue stage preferred'
    ],
    pros: [
      'Comprehensive support beyond just funding',
      'Access to experienced mentors and entrepreneurs',
      'Connections to angel and venture capital networks',
      'Co-working space available',
      'Long-term support throughout company lifecycle'
    ],
    cons: [
      'Selective application process',
      'May require equity participation',
      'Focus primarily on technology companies',
      'Significant time commitment required',
      'Primarily based in Winnipeg (less support for rural companies)'
    ],
    websiteUrl: 'https://mbtechaccelerator.com/',
    featured: false,
    industry: 'Technology',
    province: 'Manitoba',
    competitionLevel: 'Medium',
    organization: 'Manitoba Technology Accelerator',
    documents: [
      'Business plan',
      'Executive summary',
      'Financial projections',
      'Product/service description',
      'Team biographies'
    ],
    applicationDates: 'Ongoing (application review on a quarterly basis)'
  });

  // 5. Saskatchewan Technology Startup Incentive (STSI)
  console.log('Adding STSI grant...');
  await addGrant({
    title: 'Saskatchewan Technology Startup Incentive (STSI)',
    description: 'The Saskatchewan Technology Startup Incentive offers a 45% non-refundable tax credit to investors who invest in eligible technology startups in Saskatchewan. The program aims to increase investment in early-stage technology startups and foster growth in the province tech sector.',
    type: 'provincial',
    imageUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing',
    fundingAmount: '45% tax credit on investments up to $140,000 per investor annually',
    category: 'Tax Credit',
    eligibilityCriteria: [
      'Startup must be a small business based in Saskatchewan',
      'Focused on developing new technologies',
      'Less than 50 employees, majority in Saskatchewan',
      'Less than $5 million in annual revenue',
      'Startup must be eligible for STSI certificate'
    ],
    pros: [
      'Attractive tax credit for investors (45%)',
      'Helps startups access early-stage capital',
      'Simple online application process',
      'No limit on total company fundraising',
      'Stacks with federal SR&ED tax credits'
    ],
    cons: [
      'Benefits investors directly rather than companies',
      'Limited to technology-focused companies',
      'Startups must first qualify for eligibility',
      'Requires certain corporate structure',
      'Investors must be Saskatchewan taxpayers'
    ],
    websiteUrl: 'https://innovationsask.ca/programs/stsi',
    featured: false,
    industry: 'Technology',
    province: 'Saskatchewan',
    competitionLevel: 'Low',
    department: 'Innovation Saskatchewan',
    documents: [
      'STSI eligibility application',
      'Business incorporation documents',
      'Financial statements',
      'Technology development plan',
      'Investor information form'
    ],
    applicationDates: 'Ongoing'
  });

  // 6. Atlantic Canada Opportunities Agency (ACOA) Programs
  console.log('Adding ACOA Programs grant...');
  await addGrant({
    title: 'Atlantic Canada Opportunities Agency (ACOA) Programs',
    description: 'The Atlantic Canada Opportunities Agency offers a range of programs to support businesses, communities, and organizations in Atlantic Canada. ACOA provides funding for business development, innovation, clean growth, and community economic development initiatives.',
    type: 'federal',
    imageUrl: 'https://images.unsplash.com/photo-1525538182201-02cd1909effb?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (continuous intake)',
    fundingAmount: '$20,000 to $500,000+ (varies by program)',
    category: 'Regional Development',
    eligibilityCriteria: [
      'Business, non-profit, or community organization in Atlantic Canada',
      'Project aligned with ACOA priorities and regional growth',
      'Demonstrated need for funding assistance',
      'Project readiness and implementation capacity',
      'Evidence of economic benefits to the region'
    ],
    pros: [
      'Multiple funding streams for different needs',
      'Both repayable and non-repayable contributions available',
      'Regional offices provide localized support',
      'Continuous intake (no deadline pressure)',
      'Support for projects at various stages of development'
    ],
    cons: [
      'Competitive application process',
      'Business funding typically requires repayment',
      'Detailed application documentation required',
      'Funding decisions can take several months',
      'Extensive reporting requirements'
    ],
    websiteUrl: 'https://www.canada.ca/en/atlantic-canada-opportunities.html',
    featured: false,
    industry: 'any',
    province: null,
    competitionLevel: 'Medium',
    department: 'Atlantic Canada Opportunities Agency',
    documents: [
      'Project proposal with implementation plan',
      'Cost estimates and financial projections',
      'Business registration documents',
      'Financial statements',
      'Market analysis (for business projects)'
    ],
    applicationDates: 'Ongoing (continuous intake)'
  });

  console.log('All additional grants added successfully.');
}

// Run the function to add all grants
addAllGrants();