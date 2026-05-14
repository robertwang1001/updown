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

type BeforeUpload = (options: BeforeUploadOptions) => Promise<void> | void
type AfterSetup = (options: AfterSetupOptions) => Promise<void> | void
type HintFn = (options: HintFnOptions) => Promise<string> | string

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
   * Hook: before upload
   */
  beforeUpload?: BeforeUpload
  /**
   * Hook: after setup for finishing download
   */
  afterSetup?: AfterSetup
  /**
   * Show a hint after finishing download
   */
  hint?: string | HintFn
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
