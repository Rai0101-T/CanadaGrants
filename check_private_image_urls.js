// Script to check all private grant image URLs

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

// Main function to check all image URLs
async function checkAllImageUrls() {
  try {
    console.log('Fetching all private grants...');
    const privateGrants = await getPrivateGrants();
    console.log(`Retrieved ${privateGrants.length} private grants.\n`);
    
    // Categorize the images
    const unsplashImages = privateGrants.filter(grant => 
      grant.imageUrl && grant.imageUrl.includes('unsplash.com')
    );
    
    const companyLogoImages = privateGrants.filter(grant => 
      grant.imageUrl && grant.imageUrl.includes('company_logos')
    );
    
    const otherImages = privateGrants.filter(grant => 
      grant.imageUrl && 
      !grant.imageUrl.includes('unsplash.com') && 
      !grant.imageUrl.includes('company_logos')
    );
    
    const noImages = privateGrants.filter(grant => 
      !grant.imageUrl || grant.imageUrl === ''
    );
    
    console.log('Image URL Summary:');
    console.log(`- Unsplash images: ${unsplashImages.length}`);
    console.log(`- Company logo images: ${companyLogoImages.length}`);
    console.log(`- Other images: ${otherImages.length}`);
    console.log(`- No images: ${noImages.length}`);
    
    if (otherImages.length > 0) {
      console.log('\nGrants with "other" image URLs:');
      otherImages.forEach(grant => {
        console.log(`- Grant ID ${grant.id}: ${grant.title}`);
        console.log(`  Image URL: ${grant.imageUrl}`);
        console.log('');
      });
    }
    
    if (noImages.length > 0) {
      console.log('\nGrants with no image URLs:');
      noImages.forEach(grant => {
        console.log(`- Grant ID ${grant.id}: ${grant.title}`);
        console.log('');
      });
    }
    
    // Print out all image URLs (just company info and URL)
    console.log('\nAll private company grants by organization:');
    const companyMap = new Map();
    
    privateGrants.forEach(grant => {
      const companyName = grant.fundingOrganization || '';
      if (!companyMap.has(companyName)) {
        companyMap.set(companyName, []);
      }
      companyMap.get(companyName).push({
        id: grant.id,
        title: grant.title,
        imageUrl: grant.imageUrl
      });
    });
    
    // Sort by company name
    const sortedCompanies = Array.from(companyMap.keys()).sort();
    
    sortedCompanies.forEach(company => {
      if (!company) return; // Skip empty company names
      
      console.log(`\n${company}:`);
      companyMap.get(company).forEach(grant => {
        console.log(`- Grant ID ${grant.id}: ${grant.title}`);
        console.log(`  Image URL: ${grant.imageUrl || 'No image'}`);
      });
    });
    
  } catch (error) {
    console.error('Error in checkAllImageUrls:', error);
    throw error;
  }
}

// Run the function
checkAllImageUrls().catch(console.error);