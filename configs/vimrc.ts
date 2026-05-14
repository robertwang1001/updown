import { chalk, path } from 'zx'
import { Config } from '../types/configs.d.ts'
import tildify from 'tildify'

export default {
  name: 'vimrc',
  getFilePath: ({ home }) => path.join(home, '.vimrc'),
  hint: ({ filePath }) =>
    chalk.yellow(
      `You follow the instruction in the head of ${
        tildify(filePath)
      } to manually install Vim plugins`,
    ),
} satisfies Config
