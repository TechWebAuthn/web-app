import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    // hmr: {
    //   port: 443,
    // },
  },
  plugins: [
    VitePWA({
      strategies: "generateSW",
      registerType: "autoUpdate",
      includeAssets: ["icons/*.ico", "images/*"],
      injectRegister: "inline",
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        cacheId: Date.now().toString(32),
        globIgnores: ["**/pdfmake*", "**/xlsx*", "**/vfs_fonts*"],
      },
      manifest: {
        name: "WebAuthn ❤️ WebRTC",
        short_name: "WAuthn❤️WRTC",
        start_url: "/",
        display: "standalone",
        background_color: "#000",
        theme_color: "#000",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/icons/android-chrome-192x192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "/icons/android-chrome-512x512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
      },
    }),
  ],
});
