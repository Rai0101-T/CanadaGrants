// Script to update grant images with more specific industry-related images

import fetch from 'node-fetch';

// Array of industry-specific images for different grant types
const federalImages = [
  'https://images.unsplash.com/photo-1568438350562-2cae6d394ad0?auto=format&fit=crop&w=500&h=280&q=80', // Canadian flag
  'https://images.unsplash.com/photo-1604778202557-91a5da781bb8?auto=format&fit=crop&w=500&h=280&q=80', // Parliament buildings
  'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&w=500&h=280&q=80', // Ottawa
  'https://images.unsplash.com/photo-1494947665470-20322015e3a8?auto=format&fit=crop&w=500&h=280&q=80', // Canadian mountains
  'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=500&h=280&q=80', // Toronto cityscape
  'https://images.unsplash.com/photo-1532554996830-89c48092e533?auto=format&fit=crop&w=500&h=280&q=80', // Government building
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=500&h=280&q=80', // CN Tower
];

const provincialImages = {
  'Alberta': [
    'https://images.unsplash.com/photo-1484555493813-88ac0f667f0c?auto=format&fit=crop&w=500&h=280&q=80', // Alberta mountains
    'https://images.unsplash.com/photo-1568943223232-b89447b033db?auto=format&fit=crop&w=500&h=280&q=80', // Calgary
    'https://images.unsplash.com/photo-1507276976645-a0ec9a8bd7c8?auto=format&fit=crop&w=500&h=280&q=80', // Edmonton
  ],
  'British Columbia': [
    'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=500&h=280&q=80', // Vancouver
    'https://images.unsplash.com/photo-1501552478524-0ca7b07c795f?auto=format&fit=crop&w=500&h=280&q=80', // BC forests
    'https://images.unsplash.com/photo-1462888210965-cdf193fb74de?auto=format&fit=crop&w=500&h=280&q=80', // Victoria
  ],
  'Manitoba': [
    'https://images.unsplash.com/photo-1513130616277-de0980add193?auto=format&fit=crop&w=500&h=280&q=80', // Winnipeg
    'https://images.unsplash.com/photo-1536750303930-b87f129b06d6?auto=format&fit=crop&w=500&h=280&q=80', // Manitoba plains
  ],
  'New Brunswick': [
    'https://images.unsplash.com/photo-1564868453618-13ef6bc2a8c9?auto=format&fit=crop&w=500&h=280&q=80', // Saint John
    'https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?auto=format&fit=crop&w=500&h=280&q=80', // NB coastline
  ],
  'Newfoundland and Labrador': [
    'https://images.unsplash.com/photo-1591407319836-3f7ac3b801dd?auto=format&fit=crop&w=500&h=280&q=80', // St. John's
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=500&h=280&q=80', // NL coastline
  ],
  'Nova Scotia': [
    'https://images.unsplash.com/photo-1532467227905-90e94a5b9b1c?auto=format&fit=crop&w=500&h=280&q=80', // Halifax
    'https://images.unsplash.com/photo-1550434784-b792717e6c7e?auto=format&fit=crop&w=500&h=280&q=80', // Peggy's Cove
  ],
  'Ontario': [
    'https://images.unsplash.com/photo-1507992781348-310259076fe0?auto=format&fit=crop&w=500&h=280&q=80', // Toronto
    'https://images.unsplash.com/photo-1567273140279-eff3d78283e1?auto=format&fit=crop&w=500&h=280&q=80', // Niagara Falls
    'https://images.unsplash.com/photo-1516037859495-3fe45811aac9?auto=format&fit=crop&w=500&h=280&q=80', // Ottawa
  ],
  'Prince Edward Island': [
    'https://images.unsplash.com/photo-1578518445583-d978b35d4448?auto=format&fit=crop&w=500&h=280&q=80', // Charlottetown
    'https://images.unsplash.com/photo-1511047169262-deaa04bfcebb?auto=format&fit=crop&w=500&h=280&q=80', // PEI coastline
  ],
  'Quebec': [
    'https://images.unsplash.com/photo-1519872775884-29a6fea271ca?auto=format&fit=crop&w=500&h=280&q=80', // Montreal
    'https://images.unsplash.com/photo-1518131945814-40f7e5c42fb0?auto=format&fit=crop&w=500&h=280&q=80', // Quebec City
    'https://images.unsplash.com/photo-1578449838118-ae9e4a3804d5?auto=format&fit=crop&w=500&h=280&q=80', // Old Quebec
  ],
  'Saskatchewan': [
    'https://images.unsplash.com/photo-1591475644232-51a72f13901e?auto=format&fit=crop&w=500&h=280&q=80', // Regina
    'https://images.unsplash.com/photo-1534671114-01a1eb2fc46f?auto=format&fit=crop&w=500&h=280&q=80', // Saskatchewan plains
    'https://images.unsplash.com/photo-1579841258357-c3681c421a64?auto=format&fit=crop&w=500&h=280&q=80', // Saskatoon
  ],
  'Northwest Territories': [
    'https://images.unsplash.com/photo-1557687829-a5f23330c099?auto=format&fit=crop&w=500&h=280&q=80', // Yellowknife
    'https://images.unsplash.com/photo-1518464841617-9a1fa12a4fb3?auto=format&fit=crop&w=500&h=280&q=80', // Northern lights
  ],
  'Yukon': [
    'https://images.unsplash.com/photo-1578177050116-68d3856d01be?auto=format&fit=crop&w=500&h=280&q=80', // Yukon mountains
    'https://images.unsplash.com/photo-1608678321977-fe785e2896cb?auto=format&fit=crop&w=500&h=280&q=80', // Whitehorse
  ],
  'Nunavut': [
    'https://images.unsplash.com/photo-1574465663481-994247c0626d?auto=format&fit=crop&w=500&h=280&q=80', // Iqaluit
    'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=500&h=280&q=80', // Arctic
  ]
};

const industryImages = {
  'Technology': [
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&h=280&q=80', // Tech
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&h=280&q=80', // Code
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&h=280&q=80', // Data
  ],
  'Agriculture': [
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&h=280&q=80', // Farm
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&h=280&q=80', // Crops
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=500&h=280&q=80', // Tractor
  ],
  'Manufacturing': [
    'https://images.unsplash.com/photo-1578775887804-699de7086ff9?auto=format&fit=crop&w=500&h=280&q=80', // Factory
    'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=500&h=280&q=80', // Assembly
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=500&h=280&q=80', // Industrial
  ],
  'Healthcare': [
    'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=500&h=280&q=80', // Medical
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&h=280&q=80', // Healthcare
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=500&h=280&q=80', // Lab
  ],
  'Renewable Energy': [
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80', // Solar panels
    'https://images.unsplash.com/photo-1467533003447-e295ff1b0435?auto=format&fit=crop&w=500&h=280&q=80', // Wind turbines
    'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?auto=format&fit=crop&w=500&h=280&q=80', // Green energy
  ],
  'Tourism': [
    'https://images.unsplash.com/photo-1525811902-f2342640856e?auto=format&fit=crop&w=500&h=280&q=80', // Tourism
    'https://images.unsplash.com/photo-1564689510742-4e9c7584181d?auto=format&fit=crop&w=500&h=280&q=80', // Travel
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=500&h=280&q=80', // Tourist
  ],
  'Education': [
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&h=280&q=80', // Education
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&h=280&q=80', // Students
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=500&h=280&q=80', // Learning
  ],
  'Arts': [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=500&h=280&q=80', // Art
    'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?auto=format&fit=crop&w=500&h=280&q=80', // Painting
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=500&h=280&q=80', // Culture
  ],
  'Indigenous': [
    'https://images.unsplash.com/photo-1607706189492-2867f3c28c76?auto=format&fit=crop&w=500&h=280&q=80', // Indigenous art
    'https://images.unsplash.com/photo-1505236273555-ffe2748ad1a0?auto=format&fit=crop&w=500&h=280&q=80', // Indigenous culture
    'https://images.unsplash.com/photo-1532634786-c8f8c46a0062?auto=format&fit=crop&w=500&h=280&q=80', // First Nations
  ],
  'Entrepreneurship': [
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=500&h=280&q=80', // Startup
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&h=280&q=80', // Business
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&h=280&q=80', // Entrepreneur
  ],
  'Research': [
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=500&h=280&q=80', // Research
    'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=500&h=280&q=80', // Lab
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=500&h=280&q=80', // Science
  ]
};

const privateImages = [
  'https://images.unsplash.com/photo-1553901753-215db344677a?auto=format&fit=crop&w=500&h=280&q=80', // Corporate
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=500&h=280&q=80', // Business
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&h=280&q=80', // Office
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&h=280&q=80', // Handshake
  'https://images.unsplash.com/photo-1570126618953-d437176e8c79?auto=format&fit=crop&w=500&h=280&q=80', // Business meeting
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&h=280&q=80', // CEO
  'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=500&h=280&q=80', // Business team
];

// Get a random image from an array
function getRandomImage(imageArray) {
  return imageArray[Math.floor(Math.random() * imageArray.length)];
}

// Function to update a grant's image
async function updateGrantImage(id, imageUrl) {
  try {
    const response = await fetch('http://localhost:3000/api/admin/grants/update-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, imageUrl })
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Updated grant #${id} image successfully`);
    return data;
  } catch (error) {
    console.error(`Failed to update grant #${id} image:`, error);
    throw error;
  }
}

// Main function to update grant images based on type, province, and industry
async function updateGrantImages() {
  try {
    // Fetch all grants
    const response = await fetch('http://localhost:3000/api/grants');
    const grants = await response.json();
    
    console.log(`Found ${grants.length} grants to process`);
    
    // Process each grant
    for (const grant of grants) {
      let selectedImage = '';
      
      // Select image based on grant properties
      if (grant.type === 'federal') {
        selectedImage = getRandomImage(federalImages);
      } else if (grant.type === 'provincial' && grant.province) {
        const provinceImages = provincialImages[grant.province];
        if (provinceImages) {
          selectedImage = getRandomImage(provinceImages);
        }
      } else if (grant.type === 'private') {
        selectedImage = getRandomImage(privateImages);
      }
      
      // If we have an industry, we could potentially use that image instead
      if (grant.industry && industryImages[grant.industry]) {
        // 50% chance to use industry image if available
        if (Math.random() > 0.5) {
          selectedImage = getRandomImage(industryImages[grant.industry]);
        }
      }
      
      // If we still don't have an image, use a generic one
      if (!selectedImage) {
        selectedImage = 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=500&h=280&q=80';
      }
      
      // Only update if the image is different
      if (selectedImage !== grant.imageUrl) {
        await updateGrantImage(grant.id, selectedImage);
        
        // Add a small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('Grant image update process completed successfully');
  } catch (error) {
    console.error('Error updating grant images:', error);
  }
}

// Run the update process
updateGrantImages().catch(console.error);