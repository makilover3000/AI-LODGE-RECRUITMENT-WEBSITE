import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 warns on any `quality` not listed here (default is [75]); our
    // entry/hero images intentionally use 90. Declaring it clears the warning
    // without downgrading them.
    qualities: [75, 90],
    // Serve modern formats — smaller payloads, same visual quality.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
