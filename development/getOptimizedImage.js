// use this function to optimize images from Strapi
// Using this can significantly decrease the size of images.  (up to 90%)
// USAGE: <Image src={getOptimizedImage(strapiItem.coverPhoto)} />

export default function getOptimizedImage(imageAttributes) {
    if (imageAttributes === null) return null;

    if (!imageAttributes.formats) return imageAttributes.url;
    if (imageAttributes.formats.large) return imageAttributes.formats.large.url;
    if (imageAttributes.formats.medium) return imageAttributes.formats.medium.url;
    if (imageAttributes.formats.small) return imageAttributes.formats.small.url;
    return imageAttributes.url;
}
