// Script to add provincial grants for Ontario and British Columbia
import axios from 'axios';

// Define the grants data for Ontario Small Business Enterprise Centres
const ontarioSbecGrant = {
  title: "Ontario Small Business Enterprise Centres (SBECs)",
  description: "Small Business Enterprise Centres offer entrepreneurs all the tools they need to start and grow their businesses, including one-on-one business consultations, business plan guidance, seminars, workshops, and mentorship opportunities.",
  type: "provincial",
  industry: "any",
  category: "Business Support",
  province: "Ontario",
  imageUrl: "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&w=500&h=280&q=80",
  deadline: "Ongoing (specific programs may have deadlines)",
  fundingAmount: "Varies by program ($2,000 - $5,000 for Starter Company Plus)",
  createdAt: new Date().toISOString(),
  featured: false,
  department: "Ontario Ministry of Economic Development, Job Creation and Trade",
  applicationUrl: "https://www.ontario.ca/page/small-business-enterprise-centre-locations",
  websiteUrl: "https://www.ontario.ca/page/small-business-enterprise-centres",
  pros: [
    "Local support tailored to community needs",
    "Free consultations available",
    "Access to a variety of resources and workshops",
    "Some programs offer grants (like Starter Company Plus)",
    "Networking opportunities with local business community"
  ],
  cons: [
    "Limited grant amounts compared to federal programs",
    "Resource availability varies by location",
    "Programs with funding often have competitive application processes",
    "May require in-person participation for some programs"
  ],
  competitionLevel: "Medium",
  eligibilityCriteria: [
    "Ontario-based business",
    "Specific eligibility varies by program",
    "For Starter Company Plus: 18+ years old, not returning to school",
    "For Summer Company: students 15-29 returning to school",
    "Must be willing to participate in training/mentorship components"
  ],
  documents: [
    "Business plan",
    "Financial projections",
    "Proof of Ontario residency",
    "Program-specific application forms",
    "Marketing plan"
  ],
  faqQuestions: [
    "What services do Small Business Enterprise Centres provide?",
    "How can I find the nearest SBEC?",
    "What is the Starter Company Plus program?",
    "Is there funding available for student entrepreneurs?",
    "Do I have to pay for SBEC services?"
  ],
  faqAnswers: [
    "SBECs provide one-on-one business consultations, guidance on business plans and strategy, seminars/workshops on business topics, information on financing options, market research assistance, mentorship opportunities, and access to specialized programs like Starter Company Plus.",
    "Ontario has over 50 Small Business Enterprise Centres across the province. You can find your nearest location by visiting the Ontario government website and searching by city or postal code.",
    "Starter Company Plus provides entrepreneurs (18+) with training, mentoring, and potential grant funding (up to $5,000) to start, expand, or buy a small business. It requires participation in training sessions and development of a business plan.",
    "Yes, the Summer Company program provides students (15-29) who are returning to school with up to $3,000 in funding, along with mentorship and training, to start and run a summer business.",
    "Many core SBEC services are offered at no cost, including initial consultations and information resources. Some specialized workshops or programs may have nominal fees. Grant programs like Starter Company Plus are free to apply for but have competitive selection processes."
  ]
};

// Define the grants data for BC Launch Online Grant
const bcLaunchOnlineGrant = {
  title: "BC Launch Online Grant",
  description: "The Launch Online Grant program provides funding to British Columbia-based businesses to create or improve their e-commerce capabilities and grow their online presence, helping them adapt to changes in consumer behavior during and beyond the COVID-19 pandemic.",
  type: "provincial",
  industry: "Retail",
  category: "Digital Transformation",
  province: "British Columbia",
  imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500&h=280&q=80",
  deadline: "Ongoing until program funds are allocated",
  fundingAmount: "Up to $7,500 (covers up to 75% of eligible expenses)",
  createdAt: new Date().toISOString(),
  featured: false,
  department: "Government of British Columbia",
  applicationUrl: "https://launchonline.ca/",
  websiteUrl: "https://launchonline.ca/",
  pros: [
    "Covers up to 75% of eligible e-commerce project costs",
    "Includes funding for digital marketing",
    "Targeted specifically for online sales development",
    "Supports both new e-commerce implementation and enhancements",
    "Special funding allocation for Indigenous, rural, and businesses owned by persons with disabilities"
  ],
  cons: [
    "Business must contribute 25% of project costs",
    "Must have an existing business website",
    "Requires detailed project plan",
    "Limited to BC-based businesses",
    "Reimbursement model (must pay expenses first)"
  ],
  competitionLevel: "Medium",
  eligibilityCriteria: [
    "BC-based business",
    "Annual sales of less than $10 million (including at least $30,000 annual revenue before the pandemic)",
    "GST registered",
    "Majority-owned by BC residents",
    "Home-based or physically located and operating in BC",
    "Maintains a minimum of one non-owner employee",
    "Has an existing website that can be enhanced for online sales"
  ],
  documents: [
    "Project plan for e-commerce implementation",
    "Business financial information",
    "Cost quotes from service providers",
    "Current website URL",
    "Business registration documents",
    "GST registration details"
  ],
  faqQuestions: [
    "What expenses are eligible for the Launch Online Grant?",
    "How does the application process work?",
    "Can I hire any service provider to help with my e-commerce project?",
    "When will I receive funding?",
    "What types of businesses are not eligible?"
  ],
  faqAnswers: [
    "Eligible expenses include e-commerce platform development, website improvements to enable online sales, digital customer acquisition costs (SEO, SEM, social media), training staff on e-commerce platforms, and photography of products for online sales.",
    "Apply through the Launch Online BC website with your business details and e-commerce project plan. Applications are reviewed on a first-come, first-served basis until all funds are allocated. Approved applicants must submit a final report with receipts after project completion.",
    "Yes, you can choose any qualified service provider to help with your e-commerce project. The program requires that service providers be based in BC when possible, but exceptions are made when necessary technical expertise is not available within the province.",
    "The program operates on a reimbursement model. Once your project is completed and you've submitted a final report with all required documentation and receipts, funding will be processed within approximately 3-4 weeks.",
    "Franchises, corporate chains, liquor stores, businesses that sell exclusively age-restricted products, and businesses without existing websites are not eligible. Additionally, businesses primarily engaged in real estate marketing, direct selling, home-based direct selling, and businesses that have already received funding from the program are not eligible."
  ]
};

// Define the grants data for Innovate BC Programs
const innovateBcGrant = {
  title: "Innovate BC Programs and Funding",
  description: "Innovate BC offers a range of programs, funding opportunities, and competitions to help BC technology companies start and scale their businesses, connect with experts, develop their products and markets, and access capital.",
  type: "provincial",
  industry: "Technology",
  category: "Innovation",
  province: "British Columbia",
  imageUrl: "https://images.unsplash.com/photo-1456428746267-a1756408f782?auto=format&fit=crop&w=500&h=280&q=80",
  deadline: "Varies by program (multiple programs with different deadlines)",
  fundingAmount: "$15,000 to $300,000+ (depending on program)",
  createdAt: new Date().toISOString(),
  featured: true,
  department: "Innovate BC",
  applicationUrl: "https://www.innovatebc.ca/programs/",
  websiteUrl: "https://www.innovatebc.ca/",
  pros: [
    "Multiple funding streams for different business stages",
    "Connections to industry experts and mentors",
    "Access to business development resources",
    "Programs for both early-stage and growth-stage companies",
    "Some programs offer non-dilutive funding"
  ],
  cons: [
    "Competitive application processes",
    "Sector-specific focus on technology and innovation",
    "Some programs require matching funds",
    "Specific eligibility criteria per program",
    "Application preparation can be time-intensive"
  ],
  competitionLevel: "High",
  eligibilityCriteria: [
    "BC-based technology companies",
    "Specific criteria vary by program",
    "Innovation focus required",
    "Must demonstrate commercial potential",
    "Some programs require minimum revenue or team size"
  ],
  documents: [
    "Business plan",
    "Financial statements",
    "Project proposal or research plan",
    "Team information (background, expertise)",
    "Market analysis",
    "IP strategy (for some programs)"
  ],
  faqQuestions: [
    "What types of programs does Innovate BC offer?",
    "How does the BC Fast Pilot program work?",
    "What is the Innovator Skills Initiative (ISI) grant?",
    "Do I need to be a technology company to apply?",
    "Can early-stage startups access Innovate BC funding?"
  ],
  faqAnswers: [
    "Innovate BC offers several programs including the Ignite program (R&D funding up to $300,000), BC Fast Pilot (for cleantech solutions), Innovator Skills Initiative (hiring grants), BC Tech Co-op Grants, Growth Programs, New Ventures BC Competition, and various accelerator programs.",
    "The BC Fast Pilot program provides funding for B.C.-based cleantech companies to design, build and operate a pilot project using their technology in real-world conditions. The program offers up to $200,000, representing up to 50% of the eligible project costs.",
    "The Innovator Skills Initiative (ISI) provides grants to employers to hire post-secondary students or recent graduates. The program offers $10,000 per hire (with the employer contributing an additional $10,000) to create technology-related jobs.",
    "Most Innovate BC programs are focused on technology and innovation-based businesses. However, the definition of 'technology' is broad and can include innovative solutions in traditional industries. Some programs may be open to non-tech businesses applying technology solutions.",
    "Yes, several programs cater to early-stage companies, such as the New Ventures BC Competition for startups and various accelerator programs. The specific funding available depends on your company's stage, with different programs designed for concept, startup, and growth phases."
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
    console.log('Adding Ontario SBEC grant...');
    await addGrant(ontarioSbecGrant);
    
    console.log('Adding BC Launch Online grant...');
    await addGrant(bcLaunchOnlineGrant);
    
    console.log('Adding Innovate BC grant...');
    await addGrant(innovateBcGrant);
    
    console.log('All grants added successfully!');
  } catch (error) {
    console.error('Failed to add all grants:', error);
  }
}

// Execute the main function
addAllGrants();