# astro-minify-html-swc

[![NPM version](https://img.shields.io/npm/v/astro-minify-html-swc?color=a1b858&label=)](https://www.npmjs.com/package/astro-minify-html-swc)

An [Astro integration](https://docs.astro.build/guides/integrations-guide/) that minifies HTML (including inline scripts and styles) using [SWC](https://swc.rs/). It's _fast!_. 🚀

## Installation

```bash
npm install astro-minify-html-swc
# or
pnpm add astro-minify-html-swc
# or
yarn add astro-minify-html-swc
```

## Usage

```js
// astro.config.mjs
import minify from 'astro-minify-html-swc'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [minify()],
})
```

Make sure to put the integration at the end of the `integrations` array.

## License

MIT
