// Script to identify grants with generic or less specific images

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

// Function to get all grants
async function getAllGrants() {
  const federalGrants = await getGrantsByType('federal');
  const provincialGrants = await getGrantsByType('provincial');
  const privateGrants = await getGrantsByType('private');
  return [...federalGrants, ...provincialGrants, ...privateGrants];
}

// Patterns of generic images
const genericImagePatterns = [
  'photo-1521791055366-0d553381ad47', // Generic business people
  'photo-1560472354-b33ff0c44a43', // Generic building/office
  'photo-1486406146926-c627a92ad1ab', // Generic office buildings
  'photo-1553484771-371a605b060b', // Generic business meeting
  'photo-1455849318743-b2233052fcff', // Generic desk
  'photo-1573497019940-1c28c88b4f3e', // Generic business person
  'photo-1573497019236-61f1c43c8158', // Generic business woman
  'photo-1622556498246-755f44ca76f3', // Generic nature
  'photo-1579403124614-197f69d8187b', // Generic business
  'photo-1531973576160-7125cd663d86', // Generic laptop
  'photo-1542744173-8e7e53415bb0', // Generic business people meeting
  'photo-1507679799987-c73779587ccf', // Generic businessman
  'photo-1579389083078-4e7c73979726', // Generic businesswoman
  'photo-1454165804606-c3d57bc86b40', // Generic finance
  'photo-1454165205744-3b78555e5572', // Generic finance/money
  'photo-1501139083538-0139583c060f', // Generic cityscape
  'photo-1528559188037-3a9487ebaba8'  // Generic handshake
];

// Industry-specific keywords to identify mismatched images
const industryKeywords = {
  'agriculture': ['farm', 'farming', 'crop', 'harvest', 'field'],
  'technology': ['tech', 'digital', 'software', 'computer', 'IT'],
  'healthcare': ['health', 'medical', 'hospital', 'clinic', 'doctor', 'nurse'],
  'education': ['university', 'school', 'college', 'student', 'classroom', 'education'],
  'manufacturing': ['factory', 'production', 'manufacturing', 'industrial'],
  'energy': ['renewable', 'energy', 'solar', 'wind', 'power'],
  'tourism': ['tourism', 'travel', 'hotel', 'hospitality'],
  'arts': ['art', 'film', 'music', 'theatre', 'creative', 'cultural'],
  'environment': ['environment', 'green', 'sustainability', 'climate'],
  'indigenous': ['indigenous', 'first nations', 'aboriginal', 'métis', 'inuit']
};

// Function to check if an image is generic
function isGenericImage(imageUrl) {
  if (!imageUrl) return false;
  
  for (const pattern of genericImagePatterns) {
    if (imageUrl.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

// Function to check if an image matches the grant's industry focus
function hasIndustryMismatch(grant) {
  if (!grant.industry || !grant.imageUrl) return false;
  
  const grantIndustryLower = grant.industry.toLowerCase();
  
  // Check if the grant has an industry we're tracking
  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    // If the grant is in this industry
    if (grantIndustryLower.includes(industry)) {
      // Check if the image URL contains any of the relevant keywords
      const matchesIndustry = keywords.some(keyword => 
        grant.imageUrl.toLowerCase().includes(keyword)
      );
      
      // If the grant has a specific industry but the image doesn't match it
      if (!matchesIndustry) {
        return true;
      }
    }
  }
  
  return false;
}

// Main function to find grants with generic images
async function identifyGenericImages() {
  try {
    console.log('Fetching all grants...');
    const allGrants = await getAllGrants();
    console.log(`Total grants: ${allGrants.length}`);
    
    // Identify grants with generic images
    const grantsWithGenericImages = allGrants.filter(grant => isGenericImage(grant.imageUrl));
    
    console.log(`\nFound ${grantsWithGenericImages.length} grants with generic images:`);
    grantsWithGenericImages.forEach(grant => {
      console.log(`\nGrant ID ${grant.id}: ${grant.title}`);
      console.log(`Type: ${grant.type}, Industry: ${grant.industry || 'Not specified'}`);
      console.log(`Current image: ${grant.imageUrl}`);
    });
    
    // Identify grants with industry mismatch
    const grantsWithIndustryMismatch = allGrants.filter(grant => 
      !isGenericImage(grant.imageUrl) && hasIndustryMismatch(grant)
    );
    
    console.log(`\nFound ${grantsWithIndustryMismatch.length} grants with industry-image mismatches:`);
    grantsWithIndustryMismatch.forEach(grant => {
      console.log(`\nGrant ID ${grant.id}: ${grant.title}`);
      console.log(`Type: ${grant.type}, Industry: ${grant.industry || 'Not specified'}`);
      console.log(`Current image: ${grant.imageUrl}`);
    });
    
    // Identify grants with no clear industry in their image
    const industriesWithCommonImages = {};
    
    allGrants.forEach(grant => {
      if (grant.industry && grant.imageUrl) {
        const industry = grant.industry.toLowerCase();
        industriesWithCommonImages[industry] = industriesWithCommonImages[industry] || [];
        industriesWithCommonImages[industry].push({
          id: grant.id,
          title: grant.title,
          imageUrl: grant.imageUrl
        });
      }
    });
    
    // Print 10 most common images used for an industry (to identify potential duplicates)
    console.log('\nMost duplicated images by industry:');
    for (const [industry, grants] of Object.entries(industriesWithCommonImages)) {
      if (grants.length >= 3) {
        // Count occurrences of each image URL
        const imageCounts = {};
        grants.forEach(grant => {
          imageCounts[grant.imageUrl] = (imageCounts[grant.imageUrl] || 0) + 1;
        });
        
        // Find duplicated images (used more than once)
        const duplicatedImages = Object.entries(imageCounts)
          .filter(([_, count]) => count > 1)
          .sort(([_, countA], [__, countB]) => countB - countA);
        
        if (duplicatedImages.length > 0) {
          console.log(`\nIndustry: ${industry}`);
          duplicatedImages.forEach(([imageUrl, count]) => {
            console.log(`Image used ${count} times: ${imageUrl}`);
            // List grants using this image
            const grantsWithImage = grants.filter(g => g.imageUrl === imageUrl);
            grantsWithImage.forEach(g => {
              console.log(`  - Grant ID ${g.id}: ${g.title}`);
            });
          });
        }
      }
    }
    
  } catch (error) {
    console.error('Error in identifyGenericImages:', error);
    throw error;
  }
}

// Run the main function
identifyGenericImages().catch(console.error);