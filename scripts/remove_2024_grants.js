// Script to remove grants with 2024 expiration dates
import { db } from '../server/db.js';
import { grants, userGrants } from '../shared/schema.js';
import { eq, and, like } from 'drizzle-orm';

async function findExpiredGrants() {
  // Get all grants
  const allGrants = await db.select().from(grants);
  
  // Current project date is April 10, 2025
  const projectDate = new Date('2025-04-10');
  
  // Filter out grants with permanent/ongoing deadlines
  const grantsWithDeadlines = allGrants.filter(grant => 
    !grant.deadline.toLowerCase().includes("ongoing") &&
    !grant.deadline.toLowerCase().includes("continuous") &&
    !grant.deadline.toLowerCase().includes("rolling") &&
    !grant.deadline.toLowerCase().includes("varies") &&
    !grant.deadline.toLowerCase().includes("check with") &&
    !grant.deadline.toLowerCase().includes("contact")
  );
  
  // Parse deadlines and identify expired grants
  const expiredGrants = [];
  
  for (const grant of grantsWithDeadlines) {
    // Check if it's a 2024 deadline (automatically expired)
    if (grant.deadline.includes("2024")) {
      expiredGrants.push(grant);
      continue;
    }
    
    // Try to parse the date to see if it's past the April 10, 2025 date
    try {
      // Handle common date formats in the database
      let deadlineDate;
      
      // Format: "Month Day, Year" (e.g., "Mar 15, 2025")
      const monthDayYearMatch = grant.deadline.match(/([A-Za-z]{3})\s+(\d{1,2}),\s+(\d{4})/);
      if (monthDayYearMatch) {
        const [_, month, day, year] = monthDayYearMatch;
        const monthMap = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 };
        deadlineDate = new Date(parseInt(year), monthMap[month], parseInt(day));
      }
      
      // Format: "YYYY-MM-DD" (ISO format)
      else if (grant.deadline.match(/\d{4}-\d{2}-\d{2}/)) {
        deadlineDate = new Date(grant.deadline);
      }
      
      // If we have a valid date and it's before April 10, 2025
      if (deadlineDate && deadlineDate < projectDate) {
        expiredGrants.push(grant);
      }
    } catch (err) {
      // If we can't parse the date, just skip it
      console.log(`Couldn't parse deadline for grant ID ${grant.id}: ${grant.deadline}`);
    }
  }
  
  return expiredGrants;
}

async function removeExpiredGrants() {
  try {
    console.log("Starting expired grants removal process...");
    
    // Find expired grants
    const expiredGrants = await findExpiredGrants();
    
    console.log(`Found ${expiredGrants.length} grants with expired deadlines (past April 10, 2025):`);
    expiredGrants.forEach(grant => {
      console.log(`- ID: ${grant.id}, Title: ${grant.title}, Deadline: ${grant.deadline}`);
    });
    
    // Get IDs of expired grants
    const expiredIds = expiredGrants.map(grant => grant.id);
    
    if (expiredIds.length === 0) {
      console.log("No expired grants found to remove.");
      return;
    }
    
    // First remove entries from userGrants that reference these grants
    console.log("Removing references from user lists...");
    for (const id of expiredIds) {
      await db.delete(userGrants).where(eq(userGrants.grantId, id));
    }
    
    // Then delete the grants themselves
    console.log("Removing expired grants...");
    const deletedCount = [];
    
    for (const id of expiredIds) {
      const result = await db.delete(grants).where(eq(grants.id, id)).returning();
      if (result.length > 0) {
        deletedCount.push(id);
      }
    }
    
    console.log(`Successfully removed ${deletedCount.length} expired grants with IDs: ${deletedCount.join(', ')}`);
  } catch (error) {
    console.error("Error removing expired grants:", error);
  } finally {
    // Close the database connection
    process.exit(0);
  }
}

// Run the function
removeExpiredGrants();