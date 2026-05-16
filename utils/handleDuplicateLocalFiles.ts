import { path, spinner } from 'zx'
import trash from 'trash'
import logger from './logger.ts'

interface Options {
  tmp: string
  nameRegExp: RegExp
  filePath: string
}

export async function handleDuplicateLocalFiles(
  { tmp, nameRegExp, filePath }: Options,
) {
  const trashedNames: string[] = []
  let keptName: string | undefined

  await spinner('Handle duplicate local files...', async () => {
    const dirEntries = Deno.readDir(tmp)
    const matchedFiles: {
      name: string
      time: number | undefined
    }[] = []
    let latestTime: number | undefined

    for await (const dirEntry of dirEntries) {
      if (!dirEntry.isFile || !nameRegExp.test(dirEntry.name)) continue
      const fileInfo = await Deno.stat(path.join(tmp, dirEntry.name))
      const time = (fileInfo.birthtime ?? fileInfo.ctime)?.getTime()
      matchedFiles.push({
        name: dirEntry.name,
        time,
      })

      if (!time) continue

      if (!latestTime) {
        latestTime = time
        continue
      }

      latestTime = Math.max(time, latestTime)
    }

    await Promise.allSettled(matchedFiles.map(async ({ name, time }) => {
      if (time === latestTime) {
        keptName = name
      } else {
        await trash(path.join(tmp, name), { glob: false })
        trashedNames.push(name)
      }
    }))
  })

  trashedNames.length &&
    logger.log('Move useless', trashedNames.join(', '), 'to the system trash')

  if (keptName) {
    await Deno.rename(path.join(tmp, keptName), filePath)
    logger.log('Rename', keptName, 'to', path.basename(filePath))
  }
}
