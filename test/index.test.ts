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
  })
  return fs.readFileSync(outputFile, 'utf-8')
}

describe('astro-minify-html-swc', () => {
  it('should minify HTML output', async () => {
    const original = await build()
    const minified = await build({ USE_MINIFY: '1' })


    expect(minified.length).toBeLessThan(original.length)
    expect(original).toContain('This is a comment that should be removed')
    expect(minified).not.toContain('This is a comment that should be removed')



    expect(original).toMatchInlineSnapshot(`
      "<!DOCTYPE html><html lang="en" data-astro-cid-j7pv25f6> <head><meta charset="utf-8"><title>Test Page</title><style>
            body {
              div {
                background-color: white;
              }
            }
          </style><style>body{div{color:red}}
      </style></head> <body data-astro-cid-j7pv25f6> <!-- This is a comment that should be removed --> <div data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>Hello, world!</p> </div> <script type="module">(()=>{console.log("This is a module script.")})();</script> <script>
            ;(() => {
              let inlineScript = () => {
                console.log('This is an inline script.')
              }
              inlineScript()
            })()
          </script> </body> </html>"
    `)
    expect(minified).toMatchInlineSnapshot(`"<!doctype html><html lang=en data-astro-cid-j7pv25f6><meta charset=utf-8><title>Test Page</title><style>body{& div{background-color:#fff}}body{& div{color:red}}</style><body data-astro-cid-j7pv25f6><div data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>Hello, world!</p> </div> <script type=module>console.log("This is a module script.")</script> <script>console.log("This is an inline script.")</script>"`)



  })
})
