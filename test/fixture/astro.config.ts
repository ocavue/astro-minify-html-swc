import minifyHtml from 'astro-minify-html-swc'
import { defineConfig } from 'astro/config'

const useMinify = process.env.USE_MINIFY === '1'

export default defineConfig({
  integrations: useMinify ? [minifyHtml()] : [],
})
