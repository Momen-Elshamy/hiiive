// next/image for image URLs that come from Puck fields.
//
// Local paths (/img/...) go through the Next image optimizer, so the browser
// gets WebP/AVIF at the width `sizes` asks for. Anything else (an absolute
// URL, a protocol-relative URL, a path with a query string) is rendered
// unoptimized: those would need `images.remotePatterns` / `localPatterns`
// entries, and next/image throws at render without them.
//
// `width` / `height` only give the browser an aspect ratio to reserve before
// the image loads. The CSS class still decides the rendered box.
import Image from "next/image";

// `sizes` for a card in the 3-column .inner grid: content capped at 1280px
// (1360 - 2*40 padding), one column below 900px (24px padding).
export const GRID_IMG_SIZES = "(max-width: 900px) calc(100vw - 48px), (max-width: 1360px) calc((100vw - 120px) / 3), 414px";

const isOptimizable = (src) =>
  typeof src === "string" && src.startsWith("/") && !src.startsWith("//") && !src.includes("?");

export function CmsImage({ src, alt = "", width, height, sizes, ...rest }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      unoptimized={!isOptimizable(src)}
      {...rest}
    />
  );
}
