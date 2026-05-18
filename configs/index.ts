import { Configs } from '../types/configs.d.ts'
import brewfile from './brewfile.ts'
import clashVergeRevConfig from './clash-verge-rev-config.ts'
import gitconfig from './gitconfig.ts'
import iterm2 from './iterm2.ts'
import kiloSettings from './kilo-settings.ts'
import npmrc from './npmrc.ts'
import nvim from './nvim.ts'
import pnpmGlobalPkgJson from './pnpm-global-pkg-json.ts'
import raycast from './raycast.ts'
import sigilPlugins from './sigil-plugins.ts'
import tabbyConfig from './tabby-config.ts'
import vimrc from './vimrc.ts'
import vscodeExt from './vscode-ext.ts'
import vscodeGlobalStorage from './vscode-global-storage.ts'
import vscodeSettings from './vscode-settings.ts'
import zeroOmegaOptions from './zero-omega-options.ts'
import zshrc from './zshrc.ts'

const configs: Configs = [
  brewfile,
  vimrc,
  zshrc,
  tabbyConfig,
  raycast,
  npmrc,
  clashVergeRevConfig,
  gitconfig,
  pnpmGlobalPkgJson,
  nvim,
  zeroOmegaOptions,
  vscodeSettings,
  vscodeExt,
  sigilPlugins,
  iterm2,
  kiloSettings,
  vscodeGlobalStorage,
]

export default configs
