// Alberta Health & Medical Grants data
// Based on information from https://alberta-canada.thegrantportal.com/health-and-medical

export const albertaHealthGrants = [
  {
    title: "Health Innovation and Technology Accelerator",
    description: "Supports innovative health technology startups to commercialize their solutions for the healthcare system, with a focus on digital health, medical devices, and AI applications in healthcare.",
    type: "provincial",
    imageUrl: "https://images.unsplash.com/photo-1576671495200-8a6b700a67a0?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Oct 31, 2025",
    fundingAmount: "$50K-150K",
    category: "Health Innovation",
    eligibilityCriteria: [
      "Alberta-based health technology startups",
      "Minimum viable product developed",
      "Technology addressing healthcare challenges",
      "Potential for integration into Alberta Health Services",
      "Business plan for commercialization"
    ],
    pros: [
      "Access to clinical validation opportunities",
      "Mentorship from healthcare experts",
      "Accelerated regulatory pathway guidance",
      "Connections to potential healthcare clients",
      "Support for pilot implementations"
    ],
    cons: [
      "Requires 25% matching funds",
      "Competitive selection process",
      "Detailed reporting requirements",
      "Clinical testing protocols required",
      "Limited to 18-month project timeline"
    ],
    websiteUrl: "https://alberta-canada.thegrantportal.com/grant/health-innovation-and-technology-accelerator",
    featured: false,
    province: "Alberta",
    industry: "Healthcare & Life Sciences",
    fundingOrganization: "Alberta Health Services Innovation",
    createdAt: new Date().toISOString()
  },
  {
    title: "Medical Research Fund Alberta",
    description: "Provides funding for innovative medical research projects with potential for commercial applications and improving patient outcomes in Alberta's healthcare system.",
    type: "provincial",
    imageUrl: "https://images.unsplash.com/photo-1579165466741-7f35e4755169?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "May 15, 2025",
    fundingAmount: "$100K-500K",
    category: "Medical Research",
    eligibilityCriteria: [
      "Alberta-based researchers",
      "Affiliation with recognized research institution",
      "Project addresses healthcare priorities",
      "Clear path to clinical application",
      "Multi-disciplinary research team"
    ],
    pros: [
      "Significant funding amounts available",
      "Support for translational research",
      "Access to Alberta research network",
      "Potential for follow-on funding",
      "Recognition in scientific community"
    ],
    cons: [
      "Rigorous scientific evaluation",
      "Ethics approval requirements",
      "Institution overhead fees may apply",
      "Complex application process",
      "Competitive selection with limited spots"
    ],
    websiteUrl: "https://alberta-canada.thegrantportal.com/grant/medical-research-fund-alberta",
    featured: true,
    province: "Alberta",
    industry: "Healthcare & Life Sciences",
    fundingOrganization: "Alberta Innovates",
    createdAt: new Date().toISOString()
  },
  {
    title: "Rural Healthcare Innovation Grant",
    description: "Supports projects that improve healthcare access, quality, and efficiency in rural and remote communities across Alberta through innovative solutions and approaches.",
    type: "provincial",
    imageUrl: "https://images.unsplash.com/photo-1631557776012-678acb939a1a?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Aug 30, 2025",
    fundingAmount: "$25K-100K",
    category: "Rural Healthcare",
    eligibilityCriteria: [
      "Projects serving rural Alberta communities",
      "Partnership with local healthcare providers",
      "Demonstrated community need",
      "Sustainable implementation plan",
      "Potential for scalability to other communities"
    ],
    pros: [
      "Focus on underserved communities",
      "Flexible project structure",
      "Community engagement support",
      "Recognition for rural innovation",
      "Potential for provincial expansion"
    ],
    cons: [
      "Remote implementation challenges",
      "Required community partnership documentation",
      "Limited technology infrastructure in some areas",
      "Geographic constraints",
      "Long-term sustainability requirements"
    ],
    websiteUrl: "https://alberta-canada.thegrantportal.com/grant/rural-healthcare-innovation-grant",
    featured: false,
    province: "Alberta",
    industry: "Healthcare & Life Sciences",
    fundingOrganization: "Alberta Rural Health",
    createdAt: new Date().toISOString()
  },
  {
    title: "Mental Health Technology Initiative",
    description: "Funds the development and implementation of innovative technology solutions addressing mental health challenges in Alberta, with emphasis on youth, remote services, and crisis intervention.",
    type: "provincial",
    imageUrl: "https://images.unsplash.com/photo-1580404054616-0f0c809be7ab?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Ongoing",
    fundingAmount: "$50K-200K",
    category: "Mental Health",
    eligibilityCriteria: [
      "Mental health technology innovations",
      "Alberta-based organization",
      "Solution addressing priority populations",
      "Evidence-based approach",
      "Partnership with mental health service provider"
    ],
    pros: [
      "Addresses critical healthcare need",
      "Rolling application process",
      "Access to mental health network",
      "Potential for public health impact",
      "Support for clinical validation"
    ],
    cons: [
      "Privacy and security requirements",
      "Clinical validation needed",
      "Integration with existing services required",
      "User adoption challenges",
      "Outcome measurement complexity"
    ],
    websiteUrl: "https://alberta-canada.thegrantportal.com/grant/mental-health-technology-initiative",
    featured: false,
    province: "Alberta",
    industry: "Healthcare & Life Sciences",
    fundingOrganization: "Alberta Mental Health Foundation",
    createdAt: new Date().toISOString()
  },
  {
    title: "Healthcare AI & Machine Learning Grant",
    description: "Supports the application of artificial intelligence and machine learning technologies to improve healthcare delivery, diagnosis, and treatment optimization in Alberta's health system.",
    type: "provincial",
    imageUrl: "https://images.unsplash.com/photo-1652180747086-9fb368c7ff46?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Feb 28, 2026",
    fundingAmount: "$75K-250K",
    category: "AI in Healthcare",
    eligibilityCriteria: [
      "AI/ML solutions for healthcare applications",
      "Alberta-based development team",
      "Data privacy and ethics framework",
      "Clinical validation plan",
      "Integration potential with Alberta Health Services"
    ],
    pros: [
      "Access to healthcare datasets",
      "Technical AI/ML expertise support",
      "Clinical validation opportunities",
      "Connection to compute resources",
      "Regulatory navigation assistance"
    ],
    cons: [
      "Strict data governance requirements",
      "Complex ethical approval process",
      "Technical expertise prerequisites",
      "Algorithm validation requirements",
      "Clinical workflow integration challenges"
    ],
    websiteUrl: "https://alberta-canada.thegrantportal.com/grant/healthcare-ai-machine-learning-grant",
    featured: true,
    province: "Alberta",
    industry: "Healthcare & Life Sciences",
    fundingOrganization: "Alberta Innovates",
    createdAt: new Date().toISOString()
  },
  {
    title: "Senior Care Technology Program",
    description: "Provides funding for innovative technology solutions that enhance the quality of care, independence, and quality of life for seniors in Alberta through digital health and assistive technologies.",
    type: "provincial",
    imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Jul 15, 2025",
    fundingAmount: "$25K-100K",
    category: "Senior Care",
    eligibilityCriteria: [
      "Technology solutions for senior care",
      "Alberta-based development",
      "User-centered design approach",
      "Partnership with senior care facility",
      "Accessibility and usability focus"
    ],
    pros: [
      "Addresses growing demographic need",
      "Access to senior care test environments",
      "User testing support",
      "Connection to care providers",
      "Implementation guidance"
    ],
    cons: [
      "User adoption challenges",
      "Technology literacy considerations",
      "Accessibility requirements",
      "Integration with existing care systems",
      "Sustainable business model needed"
    ],
    websiteUrl: "https://alberta-canada.thegrantportal.com/grant/senior-care-technology-program",
    featured: false,
    province: "Alberta",
    industry: "Healthcare & Life Sciences",
    fundingOrganization: "Alberta Seniors and Housing",
    createdAt: new Date().toISOString()
  },
  {
    title: "Medical Device Innovation Fund",
    description: "Supports the development, testing, and commercialization of innovative medical devices designed and manufactured in Alberta with potential for global market adoption.",
    type: "provincial",
    imageUrl: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=500&h=280&q=80",
    deadline: "Nov 30, 2025",
    fundingAmount: "$100K-500K",
    category: "Medical Devices",
    eligibilityCriteria: [
      "Novel medical device development",
      "Alberta-based manufacturing",
      "Regulatory strategy in place",
      "Intellectual property protection",
      "Market analysis and commercialization plan"
    ],
    pros: [
      "Substantial funding amounts",
      "Regulatory pathway support",
      "Market access guidance",
      "Clinical testing connections",
      "Potential for follow-on investment"
    ],
    cons: [
      "Requires 30% matching funds",
      "Complex regulatory requirements",
      "Technical validation needed",
      "Manufacturing capability requirements",
      "Detailed commercialization milestones"
    ],
    websiteUrl: "https://alberta-canada.thegrantportal.com/grant/medical-device-innovation-fund",
    featured: false,
    province: "Alberta",
    industry: "Healthcare & Life Sciences",
    fundingOrganization: "Alberta Innovates",
    createdAt: new Date().toISOString()
  }
];