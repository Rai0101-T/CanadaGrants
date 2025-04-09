// Script to replace all SVG images (usually logos) with appropriate photographs
// This enhances the visual appeal of grant cards and provides a more consistent look

import fetch from 'node-fetch';

// Map of categories/industries to relevant images
const categoryImageMap = {
  'Agriculture': [
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1486328228599-85db4443971f?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Manufacturing': [
    'https://images.unsplash.com/photo-1566296995662-36218a4eb0b3?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1590359630891-f0a0db4ab7a5?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1565742070532-2a48e556e6d3?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1611288875785-baa04a75ec40?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Technology': [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Digital Media': [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Clean Technology': [
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1569212981748-6935e5c5a0e9?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Healthcare': [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Education': [
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Research': [
    'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Tourism': [
    'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1544015759-62c3d1fca79e?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Small Business': [
    'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1575912788988-4337c6c6e650?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Innovation': [
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Indigenous': [
    'https://images.unsplash.com/photo-1614631446501-abcf76949472?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1633979588716-0b9f15138ea1?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1533000759938-aa0ba70beceb?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Energy': [
    'https://images.unsplash.com/photo-1591964006776-3edb812acaaf?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1584276433295-4b59fff3944f?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Environment': [
    'https://images.unsplash.com/photo-1493857671505-72967e2e2760?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1470137237906-d8a3eb68a187?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1584251604109-066fcb12031e?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Arts and Culture': [
    'https://images.unsplash.com/photo-1545989253-02cc26577f88?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1603226013039-31919bd2358d?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Export': [
    'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1584386967854-ee6c7528f984?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1477064996809-dae46985eee7?auto=format&fit=crop&w=500&h=280&q=80'
  ]
};

// Province-specific images
const provinceImageMap = {
  'Ontario': [
    'https://images.unsplash.com/photo-1603466182843-75f713fd6e2d?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1567705323043-d0e979d33b14?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Quebec': [
    'https://images.unsplash.com/photo-1519178614-68673b201f36?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1577648875891-8c98be9a8e65?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'British Columbia': [
    'https://images.unsplash.com/photo-1475066392170-59d55d96fe51?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1501687322323-98641f8373fc?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1496497243327-9dccd845c35f?auto=format&fit=crop&w=500&h=280&q=80'
  ],
  'Alberta': [
    'https://images.unsplash.com/photo-1513219607388-bf734048691f?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1521150932951-303a95503ed3?auto=format&fit=crop&w=500&h=280&q=80',
    'https://images.unsplash.com/photo-1602256868557-eae9dff9ca99?auto=format&fit=crop&w=500&h=280&q=80'
  ]
};

// Fallback images for when no specific match is found
const fallbackImages = [
  'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=500&h=280&q=80', // General business grant
  'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=500&h=280&q=80', // Funding concept
  'https://images.unsplash.com/photo-1621866808265-38132283addc?auto=format&fit=crop&w=500&h=280&q=80', // Finance and funding 
  'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=500&h=280&q=80', // Investment
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&h=280&q=80', // Business team
  'https://images.unsplash.com/photo-1530099486328-e021101a494a?auto=format&fit=crop&w=500&h=280&q=80'  // Modern business
];

// Track used images to prevent duplication
const usedImages = new Set();

// Function to get all grants
async function getAllGrants() {
  try {
    const response = await fetch(`http://localhost:5000/api/grants`);
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

// Check if an image URL is an SVG (logos)
function isSvgImage(imageUrl) {
  if (!imageUrl) return false;
  return imageUrl.toLowerCase().endsWith('.svg');
}

// Get the best image for a grant based on its details
function getBestImageForGrant(grant) {
  let potentialImages = [];
  
  // Look for category match
  if (grant.category && categoryImageMap[grant.category]) {
    potentialImages = [...categoryImageMap[grant.category]];
  }
  
  // Look for industry match
  if (grant.industry && categoryImageMap[grant.industry]) {
    potentialImages = [...potentialImages, ...categoryImageMap[grant.industry]];
  }
  
  // Check for province-specific grants
  if (grant.province && grant.province !== 'All' && provinceImageMap[grant.province]) {
    potentialImages = [...potentialImages, ...provinceImageMap[grant.province]];
  }
  
  // Check title and description for keywords
  const grantText = (grant.title + ' ' + grant.description).toLowerCase();
  
  for (const [category, images] of Object.entries(categoryImageMap)) {
    const categoryLower = category.toLowerCase();
    if (grantText.includes(categoryLower)) {
      potentialImages = [...potentialImages, ...images];
    }
  }
  
  // If no matches or not enough options, add fallbacks
  if (potentialImages.length < 2) {
    potentialImages = [...potentialImages, ...fallbackImages];
  }
  
  // Filter out already used images
  const availableImages = potentialImages.filter(img => !usedImages.has(img));
  
  // If all potential images are used, reset and try again
  if (availableImages.length === 0) {
    console.log(`All potential images for grant ID ${grant.id} are already used. Selecting from all options.`);
    // Try to find the least used images
    const imageCountMap = new Map();
    potentialImages.forEach(img => {
      imageCountMap.set(img, (imageCountMap.get(img) || 0) + 1);
    });
    
    // Sort by least used
    potentialImages.sort((a, b) => imageCountMap.get(a) - imageCountMap.get(b));
    
    // Take the least used image
    const selectedImage = potentialImages[0];
    usedImages.add(selectedImage);
    return selectedImage;
  }
  
  // Choose a random image from available options
  const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
  usedImages.add(selectedImage);
  return selectedImage;
}

// Main function to replace all SVG images with photographs
async function replaceSvgWithPhotos() {
  try {
    // Get all grants
    console.log('Fetching all grants...');
    const allGrants = await getAllGrants();
    console.log(`Retrieved ${allGrants.length} grants total.`);
    
    // Find grants with SVG images
    const grantsWithSvgImages = allGrants.filter(grant => isSvgImage(grant.imageUrl));
    console.log(`Found ${grantsWithSvgImages.length} grants with SVG images that will be replaced with photographs.`);
    
    // Initialize usedImages set with current non-SVG images to avoid duplication
    allGrants.forEach(grant => {
      if (grant.imageUrl && !isSvgImage(grant.imageUrl)) {
        usedImages.add(grant.imageUrl);
      }
    });
    
    let updatedCount = 0;
    
    // Process grants in batches to avoid overwhelming the server
    const batchSize = 10;
    for (let i = 0; i < grantsWithSvgImages.length; i += batchSize) {
      const batch = grantsWithSvgImages.slice(i, i + batchSize);
      
      console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(grantsWithSvgImages.length/batchSize)}...`);
      
      // Process each grant in the batch
      for (const grant of batch) {
        const newImageUrl = getBestImageForGrant(grant);
        
        console.log(`Replacing SVG image for grant ID ${grant.id}: ${grant.title}`);
        console.log(`Current SVG image: ${grant.imageUrl}`);
        console.log(`New photograph: ${newImageUrl}`);
        
        await updateGrantImage(grant.id, newImageUrl);
        updatedCount++;
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      console.log(`Completed batch ${Math.floor(i/batchSize) + 1}. Updated ${updatedCount} grants so far.`);
      
      // Larger delay between batches
      if (i + batchSize < grantsWithSvgImages.length) {
        console.log('Waiting 2 seconds before processing next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`\nCompleted! Replaced SVG images with photographs for ${updatedCount} of ${grantsWithSvgImages.length} grants.`);
    
  } catch (error) {
    console.error('Error in replaceSvgWithPhotos:', error);
  }
}

// Run the script
replaceSvgWithPhotos().catch(console.error);