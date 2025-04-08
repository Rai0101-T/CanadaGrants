import fetch from 'node-fetch';
import fs from 'fs';

// Function to get all grants
async function getAllGrants() {
  try {
    const response = await fetch('http://localhost:5000/api/grants');
    if (!response.ok) {
      throw new Error(`Error fetching grants: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch grants:', error);
    return [];
  }
}

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

// Function to identify purple or generic unsplash images
function hasGenericUnsplashImage(grant) {
  const { imageUrl } = grant;
  
  if (!imageUrl || !imageUrl.includes('unsplash.com')) {
    return false;
  }
  
  // Check for known generic/purple unsplash images
  const genericPatterns = [
    'qwtCeJ5cLYs', // common purple background
    '5QgIuuBxKwM', // purple business
    'iar-afB0QQw', // purple document
    '_1fzbdiFrek', // purple coins
    'WYGhTLym344', // purple laptop
    '_y3QPMdEQYM'  // purple abstract
  ];
  
  return genericPatterns.some(pattern => imageUrl.includes(pattern));
}

// Function to get a more appropriate image based on grant details
function getAppropriateBrandImage(grant) {
  const { title, type, industry, organization } = grant;
  
  // Map of organizations to their brand logo/image URLs
  const organizationImages = {
    'Canada Revenue Agency': 'https://www.canada.ca/content/dam/cra-arc/migration/cra-arc/E/prgrms/rgstrd-plns/snpsts/snpsht-rrsp-eng.jpg',
    'Innovation, Science and Economic Development Canada': 'https://ised-isde.canada.ca/site/ised/sites/default/files/ised_inno-strat_main_splash_en.jpeg',
    'Business Development Bank of Canada': 'https://www.bdc.ca/globalassets/digizuite/35369-bdc-banner-image.jpg',
    'National Research Council': 'https://nrc.canada.ca/sites/default/files/styles/full_width_800px/public/2020-05/irap_hero.jpg', 
    'Canadian Trade Commissioner Service': 'https://www.tradecommissioner.gc.ca/image/tcs-sdc-website-launch-lancement-site-web.jpg',
    'CSBFP': 'https://www.ic.gc.ca/eic/site/csbfp-pfpec.nsf/vwimages/CSBFP_How_to_Apply_Image.jpg/$file/CSBFP_How_to_Apply_Image.jpg',
    'Alberta': 'https://open.alberta.ca/dataset/01cbada3-8075-4b3b-a96a-c6e0ee47c0c2/resource/9ba2e85b-2b9e-4614-8c80-d6ef7aff2f83/download/alberta-brand-logo-240.jpg',
    'British Columbia': 'https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/services-policies-for-government/policies-procedures-standards/web-content-development-guides/corporate-identity-assets/visid-print/2018_print_bc_achievementmark_01_1colour.jpg',
    'Ontario': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Ontario_Logo.svg/1200px-Ontario_Logo.svg.png',
    'Quebec': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Logo_du_Gouvernement_du_Qu%C3%A9bec.svg/1200px-Logo_du_Gouvernement_du_Qu%C3%A9bec.svg.png',
    'Nova Scotia': 'https://images.squarespace-cdn.com/content/v1/58915361be6594afe56c9caa/6a75ca2e-7c62-499d-9ec1-2ab5ae57f66a/Province+of+Nova+Scotia+Logo.png',
    'New Brunswick': 'https://www2.gnb.ca/content/gnb/en/departments/finance/_jcr_content/par/columncontrol_1186513227/columncontrolpar0/image.img.jpg/1444318987526.jpg',
    'Manitoba': 'https://www.gov.mb.ca/asset_library/en/government/mb_government.jpg',
    'Saskatchewan': 'https://www.saskatchewan.ca/-/media/system-pages/saskatchewan-imagery/sk-wordmark--jpeg.jpg',
    'Newfoundland': 'https://www.gov.nl.ca/wp-content/uploads/GNLC_H_CMYK.jpg',
    'Prince Edward Island': 'https://www.princeedwardisland.ca/sites/default/files/styles/landing_page_desktop/public/landing-pages/node_2/main.jpg',
    'Yukon': 'https://yukon.ca/sites/yukon.ca/files/hpw/hpw-yukon-brand-wordmark.png',
    'Northwest Territories': 'https://www.gov.nt.ca/sites/flagship/files/images/logo.jpg',
    'Nunavut': 'https://www.gov.nu.ca/sites/default/files/gn-logotype.jpg',
    'Futurpreneur': 'https://www.futurpreneur.ca/wp-content/uploads/2019/07/Futurpreneur_Logo_Colour_RGB.jpg',
    'Women Enterprise Organizations of Canada': 'https://weoc.ca/wp-content/uploads/2023/05/cropped-WEOC-Logo-Mark.jpg',
    'TD': 'https://www.td.com/ca/en/personal-banking/images/TDAssets/assets/images/td-logo.svg',
    'CIBC': 'https://www.cibc.com/content/dam/global-assets/images/logos/cibc/CIBC_WORDMARK_CREST.svg',
    'RBC': 'https://www.rbcroyalbank.com/dvl/v1.0/assets/images/logos/rbc-logo-shield.svg',
    'BMO': 'https://www.bmo.com/main/personal/images/bmo-logo-header.svg',
    'Scotiabank': 'https://www.scotiabank.com/content/dam/scotiabank/images/logos/scotiabank-logo-inline.svg',
    'Manulife': 'https://www.manulife.com/content/dam/corporate/global/en/images/home/manulife-colour.jpg',
    'Walmart': 'https://corporate.walmart.com/content/dam/corporate/images/walmart-logo.svg',
    'Telus': 'https://www.telus.com/en/bc/business/content/dam/telus-business/images/corporate/logos/telus_logo_at_2x.svg',
    'IKEA': 'https://www.ikea.com/global/assets/navigation/images/ikea-logo.svg'
  };
  
  // Try to find a match based on organization
  if (organization) {
    for (const [org, imgUrl] of Object.entries(organizationImages)) {
      if (organization.includes(org) || title.includes(org)) {
        return imgUrl;
      }
    }
  }
  
  // Check for common provincial or federal patterns in the title or type
  for (const [region, imgUrl] of Object.entries(organizationImages)) {
    if (title.includes(region) || (type === 'provincial' && title.includes(region))) {
      return imgUrl;
    }
  }
  
  // Industry-specific images for common industries
  const industryImages = {
    'Technology': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2940&auto=format&fit=crop',
    'Agriculture': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2940&auto=format&fit=crop',
    'Manufacturing': 'https://images.unsplash.com/photo-1630728874169-8c4d7733fba4?q=80&w=2871&auto=format&fit=crop',
    'Healthcare': 'https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=2786&auto=format&fit=crop',
    'Environment': 'https://images.unsplash.com/photo-1610555356070-d0efcf770471?q=80&w=2940&auto=format&fit=crop',
    'Film & Media': 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=2874&auto=format&fit=crop',
    'Tourism': 'https://images.unsplash.com/photo-1510253687831-9e3e85b91f40?q=80&w=2942&auto=format&fit=crop',
    'Energy': 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?q=80&w=2870&auto=format&fit=crop',
    'Small Business': 'https://images.unsplash.com/photo-1589443865183-59fe669c7a06?q=80&w=2876&auto=format&fit=crop',
    'All Industries': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2874&auto=format&fit=crop'
  };
  
  if (industry) {
    for (const [ind, imgUrl] of Object.entries(industryImages)) {
      if (industry.includes(ind) || title.includes(ind)) {
        return imgUrl;
      }
    }
  }
  
  // Default image if no matches found
  return 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2874&auto=format&fit=crop';
}

// Main function to fix remaining unsplash images
async function fixRemainingUnsplashImages() {
  const grants = await getAllGrants();
  
  if (!grants.length) {
    console.log('No grants found or could not connect to the API');
    return;
  }
  
  console.log(`Analyzing ${grants.length} grants for generic/purple Unsplash images...`);
  
  // Filter grants with generic unsplash images
  const grantsWithGenericImages = grants.filter(hasGenericUnsplashImage);
  
  console.log(`Found ${grantsWithGenericImages.length} grants with generic/purple Unsplash images`);
  
  if (grantsWithGenericImages.length === 0) {
    console.log('No grants with generic/purple Unsplash images found. All images appear to be unique.');
    return;
  }
  
  // Create a list of grants to update
  const grantsToUpdate = grantsWithGenericImages.map(grant => ({
    id: grant.id,
    title: grant.title,
    type: grant.type,
    industry: grant.industry,
    organization: grant.organization,
    currentImage: grant.imageUrl,
    newImage: getAppropriateBrandImage(grant)
  }));
  
  console.log('\nGrants to update:');
  grantsToUpdate.forEach((grant, index) => {
    console.log(`${index + 1}. ID: ${grant.id}, Title: ${grant.title}`);
    console.log(`   From: ${grant.currentImage}`);
    console.log(`   To:   ${grant.newImage}`);
    console.log('');
  });
  
  // Write to JSON file
  fs.writeFileSync('grants_to_update.json', JSON.stringify(grantsToUpdate, null, 2));
  console.log(`Saved ${grantsToUpdate.length} grants to update to grants_to_update.json`);
  
  // No need for confirmation, proceed directly with updates
  console.log('\nUpdating grant images automatically...');
  
  const updatedGrants = [];
  for (const grant of grantsToUpdate) {
    console.log(`Updating image for Grant ID ${grant.id} - ${grant.title}...`);
    const result = await updateGrantImage(grant.id, grant.newImage);
    if (result) {
      updatedGrants.push({
        id: grant.id,
        title: grant.title,
        oldImage: grant.currentImage,
        newImage: grant.newImage
      });
      console.log(`Success! Updated image for Grant ID ${grant.id}`);
    }
  }
  
  console.log(`\nSuccessfully updated ${updatedGrants.length} of ${grantsToUpdate.length} grants.`);
  
  // Write results to file
  fs.writeFileSync('updated_grants_results.json', JSON.stringify(updatedGrants, null, 2));
  console.log('Results saved to updated_grants_results.json');
}

fixRemainingUnsplashImages();