import { path } from 'zx'
import { Config } from '../types/configs.d.ts'

const FILE_NAME = 'ZeroOmegaOptions.bak'

export default {
  name: FILE_NAME,
  getFilePath: ({ tmp }) => path.join(tmp, FILE_NAME),
} satisfies Config
