import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import vercelServerless from '@astrojs/vercel/serverless'
import mdx from '@astrojs/mdx'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercelServerless({ analytics: true }),
  integrations: [
    mdx(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    react(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
    },
    extendDefaultPlugins: true,
  },
})
