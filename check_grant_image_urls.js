import fetch from 'node-fetch';

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

// Main function to check all image URLs
async function checkAllImageUrls() {
  const grants = await getAllGrants();
  
  if (!grants.length) {
    console.log('No grants found or could not connect to the API');
    return;
  }
  
  console.log(`Checking image URLs for ${grants.length} grants...`);
  
  const missingImageUrls = grants.filter(grant => !grant.imageUrl || grant.imageUrl === '');
  const imageDistribution = {};
  
  // Count how many times each image URL is used
  grants.forEach(grant => {
    if (grant.imageUrl) {
      // Extract just the image ID from Unsplash URLs for cleaner reporting
      let imageKey = grant.imageUrl;
      if (grant.imageUrl.includes('unsplash.com/photos/')) {
        const match = grant.imageUrl.match(/unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          imageKey = `unsplash:${match[1]}`;
        }
      }
      
      imageDistribution[imageKey] = (imageDistribution[imageKey] || 0) + 1;
    }
  });
  
  // Sort by frequency (highest first)
  const sortedImageFrequency = Object.entries(imageDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Get top 10 most frequent images
  
  console.log(`\nGrants with missing image URLs: ${missingImageUrls.length}`);
  if (missingImageUrls.length > 0) {
    missingImageUrls.forEach(grant => {
      console.log(`- ID: ${grant.id}, Title: ${grant.title}`);
    });
  } else {
    console.log('No grants with missing image URLs found!');
  }
  
  console.log('\nTop 10 most frequently used image URLs:');
  sortedImageFrequency.forEach(([imageUrl, count], index) => {
    console.log(`${index + 1}. ${imageUrl}: used ${count} times`);
  });
  
  // Calculate the percentage of grants with unique images
  const uniqueImageCount = Object.values(imageDistribution).filter(count => count === 1).length;
  const uniqueImagePercentage = (uniqueImageCount / grants.length * 100).toFixed(2);
  
  console.log(`\nUnique image usage statistics:`);
  console.log(`- Total grants: ${grants.length}`);
  console.log(`- Unique images: ${uniqueImageCount} (${uniqueImagePercentage}%)`);
}

checkAllImageUrls();