const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const sha1 = require('sha1')
const config = {
  wechat:{
    appID:'wx632e7f7cd8a54180',
    appSecret:'cD2DiTgD6T4MgeUFYc3h8RTHRb73bZ5FFQ8nxQ7jwn6',
    token:'yuzhiqiang'
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
app.use(async(ctx,next)=>{
  const token = config.wechat.token
  const signature= ctx.query.signature
  const nonce = ctx.query.nonce
  const timestamp = ctx.query.timestamp
  const echostr = ctx.query.echostr
  const str = [token, timestamp, nonce].sort().join('')
  const sha = sha1(str)
  if(sha === signature){
    ctx.body=echostr
  }else{
    ctx.body='wrong'
  }
})
// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
