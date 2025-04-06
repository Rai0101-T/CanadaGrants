// Script to update Ontario grant images

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

async function updateOntarioGrantImages() {
  try {
    // 1. Ontario Agriculture Business Expansion Fund - ID 81
    console.log('Updating Ontario Agriculture Business Expansion Fund (ID: 81)');
    console.log('Current image: https://images.unsplash.com/photo-1500000905912');
    const agricultureBusinessImageUrl = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&h=280&q=80'; // Agriculture business
    await updateGrantImage(81, agricultureBusinessImageUrl);
    
    // 2. Ontario Agriculture Start-up Support Fund - ID 82
    console.log('Updating Ontario Agriculture Start-up Support Fund (ID: 82)');
    console.log('Current image: https://images.unsplash.com/photo-1500068654534');
    const agricultureStartupImageUrl = 'https://images.unsplash.com/photo-1566937169390-7be4c63b8a0e?auto=format&fit=crop&w=500&h=280&q=80'; // Agricultural innovation
    await updateGrantImage(82, agricultureStartupImageUrl);
    
    // 3. Ontario Together Fund - ID 45
    console.log('Updating Ontario Together Fund (ID: 45)');
    console.log('Current image: https://images.unsplash.com/photo-1567789884554-0b844b40c56a');
    const ontarioTogetherImageUrl = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=500&h=280&q=80'; // Ontario manufacturing
    await updateGrantImage(45, ontarioTogetherImageUrl);
    
    console.log('All Ontario grant images updated successfully!');
    
  } catch (error) {
    console.error('Error in updateOntarioGrantImages:', error);
  }
}

// Run the function
updateOntarioGrantImages().catch(console.error);