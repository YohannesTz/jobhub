// Use native fetch instead of axios to avoid interceptors interfering with S3 upload
export const uploadToS3 = async (presignedUrl, file) => {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

