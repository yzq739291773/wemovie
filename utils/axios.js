const axios = require('axios') 
const instance = axios.create({
    // baseURl:`http://${process.env.HOST||'localhost'}:${process.env.PORT||3000}`,
    timeout:5000,
    headers:{

    }
})

module.exports =  instance