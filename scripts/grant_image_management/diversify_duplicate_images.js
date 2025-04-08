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

// Function to update a grant's image URL
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
      throw new Error(`Error updating grant image: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to update image for grant ID ${id}:`, error);
    return null;
  }
}

// Function to get a more appropriate image based on grant details
function getIndustrySpecificImage(grant, index) {
  const { title, type, industry, organization } = grant;
  
  // Industry-specific images for different variations
  const industryVariations = {
    'Technology': [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568952433726-3896e3881c65?q=80&w=2940&auto=format&fit=crop'
    ],
    'Agriculture': [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1625114086951-a393c93d0610?q=80&w=2940&auto=format&fit=crop'
    ],
    'Manufacturing': [
      'https://images.unsplash.com/photo-1630728874169-8c4d7733fba4?q=80&w=2871&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574144113323-5e713ebbf90a?q=80&w=2944&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565611424208-7e1d7f80dff4?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2940&auto=format&fit=crop'
    ],
    'Healthcare': [
      'https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=2786&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2952&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?q=80&w=2940&auto=format&fit=crop'
    ],
    'Environment': [
      'https://images.unsplash.com/photo-1610555356070-d0efcf770471?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1473773508845-188df298d2d1?q=80&w=2940&auto=format&fit=crop'
    ],
    'Film & Media': [
      'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=2874&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?q=80&w=2946&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567789884554-0b844b40c56a?q=80&w=2940&auto=format&fit=crop'
    ],
    'Tourism': [
      'https://images.unsplash.com/photo-1510253687831-9e3e85b91f40?q=80&w=2942&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507608616040-a5db07ecff6a?q=80&w=2942&auto=format&fit=crop'
    ],
    'Energy': [
      'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?q=80&w=2870&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509391417963-7ad6c5150cc5?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494522358652-f30e61a60313?q=80&w=2940&auto=format&fit=crop'
    ],
    'Small Business': [
      'https://images.unsplash.com/photo-1589443865183-59fe669c7a06?q=80&w=2876&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604594849809-dfedbc827105?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2970&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604594849809-dfedbc827105?q=80&w=2940&auto=format&fit=crop'
    ],
    'Business': [
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1498468639783-2775406b5960?q=80&w=2940&auto=format&fit=crop'
    ],
    'Research': [
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554475900-0a0350e3fc7b?q=80&w=2946&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598965402089-897b2dc5a9e1?q=80&w=2948&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2940&auto=format&fit=crop'
    ],
    'Federal': [
      'https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1575971637203-d6aeb66a84fd?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548428605-f82e592cb070?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=2960&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1575517111839-3a3843d7d28d?q=80&w=2832&auto=format&fit=crop'
    ],
    'Provincial': [
      'https://images.unsplash.com/photo-1610555356070-d0efcf770471?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1561560392-f65de34fb33e?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1472791108553-c9405341e398?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494522358652-f30e61a60313?q=80&w=2940&auto=format&fit=crop'
    ],
    'Other': [
      'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579912437766-19561f8f61d4?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554774853-b415df9eeb92?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2940&auto=format&fit=crop'
    ]
  };
  
  // Determine which category to use
  let category = 'Other';
  if (industry) {
    // Check for industry matches
    for (const [key, _] of Object.entries(industryVariations)) {
      if (industry.includes(key) || title.includes(key)) {
        category = key;
        break;
      }
    }
  } else if (type === 'federal') {
    category = 'Federal';
  } else if (type === 'provincial') {
    category = 'Provincial';
  } else if (title.toLowerCase().includes('business')) {
    category = 'Business';
  } else if (title.toLowerCase().includes('research')) {
    category = 'Research';
  }
  
  // Get the appropriate image array
  const imageArray = industryVariations[category] || industryVariations['Other'];
  
  // Use the index to get a specific image, or fallback to modulo if index is too large
  const imageIndex = index % imageArray.length;
  return imageArray[imageIndex];
}

// Main function to diversify duplicate images
async function diversifyDuplicateImages() {
  const grants = await getAllGrants();
  
  if (!grants.length) {
    console.log('No grants found or could not connect to the API');
    return;
  }
  
  console.log(`Analyzing ${grants.length} grants for duplicate images...`);
  
  // Create a map of image URLs to their corresponding grants
  const imageUrlMap = {};
  grants.forEach(grant => {
    if (grant.imageUrl) {
      if (!imageUrlMap[grant.imageUrl]) {
        imageUrlMap[grant.imageUrl] = [];
      }
      imageUrlMap[grant.imageUrl].push(grant);
    }
  });
  
  // Filter for image URLs used by multiple grants
  const duplicateImages = Object.entries(imageUrlMap)
    .filter(([_, grantsWithImage]) => grantsWithImage.length > 1)
    .sort((a, b) => b[1].length - a[1].length); // Sort by frequency (highest first)
  
  console.log(`Found ${duplicateImages.length} image URLs used by multiple grants`);
  
  if (duplicateImages.length === 0) {
    console.log('No duplicate images found. All grants have unique images!');
    return;
  }
  
  // Create list of grants to update
  const grantsToUpdate = [];
  
  duplicateImages.forEach(([imageUrl, grantsWithImage]) => {
    console.log(`\nImage: ${imageUrl} is used by ${grantsWithImage.length} grants:`);
    
    // Keep the first grant with this image URL as is (index 0)
    console.log(`- Keeping original image for: ${grantsWithImage[0].title} (ID: ${grantsWithImage[0].id})`);
    
    // Update all other grants with this image URL (starting from index 1)
    grantsWithImage.slice(1).forEach((grant, index) => {
      const newImageUrl = getIndustrySpecificImage(grant, index);
      console.log(`- Will update: ${grant.title} (ID: ${grant.id})`);
      console.log(`  From: ${imageUrl}`);
      console.log(`  To:   ${newImageUrl}`);
      
      grantsToUpdate.push({
        id: grant.id,
        title: grant.title,
        type: grant.type,
        industry: grant.industry,
        organization: grant.organization,
        currentImage: grant.imageUrl,
        newImage: newImageUrl
      });
    });
  });
  
  // Write to JSON file
  fs.writeFileSync('duplicate_images_to_update.json', JSON.stringify(grantsToUpdate, null, 2));
  console.log(`\nSaved ${grantsToUpdate.length} grants to update to duplicate_images_to_update.json`);
  
  // Update the grants
  console.log('\nUpdating grant images automatically...');
  
  const updatedGrants = [];
  for (const grant of grantsToUpdate) {
    console.log(`Updating image for Grant ID ${grant.id} - ${grant.title}...`);
    const result = await updateGrantImage(grant.id, grant.newImage);
    if (result) {
      updatedGrants.push({
        id: grant.id,
        title: grant.title,
        oldImage: grant.currentImage,
        newImage: grant.newImage
      });
      console.log(`Success! Updated image for Grant ID ${grant.id}`);
    }
  }
  
  console.log(`\nSuccessfully updated ${updatedGrants.length} of ${grantsToUpdate.length} grants.`);
  
  // Write results to file
  fs.writeFileSync('updated_duplicate_images_results.json', JSON.stringify(updatedGrants, null, 2));
  console.log('Results saved to updated_duplicate_images_results.json');
}

diversifyDuplicateImages();