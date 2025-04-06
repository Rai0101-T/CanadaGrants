// Script to update images for a specific subset of important grants from the list

import fetch from 'node-fetch';

// List of specific grants we want to update from the document
const targetGrants = [
  "Canada Small Business Financing Program", 
  "CSBFP",
  "Business Development Bank of Canada", 
  "BDC",
  "Industrial Research Assistance Program",
  "IRAP",
  "CanExport",
  "Futurpreneur",
  "Women Entrepreneurship Strategy",
  "WES",
  "Strategic Innovation Fund",
  "Sustainable Development Technology Canada",
  "SDTC",
  "Canada Digital Adoption Program",
  "Aboriginal Business and Entrepreneurship Development",
  "Indigenous Skills and Employment"
];

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

// Map of grant program names to high-quality images
const grantImageMap = {
  "Canada Small Business Financing Program": "https://images.unsplash.com/photo-1551135049-8a33b5883817?auto=format&fit=crop&w=500&h=280&q=80", // Small business financing
  "CSBFP": "https://images.unsplash.com/photo-1551135049-8a33b5883817?auto=format&fit=crop&w=500&h=280&q=80", // Small business financing
  "Business Development Bank of Canada": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&h=280&q=80", // Business development
  "BDC": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&h=280&q=80", // Business development
  "Industrial Research Assistance Program": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=500&h=280&q=80", // Research and innovation
  "IRAP": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=500&h=280&q=80", // Research and innovation
  "CanExport": "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c7?auto=format&fit=crop&w=500&h=280&q=80", // Export and international
  "Futurpreneur": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&h=280&q=80", // Young entrepreneurs
  "Women Entrepreneurship Strategy": "https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?auto=format&fit=crop&w=500&h=280&q=80", // Women entrepreneurs
  "WES": "https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?auto=format&fit=crop&w=500&h=280&q=80", // Women entrepreneurs
  "Strategic Innovation Fund": "https://images.unsplash.com/photo-1565373679579-96c6628e267a?auto=format&fit=crop&w=500&h=280&q=80", // Innovation
  "Sustainable Development Technology": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80", // Sustainable technology
  "SDTC": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80", // Sustainable technology
  "Canada Digital Adoption Program": "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=500&h=280&q=80", // Digital technology
  "Aboriginal Business and Entrepreneurship": "https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&w=500&h=280&q=80", // Indigenous business
  "Indigenous Skills and Employment": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&h=280&q=80" // Indigenous skills
};

// Main function to update grant images for specific target grants
async function updateTargetGrantImages() {
  try {
    // Get all grants
    const allGrants = await getAllGrants();
    console.log(`Total grants: ${allGrants.length}`);
    
    // Filter grants that might match our target list
    const potentialGrants = allGrants.filter(grant => {
      // Check if grant title contains any of our target keywords
      return targetGrants.some(keyword => 
        grant.title.toLowerCase().includes(keyword.toLowerCase()) ||
        (grant.description && grant.description.toLowerCase().includes(keyword.toLowerCase()))
      );
    });
    
    console.log(`Found ${potentialGrants.length} grants matching our target keywords`);
    
    // Track grants that were updated
    let updatedCount = 0;
    
    // Process each potential grant
    for (const grant of potentialGrants) {
      console.log(`Processing grant #${grant.id}: ${grant.title}`);
      let bestMatch = null;
      let bestKeyword = null;
      
      // Find the best matching keyword for this grant
      for (const keyword of targetGrants) {
        if (grant.title.toLowerCase().includes(keyword.toLowerCase()) || 
            (grant.description && grant.description.toLowerCase().includes(keyword.toLowerCase()))) {
          
          // If we found a match and have an image for it
          if (grantImageMap[keyword]) {
            bestMatch = grantImageMap[keyword];
            bestKeyword = keyword;
            break; // Take the first match for simplicity
          }
        }
      }
      
      // If we found a match with an image
      if (bestMatch && bestKeyword) {
        console.log(`Matched "${bestKeyword}" for grant #${grant.id}: ${grant.title}`);
        
        // Check if the grant already has this image
        if (grant.imageUrl !== bestMatch) {
          await updateGrantImage(grant.id, bestMatch);
          updatedCount++;
        } else {
          console.log(`Grant #${grant.id} already has the correct image, skipping`);
        }
      }
      
      // Add a small delay to avoid overloading the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Successfully updated ${updatedCount} target grant images`);
    
  } catch (error) {
    console.error('Error updating grant images:', error);
    throw error;
  }
}

// Run the main function
updateTargetGrantImages().catch(console.error);