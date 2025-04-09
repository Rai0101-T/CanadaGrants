// Script to improve the contextual relevance of grant images
// This script identifies grants that have generic images and replaces them
// with more contextually relevant and visually appealing images

import fetch from 'node-fetch';

// Specific organization-based image map for well-known grants
const organizationImageMap = {
  // Federal funding organizations
  'BDC': 'https://images.unsplash.com/photo-1565841812966-996e2eb8fbac?auto=format&fit=crop&w=500&h=280&q=80', // Business finance
  'Business Development Bank': 'https://images.unsplash.com/photo-1565841812966-996e2eb8fbac?auto=format&fit=crop&w=500&h=280&q=80', // Business finance
  'CanExport': 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=500&h=280&q=80', // International business
  'Futurpreneur': 'https://images.unsplash.com/photo-1559058789-672da06263d8?auto=format&fit=crop&w=500&h=280&q=80', // Young entrepreneur
  'IRAP': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&h=280&q=80', // Research and development
  'CDAP': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=500&h=280&q=80', // Digital transformation
  'CSBFP': 'https://images.unsplash.com/photo-1571942676516-bcab84649e44?auto=format&fit=crop&w=500&h=280&q=80', // Small business financing
  
  // Banks and financial institutions
  'TELUS': 'https://images.unsplash.com/photo-1637846384211-dd36fead7c71?auto=format&fit=crop&w=500&h=280&q=80', // Telecom innovation
  'RBC': 'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?auto=format&fit=crop&w=500&h=280&q=80', // Financial service
  'TD': 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=500&h=280&q=80', // Banking
  'Scotiabank': 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&w=500&h=280&q=80', // Finance
  'BMO': 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=500&h=280&q=80', // Business finance
  'CIBC': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500&h=280&q=80', // Banking
  'Walmart': 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=500&h=280&q=80' // Retail funding
};

// Industry-specific high-quality images
const industryImageMap = {
  'Technology': [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&h=280&q=80', // Tech innovation
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&h=280&q=80', // Tech developer
    'https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?auto=format&fit=crop&w=500&h=280&q=80', // Tech office
    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=500&h=280&q=80'  // Circuit board
  ],
  'Clean Technology': [
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=500&h=280&q=80', // Clean energy
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80', // Solar panels
    'https://images.unsplash.com/photo-1552252662-6eb1d97ef11e?auto=format&fit=crop&w=500&h=280&q=80', // Green tech
    'https://images.unsplash.com/photo-1511963211013-83bba110595d?auto=format&fit=crop&w=500&h=280&q=80'  // Sustainable energy
  ],
  'Manufacturing': [
    'https://images.unsplash.com/photo-1565742070532-2a48e556e6d3?auto=format&fit=crop&w=500&h=280&q=80', // Industrial equipment
    'https://images.unsplash.com/photo-1561477563-f26c89472966?auto=format&fit=crop&w=500&h=280&q=80', // Factory worker
    'https://images.unsplash.com/photo-1493274409672-7d8be5e339e2?auto=format&fit=crop&w=500&h=280&q=80', // Modern factory
    'https://images.unsplash.com/photo-1590567854540-91222f283b8c?auto=format&fit=crop&w=500&h=280&q=80'  // Precision engineering
  ],
  'Agriculture': [
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=500&h=280&q=80', // Modern farming
    'https://images.unsplash.com/photo-1587459481523-2bd5ebe5abb8?auto=format&fit=crop&w=500&h=280&q=80', // Agriculture tech
    'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=500&h=280&q=80', // Farm landscape
    'https://images.unsplash.com/photo-1584679109597-c656b19974c9?auto=format&fit=crop&w=500&h=280&q=80'  // Agritech innovation
  ],
  'Healthcare': [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&h=280&q=80', // Medical research
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=500&h=280&q=80', // Healthcare tech
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=500&h=280&q=80', // Medical innovation
    'https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?auto=format&fit=crop&w=500&h=280&q=80'  // Healthcare professionals
  ],
  'Arts and Culture': [
    'https://images.unsplash.com/photo-1536924430914-91f9e2041b83?auto=format&fit=crop&w=500&h=280&q=80', // Art gallery
    'https://images.unsplash.com/photo-1569143125807-e7837c027932?auto=format&fit=crop&w=500&h=280&q=80', // Cultural event
    'https://images.unsplash.com/photo-1567593810070-7a3d471af022?auto=format&fit=crop&w=500&h=280&q=80', // Arts performance
    'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=500&h=280&q=80'  // Creative arts
  ],
  'Digital Media': [
    'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=500&h=280&q=80', // Video production
    'https://images.unsplash.com/photo-1544522965-32d5de202716?auto=format&fit=crop&w=500&h=280&q=80', // Digital design
    'https://images.unsplash.com/photo-1601907993561-98264e7feb28?auto=format&fit=crop&w=500&h=280&q=80', // Digital content
    'https://images.unsplash.com/photo-1537205269020-ea32c3d5b83e?auto=format&fit=crop&w=500&h=280&q=80'  // Social media
  ],
  'Indigenous': [
    'https://images.unsplash.com/photo-1529673736833-9302d731fc8a?auto=format&fit=crop&w=500&h=280&q=80', // Indigenous art
    'https://images.unsplash.com/photo-1614631446501-abcf76949472?auto=format&fit=crop&w=500&h=280&q=80', // Indigenous community
    'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=500&h=280&q=80', // Cultural tradition
    'https://images.unsplash.com/photo-1513965849009-4afcdda7c50d?auto=format&fit=crop&w=500&h=280&q=80'  // Indigenous business
  ],
  'Tourism': [
    'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=500&h=280&q=80', // Canadian tourism
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&h=280&q=80', // Tourist destination
    'https://images.unsplash.com/photo-1505832018823-50331d70d237?auto=format&fit=crop&w=500&h=280&q=80', // Travel
    'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?auto=format&fit=crop&w=500&h=280&q=80'  // Hospitality
  ]
};

// Function to determine if an image is generic or non-contextual
function isGenericOrNonContextual(grant) {
  if (!grant.imageUrl) return true;
  
  const imageUrl = grant.imageUrl.toLowerCase();
  
  // Common unsplash image pattern
  if (imageUrl.includes('unsplash.com')) {
    // Check if the image matches the grant's industry or category
    const isContextuallyRelevant = isImageRelevantToGrant(grant, imageUrl);
    return !isContextuallyRelevant;
  }
  
  // Already processed optimized images (company logos)
  if (imageUrl.includes('company_logos') || 
      imageUrl.includes('logo')) {
    return false;
  }
  
  // Generic placeholder images or patterns
  if (imageUrl.includes('placeholder') || 
      imageUrl.includes('default-') || 
      imageUrl.includes('generic-') ||
      imageUrl.includes('gray-') ||
      imageUrl.includes('no-image')) {
    return true;
  }
  
  return false;
}

// Function to check if an image is relevant to the grant's context
function isImageRelevantToGrant(grant, imageUrl) {
  // Extract relevant keywords from grant
  const keywords = [];
  
  if (grant.category) keywords.push(grant.category.toLowerCase());
  if (grant.industry) keywords.push(grant.industry.toLowerCase());
  
  // Process title and description for keywords
  const titleWords = grant.title.toLowerCase().split(/\s+/);
  keywords.push(...titleWords.filter(word => word.length > 4));
  
  // Check if any keywords appear in the image URL
  return keywords.some(keyword => imageUrl.includes(keyword));
}

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

// Set to track used images to avoid duplication
const usedImages = new Set();

// Get the best image for a grant based on its details
function getBestImageForGrant(grant) {
  // Check for organization-specific image first
  for (const [org, imageUrl] of Object.entries(organizationImageMap)) {
    if (grant.title.includes(org) || 
        (grant.fundingOrganization && grant.fundingOrganization.includes(org)) ||
        (grant.description && grant.description.includes(org))) {
      return imageUrl;
    }
  }
  
  // Check for industry-specific images
  let potentialImages = [];
  
  if (grant.industry && industryImageMap[grant.industry]) {
    potentialImages = [...industryImageMap[grant.industry]];
  }
  
  // Check title and description for industry keywords
  const grantText = (grant.title + ' ' + grant.description).toLowerCase();
  
  for (const [industry, images] of Object.entries(industryImageMap)) {
    const industryLower = industry.toLowerCase();
    if (grantText.includes(industryLower)) {
      potentialImages = [...potentialImages, ...images];
    }
  }
  
  // If no matches, try general grant categories
  if (potentialImages.length === 0) {
    const generalOptions = [
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&h=280&q=80', // Business meeting
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&h=280&q=80', // Team collaboration
      'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=500&h=280&q=80', // Business funding
      'https://images.unsplash.com/photo-1565843708714-52ecf69ab81f?auto=format&fit=crop&w=500&h=280&q=80'  // Financial growth
    ];
    potentialImages = generalOptions;
  }
  
  // Filter out already used images
  const availableImages = potentialImages.filter(img => !usedImages.has(img));
  
  // If all potential images are used, reset and try again
  if (availableImages.length === 0) {
    console.log(`All potential images for grant ID ${grant.id} are already used. Selecting from all options.`);
    // Select the least used image
    const selectedImage = potentialImages[0];
    usedImages.add(selectedImage);
    return selectedImage;
  }
  
  // Choose a random image from available options
  const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
  usedImages.add(selectedImage);
  return selectedImage;
}

// Main function to improve image contextual relevance
async function improveImageRelevance() {
  try {
    // Get all grants
    console.log('Fetching all grants...');
    const allGrants = await getAllGrants();
    console.log(`Retrieved ${allGrants.length} grants total.`);
    
    // Find grants with generic or non-contextual images
    const grantsToImprove = allGrants.filter(grant => isGenericOrNonContextual(grant));
    console.log(`Found ${grantsToImprove.length} grants with generic or non-contextual images.`);
    
    // Initialize usedImages set with current contextual images to avoid duplication
    allGrants.forEach(grant => {
      if (grant.imageUrl && !isGenericOrNonContextual(grant)) {
        usedImages.add(grant.imageUrl);
      }
    });
    
    let updatedCount = 0;
    
    // Process grants in batches to avoid overwhelming the server
    const batchSize = 10;
    for (let i = 0; i < grantsToImprove.length; i += batchSize) {
      const batch = grantsToImprove.slice(i, i + batchSize);
      
      console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(grantsToImprove.length/batchSize)}...`);
      
      // Process each grant in the batch
      for (const grant of batch) {
        const newImageUrl = getBestImageForGrant(grant);
        
        console.log(`Updating image for grant ID ${grant.id}: ${grant.title}`);
        console.log(`Current image: ${grant.imageUrl || 'No image'}`);
        console.log(`New contextual image: ${newImageUrl}`);
        
        await updateGrantImage(grant.id, newImageUrl);
        updatedCount++;
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      console.log(`Completed batch ${Math.floor(i/batchSize) + 1}. Updated ${updatedCount} grants so far.`);
      
      // Larger delay between batches
      if (i + batchSize < grantsToImprove.length) {
        console.log('Waiting 2 seconds before processing next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`\nCompleted! Improved image relevance for ${updatedCount} of ${grantsToImprove.length} grants.`);
    
  } catch (error) {
    console.error('Error in improveImageRelevance:', error);
  }
}

// Run the script
improveImageRelevance().catch(console.error);