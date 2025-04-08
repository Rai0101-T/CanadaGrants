import fetch from 'node-fetch';

// Function to update a grant's image URL
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
      throw new Error(`Error updating grant image: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to update image for grant ID ${id}:`, error);
    return null;
  }
}

// Main function to update important grants
async function updateImportantGrants() {
  console.log('Updating images for important federal grants...');

  // Define grants to update with specific, high-quality images
  const grantsToUpdate = [
    {
      // CSBFP (Canada Small Business Financing Program)
      name: "Canada Small Business Financing Program",
      searchTerms: ["Small Business Financing", "CSBFP", "Canada Small", "Small Business", "Financing Program"],
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1200px-Flag_of_Canada_%28Pantone%29.svg.png"
    },
    {
      // NRC IRAP (National Research Council Industrial Research Assistance Program)
      name: "National Research Council Industrial Research Assistance Program",
      searchTerms: ["Research Assistance", "National Research Council", "NRC IRAP", "IRAP", "Industrial Research"],
      imageUrl: "https://nrc.canada.ca/sites/default/files/2019-03/NRC_logo_colour_e_1140x400.jpg"
    },
    {
      // Futurpreneur Canada
      name: "Futurpreneur Canada",
      searchTerms: ["Futurpreneur", "Start-Up", "Youth", "Young Entrepreneur"],
      imageUrl: "https://www.futurpreneur.ca/wp-content/uploads/2018/12/futurpreneur-black-logo.svg"
    },
    {
      // Women Entrepreneurship Strategy (WES)
      name: "Women Entrepreneurship Strategy",
      searchTerms: ["Women Entrepreneurship", "WES", "Women Business", "Female Entrepreneur"],
      imageUrl: "https://ised-isde.canada.ca/site/women-entrepreneurship-strategy/sites/default/files/2021-05/WES-picture.jpg"
    },
    {
      // Strategic Innovation Fund
      name: "Strategic Innovation Fund",
      searchTerms: ["Innovation Fund", "Strategic Innovation", "Federal Innovation", "Innovation Program"],
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Innovation%2C_Science_and_Economic_Development_Canada_logo.svg/1200px-Innovation%2C_Science_and_Economic_Development_Canada_logo.svg.png"
    },
    {
      // Sustainable Development Technology Canada (SDTC)
      name: "Sustainable Development Technology Canada",
      searchTerms: ["Sustainable Development Technology", "SDTC", "Clean Technology", "Cleantech", "Green Technology"],
      imageUrl: "https://www.sdtc.ca/wp-content/themes/sdtc/assets/images/sdtc-logo.svg"
    },
    {
      // Ontario Centres of Excellence (OCE)
      name: "Ontario Centres of Excellence",
      searchTerms: ["Centres of Excellence", "OCE", "Ontario Innovation", "Ontario Technology"],
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/OCI_logo.png/220px-OCI_logo.png"
    }
  ];

  // Process each grant
  for (const grant of grantsToUpdate) {
    console.log(`Looking for grant: ${grant.name}...`);
    
    let allResults = [];
    let foundMatch = false;
    
    // Try each search term until we find a match
    for (const searchTerm of grant.searchTerms) {
      if (foundMatch) break;
      
      try {
        console.log(`  Trying search term: "${searchTerm}"...`);
        // Search for the grant
        const searchResponse = await fetch(`http://localhost:5000/api/grants/search/${encodeURIComponent(searchTerm)}`);
        
        if (!searchResponse.ok) {
          throw new Error(`Error searching for grant: ${searchResponse.statusText}`);
        }
        
        const searchResults = await searchResponse.json();
        
        if (searchResults.length > 0) {
          console.log(`  Found ${searchResults.length} potential matches.`);
          allResults = [...searchResults];
          foundMatch = true;
        } else {
          console.log(`  No grants found matching "${searchTerm}"`);
        }
      } catch (error) {
        console.error(`  Error with search term "${searchTerm}":`, error);
      }
    }
    
    // If we didn't find any matches with any search term, continue to the next grant
    if (allResults.length === 0) {
      console.log(`No grants found matching any search terms for ${grant.name}`);
      console.log('-------------------');
      continue;
    }
    
    // Find the best match in all results
    let bestMatch = null;
    
    // First try to find exact match in title
    for (const result of allResults) {
      if (result.title.includes(grant.name)) {
        bestMatch = result;
        break;
      }
    }
    
    // If no exact match by name, try to find by any search term in title
    if (!bestMatch) {
      for (const result of allResults) {
        for (const searchTerm of grant.searchTerms) {
          if (result.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            bestMatch = result;
            break;
          }
        }
        if (bestMatch) break;
      }
    }
    
    // Try to find by any search term in description
    if (!bestMatch) {
      for (const result of allResults) {
        if (result.description) {
          for (const searchTerm of grant.searchTerms) {
            if (result.description.toLowerCase().includes(searchTerm.toLowerCase())) {
              bestMatch = result;
              break;
            }
          }
          if (bestMatch) break;
        }
      }
    }
    
    // If still no match, just take the first result
    if (!bestMatch && allResults.length > 0) {
      bestMatch = allResults[0];
    }
    
    if (bestMatch) {
      console.log(`Found best matching grant: ${bestMatch.title} (ID: ${bestMatch.id})`);
      console.log(`Current image: ${bestMatch.imageUrl}`);
      console.log(`New image: ${grant.imageUrl}`);
      
      // Update the grant image
      const updateResult = await updateGrantImage(bestMatch.id, grant.imageUrl);
      
      if (updateResult) {
        console.log(`Successfully updated image for ${bestMatch.title}`);
      } else {
        console.log(`Failed to update image for ${bestMatch.title}`);
      }
    } else {
      console.log(`No matching grant found for ${grant.name}`);
    }
    
    console.log('-------------------');
  }
  
  console.log('Grant image update process completed.');
}

// Run the script
updateImportantGrants();