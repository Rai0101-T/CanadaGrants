// Script to verify all grant images are present

import fetch from 'node-fetch';

// Function to get grants by type
async function getGrantsByType(type) {
  try {
    const response = await fetch(`http://localhost:5000/api/grants/type/${type}`);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type} grants:`, error);
    throw error;
  }
}

// Main function to verify all grant images
async function verifyAllGrantImages() {
  try {
    // Get grants by type
    console.log('Fetching all grants...');
    const federalGrants = await getGrantsByType('federal');
    const provincialGrants = await getGrantsByType('provincial');
    const privateGrants = await getGrantsByType('private');
    
    console.log(`Retrieved ${federalGrants.length} federal grants.`);
    console.log(`Retrieved ${provincialGrants.length} provincial grants.`);
    console.log(`Retrieved ${privateGrants.length} private grants.`);
    
    const allGrants = [...federalGrants, ...provincialGrants, ...privateGrants];
    console.log(`Total grants: ${allGrants.length}`);
    
    // Check for missing images
    const grantsWithoutImages = allGrants.filter(grant => !grant.imageUrl);
    const grantsWithEmptyImages = allGrants.filter(grant => grant.imageUrl === '');
    
    if (grantsWithoutImages.length === 0 && grantsWithEmptyImages.length === 0) {
      console.log('\nAll grants have images! 🎉');
    } else {
      console.log(`\nFound ${grantsWithoutImages.length + grantsWithEmptyImages.length} grants without proper images:`);
      
      [...grantsWithoutImages, ...grantsWithEmptyImages].forEach(grant => {
        console.log(`- Grant ID ${grant.id}: ${grant.title} (Type: ${grant.type})`);
      });
    }
    
    // Check private grants specifically
    console.log('\nChecking private grants...');
    const privateGrantsWithoutImages = privateGrants.filter(grant => !grant.imageUrl || grant.imageUrl === '');
    
    if (privateGrantsWithoutImages.length === 0) {
      console.log('All private grants have images! 🎉');
    } else {
      console.log(`Found ${privateGrantsWithoutImages.length} private grants without images:`);
      
      privateGrantsWithoutImages.forEach(grant => {
        console.log(`- Grant ID ${grant.id}: ${grant.title}`);
      });
    }
    
    // Check for common company names in private grants
    const companyNames = [
      'Manulife', 'Walmart', 'Canadian Tire', 'Home Depot', 
      'Shell', 'Scotiabank', 'Telus', 'BMO', 'TD', 'RBC',
      'CIBC', 'Rogers', 'Bell', 'Google', 'Microsoft', 'Best Buy',
      'Sobeys', 'Aviva', 'MasterCard'
    ];
    
    console.log('\nChecking for major company grants...');
    
    companyNames.forEach(company => {
      const companyGrants = privateGrants.filter(grant => 
        (grant.title && grant.title.includes(company)) || 
        (grant.organization && grant.organization.includes(company)) ||
        (grant.fundingOrganization && grant.fundingOrganization.includes(company))
      );
      
      if (companyGrants.length > 0) {
        const missingImages = companyGrants.filter(grant => !grant.imageUrl || grant.imageUrl === '');
        
        console.log(`${company}: ${companyGrants.length} grants found, ${missingImages.length} without images`);
        
        if (missingImages.length > 0) {
          missingImages.forEach(grant => {
            console.log(`  - Grant ID ${grant.id}: ${grant.title}`);
          });
        }
      }
    });
    
  } catch (error) {
    console.error('Error in verifyAllGrantImages:', error);
  }
}

// Run the function
verifyAllGrantImages().catch(console.error);