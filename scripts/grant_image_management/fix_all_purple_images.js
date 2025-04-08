// Script to identify and replace all grants with predominantly purple images

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
  // Collection of high-quality, industry-specific images
  const industryImages = {
    // Tech & Innovation
    'technology': [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'digital': [
      'https://images.unsplash.com/photo-1496065187959-7f07b8353c55?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'innovation': [
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1456428746267-a1756408f782?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Environment & Sustainability
    'environment': [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'sustainability': [
      'https://images.unsplash.com/photo-1444628838545-ac4016a5418e?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1471958680802-1345a694ba6d?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'climate': [
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1590055531217-e64de873a899?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Business & Entrepreneurship
    'business': [
      'https://images.unsplash.com/photo-1573497491765-55a64cc0ddd4?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'entrepreneur': [
      'https://images.unsplash.com/photo-1521791055366-0d553381ad47?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'startup': [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Finance
    'finance': [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'financial': [
      'https://images.unsplash.com/photo-1563237023-b1e970526dcb?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1565514732366-5571808272ce?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Health & Medical
    'health': [
      'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1513224502586-d1e602410265?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'medical': [
      'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Education & Research
    'education': [
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'research': [
      'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1579567761406-4684ee0c75b6?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Community & Social
    'community': [
      'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1537543525161-deb7c64c8082?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'social': [
      'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1519748771818-a94f371ecf0f?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Agriculture & Food
    'agriculture': [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'food': [
      'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Manufacturing & Industry
    'manufacturing': [
      'https://images.unsplash.com/photo-1566937169390-7be4c63b8a0e?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1533750446969-255b5e7d6221?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1574472374272-26e91165e036?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'industrial': [
      'https://images.unsplash.com/photo-1518244698661-87cbef75f590?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Energy
    'energy': [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1581905764498-f1b60bae941a?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'renewable': [
      'https://images.unsplash.com/photo-1559087867-ce4c91325525?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1548336271-6c2839c4b074?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Arts & Culture
    'art': [
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'culture': [
      'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Diversity & Inclusion
    'diversity': [
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1521791055366-0d553381ad47?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'inclusion': [
      'https://images.unsplash.com/photo-1582213782179-e0d4d3cce817?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'indigenous': [
      'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'women': [
      'https://images.unsplash.com/photo-1573497019236-61f1c43c8158?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'youth': [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b40?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Tourism & Hospitality
    'tourism': [
      'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    'travel': [
      'https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1501446529957-6226bd447c46?auto=format&fit=crop&w=500&h=280&q=80'
    ],
    
    // Default images
    'default': [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1521791055366-0d553381ad47?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=500&h=280&q=80',
      'https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&w=500&h=280&q=80'
    ]
  };
  
  // Company-specific images (if needed)
  const companyImages = {
    'BMO': 'https://images.unsplash.com/photo-1565514732414-75d109fc0422?auto=format&fit=crop&w=500&h=280&q=80',
    'TD': 'https://images.unsplash.com/photo-1565514732429-91506ac4d785?auto=format&fit=crop&w=500&h=280&q=80',
    'RBC': 'https://images.unsplash.com/photo-1566230603202-bda262bc01e1?auto=format&fit=crop&w=500&h=280&q=80',
    'CIBC': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&h=280&q=80',
    'Scotiabank': 'https://images.unsplash.com/photo-1553707256-eae9108a8fd1?auto=format&fit=crop&w=500&h=280&q=80',
    'Rogers': 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=500&h=280&q=80',
    'Bell': 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&w=500&h=280&q=80',
    'TELUS': 'https://images.unsplash.com/photo-1562565652-7a69e5a98e47?auto=format&fit=crop&w=500&h=280&q=80',
    'Walmart': 'https://images.unsplash.com/photo-1605217613423-0eed533c252b?auto=format&fit=crop&w=500&h=280&q=80',
    'Canadian Tire': 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=500&h=280&q=80'
  };
  
  // First check for company-specific images
  if (grant.fundingOrganization) {
    for (const [company, imageUrl] of Object.entries(companyImages)) {
      if (grant.fundingOrganization.includes(company)) {
        return imageUrl;
      }
    }
  }
  
  // Search for industry-specific matches in grant data
  const checkIndustryMatches = (text) => {
    if (!text) return null;
    const textLower = text.toLowerCase();
    
    for (const [industry, images] of Object.entries(industryImages)) {
      if (textLower.includes(industry.toLowerCase())) {
        // Get a stable image based on grant ID to avoid duplicates
        const imageIndex = grant.id % images.length;
        return images[imageIndex];
      }
    }
    return null;
  };
  
  // Check in different grant fields with priority
  const industryMatch = 
    (grant.industry && checkIndustryMatches(grant.industry)) ||
    (grant.category && checkIndustryMatches(grant.category)) ||
    (grant.title && checkIndustryMatches(grant.title)) ||
    (grant.description && checkIndustryMatches(grant.description));
  
  if (industryMatch) {
    return industryMatch;
  }
  
  // Fallback to default business images
  const defaultIndex = grant.id % industryImages.default.length;
  return industryImages.default[defaultIndex];
}

// List of image URL patterns that are predominantly purple
const purpleImagePatterns = [
  'photo-1579621970795-87facc2f976d',
  'photo-1579621970563-ebec7560ff3e',
  'photo-1530136823201-a30b809e7258',
  'photo-1578836537282-3171d77f8632',
  'photo-1507608869274-d3177c8bb4c7',  // Dark purple/blue
  'photo-1557682250-f5b61c8a3b6a',     // Purple-toned
  'photo-1620641788421-7a1c342ea42e',  // Purple flowers
  'photo-1559027615-cd4628902d4a',     // Purple-tinted
  'photo-1566093097221-ac2335b09e80',  // Lavender fields
  'photo-1618172193763-c511deb635ca',  // Purple tone
  'photo-1548407260-da850faa41e3',     // Purple lighting
  'photo-1614850715661-902fd7e93c25',  // Purple digital
  'photo-1550745165-9bc0b252726f',     // Purple tech
  'photo-1550063873-ab792950096b'      // Purple space
];

// Function to check if a grant has a purple image
function hasPurpleImage(grant) {
  if (!grant.imageUrl) return false;
  
  // Check if the image URL contains any of the purple patterns
  for (const pattern of purpleImagePatterns) {
    if (grant.imageUrl.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

// Main function to update all purple images
async function updateAllPurpleImages() {
  try {
    console.log('Fetching all grants...');
    
    // Get all grants
    const federalGrants = await getGrantsByType('federal');
    const provincialGrants = await getGrantsByType('provincial');
    const privateGrants = await getGrantsByType('private');
    
    console.log(`Retrieved ${federalGrants.length} federal grants.`);
    console.log(`Retrieved ${provincialGrants.length} provincial grants.`);
    console.log(`Retrieved ${privateGrants.length} private grants.`);
    
    // Combine all grants
    const allGrants = [...federalGrants, ...provincialGrants, ...privateGrants];
    console.log(`Total grants: ${allGrants.length}`);
    
    // Find grants with purple images
    const grantsWithPurpleImages = allGrants.filter(hasPurpleImage);
    
    if (grantsWithPurpleImages.length === 0) {
      console.log('\nNo grants with purple images found!');
      return;
    }
    
    console.log(`\nFound ${grantsWithPurpleImages.length} grants with purple images:`);
    
    // Update each grant with a more appropriate image
    for (const grant of grantsWithPurpleImages) {
      console.log(`\nGrant ID ${grant.id}: ${grant.title}`);
      console.log(`Type: ${grant.type}, Industry: ${grant.industry || 'Not specified'}`);
      console.log(`Current image (purple): ${grant.imageUrl}`);
      
      // Get a better image
      const newImageUrl = getBestImageForGrant(grant);
      console.log(`New image: ${newImageUrl}`);
      
      // Update the grant image
      await updateGrantImage(grant.id, newImageUrl);
    }
    
    console.log('\nAll purple grant images have been replaced with relevant images!');
  
  } catch (error) {
    console.error('Error in updateAllPurpleImages:', error);
    throw error;
  }
}

// Run the main function
updateAllPurpleImages().catch(console.error);