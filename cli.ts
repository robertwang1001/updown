#!/usr/bin/env zx

import { $, minimist, path } from 'zx'
import { upload } from './upload.ts'
import { setEnv } from './utils/envs.ts'
import logger from './utils/logger.ts'
import { download } from './download.ts'
import { ROOT } from './constants.ts'
import tildify from 'tildify'

function showHelp() {
  logger.logKeep(`
Usage: updown [options] [command]

Upload or download files to or from GitHub Gist

Commands:
  upload                    Upload files to Github Gist
  download                  Download files from Github Gist

Options:
  --help, -h                Show this help message
  --version, -v             Show version
  --root                    Show updown root directory
  --interactive, -i         Interaction mode. Enable prompts
  --force-upload            Upload without checking file change
  --gist-id                 Set gist id
  --reset-token             Reset token. Must be used together with --interactive to set a new token
  --quiet                   Quiet mode. Suppress unimportant output
  --notify                  Display notifications when fatal errors occur (MacOS only). Make sure
                            to set Allow notifications for Script Editor in system settings

Environment variables:
  UPDOWN_UPLOAD_FORCE       The same to --force-upload
  UPDOWN_GIST_ID            The same to --gist-id
`)
}

async function showVersion() {
  if (import.meta.dirname) {
    const version = (await Deno.readTextFile(
      path.join(import.meta.dirname, 'version.txt'),
    )).trim()
    logger.logKeep(version)
  }
}

function showRootDir() {
  logger.logKeep(tildify(ROOT))
}

async function main() {
  const argv = minimist(Deno.args, {
    boolean: [
      'help',
      'version',
      'root',
      'interactive',
      'force-upload',
      'reset-token',
      'quiet',
      'notify',
    ],
    string: ['gist-id'],
    alias: {
      h: 'help',
      v: 'version',
      i: 'interactive',
    },
  })

  if (argv['interactive']) {
    setEnv('UPDOWN_INTERACTIVE', true)
  }
  if (argv['force-upload']) {
    setEnv('UPDOWN_UPLOAD_FORCE', true)
  }
  if (argv['gist-id']) {
    setEnv('UPDOWN_GIST_ID', argv['gist-id'])
  }
  if (argv['reset-token']) {
    setEnv('UPDOWN_RESET_TOKEN', true)
  }
  if (argv['quiet']) {
    $.quiet = true
    setEnv('UPDOWN_QUIET', true)
  }
  if (argv['notify']) {
    setEnv('UPDOWN_NOTIFY', true)
  }

  if (argv['_'].includes('upload')) {
    await upload()
    return
  }

  if (argv['_'].includes('download')) {
    await download()
    return
  }

  if (argv['version']) {
    await showVersion()
    return
  }

  if (argv['root']) {
    showRootDir()
    return
  }

  // Anything else
  showHelp()
}

main()
