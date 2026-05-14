import { os, path } from 'zx'

export const ROOT = path.join(os.homedir(), '.updown')
export const TMP_PATH = path.join(ROOT, 'tmp')
export const BACKUP_PATH = path.join(TMP_PATH, '__backups__')
export const DOWNLOADED_PATH = path.join(TMP_PATH, '__downloaded__')

export const GIST_ID_FILE = path.join(ROOT, 'gist-id')
export const GITHUB_TOKEN_FILE = path.join(ROOT, '.github-token')
export const CHECKSUMS_FILE = path.join(ROOT, 'checksums.json')

export const ENV_SCHEME = {
  UPDOWN_UPLOAD_FORCE: Boolean,
  UPDOWN_INTERACTIVE: Boolean,
  UPDOWN_GIST_ID: String,
  UPDOWN_RESET_TOKEN: Boolean,
  UPDOWN_QUIET: Boolean,
  UPDOWN_NOTIFY: Boolean,
} as const
