import { grants, users, type Grant, type InsertGrant, type User, type InsertUser, userGrants, type UserGrant, type InsertUserGrant } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Grant methods
  getAllGrants(): Promise<Grant[]>;
  getGrantById(id: number): Promise<Grant | undefined>;
  getGrantsByType(type: string): Promise<Grant[]>;
  getFeaturedGrants(): Promise<Grant[]>;
  searchGrants(query: string): Promise<Grant[]>;
  
  // User Grants methods (My List)
  getUserGrants(userId: number): Promise<Grant[]>;
  addGrantToUserList(userGrant: InsertUserGrant): Promise<UserGrant>;
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
    const userGrant: UserGrant = { ...insertUserGrant, id };
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

  // Initialize with sample grants data
  private initializeGrants() {
    const grantsData: InsertGrant[] = [
      // Federal Grants
      {
        title: "Business Development Grant",
        description: "Up to $100,000 funding for small business innovation projects.",
        type: "federal",
        imageUrl: "https://images.unsplash.com/photo-1577433218939-37da32ff896b?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Dec 31, 2023",
        fundingAmount: "$25K-100K",
        category: "Business",
        eligibilityCriteria: [
          "Canadian-owned business",
          "In operation for at least 2 years",
          "Annual revenue between $500K and $10M",
          "Fewer than 100 employees",
          "Clear growth strategy with job creation potential"
        ],
        pros: [
          "Non-repayable funding (no need to pay back)",
          "Covers up to 75% of eligible project costs",
          "Quick application process (30 days)",
          "Dedicated support officer assigned to each project",
          "Can be combined with other funding sources"
        ],
        cons: [
          "Requires detailed business plan submission",
          "Quarterly reporting requirements",
          "Highly competitive application process",
          "Restricted to specific industry sectors",
          "Must maintain operations in Canada for 5+ years"
        ],
        websiteUrl: "https://www.canada.ca/business-grants",
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        title: "Innovation Fund",
        description: "For businesses developing new technologies and processes.",
        type: "federal",
        imageUrl: "https://images.unsplash.com/photo-1611095210561-67f0832b1ca3?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Jan 15, 2024",
        fundingAmount: "$100K-1M",
        category: "Technology",
        eligibilityCriteria: [
          "Canadian-based company",
          "Innovative technological advancement",
          "Potential for market disruption",
          "Job creation potential",
          "Sustainability focus"
        ],
        pros: [
          "Large funding amounts available",
          "Multi-year support possible",
          "Access to government research facilities",
          "Intellectual property remains with recipient",
          "International partnership opportunities"
        ],
        cons: [
          "Extensive application documentation",
          "Requires matching funds from applicant",
          "Long review process (3-6 months)",
          "Strict milestone reporting",
          "Limited to specific technology sectors"
        ],
        websiteUrl: "https://www.canada.ca/innovation-fund",
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        title: "Arts and Culture Fund",
        description: "Supporting Canadian artists and cultural projects nationwide.",
        type: "federal",
        imageUrl: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Feb 1, 2024",
        fundingAmount: "$5K-75K",
        category: "Arts",
        eligibilityCriteria: [
          "Canadian artist or cultural organization",
          "Project with cultural significance",
          "Public presentation component",
          "Professional experience in the field",
          "Clear project timeline and budget"
        ],
        pros: [
          "Support for diverse cultural expressions",
          "No repayment required",
          "Networking opportunities with other artists",
          "Public exposure through government channels",
          "Additional tour funding available"
        ],
        cons: [
          "Competitive application process",
          "Project must align with current funding priorities",
          "Lengthy application form",
          "Required public reporting",
          "Limited to specific artistic disciplines in each funding cycle"
        ],
        websiteUrl: "https://www.canada.ca/arts-culture-fund",
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        title: "Scientific Research Funding",
        description: "For universities and research institutes conducting innovative studies.",
        type: "federal",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Apr 30, 2024",
        fundingAmount: "$100K-500K",
        category: "Research",
        eligibilityCriteria: [
          "Accredited research institution",
          "PhD-level principal investigator",
          "Novel research methodology",
          "Potential for scientific advancement",
          "Ethics review approval"
        ],
        pros: [
          "Substantial funding amounts",
          "Equipment purchase allowance",
          "Support for research assistants",
          "International collaboration opportunities",
          "Publication funding included"
        ],
        cons: [
          "Extremely competitive",
          "Significant preliminary data required",
          "Complex budget justification needed",
          "Stringent reporting requirements",
          "Limited overhead cost allowance"
        ],
        websiteUrl: "https://www.canada.ca/research-grants",
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        title: "Entrepreneurship Development",
        description: "Supporting new business owners and startups across Canada.",
        type: "federal",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&h=280&q=80",
        deadline: "Mar 31, 2024",
        fundingAmount: "$10K-50K",
        category: "Business",
        eligibilityCriteria: [
          "Canadian citizen or permanent resident",
          "New business (less than 2 years old)",
          "Viable business plan",
          "Innovation component",
          "Owner-operated business"
        ],
        pros: [
          "Mentorship included",
          "Networking opportunities",
          "Business skill development workshops",
          "Marketing support",
          "No previous business experience required"
        ],
        cons: [
          "Limited funding amount",
          "Required business plan updates",
          "Mandatory participation in workshops",
          "Regular progress reporting",
          "Restricted expense categories"
        ],
        websiteUrl: "https://www.canada.ca/entrepreneur-grants",
        featured: false,
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
        createdAt: new Date().toISOString()
      }
    ];

    // Add grants to storage
    grantsData.forEach(grantData => {
      const id = this.grantIdCounter++;
      const grant: Grant = { ...grantData, id };
      this.grants.set(id, grant);
    });
  }
}

export const storage = new MemStorage();
