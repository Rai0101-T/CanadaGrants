// Script to check grants that might need image updates

import fetch from 'node-fetch';

// List of specific grants we want to check from the document
const targetGrants = [
  "Canada Small Business Financing Program", 
  "CSBFP",
  "Business Development Bank of Canada", 
  "BDC",
  "Industrial Research Assistance Program",
  "IRAP",
  "CanExport",
  "Futurpreneur",
  "Women Entrepreneurship Strategy",
  "WES",
  "Strategic Innovation Fund",
  "Sustainable Development Technology Canada",
  "SDTC",
  "Canada Digital Adoption Program",
  "Aboriginal Business and Entrepreneurship Development",
  "Indigenous Skills and Employment",
  "Creative Destruction Lab",
  "BC Launch Online",
  "Ontario Together Fund",
  "Alberta Innovates",
  "Small Business Enterprise Centres"
];

// Function to fetch all grants
async function getAllGrants() {
  try {
    const response = await fetch('http://localhost:5000/api/grants');
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching grants:', error);
    throw error;
  }
}

// Main function to check which grants might need updates
async function checkGrantImages() {
  try {
    // Get all grants
    const allGrants = await getAllGrants();
    console.log(`Total grants: ${allGrants.length}`);
    
    // Map of image counts to detect generic or duplicate images
    const imageCountMap = {};
    allGrants.forEach(grant => {
      if (grant.imageUrl) {
        imageCountMap[grant.imageUrl] = (imageCountMap[grant.imageUrl] || 0) + 1;
      }
    });
    
    // Get grants that might match our target list
    const potentialGrants = allGrants.filter(grant => {
      // Check if grant title contains any of our target keywords
      return targetGrants.some(keyword => 
        grant.title.toLowerCase().includes(keyword.toLowerCase()) ||
        (grant.description && grant.description.toLowerCase().includes(keyword.toLowerCase()))
      );
    });
    
    console.log(`Found ${potentialGrants.length} grants matching our target keywords`);
    
    // Report on grants that need attention
    console.log("\nGrants that might need image updates:");
    
    potentialGrants.forEach(grant => {
      const imageCount = imageCountMap[grant.imageUrl] || 0;
      const needsAttention = imageCount > 3; // If image is used by more than 3 grants, it might be generic
      
      if (needsAttention) {
        console.log(`Grant #${grant.id}: ${grant.title}`);
        console.log(`  - Current image: ${grant.imageUrl}`);
        console.log(`  - This image is used by ${imageCount} grants (might be generic)`);
        console.log(`  - Keywords found: ${targetGrants.filter(keyword => 
          grant.title.toLowerCase().includes(keyword.toLowerCase()) ||
          (grant.description && grant.description.toLowerCase().includes(keyword.toLowerCase()))
        ).join(', ')}`);
        console.log();
      }
    });
    
  } catch (error) {
    console.error('Error checking grant images:', error);
    throw error;
  }
}

// Run the main function
checkGrantImages().catch(console.error);