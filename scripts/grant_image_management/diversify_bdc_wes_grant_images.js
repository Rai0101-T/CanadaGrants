// Script to diversify images for BDC and WES grants that currently share the same image

import fetch from 'node-fetch';

// Define specific grant IDs to update with unique images
const grantsToUpdate = [
  // BDC grants - currently all using the same image
  {
    id: 32, // Business Development Bank of Canada (BDC) Financing Programs
    imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=500&h=280&q=80" // Business funding
  },
  {
    id: 247, // BDC Business Loans
    imageUrl: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=500&h=280&q=80" // Loans/financing
  },
  {
    id: 260, // BDC Small Business Loan
    imageUrl: "https://images.unsplash.com/photo-1523540939399-141cbff6a8d7?auto=format&fit=crop&w=500&h=280&q=80" // Small business
  },
  {
    id: 261, // BDC Working Capital Loan
    imageUrl: "https://images.unsplash.com/photo-1565514820079-2f16e6383068?auto=format&fit=crop&w=500&h=280&q=80" // Working capital
  },
  {
    id: 262, // BDC Technology Financing
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&h=280&q=80" // Tech financing
  },
  {
    id: 263, // BDC Women in Technology Venture Fund
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&h=280&q=80" // Women in tech
  },
  {
    id: 264, // BDC Growth & Transition Capital
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&h=280&q=80" // Business growth
  },
  
  // WES grants - currently all using the same image
  {
    id: 36, // Women Entrepreneurship Strategy (WES) Ecosystem Fund
    imageUrl: "https://images.unsplash.com/photo-1560264280-88b68371db39?auto=format&fit=crop&w=500&h=280&q=80" // Woman entrepreneur
  },
  {
    id: 175, // FedDev Ontario Women Entrepreneurship Strategy
    imageUrl: "https://images.unsplash.com/photo-1573495804664-b1c0849e5498?auto=format&fit=crop&w=500&h=280&q=80" // Women in business
  },
  {
    id: 185, // WD Women Entrepreneurship Strategy
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&h=280&q=80" // Women in business
  },
  {
    id: 190, // ACOA Women Entrepreneurship Strategy
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&h=280&q=80" // Business
  },
  {
    id: 195, // CED Women Entrepreneurship Strategy
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=500&h=280&q=80" // Woman entrepreneur
  },
  
  // Non-women-specific grants that were incorrectly using the WES image
  {
    id: 163, // Arctic Energy Alliance Programs
    imageUrl: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=500&h=280&q=80" // Arctic/energy
  },
  {
    id: 183, // WD Regional Innovation Ecosystem
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&h=280&q=80" // Innovation ecosystem
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

// Main function to diversify grant images
async function diversifyGrantImages() {
  try {
    console.log(`Diversifying images for ${grantsToUpdate.length} grants`);
    
    let updatedCount = 0;
    
    // Update each grant in our list
    for (const grant of grantsToUpdate) {
      console.log(`Updating grant ID ${grant.id} with unique image URL`);
      await updateGrantImage(grant.id, grant.imageUrl);
      updatedCount++;
      
      // Add a small delay to avoid overloading the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Successfully updated ${updatedCount} grants with unique images`);
    
  } catch (error) {
    console.error('Error diversifying grant images:', error);
    throw error;
  }
}

// Run the main function
diversifyGrantImages().catch(console.error);