// Script to identify duplicate grants and print them

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

// Function to find duplicate grants
async function identifyDuplicateGrants() {
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
    const duplicates = Array.from(grantsByTitle.entries())
      .filter(([_, grants]) => grants.length > 1)
      .map(([title, grants]) => ({
        title: grants[0].title,
        count: grants.length,
        ids: grants.map(g => g.id)
      }));

    console.log(`Found ${duplicates.length} duplicate grant sets:`);

    // Print details of duplicate grants
    duplicates.forEach(dup => {
      console.log(`\nDuplicate: ${dup.title} (${dup.count} copies)`);
      console.log(`IDs: ${dup.ids.join(', ')}`);
    });

    // Handle specific Strategic Innovation Fund (SIF) duplicates
    const sifDuplicates = allGrants.filter(grant => 
      grant.title.includes("Strategic Innovation Fund") || 
      grant.title.includes("SIF")
    );
    
    if (sifDuplicates.length > 1) {
      console.log(`\nFound ${sifDuplicates.length} SIF grants:`);
      sifDuplicates.forEach(grant => {
        console.log(`ID: ${grant.id}, Title: ${grant.title}`);
      });
    }
    
  } catch (error) {
    console.error('Error in identifyDuplicateGrants:', error);
    throw error;
  }
}

// Run the main function
identifyDuplicateGrants().catch(console.error);