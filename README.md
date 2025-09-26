# astro-minify-html-swc

[![NPM version](https://img.shields.io/npm/v/astro-minify-html-swc?color=a1b858&label=)](https://www.npmjs.com/package/astro-minify-html-swc)

An [Astro integration](https://docs.astro.build/guides/integrations-guide/) that minifies HTML (including inline scripts and styles) using [SWC](https://swc.rs/) 🦀. It's _fast!_. 🚀

## Why 

Astro minifies HTML/CSS/JS by default. However, this is not true for the [`is:inline`](https://docs.astro.build/en/reference/directives-reference/#isinline) directive or [comment in your .astro file](https://docs.astro.build/en/reference/astro-syntax/#comments). This integration minifies these as well, making your site even faster!

**Before:**

```html
<!DOCTYPE html>
<html lang="en" dir="ltr" data-theme="dark" data-has-hero class="astro-52bmzolp"> <head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Welcome to Starlight | My Docs</title>
<link rel="canonical"/>
<link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml"/>
<meta name="generator" content="Astro v5.14.0"/>
<meta name="generator" content="Starlight v0.36.0"/>
<meta property="og:title" content="Welcome to Starlight"/>
<meta property="og:type" content="article"/>
<meta property="og:url"/>
<meta property="og:locale" content="en"/>
<meta property="og:description" content="Get started building your docs site with Starlight."/>
<meta property="og:site_name" content="My Docs"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="description" content="Get started building your docs site with Starlight."/>
<script>
	window.StarlightThemeProvider = (() => {
		const storedTheme =
			typeof localStorage !== 'undefined' && localStorage.getItem('starlight-theme');
		const theme =
			storedTheme ||
			(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
		document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark';
		return {
			updatePickers(theme = storedTheme || 'auto') {
				document.querySelectorAll('starlight-theme-select').forEach((picker) => {
					const select = picker.querySelector('select');
					if (select) select.value = theme;
					/** @type {HTMLTemplateElement | null} */
					const tmpl = document.querySelector(`#theme-icons`);
					const newIcon = tmpl && tmpl.content.querySelector('.' + theme);
					if (newIcon) {
						const oldIcon = picker.querySelector('svg.label-icon');
						if (oldIcon) {
							oldIcon.replaceChildren(...newIcon.cloneNode(true).childNodes);
						}
					}
				});
			},
		};
	})();
</script>
```

**After:**

```html
<!doctype html>
<html lang=en dir=ltr data-theme=dark data-has-hero class=astro-52bmzolp>
<meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Welcome to Starlight | My Docs</title>
<link rel=canonical>
<link rel="icon shortcut" href=/favicon.svg type=image/svg+xml>
<meta name=generator content="Astro v5.14.0">
<meta name=generator content="Starlight v0.36.0">
<meta property=og:title content="Welcome to Starlight">
<meta property=og:type content=article>
<meta property=og:url>
<meta property=og:locale content=en>
<meta property=og:description content="Get started building your docs site with Starlight.">
<meta property=og:site_name content="My Docs">
<meta name=twitter:card content=summary_large_image>
<meta name=description content="Get started building your docs site with Starlight.">
<script>window.StarlightThemeProvider=(()=>{let e="undefined"!=typeof localStorage&&localStorage.getItem("starlight-theme"),t=e||(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");return document.documentElement.dataset.theme="light"===t?"light":"dark",{updatePickers(t=e||"auto"){document.querySelectorAll("starlight-theme-select").forEach(e=>{let l=e.querySelector("select");l&&(l.value=t);let r=document.querySelector("#theme-icons"),o=r&&r.content.querySelector("."+t);if(o){let t=e.querySelector("svg.label-icon");t&&t.replaceChildren(...o.cloneNode(!0).childNodes)}})}}})()</script>
```

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

