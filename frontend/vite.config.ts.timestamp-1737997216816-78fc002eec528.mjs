// vite.config.ts
import { defineConfig } from "file:///C:/Users/Uni/Documents/Part%20II%20Project/CSTII-dissertation/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Uni/Documents/Part%20II%20Project/CSTII-dissertation/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { crx } from "file:///C:/Users/Uni/Documents/Part%20II%20Project/CSTII-dissertation/frontend/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// public/manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "sc2370",
  version: "1.0.0",
  side_panel: {
    default_path: "index.html"
  },
  action: {
    default_title: "sc2370"
  },
  background: { service_worker: "src/background_scripts/background.ts", type: "module" },
  content_scripts: [
    {
      js: ["src/content_scripts/content.ts"],
      matches: ["<all_urls>"]
    }
  ],
  permissions: ["sidePanel", "scripting", "activeTab", "contextMenus", "storage"],
  host_permissions: ["<all_urls>"]
};

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [react(), crx({ manifest: manifest_default })]
  // build: {
  //   target: 'ES2020',
  //   emptyOutDir: true,
  //   rollupOptions: {
  //     input: {
  //       main: 'index.html',
  //       background: './src/background_scripts/background.ts',
  //       content: './src/content_scripts/content.ts',
  //       clickable: './src/content_scripts/clickable.css',
  //     },
  //     output: {
  //       entryFileNames: (chunk) => {
  //         switch (chunk.name) {
  //           case 'background':
  //           case 'content':
  //             return '[name].js';
  //           default:
  //             return 'assets/[name].[hash].js';
  //         }
  //       },
  //       chunkFileNames: 'assets/[name].[hash].js',
  //       assetFileNames: 'assets/[name].[ext]',
  //     },
  //   },
  // },
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicHVibGljL21hbmlmZXN0Lmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVbmlcXFxcRG9jdW1lbnRzXFxcXFBhcnQgSUkgUHJvamVjdFxcXFxDU1RJSS1kaXNzZXJ0YXRpb25cXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFVuaVxcXFxEb2N1bWVudHNcXFxcUGFydCBJSSBQcm9qZWN0XFxcXENTVElJLWRpc3NlcnRhdGlvblxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvVW5pL0RvY3VtZW50cy9QYXJ0JTIwSUklMjBQcm9qZWN0L0NTVElJLWRpc3NlcnRhdGlvbi9mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IGNyeCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbic7XG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9wdWJsaWMvbWFuaWZlc3QuanNvbic7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgY3J4KHsgbWFuaWZlc3QgfSldLFxuICAvLyBidWlsZDoge1xuICAvLyAgIHRhcmdldDogJ0VTMjAyMCcsXG4gIC8vICAgZW1wdHlPdXREaXI6IHRydWUsXG4gIC8vICAgcm9sbHVwT3B0aW9uczoge1xuICAvLyAgICAgaW5wdXQ6IHtcbiAgLy8gICAgICAgbWFpbjogJ2luZGV4Lmh0bWwnLFxuICAvLyAgICAgICBiYWNrZ3JvdW5kOiAnLi9zcmMvYmFja2dyb3VuZF9zY3JpcHRzL2JhY2tncm91bmQudHMnLFxuICAvLyAgICAgICBjb250ZW50OiAnLi9zcmMvY29udGVudF9zY3JpcHRzL2NvbnRlbnQudHMnLFxuICAvLyAgICAgICBjbGlja2FibGU6ICcuL3NyYy9jb250ZW50X3NjcmlwdHMvY2xpY2thYmxlLmNzcycsXG4gIC8vICAgICB9LFxuICAvLyAgICAgb3V0cHV0OiB7XG4gIC8vICAgICAgIGVudHJ5RmlsZU5hbWVzOiAoY2h1bmspID0+IHtcbiAgLy8gICAgICAgICBzd2l0Y2ggKGNodW5rLm5hbWUpIHtcbiAgLy8gICAgICAgICAgIGNhc2UgJ2JhY2tncm91bmQnOlxuICAvLyAgICAgICAgICAgY2FzZSAnY29udGVudCc6XG4gIC8vICAgICAgICAgICAgIHJldHVybiAnW25hbWVdLmpzJztcbiAgLy8gICAgICAgICAgIGRlZmF1bHQ6XG4gIC8vICAgICAgICAgICAgIHJldHVybiAnYXNzZXRzL1tuYW1lXS5baGFzaF0uanMnO1xuICAvLyAgICAgICAgIH1cbiAgLy8gICAgICAgfSxcbiAgLy8gICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLltoYXNoXS5qcycsXG4gIC8vICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS5bZXh0XScsXG4gIC8vICAgICB9LFxuICAvLyAgIH0sXG4gIC8vIH0sXG59KTtcbiIsICJ7XG4gIFwibWFuaWZlc3RfdmVyc2lvblwiOiAzLFxuICBcIm5hbWVcIjogXCJzYzIzNzBcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjBcIixcbiAgXCJzaWRlX3BhbmVsXCI6IHtcbiAgICBcImRlZmF1bHRfcGF0aFwiOiBcImluZGV4Lmh0bWxcIlxuICB9LFxuICBcImFjdGlvblwiOiB7XG4gICAgXCJkZWZhdWx0X3RpdGxlXCI6IFwic2MyMzcwXCJcbiAgfSxcbiAgXCJiYWNrZ3JvdW5kXCI6IHsgXCJzZXJ2aWNlX3dvcmtlclwiOiBcInNyYy9iYWNrZ3JvdW5kX3NjcmlwdHMvYmFja2dyb3VuZC50c1wiLCBcInR5cGVcIjogXCJtb2R1bGVcIiB9LFxuICBcImNvbnRlbnRfc2NyaXB0c1wiOiBbXG4gICAge1xuICAgICAgXCJqc1wiOiBbXCJzcmMvY29udGVudF9zY3JpcHRzL2NvbnRlbnQudHNcIl0sXG4gICAgICBcIm1hdGNoZXNcIjogW1wiPGFsbF91cmxzPlwiXVxuICAgIH1cbiAgXSxcbiAgXCJwZXJtaXNzaW9uc1wiOiBbXCJzaWRlUGFuZWxcIiwgXCJzY3JpcHRpbmdcIiwgXCJhY3RpdmVUYWJcIiwgXCJjb250ZXh0TWVudXNcIiwgXCJzdG9yYWdlXCJdLFxuICBcImhvc3RfcGVybWlzc2lvbnNcIjogW1wiPGFsbF91cmxzPlwiXVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwWSxTQUFTLG9CQUFvQjtBQUN2YSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxXQUFXOzs7QUNGcEI7QUFBQSxFQUNFLGtCQUFvQjtBQUFBLEVBQ3BCLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxFQUNYLFlBQWM7QUFBQSxJQUNaLGNBQWdCO0FBQUEsRUFDbEI7QUFBQSxFQUNBLFFBQVU7QUFBQSxJQUNSLGVBQWlCO0FBQUEsRUFDbkI7QUFBQSxFQUNBLFlBQWMsRUFBRSxnQkFBa0Isd0NBQXdDLE1BQVEsU0FBUztBQUFBLEVBQzNGLGlCQUFtQjtBQUFBLElBQ2pCO0FBQUEsTUFDRSxJQUFNLENBQUMsZ0NBQWdDO0FBQUEsTUFDdkMsU0FBVyxDQUFDLFlBQVk7QUFBQSxJQUMxQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGFBQWUsQ0FBQyxhQUFhLGFBQWEsYUFBYSxnQkFBZ0IsU0FBUztBQUFBLEVBQ2hGLGtCQUFvQixDQUFDLFlBQVk7QUFDbkM7OztBRGJBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLDJCQUFTLENBQUMsQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBMEJ0QyxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
