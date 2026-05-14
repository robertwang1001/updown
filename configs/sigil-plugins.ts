import { os, path } from 'zx'
import { Config } from '../types/configs.d.ts'
import { createTargzipFileName, targzip, untarzip } from '../utils/targzip.ts'

function getFolderLocation(home: string) {
  const folderLocations = [
    {
      name: 'darwin',
      value: path.join(
        home,
        'Library',
        'Application Support',
        'sigil-ebook',
        'sigil',
      ),
    },
    {
      name: 'win32',
      value: path.join(home, 'AppData', 'Roaming', 'sigil-ebook', 'sigil'),
    },
    {
      name: 'linux',
      value: path.join(home, '.config', 'sigil-ebook', 'sigil'),
    },
  ]

  const platform = os.platform()
  const folderLocation = folderLocations.find(({ name }) => platform === name)
  if (!folderLocation) throw new Error(`Unsupported platform ${platform}`)

  return folderLocation.value
}

const fileName = 'sigil-plugins'
const fileNameTz = createTargzipFileName(fileName)

export default {
  name: fileNameTz,
  getFilePath: ({ tmp }) => path.join(tmp, fileNameTz),
  beforeUpload({ home, filePath }) {
    const folderLocation = getFolderLocation(home)
    return targzip({
      srcDir: folderLocation,
      included: ['plugins', 'plugins_prefs', 'README.md'],
      filePath,
      label: 'Sigil plugins',
    })
  },
  afterSetup: ({ home, filePath }) => {
    const folderLocation = getFolderLocation(home)
    return untarzip({
      filePath,
      destDir: folderLocation,
      label: 'Sigil plugins',
    })
  },
} satisfies Config
