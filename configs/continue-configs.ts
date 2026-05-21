import { os, path } from 'zx'
import { Config } from '../types/configs.d.ts'
import { createTargzipFileName, targzip, untarzip } from '../utils/targzip.ts'

function getFolderLocation(home: string) {
  const dirs = [
    {
      name: 'darwin',
      value: path.join(
        home,
        '.continue',
      ),
    },
    { name: 'win32', value: path.join(home, '.continue') },
    { name: 'linux', value: path.join(home, '.continue') },
  ]
  const platform = os.platform()
  const dir = dirs.find(({ name }) => platform === name)
  if (!dir) throw new Error(`Unsupported platform ${platform}`)

  return dir.value
}

const fileName = 'continue-configs'
const fileNameTz = createTargzipFileName(fileName)

export default {
  name: fileNameTz,
  getFilePath: ({ tmp }) => path.join(tmp, fileNameTz),
  beforeUpload: ({ home, filePath }) => {
    const folderLocation = getFolderLocation(home)

    return targzip({
      srcDir: folderLocation,
      included: ['config.yaml', 'rules'],
      filePath,
      label: 'Continue configs',
    })
  },
  afterSetup: ({ home, filePath }) => {
    const folderLocation = getFolderLocation(home)
    return untarzip({
      filePath,
      destDir: folderLocation,
      label: 'Continue configs',
    })
  },
} satisfies Config
