// Script to update Futurpreneur grant images

import fetch from 'node-fetch';

// Define specific grant IDs to update with unique images
const grantsToUpdate = [
  {
    id: 35, // Futurpreneur Canada Startup Program
    imageUrl: "https://images.unsplash.com/photo-1565688534157-208f34df2a03?auto=format&fit=crop&w=500&h=280&q=80" // Young entrepreneurs
  },
  {
    id: 54, // Spin Master Innovation Fund
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&h=280&q=80" // Young innovators
  },
  {
    id: 250, // Futurpreneur Canada Start-Up Program (duplicate?)
    imageUrl: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=500&h=280&q=80" // Small business startup
  },
  {
    id: 183, // WD Regional Innovation Ecosystem
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&h=280&q=80" // Innovation ecosystem
  }
];

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

// Main function to diversify grant images
async function updateFuturpreneurImages() {
  try {
    console.log(`Updating images for ${grantsToUpdate.length} grants`);
    
    let updatedCount = 0;
    
    // Update each grant in our list
    for (const grant of grantsToUpdate) {
      console.log(`Updating grant ID ${grant.id} with unique image URL`);
      await updateGrantImage(grant.id, grant.imageUrl);
      updatedCount++;
      
      // Add a small delay to avoid overloading the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Successfully updated ${updatedCount} grants with unique images`);
    
  } catch (error) {
    console.error('Error updating grant images:', error);
    throw error;
  }
}

// Run the main function
updateFuturpreneurImages().catch(console.error);