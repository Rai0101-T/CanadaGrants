// Script to fix placeholder images with more relevant ones

import fetch from 'node-fetch';

// Function to get all grants
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

// Function to check if an image is likely a placeholder
function isPlaceholderImage(imageUrl, title, industry) {
  // Known generic images
  const genericImages = [
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
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e', // RBC images
    'https://images.unsplash.com/photo-1523296004693-57652e69d035', // Generic health tech
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655', // Generic training
    'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107', // Generic tech
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c', // Generic youth/digital
    'https://images.unsplash.com/photo-1524069290683-0457abfe42c3', // Generic indigenous
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74', // Generic startup
    'https://images.unsplash.com/photo-1525538182201-02cd1909effb', // Generic Atlantic
    'https://images.unsplash.com/photo-1521791136064-7986c2920216', // Generic youth
    'https://images.unsplash.com/photo-1526304760382-3591d3840148', // Generic BMO
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94', // Generic Manulife
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5', // Generic film/media
  ];
  
  if (genericImages.includes(imageUrl)) {
    return true;
  }
  
  // Check image URL for placeholder indicators
  const placeholderTerms = ['placeholder', 'default', 'generic'];
  if (placeholderTerms.some(term => imageUrl.toLowerCase().includes(term))) {
    return true;
  }
  
  // Check for industry mismatch
  if (industry) {
    const industryKeywords = {
      'Agriculture': ['farm', 'field', 'crop', 'agricult'],
      'Technology': ['tech', 'computer', 'coding', 'digital'],
      'Film and Television': ['film', 'camera', 'movie', 'television'],
      'Healthcare': ['health', 'medical', 'hospital', 'doctor'],
      'Tourism': ['tourism', 'travel', 'vacation', 'destination'],
      'Manufacturing': ['factory', 'manufacturing', 'industrial', 'machinery'],
      'Clean Technology': ['clean', 'green', 'renewable', 'sustainable'],
    };
    
    const relevantKeywords = industryKeywords[industry] || [];
    if (relevantKeywords.length > 0) {
      // If none of the relevant keywords are in the image URL
      if (!relevantKeywords.some(keyword => imageUrl.toLowerCase().includes(keyword))) {
        return true;
      }
    }
  }
  
  return false;
}

// Function to determine a more relevant image based on grant details
function getRelevantImage(grant) {
  // Map of industries to relevant image URLs
  const industryImages = {
    'Agriculture': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&h=280&q=80',
    'Technology': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&h=280&q=80',
    'Healthcare & Life Sciences': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&h=280&q=80',
    'Film and Television': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&h=280&q=80',
    'Ocean Technology': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=500&h=280&q=80',
    'Digital Media': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&h=280&q=80',
    'Clean Technology': 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=500&h=280&q=80',
    'Tourism': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=500&h=280&q=80',
    'Manufacturing': 'https://images.unsplash.com/photo-1567789884554-0b844b40c56a?auto=format&fit=crop&w=500&h=280&q=80',
    'Forestry': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&h=280&q=80',
    'Mining': 'https://images.unsplash.com/photo-1525285308994-70d7799c1c38?auto=format&fit=crop&w=500&h=280&q=80',
    'Creative Industries': 'https://images.unsplash.com/photo-1489533119213-66a5cd877091?auto=format&fit=crop&w=500&h=280&q=80',
  };
  
  // Special case mappings for specific organizations/programs
  const organizationImages = {
    'RBC': 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=500&h=280&q=80',
    'BMO': 'https://images.unsplash.com/photo-1563237023-b1e970526dcb?auto=format&fit=crop&w=500&h=280&q=80',
    'Manulife': 'https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=500&h=280&q=80',
    'Bell': 'https://images.unsplash.com/photo-1503797172751-773fce6c5af1?auto=format&fit=crop&w=500&h=280&q=80',
    'Aboriginal': 'https://images.unsplash.com/photo-1578320340830-e4ec8a05fb42?auto=format&fit=crop&w=500&h=280&q=80',
    'Indigenous': 'https://images.unsplash.com/photo-1635402614035-94e624df3c4b?auto=format&fit=crop&w=500&h=280&q=80',
    'Youth': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&h=280&q=80',
    'Women': 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=500&h=280&q=80',
    'Atlantic': 'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=500&h=280&q=80',
    'Quebec': 'https://images.unsplash.com/photo-1519181245277-cffeb31da2e3?auto=format&fit=crop&w=500&h=280&q=80',
    'Ontario': 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?auto=format&fit=crop&w=500&h=280&q=80',
    'Saskatchewan': 'https://images.unsplash.com/photo-1583784561126-f84839fea6f4?auto=format&fit=crop&w=500&h=280&q=80',
    'Alberta': 'https://images.unsplash.com/photo-1565055658670-b8919d43e8c9?auto=format&fit=crop&w=500&h=280&q=80',
    'British Columbia': 'https://images.unsplash.com/photo-1546498159-9a2fac87e770?auto=format&fit=crop&w=500&h=280&q=80',
    'Startup': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&h=280&q=80',
    'Small Business': 'https://images.unsplash.com/photo-1565514820079-2f16e6383068?auto=format&fit=crop&w=500&h=280&q=80',
    'Education': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=500&h=280&q=80',
    'Skills': 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=500&h=280&q=80',
    'Tax Credit': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&h=280&q=80',
    'Arctic': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=500&h=280&q=80',
  };
  
  // First, try to match by industry
  if (grant.industry && industryImages[grant.industry]) {
    return industryImages[grant.industry];
  }
  
  // Then, try to match by organization/program name in the title
  for (const [keyword, imageUrl] of Object.entries(organizationImages)) {
    if (grant.title.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Specific grant-by-grant manual matching for selected problem grants
  const specificGrantImages = {
    17: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=500&h=280&q=80', // RBC Future Launch Scholarship
    27: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=500&h=280&q=80', // Mental Health Technology Initiative
    46: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&w=500&h=280&q=80', // BC Employer Training Grant
    49: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=500&h=280&q=80', // Quebec Tax Credits for E-business
    62: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=500&h=280&q=80', // Digital Skills for Youth
    61: 'https://images.unsplash.com/photo-1516262350579-138cbc97dc2d?auto=format&fit=crop&w=500&h=280&q=80', // Aboriginal Business
    66: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&h=280&q=80', // Saskatchewan Technology Startup
    67: 'https://images.unsplash.com/photo-1486938631716-3edc99a317cb?auto=format&fit=crop&w=500&h=280&q=80', // Atlantic Canada Opportunities Agency
    73: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?auto=format&fit=crop&w=500&h=280&q=80', // Youth Employment and Skills
    133: 'https://images.unsplash.com/photo-1601933470096-0e34634ffcde?auto=format&fit=crop&w=500&h=280&q=80', // BMO Social Innovation Fund
    137: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=500&h=280&q=80', // Manulife Education and Skills Fund
    166: 'https://images.unsplash.com/photo-1618329027137-a520b57c6606?auto=format&fit=crop&w=500&h=280&q=80', // Quebec Film and Television
    167: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=500&h=280&q=80', // Nova Scotia Ocean Technology
    169: 'https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?auto=format&fit=crop&w=500&h=280&q=80', // Saskatchewan Creative Industries
    179: 'https://images.unsplash.com/photo-1520507215037-061ed0f37178?auto=format&fit=crop&w=500&h=280&q=80', // FedNor
    236: 'https://images.unsplash.com/photo-1454923634634-bd1614719a7b?auto=format&fit=crop&w=500&h=280&q=80', // RBC Future Launch
    257: 'https://images.unsplash.com/photo-1535904058090-ebb2d699b716?auto=format&fit=crop&w=500&h=280&q=80', // Canadian Agricultural Partnership
    258: 'https://images.unsplash.com/photo-1593510987046-1f8fcfc0c64c?auto=format&fit=crop&w=500&h=280&q=80', // RBC Small Business Grants
    140: 'https://images.unsplash.com/photo-1557187666-4fd2a8c3439b?auto=format&fit=crop&w=500&h=280&q=80', // Bell Education Fund
  };
  
  if (specificGrantImages[grant.id]) {
    return specificGrantImages[grant.id];
  }
  
  // Default image for all other cases
  return 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&h=280&q=80';
}

// Main function to fix placeholder images
async function fixPlaceholderImages() {
  try {
    // Get all grants
    const allGrants = await getAllGrants();
    console.log(`Total grants: ${allGrants.length}`);
    
    // Find grants with placeholder images
    const grantsWithPlaceholders = allGrants.filter(grant => 
      isPlaceholderImage(grant.imageUrl, grant.title, grant.industry)
    );
    
    console.log(`Found ${grantsWithPlaceholders.length} grants with placeholder images`);
    
    // Only process grants with IDs greater than 222 since we already processed up to that ID
    const remainingGrants = grantsWithPlaceholders.filter(grant => grant.id > 222);
    console.log(`Processing ${remainingGrants.length} remaining grants (IDs > 222)`);
    
    // Update each grant with a more relevant image
    let updatedCount = 0;
    for (const grant of remainingGrants) {
      const relevantImage = getRelevantImage(grant);
      console.log(`\nUpdating grant #${grant.id}: ${grant.title}`);
      console.log(`  From: ${grant.imageUrl}`);
      console.log(`    To: ${relevantImage}`);
      
      await updateGrantImage(grant.id, relevantImage);
      updatedCount++;
      
      // Add a small delay to avoid overloading the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\nSuccessfully updated ${updatedCount} grants with relevant images`);
    
  } catch (error) {
    console.error('Error fixing placeholder images:', error);
    throw error;
  }
}

// Run the main function
fixPlaceholderImages().catch(console.error);