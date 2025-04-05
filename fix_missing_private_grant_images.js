// Script to ensure all private grants have proper images

import fetch from 'node-fetch';

// High-quality, relevant images for private grants
const privateGrantImages = [
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=500&h=280&q=80', // Business meeting
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&h=280&q=80', // Corporate office
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&h=280&q=80', // Business handshake
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=500&h=280&q=80', // Business analysis
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=500&h=280&q=80', // Corporate building
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=500&h=280&q=80', // Corporate headquarter
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&h=280&q=80', // Business team
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&h=280&q=80', // Business professional
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&h=280&q=80', // Modern workspace
  'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=500&h=280&q=80', // Women in business
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&h=280&q=80', // Business meeting room
  'https://images.unsplash.com/photo-1573496359142-b8475f639467?auto=format&fit=crop&w=500&h=280&q=80', // Corporate financial
  'https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=500&h=280&q=80', // Business growth
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&h=280&q=80', // Digital communications
  'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=500&h=280&q=80', // Technology innovation
  'https://images.unsplash.com/photo-1605143185669-65a422e5f5f5?auto=format&fit=crop&w=500&h=280&q=80', // Professional discussions
  'https://images.unsplash.com/photo-1536743939714-23ec5ac2dbae?auto=format&fit=crop&w=500&h=280&q=80', // Corporate networking
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&h=280&q=80', // Business innovation
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=500&h=280&q=80', // Digital strategy
  'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=500&h=280&q=80', // Corporate leadership
];

// Company-specific image dictionary for targeted updates
const companySpecificImages = {
  'RBC': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&h=280&q=80', // Banking/finance
  'CIBC': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=500&h=280&q=80', // Banking/finance
  'MasterCard': 'https://images.unsplash.com/photo-1580508174046-170816f65662?auto=format&fit=crop&w=500&h=280&q=80', // Credit/payments
  'Sun Life': 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=500&h=280&q=80', // Insurance
  'Telus': 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=500&h=280&q=80', // Telecommunications
  'Manulife': 'https://images.unsplash.com/photo-1590283603385-c1c9cfd24fd1?auto=format&fit=crop&w=500&h=280&q=80', // Insurance/financial
  'Bell': 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=500&h=280&q=80', // Telecommunications
  'Shopify': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500&h=280&q=80', // E-commerce
  'TD Bank': 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=500&h=280&q=80', // Banking/finance
  'IBM': 'https://images.unsplash.com/photo-1496096265110-f83ad7f96608?auto=format&fit=crop&w=500&h=280&q=80', // Technology
  'Google': 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=500&h=280&q=80', // Technology
  'Walmart': 'https://images.unsplash.com/photo-1605217613423-0eed533c252b?auto=format&fit=crop&w=500&h=280&q=80', // Retail
  'Sobeys': 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&h=280&q=80', // Grocery retail
  'Loblaws': 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=500&h=280&q=80', // Grocery retail
  'Shell': 'https://images.unsplash.com/photo-1603063949452-234854028328?auto=format&fit=crop&w=500&h=280&q=80', // Energy
  'BMO': 'https://images.unsplash.com/photo-1526304760382-3591d3840148?auto=format&fit=crop&w=500&h=280&q=80', // Banking
  'Best Buy': 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=500&h=280&q=80', // Electronics retail
  'Microsoft': 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?auto=format&fit=crop&w=500&h=280&q=80', // Technology
  'Aviva': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&h=280&q=80', // Insurance
  'Canadian Tire': 'https://images.unsplash.com/photo-1581245277873-be0e693bb2ef?auto=format&fit=crop&w=500&h=280&q=80', // Retail
  'Home Depot': 'https://images.unsplash.com/photo-1610989636656-995429cf0a7d?auto=format&fit=crop&w=500&h=280&q=80', // Home improvement
  'Rogers': 'https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b?auto=format&fit=crop&w=500&h=280&q=80', // Telecommunications
};

// Function to get all private grants
async function getPrivateGrants() {
  try {
    const response = await fetch('http://localhost:5000/api/grants/type/private');
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching private grants:', error);
    throw error;
  }
}

// Function to update grant image
async function updateGrantImage(id, imageUrl) {
  try {
    const response = await fetch('http://localhost:5000/api/admin/grants/update-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        imageUrl: imageUrl
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update image for grant ID ${id}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating grant image for ID ${id}:`, error);
    throw error;
  }
}

// Function to get a company-specific image or a random private grant image
function getImageForGrant(grant) {
  // Try to find a company match in the title, organization or fundingOrganization
  for (const [company, imageUrl] of Object.entries(companySpecificImages)) {
    if (
      (grant.title && grant.title.includes(company)) ||
      (grant.organization && grant.organization.includes(company)) ||
      (grant.fundingOrganization && grant.fundingOrganization.includes(company))
    ) {
      return imageUrl;
    }
  }
  
  // If no company match found, return a random image from the private grant images
  const randomIndex = Math.floor(Math.random() * privateGrantImages.length);
  return privateGrantImages[randomIndex];
}

// Main function to fix missing images in private grants
async function fixMissingPrivateGrantImages() {
  try {
    console.log('Fetching all private grants...');
    const privateGrants = await getPrivateGrants();
    console.log(`Retrieved ${privateGrants.length} private grants.`);
    
    let missingImagesCount = 0;
    let updatedCount = 0;
    
    // Check each private grant for missing or default images
    for (const grant of privateGrants) {
      if (!grant.imageUrl || grant.imageUrl === '' || grant.imageUrl.includes('defaultgrantimage')) {
        missingImagesCount++;
        console.log(`Grant ID ${grant.id} (${grant.title}) is missing an image.`);
        
        // Get a company-specific or random image
        const newImageUrl = getImageForGrant(grant);
        
        console.log(`Adding image to grant ID ${grant.id} (${grant.title}).`);
        await updateGrantImage(grant.id, newImageUrl);
        updatedCount++;
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    console.log(`Found ${missingImagesCount} private grants with missing images.`);
    console.log(`Updated ${updatedCount} private grants with new images.`);
    
    // Now do a second pass to ensure each private grant has a company-specific image when possible
    console.log('\nPerforming a second pass to optimize company-specific images...');
    let optimizedCount = 0;
    
    for (const grant of privateGrants) {
      let shouldUpdate = false;
      let newImageUrl = '';
      
      // Check if this grant should have a company-specific image
      for (const [company, imageUrl] of Object.entries(companySpecificImages)) {
        if (
          (grant.title && grant.title.includes(company)) ||
          (grant.organization && grant.organization.includes(company)) ||
          (grant.fundingOrganization && grant.fundingOrganization.includes(company))
        ) {
          // Only update if it doesn't already have this company-specific image
          if (grant.imageUrl !== imageUrl) {
            shouldUpdate = true;
            newImageUrl = imageUrl;
            break;
          }
        }
      }
      
      if (shouldUpdate) {
        console.log(`Optimizing image for ${grant.title} (ID: ${grant.id}).`);
        await updateGrantImage(grant.id, newImageUrl);
        optimizedCount++;
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    console.log(`Optimized ${optimizedCount} private grants with company-specific images.`);
    console.log('All private grants now have appropriate images!');
    
  } catch (error) {
    console.error('Error in fixMissingPrivateGrantImages:', error);
  }
}

// Run the function
fixMissingPrivateGrantImages().catch(console.error);