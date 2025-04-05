// Script to update the Canada Digital Adoption Program grant image

import fetch from 'node-fetch';

// Digital technology/adoption specific images
const digitalAdoptionImages = [
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=500&h=280&q=80', // Digital technology
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&h=280&q=80', // Tech adoption
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&h=280&q=80', // Digital transformation
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=500&h=280&q=80', // Digital business
  'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=500&h=280&q=80', // Business technology
];

// Function to update a grant's image
async function updateGrantImage(id, imageUrl) {
  try {
    const response = await fetch('http://localhost:5000/api/admin/grants/update-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, imageUrl })
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Updated grant #${id} image successfully to: ${imageUrl}`);
    return data;
  } catch (error) {
    console.error(`Failed to update grant #${id} image:`, error);
    throw error;
  }
}

// Main function to update the Canada Digital Adoption Program grant image
async function updateCDAPImage() {
  try {
    // The Canada Digital Adoption Program grant ID is 1 based on the logs
    const grantId = 1;
    
    // Select a specific image focused on digital adoption and technology
    const selectedImage = digitalAdoptionImages[2]; // Using the digital transformation image
    
    console.log(`Updating Canada Digital Adoption Program (ID: ${grantId}) with image: ${selectedImage}`);
    
    // Update the grant image
    await updateGrantImage(grantId, selectedImage);
    
    console.log('CDAP grant image update completed successfully');
  } catch (error) {
    console.error('Error updating CDAP grant image:', error);
  }
}

// Run the update process
updateCDAPImage().catch(console.error);