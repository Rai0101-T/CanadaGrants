// Script to update all private grants that still have purple-tinted images

import fetch from 'node-fetch';

// Function to get all grants by type
async function getGrantsByType(type) {
  try {
    const response = await fetch(`http://localhost:5000/api/grants/type/${type}`);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type} grants:`, error);
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

// Function to get the best image for a grant based on its details
function getBestImageForGrant(grant) {
  // Collection of industry-specific images
  const industryImages = {
    // Tech & Innovation
    'technology': [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'innovation': [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'digital': [
      'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Environment & Sustainability
    'environment': [
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1482685945432-29a7abf2f466?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'sustainability': [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'green': [
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1542044801-30d3938bd08e?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'clean': [
      'https://images.unsplash.com/photo-1548612324-58e18587beb1?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1566808907248-bdbcd7f9f34a?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Business & Entrepreneurship
    'business': [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1536825871665-3da895a0ea83?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'entrepreneur': [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'startup': [
      'https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Finance & Investment
    'finance': [
      'https://images.unsplash.com/photo-1638913662252-70efce1e60a7?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1626266061368-46a8f578ddd6?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'investment': [
      'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1565514269262-c9187ecef514?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'financial': [
      'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1613843452161-b0138b5dff23?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Health & Wellness
    'health': [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'medical': [
      'https://images.unsplash.com/photo-1580281657702-257584239a55?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1579154341098-e4e157cc0b8c?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'wellness': [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Education & Research
    'education': [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1610484826917-0f191a579f3f?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'research': [
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'training': [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Community & Social
    'community': [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1544374063-b90ca8e271ee?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'social': [
      'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1582213782179-e0d4d3cce817?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'nonprofit': [
      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1469571486292-b53601010b89?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Agriculture & Rural
    'agriculture': [
      'https://images.unsplash.com/photo-1626855140462-c1ca758fa131?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1594639788616-9002dd395d01?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1627920250564-10542d4b5bfa?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'rural': [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'farming': [
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Manufacturing & Industry
    'manufacturing': [
      'https://images.unsplash.com/photo-1513828583688-c52646f9b5d9?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1531954671991-56a24e565aa6?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'industrial': [
      'https://images.unsplash.com/photo-1524297581255-340c79c386d3?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1533630654593-b211793e929b?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Energy
    'energy': [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1518031695620-83f4ed0fcb0e?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'renewable': [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1526391922840-891b87f9af1b?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Culture & Arts
    'art': [
      'https://images.unsplash.com/photo-1548196191-c29ea752e8c2?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1578926288207-a90a5366759d?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'culture': [
      'https://images.unsplash.com/photo-1552084117-56a987a363ff?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'creative': [
      'https://images.unsplash.com/photo-1583125869805-5f7bfc9a266b?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1547480053-7d174f67b557?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Diversity & Inclusion
    'diversity': [
      'https://images.unsplash.com/photo-1573497620599-15707438bf8a?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1531384370088-696a34ea1a9a?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1582213782179-e0d4d3cce817?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'inclusion': [
      'https://images.unsplash.com/photo-1553484771-898ed465e931?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1484712401471-05c7215830eb?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'indigenous': [
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1533659124865-d6072dc035e1?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'women': [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1530141243742-5411e2d714f3?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'youth': [
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1623197937030-8d7adb456abd?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Tourism & Hospitality
    'tourism': [
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1503221043305-f7498f8b7888?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'hospitality': [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Default fallback images (business-related)
    'default': [
      'https://images.unsplash.com/photo-1460794418188-1bb7dba2720d?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=500&h=280&q=80'
    ]
  };
  
  // Collection of company-specific images
  const companyImages = {
    'BMO': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&h=280&q=80',
    'TD': 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=500&h=280&q=80',
    'RBC': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&h=280&q=80',
    'CIBC': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=500&h=280&q=80',
    'Scotiabank': 'https://images.unsplash.com/photo-1589666564459-93cdd3ab856a?auto=format&fit=crop&w=500&h=280&q=80',
    'Rogers': 'https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b?auto=format&fit=crop&w=500&h=280&q=80',
    'Bell': 'https://images.unsplash.com/photo-1553406830-ef409b69b4dc?auto=format&fit=crop&w=500&h=280&q=80',
    'TELUS': 'https://images.unsplash.com/photo-1562565652-7a69e5a98e47?auto=format&fit=crop&w=500&h=280&q=80',
    'Walmart': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=500&h=280&q=80',
    'Canadian Tire': 'https://images.unsplash.com/photo-1581245277873-be0e693bb2ef?auto=format&fit=crop&w=500&h=280&q=80',
    'Home Depot': 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=500&h=280&q=80',
    'Loblaw': 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=500&h=280&q=80',
    'Shell': 'https://images.unsplash.com/photo-1603063949452-234854028328?auto=format&fit=crop&w=500&h=280&q=80',
    'Manulife': 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=500&h=280&q=80',
    'Sun Life': 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=500&h=280&q=80',
    'IBM': 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=500&h=280&q=80',
    'Google': 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=500&h=280&q=80',
    'Microsoft': 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=500&h=280&q=80',
    'Shopify': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500&h=280&q=80',
    'Desjardins': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=500&h=280&q=80'
  };
  
  // Check if we have a company-specific image
  if (grant.fundingOrganization) {
    for (const [company, imageUrl] of Object.entries(companyImages)) {
      if (grant.fundingOrganization.includes(company)) {
        return imageUrl;
      }
    }
  }
  
  // Check for industry-specific images
  const checkIndustryMatches = (text) => {
    if (!text) return null;
    
    const textLower = text.toLowerCase();
    
    for (const [industry, images] of Object.entries(industryImages)) {
      if (textLower.includes(industry.toLowerCase())) {
        // Get a stable image based on grant ID as a crude way to avoid duplicates
        const imageIndex = grant.id % images.length;
        return images[imageIndex];
      }
    }
    
    return null;
  };
  
  // Check in order of specificity
  const industryMatch = 
    (grant.industry && checkIndustryMatches(grant.industry)) ||
    (grant.category && checkIndustryMatches(grant.category)) ||
    (grant.title && checkIndustryMatches(grant.title)) ||
    (grant.description && checkIndustryMatches(grant.description));
  
  if (industryMatch) {
    return industryMatch;
  }
  
  // Fallback to default business images if nothing else matches
  const defaultIndex = grant.id % industryImages.default.length;
  return industryImages.default[defaultIndex];
}

// Function to detect if a grant has a purple-tinted image
function hasPurpleTintedImage(grant) {
  // A grant may have a purple tint if it's from an unsplash image with either:
  // 1. A specific pattern in the URL that we know gives purple tint
  // 2. Or if it has a specific industry that tends to get purple images
  if (!grant.imageUrl || !grant.imageUrl.includes('unsplash.com')) {
    return false;
  }
  
  // Specific URLs that tend to have purple tints
  const purpleTintedImagePatterns = [
    'photo-1605217613423-0eed533c252b',
    'photo-1579621970795-87facc2f976d',
    'photo-1579621970563-ebec7560ff3e'
  ];
  
  // Check if the image URL matches any of the known purple-tinted patterns
  for (const pattern of purpleTintedImagePatterns) {
    if (grant.imageUrl.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

// Main function to update all grants with purple-tinted images
async function updatePurpleTintedImages() {
  try {
    console.log('Fetching all grants...');
    
    // Get all grants by type
    const federalGrants = await getGrantsByType('federal');
    const provincialGrants = await getGrantsByType('provincial');
    const privateGrants = await getGrantsByType('private');
    
    console.log(`Retrieved ${federalGrants.length} federal grants.`);
    console.log(`Retrieved ${provincialGrants.length} provincial grants.`);
    console.log(`Retrieved ${privateGrants.length} private grants.`);
    
    // Combine all grants
    const allGrants = [...federalGrants, ...provincialGrants, ...privateGrants];
    console.log(`Total grants: ${allGrants.length}`);
    
    // Find grants with purple-tinted images
    const grantsWithPurpleTint = allGrants.filter(hasPurpleTintedImage);
    
    if (grantsWithPurpleTint.length === 0) {
      console.log('\nNo grants with purple-tinted images found!');
      return;
    }
    
    console.log(`\nFound ${grantsWithPurpleTint.length} grants with purple-tinted images:`);
    
    // Update each grant with a more relevant image
    for (const grant of grantsWithPurpleTint) {
      console.log(`\nGrant ID ${grant.id}: ${grant.title}`);
      console.log(`Current image: ${grant.imageUrl}`);
      
      // Get the best image for this grant
      const newImageUrl = getBestImageForGrant(grant);
      console.log(`New image: ${newImageUrl}`);
      
      // Update the grant's image
      await updateGrantImage(grant.id, newImageUrl);
    }
    
    console.log('\nAll purple-tinted grant images have been updated!');
    
  } catch (error) {
    console.error('Error in updatePurpleTintedImages:', error);
    throw error;
  }
}

// Run the main function
updatePurpleTintedImages().catch(console.error);