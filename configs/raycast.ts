import { chalk, path } from 'zx'
import { Config } from '../types/configs.d.ts'
import { handleDuplicateLocalFiles } from '../utils/handleDuplicateLocalFiles.ts'
import tildify from 'tildify'

const FILE_NAME = 'Raycast.rayconfig'

export default {
  name: FILE_NAME,
  getFilePath: ({ tmp }) => path.join(tmp, FILE_NAME),
  beforeUpload: async ({ tmp, filePath }) => {
    await handleDuplicateLocalFiles({
      tmp,
      filePath,
      nameRegExp: /^Raycast.*\.rayconfig$/,
    })
    return true
  },
  hint: ({ filePath }) =>
    `You should manually import \`${
      chalk.yellow(
        tildify(filePath),
      )
    }\` to Raycast`,
} satisfies Config
