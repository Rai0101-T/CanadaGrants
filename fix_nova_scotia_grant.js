// Script to specifically fix the Nova Scotia Ocean Technology Tax Credit grant image

import fetch from 'node-fetch';

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

async function fixNovaScotiaGrantImage() {
  try {
    const grantId = 167; // Nova Scotia Ocean Technology Tax Credit
    
    // A more appropriate ocean technology related image
    const newImageUrl = 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=500&h=280&q=80';
    
    console.log(`Updating Nova Scotia Ocean Technology Tax Credit (ID: ${grantId})`);
    console.log(`Setting new image URL: ${newImageUrl}`);
    
    await updateGrantImage(grantId, newImageUrl);
    
    console.log('Nova Scotia Ocean Technology Tax Credit grant image updated successfully!');
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Run the function
fixNovaScotiaGrantImage().catch(console.error);