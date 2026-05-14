import { Octokit } from '@octokit/rest'
import { chalk, fetch, spinner } from 'zx'
import { writeGistId } from '../utils/writeGistId.ts'
import { writeGithubToken } from '../utils/writeGithubToken.ts'
import { retry as retryPlugin } from '@octokit/plugin-retry'
import logger from '../utils/logger.ts'

export async function toDownload(
  gistId: string,
  token: string,
) {
  let gistIdValid = true
  let tokenValid = true
  const downloadedFiles: { name: string; bytes: Uint8Array<ArrayBuffer> }[] = []

  try {
    const octokit = new (Octokit.plugin(retryPlugin))({
      auth: token,
      userAgent: 'updown',
    })

    // Download gist
    const { html_url: gistUrl, files: gistFiles } = await spinner(
      `Downloading Gist...`,
      async () => {
        const rsp = await octokit.rest.gists.get({
          gist_id: gistId,
          headers: {
            accept: 'application/vnd.github+json',
          },
        }).catch((error) => {
          if (error.response.status === 404) {
            gistIdValid &&= false
          }

          if (error.response.status === 401) {
            tokenValid &&= false
          }

          throw new Error(
            `Failed to download. HTTP status code: ${error.response.status}`,
          )
        })

        return rsp.data
      },
    )

    logger.log(chalk.green('Downloaded Gist successfully!'))
    logger.log('Gist URL:', gistUrl)
    logger.log()

    // Fetch file bytes
    const files = await spinner('Downloading files...', async () => {
      const promises = Object.entries(gistFiles ?? {}).map(
        async ([name, data]) => {
          if (!data?.raw_url) return
          const rsp = await fetch(data?.raw_url)
          if (!rsp.ok) {
            return {
              name,
              error: new Error(
                `Failed to fetch raw file '${name}': ${rsp.status} ${rsp.statusText}`,
              ),
            }
          }
          const bytes = new Uint8Array(await rsp.arrayBuffer())
          return {
            name,
            bytes,
          }
        },
      )

      const promiseSettledResult = await Promise.allSettled(promises)
      const files = promiseSettledResult.map((v) => {
        if (v.status === 'fulfilled') {
          return v.value
        }
      }).filter((v) => v !== undefined)

      return files
    })

    // Divided succeededs and faileds
    const failedFiles: { name: string; error: Error }[] = []
    files.forEach(({ name, bytes, error }) => {
      if (bytes) {
        downloadedFiles.push({ name, bytes })
      } else {
        failedFiles.push({ name, error })
      }
    })

    logger.logKeep(
      `Downloaded files. Successful: ${
        chalk.green(downloadedFiles.length)
      }. Failed: ${chalk.red(failedFiles.length)}.`,
    )
    failedFiles.forEach(({ name, error }) => {
      logger.error(`${name} failure reason: ${error}`)
    })
  } catch (error) {
    logger.error(chalk.red('Error: Fail to upload.', error))
  }

  if (!gistIdValid) {
    logger.error(
      chalk.red('Error: Gist with id', `\`${gistId}\``, 'not found!'),
    )
    await writeGistId('')
  }
  if (!tokenValid) {
    logger.error(
      chalk.red(
        'Error: Invalid Github token',
      ),
    )
    await writeGithubToken('')
  }

  return downloadedFiles
}
