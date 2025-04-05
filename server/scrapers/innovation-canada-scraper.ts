import puppeteer from 'puppeteer';
import { InsertGrant, grants } from '@shared/schema';
import { db } from '../db';

interface ScrapedGrant {
  title: string;
  description: string;
  fundingAmount: string;
  eligibility: string;
  deadline: string;
  applicationUrl: string;
  sourceUrl: string;
  websiteUrl: string;
  type: 'federal' | 'provincial' | 'private';
  industry: string;
  department?: string;
  fundingOrganization?: string;
  province?: string;
}

export async function scrapeInnovationCanada(): Promise<InsertGrant[]> {
  console.log('Starting Innovation Canada scraper');
  
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to the funding section of Innovation Canada
    await page.goto('https://innovation.ised-isde.canada.ca/innovation/s/list-liste?language=en_CA&token=a0BOG000008GCmz2AG#fundingTab', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    console.log('Loaded Innovation Canada page');
    
    // Wait for the funding tab content to load
    await page.waitForSelector('.fundingProgramList', { timeout: 60000 });
    
    // Extract grant information
    const grantElements = await page.$$('.program-card');
    
    console.log(`Found ${grantElements.length} grant elements`);
    
    const scrapedGrants: ScrapedGrant[] = [];
    
    for (const grantElement of grantElements) {
      try {
        const grant = await grantElement.evaluate((el) => {
          // Extract data from the card
          const title = el.querySelector('.program-title')?.textContent?.trim() || '';
          const description = el.querySelector('.program-desc')?.textContent?.trim() || '';
          
          // Extract funding amount - it's often in a format like "Funding: $10,000 - $50,000"
          const fundingInfo = el.querySelector('.funding-amount')?.textContent?.trim() || 'Varies';
          const fundingAmount = fundingInfo.replace('Funding:', '').trim();
          
          // Get eligibility information
          const eligibility = el.querySelector('.eligibility')?.textContent?.trim() || 'See website for details';
          
          // Get deadline information
          const deadlineInfo = el.querySelector('.program-deadline')?.textContent?.trim() || 'Ongoing';
          const deadline = deadlineInfo.replace('Deadline:', '').trim();
          
          // Get department and link
          const department = el.querySelector('.program-provider')?.textContent?.trim() || '';
          const applicationUrl = el.querySelector('a.program-link')?.getAttribute('href') || '';
          
          // Determine the industry based on tags
          const tags = Array.from(el.querySelectorAll('.program-tag')).map(tag => tag.textContent?.trim() || '');
          const industry = tags.join(', ');
          
          return {
            title,
            description,
            fundingAmount,
            eligibility,
            deadline,
            department,
            applicationUrl,
            industry
          };
        });
        
        // Classify the grant by type (federal, provincial, private)
        // Innovation Canada lists primarily federal grants
        const grantType = determineGrantType(grant.department);
        
        const scrapedGrant: ScrapedGrant = {
          title: grant.title,
          description: grant.description,
          fundingAmount: grant.fundingAmount,
          eligibility: grant.eligibility,
          deadline: grant.deadline || 'See website for details',
          applicationUrl: grant.applicationUrl,
          sourceUrl: 'https://innovation.ised-isde.canada.ca/innovation/s/list-liste?language=en_CA',
          websiteUrl: grant.applicationUrl,
          department: grant.department,
          type: grantType,
          industry: grant.industry || 'Multiple',
        };
        
        // Check if we have enough valid data
        if (scrapedGrant.title && scrapedGrant.description) {
          scrapedGrants.push(scrapedGrant);
        }
      } catch (error) {
        console.error('Error processing a grant element:', error);
      }
    }
    
    console.log(`Successfully scraped ${scrapedGrants.length} grants from Innovation Canada`);
    
    // Convert scraped grants to database format
    const insertGrants = scrapedGrants.map(processGrantForDB);
    
    return insertGrants;
  } catch (error) {
    console.error('Error scraping Innovation Canada:', error);
    return [];
  } finally {
    await browser.close();
  }
}

function determineGrantType(department: string = ''): 'federal' | 'provincial' | 'private' {
  const dept = department.toLowerCase();
  
  // Federal departments and agencies
  const federalKeywords = [
    'canada', 'government of canada', 'federal', 
    'natural resources', 'agriculture', 'agri-food', 
    'innovation, science and economic development', 'ised',
    'canada revenue agency', 'cra', 'environment', 'climate change',
    'transport', 'infrastructure', 'finance', 'health canada',
    'national research council', 'nrc', 'defense', 'defence',
    'global affairs'
  ];
  
  // Provincial keywords
  const provincialKeywords = [
    'ontario', 'quebec', 'british columbia', 'alberta', 'manitoba', 
    'saskatchewan', 'nova scotia', 'new brunswick', 'newfoundland', 
    'pei', 'prince edward island', 'yukon', 'nunavut', 
    'northwest territories', 'provincial'
  ];
  
  // Check if it's a federal grant
  if (federalKeywords.some(keyword => dept.includes(keyword))) {
    return 'federal';
  }
  
  // Check if it's a provincial grant
  if (provincialKeywords.some(keyword => dept.includes(keyword))) {
    return 'provincial';
  }
  
  // Default to federal for Innovation Canada site as it primarily lists federal programs
  return 'federal';
}

function processGrantForDB(scrapedGrant: ScrapedGrant): InsertGrant {
  // Prepare eligibility criteria as an array
  const eligibilityCriteria = scrapedGrant.eligibility
    .split('.')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  // Create a placeholder image based on the type of grant
  let imageUrl;
  switch (scrapedGrant.type) {
    case 'federal':
      imageUrl = 'https://placehold.co/300x200/red/white?text=Federal+Grant';
      break;
    case 'provincial':
      imageUrl = 'https://placehold.co/300x200/blue/white?text=Provincial+Grant';
      break;
    case 'private':
      imageUrl = 'https://placehold.co/300x200/green/white?text=Private+Grant';
      break;
  }

  // Extract province if applicable
  let province;
  if (scrapedGrant.type === 'provincial') {
    const provinceMapping: { [key: string]: string } = {
      'ontario': 'Ontario',
      'quebec': 'Quebec',
      'british columbia': 'British Columbia',
      'alberta': 'Alberta',
      'manitoba': 'Manitoba',
      'saskatchewan': 'Saskatchewan',
      'nova scotia': 'Nova Scotia',
      'new brunswick': 'New Brunswick',
      'newfoundland': 'Newfoundland and Labrador',
      'pei': 'Prince Edward Island',
      'prince edward island': 'Prince Edward Island',
      'yukon': 'Yukon',
      'nunavut': 'Nunavut',
      'northwest territories': 'Northwest Territories'
    };
    
    for (const [key, value] of Object.entries(provinceMapping)) {
      const dept = (scrapedGrant.department || '').toLowerCase();
      if (dept.includes(key)) {
        province = value;
        break;
      }
    }
  }

  // Convert industry string to an industry focus array
  const industryFocus = scrapedGrant.industry
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  // Create the insert grant object
  const insertGrant: InsertGrant = {
    title: scrapedGrant.title,
    description: scrapedGrant.description,
    type: scrapedGrant.type,
    imageUrl: imageUrl || 'https://placehold.co/300x200/gray/white?text=Grant',
    deadline: scrapedGrant.deadline,
    fundingAmount: scrapedGrant.fundingAmount,
    category: 'Business Development',
    eligibilityCriteria: eligibilityCriteria,
    pros: ['Funding for business growth'],
    cons: ['Application process may be complex'],
    websiteUrl: scrapedGrant.websiteUrl,
    featured: false,
    industry: scrapedGrant.industry || 'Multiple',
    province: province,
    competitionLevel: 'Medium',
    createdAt: new Date().toISOString(),
    fundingOrganization: scrapedGrant.fundingOrganization || scrapedGrant.department,
    applicationProcess: ['Research eligibility requirements', 'Prepare application documents', 'Submit before deadline'],
    documents: ['Business registration', 'Financial statements', 'Project proposal'],
    contactEmail: '',
    department: scrapedGrant.department,
    organization: scrapedGrant.fundingOrganization || scrapedGrant.department,
    contactPhone: '',
    whoCanApply: eligibilityCriteria,
    industryFocus: industryFocus,
    locationRestrictions: province ? `Available in ${province}` : 'Available across Canada',
    otherRequirements: [],
    applicationDates: scrapedGrant.deadline,
    applicationLink: scrapedGrant.applicationUrl,
    howToApply: ['Visit the program website for detailed application instructions'],
    reviewProcess: 'Applications are reviewed based on eligibility and merit',
    restrictions: [],
    faqQuestions: [],
    faqAnswers: []
  };

  return insertGrant;
}

export async function saveGrantsToDatabase(insertGrants: InsertGrant[]): Promise<void> {
  console.log(`Saving ${insertGrants.length} grants to database`);
  
  try {
    // Insert in batches to avoid too large queries
    const batchSize = 10;
    
    for (let i = 0; i < insertGrants.length; i += batchSize) {
      const batch = insertGrants.slice(i, i + batchSize);
      
      // Insert each grant using db.insert
      for (const grant of batch) {
        await db.insert(grants).values(grant);
      }
      
      console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(insertGrants.length / batchSize)}`);
    }
    
    console.log('All grants successfully saved to database');
  } catch (error) {
    console.error('Error saving grants to database:', error);
    throw error;
  }
}

// Function to run the scraper
export async function runInnovationCanadaScraper(): Promise<void> {
  try {
    console.log('Starting Innovation Canada scraper job');
    const scrapedGrants = await scrapeInnovationCanada();
    
    if (scrapedGrants.length > 0) {
      await saveGrantsToDatabase(scrapedGrants);
      console.log(`Successfully scraped and saved ${scrapedGrants.length} grants from Innovation Canada`);
    } else {
      console.log('No grants scraped from Innovation Canada');
    }
  } catch (error) {
    console.error('Error running Innovation Canada scraper:', error);
  }
}