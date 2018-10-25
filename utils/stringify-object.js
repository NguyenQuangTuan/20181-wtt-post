module.exports = function (obj) {
  if (!obj) return obj

  let tmp = Object.assign({}, obj)
  let tmp_keys = Object.keys(tmp)
  tmp_keys.forEach(tmp_key => {
    if (typeof tmp[tmp_key] == 'object')
      tmp[tmp_key] = JSON.stringify(tmp[tmp_key])
  })
  
  return tmp
}