interface CommonOptions {
  /**
   * Updown root directory
   */
  root: string
  /**
   * Updown tmp directory
   */
  tmp: string
  /**
   * OS home directory
   */
  home: string
  /**
   * Interaction mode. If function logic contains interactions (prompt, read, confirm, etc.),
   * this option ***must*** be used as the condition to be compatible with
   * the occasions of no user interaction.
   */
  interactive: boolean
}

interface GetFilePathOptions extends CommonOptions {
  //
}

type GetFilePath = (options: GetFilePathOptions) => Promise<string> | string

interface BeforeUploadOptions extends CommonOptions {
  /**
   * The local file path
   */
  filePath: string
}

interface AfterSetupOptions extends CommonOptions {
  /**
   * The local file path
   */
  filePath: string
}

interface HintFnOptions extends CommonOptions {
  /**
   * The local file path
   */
  filePath: string
}

export interface Config {
  /**
   * Unique file name in gist
   */
  name: string
  /**
   * Get the local file path
   */
  getFilePath: GetFilePath
  /**
   * Hook: before upload.
   * Return `false` to skip upload
   */
  beforeUpload?: (options: BeforeUploadOptions) => Promise<boolean> | boolean
  /**
   * Hook: after setup for finishing download
   */
  afterSetup?: (options: AfterSetupOptions) => Promise<void> | void
  /**
   * Show a hint after finishing download
   */
  hint?: string | ((options: HintFnOptions) => Promise<string> | string)
  /**
   * Stop upload of this config temporarily
   */
  suspendedUpload?: boolean
}

export type Configs = Config[]

/**
 * { name: checksum }
 */
type Checksums = Record<string, string>
