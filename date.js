module.exports.getDate=getDate
function getDate(){
    var today=new Date()
    let options={
        weekday:"long",
        day:"numeric",
        month:"long"
    }
    return  today.toLocaleString("en-US",options);
}
module.exports.getDay=getDay
function getDay(){
    var today=new Date()
    let options={
        weekday:"long",
  
    }
    return today.toLocaleString("en-US",options);
    
}
