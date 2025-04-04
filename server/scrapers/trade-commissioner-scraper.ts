import * as puppeteer from 'puppeteer';
import { InsertGrant } from '@shared/schema';
import { log } from '../vite';

interface ScrapedProgram {
  title: string;
  description: string;
  eligibility: string;
  deadline: string;
  fundingAmount: string;
  infoUrl: string;
  applicationUrl: string;
}

/**
 * Trade Commissioner Service Scraper
 * URL: https://www.tradecommissioner.gc.ca/funding_support_programs-programmes_de_financement_de_soutien.aspx?lang=eng
 */
export async function scrapeTradeFundingPrograms(browser: puppeteer.Browser): Promise<InsertGrant[]> {
  const grants: InsertGrant[] = [];
  
  try {
    log('Starting to scrape Trade Commissioner Service website...', 'scraper');
    
    // Navigate to the Trade Commissioner Service funding page
    const page = await browser.newPage();
    
    // Set a user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Navigate to the page
    await page.goto('https://www.tradecommissioner.gc.ca/funding_support_programs-programmes_de_financement_de_soutien.aspx?lang=eng', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    log('Page loaded successfully, extracting program information...', 'scraper');
    
    // Wait for the program list to load
    await page.waitForSelector('.cen-grd-col');
    
    // Extract program information
    const programs = await page.evaluate(() => {
      const programElements = Array.from(document.querySelectorAll('.cen-grd-col'));
      
      return programElements.map(element => {
        const titleElement = element.querySelector('h3 a');
        const title = titleElement ? titleElement.textContent?.trim() : '';
        const infoUrl = titleElement ? (titleElement as HTMLAnchorElement).href : '';
        
        const descriptionElement = element.querySelector('p');
        const description = descriptionElement ? descriptionElement.textContent?.trim() : '';
        
        // Extract other details - these may need to be refined based on the actual structure
        const detailElements = Array.from(element.querySelectorAll('ul li'));
        let eligibility = '';
        let deadline = '';
        let fundingAmount = '';
        let applicationUrl = '';
        
        detailElements.forEach(detail => {
          const text = detail.textContent?.trim().toLowerCase() || '';
          if (text.includes('eligibility') || text.includes('eligible')) {
            eligibility = text;
          } else if (text.includes('deadline') || text.includes('date')) {
            deadline = text;
          } else if (text.includes('funding') || text.includes('amount') || text.includes('$')) {
            fundingAmount = text;
          }
          
          const links = detail.querySelectorAll('a');
          links.forEach(link => {
            const linkText = link.textContent?.toLowerCase() || '';
            if (linkText.includes('apply') || linkText.includes('application')) {
              applicationUrl = (link as HTMLAnchorElement).href;
            }
          });
        });
        
        return {
          title,
          description,
          eligibility,
          deadline,
          fundingAmount,
          infoUrl,
          applicationUrl
        };
      });
    });
    
    log(`Extracted ${programs.length} programs from Trade Commissioner Service`, 'scraper');
    
    // Convert extracted programs to InsertGrant format
    for (const program of programs) {
      if (program.title && program.description) {
        const grant: InsertGrant = {
          title: program.title,
          description: program.description,
          type: 'federal',
          industry: 'Business, International Trade',
          province: 'All',
          fundingAmount: program.fundingAmount || 'Contact for details',
          deadline: program.deadline || 'Ongoing',
          websiteUrl: program.infoUrl,
          applicationLink: program.applicationUrl || program.infoUrl,
          eligibilityCriteria: program.eligibility ? [program.eligibility] : [],
          category: 'International Trade',
          createdAt: new Date().toISOString(),
          imageUrl: 'https://www.tradecommissioner.gc.ca/css/images/sig-en.svg',
          department: 'Trade Commissioner Service',
          fundingOrganization: 'Global Affairs Canada',
          contactEmail: null,
          contactPhone: null,
          locationRestrictions: null,
          documents: [],
          featured: false,
          applicationProcess: [],
          industryFocus: ['International Trade', 'Export'],
          competitionLevel: 'Medium',
          reviewProcess: null,
          restrictions: [],
          whoCanApply: [],
          otherRequirements: [],
          applicationDates: program.deadline || 'Ongoing',
          howToApply: [],
          faqQuestions: [],
          faqAnswers: []
        };
        
        grants.push(grant);
      }
    }
    
    log(`Successfully converted ${grants.length} programs to grant format`, 'scraper');
    await page.close();
    
    return grants;
  } catch (error) {
    log(`Error scraping Trade Commissioner Service: ${error}`, 'scraper');
    return [];
  }
}

/**
 * Helper function to extract additional details from a program page
 * This can be used to get more detailed information by visiting each program's page
 */
async function extractProgramDetails(browser: puppeteer.Browser, url: string): Promise<Partial<ScrapedProgram>> {
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    const details = await page.evaluate(() => {
      let eligibility = '';
      let deadline = '';
      let fundingAmount = '';
      
      // Look for specific sections on the page
      const sections = Array.from(document.querySelectorAll('h2, h3, h4'));
      
      sections.forEach(section => {
        const title = section.textContent?.toLowerCase() || '';
        if (title.includes('eligibility') || title.includes('eligible')) {
          const content = extractNextElementContent(section);
          if (content) eligibility = content;
        } else if (title.includes('deadline') || title.includes('date')) {
          const content = extractNextElementContent(section);
          if (content) deadline = content;
        } else if (title.includes('funding') || title.includes('amount') || title.includes('financial')) {
          const content = extractNextElementContent(section);
          if (content) fundingAmount = content;
        }
      });
      
      return { eligibility, deadline, fundingAmount };
    });
    
    await page.close();
    return details;
  } catch (error) {
    log(`Error extracting program details from ${url}: ${error}`, 'scraper');
    return {};
  }
}

// Helper function to be used within page.evaluate
function extractNextElementContent(element: Element): string | null {
  let currentElement = element.nextElementSibling;
  let content = '';
  
  // Look for paragraph or list elements following the heading
  while (currentElement && ['P', 'UL', 'OL', 'DIV'].includes(currentElement.tagName)) {
    content += currentElement.textContent?.trim() + ' ';
    currentElement = currentElement.nextElementSibling;
  }
  
  return content.trim() || null;
}