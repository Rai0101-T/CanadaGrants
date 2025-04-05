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
  // 1. RBC Small Business Grants
  console.log('Adding RBC Small Business Grant...');
  await addGrant({
    title: 'RBC Small Business Grants',
    description: 'RBC offers various grant programs to support Canadian small businesses, including women-owned businesses, newcomers, young entrepreneurs, and sustainability-focused ventures. These grants provide funding alongside mentorship and resources.',
    type: 'private',
    imageUrl: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Varies by program (check website for current opportunities)',
    fundingAmount: '$5,000 to $100,000 (varies by program)',
    category: 'Small Business',
    eligibilityCriteria: [
      'Canadian-based business',
      'In operation for at least 6 months for most programs',
      'Revenue-generating business',
      'Specific criteria varies by program (women-owned, youth-led, etc.)',
      'Must have a business bank account (not necessarily with RBC)'
    ],
    pros: [
      'Non-repayable funding (grants)',
      'Often includes business mentorship and resources',
      'Various programs targeting different business types',
      'National reach with some regional focus options',
      'Relatively straightforward application process'
    ],
    cons: [
      'Highly competitive application process',
      'Limited funding windows (not always available)',
      'Some programs require specific demographic criteria',
      'May require detailed business plans and financials',
      'Public pitching may be required for finalists'
    ],
    websiteUrl: 'https://www.rbcroyalbank.com/business/advice/index.html',
    featured: true,
    industry: 'any',
    province: null,
    competitionLevel: 'High',
    organization: 'Royal Bank of Canada',
    documents: [
      'Business plan',
      'Financial statements or projections',
      'Business registration documents',
      'Pitch deck or project proposal',
      'Video submission (for some programs)'
    ],
    applicationDates: 'Varies by program (check website for current opportunities)'
  });

  // 2. Scotiabank Women Initiative
  console.log('Adding Scotiabank Women Initiative grant...');
  await addGrant({
    title: 'The Scotiabank Women Initiative',
    description: 'The Scotiabank Women Initiative is a comprehensive program designed to help women-led and women-owned businesses succeed through access to capital, mentorship, and education. The program includes specialized loan programs, advisory services, and networking opportunities.',
    type: 'private',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Ongoing',
    fundingAmount: 'Varies (includes loans and occasional grant opportunities)',
    category: 'Women in Business',
    eligibilityCriteria: [
      'Women-owned or women-led business (51%+ ownership or leadership)',
      'Canadian-based business',
      'Valid business registration',
      'Operating business with growth potential',
      'Sector-specific criteria may apply for certain programs'
    ],
    pros: [
      'Specialized financing solutions for women entrepreneurs',
      'Comprehensive support beyond just funding',
      'Access to networking events and mentorship',
      'Educational resources and workshops',
      'Ongoing program with continuous intake'
    ],
    cons: [
      'Primary focus is on loans rather than grants',
      'May require banking relationship with Scotiabank',
      'Detailed business assessment required',
      'Limited pure grant opportunities',
      'Competitive application process for specialized programs'
    ],
    websiteUrl: 'https://www.scotiabank.com/women-initiative/ca/en.html',
    featured: false,
    industry: 'any',
    province: null,
    competitionLevel: 'Medium',
    organization: 'Scotiabank',
    documents: [
      'Business plan',
      'Financial statements',
      'Cash flow projections',
      'Business registration documents',
      'Personal financial information (for loan applications)'
    ],
    applicationDates: 'Ongoing'
  });

  // 3. Starter Company Plus
  console.log('Adding Starter Company Plus grant...');
  await addGrant({
    title: 'Starter Company Plus',
    description: 'Starter Company Plus provides entrepreneurs with the resources, training, and mentorship needed to start and expand their businesses. The program, delivered through Small Business Enterprise Centres across Ontario, includes business training, advisory services, and grant opportunities.',
    type: 'private',
    imageUrl: 'https://images.unsplash.com/photo-1535957998253-26ae1ef29506?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Varies by location (multiple intake periods throughout the year)',
    fundingAmount: 'Up to $5,000',
    category: 'Business Start-up',
    eligibilityCriteria: [
      '18 years of age or older',
      'Ontario resident and Canadian citizen or permanent resident',
      'Not attending school full-time',
      'Not currently receiving Employment Insurance',
      'Starting a new business or expanding a business less than 5 years old',
      'Not already received a Starter Company or Starter Company Plus grant'
    ],
    pros: [
      'Non-repayable grant funding',
      'Includes business training and workshops',
      'One-on-one mentoring and guidance',
      'Local delivery through SBECs across Ontario',
      'Networking opportunities with other entrepreneurs'
    ],
    cons: [
      'Competitive selection process',
      'Mandatory participation in training sessions',
      'Limited grant amount',
      'Must operate business full-time',
      'Matching contribution often required'
    ],
    websiteUrl: 'https://www.ontario.ca/page/start-company-plus',
    featured: false,
    industry: 'any',
    province: 'Ontario',
    competitionLevel: 'Medium',
    organization: 'Small Business Enterprise Centres (Ontario)',
    documents: [
      'Business plan',
      'Financial projections',
      'Marketing plan',
      'Personal identification',
      'Proof of Ontario residency'
    ],
    applicationDates: 'Varies by location (multiple intake periods throughout the year)'
  });

  // 4. Spin Master Innovation Fund
  console.log('Adding Spin Master Innovation Fund grant...');
  await addGrant({
    title: 'Spin Master Innovation Fund',
    description: 'The Spin Master Innovation Fund, in partnership with Futurpreneur Canada, supports young entrepreneurs with innovative business ideas. The program provides start-up financing, mentorship, and business resources to help launch and grow innovative businesses in Canada.',
    type: 'private',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Annual application window (typically spring)',
    fundingAmount: 'Up to $50,000 in start-up financing',
    category: 'Innovation',
    eligibilityCriteria: [
      'Between 18-39 years of age',
      'Canadian citizen or permanent resident',
      'Business demonstrates innovation and originality',
      'Business will be based in Canada',
      'Willing to work with a mentor for two years',
      'Business is new or has been operating for less than 12 months'
    ],
    pros: [
      'Collateral-free financing',
      'Two years of mentorship from industry experts',
      'Additional business resources and support',
      'Networking opportunities with other innovators',
      'Association with established brands (Spin Master and Futurpreneur)'
    ],
    cons: [
      'Age restriction (18-39 only)',
      'Highly competitive selection process',
      'Financing is a loan, not a grant (must be repaid)',
      'Detailed business plan and financials required',
      'Limited to innovative business concepts'
    ],
    websiteUrl: 'https://www.futurpreneur.ca/en/get-started/financing-and-mentoring/spin-master-innovation-fund/',
    featured: false,
    industry: 'any',
    province: null,
    competitionLevel: 'High',
    organization: 'Spin Master Ltd. and Futurpreneur Canada',
    documents: [
      'Comprehensive business plan',
      'Cash flow projections',
      'Personal financial statement',
      'Government-issued ID',
      'Proof of Canadian citizenship or permanent residency'
    ],
    applicationDates: 'Annual application window (typically spring)'
  });

  // 5. Creative Destruction Lab
  console.log('Adding Creative Destruction Lab program...');
  await addGrant({
    title: 'Creative Destruction Lab (CDL) Programs',
    description: 'Creative Destruction Lab is a seed-stage program for massively scalable, science-based companies. The program connects founders with experienced entrepreneurs, scientists, and investors to help commercialize their innovations and scale their businesses.',
    type: 'private',
    imageUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=500&h=280&q=80',
    deadline: 'Annual application window (typically summer)',
    fundingAmount: 'Investment opportunities (varies) + in-kind support valued at $15,000+',
    category: 'Accelerator',
    eligibilityCriteria: [
      'Innovative, science-based company with global market potential',
      'Pre-seed or seed-stage venture',
      'Strong technical team with deep expertise',
      'Technology or innovation with defensible intellectual property',
      'Commitment to participate fully in the nine-month program'
    ],
    pros: [
      'Access to world-class mentors and investors',
      'No equity taken for program participation',
      'Structured goal-setting process with accountability',
      'Potential investment opportunities',
      'Association with leading universities and business schools'
    ],
    cons: [
      'Extremely competitive selection process',
      'Intensive time commitment required',
      'Focus on rapid scaling (may not suit all business models)',
      'Primarily beneficial for science and deep tech companies',
      'No direct funding guaranteed'
    ],
    websiteUrl: 'https://www.creativedestructionlab.com/',
    featured: false,
    industry: 'Technology',
    province: null,
    competitionLevel: 'Very High',
    organization: 'Creative Destruction Lab',
    documents: [
      'Detailed company profile',
      'Scientific/technical documentation',
      'Team biographies and experience',
      'Market analysis',
      'Intellectual property information'
    ],
    applicationDates: 'Annual application window (typically summer)'
  });

  console.log('All financial and private grants added successfully.');
}

// Run the function to add all grants
addAllGrants();