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
  // 1. Ontario Centres of Excellence (OCE)
  console.log('Adding Ontario OCE grant...');
  await addGrant({
    title: 'Ontario Centres of Excellence (OCE) Programs',
    description: 'Ontario Centre of Excellence (now part of Ontario Innovation) offers various funding programs that connect businesses with academic institutions to accelerate innovation. Programs support R&D projects, commercialization, and talent development in priority sectors.',
    type: 'provincial',
    imageUrl: 'https://images.unsplash.com/photo-1456428746267-a1756408f782?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Varies by program (check website for current opportunities)',
    fundingAmount: '$25,000 to $500,000+ (varies by program)',
    category: 'Research & Development',
    eligibilityCriteria: [
      'Ontario-based business',
      'Project must involve collaboration with Ontario academic institution(s) for many programs',
      'Must demonstrate innovation and commercial potential',
      'Industry contribution required (typically 1:1 matching)',
      'Focus areas include advanced manufacturing, digital technologies, cleantech, and life sciences'
    ],
    pros: [
      'Connects industry with academic expertise and resources',
      'Various programs for different stages of innovation',
      'Can leverage additional funding from federal sources',
      'Access to Ontario innovation ecosystem',
      'Support beyond funding (mentorship, connections, etc.)'
    ],
    cons: [
      'Requires academic collaboration for many programs',
      'Competitive application process',
      'Matching contributions often required',
      'Detailed reporting requirements',
      'Limited to Ontario businesses and institutions'
    ],
    websiteUrl: 'https://www.oce-ontario.org',
    featured: false,
    industry: 'Technology',
    province: 'Ontario',
    competitionLevel: 'High',
    department: 'Ontario Ministry of Economic Development, Job Creation and Trade',
    documents: [
      'Project proposal',
      'Budget and financial projections',
      'Letters of support from academic partners',
      'Business registration documents',
      'Market analysis and commercialization plan'
    ],
    applicationDates: 'Varies by program (check website for current opportunities)'
  });

  // 2. Ontario Together Fund
  console.log('Adding Ontario Together Fund grant...');
  await addGrant({
    title: 'Ontario Together Fund',
    description: 'The Ontario Together Fund provides financial support to companies that are retooling their operations to produce supplies and equipment for the healthcare sector and businesses that are developing innovative solutions to help businesses reopen and operate safely.',
    type: 'provincial',
    imageUrl: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (subject to funding availability)',
    fundingAmount: '$100,000 to $2.5 million',
    category: 'Innovation',
    eligibilityCriteria: [
      'Ontario-based company',
      'Project must help Ontario businesses safely reopen and operate or support the healthcare sector',
      'Must demonstrate innovation, scalability, and industry leadership',
      'Must have a solid business case and implementation plan',
      'Manufacturing-ready or ready to commercialize'
    ],
    pros: [
      'Covers up to 50% of eligible project costs',
      'Support for both established and early-stage companies',
      'Relatively quick application and approval process',
      'Supports companies pivoting to meet market needs',
      'High visibility for successful applicants'
    ],
    cons: [
      'Requires matching funds from the company',
      'Priority given to projects with immediate implementation',
      'Focused on specific sectors and pandemic recovery',
      'Competitive application process',
      'Detailed reporting requirements'
    ],
    websiteUrl: 'https://www.ontario.ca/page/ontario-together-funding-program',
    featured: false,
    industry: 'Manufacturing',
    province: 'Ontario',
    competitionLevel: 'Medium',
    department: 'Ontario Ministry of Economic Development, Job Creation and Trade',
    documents: [
      'Project implementation plan',
      'Business case and market opportunity',
      'Financial statements',
      'Cost breakdown for the project',
      'Ontario incorporation documents'
    ],
    applicationDates: 'Ongoing (subject to funding availability)'
  });

  // 3. BC Employer Training Grant
  console.log('Adding BC Employer Training Grant...');
  await addGrant({
    title: 'BC Employer Training Grant',
    description: 'The BC Employer Training Grant supports employers in providing skills training to new or current employees. The program aims to help employers upgrade employee skills, address provincial labour market needs, and increase employee job security.',
    type: 'provincial',
    imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (applications accepted year-round)',
    fundingAmount: 'Up to $10,000 per employee, maximum $300,000 per employer annually',
    category: 'Skills Development',
    eligibilityCriteria: [
      'BC-based employer (must have a business or corporate registration in BC)',
      'Must be operating in BC for at least one year',
      'Eligible employees must be BC residents',
      'Training must address a skills gap and be delivered by a third-party trainer',
      'Training must be completed within one year of approval'
    ],
    pros: [
      'Covers up to 80% of training costs for eligible employers',
      'Applications accepted year-round',
      'Flexible for various types of training',
      'Supports both technical and soft skills development',
      'Multiple streams available for different training needs'
    ],
    cons: [
      'Reimbursement-based (employer pays upfront)',
      'Training must be through approved third-party providers',
      'Cannot be used for mandatory training or training that would happen regardless',
      'Some sectors have restrictions',
      'Training cannot start until application is approved'
    ],
    websiteUrl: 'https://www.workbc.ca/employer-resources/bc-employer-training-grant.aspx',
    featured: false,
    industry: 'any',
    province: 'British Columbia',
    competitionLevel: 'Low',
    department: 'BC Ministry of Advanced Education and Skills Training',
    documents: [
      'Detailed training plan',
      'Cost quotes from training providers',
      'Business registration documents',
      'Employee information (for those receiving training)',
      'Employer attestation form'
    ],
    applicationDates: 'Ongoing (applications accepted year-round)'
  });

  // 4. Alberta Innovates
  console.log('Adding Alberta Innovates grant...');
  await addGrant({
    title: 'Alberta Innovates - Product Demonstration Program',
    description: 'The Product Demonstration Program supports Alberta small and medium-sized enterprises (SMEs) in accelerating commercialization of their innovative technology products by enabling real-world demonstrations with potential customers.',
    type: 'provincial',
    imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (continuous intake)',
    fundingAmount: 'Up to $150,000 (covering up to 50% of eligible project costs)',
    category: 'Technology Commercialization',
    eligibilityCriteria: [
      'Alberta-based SME (fewer than 500 full-time employees)',
      'Incorporated and operating in Alberta',
      'Product/technology must be beyond prototype stage',
      'Must have identified potential customer willing to participate in demonstration',
      'Clear commercialization strategy and path to market'
    ],
    pros: [
      'Non-dilutive funding (grant)',
      'Helps bridge the gap between development and commercial sales',
      'Builds customer relationships and references',
      'Supports real-world validation of technology',
      'Continuous intake (no deadlines)'
    ],
    cons: [
      'Requires matching contribution from applicant',
      'Limited to demonstration projects (not R&D)',
      'Reimbursement model (pay costs first, then claim)',
      'Project must be completed within 18 months',
      'Detailed reporting requirements'
    ],
    websiteUrl: 'https://albertainnovates.ca/programs/product-demonstration-program/',
    featured: false,
    industry: 'Technology',
    province: 'Alberta',
    competitionLevel: 'Medium',
    department: 'Alberta Innovates',
    documents: [
      'Technology demonstration plan',
      'Letter of support from demonstration partner/customer',
      'Business plan with commercialization strategy',
      'Project budget and timeline',
      'Alberta incorporation documents'
    ],
    applicationDates: 'Ongoing (continuous intake)'
  });

  // 5. Business Link (Alberta)
  console.log('Adding Business Link grant...');
  await addGrant({
    title: 'Business Link - Digital Economy Program',
    description: 'The Digital Economy Program helps Alberta small businesses adopt digital tools and technologies. The program provides coaching, resources, and funding to enhance online presence, e-commerce capabilities, and digital marketing strategies.',
    type: 'provincial',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (subject to funding availability)',
    fundingAmount: 'Up to $5,000 (covers up to 75% of eligible costs)',
    category: 'Digital Transformation',
    eligibilityCriteria: [
      'Alberta-based small business (fewer than 50 employees)',
      'Registered to operate in Alberta',
      'Annual revenue less than $5 million',
      'In operation for at least 1 year',
      'Must complete digital needs assessment'
    ],
    pros: [
      'Combines coaching with funding support',
      'Focused on practical digital adoption for small businesses',
      'User-friendly application process',
      'Quick approval timeline',
      'Comprehensive support from digital service providers'
    ],
    cons: [
      'Limited funding amount',
      'Business must contribute 25% of costs',
      'Reimbursement model',
      'Some digital solutions may not be eligible',
      'Limited to specific types of digital tools'
    ],
    websiteUrl: 'https://businesslink.ca/digital-economy-program/',
    featured: false,
    industry: 'any',
    province: 'Alberta',
    competitionLevel: 'Low',
    department: 'Business Link',
    documents: [
      'Business registration documents',
      'Digital needs assessment results',
      'Quotes from service providers',
      'Implementation plan',
      'Financial statements or tax returns'
    ],
    applicationDates: 'Ongoing (subject to funding availability)'
  });

  // 6. Quebec Tax Credits for E-business (TCEB)
  console.log('Adding Quebec TCEB grant...');
  await addGrant({
    title: 'Quebec Tax Credits for E-business (TCEB)',
    description: 'The Tax Credit for E-Business (TCEB) in Quebec provides eligible corporations with a refundable tax credit for employee salaries related to developing or integrating information technology. This program helps technology companies reduce operating costs and expand operations in Quebec.',
    type: 'provincial',
    imageUrl: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (available until December 31, 2025)',
    fundingAmount: 'Up to 30% of eligible employee salaries (maximum $25,000 per employee annually)',
    category: 'Information Technology',
    eligibilityCriteria: [
      'Corporation with establishment in Quebec',
      'Activities must be in eligible IT sectors',
      'Must obtain qualification certificate from Investissement Québec',
      'Minimum of 6 eligible employees',
      'At least 75% of activities must be IT-related'
    ],
    pros: [
      'Substantial tax relief on IT employee salaries',
      'Refundable credit (receive even if no taxes owed)',
      'Long-term program stability',
      'Can be combined with R&D tax credits',
      'No limit on total credit amount'
    ],
    cons: [
      'Complex qualification process',
      'Strict industry and activity requirements',
      'Requires detailed documentation of employee activities',
      'Annual certification renewal required',
      'Specialized accounting expertise recommended'
    ],
    websiteUrl: 'https://www.investquebec.com/quebec/en/financial-products/SMEs-and-large-corporations/tax-measures/tax-credit-for-the-development-of-e-business.html',
    featured: false,
    industry: 'Technology',
    province: 'Quebec',
    competitionLevel: 'Medium',
    department: 'Investissement Québec',
    documents: [
      'Application for qualification certificate',
      'Detailed description of business activities',
      'Employee job descriptions and time tracking',
      'Financial statements',
      'Corporate tax returns'
    ],
    applicationDates: 'Ongoing (available until December 31, 2025)'
  });

  // 7. Quebec Economic Development Program (QEDP)
  console.log('Adding QEDP grant...');
  await addGrant({
    title: 'Quebec Economic Development Program (QEDP)',
    description: 'The Quebec Economic Development Program supports businesses and organizations in Quebec through various initiatives aimed at strengthening regional economies. The program focuses on innovation, entrepreneurship, and business development in regions throughout Quebec.',
    type: 'provincial',
    imageUrl: 'https://images.unsplash.com/photo-1563694983011-6f4d90358083?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing (varies by initiative)',
    fundingAmount: '$50,000 to $1,000,000+ (varies by project and initiative)',
    category: 'Business Development',
    eligibilityCriteria: [
      'Quebec-based business or organization',
      'Project must align with regional economic priorities',
      'Must demonstrate economic benefits for the region',
      'Viable business plan with clear objectives',
      'Evidence of financial capacity to complete the project'
    ],
    pros: [
      'Supports a wide range of economic development activities',
      'Tailored to regional priorities and needs',
      'Can fund up to 50% of eligible costs',
      'Both repayable and non-repayable funding available',
      'Support for businesses in various sectors'
    ],
    cons: [
      'Application process can be lengthy',
      'Requires significant project documentation',
      'Some funding may be repayable',
      'Matching funds often required',
      'Priority given to projects with significant regional impact'
    ],
    websiteUrl: 'https://dec.canada.ca/eng/programs/qedp/index.html',
    featured: false,
    industry: 'any',
    province: 'Quebec',
    competitionLevel: 'Medium',
    department: 'Canada Economic Development for Quebec Regions',
    documents: [
      'Business plan',
      'Project description and implementation strategy',
      'Financial statements',
      'Cost estimates and quotes',
      'Impact assessment (economic, social, environmental)'
    ],
    applicationDates: 'Ongoing (varies by initiative)'
  });

  console.log('All provincial grants added successfully.');
}

// Run the function to add all grants
addAllGrants();