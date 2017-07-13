export default (len, bits) => {
  bits = bits || 36
  let outStr = ''
  let newStr
  while (outStr.length < len) {
    newStr = Math.random().toString(bits).slice(2)
    outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)))
  }
  return outStr.toUpperCase()
}

/**
 * examples:
 * randomString(12, 16); // 12 hexadecimal characters
 * randomString(200); // 200 alphanumeric characters
 */
