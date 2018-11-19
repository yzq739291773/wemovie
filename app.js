const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const path = require('path')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const wechat = require('./wechat/g')
const Wechat = require('./wechat/wechat.js')
const tools = require('./utils/tools')
const wechat_file = path.join(__dirname,'./utils/wechat.txt')
const config = {
  wechat:{
    appID:'wx632e7f7cd8a54180',
    appSecret:'cD2DiTgD6T4MgeUFYc3h8RTHRb73bZ5FFQ8nxQ7jwn6',
    token:'yuzhiqiang',
    getAccessToken:()=>{
      console.log('getAccessToken执行了')
      return tools.readFileAsync(wechat_file)
    },
    saveAccessToken:(data)=>{
      data = JSON.stringify(data)
      return tools.writeFileAsync(wechat_file,data)
    }
  }
}

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// new Wechat(config.wechat)

// 微信加密认证逻辑中间件
app.use(wechat(config.wechat))
// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
