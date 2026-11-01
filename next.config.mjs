import { resolve, dirname } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

/**
 * Force all @premast packages to share the client's single copies of
 * Ant Design, Icons, and the Puck editor. Prevents duplicate context /
 * resolution issues with symlinked or file:-linked packages in local dev.
 *
 * When packages are installed from npm (production), this is harmless.
 */
const sharedDeps = ["antd", "@ant-design/icons"];
const aliases = Object.fromEntries(
  sharedDeps.map((dep) => [
    dep,
    resolve(dirname(require.resolve(`${dep}/package.json`))),
  ])
);

// For @puckeditor/core, alias each subpath individually so the exports field is honored.
const puckDir = dirname(require.resolve("@puckeditor/core/package.json"));
aliases["@puckeditor/core$"] = resolve(puckDir, "dist/index.mjs");
aliases["@puckeditor/core/rsc"] = resolve(puckDir, "dist/rsc.mjs");
// no-external.css is index.css without its `@import` of Inter from rsms.me, a
// render-blocking request to another site; the site serves Inter itself.
aliases["@puckeditor/core/puck.css"] = resolve(puckDir, "dist/no-external.css");

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mongoose"],
  transpilePackages: [
    "@premast/site-core",
    "@premast/site-plugin-seo",
    "@premast/site-plugin-ui",
    "@premast/site-plugin-i18n",
    "@premast/site-plugin-symbols",
    "@premast/site-plugin-media",
    "@premast/site-plugin-mcp",
  ],
  // Files under /video and /fonts carry a content hash in their filename (see
  // hero-waves.<hash>.mp4), so a new file ships as a new URL and `immutable`
  // can never pin a stale one. Keep that convention when adding files here.
  async headers() {
    return [
      {
        source: "/video/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  // Note: build and dev use --webpack flag for resolve.alias support.
  // Turbopack does not support absolute-path aliases needed for pnpm.
  webpack(config) {
    Object.assign(config.resolve.alias, aliases);
    return config;
  },
};

export default nextConfig;
