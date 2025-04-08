// Script to add a Telus grant

import fetch from 'node-fetch';

const telusGrants = [
  {
    title: "TELUS Friendly Future Foundation",
    description: "The TELUS Friendly Future Foundation provides grants to registered Canadian charities that help youth and their communities thrive through access to technology, health, and education programs.",
    fundingAmount: "$20,000",
    eligibility: "Canadian registered charities supporting youth through technology, health, or education programs",
    deadline: "Ongoing",
    applicationUrl: "https://www.friendlyfuture.com/grants",
    sourceUrl: "https://www.telus.com/en/social-impact/giving-back",
    websiteUrl: "https://www.telus.com",
    type: "private",
    industry: "Technology, Health, Education",
    fundingOrganization: "TELUS",
    organization: "TELUS",
    category: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1505739818593-1c3d5b1c1acd?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium",
    featured: true,
    eligibilityCriteria: [
      "Must be a registered Canadian charity",
      "Projects must focus on youth and technology, health, or education",
      "Projects must demonstrate measurable impact in communities"
    ],
    applicationProcess: [
      "Complete online application form",
      "Submit project plan and budget",
      "Provide organizational information"
    ],
    requiredDocuments: [
      "Charity registration number",
      "Project proposal",
      "Budget breakdown",
      "Expected outcomes and impact measurements"
    ],
    fundingType: "Grant",
    fundingDetails: "Single grants typically range from $5,000 to $20,000",
    contactInformation: "foundation@telus.com",
    createdAt: new Date().toISOString(),
    pros: [
      "No matching funds required",
      "Support from TELUS employees and volunteers may be available",
      "Ongoing application process"
    ],
    cons: [
      "Competitive application process",
      "Focus must align with TELUS priority areas",
      "Reporting requirements after grant completion"
    ],
    tips: [
      "Emphasize how technology will be used to create positive change",
      "Include clear metrics for measuring success",
      "Demonstrate community involvement and support"
    ],
    faqQuestions: [
      "How often can organizations apply?",
      "What types of expenses are eligible?",
      "How long does the application review process take?"
    ],
    faqAnswers: [
      "Organizations can apply once per calendar year",
      "Program costs, equipment, and direct delivery expenses are eligible; operational overhead is limited to 15% of grant",
      "The review process typically takes 8-12 weeks from submission deadline"
    ]
  },
  {
    title: "TELUS Tech for Good Program",
    description: "The TELUS Tech for Good Program provides customized technology solutions and support for people with disabilities to help them live more independently and participate in their communities.",
    fundingAmount: "Variable",
    eligibility: "Individuals with disabilities requiring assistive technology solutions",
    deadline: "Ongoing",
    applicationUrl: "https://www.telus.com/en/social-impact/connecting-canada/tech-for-good",
    sourceUrl: "https://www.telus.com/en/social-impact/connecting-canada/tech-for-good",
    websiteUrl: "https://www.telus.com",
    type: "private",
    industry: "Technology, Accessibility, Healthcare",
    fundingOrganization: "TELUS",
    organization: "TELUS",
    category: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1563770557364-bdf728471fca?auto=format&fit=crop&w=500&h=280&q=80",
    competitionLevel: "Medium",
    featured: false,
    eligibilityCriteria: [
      "Individuals with physical or developmental disabilities",
      "Clear need for assistive technology",
      "Residence in a community where TELUS services are available"
    ],
    applicationProcess: [
      "Complete online application with supporting documentation",
      "Assessment by TELUS team and partners",
      "Development of customized technology solution if approved"
    ],
    requiredDocuments: [
      "Medical documentation of disability",
      "Statement of need",
      "Letter of support from healthcare professional"
    ],
    fundingType: "In-kind support and services",
    fundingDetails: "Provides customized technology solutions, training, and ongoing support",
    contactInformation: "techforgood@telus.com",
    createdAt: new Date().toISOString(),
    pros: [
      "Customized solutions based on individual needs",
      "Includes training and ongoing support",
      "No direct cost to approved applicants"
    ],
    cons: [
      "Limited to communities with TELUS services",
      "May have waiting period for assessment",
      "Focused on specific disability-related technology needs"
    ],
    tips: [
      "Clearly articulate how technology will improve independence",
      "Get support letters from healthcare professionals",
      "Be specific about technology needs and challenges"
    ],
    faqQuestions: [
      "Who is eligible for the program?",
      "What types of technology solutions are provided?",
      "Is there ongoing support after implementation?"
    ],
    faqAnswers: [
      "Individuals with physical or developmental disabilities who need assistive technology to increase independence",
      "Solutions range from specialized mobile devices and apps to smart home technology and communication tools",
      "Yes, TELUS provides training and ongoing technical support for all provided solutions"
    ]
  }
];

// Function to add a grant to the database
async function addGrant(grantData) {
  try {
    const response = await fetch('http://localhost:5000/api/admin/grants/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(grantData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add grant: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log(`Successfully added grant: ${result.title}`);
    return result;
  } catch (error) {
    console.error(`Error adding grant:`, error);
    throw error;
  }
}

// Main function to add all Telus grants
async function addAllTelusGrants() {
  try {
    console.log('Starting to add TELUS grants...');
    
    for (const grant of telusGrants) {
      await addGrant(grant);
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('All TELUS grants added successfully!');
  } catch (error) {
    console.error('Error in addAllTelusGrants:', error);
  }
}

// Run the function
addAllTelusGrants().catch(console.error);