// Script to update private grant images for specific companies

import fetch from 'node-fetch';

// Company-specific images mapped to company names (case-insensitive matching)
const companyImages = {
  'rogers': 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=500&h=280&q=80', // Telecommunications/technology
  'td bank': 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=500&h=280&q=80', // Green building (TD brand color)
  'bmo': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&h=280&q=80', // Blue building (BMO brand color)
  'cibc': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500&h=280&q=80', // Red-themed business (CIBC brand color)
  'manulife': 'https://images.unsplash.com/photo-1515303904633-4b9e0b1c3e41?auto=format&fit=crop&w=500&h=280&q=80', // Green forest (Manulife green brand)
  'sunlife': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&h=280&q=80', // Sunrise/sunset landscape (Sunlife)
  'bell': 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a?auto=format&fit=crop&w=500&h=280&q=80', // Communication towers (Bell)
  'ibm': 'https://images.unsplash.com/photo-1496096265110-f83ad7f96608?auto=format&fit=crop&w=500&h=280&q=80', // Blue tech/data center (IBM)
  'google': 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=500&h=280&q=80', // Colorful modern office (Google)
  'walmart': 'https://images.unsplash.com/photo-1595745879380-5d4432958871?auto=format&fit=crop&w=500&h=280&q=80', // Retail/shopping (Walmart)
};

// Function to update a grant's image
async function updateGrantImage(id, imageUrl) {
  try {
    const response = await fetch('http://localhost:5000/api/admin/grants/update-image', {
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
    console.log(`Updated grant #${id} image successfully to: ${imageUrl}`);
    return data;
  } catch (error) {
    console.error(`Failed to update grant #${id} image:`, error);
    throw error;
  }
}

// Main function to update private company grant images
async function updatePrivateCompanyGrants() {
  try {
    // Fetch all grants
    const response = await fetch('http://localhost:5000/api/grants/type/private');
    const grants = await response.json();
    
    console.log(`Found ${grants.length} private grants to process`);
    
    // Keep track of used images to avoid duplicates
    const usedImages = new Set();
    
    // Process each private grant
    for (const grant of grants) {
      // Check if the grant title or organization contains any of our target companies
      const companyMatches = Object.keys(companyImages).filter(company => 
        (grant.title && grant.title.toLowerCase().includes(company.toLowerCase())) || 
        (grant.organization && grant.organization.toLowerCase().includes(company.toLowerCase())) ||
        (grant.fundingOrganization && grant.fundingOrganization.toLowerCase().includes(company.toLowerCase()))
      );
      
      if (companyMatches.length > 0) {
        // Get the first match
        const matchedCompany = companyMatches[0];
        let selectedImage = companyImages[matchedCompany];
        
        // Check if image is already used
        if (usedImages.has(selectedImage)) {
          console.log(`Image for ${matchedCompany} already used, finding alternative...`);
          // Try to find an unused image for any other company
          const unusedImage = Object.entries(companyImages).find(([_, img]) => !usedImages.has(img));
          if (unusedImage) {
            selectedImage = unusedImage[1];
          }
        }
        
        // Update the grant with the selected image
        console.log(`Updating grant "${grant.title}" (ID: ${grant.id}) with ${matchedCompany} image`);
        await updateGrantImage(grant.id, selectedImage);
        
        // Mark image as used
        usedImages.add(selectedImage);
        
        // Add a small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    console.log('Private company grant image update completed successfully');
  } catch (error) {
    console.error('Error updating private company grant images:', error);
  }
}

// Run the update process
updatePrivateCompanyGrants().catch(console.error);