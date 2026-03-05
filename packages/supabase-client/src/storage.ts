import { SupabaseClient } from '@supabase/supabase-js';

export async function uploadImage(
  client: SupabaseClient,
  bucket: string,
  path: string,
  file: ArrayBuffer | Uint8Array | string,
  contentType?: string
) {
  return client.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: true,
  });
}

export function getImageUrl(
  client: SupabaseClient,
  bucket: string,
  path: string,
  options?: { width?: number; height?: number; quality?: number }
) {
  if (options) {
    return client.storage.from(bucket).getPublicUrl(path, {
      transform: {
        width: options.width,
        height: options.height,
        quality: options.quality,
      },
    });
  }
  return client.storage.from(bucket).getPublicUrl(path);
}

export async function uploadDocument(
  client: SupabaseClient,
  path: string,
  file: ArrayBuffer | Uint8Array | string,
  contentType?: string
) {
  return uploadImage(client, 'documents', path, file, contentType);
}
