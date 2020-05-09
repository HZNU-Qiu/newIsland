const request = require('request')
const iconv = require('iconv-lite')

class RequestHelper {
  static POST(url, form, headers, charset = 'utf-8') {
    var options = {
      method: 'POST',
      url: url,
      body: form,
      json: true,
      headers: headers || null
    };
    return new Promise((resolve, reject) => {
      request(options)
        .on('error', (err) => {
          reject(err);
        })
        .pipe(iconv.decodeStream(charset)).collect((err, body) => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            resolve(body);
          }
        });
    })
  }
}



module.exports = RequestHelper;