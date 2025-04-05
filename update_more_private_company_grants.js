// Script to update images for additional private company grants

import fetch from 'node-fetch';

// Map of company names to image URLs
const companyImageMap = {
  'BMO': 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=500&h=280&q=80', // Bank/finance image
  'SunLife': 'https://images.unsplash.com/photo-1579621970590-9d624316904b?auto=format&fit=crop&w=500&h=280&q=80', // Insurance/finance planning
  'Telus': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&h=280&q=80', // Telecommunications
  'Walmart': 'https://images.unsplash.com/photo-1605217613423-0eed533c252b?auto=format&fit=crop&w=500&h=280&q=80', // Retail store
  'Microsoft': 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=500&h=280&q=80', // Tech office/workspace
  'Best Buy': 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=500&h=280&q=80', // Electronics
  'Mastercard': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500&h=280&q=80', // Payment/finance
  'Aviva': 'https://images.unsplash.com/photo-1494599948593-3dafe8338d71?auto=format&fit=crop&w=500&h=280&q=80'  // Insurance/protection
};

// Function to update grant image by company name
async function updateGrantImageByCompany(companyName, imageUrl) {
  try {
    // First, get all grants
    const grantsResponse = await fetch('http://localhost:5000/api/grants/type/private');
    const grants = await grantsResponse.json();
    
    // Find the grant by company name in title, organization or fundingOrganization fields
    const grantsToUpdate = grants.filter(grant => 
      grant.title.includes(companyName) || 
      (grant.fundingOrganization && grant.fundingOrganization.includes(companyName)) ||
      (grant.organization && grant.organization.includes(companyName))
    );
    
    if (grantsToUpdate.length === 0) {
      console.log(`No grants found for ${companyName}`);
      return;
    }
    
    // Update each matching grant
    for (const grant of grantsToUpdate) {
      const response = await fetch('http://localhost:5000/api/admin/grants/update-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: grant.id,
          imageUrl: imageUrl
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update image for ${companyName} grant ID ${grant.id}: ${response.statusText}`);
      }
      
      console.log(`Updated image for ${companyName} grant ID ${grant.id} - "${grant.title}"`);
    }
  } catch (error) {
    console.error(`Error updating ${companyName} grant image:`, error);
  }
}

// Main function to update all company grant images
async function updateCompanyGrantImages() {
  console.log('Starting to update company grant images...');
  
  for (const [company, imageUrl] of Object.entries(companyImageMap)) {
    console.log(`Updating images for ${company} grants...`);
    await updateGrantImageByCompany(company, imageUrl);
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('All company grant images updated!');
}

// Run the function
updateCompanyGrantImages().catch(console.error);