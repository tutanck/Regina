/*
utils
*/

exports.soften = (obj) => {
  return obj == null ? {} : obj;
}


exports.hey = (method,params) => {  
  console.log("-> '"+method+"' received :",requestImage(params)); //debug
}

const requestImage = (params)=>{
  let str = "[\n", i=1
  for(param of params){
    str+= param.role.toString+" : "+JSON.stringify(param.val)
    if(i<params.length)
      str+="\n"
    i++
  }
  return str+="\n]"
}
