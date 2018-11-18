const sha1 = require('sha1')
const axios = require('../utils/axios')

const prefix = 'https://api.weixin.qq.com/cgi-bin/token'
const api = {
    access_token:`${prefix}?grant_type=client_credential`
}

function Wechat(opts){
    let that = this
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken

    this.getAccessToken()
        .then((data)=>{
            try {
                data = JSON.stringify(data)
                console.log('读取token成功',data)
            } catch (error) {
                console.log('读取token失败',error)
                return that.updateAccessToken()
            }
            if(that.isValidAccessToken(data)){
                Promise.resolve(data)
            }else{
                console.log('更新token1')
                return that.updateAccessToken()
            }
            console.log(1)
        })
        .then((data)=>{
            console.log('跟新后的token',data)
            that.access_token = data.access_token
            that.expires_in = data.expires_in

            that.saveAccessToken(data)
        })
}

Wechat.prototype.isValidAccessToken = (data)=>{
    console.log('验证token是否可用')
    if(!data || !data.access_token || !data.expires_in){
        console.log('token为空')
        return false
    }
    let access_token = data.access_token
    let expires_in = data.expires_in
    let now = (new Date().getTime())

    if(now < expires_in){
        console.log('token可用')
        return true
    }else{
        console.log('token不可用')
        return false
    }
    console.log('验证tokenD 最后')
}

Wechat.prototype.updateAccessToken = ()=>{
    console.log('更新token2',this)
    // const appID = this.appID
    const appID = 'wx632e7f7cd8a54180'
    console.log('appID',appID)
    // const appSecret = this.appSecret
    const appSecret = '3c796f4585b32c5c403326abbea6f805'
    console.log('appSecret',appSecret)
    const url = api.access_token + '&appid='+appID +'&secret='+appSecret
    console.log('url',url)
    return new Promise((resolve, reject)=>{
        axios.get(url)
            .then(response=>{
                let data = response.data
                console.log('更新token的response',data)
                if(data&& data.access_token){
                    let now = (new Date().getTime())
                    let expires_in = now + (data.expires_in - 20)*1000
                    data.expires_in = expires_in
                    // console.log('更新token的结果',data)
                    resolve(data)
                }else{
                    console.log('结果失败')
                    reject(data)
                }
                
            })
            .catch(err=>{
                console.log('错误',err)
                reject(err)
            })
    })

}

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
        if(sha === signature){
            console.log('微信验证通过')
       
          ctx.body=echostr
        }else{
          ctx.body='wrong'
        }
      }
}