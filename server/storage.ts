import { grants, users, type Grant, type InsertGrant, type User, type InsertUser, userGrants, type UserGrant, type InsertUserGrant } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Grant methods
  getAllGrants(): Promise<Grant[]>;
  getGrantById(id: number): Promise<Grant | undefined>;
  getGrantsByType(type: string): Promise<Grant[]>;
  getFeaturedGrants(): Promise<Grant[]>;
  searchGrants(query: string): Promise<Grant[]>;
  addGrant(grant: InsertGrant): Promise<Grant>; // Add method for scraped grants
  
  // User Grants methods (My List)
  getUserGrants(userId: number): Promise<Grant[]>;
  getUserGrantsWithStatus(userId: number): Promise<(UserGrant & { grant: Grant })[]>;
  addGrantToUserList(userGrant: InsertUserGrant): Promise<UserGrant>;
  updateUserGrantStatus(userId: number, grantId: number, status: string, notes?: string): Promise<UserGrant | undefined>;
  removeGrantFromUserList(userId: number, grantId: number): Promise<boolean>;
  isGrantInUserList(userId: number, grantId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private grants: Map<number, Grant>;
  private userGrants: Map<number, UserGrant>;
  private userIdCounter: number;
  private grantIdCounter: number;
  private userGrantIdCounter: number;

  constructor() {
    this.users = new Map();
    this.grants = new Map();
    this.userGrants = new Map();
    this.userIdCounter = 1;
    this.grantIdCounter = 1;
    this.userGrantIdCounter = 1;
    
    // Initialize with sample grants
    this.initializeGrants();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    // Ensure all required fields are present with defaults
    const user: User = { 
      ...insertUser, 
      id,
      isBusiness: insertUser.isBusiness || false,
      businessName: insertUser.businessName || null,
      businessType: insertUser.businessType || null,
      businessDescription: insertUser.businessDescription || null,
      industry: insertUser.industry || null,
      province: insertUser.province || null,
      employeeCount: insertUser.employeeCount || null,
      yearFounded: insertUser.yearFounded || null,
      website: insertUser.website || null,
      phoneNumber: insertUser.phoneNumber || null,
      address: insertUser.address || null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return undefined;
    }
    
    const updatedUser = {
      ...existingUser,
      ...userData
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Grant methods
  async getAllGrants(): Promise<Grant[]> {
    return Array.from(this.grants.values());
  }

  async getGrantById(id: number): Promise<Grant | undefined> {
    return this.grants.get(id);
  }

  async getGrantsByType(type: string): Promise<Grant[]> {
    return Array.from(this.grants.values()).filter(
      (grant) => grant.type === type,
    );
  }

  async getFeaturedGrants(): Promise<Grant[]> {
    return Array.from(this.grants.values()).filter(
      (grant) => grant.featured,
    );
  }

  async searchGrants(query: string): Promise<Grant[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.grants.values()).filter(
      (grant) => 
        grant.title.toLowerCase().includes(lowerQuery) || 
        grant.description.toLowerCase().includes(lowerQuery) ||
        grant.category.toLowerCase().includes(lowerQuery)
    );
  }

  // User Grants methods (My List)
  async getUserGrants(userId: number): Promise<Grant[]> {
    const userGrantList = Array.from(this.userGrants.values()).filter(
      (userGrant) => userGrant.userId === userId
    );
    
    return userGrantList.map(
      (userGrant) => this.grants.get(userGrant.grantId)!
    ).filter(Boolean);
  }

  async addGrantToUserList(insertUserGrant: InsertUserGrant): Promise<UserGrant> {
    const id = this.userGrantIdCounter++;
    // Ensure all required fields have values
    const userGrant: UserGrant = { 
      ...insertUserGrant, 
      id,
      savedAt: insertUserGrant.savedAt || new Date().toISOString(),
      status: insertUserGrant.status || "saved",
      notes: insertUserGrant.notes || null
    };
    this.userGrants.set(id, userGrant);
    return userGrant;
  }

  async removeGrantFromUserList(userId: number, grantId: number): Promise<boolean> {
    const userGrantEntry = Array.from(this.userGrants.entries()).find(
      ([_, userGrant]) => userGrant.userId === userId && userGrant.grantId === grantId
    );

    if (userGrantEntry) {
      this.userGrants.delete(userGrantEntry[0]);
      return true;
    }

    return false;
  }

  async isGrantInUserList(userId: number, grantId: number): Promise<boolean> {
    return Array.from(this.userGrants.values()).some(
      (userGrant) => userGrant.userId === userId && userGrant.grantId === grantId
    );
  }
  
  async getUserGrantsWithStatus(userId: number): Promise<(UserGrant & { grant: Grant })[]> {
    const userGrantList = Array.from(this.userGrants.values()).filter(
      (userGrant) => userGrant.userId === userId
    );
    
    return userGrantList.map(userGrant => {
      const grant = this.grants.get(userGrant.grantId);
      if (!grant) return null;
      return {
        ...userGrant,
        grant
      };
    }).filter(Boolean) as (UserGrant & { grant: Grant })[];
  }
  
  async updateUserGrantStatus(userId: number, grantId: number, status: string, notes?: string): Promise<UserGrant | undefined> {
    const userGrantEntry = Array.from(this.userGrants.entries()).find(
      ([_, userGrant]) => userGrant.userId === userId && userGrant.grantId === grantId
    );
    
    if (!userGrantEntry) {
      return undefined;
    }
    
    const [id, userGrant] = userGrantEntry;
    const updatedUserGrant: UserGrant = {
      ...userGrant,
      status: status as "saved" | "applying" | "submitted" | "approved" | "rejected",
      notes: notes || userGrant.notes
    };
    
    this.userGrants.set(id, updatedUserGrant);
    return updatedUserGrant;
  }
  
  // Add a new grant (for the scraper)
  async addGrant(insertGrant: InsertGrant): Promise<Grant> {
    const id = this.grantIdCounter++;
    
    // Map InsertGrant to Grant with proper defaults for missing fields
    const grant: Grant = {
      ...insertGrant,
      id,
      createdAt: new Date().toISOString(),
      // Ensure all fields have proper defaults
      category: insertGrant.category || insertGrant.industry || 'Various',
      imageUrl: insertGrant.imageUrl || 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=500&h=280&q=80',
      competitionLevel: 'Medium',
      eligibilityCriteria: insertGrant.eligibilityCriteria || [insertGrant.eligibility || 'See website for details'],
      websiteUrl: insertGrant.applicationUrl || '',
      applicationLink: insertGrant.applicationUrl || '',
      pros: null,
      cons: null,
      fundingOrganization: insertGrant.department || insertGrant.organization || null,
      applicationProcess: null,
      documents: null,
      contactEmail: null,
      contactPhone: null,
      whoCanApply: null,
      industryFocus: null,
      locationRestrictions: null,
      otherRequirements: null,
      applicationDates: insertGrant.deadline || 'Ongoing',
      howToApply: null,
      reviewProcess: null,
      restrictions: null,
      faqQuestions: null,
      faqAnswers: null
    };
    
    this.grants.set(id, grant);
    return grant;
  }

  // Initialize with real grants data from Innovation Canada
  private initializeGrants() {
    const grantsData: InsertGrant[] = [
      // Federal Grants from Innovation Canada
      {
        title: "Canada Digital Adoption Program (CDAP)",
        description: "The Canada Digital Adoption Program (CDAP) helps small and medium-sized businesses increase their online presence and adopt digital technologies.",
        type: "federal",
        imageUrl: "https://images.unsplash.com/photo-1577433218939-37da32ff896b?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Mar 31, 2025",
        fundingAmount: "$15K-$100K",
        category: "Digital Technology",
        industry: "Technology",
        province: "All",
        competitionLevel: "Medium",
        eligibilityCriteria: [
          "Canadian small or medium-sized business",
          "For-profit organization",
          "Registered or incorporated business",
          "Consumer-facing business with a physical location",
          "Minimum annual revenue of $500,000"
        ],
        pros: [
          "Up to $15,000 in grants to work with an e-commerce advisor",
          "0% interest loans from BDC up to $100,000 for implementation",
          "Access to a network of digital advisors",
          "Additional support from youth e-commerce advisors",
          "Combines both funding and expertise"
        ],
        cons: [
          "Different streams have different eligibility requirements",
          "Complex application process",
          "Requires detailed implementation plans",
          "May have wait times for advisor matching",
          "Funding depends on business size and needs"
        ],
        websiteUrl: "https://innovation.ised-isde.canada.ca/innovation/s/tsrcsgypj",
        featured: true,
        createdAt: new Date().toISOString(),
        fundingOrganization: "Innovation, Science and Economic Development Canada",
        applicationProcess: [
          "Select the appropriate stream (Boost Your Business Technology or Grow Your Business Online)",
          "Create an account on the CDAP portal",
          "Complete the online eligibility questionnaire",
          "Engage with a digital advisor or service provider",
          "Develop a digital adoption plan",
          "Submit your application with all required documentation"
        ],
        documents: [
          "Business registration information",
          "Financial statements for the past year",
          "Digital needs assessment",
          "Quotes from service providers (if applicable)",
          "Business number and CRA information"
        ],
        contactEmail: "cdap-support@canada.ca",
        contactPhone: "+1-800-328-6189",
        // New structured fields
        whoCanApply: [
          "Small and medium-sized businesses",
          "For-profit organizations",
          "Incorporated businesses",
          "Businesses with physical locations"
        ],
        industryFocus: [
          "Technology",
          "Retail",
          "Manufacturing",
          "Professional services",
          "Healthcare"
        ],
        locationRestrictions: "Available across all Canadian provinces and territories",
        otherRequirements: [
          "Minimum annual revenue of $500,000",
          "Must have been in business for at least 1 year",
          "Must have at least 1 employee"
        ],
        applicationDates: "Applications accepted until March 31, 2025",
        applicationLink: "https://innovation.ised-isde.canada.ca/innovation/s/tsrcsgypj/application",
        howToApply: [
          "Online application through the CDAP portal",
          "Digital needs questionnaire completion",
          "Virtual meeting with a digital advisor",
          "Final submission through secure online portal"
        ],
        reviewProcess: "Applications are reviewed within 4-6 weeks, with funding decisions made within 2 months of submission",
        restrictions: [
          "Funds cannot be used for hardware purchases",
          "Cannot be combined with certain other federal digital programs",
          "All funded activities must be completed within 12 months",
          "Maximum funding caps apply based on business size and revenue"
        ],
        faqQuestions: [
          "Can I apply for both CDAP streams?", 
          "What if my business revenue is less than $500,000?",
          "How are digital advisors matched with businesses?"
        ],
        faqAnswers: [
          "No, businesses must select either the Boost Your Business Technology or Grow Your Business Online stream based on their needs.",
          "Businesses with revenue below $500,000 may be eligible for the Grow Your Business Online stream, which has different requirements.",
          "Advisors are matched based on your industry, location, and specific digital needs identified in your application."
        ]
      },
      {
        title: "Strategic Innovation Fund (SIF)",
        description: "The Strategic Innovation Fund supports large-scale, transformative, and collaborative projects that promote sustainable economic growth and innovation excellence across all sectors of the economy.",
        type: "federal",
        imageUrl: "https://images.unsplash.com/photo-1611095210561-67f0832b1ca3?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Ongoing",
        fundingAmount: "$10M+",
        category: "Technology",
        industry: "Multiple",
        province: "All",
        competitionLevel: "High",
        eligibilityCriteria: [
          "For-profit corporations incorporated under Canadian laws",
          "Large-scale projects ($10M+ in eligible costs)",
          "Collaborative with multiple parties",
          "Innovation leading to productivity improvements",
          "Positive economic impact and job creation"
        ],
        pros: [
          "Substantial funding for transformative projects",
          "Support for multiple project streams and sectors",
          "Can fund up to 50% of eligible costs",
          "Focused on technology development and adoption",
          "Promotes technology transfer and supply chain integration"
        ],
        cons: [
          "Highly competitive application process",
          "Extensive due diligence and application requirements",
          "Long assessment timelines",
          "Requires matching funds and other financing",
          "Detailed reporting and performance measurements"
        ],
        websiteUrl: "https://innovation.ised-isde.canada.ca/innovation/s/tsr0zznhs",
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        title: "Canada Cultural Spaces Fund (CCSF)",
        description: "The CCSF supports the improvement of physical conditions for arts, heritage, culture and creative innovation by contributing to projects that improve, renovate and create spaces for the arts and heritage.",
        type: "federal",
        imageUrl: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Ongoing",
        fundingAmount: "$15K-$15M",
        category: "Arts",
        industry: "Culture",
        province: "All",
        competitionLevel: "Medium",
        eligibilityCriteria: [
          "Not-for-profit arts and heritage organizations",
          "Provincial/territorial/municipal governments and agencies",
          "Indigenous organizations",
          "Equivalent Indigenous peoples' institutions or organizations",
          "Must own or have a long-term lease on the property"
        ],
        pros: [
          "Funding for construction, renovation and equipment acquisition",
          "Support for feasibility studies and special projects",
          "Can cover up to 50% of eligible costs",
          "Targeted toward improving physical arts infrastructure",
          "Enhances accessibility to cultural spaces"
        ],
        cons: [
          "Only for organizations, not individual artists",
          "Requires matching funding from other sources",
          "Complex application process with technical requirements",
          "Long lead times for approval",
          "Priority given to shovel-ready projects"
        ],
        websiteUrl: "https://innovation.ised-isde.canada.ca/innovation/s/tsr2gfyhbli",
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        title: "Natural Sciences and Engineering Research Council (NSERC)",
        description: "NSERC invests in people, discovery and innovation through programs that support post-secondary research, provide scholarships and fellowships, and connect companies with research expertise.",
        type: "federal",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Varies by program",
        fundingAmount: "$5K-$1M+",
        category: "Research",
        industry: "Science",
        province: "All",
        competitionLevel: "High",
        eligibilityCriteria: [
          "Canadian universities, colleges and polytechnics",
          "Academic researchers in natural sciences and engineering",
          "Canadian companies partnering with academic institutions",
          "Post-secondary students and postdoctoral fellows",
          "Research projects must be in natural sciences or engineering"
        ],
        pros: [
          "Multiple funding streams for different career stages",
          "Supports both fundamental and applied research",
          "Funding for research partnerships with industry",
          "Scholarships and fellowships for students",
          "Internationally recognized funding program"
        ],
        cons: [
          "Highly competitive application process",
          "Detailed research proposal required",
          "Peer review process can be lengthy",
          "Restricted to natural sciences and engineering",
          "Extensive reporting and compliance requirements"
        ],
        websiteUrl: "https://innovation.ised-isde.canada.ca/innovation/s/tsrk6m2vdb",
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        title: "Women Entrepreneurship Strategy (WES) Ecosystem Fund",
        description: "The WES Ecosystem Fund supports women entrepreneurs by investing in organizations that deliver support to women entrepreneurs, with a focus on underrepresented groups.",
        type: "federal",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Check website for latest deadlines",
        fundingAmount: "$25K-$3M",
        category: "Business",
        industry: "Multiple",
        province: "All",
        competitionLevel: "Medium",
        eligibilityCriteria: [
          "Not-for-profit organizations supporting women entrepreneurs",
          "Focus on women entrepreneurs from diverse backgrounds",
          "Projects that address gaps in services for women entrepreneurs",
          "Must demonstrate ability to deliver business supports",
          "Projects that foster collaboration across ecosystem"
        ],
        pros: [
          "Specific support for women entrepreneurs",
          "Focus on underrepresented groups in entrepreneurship",
          "Supports both national and regional initiatives",
          "Encourages innovative approaches to support",
          "Addresses specific barriers faced by women entrepreneurs"
        ],
        cons: [
          "Available only to organizations, not individual entrepreneurs",
          "Competitive application process",
          "Required expertise in supporting women entrepreneurs",
          "Complex reporting requirements",
          "Detailed project plan required"
        ],
        websiteUrl: "https://innovation.ised-isde.canada.ca/innovation/s/tsrqhhbxso",
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        title: "Employment Training Grant",
        description: "Providing funds for workforce development and skills training.",
        type: "federal",
        imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Ongoing",
        fundingAmount: "$5K-30K",
        category: "Education",
        eligibilityCriteria: [
          "Registered business with employees",
          "Training plan for Canadian workers",
          "Skills development focus",
          "Industry-recognized credentials",
          "Current payroll tax compliance"
        ],
        pros: [
          "Continuous intake (no deadline)",
          "Quick approval process",
          "Flexible training options",
          "Multiple employees can benefit",
          "Various training providers accepted"
        ],
        cons: [
          "Reimbursement model (pay first, claim later)",
          "Limited to certain occupational categories",
          "Required employee retention period",
          "Capped funding per employee",
          "Training must be completed within 12 months"
        ],
        websiteUrl: "https://www.canada.ca/training-grants",
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        title: "Infrastructure Development",
        description: "For municipalities and provinces improving public infrastructure.",
        type: "federal",
        imageUrl: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Jun 30, 2024",
        fundingAmount: "$1M-10M",
        category: "Infrastructure",
        eligibilityCriteria: [
          "Municipal or provincial government",
          "Public infrastructure project",
          "Environmental assessment completed",
          "Public benefit demonstration",
          "Long-term maintenance plan"
        ],
        pros: [
          "Substantial funding available",
          "Multi-year project support",
          "Technical assistance provided",
          "Job creation emphasis",
          "Green infrastructure priority"
        ],
        cons: [
          "Complex application process",
          "Matching funds required",
          "Lengthy approval timeline",
          "Extensive reporting requirements",
          "Subject to political priorities"
        ],
        websiteUrl: "https://www.canada.ca/infrastructure-funding",
        featured: false,
        createdAt: new Date().toISOString()
      },
      
      // Provincial Grants
      {
        title: "Ontario Business Growth",
        description: "Supporting Ontario-based businesses in expansion and growth.",
        type: "provincial",
        imageUrl: "https://images.unsplash.com/photo-1609151376730-f246ec0b99e5?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Feb 28, 2024",
        fundingAmount: "$25K-100K",
        category: "Business",
        eligibilityCriteria: [
          "Ontario-registered business",
          "Minimum 3 employees",
          "Revenue of $500K+ annually",
          "Growth plan with job creation",
          "Minimum 2 years in operation"
        ],
        pros: [
          "Targeted to Ontario business needs",
          "Local support services",
          "Quick application review",
          "Connection to Ontario supply chains",
          "Export development assistance"
        ],
        cons: [
          "Only available to Ontario businesses",
          "Higher matching fund requirements",
          "Limited to certain priority sectors",
          "Must demonstrate Ontario economic benefit",
          "Annual renewal application required"
        ],
        websiteUrl: "https://www.ontario.ca/business-grants",
        featured: true,
        province: "Ontario",
        industry: "Business",
        createdAt: new Date().toISOString()
      },
      {
        title: "Quebec Cultural Fund",
        description: "Preserving and promoting Quebec's unique cultural heritage.",
        type: "provincial",
        imageUrl: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Apr 15, 2024",
        fundingAmount: "$10K-75K",
        category: "Arts",
        eligibilityCriteria: [
          "Quebec-based artist or organization",
          "Project promoting Quebec culture",
          "French language component",
          "Public presentation element",
          "Cultural significance to Quebec"
        ],
        pros: [
          "Support for French language projects",
          "Quebec cultural promotion",
          "Networking within Quebec cultural sector",
          "Marketing assistance",
          "International showcase opportunities"
        ],
        cons: [
          "Must have Quebec residency",
          "French application materials required",
          "Provincial focus limitations",
          "Required cultural heritage component",
          "Quebec showcase requirement"
        ],
        websiteUrl: "https://www.quebec.ca/culture-grants",
        featured: true,
        province: "Quebec",
        industry: "Arts & Culture",
        createdAt: new Date().toISOString()
      },
      {
        title: "BC Tech Innovation",
        description: "For tech startups and innovators in British Columbia.",
        type: "provincial",
        imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "May 31, 2024",
        fundingAmount: "$50K-200K",
        category: "Technology",
        eligibilityCriteria: [
          "BC-based technology company",
          "Under 5 years in operation",
          "Innovative product or service",
          "Headquartered in British Columbia",
          "Less than 50 employees"
        ],
        pros: [
          "Access to BC tech ecosystem",
          "Mentorship from BC tech leaders",
          "Connection to BC venture capital",
          "Provincial market testing support",
          "BC-specific industry connections"
        ],
        cons: [
          "Must maintain BC headquarters",
          "Limited to BC-focused growth plans",
          "Required collaboration with BC institutions",
          "Provincial job creation requirements",
          "BC supplier requirements"
        ],
        websiteUrl: "https://www.britishcolumbia.ca/tech-grants",
        featured: false,
        province: "British Columbia",
        industry: "Technology",
        createdAt: new Date().toISOString()
      },
      {
        title: "Alberta Energy Transition",
        description: "Supporting clean energy and sustainable resource development.",
        type: "provincial",
        imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Jul 15, 2024",
        fundingAmount: "$100K-500K",
        category: "Energy",
        eligibilityCriteria: [
          "Alberta-based energy company",
          "Clean energy technology focus",
          "Emissions reduction component",
          "Job transition plan",
          "Alberta economic impact"
        ],
        pros: [
          "Specific to Alberta energy sector",
          "Transition support from traditional energy",
          "Access to Alberta energy research facilities",
          "Industry partnership opportunities",
          "Resource development expertise"
        ],
        cons: [
          "Alberta-specific economic benefits required",
          "Limited to energy sector applications",
          "Complex technical requirements",
          "Provincial regulatory compliance focus",
          "Required Alberta job protection component"
        ],
        websiteUrl: "https://www.alberta.ca/energy-grants",
        featured: false,
        province: "Alberta",
        industry: "Energy",
        createdAt: new Date().toISOString()
      },
      {
        title: "Manitoba Agriculture Innovation",
        description: "Funding for agricultural technology and sustainable farming practices.",
        type: "provincial",
        imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Mar 1, 2024",
        fundingAmount: "$15K-75K",
        category: "Agriculture",
        eligibilityCriteria: [
          "Manitoba-based agricultural operation",
          "Innovative farming practice implementation",
          "Sustainability component",
          "Manitoba land usage",
          "Commercial viability"
        ],
        pros: [
          "Specific to Manitoba agricultural needs",
          "Local equipment support",
          "Connection to regional markets",
          "Provincial testing grounds available",
          "Manitoba agricultural expertise"
        ],
        cons: [
          "Seasonal application restrictions",
          "Manitoba climate focus requirements",
          "Limited to provincial priorities",
          "Required Manitoba supply chain integration",
          "Geographically restricted testing"
        ],
        websiteUrl: "https://www.manitoba.ca/agriculture-grants",
        featured: false,
        province: "Manitoba",
        industry: "Agriculture",
        createdAt: new Date().toISOString()
      },
      {
        title: "Nova Scotia Ocean Technology",
        description: "Supporting marine innovation and blue economy projects.",
        type: "provincial",
        imageUrl: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Jun 1, 2024",
        fundingAmount: "$20K-150K",
        category: "Marine",
        eligibilityCriteria: [
          "Nova Scotia-based marine business",
          "Ocean technology innovation",
          "Coastal community benefit",
          "Atlantic marine application",
          "Sustainability focus"
        ],
        pros: [
          "Specific to Nova Scotia marine industries",
          "Access to Atlantic testing facilities",
          "Coastal community connections",
          "Provincial marine expertise",
          "Regional market focus"
        ],
        cons: [
          "Geographically limited applications",
          "Seasonal testing restrictions",
          "Atlantic Canada market focus required",
          "Provincial regulatory emphasis",
          "Coastal community participation mandatory"
        ],
        websiteUrl: "https://www.novascotia.ca/ocean-tech",
        featured: false,
        province: "Nova Scotia",
        industry: "Marine & Ocean Technology",
        createdAt: new Date().toISOString()
      },
      
      // Private Grants
      {
        title: "Rogers Innovation Fund",
        description: "Support for technology startups and innovation projects across Canada.",
        type: "private",
        imageUrl: "https://images.unsplash.com/photo-1581091226033-c6e0f4f4d398?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Ongoing",
        fundingAmount: "$50K-250K",
        category: "Technology",
        eligibilityCriteria: [
          "Canadian registered business",
          "Innovative technology solution",
          "Growth potential",
          "Minimum viable product developed",
          "Market validation"
        ],
        pros: [
          "Industry-specific mentorship",
          "Access to Rogers technology ecosystem",
          "No equity requirements",
          "Marketing support",
          "Rolling application process"
        ],
        cons: [
          "Competitive selection process",
          "Technology focus only",
          "Progress milestone requirements",
          "Limited to specific technology sectors",
          "Requires detailed business plan"
        ],
        websiteUrl: "https://rogersinnovation.ca",
        featured: true,
        province: null,
        fundingOrganization: "Rogers Communications",
        createdAt: new Date().toISOString()
      },
      {
        title: "TD Environmental Action Grant",
        description: "Funding for community-based environmental initiatives and conservation projects.",
        type: "private",
        imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Mar 15, 2024",
        fundingAmount: "$5K-25K",
        category: "Environment",
        eligibilityCriteria: [
          "Registered charity or non-profit",
          "Environmental focus",
          "Community impact",
          "Clear sustainability plan",
          "Canadian operation"
        ],
        pros: [
          "Simple application process",
          "Fast funding decision",
          "Environmental expertise support",
          "Networking opportunities",
          "Volunteer support available"
        ],
        cons: [
          "Smaller funding amounts",
          "Requires community partner",
          "Urban focus preferred",
          "One-time funding only",
          "Limited to environmental projects"
        ],
        websiteUrl: "https://td.com/environmentalgrants",
        featured: false,
        province: null,
        fundingOrganization: "TD Bank Group",
        createdAt: new Date().toISOString()
      },
      {
        title: "Shopify Capital Resilience Fund",
        description: "Financial support for small and medium e-commerce businesses affected by economic challenges.",
        type: "private",
        imageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Ongoing",
        fundingAmount: "$10K-500K",
        category: "E-commerce",
        eligibilityCriteria: [
          "Shopify merchant",
          "Minimum 6 months on platform",
          "Canadian business registration",
          "Good standing account",
          "Demonstrated growth potential"
        ],
        pros: [
          "Revenue-based repayment model",
          "No credit check required",
          "Fast approval process",
          "No fixed payment schedule",
          "No equity dilution"
        ],
        cons: [
          "Must be Shopify merchant",
          "Higher total repayment amount",
          "Percentage of sales withheld daily",
          "Limited use requirements",
          "May affect cash flow"
        ],
        websiteUrl: "https://shopify.ca/capital",
        featured: true,
        province: null,
        fundingOrganization: "Shopify Inc.",
        createdAt: new Date().toISOString()
      },
      {
        title: "RBC Future Launch Scholarship",
        description: "Support for students pursuing education in emerging technological fields and innovation.",
        type: "private",
        imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Jan 31, 2024",
        fundingAmount: "$1.5K-5K",
        category: "Education",
        eligibilityCriteria: [
          "Canadian citizen or permanent resident",
          "Enrolled in post-secondary education",
          "Studying technology, innovation, or engineering",
          "Demonstrated leadership",
          "Community involvement"
        ],
        pros: [
          "Merit-based selection",
          "Networking opportunities",
          "Mentorship program access",
          "No repayment required",
          "Additional resources provided"
        ],
        cons: [
          "Highly competitive",
          "Limited to specific fields",
          "One-time award",
          "Detailed application process",
          "Requires recommendation letters"
        ],
        websiteUrl: "https://rbc.com/futurelaunch",
        featured: false,
        province: null,
        fundingOrganization: "Royal Bank of Canada",
        createdAt: new Date().toISOString()
      },
      {
        title: "Desjardins Social Impact Grant",
        description: "Funding for social enterprises and community initiatives addressing social challenges in Quebec and Ontario.",
        type: "private",
        imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Apr 30, 2024",
        fundingAmount: "$20K-75K",
        category: "Social Enterprise",
        eligibilityCriteria: [
          "Registered social enterprise or non-profit",
          "Quebec or Ontario based",
          "Clear social impact metrics",
          "Sustainable business model",
          "At least 1 year in operation"
        ],
        pros: [
          "Bi-lingual support available",
          "Business development assistance",
          "Connection to cooperative network",
          "Financial training included",
          "Multi-year funding possible"
        ],
        cons: [
          "Geographic restrictions",
          "Requires impact measurement plan",
          "Quarterly reporting required",
          "Must attend training sessions",
          "Matching component recommended"
        ],
        websiteUrl: "https://desjardins.com/socialimpact",
        featured: false,
        province: null,
        fundingOrganization: "Desjardins Group",
        createdAt: new Date().toISOString()
      },

      // Alberta Innovates Grants
      {
        title: "Digital Innovation in Clean Energy (DICE)",
        description: "Supporting the development of digital technology that helps create jobs in the digital economy and addresses the challenges of climate change in Alberta's energy industry.",
        type: "provincial",
        imageUrl: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Jun 30, 2025",
        fundingAmount: "$100K-300K",
        category: "Clean Energy",
        eligibilityCriteria: [
          "Alberta-based small and medium-sized enterprises",
          "Digital technology innovation focus",
          "Clean energy application",
          "GHG emissions reduction potential",
          "Technology readiness level 4-7"
        ],
        pros: [
          "Builds on previous successful funding competitions",
          "Access to Alberta Innovates network and resources",
          "Significant funding amount for qualifying projects",
          "Support for commercialization and market adoption",
          "Focus on Alberta job creation"
        ],
        cons: [
          "Requires minimum 25% matching funds",
          "Project must complete within 24 months",
          "Quarterly reporting requirements",
          "Competitive selection process",
          "Must demonstrate economic and environmental benefits"
        ],
        websiteUrl: "https://albertainnovates.ca/funding/digital-innovation-in-clean-energy-dice/",
        featured: true,
        province: "Alberta",
        industry: "Energy & Environment",
        fundingOrganization: "Alberta Innovates",
        createdAt: new Date().toISOString()
      },
      {
        title: "Accelerating Innovations into CarE (AICE)",
        description: "Accelerating health technology adoption into Alberta's healthcare system, bridging the gap between innovation and implementation for healthy aging technologies.",
        type: "provincial",
        imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Apr 15, 2025",
        fundingAmount: "$150K-300K",
        category: "Healthcare",
        eligibilityCriteria: [
          "Alberta-based small and medium-sized enterprises",
          "Innovative health technology solutions",
          "Clinical/industry partnerships",
          "Addressing senior care needs",
          "Technology readiness level 6+"
        ],
        pros: [
          "Direct pathway to healthcare implementation",
          "Access to healthcare system partners",
          "Support from Alberta Innovates network",
          "Potential provincial-wide adoption",
          "Real-world validation opportunities"
        ],
        cons: [
          "Requires healthcare partnership commitment",
          "Strict regulatory compliance required",
          "Multiple approval stages",
          "Complex implementation environment",
          "Extended timeline for adoption"
        ],
        websiteUrl: "https://albertainnovates.ca/funding/accelerating-innovations-into-care-aice-tech-for-healthy-aging/",
        featured: false,
        province: "Alberta",
        industry: "Healthcare & Life Sciences",
        fundingOrganization: "Alberta Innovates",
        createdAt: new Date().toISOString()
      },
      {
        title: "Product Demonstration Program",
        description: "Supporting Alberta SMEs in demonstrating and creating market value for their innovative technology product or service through real-world implementation.",
        type: "provincial",
        imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Ongoing",
        fundingAmount: "$50K-150K",
        category: "Technology",
        eligibilityCriteria: [
          "Alberta-based small and medium-sized enterprises",
          "Minimum viable product developed",
          "Partner committed to implement technology",
          "Market validation strategy",
          "Technical feasibility demonstrated"
        ],
        pros: [
          "Market-pull focused approach",
          "Real-world implementation support",
          "Connection to potential customers",
          "Technology validation opportunity",
          "Builds product credibility"
        ],
        cons: [
          "Requires committed partner organization",
          "Co-funding requirement (50% match)",
          "Limited to technology readiness level 7-9",
          "Performance metrics reporting required",
          "Competitive application process"
        ],
        websiteUrl: "https://albertainnovates.ca/programs/product-demonstration-program/",
        featured: false,
        province: "Alberta",
        industry: "Technology & Innovation",
        fundingOrganization: "Alberta Innovates",
        createdAt: new Date().toISOString()
      },
      {
        title: "r&d Associates Program",
        description: "Supporting the hiring of highly-qualified personnel to help Alberta SMEs advance their research, development, and innovation activities.",
        type: "provincial",
        imageUrl: "https://images.unsplash.com/photo-1581092921461-fd5e8f8d2594?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Rolling intake",
        fundingAmount: "$67.5K-105K",
        category: "R&D",
        eligibilityCriteria: [
          "Alberta-based small and medium-sized enterprises",
          "R&D project with clear innovation goals",
          "Commercially viable technology development",
          "Hiring need for specialized expertise",
          "Business strategy alignment"
        ],
        pros: [
          "Subsidizes hiring of specialized talent",
          "1-2 year funding commitment",
          "Helps with competitive recruitment",
          "Builds Alberta innovation capacity",
          "Connects to academic expertise"
        ],
        cons: [
          "Company must contribute 25% of salary",
          "Limited to specific technical roles",
          "Hiring process restrictions",
          "Detailed reporting requirements",
          "Subject to performance reviews"
        ],
        websiteUrl: "https://albertainnovates.ca/programs/r-and-d-associates/",
        featured: false,
        province: "Alberta",
        industry: "Research & Development",
        fundingOrganization: "Alberta Innovates",
        createdAt: new Date().toISOString()
      },
      {
        title: "Micro-Voucher Program",
        description: "Providing quick access to funding for early feasibility, proof-of-concept, prototype development, and other early-stage innovation activities.",
        type: "provincial",
        imageUrl: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Continuous",
        fundingAmount: "$10K-25K",
        category: "Early-Stage Innovation",
        eligibilityCriteria: [
          "Alberta-based small and medium-sized enterprises",
          "Early-stage technology development",
          "Clear innovation opportunity identified",
          "Defined project scope and deliverables",
          "First-time innovation projects preferred"
        ],
        pros: [
          "Quick application and approval process",
          "Low barrier to entry for first-time innovators",
          "Minimal reporting requirements",
          "Connects to service providers",
          "Wide range of eligible activities"
        ],
        cons: [
          "Limited funding amount",
          "One-time support only",
          "Must use approved service providers",
          "Short project timeline (under 6 months)",
          "Competitive allocation process"
        ],
        websiteUrl: "https://albertainnovates.ca/programs/micro-voucher/",
        featured: false,
        province: "Alberta",
        industry: "Technology & Innovation",
        fundingOrganization: "Alberta Innovates",
        createdAt: new Date().toISOString()
      }
    ];

    // Add grants to storage
    grantsData.forEach(grantData => {
      const id = this.grantIdCounter++;
      // Ensure all required fields are present with default values if needed
      const completeGrantData = {
        ...grantData,
        industry: grantData.industry || null,
        province: grantData.province || null,
        competitionLevel: grantData.competitionLevel || "Medium",
        eligibilityCriteria: grantData.eligibilityCriteria || [],
        pros: grantData.pros || [],
        cons: grantData.cons || [],
        featured: grantData.featured !== undefined ? grantData.featured : false,
        // New fields with defaults
        fundingOrganization: grantData.fundingOrganization || null,
        applicationProcess: grantData.applicationProcess || [],
        documents: grantData.documents || [],
        contactEmail: grantData.contactEmail || null,
        contactPhone: grantData.contactPhone || null
      };
      const grant: Grant = { ...completeGrantData, id };
      this.grants.set(id, grant);
    });
  }
}

export const storage = new MemStorage();
