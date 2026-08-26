export async function imageUrlToFile(
  imageUrl: string,
  fileName: string = 'image.jpg',
): Promise<File> {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const blob = await response.blob();

  return new File([blob], fileName, {
    type: blob.type,
  });
}
