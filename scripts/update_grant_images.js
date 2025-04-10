// Script to update grants with generic or logo images
import { db } from '../server/db.js';
import { grants } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// Define the grants that need image updates
const grantsToUpdate = [
  {
    id: 92,
    title: "Ontario Food Processing Business Expansion Fund",
    newImageUrl: "https://www.ontario.ca/files/2023-03/mbllsd-economic-development-strategy-for-ontario-main-hero.jpg" // Ontario food processing image
  },
  {
    id: 163,
    title: "Arctic Energy Alliance Programs",
    newImageUrl: "https://arcticenergyalliance.ca/wp-content/uploads/2023/03/AEA-energy-efficient-buildings.jpg" // Arctic Energy Alliance actual program image
  }
];

async function updateGrantImages() {
  try {
    console.log("Starting grant image update process...");
    
    for (const grant of grantsToUpdate) {
      console.log(`Updating image for grant ID ${grant.id}: ${grant.title}`);
      
      // Get current grant data
      const [currentGrant] = await db.select().from(grants).where(eq(grants.id, grant.id));
      
      if (!currentGrant) {
        console.log(`Grant ID ${grant.id} not found, skipping...`);
        continue;
      }
      
      // Update the image URL
      const [updatedGrant] = await db
        .update(grants)
        .set({ imageUrl: grant.newImageUrl })
        .where(eq(grants.id, grant.id))
        .returning();
      
      if (updatedGrant) {
        console.log(`✓ Successfully updated image for "${grant.title}"`);
        console.log(`  - Old image: ${currentGrant.imageUrl}`);
        console.log(`  - New image: ${updatedGrant.imageUrl}`);
      } else {
        console.log(`Failed to update image for grant ID ${grant.id}`);
      }
    }
    
    console.log("Grant image update process completed");
  } catch (error) {
    console.error("Error updating grant images:", error);
  } finally {
    process.exit(0);
  }
}

// Run the function
updateGrantImages();