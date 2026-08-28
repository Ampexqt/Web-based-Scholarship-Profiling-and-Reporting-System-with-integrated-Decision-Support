import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const bucketName = process.env.SUPABASE_BUCKET_NAME || 'scholarship_uploads';

// Initialize supabase only if URL and Key are present to prevent crashes in dev
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

/**
 * Uploads a file buffer to Supabase Storage and returns the public URL.
 * 
 * @param fileBuffer The file buffer from multer.memoryStorage
 * @param filename The desired filename
 * @param mimetype The file's MIME type
 * @returns The public URL of the uploaded file
 */
export const uploadToSupabase = async (fileBuffer: Buffer, filename: string, mimetype: string): Promise<string> => {
  if (!supabase || !supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials are not configured in environment variables.');
  }

  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .upload(filename, fileBuffer, {
      contentType: mimetype,
      upsert: false
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload file to Supabase: ${error.message}`);
  }

  // Get the public URL
  const { data: publicUrlData } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(filename);

  return publicUrlData.publicUrl;
};
