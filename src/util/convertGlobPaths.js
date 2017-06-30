import glob from 'glob'

export default (globs) => {
  return globs.reduce((acc, globString) => {
    let globFiles = glob.sync(globString)
    return acc.concat(globFiles)
  }, [])
}
