// Script to fix images for specific company grants (Manulife, Walmart, Canadian Tire, Home Depot, Shell, Scotiabank, Telus)

import fetch from 'node-fetch';

// Company-specific image maps with multiple options
const companyImageMap = {
  'Manulife': [
    'https://images.unsplash.com/photo-1590283603385-c1c9cfd24fd1?auto=format&fit=crop&w=500&h=280&q=80', // Insurance office
    'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=500&h=280&q=80', // Financial planning
    'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=500&h=280&q=80'  // Life insurance
  ],
  'Walmart': [
    'https://images.unsplash.com/photo-1605217613423-0eed533c252b?auto=format&fit=crop&w=500&h=280&q=80', // Retail store
    'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=500&h=280&q=80', // Shopping cart
    'https://images.unsplash.com/photo-1582845512747-e42001c95638?auto=format&fit=crop&w=500&h=280&q=80'  // Retail shelves
  ],
  'Canadian Tire': [
    'https://images.unsplash.com/photo-1581245277873-be0e693bb2ef?auto=format&fit=crop&w=500&h=280&q=80', // Hardware retail
    'https://images.unsplash.com/photo-1583876587914-644ab424789a?auto=format&fit=crop&w=500&h=280&q=80', // Home improvement
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&h=280&q=80'  // Tools
  ],
  'Home Depot': [
    'https://images.unsplash.com/photo-1616486701797-0f33f61038ec?auto=format&fit=crop&w=500&h=280&q=80', // Home improvement store
    'https://images.unsplash.com/photo-1581784368651-8898d1bbdeed?auto=format&fit=crop&w=500&h=280&q=80', // Hardware tools
    'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=500&h=280&q=80'  // Construction supplies
  ],
  'Shell': [
    'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=500&h=280&q=80', // Gas station
    'https://images.unsplash.com/photo-1579031154553-59f8cfeccc3b?auto=format&fit=crop&w=500&h=280&q=80', // Energy industry
    'https://images.unsplash.com/photo-1545231027-637d2f6210f8?auto=format&fit=crop&w=500&h=280&q=80'  // Oil rig
  ],
  'Scotiabank': [
    'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=500&h=280&q=80', // Banking
    'https://images.unsplash.com/photo-1589666564459-93cdd3ab856a?auto=format&fit=crop&w=500&h=280&q=80', // Finance
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=500&h=280&q=80'  // Business finance
  ],
  'Telus': [
    'https://images.unsplash.com/photo-1505739818593-1c3d5b1c1acd?auto=format&fit=crop&w=500&h=280&q=80', // Telecommunications
    'https://images.unsplash.com/photo-1563770557364-bdf728471fca?auto=format&fit=crop&w=500&h=280&q=80', // Technology
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=500&h=280&q=80'  // Communication
  ]
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

// Main function to fix images for specific company grants
async function fixSpecificCompanyImages() {
  try {
    console.log('Fetching all private grants...');
    const privateGrants = await getPrivateGrants();
    console.log(`Retrieved ${privateGrants.length} private grants.`);
    
    let updatedCount = 0;
    const companies = Object.keys(companyImageMap);
    
    // Process each company
    for (const company of companies) {
      console.log(`\nChecking grants for ${company}...`);
      const companyGrants = privateGrants.filter(grant => 
        (grant.title && grant.title.includes(company)) || 
        (grant.organization && grant.organization.includes(company)) ||
        (grant.fundingOrganization && grant.fundingOrganization.includes(company))
      );
      
      console.log(`Found ${companyGrants.length} grants for ${company}.`);
      
      // Process each grant for this company
      for (let i = 0; i < companyGrants.length; i++) {
        const grant = companyGrants[i];
        // Pick a different image for each grant of the same company
        const imageIndex = i % companyImageMap[company].length;
        const newImageUrl = companyImageMap[company][imageIndex];
        
        console.log(`Updating image for grant ID ${grant.id}: ${grant.title}`);
        await updateGrantImage(grant.id, newImageUrl);
        updatedCount++;
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    console.log(`\nCompleted! Updated ${updatedCount} company-specific grants with appropriate images.`);
    
  } catch (error) {
    console.error('Error in fixSpecificCompanyImages:', error);
  }
}

// Run the function
fixSpecificCompanyImages().catch(console.error);