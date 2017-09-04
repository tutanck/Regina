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

//Server side timestamp is much more reliable
exports.timestamp = (docs) => {
  let date = new Date()
  if(Array.isArray(docs)) //docs is an array
    for(doc of docs)
      doc._date = date
  else //docs is an object
    docs._date = date
}