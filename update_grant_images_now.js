import axios from 'axios';

async function updateGrantImage(id, imageUrl) {
  try {
    const response = await axios.post('http://localhost:5000/api/admin/grants/update-image', {
      id,
      imageUrl
    });
    console.log(`Successfully updated grant ${id} with new image: ${imageUrl}`);
    return response.data;
  } catch (error) {
    console.error(`Error updating grant ${id} image:`, error.message);
    throw error;
  }
}

async function updateImages() {
  try {
    // Update Western Economic Diversification Canada grant
    await updateGrantImage(186, 'https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f?auto=format&fit=crop&w=500&h=280&q=80');
    
    // Update Next Generation Manufacturing Canada grant
    await updateGrantImage(60, 'https://images.unsplash.com/photo-1574246604907-db69e30ddb97?auto=format&fit=crop&w=500&h=280&q=80');
    
    // Update Aboriginal Business and Entrepreneurship Development grant
    await updateGrantImage(61, 'https://images.unsplash.com/photo-1568849676085-51415703900f?auto=format&fit=crop&w=500&h=280&q=80');
    
    console.log('All grant images updated successfully!');
  } catch (error) {
    console.error('Error updating grant images:', error.message);
  }
}

updateImages();