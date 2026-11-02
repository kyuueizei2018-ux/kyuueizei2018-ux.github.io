import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // 只把项目入口当作依赖扫描入口，避免把 work/ 下的浏览器临时文件也当成页面。
  optimizeDeps: {
    entries: ["index.html"],
  },
});
