import { os, path } from 'zx'
import { Config } from '../types/configs.d.ts'
import { createTargzipFileName, targzip, untarzip } from '../utils/targzip.ts'

function getFolderLocation(home: string) {
  const vsCodeUserDirs = [
    {
      name: 'darwin',
      value: path.join(
        home,
        'Library',
        'Application Support',
        'Code',
        'User',
      ),
    },
    { name: 'win32', value: path.join(home, 'AppData', 'Code', 'User') },
    { name: 'linux', value: path.join(home, '.config', 'Code', 'User') },
  ]
  const platform = os.platform()
  const vsCodeUserDir = vsCodeUserDirs.find(({ name }) => platform === name)
  if (!vsCodeUserDir) throw new Error(`Unsupported platform ${platform}`)

  return vsCodeUserDir.value
}

const fileName = 'vscode-settings'
const fileNameTz = createTargzipFileName(fileName)

export default {
  name: fileNameTz,
  getFilePath: ({ tmp }) => path.join(tmp, fileNameTz),
  beforeUpload: ({ home, filePath }) => {
    const folderLocation = getFolderLocation(home)

    return targzip({
      srcDir: folderLocation,
      included: ['settings.json', 'keybindings.json', 'tasks.json'],
      filePath,
      label: 'VSCode settings',
    })
  },
  afterSetup: ({ home, filePath }) => {
    const folderLocation = getFolderLocation(home)
    return untarzip({
      filePath,
      destDir: folderLocation,
      label: 'VSCode settings',
    })
  },
} satisfies Config
