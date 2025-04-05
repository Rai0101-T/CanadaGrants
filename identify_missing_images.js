// Script to identify grants with missing proper images (showing as purple)

import fetch from 'node-fetch';

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

// Main function to identify grants with missing/improper images
async function identifyMissingImages() {
  try {
    console.log('Fetching all private grants...');
    const privateGrants = await getPrivateGrants();
    console.log(`Retrieved ${privateGrants.length} private grants.`);
    
    // Identify grants with missing proper images
    // These would be grants with no image URL or empty image URL or not containing unsplash.com
    const grantsWithoutProperImages = privateGrants.filter(grant => 
      !grant.imageUrl || 
      grant.imageUrl === '' || 
      (!grant.imageUrl.includes('unsplash.com') && !grant.imageUrl.includes('company_logos'))
    );
    
    if (grantsWithoutProperImages.length > 0) {
      console.log(`\nFound ${grantsWithoutProperImages.length} private grants without proper images:`);
      grantsWithoutProperImages.forEach(grant => {
        console.log(`- Grant ID ${grant.id}: ${grant.title}`);
        console.log(`  Current image: ${grant.imageUrl || 'No image'}`);
        console.log(`  Type: ${grant.type}, Category: ${grant.category}, Industry: ${grant.industry || 'Not specified'}`);
        console.log('');
      });
    } else {
      console.log('\nAll private grants have proper images! 🎉');
    }
    
    return grantsWithoutProperImages;
    
  } catch (error) {
    console.error('Error in identifyMissingImages:', error);
    throw error;
  }
}

// Run the function
identifyMissingImages().catch(console.error);