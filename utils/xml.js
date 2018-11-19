const xml2js = require('xml2js')

function formatMessage(data){
    let  message = {}
    if(typeof data === 'object'){
        let keys = Object.keys(data)
        keys.forEach((item,index,array)=>{
            message[item] = data[item][0]
        })
    }
    return message
}
function xmlToJson(str){
     return new Promise((resolve, reject) => {
        const parseString = xml2js.parseString
        parseString(str, (err, result) => {
            if (err) {
                reject(err)
            } else {
                let res = formatMessage(result.xml)
                console.log('demo',res)
                resolve(res)
            }
        })
     })
}

function jsonToXml(obj) {
    const builder = new xml2js.Builder()
    return builder.buildObject(obj)
}
function text(msg, content){
    return jsonToXml({
        xml: {
            ToUserName: msg.FromUserName,
            FromUserName: msg.ToUserName,
            CreateTime: Date.now(),
            MsgType: msg.MsgType,
            Content: content
        }
    })
}

module.exports = {
    xmlToJson,
    jsonToXml,
    text
}