const fetch = require('node-fetch')
const FormData = require('form-data')
const { fromBuffer } = require('file-type')

/**
 ⚙️ Fitur TOURL Recode By @BenkzjiiNotDev
 ⚙️ Upload Epheremal File To File.io
 ⚙️ Expired 1 Day
 ⚙️ 100MegaByte Max Size
 */
const fileIO = async buffer => {
  const { ext } = await fromBuffer(buffer) || {}
  let form = new FormData
  form.append('file', buffer, 'tmp.' + ext)
  let res = await fetch('https://file.io/?expires=1d', { // 1 Day Expiry Date
    method: 'POST',
    body: form
  })
  let json = await res.json()
  if (!json.success) throw json
  return json.link
}

/**
 * Upload file to storage.restfulapi.my.id
 * @param {Buffer|ReadableStream|(Buffer|ReadableStream)[]} inp File Buffer/Stream or Array of them
 * @returns {string|null|(string|null)[]}
 */
const RESTfulAPI = async inp => {
  let form = new FormData
  let buffers = inp
  if (!Array.isArray(inp)) buffers = [inp]
  for (let buffer of buffers) {
    form.append('file', buffer)
  }
  let res = await fetch('https://storage.restfulapi.my.id/upload', {
    method: 'POST',
    body: form
  })
  let json = await res.text()
  try {
    json = JSON.parse(json)
    if (!Array.isArray(inp)) return json.files[0].url
    return json.files.map(res => res.url)
  } catch (e) {
    throw json
  }
}

module.exports = async function (inp) {
  let err = false
  for (let upload of [RESTfulAPI, fileIO]) {
    try {
      return await upload(inp)
    } catch (e) {
      err = e
    }
  }
  if (err) throw err
}