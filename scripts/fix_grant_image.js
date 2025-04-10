// Fix the image URL for the R&D Associates Program grant
import { storage } from '../server/storage.js';

async function updateGrantImage() {
  try {
    const grantId = 22; // R&D Associates Program ID
    // Choose a reliable image URL for R&D/laboratory context
    const newImageUrl = "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=280&q=80";
    
    // First verify the grant exists
    const grant = await storage.getGrantById(grantId);
    if (!grant) {
      console.error(`Grant ID ${grantId} not found`);
      return;
    }
    
    console.log(`Current image URL: ${grant.imageUrl}`);
    
    // Update the image
    const updatedGrant = await storage.updateGrantImage(grantId, newImageUrl);
    
    if (updatedGrant) {
      console.log(`Successfully updated image for grant: ${updatedGrant.title}`);
      console.log(`New image URL: ${updatedGrant.imageUrl}`);
    } else {
      console.error('Failed to update grant image');
    }
  } catch (error) {
    console.error('Error updating grant image:', error);
  }
}

updateGrantImage()
  .then(() => {
    console.log('Image update script complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script error:', err);
    process.exit(1);
  });