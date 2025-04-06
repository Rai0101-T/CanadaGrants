// Script to update the Walmart Entrepreneurship Fund grant with a more relevant image

import fetch from 'node-fetch';

// Function to get private grants
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

// Function to update a grant's image
async function updateGrantImage(id, imageUrl) {
  try {
    const response = await fetch('http://localhost:5000/api/admin/grants/update-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, imageUrl }),
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`✓ Updated grant ID ${id} with new image URL`);
    return result;
  } catch (error) {
    console.error(`Error updating grant image for ID ${id}:`, error);
    throw error;
  }
}

// Main function to update Walmart grant images
async function updateWalmartGrants() {
  try {
    console.log('Fetching all private grants...');
    const privateGrants = await getPrivateGrants();
    console.log(`Retrieved ${privateGrants.length} private grants.`);
    
    // Find Walmart grants
    const walmartGrants = privateGrants.filter(grant => 
      grant.title.includes('Walmart') || 
      (grant.fundingOrganization && grant.fundingOrganization.includes('Walmart'))
    );
    
    if (walmartGrants.length === 0) {
      console.log('No Walmart grants found.');
      return;
    }
    
    console.log(`Found ${walmartGrants.length} Walmart grants:\n`);
    
    // More relevant images for Walmart entrepreneurship/business grants
    const relevantWalmartImages = [
      // Entrepreneurship/business images
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=500&h=280&q=80", // Business meeting
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&h=280&q=80", // Startup office
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=500&h=280&q=80", // People pointing at data
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&h=280&q=80", // Entrepreneur at laptop
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=500&h=280&q=80", // Small business owner
    ];
    
    // Update each Walmart grant with a relevant image
    for (const grant of walmartGrants) {
      console.log(`- Grant ID ${grant.id}: ${grant.title}`);
      console.log(`  Current image: ${grant.imageUrl || 'No image'}`);
      
      // Select a relevant image based on the grant's purpose
      let newImageUrl;
      
      if (grant.title.includes('Entrepreneurship')) {
        // Choose an entrepreneurship-focused image
        newImageUrl = relevantWalmartImages[0]; // Business meeting image
      } else if (grant.title.includes('Community')) {
        // Choose a community-focused image
        newImageUrl = relevantWalmartImages[4]; // Small business owner
      } else {
        // Default to a general business image
        newImageUrl = relevantWalmartImages[2]; // People pointing at data
      }
      
      console.log(`  New image: ${newImageUrl}`);
      await updateGrantImage(grant.id, newImageUrl);
      console.log('');
    }
    
    console.log('Walmart grant images updated successfully!');
    
  } catch (error) {
    console.error('Error in updateWalmartGrants:', error);
    throw error;
  }
}

// Run the function
updateWalmartGrants().catch(console.error);