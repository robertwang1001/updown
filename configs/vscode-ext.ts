import { $, chalk, path } from 'zx'
import { Config } from '../types/configs.d.ts'
import { spinnerExec } from '../utils/spinnerExec.ts'
import tildify from 'tildify'

export default {
  name: 'vscode-extensions.txt',
  getFilePath: ({ tmp }) => path.join(tmp, 'vscode-extensions.txt'),
  beforeUpload: async ({ filePath }) => {
    await spinnerExec(
      'Dumping extensions...',
      'Failed to dump extensions',
      `Dumped to ${filePath}`,
      () => $`code --list-extensions > ${filePath}`,
    )
  },
  hint: ({ filePath }) =>
    `You should manually run \`${
      chalk.yellow(
        `cat ${tildify(filePath)} | xargs -n 1 code --install-extension`,
      )
    }\` to install the VSCode extensions`,
} satisfies Config
