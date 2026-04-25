import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyBase = env.VITE_CHAT_API_BASE?.replace(/\/$/, "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    build: {
      outDir: "dist",
      sourcemap: false,
    },
    server: proxyBase
      ? {
          proxy: {
            "/api": {
              target: proxyBase,
              changeOrigin: true,
              secure: true,
            },
          },
        }
      : undefined,
  };
});
