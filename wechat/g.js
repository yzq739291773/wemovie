const sha1 = require('sha1')
const Wechat = require('./wechat.js')
const tools = require('../utils/tools')
const getRawBody = require("raw-body");
const xml = require('../utils/xmlTools')

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
            if(xmlObj.MsgType ==='text'){
                console.log('响应数据')
                // let result =xml.jsonToXml(xml.text(xmlObj,'我是聊天机器人')) 
                let result =xml.text(xmlObj,'我是聊天机器人')
                console.log('ksjfkds',result)
                ctx.res.setHeader('Content-Type', 'application/xml')
                
                // let result = `<xml> 
                //     <ToUserName>< ![CDATA[${xmlObj.FromUserName}] ]></ToUserName> 
                //     <FromUserName>< ![CDATA[${xmlObj.ToUserName}] ]></FromUserName> 
                //     <CreateTime>${now}</CreateTime> 
                //     <MsgType>< ![CDATA[text] ]></MsgType> 
                //     <Content>< ![CDATA[我是聊天机器人] ]></Content> 
                // </xml>`
                ctx.res.end(result)
            }
        }
      }
}