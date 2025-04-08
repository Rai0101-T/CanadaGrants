import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeHealthGrants() {
  console.log('Starting browser...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  console.log('Opening new page...');
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to the website...');
    await page.goto('https://alberta-canada.thegrantportal.com/health-and-medical', {
      waitUntil: 'networkidle2',
      timeout: 120000
    });
    
    console.log('Waiting for content to load...');
    await page.waitForSelector('div.list-grants', { timeout: 60000 });
    
    console.log('Scraping health grants...');
    const grants = await page.evaluate(() => {
      const grantElements = document.querySelectorAll('.list-grants .list-grants-list .list-grants-item');
      
      return Array.from(grantElements).map(el => {
        // Get title
        const titleElement = el.querySelector('.list-grants-item-title a');
        const title = titleElement ? titleElement.textContent.trim() : 'No title available';
        
        // Get link
        const link = titleElement ? titleElement.href : '';
        
        // Get description
        const description = el.querySelector('.list-grants-item-excerpt') ? 
                            el.querySelector('.list-grants-item-excerpt').textContent.trim() : 
                            'No description available';
        
        // Get deadline if available
        const deadlineElement = el.querySelector('.list-grants-item-deadline');
        const deadline = deadlineElement ? 
                        deadlineElement.textContent.replace('Deadline:', '').trim() : 
                        'Ongoing';
        
        // Get funding amount if available
        const fundingElement = el.querySelector('.list-grants-item-amount');
        const fundingAmount = fundingElement ? 
                            fundingElement.textContent.replace('Amount:', '').trim() : 
                            'Variable';
        
        return {
          title,
          link,
          description,
          deadline,
          fundingAmount
        };
      });
    });
    
    console.log(`Found ${grants.length} grants`);
    
    // For each grant in the first page, visit the detail page and extract more information
    const grantsWithDetails = [];
    for (let i = 0; i < grants.length; i++) {
      const grant = grants[i];
      console.log(`Visiting detail page for: ${grant.title}`);
      
      try {
        await page.goto(grant.link, { waitUntil: 'networkidle2', timeout: 60000 });
        await page.waitForSelector('.single-grant-right', { timeout: 30000 });
        
        const details = await page.evaluate(() => {
          // Get eligibility info
          const eligibilityElement = document.querySelector('.single-grant-right .single-grant-right-eligibility');
          const eligibility = eligibilityElement ? 
                             eligibilityElement.textContent.replace('Eligibility:', '').trim() : 
                             'See website for details';
          
          // Get application info
          const applicationElement = document.querySelector('.single-grant-right .single-grant-right-application');
          const application = applicationElement ? 
                             applicationElement.textContent.replace('Application:', '').trim() : 
                             'See website for details';
          
          // Get other fields if available
          const detailElements = document.querySelectorAll('.single-grant-right .single-grant-right-item');
          const details = {};
          
          detailElements.forEach(el => {
            const label = el.querySelector('.single-grant-right-item-label');
            const value = el.querySelector('.single-grant-right-item-value');
            
            if (label && value) {
              const labelText = label.textContent.trim().replace(':', '');
              const valueText = value.textContent.trim();
              details[labelText] = valueText;
            }
          });
          
          return {
            eligibility,
            application,
            details
          };
        });
        
        grantsWithDetails.push({
          ...grant,
          eligibility: details.eligibility,
          application: details.application,
          additionalDetails: details.details
        });
        
      } catch (error) {
        console.error(`Error scraping details for ${grant.title}:`, error.message);
        grantsWithDetails.push(grant); // Add grant without details
      }
    }
    
    console.log('Writing results to file...');
    fs.writeFileSync('./alberta_health_grants.json', JSON.stringify(grantsWithDetails, null, 2));
    console.log('Scraping completed successfully!');
    
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    console.log('Closing browser...');
    await browser.close();
  }
}

scrapeHealthGrants();