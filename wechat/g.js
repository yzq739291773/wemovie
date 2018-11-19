const sha1 = require('sha1')
const Wechat = require('./wechat.js')
const xml = require('../utils/xml')

module.exports =function(opts){
    console.log('我是最早执行的')
    let wechat = new Wechat(opts)
    
    return async(ctx,next)=>{
        const token = opts.token
        const signature= ctx.query.signature
        const nonce = ctx.query.nonce
        const timestamp = ctx.query.timestamp
        const echostr = ctx.query.echostr
        const str = [token, timestamp, nonce].sort().join('')
        const sha = sha1(str)
        console.log('微信验证 ')
        if(ctx.method === 'GET'){
            console.log('微信GET验证')
            if(sha === signature){
                console.log('微信验证通过')

              ctx.body=echostr
            }else{
              ctx.body='wrong'
            }
        }else if(ctx.method === 'POST'){
            console.log('微信POST验证')
            if(sha !== signature){
              ctx.body='wrong'
              return false
            }
            let promise = new Promise(function (resolve, reject) {
                let buf = ''
                ctx.req.setEncoding('utf8')
                ctx.req.on('data', (chunk) => {
                    buf += chunk
                })
                ctx.req.on('end', () => {
                    console.log('xml',buf)
                    xml.xmlToJson(buf)
                        .then(resolve)
                        .catch(reject)
                })
            })

            let xmlObj = await promise
            console.log('最后的结果',xmlObj)
            wechat.reply(xmlObj,ctx)
        }
      }
}