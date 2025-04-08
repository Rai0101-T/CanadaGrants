// Script to fix the final batch of grants with generic or placeholder images

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

// Define specific grant IDs to update with unique images
const grantsToUpdate = [
  // Tourism-related grants need more diverse images
  {
    id: 85, // Ontario Tourism Business Expansion Fund
    imageUrl: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=500&h=280&q=80" // Tourism business
  },
  {
    id: 86, // Ontario Tourism Skills Training Fund
    imageUrl: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=500&h=280&q=80" // Tourism skills
  },
  {
    id: 87, // Ontario Tourism Capital Investment Fund
    imageUrl: "https://images.unsplash.com/photo-1568849676085-51415703900f?auto=format&fit=crop&w=500&h=280&q=80" // Tourism investment
  },
  {
    id: 88, // Ontario Tourism Start-up Support Fund
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=500&h=280&q=80" // Tourism startup
  },
  {
    id: 108, // Quebec Tourism Community Economic Development Fund
    imageUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=500&h=280&q=80" // Quebec tourism
  },
  {
    id: 235, // Tourism Growth Program
    imageUrl: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=500&h=280&q=80" // Tourism growth
  },
  
  // Private grants
  {
    id: 17, // RBC Future Launch Scholarship
    imageUrl: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=500&h=280&q=80" // Education scholarship
  },
  {
    id: 236, // RBC Future Launch
    imageUrl: "https://images.unsplash.com/photo-1454923634634-bd1614719a7b?auto=format&fit=crop&w=500&h=280&q=80" // Career development
  },
  {
    id: 133, // BMO Social Innovation Fund
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&h=280&q=80" // Innovation
  },
  {
    id: 137, // Manulife Education and Skills Fund
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=500&h=280&q=80" // Education/skills
  },
  
  // Specific industry grants
  {
    id: 27, // Mental Health Technology Initiative
    imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=500&h=280&q=80" // Mental health
  },
  {
    id: 46, // BC Employer Training Grant
    imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=500&h=280&q=80" // Training
  },
  {
    id: 61, // Aboriginal Business and Entrepreneurship Development
    imageUrl: "https://images.unsplash.com/photo-1578320340830-e4ec8a05fb42?auto=format&fit=crop&w=500&h=280&q=80" // Indigenous business
  },
  {
    id: 67, // Atlantic Canada Opportunities Agency (ACOA) Programs
    imageUrl: "https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=500&h=280&q=80" // Atlantic Canada
  },
  {
    id: 73, // Youth Employment and Skills Strategy
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&h=280&q=80" // Youth skills
  },
  {
    id: 167, // Nova Scotia Ocean Technology Tax Credit
    imageUrl: "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=500&h=280&q=80" // Ocean tech
  },
  {
    id: 169, // Saskatchewan Creative Industries Production Grant
    imageUrl: "https://images.unsplash.com/photo-1489533119213-66a5cd877091?auto=format&fit=crop&w=500&h=280&q=80" // Creative industry
  },
  {
    id: 179, // FedNor Community Economic Development
    imageUrl: "https://images.unsplash.com/photo-1547480053-7d174f67b557?auto=format&fit=crop&w=500&h=280&q=80" // Northern development
  },
  {
    id: 257, // Canadian Agricultural Partnership Programs
    imageUrl: "https://images.unsplash.com/photo-1535904058090-ebb2d699b716?auto=format&fit=crop&w=500&h=280&q=80" // Agriculture
  },
  {
    id: 258, // RBC Small Business Grants
    imageUrl: "https://images.unsplash.com/photo-1593510987046-1f8fcfc0c64c?auto=format&fit=crop&w=500&h=280&q=80" // Small business
  }
];

// Main function to fix final batch of grant images
async function fixFinalGrantImages() {
  try {
    console.log(`Updating images for ${grantsToUpdate.length} grants`);
    
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
fixFinalGrantImages().catch(console.error);