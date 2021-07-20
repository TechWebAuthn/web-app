import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  plugins: [
    VitePWA({
      strategies: "generateSW",
      registerType: "autoUpdate",
      includeAssets: ["icons/*.ico"],
      manifest: {
        name: "WebAuth ❤️ WebRTC",
        short_name: "wA❤️wRTC",
        start_url: "index.html",
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
