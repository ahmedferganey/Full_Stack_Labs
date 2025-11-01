const fs = require('fs');


console.log("1");
fs.readFile("/home/fragello/ME/Github/Full_Stack_Labs/curriculum/01-networking/Labs/out.txt", (err, data)=> console.log(data.toString()))
console.log("2");