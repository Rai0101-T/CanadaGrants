// Script to fix grants with generic images

import fetch from 'node-fetch';

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

async function fixGenericGrantImages() {
  try {
    // 1. Women Entrepreneurship Strategy (WES) Ecosystem Fund - ID 5
    console.log('Updating Women Entrepreneurship Strategy (WES) Ecosystem Fund (ID: 5)');
    console.log('Current image: https://images.unsplash.com/photo-1454165804606-c3d57bc86b40');
    const wesImageUrl = 'https://images.unsplash.com/photo-1573497019236-61f1c43c8158?auto=format&fit=crop&w=500&h=280&q=80'; // Women in business
    await updateGrantImage(5, wesImageUrl);
    
    // 2. Canadian Digital Media Market Expansion Initiative - ID 127
    console.log('Updating Canadian Digital Media Market Expansion Initiative (ID: 127)');
    console.log('Current image: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab');
    const digitalMediaImageUrl = 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=500&h=280&q=80'; // Digital media concept
    await updateGrantImage(127, digitalMediaImageUrl);
    
    // 3. Canadian Telecommunications Innovation Adoption Initiative - ID 130
    console.log('Updating Canadian Telecommunications Innovation Adoption Initiative (ID: 130)');
    console.log('Current image: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab');
    const telecomImageUrl = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=500&h=280&q=80'; // Telecommunications towers
    await updateGrantImage(130, telecomImageUrl);
    
    // Also fix additional grants that have duplicate generic office building images
    
    // 4. Fix Clean Technology grants
    console.log('Updating Clean Technology grants with better images');
    
    // Sustainable Development Technology Canada (SDTC) - ID 41
    const sdtcImageUrl = 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80';
    await updateGrantImage(41, 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=500&h=280&q=80'); // Solar panels
    
    // Green Municipal Fund (GMF) - ID 59
    const gmfImageUrl = 'https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?auto=format&fit=crop&w=500&h=280&q=80';
    await updateGrantImage(59, 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=500&h=280&q=80'); // Wind energy
    
    // 5. Fix manufacturing grants
    console.log('Updating Manufacturing grants with better images');
    
    // Next Generation Manufacturing Canada (NGen) Supercluster - ID 60
    const ngenImageUrl = 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=500&h=280&q=80';
    await updateGrantImage(60, 'https://images.unsplash.com/photo-1518641301689-2a2849e8e7e0?auto=format&fit=crop&w=500&h=280&q=80'); // Advanced manufacturing
    
    // Advanced Manufacturing Fund - ID 229
    await updateGrantImage(229, 'https://images.unsplash.com/photo-1533630757306-cbadb934bcb1?auto=format&fit=crop&w=500&h=280&q=80'); // Modern manufacturing
    
    console.log('All generic grant images updated successfully!');
    
  } catch (error) {
    console.error('Error in fixGenericGrantImages:', error);
    throw error;
  }
}

// Run the main function
fixGenericGrantImages().catch(console.error);