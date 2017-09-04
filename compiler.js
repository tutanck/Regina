/*
Regina's request compiler : compile the requests before execution
*/

var Role = require('./Role')
var utils = require('./utils')


exports.check = (method,params) => {
  
  utils.hey(method,params)
  
  let status = {
    valid : true,
    error : null
  }
  
  for (const param of params) {
    let isParamValid = false
    let val = param.val
    let typeArray = param.role.type
    let roleStr = param.role.toString
    
    //console.log("compiler»»»",val,typeArray,roleStr); //debug
    
    for (const type of typeArray){
      if(type.valid(val)){
        console.log(type.toString,val,'VALID')//debug
        isParamValid = true
        break;
      }else 
      console.log(type.toString,val,'NOT VALID')//debug
    }
    
    if(!isParamValid){
      status.valid = false
      status.error = {
        "type" : "compilation error",
        "message" : "Invalid request",
        "cause" : compileTypeErrCause(roleStr,typeArray),
        "onMethod" : method
      }
      break;
    }
    
  }
  
  
  console.log('request_status',status)//debug
  return status
}


exports.isValidACK = (ack) => { return Role.ack.type[0].valid(ack) }



compileTypeErrCause = (roleStr,typeArray) => {
  let str = "Parameter '"+roleStr+"' must be of type : ", i = 1;
  for (const type of typeArray){
    str+="'"+type.toString+"' "
    if(typeArray.length < i)
      str+="OR "
    i++
  }
  return str
}
