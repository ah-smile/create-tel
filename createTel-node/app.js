const express = require('express')
const path = require('path')
const cors = require('cors')
const fs = require('fs')
const mongoose = require('mongoose')
const loggerIpAddr = require('./utils/ipAndOs')
const app = express()
app.use(cors())
mongoose.connect('mongodb://localhost/tel-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
const Area = mongoose.model('area', {
  phone: {type: String, unique: true},
  op: String,
  province: String,
  city: String,
  zipCode: String,
  areaCode: String,
})
// 解析json 和表单
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', express.static(path.join(__dirname + '/public')))
app.get('/download', (req, res) => {
  res.download('./tel/contact.list')
})
app.post('/createTel', (req, res) => {
  // 记录IP和OS
  // loggerIpAddr(req)
  let {num, select, total} = req.body
  if ((select === 0 && total > 10000) || (select === 1 && total > 5000)) return res.send({code: -2, msg: '超出限制'})
  if (num.length && total) {
    createTel(num, select, total)
    res.send({code: 1, msg: '生成成功'})
  } else {
    res.send({code: -1, msg: '传入数据不正确'})
  }
})
app.post('/newCreateTel', async (req, res) => {
  // 记录IP和OS
  // loggerIpAddr(req)
  let {province, city, total} = req.body
  if (province && city && total) {
    if (total > 10000) return res.send({code: -2, msg: '超出限制'})
    const result = await Area.find({province, city})
    let numArr = result.map(item => item.phone)
    newCreateTel(numArr, total)
    res.send({code: 0, msg: '生成成功'})
  } else {
    res.send({code: -1, msg: '传入数据不正确'})
  }
})

function newCreateTel (numArr, total) {
  let length = numArr.length
  let content = ''
  for (let i = 0; i < total; i++) {
    let randomIndex = Math.floor(Math.random() * length)
    let randomNum = Math.floor(Math.random() * 10000)
    content += '森林:' + numArr[randomIndex] + randomNum.toString().padStart(4, '0') + '\n'
  }
  fs.writeFileSync('./tel/contact.list', content)
}

function createTel (num, select, total) {
  let content = ''
  let length = num.length
  if (select === 1) {
    let mySet = new Set()
    while (1) {
      mySet.add(Math.floor(Math.random() * 10000))
      if (mySet.size >= total) break
    }
    if (length === 1) {
      mySet.forEach(item => {
        content += '森林:' + num[0] + item.toString().padStart(4, '0') + '\n'
      })
    } else {
      mySet.forEach(item => {
        content += '森林:' + num[Math.floor(Math.random() * length)] + item.toString().padStart(4, '0') + '\n'
      })
    }
  }
  if (select === 0) {
    if (length === 1) {
      for (let i = 0; i < total; i++) {
        content += '森林:' + num[0] + i.toString().padStart(4, '0') + '\n'
      }
    } else {
      for (let i = 0; i < total; i++) {
        content += '森林:' + num[Math.floor(Math.random() * length)] + i.toString().padStart(4, '0') + '\n'
      }
    }
  }
  fs.writeFileSync('./tel/contact.list', content)
}

app.listen(2333, () => {
  console.log('服务启动了！！！')
})
