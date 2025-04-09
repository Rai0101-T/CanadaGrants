// Script to update the image for the Indigenous Skills and Employment Training Program grant

import fetch from 'node-fetch';

// This script specifically updates the image for the Indigenous Skills and Employment Training Program grant (ID 206)
// The new image will be more relevant to Indigenous employment and skills training

// Better, more contextually relevant images for Indigenous skills training and employment
const relevantImages = [
  'https://images.unsplash.com/photo-1614631446501-abcf76949472?auto=format&fit=crop&w=500&h=280&q=80', // Indigenous community meeting
  'https://images.unsplash.com/photo-1529673736833-9302d731fc8a?auto=format&fit=crop&w=500&h=280&q=80', // Indigenous craftsmanship
  'https://images.unsplash.com/photo-1633979588716-0b9f15138ea1?auto=format&fit=crop&w=500&h=280&q=80', // Indigenous leadership
  'https://images.unsplash.com/photo-1589397535375-4248a3ba212d?auto=format&fit=crop&w=500&h=280&q=80', // Traditional skills
  'https://images.unsplash.com/photo-1541023595939-592ce9de4d14?auto=format&fit=crop&w=500&h=280&q=80'  // Education/training setting
];

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

// Main function to update the Indigenous Skills and Employment Training Program grant image
async function updateIndigenousTrainingGrantImage() {
  try {
    // Grant ID for the Indigenous Skills and Employment Training Program
    const grantId = 206;
    
    // Choose a relevant image - using the first one for consistency
    const newImageUrl = relevantImages[0]; // Indigenous community meeting - most relevant for employment training
    
    console.log(`Updating image for Indigenous Skills and Employment Training Program (ID: ${grantId})`);
    console.log(`New image URL: ${newImageUrl}`);
    
    // Update the grant image
    const updatedGrant = await updateGrantImage(grantId, newImageUrl);
    
    console.log('Grant image updated successfully:');
    console.log(`Grant ID: ${updatedGrant.id}`);
    console.log(`Title: ${updatedGrant.title}`);
    console.log(`New Image URL: ${updatedGrant.imageUrl}`);
    
  } catch (error) {
    console.error('Error updating Indigenous Training grant image:', error);
  }
}

// Run the function
updateIndigenousTrainingGrantImage();