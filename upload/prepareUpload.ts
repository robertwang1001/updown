import { chalk, fs, os, spinner } from 'zx'
import { ROOT, TMP_PATH } from '../constants.ts'
import { Configs } from '../types/configs.d.ts'
import { verifyChecksum } from '../utils/verifyChecksum.ts'
import { getEnv } from '../utils/envs.ts'
import logger from '../utils/logger.ts'
import tildify from 'tildify'

async function validateFile(name: string, filePath: string) {
  const result: {
    valid: boolean
    message: string
    content: string
    warn: boolean
  } = { valid: false, message: '', content: '', warn: true }

  if (!(await fs.pathExists(filePath))) {
    result.message = name + ' does not exist.'
    return result
  }

  const content = await fs.readFile(filePath, 'utf-8')
  if (!content.trim()) {
    result.message = name + ' is empty.'
    return result
  }

  if (!getEnv('UPDOWN_UPLOAD_FORCE') && await verifyChecksum(name, filePath)) {
    result.message = name + ' has not changed.'
    result.warn = false
    return result
  }

  result.valid = true
  result.content = content

  return result
}

export async function prepareUpload(configs: Configs) {
  await fs.ensureDir(ROOT)
  await fs.ensureDir(TMP_PATH)
  const files: { name: string; content: string; path: string }[] = []
  const home = os.homedir()
  const interactive = !!getEnv('UPDOWN_INTERACTIVE')
  logger.log('Prepare for upload:')
  getEnv('UPDOWN_UPLOAD_FORCE') &&
    logger.log(chalk.yellow('Upload all files without checking their changes'))
  logger.log()

  for (
    const { name, getFilePath, beforeUpload, suspendedUpload } of configs
  ) {
    try {
      logger.log(`[${chalk.bold(name)}]`)
      if (suspendedUpload) {
        logger.log(chalk.gray('Suspended.'))
        logger.log()
        continue
      }

      const filePath = await getFilePath({
        root: ROOT,
        home,
        tmp: TMP_PATH,
        interactive,
      })

      if (beforeUpload) {
        await beforeUpload({
          root: ROOT,
          home,
          tmp: TMP_PATH,
          interactive,
          filePath,
        })
      }

      logger.log('Local file path:', tildify(filePath))
      const { valid, message, content, warn } = await spinner(
        'Validating file path...',
        () =>
          validateFile(
            name,
            filePath,
          ),
      )
      if (valid) {
        files.push({ name, content, path: filePath })
      } else {
        warn
          ? logger.log(chalk.yellow(message, 'Skip it!'))
          : logger.log(message, 'Skip it!')
      }
    } catch (error) {
      logger.error(
        chalk.red(
          'Error: Something went wrong when prepare for uploading',
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
