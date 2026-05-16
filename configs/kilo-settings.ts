import { chalk, path } from 'zx'
import { Config } from '../types/configs.d.ts'
import tildify from 'tildify'

const FILE_NAME = 'kilo-settings.json'

export default {
  name: FILE_NAME,
  getFilePath: ({ tmp }) => path.join(tmp, FILE_NAME),
  hint: ({ filePath }) =>
    `You should manually import \`${
      chalk.yellow(
        tildify(filePath),
      )
    }\` to Kilo Code (A VSCode extension)`,
} satisfies Config
