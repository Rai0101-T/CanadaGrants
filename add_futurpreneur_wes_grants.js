// Script to add Futurpreneur Canada and Women Entrepreneurship Strategy grants
import axios from 'axios';

// Define the grants data for Futurpreneur Canada
const futurpreneurGrant = {
  title: "Futurpreneur Canada Startup Program",
  description: "Futurpreneur Canada provides financing, mentoring and support tools to aspiring business owners aged 18-39. The program offers collateral-free loans along with up to two years of mentorship to help young entrepreneurs launch and sustain successful businesses.",
  type: "federal",
  industry: "any",
  category: "Business Start-up",
  imageUrl: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=500&h=280&q=80",
  deadline: "Ongoing",
  fundingAmount: "Up to $60,000 in startup financing",
  createdAt: new Date().toISOString(),
  featured: true,
  department: "Futurpreneur Canada",
  applicationUrl: "https://www.futurpreneur.ca/en/get-started/",
  websiteUrl: "https://www.futurpreneur.ca/",
  pros: [
    "Collateral-free loans",
    "Includes mentorship for up to two years",
    "Additional resources and business support available",
    "Higher loan amounts available through BDC partnership",
    "Pre-launch coaching available"
  ],
  cons: [
    "Age restrictions (18-39 only)",
    "Business must be majority-owned and controlled by Canadian citizens or permanent residents in eligible age range",
    "Cannot be used for debt repayment or buying an existing business",
    "Must be a new business or in operation for less than 12 months"
  ],
  competitionLevel: "Medium",
  eligibilityCriteria: [
    "Between 18-39 years of age",
    "Canadian citizen or permanent resident",
    "Have a viable business plan",
    "Business will be operating in Canada",
    "Business is new or has been operating for less than 12 months",
    "Will be involved in day-to-day operations",
    "Cannot be for an existing franchise (some exceptions apply)"
  ],
  documents: [
    "Business plan",
    "Cash flow projection",
    "Personal financial statement",
    "Government-issued ID",
    "Proof of Canadian citizenship or permanent residency",
    "Resume or CV"
  ],
  faqQuestions: [
    "What types of loans does Futurpreneur offer?",
    "Do I need collateral for the loan?",
    "How long is the application process?",
    "What is the interest rate on the loan?",
    "How does the mentorship program work?"
  ],
  faqAnswers: [
    "Futurpreneur offers up to $20,000 as a core startup loan. Eligible entrepreneurs can also apply for an additional $40,000 through Futurpreneur's partnership with BDC (Business Development Bank of Canada).",
    "No, the loans provided by Futurpreneur are collateral-free. However, all applicants must have a qualified co-signer who could cover the loan payments if necessary.",
    "The application process typically takes 4-6 weeks from submission of a complete application to funding decision. Additional time may be required if there are questions about your business plan or if additional documentation is needed.",
    "The interest rate is Prime + 3.75% and is fixed for the term of the loan. The loan term is typically 5 years with monthly repayments.",
    "Each entrepreneur is matched with a mentor based on their industry, experience, and needs. The mentor relationship continues for up to two years, with regular meetings (in-person or virtual) to provide guidance, feedback, and support."
  ]
};

// Define the grants data for Women Entrepreneurship Strategy (WES)
const wesGrant = {
  title: "Women Entrepreneurship Strategy (WES) Ecosystem Fund",
  description: "The Women Entrepreneurship Strategy (WES) is a comprehensive initiative to help women entrepreneurs grow their businesses through access to financing, talent, networks and expertise. The WES Ecosystem Fund supports organizations delivering support for women entrepreneurs.",
  type: "federal",
  industry: "any",
  category: "Women in Business",
  imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=500&h=280&q=80",
  deadline: "Varies by specific program opportunity",
  fundingAmount: "Varies by program (from $25,000 to $5,000,000+)",
  createdAt: new Date().toISOString(),
  featured: true,
  department: "Innovation, Science and Economic Development Canada",
  applicationUrl: "https://ised-isde.canada.ca/site/women-entrepreneurship-strategy/en",
  websiteUrl: "https://ised-isde.canada.ca/site/women-entrepreneurship-strategy/en",
  pros: [
    "Targeted support for women entrepreneurs",
    "Multiple funding streams and programs available",
    "Can include both direct financial support and capacity building",
    "Access to networks, mentors and expertise",
    "National and regional delivery options"
  ],
  cons: [
    "Competitive application process",
    "Some programs have limited funding windows",
    "Application requirements can be complex",
    "May require reporting on economic outcomes"
  ],
  competitionLevel: "High",
  eligibilityCriteria: [
    "Women-owned or women-led business (51%+ ownership or leadership)",
    "Canadian-based business",
    "For-profit business in eligible sectors",
    "Specific eligibility varies by program stream",
    "May include requirements related to business size, revenue, or stage"
  ],
  documents: [
    "Business plan or growth strategy",
    "Financial statements",
    "Proof of women ownership/leadership",
    "Project proposal (for specific funding)",
    "Budget and implementation timeline"
  ],
  faqQuestions: [
    "What programs are available under the Women Entrepreneurship Strategy?",
    "How is 'women-owned' or 'women-led' defined for eligibility?",
    "Can non-profit organizations apply for WES funding?",
    "Are there regional variations in available programs?",
    "What resources does WES provide beyond funding?"
  ],
  faqAnswers: [
    "WES includes several programs: the WES Ecosystem Fund supporting organizations that help women entrepreneurs; the Women Entrepreneurship Loan Fund providing up to $100,000 in financing; and direct support through regional development agencies and other partners.",
    "Generally, a business is considered women-owned or women-led if at least 51% of ownership shares are held by women, or if the CEO/President is a woman and at least 51% of the senior management team are women.",
    "Yes, non-profit organizations can apply for WES Ecosystem Fund grants if they deliver programs supporting women entrepreneurs. However, the direct funding programs are generally aimed at for-profit businesses.",
    "Yes, some WES programs are delivered through regional development agencies and may have specific regional priorities or variations. Check with your local regional development agency for specific opportunities in your area.",
    "Beyond funding, WES provides access to mentorship, business networks, export opportunities, skills training, and connections to innovation hubs and accelerators. The WES Knowledge Hub also provides resources, research, and information to support women entrepreneurs."
  ]
};

// Function to send grant data to API
async function addGrant(grantData) {
  try {
    const response = await axios.post('http://localhost:5000/api/admin/grants/add', grantData);
    console.log(`Successfully added grant: ${grantData.title}`);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error adding grant ${grantData.title}:`, error.response ? error.response.data : error.message);
    throw error;
  }
}

// Main function to add all grants
async function addAllGrants() {
  try {
    console.log('Adding Futurpreneur grant...');
    await addGrant(futurpreneurGrant);
    
    console.log('Adding Women Entrepreneurship Strategy grant...');
    await addGrant(wesGrant);
    
    console.log('All grants added successfully!');
  } catch (error) {
    console.error('Failed to add all grants:', error);
  }
}

// Execute the main function
addAllGrants();