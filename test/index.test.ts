import fs from 'node:fs'
import path from 'node:path'

import { x } from 'tinyexec'
import { describe, expect, it } from 'vitest'

const fixtureDir = path.resolve(import.meta.dirname, 'fixture')
const outputFile = path.join(fixtureDir, 'dist', 'index.html')

async function build(env: Record<string, string> = {}) {
  await x('npx', ['astro', 'build'], {
    nodeOptions: { cwd: fixtureDir, env: { ...process.env, ...env } },
    throwOnError: true,
  })
  return fs.readFileSync(outputFile, 'utf-8')
}

describe('astro-minify-html-swc', () => {
  it('should minify HTML output', async () => {
    const original = await build()
    const minified = await build({ USE_MINIFY: '1' })

    expect(minified.length).toBeLessThan(original.length)
    expect(original).toContain('<!--')
    expect(minified).not.toContain('<!--')
    expect(minified).toMatchSnapshot()
  })
})
