import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: 'server',
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
