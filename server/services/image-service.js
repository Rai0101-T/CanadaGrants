// Service to manage grant image verification and assignment
import { storage } from '../storage.js';

/**
 * Mapping of industry/category to relevant, contextual images
 * This ensures every grant has a meaningful, relevant image
 */
const industryImageMap = {
  "Technology": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000",
  "Agriculture": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000",
  "Healthcare": "https://images.unsplash.com/photo-1631815585553-a8c5c5e8e3be?q=80&w=1000",
  "Manufacturing": "https://images.unsplash.com/photo-1530939041550-9a1cbc3d5c6e?q=80&w=1000",
  "CleanTech": "https://images.unsplash.com/photo-1597002833200-422eaf554e9e?q=80&w=1000",
  "Energy": "https://images.unsplash.com/photo-1618681317438-a8dd7da06c17?q=80&w=1000",
  "Environment": "https://images.unsplash.com/photo-1518717202715-9fa9d099f58a?q=80&w=1000",
  "Research": "https://images.unsplash.com/photo-1501772418-b33899635bca?q=80&w=1000",
  "Innovation": "https://images.unsplash.com/photo-1520330979108-7d66e04b35e5?q=80&w=1000",
  "Tourism": "https://images.unsplash.com/photo-1527142879-95b61a0916cc?q=80&w=1000",
  "Culture": "https://images.unsplash.com/photo-1560177112-fbfd5fde9566?q=80&w=1000",
  "Arts": "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1000",
  "Social": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000",
  "Startup": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1000",
  "Business": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
  "Export": "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=1000",
  "Education": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000",
  "Training": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000",
  "Indigenous": "https://images.unsplash.com/photo-1531256379416-9f000e90aacc?q=80&w=1000",
  "Youth": "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1000",
  "Women": "https://images.unsplash.com/photo-1573496773905-f5b17e717f05?q=80&w=1000",
  "Diversity": "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1000",
  "Rural": "https://images.unsplash.com/photo-1464519046765-f6d70ac82a89?q=80&w=1000",
  "FinancialServices": "https://images.unsplash.com/photo-1559589689-577aabd1db4f?q=80&w=1000",
  "Default": "https://images.unsplash.com/photo-1618044619888-009e412ff12a?q=80&w=1000" // General business/grant image if no match
};

// Regional image mapping
const regionImageMap = {
  "Alberta": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000",
  "British Columbia": "https://images.unsplash.com/photo-1508953862733-879aa3cf332a?q=80&w=1000",
  "Manitoba": "https://images.unsplash.com/photo-1622415416172-aee3852d9d7a?q=80&w=1000",
  "New Brunswick": "https://images.unsplash.com/photo-1629827592875-3b01eba61ba7?q=80&w=1000",
  "Newfoundland and Labrador": "https://images.unsplash.com/photo-1631464949416-4e92fcf1a415?q=80&w=1000",
  "Northwest Territories": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000",
  "Nova Scotia": "https://images.unsplash.com/photo-1596394723269-b2cbca4e6313?q=80&w=1000",
  "Nunavut": "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=1000",
  "Ontario": "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1000",
  "Prince Edward Island": "https://images.unsplash.com/photo-1578774289912-7b96ea9a7634?q=80&w=1000",
  "Quebec": "https://images.unsplash.com/photo-1519179635365-1776cba71757?q=80&w=1000",
  "Saskatchewan": "https://images.unsplash.com/photo-1506739830590-1638f8df4c74?q=80&w=1000",
  "Yukon": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000",
  "Canada": "https://images.unsplash.com/photo-1569681157440-8e6572757170?q=80&w=1000" // Federal level
};

/**
 * Maps grant type to appropriate category for default images
 */
const typeImageMap = {
  "federal": "https://images.unsplash.com/photo-1572025442646-866d16c84a54?q=80&w=1000",
  "provincial": "https://images.unsplash.com/photo-1506811977880-9c1fe57e3153?q=80&w=1000",
  "private": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000"
};

/**
 * Gets an appropriate image URL for a grant based on its industry/category
 * 
 * @param {Object} grant - The grant object with industry, category, etc.
 * @returns {string} - A relevant image URL
 */
function getRelevantImageUrl(grant) {
  // Try to match by industry
  if (grant.industry && industryImageMap[grant.industry]) {
    return industryImageMap[grant.industry];
  }
  
  // Try to match by category
  if (grant.category) {
    // Check for direct match
    if (industryImageMap[grant.category]) {
      return industryImageMap[grant.category];
    }
    
    // Check for partial match in category
    for (const [key, url] of Object.entries(industryImageMap)) {
      if (grant.category.toLowerCase().includes(key.toLowerCase())) {
        return url;
      }
    }
  }
  
  // Try to match by region/province
  if (grant.province && regionImageMap[grant.province]) {
    return regionImageMap[grant.province];
  }
  
  // Use grant type as fallback
  if (grant.type && typeImageMap[grant.type]) {
    return typeImageMap[grant.type];
  }
  
  // Ultimate fallback
  return industryImageMap.Default;
}

/**
 * Verifies and fixes images for grants with missing, invalid or generic images
 * 
 * @param {Object} grant - The grant to check
 * @returns {Promise<Object>} - The updated grant object
 */
export async function verifyAndFixGrantImage(grant) {
  // Skip if grant already has a valid image URL
  if (grant.imageUrl && 
      !grant.imageUrl.toLowerCase().includes('logo') &&
      !grant.imageUrl.toLowerCase().includes('icon') &&
      !grant.imageUrl.toLowerCase().includes('placeholder') &&
      !grant.imageUrl.toLowerCase().includes('default')) {
    return grant;
  }
  
  // Get a relevant image URL
  const newImageUrl = getRelevantImageUrl(grant);
  
  // Update the grant with the new image URL
  return await storage.updateGrantImage(grant.id, newImageUrl);
}

export default {
  verifyAndFixGrantImage,
  getRelevantImageUrl
};