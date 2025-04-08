// Script to update the Manulife Education and Skills Fund grant image

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

async function fixManulifeGrant() {
  try {
    const grantId = 137; // Manulife Education and Skills Fund
    
    // A more appropriate education and skills related image
    // This image shows a classroom/education environment which is better suited
    // for an education and skills fund
    const newImageUrl = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=500&h=280&q=80';
    
    console.log(`Updating Manulife Education and Skills Fund (ID: ${grantId})`);
    console.log(`Current image URL: https://images.unsplash.com/photo-1610484826917-0f191a579f3f?auto=format&fit=crop&w=500&h=280&q=80`);
    console.log(`Setting new image URL: ${newImageUrl}`);
    
    await updateGrantImage(grantId, newImageUrl);
    
    console.log('Manulife Education and Skills Fund grant image updated successfully!');
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Run the function
fixManulifeGrant().catch(console.error);