import fetch from 'node-fetch';

async function getAllGrants() {
  try {
    const response = await fetch('http://localhost:5000/api/grants/type/federal');
    return await response.json();
  } catch (error) {
    console.error('Error fetching grants:', error.message);
    return [];
  }
}

async function identifyDuplicateImages() {
  const grants = await getAllGrants();
  
  // Group grants by imageUrl
  const imageGroups = {};
  
  grants.forEach(grant => {
    if (!grant.imageUrl) return;
    
    if (!imageGroups[grant.imageUrl]) {
      imageGroups[grant.imageUrl] = [];
    }
    
    imageGroups[grant.imageUrl].push({
      id: grant.id,
      title: grant.title,
      type: grant.type
    });
  });
  
  // Find duplicate images (more than one grant with the same image)
  console.log('Grants with duplicate images:');
  let duplicatesFound = false;
  
  Object.entries(imageGroups)
    .filter(([_, grants]) => grants.length > 1)
    .forEach(([imageUrl, grants]) => {
      duplicatesFound = true;
      console.log(`\nImage URL: ${imageUrl}`);
      console.log('Used by grants:');
      grants.forEach(grant => {
        console.log(`- ID: ${grant.id}, Title: ${grant.title}`);
      });
    });
    
  if (!duplicatesFound) {
    console.log('No duplicate images found.');
  }
}

identifyDuplicateImages();