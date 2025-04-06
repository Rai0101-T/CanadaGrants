// Script to identify and fix grants with placeholder or generic images

import fetch from 'node-fetch';

// Function to fetch all grants
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

// Function to determine if an image is likely a placeholder/generic image
function isPlaceholderImage(imageUrl, title, industry) {
  // Check for common placeholder patterns in URLs
  const placeholderPatterns = [
    'placeholder',
    'sample',
    'default',
    'generic',
    'stock-photo'
  ];
  
  // Check if the URL contains any placeholder patterns
  const hasPlaceholderPattern = placeholderPatterns.some(pattern => 
    imageUrl.toLowerCase().includes(pattern)
  );
  
  // Images that don't match the grant's industry or purpose
  const industryMismatch = industry && !imageUrl.toLowerCase().includes(industry.toLowerCase());
  
  // Generic office/business photos that don't have specific relevance
  const genericBusinessPhotos = [
    'office-building',
    'business-meeting',
    'handshake',
    'corporate'
  ].some(pattern => imageUrl.toLowerCase().includes(pattern));
  
  return hasPlaceholderPattern || genericBusinessPhotos;
}

// Function to get a more relevant image based on grant details
function getRelevantImage(grant) {
  const { title, description, industry, type } = grant;
  
  // Industry-specific image mappings
  const industryImageMap = {
    'Technology': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&h=280&q=80',
    'Manufacturing': 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&w=500&h=280&q=80',
    'Clean Technology': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80',
    'Digital Media': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=500&h=280&q=80',
    'Agriculture': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=500&h=280&q=80',
    'Healthcare': 'https://images.unsplash.com/photo-1631815588090-d1bcbe9b4b38?auto=format&fit=crop&w=500&h=280&q=80',
    'Tourism': 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=500&h=280&q=80',
    'Arts & Culture': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=500&h=280&q=80',
    'Energy': 'https://images.unsplash.com/photo-1559087867-ce4c91325525?auto=format&fit=crop&w=500&h=280&q=80',
    'Education': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&h=280&q=80',
    'Science': 'https://images.unsplash.com/photo-1530210124550-912dc1381890?auto=format&fit=crop&w=500&h=280&q=80',
    'Environmental': 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=500&h=280&q=80',
    'Finance': 'https://images.unsplash.com/photo-1579621970590-9d624316904b?auto=format&fit=crop&w=500&h=280&q=80',
    'Multiple': 'https://images.unsplash.com/photo-1643057752896-b6fb4fe22426?auto=format&fit=crop&w=500&h=280&q=80'
  };
  
  // Specialized keywords for specific grants
  const keywords = {
    'women': 'https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?auto=format&fit=crop&w=500&h=280&q=80',
    'indigenous': 'https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&w=500&h=280&q=80',
    'startup': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&h=280&q=80',
    'research': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=500&h=280&q=80',
    'export': 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c7?auto=format&fit=crop&w=500&h=280&q=80',
    'innovation': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&h=280&q=80',
    'youth': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&h=280&q=80',
    'loan': 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&w=500&h=280&q=80',
    'tax': 'https://images.unsplash.com/photo-1586486413729-490a659e5392?auto=format&fit=crop&w=500&h=280&q=80'
  };
  
  // Try to find a keyword match in title or description
  for (const [keyword, url] of Object.entries(keywords)) {
    if (title.toLowerCase().includes(keyword) || 
        (description && description.toLowerCase().includes(keyword))) {
      return url;
    }
  }
  
  // Fall back to industry-specific image
  if (industry && industryImageMap[industry]) {
    return industryImageMap[industry];
  }
  
  // Default by grant type if no other matches
  if (type === 'federal') {
    return 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=500&h=280&q=80';
  } else if (type === 'provincial') {
    return 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=500&h=280&q=80';
  } else if (type === 'private') {
    return 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=500&h=280&q=80';
  }
  
  // Absolute fallback for any grant
  return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&h=280&q=80';
}

// Main function to identify and fix placeholder images
async function fixPlaceholderImages() {
  try {
    // Get all grants
    const allGrants = await getAllGrants();
    console.log(`Total grants: ${allGrants.length}`);
    
    // Identify grants with placeholder images
    const grantsWithPlaceholders = allGrants.filter(grant => 
      isPlaceholderImage(grant.imageUrl, grant.title, grant.industry)
    );
    
    console.log(`Found ${grantsWithPlaceholders.length} grants with placeholder images`);
    
    // Special handling for Strategic Innovation Fund (SIF) - ID 2
    const sifGrant = allGrants.find(g => g.id === 2);
    if (sifGrant) {
      console.log('Updating Strategic Innovation Fund (SIF) image');
      await updateGrantImage(2, 'https://images.unsplash.com/photo-1565373679579-96c6628e267a?auto=format&fit=crop&w=500&h=280&q=80');
    }
    
    // Fix grants with placeholder images
    let updatedCount = 0;
    for (const grant of grantsWithPlaceholders) {
      console.log(`Updating ${grant.title} (ID: ${grant.id})`);
      const newImageUrl = getRelevantImage(grant);
      await updateGrantImage(grant.id, newImageUrl);
      updatedCount++;
    }
    
    console.log(`Successfully updated ${updatedCount} grants with more relevant images`);
    
  } catch (error) {
    console.error('Error in fixPlaceholderImages:', error);
    throw error;
  }
}

// Run the main function
fixPlaceholderImages().catch(console.error);