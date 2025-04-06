// Script to update specific important grants by ID

import fetch from 'node-fetch';

// Define specific grant IDs and the images we want to use
const grantsToUpdate = [
  {
    id: 267, // Canada Small Business Financing Program
    imageUrl: "https://images.unsplash.com/photo-1551135049-8a33b5883817?auto=format&fit=crop&w=500&h=280&q=80"
  },
  {
    id: 61, // Aboriginal Business and Entrepreneurship Development (ABED)
    imageUrl: "https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&w=500&h=280&q=80"
  },
  {
    id: 72, // Strategic Innovation Fund
    imageUrl: "https://images.unsplash.com/photo-1565373679579-96c6628e267a?auto=format&fit=crop&w=500&h=280&q=80"
  }
];

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

// Main function to update specific important grants
async function updateImportantGrants() {
  try {
    console.log(`Updating ${grantsToUpdate.length} important grants`);
    
    let updatedCount = 0;
    
    // Update each grant in our list
    for (const grant of grantsToUpdate) {
      console.log(`Updating grant ID ${grant.id} with new image URL`);
      await updateGrantImage(grant.id, grant.imageUrl);
      updatedCount++;
      
      // Add a small delay to avoid overloading the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Successfully updated ${updatedCount} important grants`);
    
  } catch (error) {
    console.error('Error updating grant images:', error);
    throw error;
  }
}

// Run the main function
updateImportantGrants().catch(console.error);