const path = require('path')
const tools = require('../utils/tools')
const accessToken = path.join(__dirname,'../utils/token.txt')

const config = {
    wechat:{
      appID:'wx7867206a203b6b1b',
      appSecret:'59e3e6b21a215b26dee7075e6b6bc444',
      token:'yuzhiqiang',
      getAccessToken:()=>{
        console.log('getAccessToken执行了')
        return tools.readFileAsync(accessToken)
      },
      saveAccessToken:(data)=>{
        data = JSON.stringify(data)
        return tools.writeFileAsync(accessToken,data)
      }
    }
  }

  module.exports = config