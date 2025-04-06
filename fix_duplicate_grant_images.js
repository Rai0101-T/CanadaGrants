// Script to fix grants with duplicate images

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

async function fixDuplicateImages() {
  try {
    // Fix grants that share the same generic image URL (especially those with IDs 227-235)
    
    // 1. Clean Growth Program - ID 227 - Clean Technology
    console.log('Updating Clean Growth Program (ID: 227)');
    await updateGrantImage(227, 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80');
    
    // 2. Energy Innovation Program - ID 228 - Energy
    console.log('Updating Energy Innovation Program (ID: 228)');
    await updateGrantImage(228, 'https://images.unsplash.com/photo-1559087867-ce4c91325525?auto=format&fit=crop&w=500&h=280&q=80');
    
    // 3. Advanced Manufacturing Fund - ID 229 (already updated in previous script)
    
    // 4. Digital Industries Supercluster - ID 230 - Technology
    console.log('Updating Digital Industries Supercluster (ID: 230)');
    await updateGrantImage(230, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&h=280&q=80');
    
    // 5. Protein Industries Supercluster - ID 231 - Agriculture
    console.log('Updating Protein Industries Supercluster (ID: 231)');
    await updateGrantImage(231, 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&h=280&q=80');
    
    // 6. Ocean Supercluster - ID 232 - Ocean Technology
    console.log('Updating Ocean Supercluster (ID: 232)');
    await updateGrantImage(232, 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=500&h=280&q=80');
    
    // 7. Scale AI Supercluster - ID 233 - Artificial Intelligence
    console.log('Updating Scale AI Supercluster (ID: 233)');
    await updateGrantImage(233, 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=500&h=280&q=80');
    
    // 8. Health Research Foundation Grant - ID 234 - Healthcare
    console.log('Updating Health Research Foundation Grant (ID: 234)');
    await updateGrantImage(234, 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=500&h=280&q=80');
    
    // 9. Tourism Growth Program - ID 235 - Tourism
    console.log('Updating Tourism Growth Program (ID: 235)');
    await updateGrantImage(235, 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=500&h=280&q=80');
    
    // Fix a few more important grants with mismatched images
    
    // 10. Canadian Clean Technology Innovation Adoption Initiative - ID 126
    console.log('Updating Canadian Clean Technology Innovation Adoption Initiative (ID: 126)');
    await updateGrantImage(126, 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=500&h=280&q=80');
    
    // 11. Sustainable Development Technology Canada (SDTC) Funding - ID 252
    console.log('Updating Sustainable Development Technology Canada (SDTC) Funding (ID: 252)');
    await updateGrantImage(252, 'https://images.unsplash.com/photo-1524126886073-10a7e9aacf99?auto=format&fit=crop&w=500&h=280&q=80');
    
    // 12. BDC Technology Financing - ID 262
    console.log('Updating BDC Technology Financing (ID: 262)');
    await updateGrantImage(262, 'https://images.unsplash.com/photo-1581089781785-603411fa81e5?auto=format&fit=crop&w=500&h=280&q=80');
    
    // 13. BDC Women in Technology Venture Fund - ID 263
    console.log('Updating BDC Women in Technology Venture Fund (ID: 263)');
    await updateGrantImage(263, 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=500&h=280&q=80');
    
    console.log('All duplicate grant images fixed successfully!');
    
  } catch (error) {
    console.error('Error in fixDuplicateImages:', error);
    throw error;
  }
}

// Run the main function
fixDuplicateImages().catch(console.error);