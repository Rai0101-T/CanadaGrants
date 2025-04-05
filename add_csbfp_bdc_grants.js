// Script to add Canada Small Business Financing Program and BDC Programs
import axios from 'axios';

// Define the grants data for Canada Small Business Financing Program
const csbfpGrant = {
  title: "Canada Small Business Financing Program (CSBFP)",
  description: "The Canada Small Business Financing Program makes it easier for small businesses to get loans from financial institutions by sharing the risk with lenders. The program aims to help small businesses start, expand, modernize, or improve their operations.",
  type: "federal",
  industry: "any",
  category: "Loans",
  imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&h=280&q=80",
  deadline: "Ongoing",
  fundingAmount: "Up to $1,000,000",
  createdAt: new Date().toISOString(),
  featured: true,
  department: "Innovation, Science and Economic Development Canada",
  applicationUrl: "https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/eng/home",
  websiteUrl: "https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/eng/home",
  pros: [
    "Accessible to various types of small businesses",
    "Up to $1,000,000 in financing available",
    "Available from financial institutions across Canada",
    "Government shares risk with lenders to increase access to financing"
  ],
  cons: [
    "Only available for specific asset purchases (equipment, leasehold improvements, property)",
    "Not available for businesses with gross annual revenues over $10 million",
    "Service fees and interest rates apply",
    "Some business types are ineligible"
  ],
  competitionLevel: "Medium",
  eligibilityCriteria: [
    "Small businesses operating for profit in Canada",
    "Annual gross revenue of $10 million or less",
    "Loan must be used to finance specific eligible expenses",
    "Certain business types are excluded (agricultural, religious, charitable, etc.)"
  ],
  documents: [
    "Business plan",
    "Financial statements",
    "Proof of Canadian citizenship or permanent residency",
    "Business registration documents",
    "Cost estimates or quotes for assets to be purchased"
  ],
  faqQuestions: [
    "What can the loan be used for?",
    "How do I apply for a CSBFP loan?",
    "What is the maximum loan amount available?",
    "What interest rates can I expect?",
    "Are there any additional fees?"
  ],
  faqAnswers: [
    "The loan can be used for purchasing or improving equipment, leasehold improvements, and purchasing commercial property.",
    "You apply directly with a financial institution (banks and credit unions) that participates in the program.",
    "The maximum loan amount is $1,000,000, of which a maximum of $500,000 can be used for equipment and leasehold improvements.",
    "Interest rates are determined by your financial institution and can be either fixed or variable with a maximum rate set by the program.",
    "There is a 2% registration fee on the loan amount which can be financed as part of the loan. The government also charges a 1.25% administration fee annually on the outstanding loan balance."
  ]
};

// Define the grants data for Business Development Bank of Canada (BDC) Programs
const bdcGrant = {
  title: "Business Development Bank of Canada (BDC) Financing Programs",
  description: "BDC offers a range of financing solutions designed specifically for Canadian entrepreneurs. These include business loans, working capital, technology financing, and more to help businesses grow and succeed.",
  type: "federal",
  industry: "any",
  category: "Loans",
  imageUrl: "https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?auto=format&fit=crop&w=500&h=280&q=80",
  deadline: "Ongoing",
  fundingAmount: "$10,000 to $10,000,000+",
  createdAt: new Date().toISOString(),
  featured: true,
  department: "Business Development Bank of Canada",
  applicationUrl: "https://www.bdc.ca/en/financing",
  websiteUrl: "https://www.bdc.ca",
  pros: [
    "Flexible repayment terms",
    "Dedicated to serving entrepreneurs",
    "Offers complementary advisory services",
    "Provides loans when other financial institutions cannot"
  ],
  cons: [
    "Interest rates may be higher than traditional banks",
    "Approval process may take longer for complex applications",
    "Requires solid business case and often collateral",
    "Some programs have strict eligibility requirements"
  ],
  competitionLevel: "Medium",
  eligibilityCriteria: [
    "Canadian-based business",
    "Viable business plan",
    "Potential for growth or sustainability",
    "Good credit history or explanation for credit issues",
    "Various requirements depending on specific BDC program"
  ],
  documents: [
    "Business plan",
    "Financial statements (2-3 years if available)",
    "Cash flow projections",
    "Personal financial information",
    "Business registration information"
  ],
  faqQuestions: [
    "What types of financing does BDC offer?",
    "How long does the approval process take?",
    "Do I need to provide collateral?",
    "What are the interest rates?",
    "Is there a minimum business operating history required?"
  ],
  faqAnswers: [
    "BDC offers business loans, working capital, technology financing, change of ownership financing, purchasing equipment, commercial real estate financing, and various specialized financing options.",
    "The time varies depending on the complexity of the request, but initial approval can often be received within a few business days for straightforward applications.",
    "Collateral requirements vary depending on the type of financing, amount requested, business history, and other factors. BDC's approach to collateral is often more flexible than traditional banks.",
    "BDC offers both fixed and floating rate options. Rates are determined based on risk assessment, the purpose of the loan, and current market conditions.",
    "BDC works with businesses at all stages, from start-ups to established businesses, though requirements and terms may differ based on business maturity."
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
    console.log('Adding CSBFP grant...');
    await addGrant(csbfpGrant);
    
    console.log('Adding BDC grant...');
    await addGrant(bdcGrant);
    
    console.log('All grants added successfully!');
  } catch (error) {
    console.error('Failed to add all grants:', error);
  }
}

// Execute the main function
addAllGrants();