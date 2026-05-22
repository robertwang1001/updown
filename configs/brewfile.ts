import { Config } from '../types/configs.d.ts'
import { chalk, os, path, which } from 'zx'
import { spinnerExec } from '../utils/spinnerExec.ts'
import tildify from 'tildify'
import logger from '../utils/logger.ts'

export default {
  name: 'Brewfile',
  getFilePath: ({ tmp }) => path.join(tmp, 'Brewfile'),
  beforeUpload: async ({ filePath }) => {
    if (os.platform() === 'win32') {
      logger.log(`Unsupported platform ${os.platform()}`)
      return false
    }

    const brew = await which('brew', { nothrow: true })
    if (brew === null) {
      await spinnerExec(
        'Homebrew is not installed. Installing...',
        'Failed to download or install Homebrew',
        'Homebrew installed successfully!',
        ($) =>
          $`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`,
      )
    }

    // Dump brewfile
    await spinnerExec(
      'Dumping Brewfile...',
      'Failed to dump Brewfile',
      `Brewfile successfully dumped at ${filePath}`,
      ($) => $`brew bundle dump --no-vscode --force --file=${filePath}`,
    )

    return true
  },
  hint: ({ filePath }) =>
    `You should manually run \`${
      chalk.yellow(
        `brew bundle install --no-upgrade --file=${tildify(filePath)}`,
      )
    }\` to install Homebrew packages`,
} satisfies Config
