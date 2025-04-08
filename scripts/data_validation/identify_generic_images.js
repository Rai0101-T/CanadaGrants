// Script to identify grants with generic or placeholder images

import fetch from 'node-fetch';

// Common placeholder image patterns
const placeholderPatterns = [
  'placeholder',
  'default',
  'generic',
  'unsplash.com/photo-152', // Many generic business/office images start with this pattern
];

// Known generic images we want to replace
const knownGenericImages = [
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216',
  'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa',
  'https://images.unsplash.com/photo-1556742044-3c52d6e88c62',
  'https://images.unsplash.com/photo-1542744173-05336fcc7ad4',
  'https://images.unsplash.com/photo-1556155092-490a1ba16284',
  'https://images.unsplash.com/photo-1553484771-371a605b060b',
];

// Get grants by type (federal, provincial, private)
async function getGrantsByType(type) {
  try {
    const response = await fetch(`http://localhost:5000/api/grants/type/${type}`);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type} grants:`, error);
    return [];
  }
}

// Get all grants
async function getAllGrants() {
  try {
    const response = await fetch('http://localhost:5000/api/grants');
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all grants:', error);
    return [];
  }
}

// Check if an image URL appears to be generic
function isGenericImage(imageUrl) {
  if (!imageUrl) return true;
  
  // Check if it's one of our known generic images
  if (knownGenericImages.includes(imageUrl)) return true;
  
  // Check if it matches any placeholder patterns
  return placeholderPatterns.some(pattern => imageUrl.toLowerCase().includes(pattern));
}

// Check if the industry in the image doesn't match the grant's industry
function hasIndustryMismatch(grant) {
  if (!grant.imageUrl || !grant.industry) return false;
  
  const imageUrl = grant.imageUrl.toLowerCase();
  const industry = grant.industry.toLowerCase();
  
  // List of mismatches to check for
  const mismatches = [
    { imagePattern: 'technology', notInIndustry: ['agriculture', 'tourism', 'forestry'] },
    { imagePattern: 'office', notInIndustry: ['agriculture', 'tourism', 'forestry', 'manufacturing'] },
    { imagePattern: 'agriculture', notInIndustry: ['technology', 'digital media', 'tourism'] },
    { imagePattern: 'tourism', notInIndustry: ['technology', 'manufacturing', 'digital media'] },
  ];
  
  return mismatches.some(mismatch => 
    imageUrl.includes(mismatch.imagePattern) && 
    mismatch.notInIndustry.some(ind => industry.includes(ind))
  );
}

// Main function to identify grants with generic images
async function identifyGenericImages() {
  try {
    // Get all grants
    const allGrants = await getAllGrants();
    console.log(`Total grants: ${allGrants.length}`);
    
    // Find grants with generic images
    const grantsWithGenericImages = allGrants.filter(grant => 
      isGenericImage(grant.imageUrl) || hasIndustryMismatch(grant)
    );
    
    console.log(`\nFound ${grantsWithGenericImages.length} grants with generic or placeholder images:`);
    grantsWithGenericImages.forEach(grant => {
      console.log(`\nGrant #${grant.id}: ${grant.title}`);
      console.log(`  - Current image: ${grant.imageUrl}`);
      console.log(`  - Type: ${grant.type}`);
      console.log(`  - Industry: ${grant.industry || 'Not specified'}`);
    });
    
    return grantsWithGenericImages;
  } catch (error) {
    console.error('Error identifying generic images:', error);
    throw error;
  }
}

// Run the main function
identifyGenericImages().catch(console.error);