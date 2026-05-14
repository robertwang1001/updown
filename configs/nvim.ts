import { Config } from '../types/configs.d.ts'
import { path } from 'zx'
import { createTargzipFileName, targzip, untarzip } from '../utils/targzip.ts'

const fileName = 'nvim'
const fileNameTz = createTargzipFileName(fileName)

export default {
  name: fileNameTz,
  getFilePath: ({ tmp }) => path.join(tmp, fileNameTz),
  beforeUpload: ({ home, filePath }) => {
    return targzip({
      srcDir: path.join(home, '.config/nvim'),
      filePath,
      label: 'NeoVim config',
      excludeVcs: true,
    })
  },
  afterSetup: ({ home, filePath }) => {
    return untarzip({
      filePath,
      destDir: path.join(home, '.config/nvim'),
      label: 'NeoVim config',
    })
  },
} satisfies Config
