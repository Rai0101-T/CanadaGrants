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
    console.log('Starting Alberta Innovates scraper with enhanced extraction...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Scrape both the main funding page and the programs page
    const fundingUrls = [
      'https://albertainnovates.ca/funding/',
      'https://albertainnovates.ca/programs/'
    ];
    
    for (const fundingUrl of fundingUrls) {
      console.log(`Scraping Alberta Innovates URL: ${fundingUrl}`);
      
      // Navigate to Alberta Innovates funding/programs page
      await page.goto(fundingUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });
      
      // Wait for items to load - handle different page structures
      try {
        await Promise.race([
          page.waitForSelector('.funding-item', { timeout: 15000 }),
          page.waitForSelector('.program-item', { timeout: 15000 }),
          page.waitForSelector('.post-card', { timeout: 15000 }),
          page.waitForSelector('.card', { timeout: 15000 })
        ]);
      } catch (err) {
        console.warn(`No expected selectors found on ${fundingUrl}, trying to continue anyway`);
      }
      
      // Check if there's pagination on the page
      const hasPagination = await page.evaluate(() => {
        return !!document.querySelector('.pagination') || 
               !!document.querySelector('.nav-links') ||
               !!document.querySelector('.page-numbers');
      });
      
      console.log(`Alberta Innovates pagination detected on ${fundingUrl}: ${hasPagination}`);
      
      // If there's pagination, determine the total number of pages
      let totalPages = 1;
      if (hasPagination) {
        totalPages = await page.evaluate(() => {
          const paginationItems = document.querySelectorAll('.pagination .page-numbers, .nav-links .page-numbers, .page-numbers');
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
      
      console.log(`Alberta Innovates total pages to scrape on ${fundingUrl}: ${totalPages}`);
      
      // Process each page
      for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        console.log(`Processing Alberta Innovates page ${currentPage} of ${totalPages} on ${fundingUrl}`);
        
        // Navigate to the current page (first page is already loaded)
        if (currentPage > 1) {
          const pageUrl = fundingUrl.endsWith('/') 
            ? `${fundingUrl}page/${currentPage}/` 
            : `${fundingUrl}/page/${currentPage}/`;
            
          await page.goto(pageUrl, {
            waitUntil: 'networkidle2',
            timeout: 60000
          });
          
          // Wait for items to load - handle different page structures
          try {
            await Promise.race([
              page.waitForSelector('.funding-item', { timeout: 15000 }),
              page.waitForSelector('.program-item', { timeout: 15000 }),
              page.waitForSelector('.post-card', { timeout: 15000 }),
              page.waitForSelector('.card', { timeout: 15000 })
            ]);
          } catch (err) {
            console.warn(`No expected selectors found on page ${currentPage}, trying to continue anyway`);
          }
        }
        
        // Extract all grant detail links from the current page - handle multiple potential selectors
        const detailLinks = await page.evaluate(() => {
          const links: string[] = [];
          // Try different selectors for different page structures
          const selectors = [
            '.funding-item a', 
            '.program-item a', 
            '.post-card a',
            '.card a', 
            '.entry-content a',
            'article a'
          ];
          
          selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(link => {
              const href = link.getAttribute('href');
              if (href && href.includes('albertainnovates.ca') && !href.includes('#')) {
                links.push(href);
              }
            });
          });
          
          return [...new Set(links)]; // Remove duplicates
        });
        
        console.log(`Found ${detailLinks.length} grant links on page ${currentPage} of ${fundingUrl}`);
        
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
              // Get the title - try various heading elements
              const title = document.querySelector('h1')?.textContent?.trim() || 
                           document.querySelector('h2')?.textContent?.trim() || 
                           document.querySelector('.entry-title')?.textContent?.trim() || 
                           document.querySelector('.page-title')?.textContent?.trim() || 
                           document.querySelector('.post-title')?.textContent?.trim() || 
                           'Alberta Innovates Funding Program';
              
              // Gather description from content - try multiple potential content containers
              let description = '';
              const contentSelectors = [
                '.entry-content p', 
                '.content-area p', 
                '.program-description p',
                '.post-content p',
                'article p',
                '.entry p',
                '.card-text'
              ];
              
              contentSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach((p) => {
                  if (p.textContent) {
                    description += p.textContent.trim() + ' ';
                  }
                });
              });
              
              // If we still don't have a description, try to get any paragraph
              if (!description) {
                document.querySelectorAll('p').forEach((p) => {
                  description += p.textContent?.trim() + ' ';
                });
              }
              
              description = description.trim();
              if (description.length > 500) {
                description = description.substring(0, 500) + '...';
              }
              
              // Get the main content text for pattern matching
              const contentText = document.body.textContent || '';
              
              // Look for funding amount with expanded patterns
              let fundingAmount = 'Varies by program';
              
              const fundingPatterns = [
                /funding:?\s*([$€£C]?\s?[\d,.]+[KkMm]?(?:\s*-\s*[$€£C]?\s?[\d,.]+[KkMm]?)?)/i,
                /amount:?\s*([$€£C]?\s?[\d,.]+[KkMm]?(?:\s*-\s*[$€£C]?\s?[\d,.]+[KkMm]?)?)/i,
                /grant:?\s*([$€£C]?\s?[\d,.]+[KkMm]?(?:\s*-\s*[$€£C]?\s?[\d,.]+[KkMm]?)?)/i,
                /up to:?\s*([$€£C]?\s?[\d,.]+[KkMm]?)/i,
                /provides\s*([$€£C]?\s?[\d,.]+[KkMm]?)/i,
                /awarded\s*([$€£C]?\s?[\d,.]+[KkMm]?)/i,
                /([$€£C]?\s?[\d,.]+[KkMm]?(?:\s*-\s*[$€£C]?\s?[\d,.]+[KkMm]?)?)\s*in funding/i
              ];
              
              for (const pattern of fundingPatterns) {
                const match = contentText.match(pattern);
                if (match && match[1]) {
                  fundingAmount = match[1].trim();
                  break;
                }
              }
              
              // Look for eligibility information with expanded patterns
              let eligibility = 'Alberta-based businesses and researchers';
              const eligibilityPatterns = [
                /eligibility criteria:?\s*([^.]+\.)/i,
                /eligibility:?\s*([^.]+\.)/i,
                /eligible:?\s*([^.]+\.)/i,
                /who can apply:?\s*([^.]+\.)/i,
                /who is eligible:?\s*([^.]+\.)/i,
                /available to:?\s*([^.]+\.)/i,
                /applicants must:?\s*([^.]+\.)/i
              ];
              
              for (const pattern of eligibilityPatterns) {
                const match = contentText.match(pattern);
                if (match && match[1]) {
                  eligibility = match[1].trim();
                  break;
                }
              }
              
              // Also check for eligibility in list items
              if (eligibility === 'Alberta-based businesses and researchers') {
                const eligibilitySection = Array.from(document.querySelectorAll('h2, h3, h4')).find(
                  h => h.textContent?.toLowerCase().includes('eligibility') || 
                      h.textContent?.toLowerCase().includes('who can apply')
                );
                
                if (eligibilitySection) {
                  let nextEl = eligibilitySection.nextElementSibling;
                  let eli = '';
                  
                  // Gather content from the next few elements after the heading
                  for (let i = 0; i < 5 && nextEl; i++, nextEl = nextEl.nextElementSibling) {
                    if (nextEl.tagName === 'UL' || nextEl.tagName === 'OL') {
                      const items = Array.from(nextEl.querySelectorAll('li')).map(li => li.textContent?.trim());
                      eli = items.join('. ');
                      break;
                    } else if (nextEl.tagName === 'P') {
                      eli = nextEl.textContent?.trim() || '';
                      break;
                    }
                  }
                  
                  if (eli) {
                    eligibility = eli;
                  }
                }
              }
              
              // Look for deadline information with expanded patterns
              let deadline = 'Check website for current deadlines';
              const deadlinePatterns = [
                /deadline:?\s*([^.]+\d{1,2}[,\s]+\d{4})/i,
                /deadline:?\s*([^.]+\d{4})/i,
                /closes:?\s*([^.]+\d{4})/i,
                /closing date:?\s*([^.]+\d{4})/i,
                /applications due:?\s*([^.]+\d{4})/i,
                /applications close:?\s*([^.]+\d{4})/i,
                /submission deadline:?\s*([^.]+\d{4})/i,
                /apply by:?\s*([^.]+\d{4})/i
              ];
              
              for (const pattern of deadlinePatterns) {
                const match = contentText.match(pattern);
                if (match && match[1]) {
                  deadline = match[1].trim();
                  break;
                }
              }
              
              // Also check for "continuous intake" or "ongoing" deadlines
              if (contentText.toLowerCase().includes('continuous intake') || 
                  contentText.toLowerCase().includes('rolling deadline') ||
                  contentText.toLowerCase().includes('no deadline') ||
                  contentText.toLowerCase().includes('ongoing program')) {
                deadline = 'Continuous intake / No deadline';
              }
              
              // Determine industry focus with expanded keywords
              let industry = 'Innovation & Technology';
              
              // Look for industry keywords in the content
              const industryKeywords = {
                'Health & Life Sciences': ['health', 'medical', 'medicine', 'healthcare', 'pharma', 'life sciences', 'clinical', 'biomedical'],
                'Clean Energy': ['energy', 'oil', 'gas', 'renewable', 'solar', 'wind', 'clean energy', 'sustainable energy'],
                'Agriculture & Food': ['agriculture', 'farm', 'food', 'agtech', 'crop', 'farming', 'agricultural'],
                'Clean Technology': ['clean tech', 'cleantech', 'environmental', 'green', 'sustainability', 'climate'],
                'Manufacturing': ['manufacturing', 'production', 'factory', 'industry', 'industrial'],
                'Biotechnology': ['bio', 'biotech', 'biotechnology', 'life science', 'biological'],
                'Digital Technology': ['digital', 'software', 'AI', 'artificial intelligence', 'machine learning', 'tech', 'data', 'information technology'],
                'Research & Development': ['research', 'R&D', 'development', 'innovation', 'discovery', 'laboratory'],
                'Education & Training': ['education', 'academic', 'university', 'school', 'training', 'learning', 'skill development']
              };
              
              // Calculate which industry has the most keyword matches
              const industryCounts: {[key: string]: number} = {};
              for (const [industryName, keywords] of Object.entries(industryKeywords)) {
                industryCounts[industryName] = 0;
                for (const keyword of keywords) {
                  // Count occurrences of each keyword
                  const regex = new RegExp(keyword, 'gi');
                  const matches = contentText.match(regex);
                  if (matches) {
                    industryCounts[industryName] += matches.length;
                  }
                }
              }
              
              // Find the industry with the most matches
              let maxCount = 0;
              for (const [industryName, count] of Object.entries(industryCounts)) {
                if (count > maxCount) {
                  maxCount = count;
                  industry = industryName;
                }
              }
              
              // Get the application URL - either the current page or a specific apply button
              let applicationUrl = window.location.href;
              const applyButton = 
                Array.from(document.querySelectorAll('a')).find(a => 
                  a.textContent?.toLowerCase().includes('apply') || 
                  a.textContent?.toLowerCase().includes('submit') ||
                  a.textContent?.toLowerCase().includes('application')
                );
              
              if (applyButton && applyButton.href) {
                applicationUrl = applyButton.href;
              }
              
              return {
                title,
                description,
                fundingAmount,
                eligibility,
                deadline,
                industry,
                applicationUrl,
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
              sourceUrl: detailUrl,
              sourceWebsite: 'Alberta Innovates',
              type: 'provincial',
              industry: grantDetail.industry,
              province: 'Alberta'
            };
            
            // Add the grant if it has required fields
            if (grant.title && grant.description && !grant.title.includes('Page not found')) {
              console.log(`Added grant: ${grant.title}`);
              grants.push(grant);
            }
            
          } catch (err) {
            console.error(`Error processing detail page ${detailUrl}:`, err);
          }
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