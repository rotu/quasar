
import { existsSync } from 'node:fs'
import { normalize, resolve, join, sep } from 'node:path'

import { fatal } from './helpers/logger.js'

const quasarConfigFilenameList = [
  { name: 'quasar.config.js', quasarConfigFileFormat: 'module' },
  { name: 'quasar.config.mjs', quasarConfigFileFormat: 'module' },
  { name: 'quasar.config.ts', quasarConfigFileFormat: 'ts' },
  { name: 'quasar.config.cjs', quasarConfigFileFormat: 'cjs' }
]

function getAppInfo () {
  let appDir = process.cwd()

  while (appDir.length && appDir[ appDir.length - 1 ] !== sep) {
    for (const { name, quasarConfigFileFormat } of quasarConfigFilenameList) {
      const quasarConfigFilename = join(appDir, name)
      if (existsSync(quasarConfigFilename)) {
        return { appDir, quasarConfigFilename, quasarConfigFileFormat }
      }
    }

    appDir = normalize(join(appDir, '..'))
  }

  fatal('Error. This command must be executed inside a Quasar project folder.')
}

const postcssConfigFilenameList = [
  'postcss.config.js',
  'postcss.config.mjs',
  'postcss.config.cjs',
  '.postcssrc.js',
  '.postcssrc.cjs',
  '.postcssrc.mjs'
]

function getPostcssConfigFile (appDir) {
  for (const name of postcssConfigFilenameList) {
    const filename = join(appDir, name)
    if (existsSync(filename)) {
      return filename
    }
  }
}

const babelConfigFilenameList = [
  'babel.config.js',
  'babel.config.mjs',
  'babel.config.cjs',
  '.babelrc.js',
  '.babelrc.mjs',
  '.babelrc.cjs',
  '.babelrc'
]

function getBabelConfigFile (appDir) {
  for (const name of babelConfigFilenameList) {
    const filename = join(appDir, name)
    if (existsSync(filename)) {
      return filename
    }
  }
}

const { appDir, quasarConfigFilename, quasarConfigFileFormat } = getAppInfo()

const cliDir = new URL('..', import.meta.url).pathname
const srcDir = resolve(appDir, 'src')
const pwaDir = resolve(appDir, 'src-pwa')
const ssrDir = resolve(appDir, 'src-ssr')
const cordovaDir = resolve(appDir, 'src-cordova')
const capacitorDir = resolve(appDir, 'src-capacitor')
const electronDir = resolve(appDir, 'src-electron')
const bexDir = resolve(appDir, 'src-bex')

export default {
  cliDir,
  appDir,
  srcDir,
  pwaDir,
  ssrDir,
  cordovaDir,
  capacitorDir,
  electronDir,
  bexDir,

  quasarConfigFilename,
  quasarConfigFileFormat,

  postcssConfigFilename: getPostcssConfigFile(appDir),
  babelConfigFilename: getBabelConfigFile(appDir),

  resolve: {
    cli: dir => join(cliDir, dir),
    app: dir => join(appDir, dir),
    src: dir => join(srcDir, dir),
    pwa: dir => join(pwaDir, dir),
    ssr: dir => join(ssrDir, dir),
    cordova: dir => join(cordovaDir, dir),
    capacitor: dir => join(capacitorDir, dir),
    electron: dir => join(electronDir, dir),
    bex: dir => join(bexDir, dir)
  }
}
