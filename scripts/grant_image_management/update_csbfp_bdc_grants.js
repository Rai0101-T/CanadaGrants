// Script to update CSBFP and BDC grants images

import fetch from 'node-fetch';

async function getAllGrants() {
  try {
    const response = await fetch('http://localhost:5000/api/grants/type/federal');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching grants:', error);
    throw error;
  }
}

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

async function updateGrantImages() {
  try {
    const grants = await getAllGrants();
    
    // Find the grants we added
    const csbfpGrant = grants.find(grant => 
      grant.title === "Canada Small Business Financing Program (CSBFP)"
    );
    
    const bdcGrant = grants.find(grant => 
      grant.title === "Business Development Bank of Canada (BDC) Financing"
    );
    
    const nrcIrapGrant = grants.find(grant => 
      grant.title === "NRC Industrial Research Assistance Program (IRAP)"
    );
    
    const canExportGrant = grants.find(grant => 
      grant.title === "CanExport Program"
    );
    
    // Better images for each grant
    if (csbfpGrant) {
      console.log('Updating CSBFP grant image...');
      await updateGrantImage(
        csbfpGrant.id, 
        "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=500&h=280&q=80" // Small business financial support
      );
    } else {
      console.log('CSBFP grant not found');
    }
    
    if (bdcGrant) {
      console.log('Updating BDC grant image...');
      await updateGrantImage(
        bdcGrant.id, 
        "https://images.unsplash.com/photo-1616514197671-15d99ce7253f?auto=format&fit=crop&w=500&h=280&q=80" // Business development
      );
    } else {
      console.log('BDC grant not found');
    }
    
    if (nrcIrapGrant) {
      console.log('Updating NRC IRAP grant image...');
      await updateGrantImage(
        nrcIrapGrant.id, 
        "https://images.unsplash.com/photo-1581093458791-9d22bebe7a02?auto=format&fit=crop&w=500&h=280&q=80" // Research and innovation
      );
    } else {
      console.log('NRC IRAP grant not found');
    }
    
    if (canExportGrant) {
      console.log('Updating CanExport grant image...');
      await updateGrantImage(
        canExportGrant.id, 
        "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=500&h=280&q=80" // Export and global business
      );
    } else {
      console.log('CanExport grant not found');
    }
    
    console.log('All grant images updated successfully!');
    
  } catch (error) {
    console.error('Error in updateGrantImages:', error);
  }
}

// Run the function
updateGrantImages().catch(console.error);