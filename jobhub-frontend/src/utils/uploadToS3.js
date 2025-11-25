import axios from 'axios';

export const uploadToS3 = async (presignedUrl, file) => {
  try {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type
      }
    });
    return true;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

