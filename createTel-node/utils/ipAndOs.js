const http = require('http')
const iconv = require('iconv-lite')
const BufferHelper = require('bufferhelper')
const logger = require('./logger')
module.exports = function loggerIpAddr (req) {
  //获取IP 及操作系统
  let ua = {
    window: /windows/i,
    mac: /macintosh/i,
    android: /android/i,
  }
  let os = 'other'
  for (let index in ua) {
    let flag = ua[index].test(req.header('user-agent'))
    if (flag) {
      os = index
      break
    }
  }
  let ip = req.ips[0]
  let url = require('url').parse(`http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`)
  http.get(url, function (res) {
    let bufferHelper = new BufferHelper()
    res.on('data', function (chunk) {
      bufferHelper.concat(chunk)
    })
    res.on('end', function () {
      let resultJson = iconv.decode(bufferHelper.toBuffer(), 'GBK')
      let addr = JSON.parse(resultJson).addr
      logger.newInfo(`用户IP:${ip} 地址为:${addr} 用户系统:${os} `)
    })
  })
}

