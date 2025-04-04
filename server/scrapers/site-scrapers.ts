import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

interface ScrapedGrant {
  title: string;
  description: string;
  fundingAmount: string;
  eligibility: string;
  deadline: string;
  applicationUrl: string;
  sourceUrl: string;
  sourceWebsite: string;
  type: 'federal' | 'provincial' | 'private';
  industry: string;
  department?: string; // For federal grants
  province?: string; // For provincial grants
  organization?: string; // For private grants
}

/**
 * 1. Innovation Canada Scraper
 * URL: https://innovation.ised-isde.canada.ca/innovation/s/list-liste?language=en_CA&token=a0BOG000008GCmz2AG#fundingTab
 */
export async function scrapeInnovationCanada(browser: puppeteer.Browser): Promise<ScrapedGrant[]> {
  const grants: ScrapedGrant[] = [];
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to Innovation Canada funding programs page
    await page.goto('https://innovation.ised-isde.canada.ca/innovation/s/list-liste?language=en_CA#fundingTab', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // Wait for the funding tab to load
    await page.waitForSelector('.card-list-item', { timeout: 60000 });
    
    // Extract grant items
    const items = await page.$$('.card-list-item');
    
    for (const item of items) {
      try {
        const grant: ScrapedGrant = await item.evaluate((el) => {
          const title = el.querySelector('.card-title')?.textContent?.trim() || '';
          const description = el.querySelector('.card-description')?.textContent?.trim() || '';
          const detailsUrl = el.querySelector('a')?.href || '';
          
          // Extract department from the card
          const departmentEl = el.querySelector('.program-department');
          const department = departmentEl ? departmentEl.textContent?.trim() : '';
          
          // Try to extract funding amount - may be in various formats
          let fundingAmount = 'Contact for details';
          const cardText = el.textContent || '';
          const fundingMatch = cardText.match(/\$[\d,]+(?:\.\d+)?(?:\s*-\s*\$[\d,]+(?:\.\d+)?)?|\$[\d,]+(?:\.\d+)?[K|M]?/);
          if (fundingMatch) {
            fundingAmount = fundingMatch[0].trim();
          }
          
          return {
            title,
            description,
            fundingAmount,
            eligibility: 'See website for detailed eligibility information',
            deadline: 'Check website for current deadlines',
            applicationUrl: detailsUrl,
            sourceUrl: detailsUrl,
            sourceWebsite: 'Innovation Canada',
            type: 'federal',
            industry: 'Various',
            department
          };
        });
        
        if (grant.title) {
          grants.push(grant);
        }
      } catch (err) {
        console.error('Error extracting Innovation Canada grant:', err);
      }
    }
    
    await page.close();
  } catch (err) {
    console.error('Error scraping Innovation Canada:', err);
  }
  
  return grants;
}

/**
 * 2. Trade Commissioner Scraper
 * URL: https://www.tradecommissioner.gc.ca/funding_support_programs-programmes_de_financement_de_soutien.aspx?lang=eng
 */
export async function scrapeTradeCommissioner(browser: puppeteer.Browser): Promise<ScrapedGrant[]> {
  const grants: ScrapedGrant[] = [];
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to Trade Commissioner funding programs page
    await page.goto('https://www.tradecommissioner.gc.ca/funding_support_programs-programmes_de_financement_de_soutien.aspx?lang=eng', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // Get page content
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // Find grant sections
    $('.panel').each((i, element) => {
      try {
        const title = $(element).find('.panel-heading').text().trim();
        const details = $(element).find('.panel-body');
        
        // Extract description
        let description = '';
        details.find('p').each((j, item) => {
          description += $(item).text().trim() + ' ';
        });
        description = description.trim();
        
        // Try to find a link to apply
        let applicationUrl = '';
        details.find('a').each((j, item) => {
          const href = $(item).attr('href');
          const text = $(item).text().toLowerCase();
          if (href && (text.includes('apply') || text.includes('learn more') || text.includes('details'))) {
            applicationUrl = href.startsWith('http') ? href : `https://www.tradecommissioner.gc.ca${href}`;
          }
        });
        
        if (!applicationUrl) {
          // If no dedicated apply link found, use the first link as a fallback
          const firstLink = details.find('a').first().attr('href');
          if (firstLink) {
            applicationUrl = firstLink.startsWith('http') ? firstLink : `https://www.tradecommissioner.gc.ca${firstLink}`;
          }
        }
        
        const grant: ScrapedGrant = {
          title,
          description,
          fundingAmount: 'Contact for details',
          eligibility: 'See website for eligibility criteria',
          deadline: 'Check website for current deadlines',
          applicationUrl,
          sourceUrl: 'https://www.tradecommissioner.gc.ca/funding_support_programs-programmes_de_financement_de_soutien.aspx?lang=eng',
          sourceWebsite: 'Trade Commissioner Service',
          type: 'federal',
          industry: 'International Trade',
          department: 'Global Affairs Canada'
        };
        
        if (grant.title && grant.description) {
          grants.push(grant);
        }
      } catch (err) {
        console.error('Error extracting Trade Commissioner grant:', err);
      }
    });
    
    await page.close();
  } catch (err) {
    console.error('Error scraping Trade Commissioner:', err);
  }
  
  return grants;
}

/**
 * 3. Futurpreneur Scraper
 * URL: https://futurpreneur.ca/en/
 */
export async function scrapeFuturpreneur(browser: puppeteer.Browser): Promise<ScrapedGrant[]> {
  const grants: ScrapedGrant[] = [];
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to Futurpreneur's financing page
    await page.goto('https://futurpreneur.ca/en/financing/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // Wait for content to load
    await page.waitForSelector('.row.program-block', { timeout: 30000 });
    
    // Get program blocks
    const blocks = await page.$$('.row.program-block');
    
    for (const block of blocks) {
      try {
        const grant: ScrapedGrant = await block.evaluate((el) => {
          const title = el.querySelector('h3')?.textContent?.trim() || '';
          
          // Get description from paragraphs
          let description = '';
          el.querySelectorAll('p').forEach(p => {
            description += p.textContent?.trim() + ' ';
          });
          description = description.trim();
          
          // Try to extract funding amount
          let fundingAmount = 'Contact for details';
          const textContent = el.textContent || '';
          const fundingMatch = textContent.match(/\$[\d,]+(?:\.\d+)?(?:\s*-\s*\$[\d,]+(?:\.\d+)?)?|\$[\d,]+(?:\.\d+)?[K|M]?/);
          if (fundingMatch) {
            fundingAmount = fundingMatch[0].trim();
          }
          
          // Find the button link
          const applyLink = el.querySelector('.btn')?.getAttribute('href');
          const applicationUrl = applyLink ? `https://futurpreneur.ca${applyLink}` : 'https://futurpreneur.ca/en/financing/';
          
          return {
            title,
            description,
            fundingAmount,
            eligibility: 'Entrepreneurs aged 18-39',
            deadline: 'Ongoing',
            applicationUrl,
            sourceUrl: 'https://futurpreneur.ca/en/financing/',
            sourceWebsite: 'Futurpreneur Canada',
            type: 'private',
            industry: 'Entrepreneurship',
            organization: 'Futurpreneur Canada'
          };
        });
        
        if (grant.title) {
          grants.push(grant);
        }
      } catch (err) {
        console.error('Error extracting Futurpreneur grant:', err);
      }
    }
    
    await page.close();
  } catch (err) {
    console.error('Error scraping Futurpreneur:', err);
  }
  
  return grants;
}

/**
 * 4. Women Entrepreneurship Strategy Scraper
 * URL: https://ised-isde.canada.ca/site/women-entrepreneurship-strategy/en
 */
export async function scrapeWomenEntrepreneurship(browser: puppeteer.Browser): Promise<ScrapedGrant[]> {
  const grants: ScrapedGrant[] = [];
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to the Women Entrepreneurship Strategy page
    await page.goto('https://ised-isde.canada.ca/site/women-entrepreneurship-strategy/en', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // Get page content
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // Find program sections
    $('.panel-default').each((i, element) => {
      try {
        const panelTitle = $(element).find('.panel-title').text().trim();
        if (!panelTitle.includes('Program') && !panelTitle.includes('Fund')) {
          return; // Skip non-program panels
        }
        
        const title = panelTitle;
        const details = $(element).find('.panel-body');
        let description = details.text().trim().substring(0, 500) + '...';
        
        // Find link to program details
        let applicationUrl = '';
        details.find('a').each((i, link) => {
          const href = $(link).attr('href');
          const text = $(link).text().toLowerCase();
          if (href && (text.includes('learn more') || text.includes('details') || text.includes('apply'))) {
            applicationUrl = href.startsWith('http') ? href : `https://ised-isde.canada.ca${href}`;
          }
        });
        
        if (!applicationUrl) {
          applicationUrl = 'https://ised-isde.canada.ca/site/women-entrepreneurship-strategy/en';
        }
        
        const grant: ScrapedGrant = {
          title,
          description,
          fundingAmount: 'Varies by program',
          eligibility: 'Women-owned/led businesses',
          deadline: 'Check website for current deadlines',
          applicationUrl,
          sourceUrl: 'https://ised-isde.canada.ca/site/women-entrepreneurship-strategy/en',
          sourceWebsite: 'Women Entrepreneurship Strategy',
          type: 'federal',
          industry: 'Women Entrepreneurship',
          department: 'Innovation, Science and Economic Development Canada'
        };
        
        if (grant.title && grant.description) {
          grants.push(grant);
        }
      } catch (err) {
        console.error('Error extracting Women Entrepreneurship grant:', err);
      }
    });
    
    await page.close();
  } catch (err) {
    console.error('Error scraping Women Entrepreneurship Strategy:', err);
  }
  
  return grants;
}

/**
 * 5. Launch Online Scraper
 * URL: https://launchonline.ca/
 */
export async function scrapeLaunchOnline(browser: puppeteer.Browser): Promise<ScrapedGrant[]> {
  const grants: ScrapedGrant[] = [];
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to Launch Online
    await page.goto('https://launchonline.ca/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // Wait for page to fully load
    await page.waitForSelector('.site-content', { timeout: 30000 });
    
    // Extract the main grant information
    const grant: ScrapedGrant = await page.evaluate(() => {
      const title = document.querySelector('h1')?.textContent?.trim() || 'Launch Online Grant Program';
      
      // Gather description from multiple paragraphs
      let description = '';
      document.querySelectorAll('.site-content p').forEach((p, index) => {
        if (index < 3) { // Get first 3 paragraphs for description
          description += p.textContent?.trim() + ' ';
        }
      });
      
      // Look for funding amount in the content
      const contentText = document.querySelector('.site-content')?.textContent || '';
      let fundingAmount = 'Up to $7,500';
      const fundingMatch = contentText.match(/\$[\d,]+(?:\.\d+)?(?:\s*-\s*\$[\d,]+(?:\.\d+)?)?|\$[\d,]+(?:\.\d+)?[K|M]?/);
      if (fundingMatch) {
        fundingAmount = fundingMatch[0].trim();
      }
      
      return {
        title,
        description: description.trim() || 'Launch Online is helping businesses establish or expand their online presence to sell their products and services.',
        fundingAmount,
        eligibility: 'BC-based small and medium-sized businesses',
        deadline: 'See website for current deadlines',
        applicationUrl: 'https://launchonline.ca/apply',
        sourceUrl: 'https://launchonline.ca/',
        sourceWebsite: 'Launch Online BC',
        type: 'provincial',
        industry: 'E-commerce',
        province: 'British Columbia'
      };
    });
    
    if (grant.title) {
      grants.push(grant);
    }
    
    await page.close();
  } catch (err) {
    console.error('Error scraping Launch Online:', err);
  }
  
  return grants;
}

/**
 * 6. Alberta Innovates Scraper
 * URL: https://albertainnovates.ca/funding/
 */
export async function scrapeAlbertaInnovates(browser: puppeteer.Browser): Promise<ScrapedGrant[]> {
  const grants: ScrapedGrant[] = [];
  const processedUrls = new Set<string>(); // Track processed URLs to avoid duplicates
  
  try {
    console.log('Starting Alberta Innovates scraper with pagination support...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to Alberta Innovates funding page
    await page.goto('https://albertainnovates.ca/funding/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // Wait for funding items to load
    await page.waitForSelector('.funding-item', { timeout: 30000 });
    
    // Check if there's pagination on the page
    const hasPagination = await page.evaluate(() => {
      return !!document.querySelector('.pagination');
    });
    
    console.log(`Alberta Innovates pagination detected: ${hasPagination}`);
    
    // If there's pagination, determine the total number of pages
    let totalPages = 1;
    if (hasPagination) {
      totalPages = await page.evaluate(() => {
        const paginationItems = document.querySelectorAll('.pagination .page-numbers');
        if (!paginationItems.length) return 1;
        
        let maxPage = 1;
        paginationItems.forEach(item => {
          const pageText = item.textContent?.trim() || '';
          const pageNum = parseInt(pageText);
          if (!isNaN(pageNum) && pageNum > maxPage) {
            maxPage = pageNum;
          }
        });
        
        return maxPage;
      });
    }
    
    console.log(`Alberta Innovates total pages to scrape: ${totalPages}`);
    
    // Process each page
    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      console.log(`Processing Alberta Innovates page ${currentPage} of ${totalPages}`);
      
      // Navigate to the current page (first page is already loaded)
      if (currentPage > 1) {
        await page.goto(`https://albertainnovates.ca/funding/page/${currentPage}/`, {
          waitUntil: 'networkidle2',
          timeout: 60000
        });
        await page.waitForSelector('.funding-item', { timeout: 30000 });
      }
      
      // Extract all grant detail links from the current page
      const detailLinks = await page.evaluate(() => {
        const links: string[] = [];
        document.querySelectorAll('.funding-item a').forEach(link => {
          const href = link.getAttribute('href');
          if (href) links.push(href);
        });
        return [...new Set(links)]; // Remove duplicates
      });
      
      console.log(`Found ${detailLinks.length} grant links on page ${currentPage}`);
      
      // Get basic info from the current page
      const content = await page.content();
      const $ = cheerio.load(content);
      
      // Process each funding item on the current page
      for (let i = 0; i < detailLinks.length; i++) {
        const detailUrl = detailLinks[i];
        
        // Skip already processed URLs
        if (processedUrls.has(detailUrl)) {
          console.log(`Skipping already processed URL: ${detailUrl}`);
          continue;
        }
        
        processedUrls.add(detailUrl);
        
        try {
          // Navigate to the detail page
          await page.goto(detailUrl, {
            waitUntil: 'networkidle2',
            timeout: 60000
          });
          
          // Extract detailed grant information
          const grantDetail = await page.evaluate((sourceUrl) => {
            // Get the title
            const title = document.querySelector('h1')?.textContent?.trim() || 
                         document.querySelector('h2')?.textContent?.trim() || 
                         document.querySelector('.entry-title')?.textContent?.trim() || 
                         'Unknown Grant';
            
            // Gather description from content
            let description = '';
            document.querySelectorAll('.entry-content p, .content-area p, .entry p').forEach((p) => {
              description += p.textContent?.trim() + ' ';
            });
            description = description.trim().substring(0, 500) + (description.length > 500 ? '...' : '');
            
            // Look for funding amount in the content
            const contentText = document.body.textContent || '';
            let fundingAmount = 'Varies by program';
            
            const fundingPatterns = [
              /funding:?\s*([$€£][\d,.]+[KkMm]?(?:\s*-\s*[$€£][\d,.]+[KkMm]?)?)/i,
              /amount:?\s*([$€£][\d,.]+[KkMm]?(?:\s*-\s*[$€£][\d,.]+[KkMm]?)?)/i,
              /grant:?\s*([$€£][\d,.]+[KkMm]?(?:\s*-\s*[$€£][\d,.]+[KkMm]?)?)/i,
              /up to:?\s*([$€£][\d,.]+[KkMm]?)/i,
              /([$€£][\d,.]+[KkMm]?(?:\s*-\s*[$€£][\d,.]+[KkMm]?)?)/i
            ];
            
            for (const pattern of fundingPatterns) {
              const match = contentText.match(pattern);
              if (match && match[1]) {
                fundingAmount = match[1].trim();
                break;
              }
            }
            
            // Look for eligibility information
            let eligibility = 'Alberta-based businesses and researchers';
            const eligibilityPatterns = [
              /eligibility:?\s*([^.]+\.)/i,
              /eligible:?\s*([^.]+\.)/i,
              /who can apply:?\s*([^.]+\.)/i
            ];
            
            for (const pattern of eligibilityPatterns) {
              const match = contentText.match(pattern);
              if (match && match[1]) {
                eligibility = match[1].trim();
                break;
              }
            }
            
            // Look for deadline information
            let deadline = 'Check website for program deadlines';
            const deadlinePatterns = [
              /deadline:?\s*([^.]+\d{4})/i,
              /closes:?\s*([^.]+\d{4})/i,
              /applications due:?\s*([^.]+\d{4})/i,
              /applications close:?\s*([^.]+\d{4})/i
            ];
            
            for (const pattern of deadlinePatterns) {
              const match = contentText.match(pattern);
              if (match && match[1]) {
                deadline = match[1].trim();
                break;
              }
            }
            
            // Determine industry focus
            let industry = 'Innovation & Technology';
            
            // Look for industry keywords in the content
            const industryKeywords = {
              'Health': ['health', 'medical', 'medicine', 'healthcare', 'pharma'],
              'Energy': ['energy', 'oil', 'gas', 'renewable', 'solar', 'wind'],
              'Agriculture': ['agriculture', 'farm', 'food', 'agtech', 'crop'],
              'Clean Technology': ['clean tech', 'cleantech', 'environmental', 'green'],
              'Manufacturing': ['manufacturing', 'production', 'factory'],
              'Biotechnology': ['bio', 'biotech', 'biotechnology', 'life science'],
              'Digital Technology': ['digital', 'software', 'AI', 'artificial intelligence', 'machine learning'],
              'Research & Development': ['research', 'R&D', 'development', 'innovation'],
              'Education': ['education', 'academic', 'university', 'school', 'training']
            };
            
            for (const [industryName, keywords] of Object.entries(industryKeywords)) {
              for (const keyword of keywords) {
                if (contentText.toLowerCase().includes(keyword.toLowerCase())) {
                  industry = industryName;
                  break;
                }
              }
            }
            
            return {
              title,
              description,
              fundingAmount,
              eligibility,
              deadline,
              industry,
              applicationUrl: window.location.href,
              sourceUrl
            };
          }, detailUrl);
          
          // Create the grant object
          const grant: ScrapedGrant = {
            title: grantDetail.title,
            description: grantDetail.description,
            fundingAmount: grantDetail.fundingAmount,
            eligibility: grantDetail.eligibility,
            deadline: grantDetail.deadline,
            applicationUrl: grantDetail.applicationUrl,
            sourceUrl: 'https://albertainnovates.ca/funding/',
            sourceWebsite: 'Alberta Innovates',
            type: 'provincial',
            industry: grantDetail.industry,
            province: 'Alberta'
          };
          
          // Add the grant if it has required fields
          if (grant.title && grant.description) {
            console.log(`Added grant: ${grant.title}`);
            grants.push(grant);
          }
          
        } catch (err) {
          console.error(`Error processing detail page ${detailUrl}:`, err);
        }
      }
    }
    
    await page.close();
    console.log(`Alberta Innovates scraper finished with ${grants.length} grants`);
    
  } catch (err) {
    console.error('Error scraping Alberta Innovates:', err);
  }
  
  return grants;
}

/**
 * 7. Alberta Health Grants Scraper
 * URL: https://alberta-canada.thegrantportal.com/health-and-medical
 */
export async function scrapeAlbertaHealth(browser: puppeteer.Browser): Promise<ScrapedGrant[]> {
  const grants: ScrapedGrant[] = [];
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to Alberta Health grants portal
    await page.goto('https://alberta-canada.thegrantportal.com/health-and-medical', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // Wait for grant listings to load
    await page.waitForSelector('.grant-listing', { timeout: 30000 });
    
    // Get all grant listings
    const items = await page.$$('.grant-listing');
    
    for (const item of items) {
      try {
        const grant: ScrapedGrant = await item.evaluate((el) => {
          const title = el.querySelector('h2')?.textContent?.trim() || '';
          const description = el.querySelector('.grant-description')?.textContent?.trim() || '';
          
          // Get deadline if available
          let deadline = 'Check website for current deadlines';
          const deadlineEl = el.querySelector('.grant-deadline');
          if (deadlineEl && deadlineEl.textContent) {
            deadline = deadlineEl.textContent.replace('Deadline:', '').trim();
          }
          
          // Get the link to the program
          const linkEl = el.querySelector('a');
          const applicationUrl = linkEl ? linkEl.href : 'https://alberta-canada.thegrantportal.com/';
          
          return {
            title,
            description,
            fundingAmount: 'See grant details',
            eligibility: 'Health sector organizations in Alberta',
            deadline,
            applicationUrl,
            sourceUrl: 'https://alberta-canada.thegrantportal.com/health-and-medical',
            sourceWebsite: 'Alberta Health Grants Portal',
            type: 'provincial',
            industry: 'Healthcare',
            province: 'Alberta'
          };
        });
        
        if (grant.title) {
          grants.push(grant);
        }
      } catch (err) {
        console.error('Error extracting Alberta Health grant:', err);
      }
    }
    
    await page.close();
  } catch (err) {
    console.error('Error scraping Alberta Health Grants:', err);
  }
  
  return grants;
}

// Helper function for scrolling through pages to load more content
async function autoScroll(page: puppeteer.Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}