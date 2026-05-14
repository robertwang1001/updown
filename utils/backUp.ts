import { fs, path } from 'zx'
import { BACKUP_PATH } from '../constants.ts'
import { timestamp } from 'iso-timestamp'

export async function backUp(srcPath: string) {
  try {
    const destName = path.basename(srcPath)
    const destPath = path.join(
      BACKUP_PATH,
      `${destName}-${timestamp({ excludeMillisecond: true })}`,
    )
    if ((await Deno.stat(srcPath)).isDirectory) {
      await fs.ensureDir(destPath)
    }

    await fs.copy(srcPath, destPath)
    return destPath
  } catch (error) {
    throw new Error(`Failed to back up. ${error}`)
  }
}
