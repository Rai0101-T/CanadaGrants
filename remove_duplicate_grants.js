// Script to remove duplicate grants from the database

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

// Function to delete a grant by ID
async function deleteGrant(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/admin/grants/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete grant ${id}: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log(`Successfully deleted grant ${id}: ${result.message}`);
    return result;
  } catch (error) {
    console.error(`Error deleting grant ${id}:`, error);
    throw error;
  }
}

// Function to find and remove duplicate grants
async function removeDuplicateGrants() {
  try {
    // Get all grants
    const allGrants = await getAllGrants();
    console.log(`Total grants: ${allGrants.length}`);

    // Group grants by title (case insensitive)
    const grantsByTitle = new Map();
    
    allGrants.forEach(grant => {
      const normalizedTitle = grant.title.toLowerCase().trim();
      if (!grantsByTitle.has(normalizedTitle)) {
        grantsByTitle.set(normalizedTitle, []);
      }
      grantsByTitle.get(normalizedTitle).push(grant);
    });

    console.log(`Found ${grantsByTitle.size} unique grant titles`);

    // Find duplicates
    const duplicateSets = Array.from(grantsByTitle.entries())
      .filter(([_, grants]) => grants.length > 1);
      
    console.log(`Found ${duplicateSets.length} duplicate grant sets`);

    // Process each set of duplicates
    let totalRemoved = 0;
    
    for (const [title, grants] of duplicateSets) {
      console.log(`\nProcessing duplicates for: ${grants[0].title} (${grants.length} copies)`);
      console.log(`IDs: ${grants.map(g => g.id).join(', ')}`);
      
      // Keep the first grant (usually the most complete one)
      // and delete the rest
      const keepGrant = grants[0];
      const duplicatesToRemove = grants.slice(1);
      
      console.log(`Keeping grant ID ${keepGrant.id}, removing ${duplicatesToRemove.length} duplicates`);
      
      // Delete each duplicate
      for (const dupGrant of duplicatesToRemove) {
        try {
          await deleteGrant(dupGrant.id);
          totalRemoved++;
        } catch (error) {
          console.error(`Failed to delete grant ${dupGrant.id}, continuing with others`);
        }
      }
    }
    
    console.log(`\nRemoval complete. Removed ${totalRemoved} duplicate grants.`);
    console.log(`Original count: ${allGrants.length}, New count: ${allGrants.length - totalRemoved}`);
    
  } catch (error) {
    console.error('Error in removeDuplicateGrants:', error);
    throw error;
  }
}

// Run the main function
removeDuplicateGrants().catch(console.error);