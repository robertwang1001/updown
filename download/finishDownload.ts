import { chalk, fs, os, path, spinner } from 'zx'
import { DOWNLOADED_PATH, ROOT, TMP_PATH } from '../constants.ts'
import { Configs } from '../types/configs.d.ts'
import { getEnv } from '../utils/envs.ts'
import logger from '../utils/logger.ts'
import { confirm } from '../utils/confirm.ts'
import prompts from 'prompts'
import { backUp } from '../utils/backUp.ts'
import tildify from 'tildify'

export async function finishDownload(
  files: { name: string; bytes: Uint8Array<ArrayBuffer> }[],
  configs: Configs,
) {
  await fs.ensureDir(ROOT)
  await fs.ensureDir(TMP_PATH)
  await fs.ensureDir(DOWNLOADED_PATH)
  const home = os.homedir()
  const interactive = !!getEnv('UPDOWN_INTERACTIVE')

  // Write to a temporary location
  const promiseSettledResult = await spinner(
    'Writting downloaded...',
    () =>
      Promise.allSettled(files.map(async ({ name, bytes }) => {
        try {
          await fs.writeFile(path.join(DOWNLOADED_PATH, name), bytes)
          return name
        } catch (error) {
          throw new Error(`${name}: ${error}`)
        }
      })),
  )

  const successFileNames: string[] = []
  const failureReasons: any[] = []
  promiseSettledResult.forEach((v) => {
    if (v.status === 'fulfilled') {
      successFileNames.push(v.value)
    } else {
      failureReasons.push(v.reason)
    }
  })
  logger.logKeep(
    `Finished writting. Successful: ${
      chalk.green(successFileNames.length)
    }. Failed: ${chalk.red(failureReasons.length)}.`,
  )
  failureReasons.forEach((v) => logger.error(v))
  logger.log()

  const { fileNames: selectedFileNames } = await prompts({
    type: 'multiselect',
    name: 'fileNames',
    message: 'Which files do you want to set up?',
    min: 1,
    choices: successFileNames.map((v) => ({
      title: v,
      value: v,
    })),
  })

  logger.log()
  logger.log('Start to set up:')
  logger.log()

  for (const selectedFileName of selectedFileNames) {
    try {
      logger.log(`[${chalk.bold(selectedFileName)}]`)

      const config = configs.find((v) => v.name === selectedFileName)
      if (!config) {
        logger.log(
          chalk.yellow('No config for', selectedFileName, '. Skip it!'),
        )
        continue
      }

      const { name, getFilePath, afterSetup, hint } = config

      const filePath = await getFilePath({
        root: ROOT,
        home,
        tmp: TMP_PATH,
        interactive,
      })

      // move to its respectful location
      if (await fs.pathExists(filePath)) {
        if (
          (await confirm(
            `Existing file found at ${
              tildify(filePath)
            }. Are you sure to overwrite it?`,
          ))
        ) {
          const backupPath = await spinner(
            'Backing up existing file',
            () => backUp(filePath),
          )
          logger.log('Existing file is backed up to', tildify(backupPath))
        } else {
          logger.log('Skip setting up', name)
          logger.log()
          continue
        }
      }

      const downloadedFilePath = path.join(DOWNLOADED_PATH, name)
      await spinner('Copying...', () => fs.copy(downloadedFilePath, filePath))
      logger.log('File copied!', 'Local file path:', tildify(filePath))

      if (afterSetup) {
        await afterSetup({
          root: ROOT,
          home,
          tmp: TMP_PATH,
          interactive,
          filePath,
        })
      }
      logger.log(chalk.green('Success!'))

      // Hint
      if (hint) {
        logger.log(
          'Hint:',
          typeof hint === 'string' ? hint : hint({
            root: ROOT,
            home,
            tmp: TMP_PATH,
            interactive,
            filePath,
          }),
        )
      }
    } catch (error) {
      logger.error(
        chalk.red(
          'Error: Something went wrong when finishing download',
          name,
          '. Skip it!',
          error,
        ),
      )
    }
    logger.log()
  }

  return files
}
