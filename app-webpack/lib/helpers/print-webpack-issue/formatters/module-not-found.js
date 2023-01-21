
import { bold, underline, yellow } from 'kolorist'

import { removeFileLoaders } from '../utils.js'
import { nodePackager } from '../../node-packager.js'

const depRE = /Can't resolve '(.*)' in/
const relativeRE = /^(\.\/|\.\.\/)/
const cmd = nodePackager.name === 'yarn'
  ? 'yarn add'
  : 'npm install --save'

export default function format (error, printLog, titleFn) {
  printLog(titleFn(removeFileLoaders(error.file)))
  printLog()

  const depMatch = error.message.match(depRE)

  if (depMatch === null) {
    printLog(error.message.replace('Module not found: Error: ', ''))
    return
  }

  const dependency = depMatch[1]

  printLog(`Module not found: Can't resolve imported dependency "${bold(underline(yellow(dependency)))}"`)

  if (relativeRE.test(dependency) === false) {
    printLog(`Did you forget to install it? You can run: ${bold(`${cmd} ${dependency}`)}`)
  }
}