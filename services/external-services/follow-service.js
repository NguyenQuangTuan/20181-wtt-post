const unirest = require('unirest')
const root_url = require('../../config/config').root_url.api

module.exports = {
  get_list_followme: (token, callback) => {
    let url = `${root_url}/follows/followme`
    let req = unirest.get(url)
      .headers({ 'Authorization': token })

    console.info('Calling ' + url)
    req.end(res => {
      if(res.error) return callback(res.body)
      else return callback(null, res.body.user_ids)
    })
  }
}