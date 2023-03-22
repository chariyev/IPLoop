const ping = require('ping');
exports.ValidateIPaddress = (ipaddress)=>{  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
      return (true)  
    }  

    return (false)  
} 

exports.ping = async  (ipaddress)=>{
    let res = await ping.promise.probe(ipaddress);

        if (res.alive) {
             return res.time;
        }
        return 0;
}