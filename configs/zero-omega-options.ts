import { chalk, path } from 'zx'
import { Config } from '../types/configs.d.ts'
import tildify from 'tildify'
import { handleDuplicateLocalFiles } from '../utils/handleDuplicateLocalFiles.ts'

const FILE_NAME = 'ZeroOmegaOptions.bak'

export default {
  name: FILE_NAME,
  getFilePath: ({ tmp }) => path.join(tmp, FILE_NAME),
  beforeUpload: async ({ tmp, filePath }) => {
    await handleDuplicateLocalFiles({
      tmp,
      filePath,
      nameRegExp: /^ZeroOmegaOptions.*\.bak$/,
    })
  },
  hint: ({ filePath }) =>
    `You should manually import \`${
      chalk.yellow(
        tildify(filePath),
      )
    }\` to ZeroOmega`,
} satisfies Config
