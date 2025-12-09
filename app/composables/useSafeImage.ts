/**
 * Composable for handling image loading with fallback to random placeholder images
 */
export const useSafeImage = () => {
  const FALLBACK_IMAGES = [
    "/assets/images/product-1.png",
    "/assets/images/product-2.png",
    "/assets/images/product-3.png",
  ];

  /**
   * Get a random fallback image from the available placeholders
   */
  const getRandomFallbackImage = (): string => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
    return FALLBACK_IMAGES[randomIndex];
  };

  /**
   * Create a safe image URL with error handling
   * @param initialUrl - The initial image URL to try loading
   * @returns Object with reactive imageUrl and error handler
   */
  const createSafeImageUrl = (initialUrl: string) => {
    const imageUrl = ref(initialUrl);
    const hasError = ref(false);

    const handleError = () => {
      if (!hasError.value) {
        hasError.value = true;
        imageUrl.value = getRandomFallbackImage();
      }
    };

    return {
      imageUrl,
      handleError,
      hasError,
    };
  };

  /**
   * Get image URL with fallback - returns fallback immediately if URL is invalid
   * @param url - The image URL to validate
   * @returns Valid image URL or random fallback
   */
  const getImageUrlWithFallback = (url: string | null | undefined): string => {
    if (!url || url.trim() === "") {
      return getRandomFallbackImage();
    }
    return url;
  };

  return {
    getRandomFallbackImage,
    createSafeImageUrl,
    getImageUrlWithFallback,
    FALLBACK_IMAGES,
  };
};
