// Script to update the final remaining grants with generic images

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

// Define the last batch of grants to update
const grantsToUpdate = [
  {
    id: 73, // Youth Employment and Skills Strategy
    imageUrl: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=500&h=280&q=80" // Youth employment
  },
  {
    id: 140, // Bell Education and Skills Fund
    imageUrl: "https://images.unsplash.com/photo-1557187666-4fd2a8c3439b?auto=format&fit=crop&w=500&h=280&q=80" // Education/telecom
  },
  {
    id: 127, // Canadian Digital Media Market Expansion
    imageUrl: "https://images.unsplash.com/photo-1496065187959-7f07b8353c55?auto=format&fit=crop&w=500&h=280&q=80" // Digital media
  },
  {
    id: 146, // Canadian Retail Business Scale-up
    imageUrl: "https://images.unsplash.com/photo-1610527003928-47afdccc34b0?auto=format&fit=crop&w=500&h=280&q=80" // Retail
  },
  {
    id: 134, // BMO Environmental Sustainability Fund
    imageUrl: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=500&h=280&q=80" // Environmental
  },
  {
    id: 186, // Western Economic Diversification Canada
    imageUrl: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&w=500&h=280&q=80" // Western Canada
  },
  {
    id: 198, // Canadian Northern Economic Development Agency
    imageUrl: "https://images.unsplash.com/photo-1572128293406-c7b4df568083?auto=format&fit=crop&w=500&h=280&q=80" // Northern Canada
  },
  {
    id: 206, // Indigenous Skills and Employment Training
    imageUrl: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=500&h=280&q=80" // Indigenous training
  },
  {
    id: 64, // Indigenous Skills and Employment Training Program
    imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=500&h=280&q=80" // Indigenous employment
  },
  {
    id: 260, // BDC Small Business Loan
    imageUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=500&h=280&q=80" // Small business loan
  },
  {
    id: 54, // Spin Master Innovation Fund
    imageUrl: "https://images.unsplash.com/photo-1536148935331-408321065b18?auto=format&fit=crop&w=500&h=280&q=80" // Innovation/toys
  },
  {
    id: 84, // Ontario Tourism Research and Innovation Fund
    imageUrl: "https://images.unsplash.com/photo-1488515398041-8d6ce0d8ff57?auto=format&fit=crop&w=500&h=280&q=80" // Tourism research
  },
  {
    id: 107, // Quebec Tourism Research and Innovation Fund
    imageUrl: "https://images.unsplash.com/photo-1518128958364-65859d70aa41?auto=format&fit=crop&w=500&h=280&q=80" // Quebec tourism
  }
];

// Main function to update important grant images
async function updateImportantGrants() {
  try {
    console.log(`Updating images for ${grantsToUpdate.length} final grants`);
    
    let updatedCount = 0;
    
    // Update each grant in our list
    for (const grant of grantsToUpdate) {
      console.log(`\nUpdating grant ID ${grant.id} with unique image URL`);
      await updateGrantImage(grant.id, grant.imageUrl);
      updatedCount++;
      
      // Add a small delay to avoid overloading the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\nSuccessfully updated ${updatedCount} grants with unique, relevant images`);
    
  } catch (error) {
    console.error('Error updating grant images:', error);
    throw error;
  }
}

// Run the main function
updateImportantGrants().catch(console.error);