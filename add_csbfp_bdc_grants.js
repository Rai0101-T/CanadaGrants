// Script to add CSBFP and BDC grants to the database

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
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`✓ Added grant: ${result.title} (ID: ${result.id})`);
    return result;
  } catch (error) {
    console.error(`Error adding grant:`, error);
    throw error;
  }
}

async function addAllGrants() {
  try {
    // Canada Small Business Financing Program (CSBFP)
    const csbfpGrant = {
      title: "Canada Small Business Financing Program (CSBFP)",
      description: "The Canada Small Business Financing Program makes it easier for small businesses to get loans from financial institutions by sharing the risk with lenders. The program helps businesses with operating costs, equipment purchases, and property improvements.",
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&h=280&q=80", // Small business image
      deadline: "Ongoing (applications accepted year-round)",
      fundingAmount: "Up to $1,000,000",
      category: "Financing",
      eligibilityCriteria: [
        "Small businesses or start-ups operating in Canada",
        "Annual revenues under $10 million",
        "Funds cannot be used for certain restricted purposes (inventory, working capital, etc.)",
        "Must apply through participating financial institutions",
        "Eligible business expenses include purchase/improvement of real property, equipment, and leasehold improvements"
      ],
      pros: [
        "Higher chance of approval compared to traditional loans",
        "Lower interest rates than many alternative financing options",
        "Available through most major financial institutions",
        "Up to $1 million in funding",
        "Longer repayment terms available"
      ],
      cons: [
        "Application and approval process can take time",
        "Registration fee of 2% of the loan amount",
        "Cannot be used for inventory or working capital",
        "Requires good credit history",
        "Some restrictions on business types"
      ],
      websiteUrl: "https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/eng/home",
      featured: true,
      industry: "All Industries",
      province: "All Provinces",
      competitionLevel: "Medium",
      fundingOrganization: "Innovation, Science and Economic Development Canada",
      applicationProcess: "1. Contact a participating financial institution\n2. Apply for a loan under the CSBFP\n3. The financial institution makes the decision\n4. If approved, the lender registers the loan with the CSBFP",
      documents: [
        "Business plan",
        "Financial statements or projections",
        "Proof of Canadian citizenship or permanent residency",
        "Business registration documents",
        "Quotes for equipment or improvement costs"
      ],
      contactEmail: "csbfp-pfpec@ised-isde.gc.ca",
      department: "Innovation, Science and Economic Development Canada",
      applicationDates: "Ongoing (applications accepted year-round)",
      applicationLink: "https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/eng/h_la00007.html",
      howToApply: "Apply through any chartered bank, credit union, or Caisse Populaire that is a registered CSBFP lender."
    };
    
    // Business Development Bank of Canada (BDC) Programs
    const bdcGrant = {
      title: "Business Development Bank of Canada (BDC) Financing",
      description: "BDC offers a variety of financing solutions for Canadian businesses, including startup financing, equipment purchase, working capital, growth capital, and business transition. As Canada's business development bank, BDC helps create and develop Canadian businesses through financing, advisory services and capital.",
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&h=280&q=80", // Business development image
      deadline: "Ongoing (applications accepted year-round)",
      fundingAmount: "$10,000 to $100,000,000+",
      category: "Financing",
      eligibilityCriteria: [
        "Business must operate in Canada",
        "Have a viable business model",
        "Demonstrate potential for growth",
        "Sufficient cash flow to support loan repayment",
        "Industry eligibility may vary by program"
      ],
      pros: [
        "Flexible repayment terms",
        "Competitive interest rates",
        "Patient capital approach",
        "Complementary advisory services available",
        "Specialized financing for technology and innovation"
      ],
      cons: [
        "Thorough application process",
        "May require personal guarantees",
        "More selective for early-stage businesses",
        "Higher requirements for larger loan amounts",
        "Some programs have industry restrictions"
      ],
      websiteUrl: "https://www.bdc.ca/en/financing",
      featured: true,
      industry: "All Industries",
      province: "All Provinces",
      competitionLevel: "Medium",
      fundingOrganization: "Business Development Bank of Canada",
      applicationProcess: "1. Contact BDC or apply online\n2. Meet with a BDC representative\n3. Submit required documentation\n4. Loan evaluation and approval process\n5. Funding disbursement upon approval",
      documents: [
        "Business plan",
        "Financial statements (2-3 years if available)",
        "Financial projections",
        "Personal and corporate tax returns",
        "Personal net worth statement for business owners"
      ],
      contactEmail: "info@bdc.ca",
      department: "Business Development Bank of Canada",
      applicationDates: "Ongoing (applications accepted year-round)",
      applicationLink: "https://www.bdc.ca/en/financing/business-loans/pages/small-business-loan.aspx",
      howToApply: "Apply online through BDC's website or contact a BDC representative to schedule a meeting."
    };
    
    // National Research Council of Canada Industrial Research Assistance Program (NRC IRAP)
    const nrcIrapGrant = {
      title: "NRC Industrial Research Assistance Program (IRAP)",
      description: "NRC IRAP provides financial support, advisory services, and connections to help small and medium-sized businesses increase their innovation capacity and commercialize new products, processes, and services.",
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&h=280&q=80", // Research and innovation image
      deadline: "Ongoing (subject to funding availability)",
      fundingAmount: "$50,000 to $10,000,000+",
      category: "Research & Development",
      eligibilityCriteria: [
        "Canadian small or medium-sized business (500 or fewer full-time employees)",
        "Growth-oriented with potential to grow and generate profits",
        "Have the financial resources to undertake a research project",
        "Clear R&D objectives and innovation capacity",
        "Project must involve technical uncertainty or challenges"
      ],
      pros: [
        "Non-repayable contributions (grants)",
        "Expert technical and business advice",
        "Extensive network of industry connections",
        "Support throughout the innovation lifecycle",
        "Customized assistance based on business needs"
      ],
      cons: [
        "Competitive application process",
        "Requires matching funds from the business",
        "Detailed reporting requirements",
        "Project scope must have technological advancement",
        "Not applicable for basic research"
      ],
      websiteUrl: "https://nrc.canada.ca/en/support-technology-innovation",
      featured: true,
      industry: "Technology",
      province: "All Provinces",
      competitionLevel: "High",
      fundingOrganization: "National Research Council Canada",
      applicationProcess: "1. Contact an Industrial Technology Advisor (ITA)\n2. Meet with the ITA to discuss your project\n3. Submit a project proposal\n4. If eligible, develop a detailed project plan\n5. Sign contribution agreement if approved",
      documents: [
        "Business plan",
        "Project proposal with technical details",
        "Financial statements and projections",
        "Project costing and budget",
        "Information on technical team qualifications"
      ],
      contactEmail: "info@nrc-cnrc.gc.ca",
      department: "National Research Council Canada",
      applicationDates: "Ongoing (subject to funding availability)",
      applicationLink: "https://nrc.canada.ca/en/support-technology-innovation/contact-advisor",
      howToApply: "Contact an Industrial Technology Advisor (ITA) through the NRC website to begin the application process."
    };
    
    // CanExport Program
    const canExportGrant = {
      title: "CanExport Program",
      description: "CanExport provides direct financial assistance to Canadian small and medium-sized businesses to help them develop new export opportunities and markets, particularly in high-growth emerging markets.",
      type: "federal",
      imageUrl: "https://images.unsplash.com/photo-1599751449029-c87714f5cd13?auto=format&fit=crop&w=500&h=280&q=80", // Export/global business image
      deadline: "Ongoing (applications accepted year-round)",
      fundingAmount: "$5,000 to $75,000",
      category: "Export Development",
      eligibilityCriteria: [
        "Canadian business registered in Canada",
        "Annual revenue between $100,000 and $100 million",
        "Limited or no export sales to the target market (less than $100,000 or 10% of total sales)",
        "Have the capacity to increase exports",
        "Project must target markets where you have limited or no previous export sales"
      ],
      pros: [
        "Covers up to 75% of eligible expenses",
        "Non-repayable contribution",
        "Applicable for various export activities",
        "Support for emerging markets",
        "Quick application review process"
      ],
      cons: [
        "Requires minimum 25% matching funds",
        "Limited to specific export activities",
        "Cannot be used for existing markets",
        "Travel restrictions and limitations",
        "Detailed reporting requirements"
      ],
      websiteUrl: "https://www.tradecommissioner.gc.ca/funding-financement/canexport/index.aspx",
      featured: false,
      industry: "All Industries",
      province: "All Provinces",
      competitionLevel: "Medium",
      fundingOrganization: "Global Affairs Canada",
      applicationProcess: "1. Register online\n2. Submit application with project details\n3. Application review and assessment\n4. Sign contribution agreement if approved\n5. Complete activities and submit claim for reimbursement",
      documents: [
        "Business incorporation documents",
        "Financial statements",
        "Export marketing plan",
        "Project activity details and budget",
        "Quotes for proposed activities"
      ],
      contactEmail: "canexport@international.gc.ca",
      department: "Global Affairs Canada / Trade Commissioner Service",
      applicationDates: "Ongoing (applications accepted year-round)",
      applicationLink: "https://www.tradecommissioner.gc.ca/funding-financement/canexport/sme-pme/index.aspx",
      howToApply: "Apply online through the CanExport website. Applications are accepted on a continuous basis."
    };
    
    await addGrant(csbfpGrant);
    await addGrant(bdcGrant);
    await addGrant(nrcIrapGrant);
    await addGrant(canExportGrant);
    
    console.log('All grants added successfully!');
    
  } catch (error) {
    console.error('Error in addAllGrants:', error);
  }
}

// Run the function
addAllGrants().catch(console.error);