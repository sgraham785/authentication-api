export default (tests) => {
  return tests.map(test => {
    let importTest = require(test)
    return importTest
  })
}
