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