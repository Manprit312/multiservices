/**
 * Cloudinary helper functions for image URLs
 */

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com";

/**
 * Get Cloudinary image URL with transformations
 */
export function getCloudinaryImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    folder?: string;
  }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
  const { width, height, quality = "auto", format = "auto", folder } = options || {};
  
  let url = `${CLOUDINARY_BASE_URL}/${cloudName}/image/upload`;
  
  // Add transformations
  const transformations: string[] = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  
  if (transformations.length > 0) {
    url += `/${transformations.join(",")}`;
  }
  
  // Add folder and public ID
  if (folder) {
    url += `/${folder}/${publicId}`;
  } else {
    url += `/${publicId}`;
  }
  
  return url;
}

/**
 * Default hero images from Cloudinary
 * Uses your Cloudinary cloud name from environment variable
 * Falls back to demo images if cloud name is not set
 */
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";

export const DEFAULT_IMAGES = {
  hotelHero: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_2000,h_1200,c_fill,q_auto,f_auto/v1/multiserv_hotels/hotel-hero`,
  cleaningHero: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1600,h_900,c_fill,q_auto,f_auto/v1/multiserv_cleaning/cleaning-hero`,
  rideHero: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1200,h_800,c_fill,q_auto,f_auto/v1/multiserv_rides/ride-hero`,
  hotelPlaceholder: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_800,h_600,c_fill,q_auto,f_auto/v1/multiserv_hotels/placeholder`,
  cleaningPlaceholder: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_800,h_600,c_fill,q_auto,f_auto/v1/multiserv_cleaning/placeholder`,
};

// Fallback to demo images if custom images don't exist
export const FALLBACK_IMAGES = {
  hotelHero: "https://res.cloudinary.com/demo/image/upload/w_2000,h_1200,c_fill,q_auto,f_auto/sample.jpg",
  cleaningHero: "https://res.cloudinary.com/demo/image/upload/w_1600,h_900,c_fill,q_auto,f_auto/sample.jpg",
  rideHero: "https://res.cloudinary.com/demo/image/upload/w_1200,h_800,c_fill,q_auto,f_auto/sample.jpg",
  hotelPlaceholder: "https://res.cloudinary.com/demo/image/upload/w_800,h_600,c_fill,q_auto,f_auto/sample.jpg",
  cleaningPlaceholder: "https://res.cloudinary.com/demo/image/upload/w_800,h_600,c_fill,q_auto,f_auto/sample.jpg",
};
