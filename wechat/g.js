const sha1 = require('sha1')

module.exports =function(opts){
    return async(ctx,next)=>{
        const token = opts.token
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
      }
}