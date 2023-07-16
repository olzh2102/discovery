import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";
import vercel from '@astrojs/vercel/edge';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), react()],
  markdown: {
    shikiConfig: {
      theme: 'material-theme-palenight',
    },
    extendDefaultPlugins: true,
  },
});
