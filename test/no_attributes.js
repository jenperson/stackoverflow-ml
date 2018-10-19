
var csv = require("fast-csv");
var fs = require("fs");
var stream = fs.createReadStream("android_no_id_yes.csv");
var stream2 = fs.createReadStream("android_q_no_id_no.csv")


var csvStream = csv.createWriteStream({headers: false, quoteColumns:true});
writableStream = fs.createWriteStream("android_no_id_combined.csv");
writableStream.on("finish", function(){
  console.log("DONE!");
});
 
let newString = "ok"
csvStream.pipe(writableStream);
csv.fromStream(stream)
 .on("data", function(data){
  let body = "";
  body += data[0].toLowerCase();
  if (body.length < 1) {
    return;
  }
  let label = "";
  label += data[1];
  let noHTML = removeHTML(body);
  let newRow = [noHTML + " " + newString, label]; 
  csvStream.write(newRow)
})
.on("end", function(){
    csv.fromStream(stream2)
    .on("data", function(data){
      let body = "";
      body += data[0].toLowerCase();
      if (body.length < 1) {
        return;
      }
      let label = "";
      label += data[1];
      let noHTML = removeHTML(body);
      let newRow = [noHTML + " " + newString, label]; 
      csvStream.write(newRow)
    }).on("end", function(){
      csvStream.end();
    })
});




 function removeHTML(body) {
  return body.replace(/<[^>]*>?/g, '');
 }
