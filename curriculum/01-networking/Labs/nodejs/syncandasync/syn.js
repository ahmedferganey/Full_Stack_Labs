// Import the 'fs' module
const fs = require('fs');


console.log("1");
const res = fs.readFileSync("/home/fragello/ME/Github/Full_Stack_Labs/curriculum/01-networking/Labs/out.txt", "utf8");
console.log(res);

console.log("2");