import axios from 'axios';

// Define the grant data
const grantsData = [
  // Federal Grants
  {
    title: "Canada Small Business Financing Program (CSBFP)",
    description: "A program that makes it easier for small businesses to get loans from financial institutions by sharing the risk with lenders.",
    type: "federal",
    industry: "Business",
    fundingAmount: "$1,000,000",
    deadline: "Ongoing",
    featured: true,
    category: "Financing",
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium",
    eligibilityCriteria: ["Small businesses with gross annual revenue under $10 million", "Canadian businesses operating for profit"],
    pros: ["Up to $1,000,000 in funding", "Lower interest rates than typical loans", "Longer repayment terms"],
    cons: ["2% registration fee", "Higher interest rate than conventional loans"],
    fundingOrganization: "Innovation, Science and Economic Development Canada",
    department: "Innovation, Science and Economic Development Canada",
    websiteUrl: "https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/eng/home",
    applicationLink: "https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/eng/h_la00007.html",
    applicationProcess: "Apply through a financial institution (banks, credit unions)",
    documents: ["Business plan", "Financial statements", "Cash flow projections"],
    whoCanApply: "Small businesses in Canada with gross annual revenues of $10 million or less"
  },
  {
    title: "Business Development Bank of Canada (BDC) Programs",
    description: "Various financing and advisory solutions for entrepreneurs at every stage of their business.",
    type: "federal",
    industry: "Business",
    fundingAmount: "Up to $5,000,000",
    deadline: "Ongoing",
    featured: true,
    category: "Financing",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium",
    eligibilityCriteria: ["Canadian businesses", "Viable business model"],
    pros: ["Flexible financing options", "Advisory services", "Longer repayment terms"],
    cons: ["Strict qualification criteria", "May require collateral"],
    fundingOrganization: "Business Development Bank of Canada",
    department: "Business Development Bank of Canada",
    websiteUrl: "https://www.bdc.ca/",
    applicationLink: "https://www.bdc.ca/en/financing",
    applicationProcess: "Complete an online application or contact a BDC representative",
    documents: ["Business plan", "Financial statements", "Tax returns"],
    whoCanApply: "Canadian businesses with growth potential"
  },
  // Include more grants as needed...
];

async function addGrants() {
  try {
    console.log(`Starting to add ${grantsData.length} grants via API...`);
    
    for (const grant of grantsData) {
      try {
        // Add the grant via the API
        const response = await axios.post('http://localhost:5000/api/admin/grants/add', grant);
        console.log(`Added: ${grant.title}`);
      } catch (error) {
        console.error(`Error adding ${grant.title}:`, error.message);
      }
    }
    
    console.log('Finished adding grants.');
    
  } catch (error) {
    console.error('Error in process:', error);
  }
}

// Run the function
addGrants();