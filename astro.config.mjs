import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercelServerless from '@astrojs/vercel/serverless';
 
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercelServerless(),
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), react()],
  markdown: {
    shikiConfig: {
      theme: 'material-theme-palenight'
    },
    extendDefaultPlugins: true
  },
});