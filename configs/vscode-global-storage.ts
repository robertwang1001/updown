import { os, path } from 'zx'
import { Config } from '../types/configs.d.ts'
import { createTargzipFileName, targzip, untarzip } from '../utils/targzip.ts'

function getFolderLocation(home: string) {
  const dirs = [
    {
      name: 'darwin',
      value: path.join(
        home,
        'Library',
        'Application Support',
        'Code',
        'User',
        'globalStorage',
      ),
    },
    {
      name: 'win32',
      value: path.join(home, 'AppData', 'Code', 'User', 'globalStorage'),
    },
    {
      name: 'linux',
      value: path.join(home, '.config', 'Code', 'User', 'globalStorage'),
    },
  ]
  const platform = os.platform()
  const dir = dirs.find(({ name }) => platform === name)
  if (!dir) throw new Error(`Unsupported platform ${platform}`)

  return dir.value
}

const fileName = 'vscode-global-storage'
const fileNameTz = createTargzipFileName(fileName)

export default {
  name: fileNameTz,
  getFilePath: ({ tmp }) => path.join(tmp, fileNameTz),
  beforeUpload: ({ home, filePath }) => {
    const folderLocation = getFolderLocation(home)

    return targzip({
      srcDir: folderLocation,
      included: ['alefragnani.project-manager/projects.json'],
      filePath,
      label: 'VSCode globalStorage',
    })
  },
  afterSetup: async ({ home, filePath }) => {
    const folderLocation = getFolderLocation(home)
    await untarzip({
      filePath,
      destDir: folderLocation,
      label: 'VSCode globalStorage',
    })
  },
} satisfies Config
