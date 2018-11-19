const fs = require('fs')


exports.readFileAsync = function(fpath, encoding){
    console.log('readFileAsync 执行了')
    return new Promise((resolve, reject)=>{
        fs.readFile(fpath,encoding,(err,content)=>{
            if(err){
                console.log('读取文件失败', err)
                reject(err)
            }else{
                console.log('读取文件成功',content)
                resolve(content)
            } 
        })
    })
}

exports.writeFileAsync = function(fpath, encoding){
    return new Promise((resolve, reject)=>{
        fs.writeFile(fpath,encoding,(err)=>{
            if(err)reject(err)
            else resolve()
        })
    })
}

exports.getPostData = function (ctx) {
    return new Promise((resolve, reject) => {
          //获取xml格式的数据
          console.log('type',ctx.request.type)
          if (ctx.request.type === "‌text/xml") {
              console.log(111)
            var data = "";
            ctx.req.on("data", chunk => {
                console.log('data事件',chunk)
                data += chunk
            });
            ctx.req.on("end", () =>{
                console.log('最终的数据',data)
                resolve(data)
            });
          }
          //使用koa-bodyparser获取json格式的数据
          else resolve(ctx.request.body);
        }
    )
  }