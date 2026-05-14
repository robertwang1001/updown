import { chalk } from 'zx'
import configs from './configs/index.ts'
import { readGistId } from './utils/readGistId.ts'
import { readGithubToken } from './utils/readGithubToken.ts'
import { validateConfigs } from './utils/validateConfigs.ts'
import logger from './utils/logger.ts'
import { toDownload } from './download/toDownload.ts'
import { finishDownload } from './download/finishDownload.ts'

export async function download() {
  try {
    const messages = validateConfigs(configs)
    if (messages.length) {
      logger.error(chalk.red('Error: Invalid configs.', messages.join('; ')))
      Deno.exit(1)
    }

    const gistId = await readGistId()
    const token = await readGithubToken()
    logger.log()

    // Download
    const files = await toDownload(gistId, token)
    logger.log()

    await finishDownload(files, configs)

    logger.log('Done!')
  } catch (error) {
    logger.log()
    logger.error(chalk.red('Error:', error))
    Deno.exit(1)
  }
}
