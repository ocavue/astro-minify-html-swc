import assert from 'node:assert'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { exec } from 'tinyexec'

const fixtureDir = path.resolve(import.meta.dirname, 'fixture')
const outputFile = path.join(fixtureDir, 'dist', 'index.html')

async function build(env: Record<string, string> = {}) {
  await exec('./node_modules/.bin/astro', ['build'], {
    timeout: 40_000,
    throwOnError: true,
    nodeOptions: { env },
  })
  return fs.readFileSync(outputFile, 'utf-8')
}

describe('astro-minify-html-swc', () => {
  it('should minify HTML output', async () => {
    const original = await build()
    const minified = await build({ USE_MINIFY: '1' })

    assert.ok(
      minified.length < original.length,
      'minified output should be smaller',
    )
    assert.ok(
      original.includes('<!--'),
      'original should contain HTML comments',
    )
    assert.ok(
      !minified.includes('<!--'),
      'minified output should not contain HTML comments',
    )

    assert.snapshot()
  })
})
