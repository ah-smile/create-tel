const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
mongoose.connect('mongodb://admin:Smile233@120.79.53.95/tel-db?authSource=admin', {
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
const buf = fs.readFileSync(path.join(__dirname, 'phone.dat'))
const opMap = [
  '异常',
  '移动', // 1
  '联通', // 2
  '电信', // 3
  '电信虚拟运营商', // 4
  '联通虚拟运营商', // 5
  '移动虚拟运营商', // 6
]
//归属地 偏移地址（末尾）
const indexOffset = buf.readInt32LE(4)

function getPhoneInfo () {
  //号码个数
  const size = (buf.length - indexOffset) / 9
  let numbers = []
  let phone, infoOffset, contentBuf, phoneType, area
  console.log(size) //phone.dat 中数据总数为 447893
  //存入mongo数据库 分批存入 一次大概20W条
  for (let i = 200000; i < size; i++) {
    //号码
    phone = buf.readInt32LE(indexOffset + i * 9)
    //对应号码归属地偏移量
    infoOffset = buf.readInt32LE(indexOffset + i * 9 + 4)
    // 对应号码的归属地
    contentBuf = buf.slice(infoOffset, infoOffset + 50)
    area = contentBuf.toString().split('\0')[0].split('|')
    // 类型 opMap中的下标索引
    phoneType = buf.readInt8(indexOffset + i * 9 + 8)
    numbers.push({
      phone,
      op: opMap[phoneType],
      province: area[0],
      city: area[1],
      zipCode: area[2],
      areaCode: area[3],
    })
  }
  //存入mongo
  Area.insertMany(numbers).then(res => {
   console.log(res)
   })
}

function getAreaList () {
  let area = buf.toString('utf-8', 0, indexOffset)
  let areaList = area.split('\0')
  let res = areaList.slice(2, -1)
  let addr, addrObj = {}
  res.forEach(item => {
    addr = item.split('|')
    addr[0] = addr[0].trim()
    addr[1] = addr[1].trim()
    if (!addrObj.hasOwnProperty(addr[0])) {
      addrObj[addr[0]] = []
    }
    addrObj[addr[0]].push(addr[1])
  })
  let areaArr = []
  for (const item in addrObj) {
    console.log(item)
    areaArr.push({province: item, city: addrObj[item]})
  }
  console.log(areaArr)
}

//存入
// getAreaList()
getPhoneInfo()
