import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type * as SWC from '@swc/html'
import type { AstroIntegration, AstroIntegrationLogger } from 'astro'
import glob from 'fast-glob'

type SizeChange = [sizeBefore: number, sizeAfter: number]

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let unitIndex = 0
  let value = bytes
  while (Math.abs(value) >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }
  return `${value.toFixed(1)}${units[unitIndex]}`
}

function formatSizeChange([sizeBefore, sizeAfter]: SizeChange): string {
  const diff = sizeAfter - sizeBefore
  const percent = (100 * diff) / sizeBefore
  return `${formatBytes(diff)} (${percent.toFixed(1)}%)`
}

async function compress(
  logger: AstroIntegrationLogger,
  minify: typeof SWC.minify,
  dirPath: string,
  filePath: string,
): Promise<SizeChange> {
  try {
    const fullPath = path.join(dirPath, filePath)
    const textBefore = await fs.readFile(fullPath, 'utf-8')
    const sizeBefore = Buffer.byteLength(textBefore, 'utf-8')

    const result = await minify(textBefore, {
      collapseWhitespaces: 'conservative',
      removeComments: true,
      minifyJson: true,
      minifyJs: true,
      minifyCss: true,
    })

    const textAfter = result.code
    const sizeAfter = Buffer.byteLength(textAfter, 'utf-8')

    await fs.writeFile(fullPath, textAfter, 'utf-8')

    logger.debug(`${formatSizeChange([sizeBefore, sizeAfter])} ${filePath}`)

    return [sizeBefore, sizeAfter]
  } catch (error) {
    logger.error(`Failed to minify ${filePath}:`)
    logger.error(String(error))
    return [0, 0]
  }
}

export default function integration(): AstroIntegration {
  return {
    name: 'astro-minify-html-swc',
    hooks: {
      'astro:build:done': async ({ logger, dir }) => {
        const timeStart = performance.now()

        const dirPath = fileURLToPath(dir)
        logger.debug(`Scanning ${dirPath}`)

        const filePaths = await glob('**/*.html', { cwd: dirPath })
        logger.debug(`Found ${filePaths.length} HTML files in ${dirPath}`)

        const { minify } = await import('@swc/html')

        const sizeChanges = await Promise.all(
          filePaths.map((filePath) => {
            return compress(logger, minify, dirPath, filePath)
          }),
        )
        const sizeChange = sizeChanges.reduce<SizeChange>(
          (a, b) => [a[0] + b[0], a[1] + b[1]],
          [0, 0],
        )

        const timeEnd = performance.now()
        logger.info(
          `${formatSizeChange(sizeChange)} Compressed ${filePaths.length} HTML files in ${Math.round(timeEnd - timeStart)}ms`,
        )
      },
    },
  } satisfies AstroIntegration
}
