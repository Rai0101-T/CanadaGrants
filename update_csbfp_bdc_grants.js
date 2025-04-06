// Script to update images for CSBFP, BDC and related grants from the list

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

// Map of grant program names to high-quality images
const grantImageMap = {
  // Federal Programs
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
  "Innovation Canada": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&h=280&q=80", // Innovation
  
  // Provincial Programs
  "Small Business Enterprise Centres": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=500&h=280&q=80", // Small business
  "SBEC": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=500&h=280&q=80", // Small business
  "Ontario Centres of Excellence": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=500&h=280&q=80", // Research excellence
  "OCE": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=500&h=280&q=80", // Research excellence
  "Ontario Together Fund": "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=500&h=280&q=80", // Ontario collaboration
  "BC Launch Online": "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=500&h=280&q=80", // Online business in BC
  "BC Employer Training": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=500&h=280&q=80", // Employee training
  "Innovate BC": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=500&h=280&q=80", // BC innovation
  "Alberta Innovates": "https://images.unsplash.com/photo-1579621970590-9d624316904b?auto=format&fit=crop&w=500&h=280&q=80", // Alberta innovation
  "Business Link": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&h=280&q=80", // Business connections
  "Tax Credits for E-business": "https://images.unsplash.com/photo-1586486413729-490a659e5392?auto=format&fit=crop&w=500&h=280&q=80", // E-business tax
  "TCEB": "https://images.unsplash.com/photo-1586486413729-490a659e5392?auto=format&fit=crop&w=500&h=280&q=80", // E-business tax
  "Quebec Economic Development Program": "https://images.unsplash.com/photo-1526626607369-f55c0d292c28?auto=format&fit=crop&w=500&h=280&q=80", // Quebec development
  "QEDP": "https://images.unsplash.com/photo-1526626607369-f55c0d292c28?auto=format&fit=crop&w=500&h=280&q=80", // Quebec development
  "PME MTL": "https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&w=500&h=280&q=80", // Montreal business
  "Manitoba Technology": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=500&h=280&q=80", // Manitoba tech
  "Saskatchewan Technology Startup": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=500&h=280&q=80", // Sask startups
  "STSI": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=500&h=280&q=80", // Sask startups
  "Atlantic Canada Opportunities": "https://images.unsplash.com/photo-1577130858549-c9ae60aa3a2b?auto=format&fit=crop&w=500&h=280&q=80", // Atlantic Canada
  "ACOA": "https://images.unsplash.com/photo-1577130858549-c9ae60aa3a2b?auto=format&fit=crop&w=500&h=280&q=80", // Atlantic Canada
  "Ignite Program": "https://images.unsplash.com/photo-1562577309-2592ab84b1bc?auto=format&fit=crop&w=500&h=280&q=80", // Nova Scotia ignite
  "NB Growth Program": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=500&h=280&q=80", // New Brunswick
  
  // Industry-Specific Programs
  "Canadian Agricultural Partnership": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=500&h=280&q=80", // Agriculture
  "AgriInnovate": "https://images.unsplash.com/photo-1498579485796-98be3abc076e?auto=format&fit=crop&w=500&h=280&q=80", // Agriculture innovation
  "Clean Growth Hub": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80", // Clean growth
  "Green Municipal Fund": "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=500&h=280&q=80", // Green municipal
  "Digital Skills for Youth": "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=500&h=280&q=80", // Youth digital skills
  "Next Generation Manufacturing": "https://images.unsplash.com/photo-1581093450021-a7a0e4511dcf?auto=format&fit=crop&w=500&h=280&q=80", // Advanced manufacturing
  "NGen": "https://images.unsplash.com/photo-1581093450021-a7a0e4511dcf?auto=format&fit=crop&w=500&h=280&q=80", // Advanced manufacturing
  "Investments in Forest Industry": "https://images.unsplash.com/photo-1622652126914-887b56c48de6?auto=format&fit=crop&w=500&h=280&q=80", // Forestry
  "IFIT": "https://images.unsplash.com/photo-1622652126914-887b56c48de6?auto=format&fit=crop&w=500&h=280&q=80", // Forestry
  "Aboriginal Business and Entrepreneurship": "https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&w=500&h=280&q=80", // Indigenous business
  "Indigenous Skills and Employment": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&h=280&q=80", // Indigenous skills
  
  // Private Organizations
  "RBC Small Business": "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=500&h=280&q=80", // RBC
  "Scotiabank Women Initiative": "https://images.unsplash.com/photo-1567427361984-0cbe7396fc6c?auto=format&fit=crop&w=500&h=280&q=80", // Scotiabank
  "Starter Company Plus": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&h=280&q=80", // Startup
  "Spin Master Innovation": "https://images.unsplash.com/photo-1629904853893-c2c8c2417cbf?auto=format&fit=crop&w=500&h=280&q=80", // Innovation fund
  "Creative Destruction Lab": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=500&h=280&q=80", // Innovation lab
  "DMZ at Ryerson": "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?auto=format&fit=crop&w=500&h=280&q=80", // Ryerson
  "MaRS Venture": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&h=280&q=80", // Venture services
  "Next Canada": "https://images.unsplash.com/photo-1544207240-596ca88ad927?auto=format&fit=crop&w=500&h=280&q=80", // Canada innovation
  
  // Additional Resources
  "Western Economic Diversification": "https://images.unsplash.com/photo-1621979298600-8e8d8c2e677b?auto=format&fit=crop&w=500&h=280&q=80", // Western Canada
  "WD": "https://images.unsplash.com/photo-1621979298600-8e8d8c2e677b?auto=format&fit=crop&w=500&h=280&q=80", // Western Canada
  "CEBA": "https://images.unsplash.com/photo-1584931423298-c576fba3ddb3?auto=format&fit=crop&w=500&h=280&q=80" // Emergency business account
};

// Main function to update grant images for programs in the list
async function updateGrantImages() {
  try {
    // Get all grants
    const allGrants = await getAllGrants();
    console.log(`Total grants: ${allGrants.length}`);
    
    // Track grants that were updated
    let updatedCount = 0;
    
    // Check each grant against our image map
    for (const grant of allGrants) {
      let matchFound = false;
      
      // Check for matches in the title
      for (const [keyword, imageUrl] of Object.entries(grantImageMap)) {
        if (grant.title && grant.title.toLowerCase().includes(keyword.toLowerCase())) {
          console.log(`Found match for "${keyword}" in grant #${grant.id}: ${grant.title}`);
          
          // Check if the grant already has this image
          if (grant.imageUrl !== imageUrl) {
            await updateGrantImage(grant.id, imageUrl);
            updatedCount++;
          } else {
            console.log(`Grant #${grant.id} already has the correct image, skipping`);
          }
          
          matchFound = true;
          break;
        }
      }
      
      // If no match found in title, check description
      if (!matchFound && grant.description) {
        for (const [keyword, imageUrl] of Object.entries(grantImageMap)) {
          if (grant.description.toLowerCase().includes(keyword.toLowerCase())) {
            console.log(`Found match for "${keyword}" in description of grant #${grant.id}: ${grant.title}`);
            
            // Check if the grant already has this image
            if (grant.imageUrl !== imageUrl) {
              await updateGrantImage(grant.id, imageUrl);
              updatedCount++;
            } else {
              console.log(`Grant #${grant.id} already has the correct image, skipping`);
            }
            
            matchFound = true;
            break;
          }
        }
      }
      
      // Add a small delay to avoid overloading the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Successfully updated ${updatedCount} grant images`);
    
  } catch (error) {
    console.error('Error updating grant images:', error);
    throw error;
  }
}

// Run the main function
updateGrantImages().catch(console.error);