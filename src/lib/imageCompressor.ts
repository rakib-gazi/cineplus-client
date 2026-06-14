/**
 * Compresses an image file client-side using Canvas.
 * Resizes the image if its dimensions exceed maxWidth/maxHeight.
 * Uses URL.createObjectURL instead of FileReader to prevent browser crashes on huge files (up to 200MB).
 * Converts large PNGs to JPEG if they exceed 3MB to fit server payload constraints.
 */
export async function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8
): Promise<File> {
  // Only compress JPEGs, PNGs, WebPs, etc. Don't compress SVGs or tiny files (< 256KB)
  if (file.type === "image/svg+xml" || file.size < 256 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectUrl;

    img.onload = () => {
      // Free the memory allocated for the object URL immediately
      URL.revokeObjectURL(objectUrl);

      try {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // For large PNG files (e.g. over 3MB), convert them to JPEG to save space
        // and fit within Vercel's 4.5MB payload limit. Otherwise, keep original type.
        let outputType = file.type;
        if (file.type === "image/png" && file.size > 3 * 1024 * 1024) {
          outputType = "image/jpeg";
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              if (blob.size >= file.size) {
                resolve(file);
              } else {
                // Ensure output name has correct extension if we converted it
                let outputName = file.name;
                if (outputType === "image/jpeg" && file.name.toLowerCase().endsWith(".png")) {
                  outputName = file.name.substring(0, file.name.length - 4) + ".jpg";
                }
                
                const compressedFile = new File([blob], outputName, {
                  type: outputType,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              }
            } else {
              resolve(file);
            }
          },
          outputType,
          quality
        );
      } catch (e) {
        console.error("Image compression canvas error:", e);
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
  });
}
