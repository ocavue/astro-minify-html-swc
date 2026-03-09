import fs from 'node:fs'
import path from 'node:path'

import { x } from 'tinyexec'
import { describe, expect, it } from 'vitest'

const fixtureDir = path.resolve(import.meta.dirname, 'fixture')
const outputFile = path.join(fixtureDir, 'dist', 'index.html')

async function build(env: Record<string, string> = {}) {
  await x('./node_modules/.bin/astro', ['build'], {
    nodeOptions: { cwd: fixtureDir, env },
    throwOnError: true,
    timeout: 30_000,
  })
  return fs.readFileSync(outputFile, 'utf-8')
}

describe('astro-minify-html-swc', () => {
  it('should minify HTML output', { timeout: 90_000 }, async () => {
    const original = await build()
    const minified = await build({ USE_MINIFY: '1' })

    expect(original).toMatchInlineSnapshot(`
      "<!DOCTYPE html><html lang="en" data-astro-cid-j7pv25f6> <head><meta charset="utf-8"><title>Test Page</title><style>
            body {
              div {
                /* Comment in inline style */
                background-color: white;
              }
            }
          </style><style>body{div[data-astro-cid-j7pv25f6]{color:red}}
      </style></head> <body data-astro-cid-j7pv25f6> <div data-astro-cid-j7pv25f6> <!-- Comment in div --> <p data-astro-cid-j7pv25f6>Hello, world!</p> </div> <script type="module">console.log("This is a module script.");</script> <script>
            ;(() => {
              let inlineScript = () => {
                // Comment in inline script
                console.log('This is an inline script.')
              }
              inlineScript()
            })()
          </script> </body> </html>"
    `)
    expect(minified).toMatchInlineSnapshot(
      `"<!doctype html><html lang=en data-astro-cid-j7pv25f6><meta charset=utf-8><title>Test Page</title><style>body{& div{background-color:#fff}}body{& div[data-astro-cid-j7pv25f6]{color:red}}</style><body data-astro-cid-j7pv25f6><div data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>Hello, world!</p> </div> <script type=module>console.log("This is a module script.")</script> <script>console.log("This is an inline script.")</script>"`,
    )

    expect(minified.length).toBeLessThan(original.length)

    expect(original).toContain('Comment in inline style')
    expect(original).toContain('Comment in inline script')
    expect(original).toContain('Comment in div')

    expect(minified).not.toContain('Comment in inline style')
    expect(minified).not.toContain('Comment in inline script')
    expect(minified).not.toContain('Comment in div')
  })
})
