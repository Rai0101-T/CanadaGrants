// Script to detect and fix duplicate grant images

import fetch from 'node-fetch';

// Collection of diverse, high-quality images to use as replacements
const replacementImages = [
  'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?auto=format&fit=crop&w=500&h=280&q=80', // Business meeting
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=500&h=280&q=80', // Tech innovation
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=500&h=280&q=80', // Manufacturing
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=500&h=280&q=80', // Business analysis
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&h=280&q=80', // Professional handshake
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&h=280&q=80', // Modern architecture
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&h=280&q=80', // Factory/manufacturing
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=500&h=280&q=80', // Business deal
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&h=280&q=80', // Innovative workspace
  'https://images.unsplash.com/photo-1578496480157-697fc14d2e55?auto=format&fit=crop&w=500&h=280&q=80', // Business people
  'https://images.unsplash.com/photo-1573495627361-d9b87960b12d?auto=format&fit=crop&w=500&h=280&q=80', // Modern office hallway
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=500&h=280&q=80', // Company building
  'https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=500&h=280&q=80', // Technology/innovation
  'https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&w=500&h=280&q=80', // Remote work setup
  'https://images.unsplash.com/photo-1605418426954-64ef9494e501?auto=format&fit=crop&w=500&h=280&q=80', // Project collaboration
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=500&h=280&q=80', // Professional meeting
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&h=280&q=80', // Digital marketing
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&h=280&q=80', // Team working on laptop
  'https://images.unsplash.com/photo-1536148935331-408321065b18?auto=format&fit=crop&w=500&h=280&q=80', // Green technology
  'https://images.unsplash.com/photo-1579389083395-4507e98b5e67?auto=format&fit=crop&w=500&h=280&q=80', // Agriculture
  'https://images.unsplash.com/photo-1581091877018-dac6a371d50f?auto=format&fit=crop&w=500&h=280&q=80', // Healthcare innovation
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=500&h=280&q=80', // Office workspace
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=500&h=280&q=80', // Team planning
  'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=500&h=280&q=80', // Lab research
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=500&h=280&q=80', // Industrial setting
  'https://images.unsplash.com/photo-1573167506167-567d376ea8dd?auto=format&fit=crop&w=500&h=280&q=80', // Sustainable energy
  'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=500&h=280&q=80', // Remote work/digital
  'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=500&h=280&q=80', // Development/building
  'https://images.unsplash.com/photo-1535957998253-26ae1ef29506?auto=format&fit=crop&w=500&h=280&q=80', // Entrepreneurship
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=500&h=280&q=80', // Female leadership
];

// Function to get all grants
async function getAllGrants() {
  try {
    const response = await fetch('http://localhost:5000/api/grants');
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching grants:', error);
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

// Function to detect and fix duplicate images
async function fixDuplicateImages() {
  try {
    console.log('Fetching all grants...');
    const grants = await getAllGrants();
    console.log(`Retrieved ${grants.length} grants.`);
    
    // Group grants by image URL
    const imageGroups = {};
    grants.forEach(grant => {
      if (grant.imageUrl) {
        if (!imageGroups[grant.imageUrl]) {
          imageGroups[grant.imageUrl] = [];
        }
        imageGroups[grant.imageUrl].push(grant);
      } else {
        console.log(`Grant ID ${grant.id} has no image URL.`);
      }
    });
    
    // Find duplicates and fix them
    let totalDuplicates = 0;
    let updatedCount = 0;
    
    for (const [imageUrl, grantsWithImage] of Object.entries(imageGroups)) {
      if (grantsWithImage.length > 1) {
        totalDuplicates += grantsWithImage.length - 1;
        console.log(`Found ${grantsWithImage.length} grants with image: ${imageUrl}`);
        
        // Keep the first grant with this image, update the rest
        for (let i = 1; i < grantsWithImage.length; i++) {
          const grant = grantsWithImage[i];
          // Get a random replacement image that's not the current one
          let replacementIndex;
          do {
            replacementIndex = Math.floor(Math.random() * replacementImages.length);
          } while (replacementImages[replacementIndex] === imageUrl && replacementImages.length > 1);
          
          const newImageUrl = replacementImages[replacementIndex];
          
          console.log(`Updating grant ID ${grant.id} (${grant.title}) with new image.`);
          await updateGrantImage(grant.id, newImageUrl);
          updatedCount++;
          
          // Small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }
    
    console.log(`Analysis complete. Found ${totalDuplicates} duplicate images.`);
    console.log(`Updated ${updatedCount} grants with new images.`);
    
    // Check if any grants are missing images and assign them one
    const grantsWithoutImages = grants.filter(grant => !grant.imageUrl);
    if (grantsWithoutImages.length > 0) {
      console.log(`Found ${grantsWithoutImages.length} grants without images. Fixing them...`);
      
      for (const grant of grantsWithoutImages) {
        const randomImageIndex = Math.floor(Math.random() * replacementImages.length);
        const newImageUrl = replacementImages[randomImageIndex];
        
        console.log(`Adding image to grant ID ${grant.id} (${grant.title}).`);
        await updateGrantImage(grant.id, newImageUrl);
        updatedCount++;
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    console.log(`Total grants updated: ${updatedCount}`);
    
  } catch (error) {
    console.error('Error in fixDuplicateImages:', error);
  }
}

// Run the function
fixDuplicateImages().catch(console.error);