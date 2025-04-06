// Script to fix the final batch of grants with generic or mismatched images

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

async function fixFinalGrantImages() {
  try {
    // Fix Women Entrepreneurship Strategy (WES) Ecosystem Fund - ID 5 (was flagged as generic)
    console.log('Fixing Women Entrepreneurship Strategy (WES) Ecosystem Fund (ID: 5)');
    // More specific women entrepreneur image instead of generic business woman
    await updateGrantImage(5, 'https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?auto=format&fit=crop&w=500&h=280&q=80');
    
    // Fix a few key technology grants with mismatched images
    console.log('Fixing key technology grants with better images');
    
    // Canada Digital Adoption Program (CDAP) - ID 1
    await updateGrantImage(1, 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=500&h=280&q=80');
    
    // National Research Council Industrial Research Assistance Program (NRC IRAP) - ID 33
    await updateGrantImage(33, 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&w=500&h=280&q=80');
    
    // Digital Skills for Youth (DS4Y) - ID 62
    await updateGrantImage(62, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&h=280&q=80');
    
    // Innovative Solutions Canada (formerly BCIP) - ID 77
    await updateGrantImage(77, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=500&h=280&q=80');
    
    // Fix clean technology grants
    console.log('Fixing clean technology grants with better images');
    
    // Clean Growth Hub - ID 58
    await updateGrantImage(58, 'https://images.unsplash.com/photo-1588712242455-2531daf24839?auto=format&fit=crop&w=500&h=280&q=80');
    
    console.log('All final grant images updated successfully!');
    
  } catch (error) {
    console.error('Error in fixFinalGrantImages:', error);
    throw error;
  }
}

// Run the main function
fixFinalGrantImages().catch(console.error);