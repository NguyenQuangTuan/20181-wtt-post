module.exports = function parse_object(obj) {
  if (!obj) return obj

  let tmp = Object.assign({}, obj)
  let tmp_keys = Object.keys(tmp)
  tmp_keys.forEach(tmp_key => {
    if (check_json(tmp[tmp_key]))
      tmp[tmp_key] = JSON.parse(tmp[tmp_key])
  })

  return tmp
}

check_json = (text) => {
  if (typeof text !== "string") {
    return false;
  }
  try {
    JSON.parse(text);
    return true;
  }
  catch (error) {
    return false;
  }
}