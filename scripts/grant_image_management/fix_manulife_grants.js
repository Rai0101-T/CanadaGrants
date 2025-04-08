// Script to specifically fix Manulife grant images

import fetch from 'node-fetch';

// Higher quality Manulife-specific images
const manulifeImages = [
  'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=500&h=280&q=80', // Financial office
  'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=500&h=280&q=80', // Financial planning
  'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=500&h=280&q=80'  // Insurance
];

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

// Main function to fix Manulife grant images
async function fixManulifeGrants() {
  try {
    console.log('Fetching all private grants...');
    const privateGrants = await getPrivateGrants();
    console.log(`Retrieved ${privateGrants.length} private grants.`);
    
    const manulifeGrants = privateGrants.filter(grant => 
      (grant.title && grant.title.includes('Manulife')) || 
      (grant.organization && grant.organization.includes('Manulife')) ||
      (grant.fundingOrganization && grant.fundingOrganization.includes('Manulife'))
    );
    
    console.log(`Found ${manulifeGrants.length} Manulife grants.`);
    
    if (manulifeGrants.length === 0) {
      console.log('No Manulife grants found!');
      return;
    }
    
    // Process each Manulife grant
    for (let i = 0; i < manulifeGrants.length; i++) {
      const grant = manulifeGrants[i];
      // Use different image for each Manulife grant
      const imageIndex = i % manulifeImages.length;
      const newImageUrl = manulifeImages[imageIndex];
      
      console.log(`Updating image for Manulife grant ID ${grant.id}: ${grant.title}`);
      console.log(`Current image: ${grant.imageUrl || 'No image'}`);
      console.log(`New image: ${newImageUrl}`);
      
      await updateGrantImage(grant.id, newImageUrl);
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log(`\nCompleted! Updated ${manulifeGrants.length} Manulife grants with appropriate images.`);
    
  } catch (error) {
    console.error('Error in fixManulifeGrants:', error);
  }
}

// Run the function
fixManulifeGrants().catch(console.error);