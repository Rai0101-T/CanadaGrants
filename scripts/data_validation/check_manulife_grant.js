// Script to check the current image for the Manulife Education and Skills Fund grant

import fetch from 'node-fetch';

async function getGrantById(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/grants/${id}`);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching grant:`, error);
    throw error;
  }
}

async function checkManulifeGrant() {
  try {
    // Manulife Education and Skills Fund has ID 137
    const grant = await getGrantById(137);
    
    console.log('Manulife Education and Skills Fund Grant Details:');
    console.log(`ID: ${grant.id}`);
    console.log(`Title: ${grant.title}`);
    console.log(`Image URL: ${grant.imageUrl}`);
    console.log(`Industry: ${grant.industry || 'Not specified'}`);
    console.log(`Type: ${grant.type}`);
    console.log(`Description: ${grant.description.substring(0, 200)}...`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
checkManulifeGrant();