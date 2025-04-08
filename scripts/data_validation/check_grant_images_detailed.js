import fetch from 'node-fetch';
import fs from 'fs';

// Function to get all grants
async function getAllGrants() {
  try {
    const response = await fetch('http://localhost:5000/api/grants');
    if (!response.ok) {
      throw new Error(`Error fetching grants: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch grants:', error);
    return [];
  }
}

// Function to check if an image URL is generic or missing
function isGenericOrMissingImage(imageUrl) {
  if (!imageUrl || imageUrl === '') {
    return true;
  }
  
  // Check for default unsplash patterns that might be generic
  const genericPatterns = [
    'unsplash.com/photos/qwtCeJ5cLYs', // default purple
    'unsplash.com/photos/5QgIuu',
    'unsplash.com/photos/iar-afB0QQw',
    'unsplash.com/photos/_1fzbdiFr',
    'unsplash.com/photos/WYGhTLym344',
    'unsplash.com/photos/_y3QPMdEQYM',
    'unsplash.com/photos',
    'canada.ca',
    'placeholder',
    'default',
    '/images/generic',
    'shutterstock',
    'stock-photo'
  ];
  
  return genericPatterns.some(pattern => imageUrl.includes(pattern));
}

// Function to check grant titles against image URLs
function hasImageMismatch(grant) {
  const { title, imageUrl, industry } = grant;
  
  // If image is already identified as generic, we consider it a mismatch
  if (isGenericOrMissingImage(imageUrl)) {
    return true;
  }
  
  return false;
}

// Main function to identify problematic grant images
async function identifyProblematicImages() {
  const grants = await getAllGrants();
  
  if (!grants.length) {
    console.log('No grants found or could not connect to the API');
    return;
  }
  
  console.log(`Analyzed ${grants.length} grants`);
  
  const missingImages = grants.filter(grant => !grant.imageUrl || grant.imageUrl === '');
  const genericImages = grants.filter(grant => grant.imageUrl && grant.imageUrl !== '' && isGenericOrMissingImage(grant.imageUrl));
  
  console.log(`\nGrants with missing images: ${missingImages.length}`);
  missingImages.forEach(grant => {
    console.log(`ID: ${grant.id}, Title: ${grant.title}, Type: ${grant.type}`);
  });
  
  console.log(`\nGrants with generic images: ${genericImages.length}`);
  genericImages.forEach(grant => {
    console.log(`ID: ${grant.id}, Title: ${grant.title}, Type: ${grant.type}, Current Image: ${grant.imageUrl}`);
  });
  
  // Write to a JSON file for further processing
  const problematicGrants = [...missingImages, ...genericImages];
  fs.writeFileSync('problematic_grants.json', JSON.stringify(problematicGrants, null, 2));
  console.log(`\nSaved ${problematicGrants.length} problematic grants to problematic_grants.json`);
}

identifyProblematicImages();