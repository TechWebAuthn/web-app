import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  server: {
    hmr: {
      port: 443,
    },
  },
  plugins: [
    VitePWA({
      strategies: "generateSW",
      registerType: "autoUpdate",
      includeAssets: ["icons/*.ico"],
      injectRegister: "inline",
      workbox: {
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: "WebAuth ❤️ WebRTC",
        short_name: "WAuth❤️WRTC",
        start_url: "/",
        display: "standalone",
        background_color: "#000",
        theme_color: "#37f",
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
