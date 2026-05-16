import { fs } from 'zx'
import { spinnerExec } from './spinnerExec.ts'
import { Buffer } from 'node:buffer'
import tildify from 'tildify'

export function createTargzipFileName(fileName: string) {
  return `${fileName}.tar.gz.base64`
}

interface TargzipOptions {
  srcDir: string
  /**
   * Entries in `srcDir` to include. All entries are included if omitted.
   * **Note: must specify at least one entry if used.**
   */
  included?: string[]
  excludeVcs?: boolean
  filePath: string
  label: string
}

export async function targzip(
  { srcDir, filePath, label, excludeVcs, included }: TargzipOptions,
) {
  if (!(await fs.pathExists(srcDir))) {
    throw new Error(`${tildify(srcDir)} does not exist`)
  }

  const args: string[] = []
  if (excludeVcs) {
    args.push('--exclude-vcs')
  }

  const includedArgs: string[] = []
  if (included) {
    if (!included.length) {
      throw new Error(`\`included\` must specify at least one entry`)
    }
    includedArgs.push(...included)
  } else {
    includedArgs.push('.')
  }

  await spinnerExec(
    `Archiving ${label}...`,
    `Failed to archive ${label}`,
    `${label} archived successfully.`,
    ($) =>
      $({
        cwd: srcDir,
      })`tar ${args} -cf - ${includedArgs} | gzip -nc > ${filePath}`,
  )

  // base64 encoding
  const buff = await fs.readFile(filePath)
  const b64 = buff.toBase64()
  await fs.writeFile(filePath, b64)
}

interface UntargzipOptions {
  filePath: string
  destDir: string
  label: string
}

export async function untarzip(
  { filePath, destDir, label }: UntargzipOptions,
) {
  // base64 decoding
  const b64 = await fs.readFile(filePath, 'utf-8')
  const buff = Buffer.from(b64, 'base64')
  await fs.writeFile(filePath, buff)

  await fs.ensureDir(destDir)
  await spinnerExec(
    `Unarchiving ${label}...`,
    `Failed to unarchive ${label}.`,
    `${label} unarchived successfully to ${tildify(destDir)}.`,
    ($) => $`gzip -dc ${filePath} | tar -xf - -C ${destDir}`,
  )
}
