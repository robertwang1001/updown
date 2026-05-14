import { path } from 'zx'
import { Config } from '../types/configs.d.ts'
import { createTargzipFileName, targzip, untarzip } from '../utils/targzip.ts'

const fileName = 'iterm2'
const fileNameTz = createTargzipFileName(fileName)

export default {
  name: fileNameTz,
  getFilePath: ({ tmp }) => path.join(tmp, fileNameTz),
  beforeUpload: ({ tmp, filePath }) => {
    return targzip({
      srcDir: path.join(tmp, fileName),
      filePath,
      label: fileName,
    })
  },
  afterSetup: ({ tmp, filePath }) => {
    return untarzip({
      filePath,
      destDir: path.join(tmp, fileName),
      label: fileName,
    })
  },
} satisfies Config
